Shader "VRCPlayerTagMarker/TagMarker"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Cutout ("Cutout Threshold", Range(0, 1)) = 0.5
        _DisabledColor ("Disabled Color (for fixed | a=1 -> multiply | a<1 -> alphablend)", Color) = (0.5, 0.5, 0.5, 1)
        [Header(Tag Data Setting)][Space]
        _TagDataColCount ("Tag Data Column Count (max 16)", Int) = 1
        _TagDataRowCount ("Tag Data Row Count (max 32)", Int) = 8
        [KeywordEnum(L8x32, L16x16, L16x32)] _TAG_LAYOUT ("Tag Max Grid Size", Int) = 0
        [Header(Tag Show Setting)][Space]
        [Toggle(VR_BILLBOARD_ENABLE_BILLBOARD)] _Billboard ("Billboard shader", Float) = 1
        [KeywordEnum(FIXED, ALIGN_ROW, ALIGN_COL)] _DISPLAY ("Display mode", Int) = 1
    }
    SubShader
    {
        Tags { "RenderType"="TransparentCutout" "Queue"="AlphaTest" "VRCFallback"="Hidden" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma multi_compile_local _DISPLAY_FIXED _DISPLAY_ALIGN_ROW _DISPLAY_ALIGN_COL
            #pragma multi_compile_local _ VR_BILLBOARD_ENABLE_BILLBOARD
            #pragma target 3.5
            #pragma shader_feature_local _TAG_LAYOUT_L8X32 _TAG_LAYOUT_L16X16 _TAG_LAYOUT_L16X32

            #pragma fragment frag

            #include "UnityCG.cginc"
            
            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _Cutout;
            float4 _DisabledColor;
            int _TagDataColCount;
            int _TagDataRowCount;
            int _DISPLAY;
            // int _TagShowColCount;
            // int _TagShowRowCount;

            UNITY_INSTANCING_BUFFER_START(Props)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_0)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_1)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_2)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_3)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_4)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_5)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_6)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_7)
                #if defined(_TAG_LAYOUT_L16X16) || defined(_TAG_LAYOUT_L16X32)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_8)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_9)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_10)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_11)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_12)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_13)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_14)
                UNITY_DEFINE_INSTANCED_PROP(uint, _TagFlags_15)
                #endif
            UNITY_INSTANCING_BUFFER_END(Props)

            uint getTagFlags(int col) {
                switch(col) {
                    case 0: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_0);
                    case 1: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_1);
                    case 2: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_2);
                    case 3: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_3);
                    case 4: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_4);
                    case 5: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_5);
                    case 6: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_6);
                    case 7: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_7);
                    #if defined(_TAG_LAYOUT_L16X16) || defined(_TAG_LAYOUT_L16X32)
                    case 8: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_8);
                    case 9: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_9);
                    case 10: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_10);
                    case 11: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_11);
                    case 12: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_12);
                    case 13: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_13);
                    case 14: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_14);
                    case 15: return UNITY_ACCESS_INSTANCED_PROP(Props, _TagFlags_15);
                    #endif
                    default: return 0;
                }
            }

            #define VR_BILLBOARD_DISABLE_BILLBOARD
            #include "./VRBillboard.cginc"

            #if defined(_TAG_LAYOUT_L16X32)
                #define MAX_COL 16
                #define MAX_ROW 32
            #elif defined(_TAG_LAYOUT_L16X16)
                #define MAX_COL 16
                #define MAX_ROW 16
            #else // _TAG_LAYOUT_L8X32 (default)
                #define MAX_COL 8
                #define MAX_ROW 32
            #endif

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(i);

                #if _DISPLAY_FIXED
                    int col = floor(i.uv.x * _TagDataColCount);
                    int row = floor((1 - i.uv.y) * _TagDataRowCount);
                    uint flags = getTagFlags(col);
                    bool isOn = (flags >> row) & 1u;
                    fixed4 color = tex2D(_MainTex, i.uv);
                    clip(color.a - _Cutout);
                    color = lerp(lerp(color * _DisabledColor, float4(_DisabledColor.rgb * _DisabledColor.a + color.rgb * (1 - _DisabledColor.a), color.a), _DisabledColor.a < 1), color, isOn);
                #else
                    // cache all flag values upfront to avoid repeated switch evaluation
                    uint cachedFlags[MAX_COL];
                    for (int ci = 0; ci < MAX_COL; ci++) {
                        cachedFlags[ci] = getTagFlags(ci);
                    }

                    int subAxisMaxActiveSlotCount = 0;
                    int mainAxisActiveSlotCount = 0;
                    #if _DISPLAY_ALIGN_ROW
                        // main axis = col
                        int activeSlotCountBySubAxis[MAX_COL];
                        int mainAxisBySlot[MAX_COL];
                        [unroll] for (int initIdx = 0; initIdx < MAX_COL; initIdx++) {
                            activeSlotCountBySubAxis[initIdx] = 0;
                            mainAxisBySlot[initIdx] = 0;
                        }

                        // DETECT SLOTS

                        // row first
                        for (int col = 0; col < MAX_COL; col++) {
                            uint bits = cachedFlags[col];
                            int count = countbits(bits);
                            activeSlotCountBySubAxis[mainAxisActiveSlotCount] = count;
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, count);
                            mainAxisBySlot[mainAxisActiveSlotCount] = col;
                            mainAxisActiveSlotCount += bits != 0;
                        }
                        // col (align center)
                        int mainAxisSlot = floor(i.uv.x * _TagDataColCount - (_TagDataColCount - mainAxisActiveSlotCount) / 2.0);
                        // row (items is align top & all region is align bottom)
                        int subAxisSlot = floor((1 - i.uv.y) * _TagDataRowCount - (_TagDataRowCount - subAxisMaxActiveSlotCount));
                        // left of cell pos (0.5 allowed)
                        float currentSlotCol = (_TagDataColCount - mainAxisActiveSlotCount) / 2.0 + mainAxisSlot;
                        // top of cell pos (0.5 allowed)
                        float currentSlotRow = (_TagDataRowCount - subAxisMaxActiveSlotCount) + subAxisSlot;

                        // MAP

                        int currentCol = mainAxisBySlot[max(mainAxisSlot, 0)];
                        int currentRow = 0;
                        int foundRow = 0;
                        uint colBits = cachedFlags[currentCol];
                        for (int row = 0; row < MAX_ROW; row++) {
                            foundRow += (colBits >> row) & 1u;
                            currentRow = lerp(currentRow, row + 1, foundRow == subAxisSlot);
                        }
                    #elif _DISPLAY_ALIGN_COL
                        // main axis = row
                        int activeSlotCountBySubAxis[MAX_ROW];
                        int mainAxisBySlot[MAX_ROW];
                        [unroll] for (int initIdx = 0; initIdx < MAX_ROW; initIdx++) {
                            activeSlotCountBySubAxis[initIdx] = 0;
                            mainAxisBySlot[initIdx] = 0;
                        }

                        // DETECT SLOTS

                        // col first
                        for (int row = 0; row < MAX_ROW; row++) {
                            int count = 0;
                            for (int col = 0; col < MAX_COL; col++) {
                                count += (cachedFlags[col] >> row) & 1u;
                            }
                            activeSlotCountBySubAxis[mainAxisActiveSlotCount] = count;
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, count);
                            mainAxisBySlot[mainAxisActiveSlotCount] = row;
                            mainAxisActiveSlotCount += count != 0;
                        }
                        // row (items is align top & all region is align bottom)
                        int mainAxisSlot = floor((1 - i.uv.y) * _TagDataRowCount - (_TagDataRowCount - mainAxisActiveSlotCount));
                        // col (align center)
                        int subAxisSlot = floor(i.uv.x * _TagDataColCount - (_TagDataColCount - subAxisMaxActiveSlotCount) / 2.0);
                        float currentSlotCol = (_TagDataColCount - subAxisMaxActiveSlotCount) / 2.0 + subAxisSlot;
                        float currentSlotRow = (_TagDataRowCount - mainAxisActiveSlotCount) + mainAxisSlot;

                        // MAP

                        int currentRow = mainAxisBySlot[max(mainAxisSlot, 0)];
                        int currentCol = 0;
                        int foundCol = 0;
                        for (int col = 0; col < MAX_COL; col++) {
                            foundCol += (cachedFlags[col] >> currentRow) & 1u;
                            currentCol = lerp(currentCol, col + 1, foundCol == subAxisSlot);
                        }
                    #endif

                    // UVオフセットがタグ境界で不連続にジャンプするため、tex2Dの自動微分ではミップレベルが誤選択され境界に線が出る
                    // オフセット前の連続なi.uvから微分値を計算しtex2Dgradで明示指定することで回避
                    float2 uvDdx = ddx(i.uv);
                    float2 uvDdy = ddy(i.uv);
                    float2 uv = i.uv + float2(currentCol - currentSlotCol, (currentSlotRow - currentRow)) / float2(_TagDataColCount, _TagDataRowCount);
                    fixed4 color = tex2Dgrad(_MainTex, uv, uvDdx, uvDdy);

                    if (color.a < _Cutout || mainAxisSlot < 0 || subAxisSlot < 0 || mainAxisSlot >= mainAxisActiveSlotCount || subAxisSlot >= activeSlotCountBySubAxis[mainAxisSlot]) {
                        discard;
                    }
                #endif
                
                UNITY_APPLY_FOG(i.fogCoord, color);
                return color;
            }


            ENDCG
        }
    }
}
