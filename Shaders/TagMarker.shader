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

            inline int tagCountBits(uint bits) {
                #if defined(SHADER_API_D3D11)
                    return countbits(bits);
                #else
                    // Unity(HLSLcc)のD3D11以外への翻訳(Metal/Vulkan/GLES3すべてで確認)はcountbits結果の
                    // 書き込みをint→float数値変換、読み出しをビット再解釈で行うため値が壊れる
                    // (iOSで全ピクセルdiscardになり非表示になる等)。さらにGLES3出力は bitCount() を
                    // #version 300 es (ES3.1未満)で使う不正なGLSLになり実機コンパイルに失敗し得る。
                    // そのため翻訳を経ないD3D11以外ではcountbitsを使わず、ビット並列(SWAR)ポップカウントで数える。
                    //
                    // 原理: 32bitを小さなブロックに区切り「各ブロックの立っているbit数をそのブロック自身に格納した状態」を作り、
                    // 隣接ブロック同士を足し合わせてブロック幅を 2bit → 4bit → 8bit → 32bit と倍々に広げていく分割統治。
                    // 1回の32bit演算で全ブロックの計算が同時に進む(SIMD Within A Register)。
                    // 最終的に「全32bitを1ブロックとしたbit数の合計」となるため、結果はcountbitsと完全に一致する。
                    //
                    // [1] 2bitブロック化: 2bit値 n = 2*b1 + b0 の立っているbit数は b1 + b0 = n - b1 = n - (n>>1)。
                    //     0x55555555 (2進 0101...) は各2bitブロックの下位bit位置のマスクで、
                    //     (bits >> 1) & 0x55555555 は「各ブロックの上位bit b1 をブロック内下位に降ろした値」。
                    //     つまりこの引き算1回で、16個の全2bitブロックが一斉に「自ブロックのbit数(0～2)」に置き換わる
                    uint c = bits - ((bits >> 1) & 0x55555555u);
                    // [2] 2bit→4bit: 0x33333333 (2進 0011...) は各4bitブロックの下位2bit位置のマスク。
                    //     c と c>>2 をそれぞれマスクしてから足すと、隣接2bitブロック同士の和(最大2+2=4)が各4bitブロックに入る。
                    //     和の最大値4は2bitに収まらないため、先にマスクで4bit幅の空きを確保してから足す必要がある
                    c = (c & 0x33333333u) + ((c >> 2) & 0x33333333u);
                    // [3] 4bit→8bit: 隣接4bitブロック同士の和は最大4+4=8で4bitに収まり、どのブロックからも桁あふれが出ない。
                    //     そのため[2]と違い先に c + (c>>4) を計算してよく、その後 0x0F0F0F0F で
                    //     各8bitブロックの下位4bit(=正しい和)だけ残し、上位4bitに残ったゴミを消す
                    c = (c + (c >> 4)) & 0x0F0F0F0Fu;
                    // [4] 8bit×4個→合計: x * 0x01010101 = x + (x<<8) + (x<<16) + (x<<24) なので、
                    //     積の最上位バイトは「4つの全バイトの和」になる(各バイト最大8・総和最大32 < 256 なので繰り上がり無し)。
                    //     >> 24 でその最上位バイトを取り出したものが、32bit全体の立っているbit数
                    return int((c * 0x01010101u) >> 24);
                #endif
            }

            #if !_DISPLAY_FIXED
                // ALIGN系はフラグを頂点シェーダーで読み、flat(nointerpolation)整数varyingでフラグメントへ渡す。
                // フラグメント内でインスタンスデータ(動的インデックスのUBO構造体配列)を直接読むと、
                // Mali系ドライバ(Pixel 7/Tensor G2で確認)がinstanced変種をミスコンパイルし表示が壊れるため。
                // FIXEDはピクセル依存の動的colでフラグを引く必要がありvarying化の対象外(実機で問題も出ていない)

                // DETECT SLOTS (pass1): スロット総数と最大タグ数の集計。フラグのみで決まり全ピクセルで同一のため、
                // ピクセル毎ではなく頂点シェーダーで計算してvaryingで渡す(特にCOLの行カウントのピクセル毎コスト削減)
                int2 tagCountSlots(uint flags[MAX_COL]) {
                    int mainAxisActiveSlotCount = 0;
                    int subAxisMaxActiveSlotCount = 0;
                    #if _DISPLAY_ALIGN_ROW
                        // main axis = col / row first
                        [unroll] for (int col = 0; col < MAX_COL; col++) {
                            uint bits = flags[col];
                            int count = tagCountBits(bits);
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, count);
                            mainAxisActiveSlotCount += bits != 0;
                        }
                    #elif _DISPLAY_ALIGN_COL
                        // main axis = row / col first
                        [unroll] for (int row = 0; row < MAX_ROW; row++) {
                            int count = 0;
                            [unroll] for (int col = 0; col < MAX_COL; col++) {
                                count += (flags[col] >> row) & 1u;
                            }
                            subAxisMaxActiveSlotCount = max(subAxisMaxActiveSlotCount, count);
                            mainAxisActiveSlotCount += count != 0;
                        }
                    #endif
                    return int2(mainAxisActiveSlotCount, subAxisMaxActiveSlotCount);
                }

                #if defined(_TAG_LAYOUT_L16X16) || defined(_TAG_LAYOUT_L16X32)
                    #define VR_BILLBOARD_EXTRA_V2F \
                        nointerpolation uint4 tagFlags0 : TEXCOORD2; \
                        nointerpolation uint4 tagFlags1 : TEXCOORD3; \
                        nointerpolation uint4 tagFlags2 : TEXCOORD4; \
                        nointerpolation uint4 tagFlags3 : TEXCOORD5; \
                        nointerpolation int2 tagSlotCounts : TEXCOORD6;
                    #define VR_BILLBOARD_VERT_EXTRA(v, o) \
                        { \
                            uint tmFlags[MAX_COL]; \
                            [unroll] for (int tmCol = 0; tmCol < MAX_COL; tmCol++) { tmFlags[tmCol] = getTagFlags(tmCol); } \
                            o.tagFlags0 = uint4(tmFlags[0], tmFlags[1], tmFlags[2], tmFlags[3]); \
                            o.tagFlags1 = uint4(tmFlags[4], tmFlags[5], tmFlags[6], tmFlags[7]); \
                            o.tagFlags2 = uint4(tmFlags[8], tmFlags[9], tmFlags[10], tmFlags[11]); \
                            o.tagFlags3 = uint4(tmFlags[12], tmFlags[13], tmFlags[14], tmFlags[15]); \
                            o.tagSlotCounts = tagCountSlots(tmFlags); \
                        }
                #else
                    #define VR_BILLBOARD_EXTRA_V2F \
                        nointerpolation uint4 tagFlags0 : TEXCOORD2; \
                        nointerpolation uint4 tagFlags1 : TEXCOORD3; \
                        nointerpolation int2 tagSlotCounts : TEXCOORD4;
                    #define VR_BILLBOARD_VERT_EXTRA(v, o) \
                        { \
                            uint tmFlags[MAX_COL]; \
                            [unroll] for (int tmCol = 0; tmCol < MAX_COL; tmCol++) { tmFlags[tmCol] = getTagFlags(tmCol); } \
                            o.tagFlags0 = uint4(tmFlags[0], tmFlags[1], tmFlags[2], tmFlags[3]); \
                            o.tagFlags1 = uint4(tmFlags[4], tmFlags[5], tmFlags[6], tmFlags[7]); \
                            o.tagSlotCounts = tagCountSlots(tmFlags); \
                        }
                #endif
            #endif

            #define VR_BILLBOARD_DISABLE_BILLBOARD
            #include "./VRBillboard.cginc"

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
                    // フラグは頂点シェーダーが読んだflat varyingから受け取る(VR_BILLBOARD_VERT_EXTRA参照)。
                    // フラグメントでのインスタンスデータ直接読みはMali系ドライバのミスコンパイルを踏むため行わない。
                    // cachedFlagsは必ず定数インデックスでのみ参照すること。
                    // 動的インデックスが1箇所でもあるとレジスタに昇格できずメモリ配列(モバイルGPUではスクラッチへスピル)になる
                    uint cachedFlags[MAX_COL];
                    cachedFlags[0] = i.tagFlags0.x;
                    cachedFlags[1] = i.tagFlags0.y;
                    cachedFlags[2] = i.tagFlags0.z;
                    cachedFlags[3] = i.tagFlags0.w;
                    cachedFlags[4] = i.tagFlags1.x;
                    cachedFlags[5] = i.tagFlags1.y;
                    cachedFlags[6] = i.tagFlags1.z;
                    cachedFlags[7] = i.tagFlags1.w;
                    #if defined(_TAG_LAYOUT_L16X16) || defined(_TAG_LAYOUT_L16X32)
                    cachedFlags[8] = i.tagFlags2.x;
                    cachedFlags[9] = i.tagFlags2.y;
                    cachedFlags[10] = i.tagFlags2.z;
                    cachedFlags[11] = i.tagFlags2.w;
                    cachedFlags[12] = i.tagFlags3.x;
                    cachedFlags[13] = i.tagFlags3.y;
                    cachedFlags[14] = i.tagFlags3.z;
                    cachedFlags[15] = i.tagFlags3.w;
                    #endif

                    // UVオフセットがタグ境界で不連続にジャンプするため、tex2Dの自動微分ではミップレベルが誤選択され境界に線が出る
                    // オフセット前の連続なi.uvから微分値を計算しtex2Dgradで明示指定することで回避。
                    // discardの実行後はquad内の微分値が仕様上未定義になるため、必ず全discardより前で計算する
                    float2 uvDdx = ddx(i.uv);
                    float2 uvDdy = ddy(i.uv);

                    // pass1集計(スロット総数・最大タグ数)は頂点シェーダー(tagCountSlots)で計算済みの値を受け取る
                    int mainAxisActiveSlotCount = i.tagSlotCounts.x;
                    int subAxisMaxActiveSlotCount = i.tagSlotCounts.y;

                    // 以降、棄却は「表示領域外 → スロットのタグ数超過 → cutout」の3段階に分けて早期に行う。
                    // if文増加によるワープ内発散(divergence)の懸念には当たらない:
                    // - これらの条件は画面空間でコヒーレント(隣接ピクセルがほぼ同方向)なため、ワープが割れるのは領域境界のみ
                    // - 割れたワープのコストは「discard側=何もしない + 続行側=フルパス」の和 = 従来の全ピクセル無条件実行と同じ。
                    //   つまり最悪ケースが従来と同等で、全レーンdiscardのワープ(空白領域の大半)は後続処理を丸ごとスキップできる
                    // - discardペナルティ(タイル型GPUのearly-Z無効等)は「シェーダーにdiscardが1つでも含まれるか」で決まるため、
                    //   段階化(discard文の増加)では悪化しない
                    #if _DISPLAY_ALIGN_ROW
                        // main axis = col
                        // スロット表を動的インデックスのローカル配列に持つとモバイルGPUでスクラッチメモリへ
                        // スピルして極端に遅くなる。またHLSLccが生成する実行時ループはカウンタをfloatレジスタの
                        // ビットパターンで回すため、denormalをゼロにフラッシュするGPU(Adreno等)で無限ループ＝ハングし得る。
                        // そのため配列と実行時ループを使わず、[unroll]した選択走査で必要なスロットだけを取得する。

                        // col (align center)
                        int mainAxisSlot = floor(i.uv.x * _TagDataColCount - (_TagDataColCount - mainAxisActiveSlotCount) / 2.0);
                        // row (items is align top & all region is align bottom)
                        int subAxisSlot = floor((1 - i.uv.y) * _TagDataRowCount - (_TagDataRowCount - subAxisMaxActiveSlotCount));
                        // left of cell pos (0.5 allowed)
                        float currentSlotCol = (_TagDataColCount - mainAxisActiveSlotCount) / 2.0 + mainAxisSlot;
                        // top of cell pos (0.5 allowed)
                        float currentSlotRow = (_TagDataRowCount - subAxisMaxActiveSlotCount) + subAxisSlot;

                        // 表示領域外はここで棄却し、以降の選択走査・テクスチャ読みを実行しない(空白領域のピクセル単価削減)。
                        // subAxisSlot >= subAxisMaxActiveSlotCount はどの列のタグ数以上でもあるため、後段のタグ数判定に対する安全な早期棄却
                        if (mainAxisSlot < 0 || subAxisSlot < 0 || mainAxisSlot >= mainAxisActiveSlotCount || subAxisSlot >= subAxisMaxActiveSlotCount) {
                            discard;
                        }

                        // MAP (pass2): mainAxisSlot番目の非ゼロ列を選択走査で特定(配列を使わない)

                        int targetSlot = max(mainAxisSlot, 0);
                        int currentCol = 0;
                        uint colBits = 0;
                        int seenActive = 0;
                        [unroll] for (int col2 = 0; col2 < MAX_COL; col2++) {
                            uint bits = cachedFlags[col2];
                            bool hit = bits != 0 && seenActive == targetSlot;
                            currentCol = hit ? col2 : currentCol;
                            colBits = hit ? bits : colBits;
                            seenActive += bits != 0;
                        }
                        // 表示スロット列のタグ数 (旧activeSlotCountBySubAxis[mainAxisSlot]相当)
                        int currentSlotActiveCount = tagCountBits(colBits);
                        // この列のタグ数を超える空セルは行走査とテクスチャ読みの前に棄却
                        if (subAxisSlot >= currentSlotActiveCount) {
                            discard;
                        }
                        int currentRow = 0;
                        int foundRow = 0;
                        [unroll] for (int row = 0; row < MAX_ROW; row++) {
                            foundRow += (colBits >> row) & 1u;
                            currentRow = lerp(currentRow, row + 1, foundRow == subAxisSlot);
                        }
                    #elif _DISPLAY_ALIGN_COL
                        // main axis = row
                        // ROW側と同様、配列と実行時ループを使わない[unroll]の選択走査で構成する

                        // row (items is align top & all region is align bottom)
                        int mainAxisSlot = floor((1 - i.uv.y) * _TagDataRowCount - (_TagDataRowCount - mainAxisActiveSlotCount));
                        // col (align center)
                        int subAxisSlot = floor(i.uv.x * _TagDataColCount - (_TagDataColCount - subAxisMaxActiveSlotCount) / 2.0);
                        float currentSlotCol = (_TagDataColCount - subAxisMaxActiveSlotCount) / 2.0 + subAxisSlot;
                        float currentSlotRow = (_TagDataRowCount - mainAxisActiveSlotCount) + mainAxisSlot;

                        // 表示領域外はここで棄却し、以降の選択走査・テクスチャ読みを実行しない(空白領域のピクセル単価削減)。
                        // subAxisSlot >= subAxisMaxActiveSlotCount はどの行のタグ数以上でもあるため、後段のタグ数判定に対する安全な早期棄却
                        if (mainAxisSlot < 0 || subAxisSlot < 0 || mainAxisSlot >= mainAxisActiveSlotCount || subAxisSlot >= subAxisMaxActiveSlotCount) {
                            discard;
                        }

                        // MAP (pass2): mainAxisSlot番目の非ゼロ行を選択走査で特定(配列を使わない)

                        int targetSlot = max(mainAxisSlot, 0);
                        int currentRow = 0;
                        // 表示スロット行のタグ数 (旧activeSlotCountBySubAxis[mainAxisSlot]相当)
                        int currentSlotActiveCount = 0;
                        int seenActive = 0;
                        [unroll] for (int row2 = 0; row2 < MAX_ROW; row2++) {
                            int count = 0;
                            [unroll] for (int col2 = 0; col2 < MAX_COL; col2++) {
                                count += (cachedFlags[col2] >> row2) & 1u;
                            }
                            bool hit = count != 0 && seenActive == targetSlot;
                            currentRow = hit ? row2 : currentRow;
                            currentSlotActiveCount = hit ? count : currentSlotActiveCount;
                            seenActive += count != 0;
                        }
                        // この行のタグ数を超える空セルは列走査とテクスチャ読みの前に棄却
                        if (subAxisSlot >= currentSlotActiveCount) {
                            discard;
                        }
                        int currentCol = 0;
                        int foundCol = 0;
                        [unroll] for (int col3 = 0; col3 < MAX_COL; col3++) {
                            foundCol += (cachedFlags[col3] >> currentRow) & 1u;
                            currentCol = lerp(currentCol, col3 + 1, foundCol == subAxisSlot);
                        }
                    #endif

                    float2 uv = i.uv + float2(currentCol - currentSlotCol, (currentSlotRow - currentRow)) / float2(_TagDataColCount, _TagDataRowCount);
                    fixed4 color = tex2Dgrad(_MainTex, uv, uvDdx, uvDdy);

                    // スロット系の棄却は各ブランチで早期に実施済み。ここは罫線・文字縁のcutoutのみ
                    if (color.a < _Cutout) {
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
