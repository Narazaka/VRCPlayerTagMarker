Shader "VRCPlayerTagMarker/TagMarker"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Cutout ("Cutout Threshold", Range(0, 1)) = 0.5
        _DisabledColor ("Disabled Color (for fixed | a=1 -> multiply | a<1 -> alphablend)", Color) = (0.5, 0.5, 0.5, 1)
        [Header(Tag Data Setting)][Space]
        _TagDataColCount ("Tag Data Column Count (max 8)", Int) = 1
        _TagDataRowCount ("Tag Data Row Count (max 32)", Int) = 8
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
            #pragma multi_compile _DISPLAY_FIXED _DISPLAY_ALIGN_ROW _DISPLAY_ALIGN_COL
            #pragma multi_compile _ VR_BILLBOARD_ENABLE_BILLBOARD
            #pragma target 3.5

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
                    default: return 0;
                }
            }

            #define VR_BILLBOARD_DISABLE_BILLBOARD
            #include "./VRBillboard.cginc"

            #define MAX_ROW 32
            #define MAX_COL 8

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_INSTANCE_ID(i);
                
                /*
                uint tagCols[MAX_COL] = {
                    PACK_TAG_COL(0),
                    PACK_TAG_COL(1),
                    PACK_TAG_COL(2),
                    PACK_TAG_COL(3),
                    PACK_TAG_COL(4),
                    PACK_TAG_COL(5),
                    PACK_TAG_COL(6),
                    PACK_TAG_COL(7),
                };

                int activeColCount = 0;
                int activeTagCountByRows[MAX_COL] = { 0, 0, 0, 0, 0, 0, 0, 0 };
                // [unroll]
                for (int col = 0; col < MAX_COL; col++) {
                    uint tagCol = tagCols[col];
                    activeColCount += tagCol != 0;
                    activeTagCountByRows[col] =
                        (tagCol & 0x00000001) != 0 +
                        (tagCol & 0x00000002) != 0 +
                        (tagCol & 0x00000004) != 0 +
                        (tagCol & 0x00000008) != 0 +
                        (tagCol & 0x00000010) != 0 +
                        (tagCol & 0x00000020) != 0 +
                        (tagCol & 0x00000040) != 0 +
                        (tagCol & 0x00000080) != 0 +
                        (tagCol & 0x00000100) != 0 +
                        (tagCol & 0x00000200) != 0 +
                        (tagCol & 0x00000400) != 0 +
                        (tagCol & 0x00000800) != 0 +
                        (tagCol & 0x00001000) != 0 +
                        (tagCol & 0x00002000) != 0 +
                        (tagCol & 0x00004000) != 0 +
                        (tagCol & 0x00008000) != 0 +
                        (tagCol & 0x00010000) != 0 +
                        (tagCol & 0x00020000) != 0 +
                        (tagCol & 0x00040000) != 0 +
                        (tagCol & 0x00080000) != 0 +
                        (tagCol & 0x00100000) != 0 +
                        (tagCol & 0x00200000) != 0 +
                        (tagCol & 0x00400000) != 0 +
                        (tagCol & 0x00800000) != 0 +
                        (tagCol & 0x01000000) != 0 +
                        (tagCol & 0x02000000) != 0 +
                        (tagCol & 0x04000000) != 0 +
                        (tagCol & 0x08000000) != 0 +
                        (tagCol & 0x10000000) != 0 +
                        (tagCol & 0x20000000) != 0 +
                        (tagCol & 0x40000000) != 0 +
                        (tagCol & 0x80000000) != 0;
                }
                */

                bool tagStates[MAX_COL * MAX_ROW] = {
                    TAG_COL_ARRAY(0),
                    TAG_COL_ARRAY(1),
                    TAG_COL_ARRAY(2),
                    TAG_COL_ARRAY(3),
                    TAG_COL_ARRAY(4),
                    TAG_COL_ARRAY(5),
                    TAG_COL_ARRAY(6),
                    TAG_COL_ARRAY(7),
                };
                
                #if _DISPLAY_FIXED
                    int col = floor(i.uv.x * _TagDataColCount);
                    int row = floor((1 - i.uv.y) * _TagDataRowCount);
                    int index = col * MAX_ROW + row;
                    fixed4 color = tex2D(_MainTex, i.uv);
                    clip(color.a - _Cutout);
                    color = lerp(lerp(color * _DisabledColor, float4(_DisabledColor.rgb * _DisabledColor.a + color.rgb * (1 - _DisabledColor.a), color.a), _DisabledColor.a < 1), color, tagStates[index]);
                #else
                    int subAxisMaxActiveSlotCount = 0;
                    int mainAxisActiveSlotCount = 0;
                    int activeSlotCountBySubAxis[MAX_ROW] = { // max(MAX_COL, MAX_ROW)
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                    };
                    int mainAxisBySlot[MAX_ROW] = { // max(MAX_COL, MAX_ROW)
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0,
                    };
                    #if _DISPLAY_ALIGN_ROW
                        // DETECT SLOTS

                        // row first
                        // main axis = col
                        for (int col = 0; col < MAX_COL; col++) {
                            for (int row = 0; row < MAX_ROW; row++) {
                                int index = col * MAX_ROW + row;
                                activeSlotCountBySubAxis[mainAxisActiveSlotCount] += tagStates[index] != 0;
                            }
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, activeSlotCountBySubAxis[mainAxisActiveSlotCount]);
                            mainAxisBySlot[mainAxisActiveSlotCount] = col;
                            mainAxisActiveSlotCount += activeSlotCountBySubAxis[mainAxisActiveSlotCount] != 0;
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
                        /*
                        ex.
                        subAxisSlot = 2 (3rd)
                        tagStatesInCurrentCol = [0, 1, 1, 0, 1*, 0, 0, 1]

                        breakがない状況
                        直前indexまではlerpが変更側に倒れるが、マッチするインデックス以降では無視されるので正しく動く
                    
                        row = 0:
                        foundRow = 0 + 0
                        currentRow = lerp(0, 0 + 1, 0 == 2) => 0
                        row = 1:
                        foundRow = 0 + 1
                        currentRow = lerp(0, 1 + 1, 1 == 2) => 0
                        row = 2:
                        foundRow = 1 + 1
                        currentRow = lerp(0, 2 + 1, 2 == 2) => 3
                        row = 3:
                        foundRow = 2 + 0
                        currentRow = lerp(3, 3 + 1, 2 == 2) => 4
                        row = 4:
                        foundRow = 2 + 1
                        currentRow = lerp(4, 4 + 1, 3 == 2) => 4
                        */
                        int currentRow = 0;
                        int foundRow = 0;
                        for (int row = 0; row < MAX_ROW; row++) {
                            int index = currentCol * MAX_ROW + row;
                            foundRow += tagStates[index] != 0;
                            currentRow = lerp(currentRow, row + 1, foundRow == subAxisSlot);
                        }
                        /*
                        // normal impl
                        int currentRow = 0;
                        int foundRow = -1;
                        for (int row = 0; row < MAX_ROW; row++) {
                            int index = currentCol * MAX_ROW + row;
                            foundRow += tagStates[index] != 0;
                            if (foundRow == subAxisSlot) {
                                currentRow = row;
                                break;
                            }
                        }
                        */
                    #elif _DISPLAY_ALIGN_COL
                        // DETECT SLOTS

                        // col first
                        // main axis = row
                        for (int row = 0; row < MAX_ROW; row++) {
                            for (int col = 0; col < MAX_COL; col++) {
                                int index = col * MAX_ROW + row;
                                activeSlotCountBySubAxis[mainAxisActiveSlotCount] += tagStates[index] != 0;
                            }
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, activeSlotCountBySubAxis[mainAxisActiveSlotCount]);
                            mainAxisBySlot[mainAxisActiveSlotCount] = row;
                            mainAxisActiveSlotCount += activeSlotCountBySubAxis[mainAxisActiveSlotCount] != 0;
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
                            int index = col * MAX_ROW + currentRow;
                            foundCol += tagStates[index] != 0;
                            currentCol = lerp(currentCol, col + 1, foundCol == subAxisSlot);
                        }
                    #endif

                    float2 uv = i.uv + float2(currentCol - currentSlotCol, (currentSlotRow - currentRow)) / float2(_TagDataColCount, _TagDataRowCount);
                    // mipmap有効にすると境界付近に変な線が出るので暫定対処
                    fixed4 color = tex2Dlod(_MainTex, float4(uv, 0, 0));

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
