Shader "Unlit/TagMarker"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _DisabledColor ("Disabled Color (for fixed)", Color) = (0.5, 0.5, 0.5, 1)
        [Header(Tag Data Setting)][Space]
        _TagDataColCount ("Tag Data Column Count (max 8)", Int) = 1
        _TagDataRowCount ("Tag Data Row Count (max 32)", Int) = 8
        [Header(Tag Show Setting)][Space]
        [Toggle(VR_BILLBOARD_ENABLE_BILLBOARD)] _Billboard ("Billboard shader", Float) = 1
        [KeywordEnum(FIXED, ALIGN_ROW, ALIGN_COL)] _DISPLAY ("Display mode", Int) = 1 // flexible row/col
        // col/row align = left/center/right top/center/bottom
        // _TagShowColCount ("Tag Show Column Count", Int) = 1
        // _TagShowRowCount ("Tag Show Row Count", Int) = 8
        [Header(Tag State)][Space]
        [Toggle] _Tag_0_00 ("Tag Col:0 Row:00", Float) = 0
        [Toggle] _Tag_0_01 ("Tag Col:0 Row:01", Float) = 0
        [Toggle] _Tag_0_02 ("Tag Col:0 Row:02", Float) = 0
        [Toggle] _Tag_0_03 ("Tag Col:0 Row:03", Float) = 0
        [Toggle] _Tag_0_04 ("Tag Col:0 Row:04", Float) = 0
        [Toggle] _Tag_0_05 ("Tag Col:0 Row:05", Float) = 0
        [Toggle] _Tag_0_06 ("Tag Col:0 Row:06", Float) = 0
        [Toggle] _Tag_0_07 ("Tag Col:0 Row:07", Float) = 0
        [Toggle] _Tag_0_08 ("Tag Col:0 Row:08", Float) = 0
        [Toggle] _Tag_0_09 ("Tag Col:0 Row:09", Float) = 0
        [Toggle] _Tag_0_10 ("Tag Col:0 Row:10", Float) = 0
        [Toggle] _Tag_0_11 ("Tag Col:0 Row:11", Float) = 0
        [Toggle] _Tag_0_12 ("Tag Col:0 Row:12", Float) = 0
        [Toggle] _Tag_0_13 ("Tag Col:0 Row:13", Float) = 0
        [Toggle] _Tag_0_14 ("Tag Col:0 Row:14", Float) = 0
        [Toggle] _Tag_0_15 ("Tag Col:0 Row:15", Float) = 0
        [Toggle] _Tag_0_16 ("Tag Col:0 Row:16", Float) = 0
        [Toggle] _Tag_0_17 ("Tag Col:0 Row:17", Float) = 0
        [Toggle] _Tag_0_18 ("Tag Col:0 Row:18", Float) = 0
        [Toggle] _Tag_0_19 ("Tag Col:0 Row:19", Float) = 0
        [Toggle] _Tag_0_20 ("Tag Col:0 Row:20", Float) = 0
        [Toggle] _Tag_0_21 ("Tag Col:0 Row:21", Float) = 0
        [Toggle] _Tag_0_22 ("Tag Col:0 Row:22", Float) = 0
        [Toggle] _Tag_0_23 ("Tag Col:0 Row:23", Float) = 0
        [Toggle] _Tag_0_24 ("Tag Col:0 Row:24", Float) = 0
        [Toggle] _Tag_0_25 ("Tag Col:0 Row:25", Float) = 0
        [Toggle] _Tag_0_26 ("Tag Col:0 Row:26", Float) = 0
        [Toggle] _Tag_0_27 ("Tag Col:0 Row:27", Float) = 0
        [Toggle] _Tag_0_28 ("Tag Col:0 Row:28", Float) = 0
        [Toggle] _Tag_0_29 ("Tag Col:0 Row:29", Float) = 0
        [Toggle] _Tag_0_30 ("Tag Col:0 Row:30", Float) = 0
        [Toggle] _Tag_0_31 ("Tag Col:0 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_1_00 ("Tag Col:1 Row:00", Float) = 0
        [Toggle] _Tag_1_01 ("Tag Col:1 Row:01", Float) = 0
        [Toggle] _Tag_1_02 ("Tag Col:1 Row:02", Float) = 0
        [Toggle] _Tag_1_03 ("Tag Col:1 Row:03", Float) = 0
        [Toggle] _Tag_1_04 ("Tag Col:1 Row:04", Float) = 0
        [Toggle] _Tag_1_05 ("Tag Col:1 Row:05", Float) = 0
        [Toggle] _Tag_1_06 ("Tag Col:1 Row:06", Float) = 0
        [Toggle] _Tag_1_07 ("Tag Col:1 Row:07", Float) = 0
        [Toggle] _Tag_1_08 ("Tag Col:1 Row:08", Float) = 0
        [Toggle] _Tag_1_09 ("Tag Col:1 Row:09", Float) = 0
        [Toggle] _Tag_1_10 ("Tag Col:1 Row:10", Float) = 0
        [Toggle] _Tag_1_11 ("Tag Col:1 Row:11", Float) = 0
        [Toggle] _Tag_1_12 ("Tag Col:1 Row:12", Float) = 0
        [Toggle] _Tag_1_13 ("Tag Col:1 Row:13", Float) = 0
        [Toggle] _Tag_1_14 ("Tag Col:1 Row:14", Float) = 0
        [Toggle] _Tag_1_15 ("Tag Col:1 Row:15", Float) = 0
        [Toggle] _Tag_1_16 ("Tag Col:1 Row:16", Float) = 0
        [Toggle] _Tag_1_17 ("Tag Col:1 Row:17", Float) = 0
        [Toggle] _Tag_1_18 ("Tag Col:1 Row:18", Float) = 0
        [Toggle] _Tag_1_19 ("Tag Col:1 Row:19", Float) = 0
        [Toggle] _Tag_1_20 ("Tag Col:1 Row:20", Float) = 0
        [Toggle] _Tag_1_21 ("Tag Col:1 Row:21", Float) = 0
        [Toggle] _Tag_1_22 ("Tag Col:1 Row:22", Float) = 0
        [Toggle] _Tag_1_23 ("Tag Col:1 Row:23", Float) = 0
        [Toggle] _Tag_1_24 ("Tag Col:1 Row:24", Float) = 0
        [Toggle] _Tag_1_25 ("Tag Col:1 Row:25", Float) = 0
        [Toggle] _Tag_1_26 ("Tag Col:1 Row:26", Float) = 0
        [Toggle] _Tag_1_27 ("Tag Col:1 Row:27", Float) = 0
        [Toggle] _Tag_1_28 ("Tag Col:1 Row:28", Float) = 0
        [Toggle] _Tag_1_29 ("Tag Col:1 Row:29", Float) = 0
        [Toggle] _Tag_1_30 ("Tag Col:1 Row:30", Float) = 0
        [Toggle] _Tag_1_31 ("Tag Col:1 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_2_00 ("Tag Col:2 Row:00", Float) = 0
        [Toggle] _Tag_2_01 ("Tag Col:2 Row:01", Float) = 0
        [Toggle] _Tag_2_02 ("Tag Col:2 Row:02", Float) = 0
        [Toggle] _Tag_2_03 ("Tag Col:2 Row:03", Float) = 0
        [Toggle] _Tag_2_04 ("Tag Col:2 Row:04", Float) = 0
        [Toggle] _Tag_2_05 ("Tag Col:2 Row:05", Float) = 0
        [Toggle] _Tag_2_06 ("Tag Col:2 Row:06", Float) = 0
        [Toggle] _Tag_2_07 ("Tag Col:2 Row:07", Float) = 0
        [Toggle] _Tag_2_08 ("Tag Col:2 Row:08", Float) = 0
        [Toggle] _Tag_2_09 ("Tag Col:2 Row:09", Float) = 0
        [Toggle] _Tag_2_10 ("Tag Col:2 Row:10", Float) = 0
        [Toggle] _Tag_2_11 ("Tag Col:2 Row:11", Float) = 0
        [Toggle] _Tag_2_12 ("Tag Col:2 Row:12", Float) = 0
        [Toggle] _Tag_2_13 ("Tag Col:2 Row:13", Float) = 0
        [Toggle] _Tag_2_14 ("Tag Col:2 Row:14", Float) = 0
        [Toggle] _Tag_2_15 ("Tag Col:2 Row:15", Float) = 0
        [Toggle] _Tag_2_16 ("Tag Col:2 Row:16", Float) = 0
        [Toggle] _Tag_2_17 ("Tag Col:2 Row:17", Float) = 0
        [Toggle] _Tag_2_18 ("Tag Col:2 Row:18", Float) = 0
        [Toggle] _Tag_2_19 ("Tag Col:2 Row:19", Float) = 0
        [Toggle] _Tag_2_20 ("Tag Col:2 Row:20", Float) = 0
        [Toggle] _Tag_2_21 ("Tag Col:2 Row:21", Float) = 0
        [Toggle] _Tag_2_22 ("Tag Col:2 Row:22", Float) = 0
        [Toggle] _Tag_2_23 ("Tag Col:2 Row:23", Float) = 0
        [Toggle] _Tag_2_24 ("Tag Col:2 Row:24", Float) = 0
        [Toggle] _Tag_2_25 ("Tag Col:2 Row:25", Float) = 0
        [Toggle] _Tag_2_26 ("Tag Col:2 Row:26", Float) = 0
        [Toggle] _Tag_2_27 ("Tag Col:2 Row:27", Float) = 0
        [Toggle] _Tag_2_28 ("Tag Col:2 Row:28", Float) = 0
        [Toggle] _Tag_2_29 ("Tag Col:2 Row:29", Float) = 0
        [Toggle] _Tag_2_30 ("Tag Col:2 Row:30", Float) = 0
        [Toggle] _Tag_2_31 ("Tag Col:2 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_3_00 ("Tag Col:3 Row:00", Float) = 0
        [Toggle] _Tag_3_01 ("Tag Col:3 Row:01", Float) = 0
        [Toggle] _Tag_3_02 ("Tag Col:3 Row:02", Float) = 0
        [Toggle] _Tag_3_03 ("Tag Col:3 Row:03", Float) = 0
        [Toggle] _Tag_3_04 ("Tag Col:3 Row:04", Float) = 0
        [Toggle] _Tag_3_05 ("Tag Col:3 Row:05", Float) = 0
        [Toggle] _Tag_3_06 ("Tag Col:3 Row:06", Float) = 0
        [Toggle] _Tag_3_07 ("Tag Col:3 Row:07", Float) = 0
        [Toggle] _Tag_3_08 ("Tag Col:3 Row:08", Float) = 0
        [Toggle] _Tag_3_09 ("Tag Col:3 Row:09", Float) = 0
        [Toggle] _Tag_3_10 ("Tag Col:3 Row:10", Float) = 0
        [Toggle] _Tag_3_11 ("Tag Col:3 Row:11", Float) = 0
        [Toggle] _Tag_3_12 ("Tag Col:3 Row:12", Float) = 0
        [Toggle] _Tag_3_13 ("Tag Col:3 Row:13", Float) = 0
        [Toggle] _Tag_3_14 ("Tag Col:3 Row:14", Float) = 0
        [Toggle] _Tag_3_15 ("Tag Col:3 Row:15", Float) = 0
        [Toggle] _Tag_3_16 ("Tag Col:3 Row:16", Float) = 0
        [Toggle] _Tag_3_17 ("Tag Col:3 Row:17", Float) = 0
        [Toggle] _Tag_3_18 ("Tag Col:3 Row:18", Float) = 0
        [Toggle] _Tag_3_19 ("Tag Col:3 Row:19", Float) = 0
        [Toggle] _Tag_3_20 ("Tag Col:3 Row:20", Float) = 0
        [Toggle] _Tag_3_21 ("Tag Col:3 Row:21", Float) = 0
        [Toggle] _Tag_3_22 ("Tag Col:3 Row:22", Float) = 0
        [Toggle] _Tag_3_23 ("Tag Col:3 Row:23", Float) = 0
        [Toggle] _Tag_3_24 ("Tag Col:3 Row:24", Float) = 0
        [Toggle] _Tag_3_25 ("Tag Col:3 Row:25", Float) = 0
        [Toggle] _Tag_3_26 ("Tag Col:3 Row:26", Float) = 0
        [Toggle] _Tag_3_27 ("Tag Col:3 Row:27", Float) = 0
        [Toggle] _Tag_3_28 ("Tag Col:3 Row:28", Float) = 0
        [Toggle] _Tag_3_29 ("Tag Col:3 Row:29", Float) = 0
        [Toggle] _Tag_3_30 ("Tag Col:3 Row:30", Float) = 0
        [Toggle] _Tag_3_31 ("Tag Col:3 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_4_00 ("Tag Col:4 Row:00", Float) = 0
        [Toggle] _Tag_4_01 ("Tag Col:4 Row:01", Float) = 0
        [Toggle] _Tag_4_02 ("Tag Col:4 Row:02", Float) = 0
        [Toggle] _Tag_4_03 ("Tag Col:4 Row:03", Float) = 0
        [Toggle] _Tag_4_04 ("Tag Col:4 Row:04", Float) = 0
        [Toggle] _Tag_4_05 ("Tag Col:4 Row:05", Float) = 0
        [Toggle] _Tag_4_06 ("Tag Col:4 Row:06", Float) = 0
        [Toggle] _Tag_4_07 ("Tag Col:4 Row:07", Float) = 0
        [Toggle] _Tag_4_08 ("Tag Col:4 Row:08", Float) = 0
        [Toggle] _Tag_4_09 ("Tag Col:4 Row:09", Float) = 0
        [Toggle] _Tag_4_10 ("Tag Col:4 Row:10", Float) = 0
        [Toggle] _Tag_4_11 ("Tag Col:4 Row:11", Float) = 0
        [Toggle] _Tag_4_12 ("Tag Col:4 Row:12", Float) = 0
        [Toggle] _Tag_4_13 ("Tag Col:4 Row:13", Float) = 0
        [Toggle] _Tag_4_14 ("Tag Col:4 Row:14", Float) = 0
        [Toggle] _Tag_4_15 ("Tag Col:4 Row:15", Float) = 0
        [Toggle] _Tag_4_16 ("Tag Col:4 Row:16", Float) = 0
        [Toggle] _Tag_4_17 ("Tag Col:4 Row:17", Float) = 0
        [Toggle] _Tag_4_18 ("Tag Col:4 Row:18", Float) = 0
        [Toggle] _Tag_4_19 ("Tag Col:4 Row:19", Float) = 0
        [Toggle] _Tag_4_20 ("Tag Col:4 Row:20", Float) = 0
        [Toggle] _Tag_4_21 ("Tag Col:4 Row:21", Float) = 0
        [Toggle] _Tag_4_22 ("Tag Col:4 Row:22", Float) = 0
        [Toggle] _Tag_4_23 ("Tag Col:4 Row:23", Float) = 0
        [Toggle] _Tag_4_24 ("Tag Col:4 Row:24", Float) = 0
        [Toggle] _Tag_4_25 ("Tag Col:4 Row:25", Float) = 0
        [Toggle] _Tag_4_26 ("Tag Col:4 Row:26", Float) = 0
        [Toggle] _Tag_4_27 ("Tag Col:4 Row:27", Float) = 0
        [Toggle] _Tag_4_28 ("Tag Col:4 Row:28", Float) = 0
        [Toggle] _Tag_4_29 ("Tag Col:4 Row:29", Float) = 0
        [Toggle] _Tag_4_30 ("Tag Col:4 Row:30", Float) = 0
        [Toggle] _Tag_4_31 ("Tag Col:4 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_5_00 ("Tag Col:5 Row:00", Float) = 0
        [Toggle] _Tag_5_01 ("Tag Col:5 Row:01", Float) = 0
        [Toggle] _Tag_5_02 ("Tag Col:5 Row:02", Float) = 0
        [Toggle] _Tag_5_03 ("Tag Col:5 Row:03", Float) = 0
        [Toggle] _Tag_5_04 ("Tag Col:5 Row:04", Float) = 0
        [Toggle] _Tag_5_05 ("Tag Col:5 Row:05", Float) = 0
        [Toggle] _Tag_5_06 ("Tag Col:5 Row:06", Float) = 0
        [Toggle] _Tag_5_07 ("Tag Col:5 Row:07", Float) = 0
        [Toggle] _Tag_5_08 ("Tag Col:5 Row:08", Float) = 0
        [Toggle] _Tag_5_09 ("Tag Col:5 Row:09", Float) = 0
        [Toggle] _Tag_5_10 ("Tag Col:5 Row:10", Float) = 0
        [Toggle] _Tag_5_11 ("Tag Col:5 Row:11", Float) = 0
        [Toggle] _Tag_5_12 ("Tag Col:5 Row:12", Float) = 0
        [Toggle] _Tag_5_13 ("Tag Col:5 Row:13", Float) = 0
        [Toggle] _Tag_5_14 ("Tag Col:5 Row:14", Float) = 0
        [Toggle] _Tag_5_15 ("Tag Col:5 Row:15", Float) = 0
        [Toggle] _Tag_5_16 ("Tag Col:5 Row:16", Float) = 0
        [Toggle] _Tag_5_17 ("Tag Col:5 Row:17", Float) = 0
        [Toggle] _Tag_5_18 ("Tag Col:5 Row:18", Float) = 0
        [Toggle] _Tag_5_19 ("Tag Col:5 Row:19", Float) = 0
        [Toggle] _Tag_5_20 ("Tag Col:5 Row:20", Float) = 0
        [Toggle] _Tag_5_21 ("Tag Col:5 Row:21", Float) = 0
        [Toggle] _Tag_5_22 ("Tag Col:5 Row:22", Float) = 0
        [Toggle] _Tag_5_23 ("Tag Col:5 Row:23", Float) = 0
        [Toggle] _Tag_5_24 ("Tag Col:5 Row:24", Float) = 0
        [Toggle] _Tag_5_25 ("Tag Col:5 Row:25", Float) = 0
        [Toggle] _Tag_5_26 ("Tag Col:5 Row:26", Float) = 0
        [Toggle] _Tag_5_27 ("Tag Col:5 Row:27", Float) = 0
        [Toggle] _Tag_5_28 ("Tag Col:5 Row:28", Float) = 0
        [Toggle] _Tag_5_29 ("Tag Col:5 Row:29", Float) = 0
        [Toggle] _Tag_5_30 ("Tag Col:5 Row:30", Float) = 0
        [Toggle] _Tag_5_31 ("Tag Col:5 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_6_00 ("Tag Col:6 Row:00", Float) = 0
        [Toggle] _Tag_6_01 ("Tag Col:6 Row:01", Float) = 0
        [Toggle] _Tag_6_02 ("Tag Col:6 Row:02", Float) = 0
        [Toggle] _Tag_6_03 ("Tag Col:6 Row:03", Float) = 0
        [Toggle] _Tag_6_04 ("Tag Col:6 Row:04", Float) = 0
        [Toggle] _Tag_6_05 ("Tag Col:6 Row:05", Float) = 0
        [Toggle] _Tag_6_06 ("Tag Col:6 Row:06", Float) = 0
        [Toggle] _Tag_6_07 ("Tag Col:6 Row:07", Float) = 0
        [Toggle] _Tag_6_08 ("Tag Col:6 Row:08", Float) = 0
        [Toggle] _Tag_6_09 ("Tag Col:6 Row:09", Float) = 0
        [Toggle] _Tag_6_10 ("Tag Col:6 Row:10", Float) = 0
        [Toggle] _Tag_6_11 ("Tag Col:6 Row:11", Float) = 0
        [Toggle] _Tag_6_12 ("Tag Col:6 Row:12", Float) = 0
        [Toggle] _Tag_6_13 ("Tag Col:6 Row:13", Float) = 0
        [Toggle] _Tag_6_14 ("Tag Col:6 Row:14", Float) = 0
        [Toggle] _Tag_6_15 ("Tag Col:6 Row:15", Float) = 0
        [Toggle] _Tag_6_16 ("Tag Col:6 Row:16", Float) = 0
        [Toggle] _Tag_6_17 ("Tag Col:6 Row:17", Float) = 0
        [Toggle] _Tag_6_18 ("Tag Col:6 Row:18", Float) = 0
        [Toggle] _Tag_6_19 ("Tag Col:6 Row:19", Float) = 0
        [Toggle] _Tag_6_20 ("Tag Col:6 Row:20", Float) = 0
        [Toggle] _Tag_6_21 ("Tag Col:6 Row:21", Float) = 0
        [Toggle] _Tag_6_22 ("Tag Col:6 Row:22", Float) = 0
        [Toggle] _Tag_6_23 ("Tag Col:6 Row:23", Float) = 0
        [Toggle] _Tag_6_24 ("Tag Col:6 Row:24", Float) = 0
        [Toggle] _Tag_6_25 ("Tag Col:6 Row:25", Float) = 0
        [Toggle] _Tag_6_26 ("Tag Col:6 Row:26", Float) = 0
        [Toggle] _Tag_6_27 ("Tag Col:6 Row:27", Float) = 0
        [Toggle] _Tag_6_28 ("Tag Col:6 Row:28", Float) = 0
        [Toggle] _Tag_6_29 ("Tag Col:6 Row:29", Float) = 0
        [Toggle] _Tag_6_30 ("Tag Col:6 Row:30", Float) = 0
        [Toggle] _Tag_6_31 ("Tag Col:6 Row:31", Float) = 0
        [Space]
        [Toggle] _Tag_7_00 ("Tag Col:7 Row:00", Float) = 0
        [Toggle] _Tag_7_01 ("Tag Col:7 Row:01", Float) = 0
        [Toggle] _Tag_7_02 ("Tag Col:7 Row:02", Float) = 0
        [Toggle] _Tag_7_03 ("Tag Col:7 Row:03", Float) = 0
        [Toggle] _Tag_7_04 ("Tag Col:7 Row:04", Float) = 0
        [Toggle] _Tag_7_05 ("Tag Col:7 Row:05", Float) = 0
        [Toggle] _Tag_7_06 ("Tag Col:7 Row:06", Float) = 0
        [Toggle] _Tag_7_07 ("Tag Col:7 Row:07", Float) = 0
        [Toggle] _Tag_7_08 ("Tag Col:7 Row:08", Float) = 0
        [Toggle] _Tag_7_09 ("Tag Col:7 Row:09", Float) = 0
        [Toggle] _Tag_7_10 ("Tag Col:7 Row:10", Float) = 0
        [Toggle] _Tag_7_11 ("Tag Col:7 Row:11", Float) = 0
        [Toggle] _Tag_7_12 ("Tag Col:7 Row:12", Float) = 0
        [Toggle] _Tag_7_13 ("Tag Col:7 Row:13", Float) = 0
        [Toggle] _Tag_7_14 ("Tag Col:7 Row:14", Float) = 0
        [Toggle] _Tag_7_15 ("Tag Col:7 Row:15", Float) = 0
        [Toggle] _Tag_7_16 ("Tag Col:7 Row:16", Float) = 0
        [Toggle] _Tag_7_17 ("Tag Col:7 Row:17", Float) = 0
        [Toggle] _Tag_7_18 ("Tag Col:7 Row:18", Float) = 0
        [Toggle] _Tag_7_19 ("Tag Col:7 Row:19", Float) = 0
        [Toggle] _Tag_7_20 ("Tag Col:7 Row:20", Float) = 0
        [Toggle] _Tag_7_21 ("Tag Col:7 Row:21", Float) = 0
        [Toggle] _Tag_7_22 ("Tag Col:7 Row:22", Float) = 0
        [Toggle] _Tag_7_23 ("Tag Col:7 Row:23", Float) = 0
        [Toggle] _Tag_7_24 ("Tag Col:7 Row:24", Float) = 0
        [Toggle] _Tag_7_25 ("Tag Col:7 Row:25", Float) = 0
        [Toggle] _Tag_7_26 ("Tag Col:7 Row:26", Float) = 0
        [Toggle] _Tag_7_27 ("Tag Col:7 Row:27", Float) = 0
        [Toggle] _Tag_7_28 ("Tag Col:7 Row:28", Float) = 0
        [Toggle] _Tag_7_29 ("Tag Col:7 Row:29", Float) = 0
        [Toggle] _Tag_7_30 ("Tag Col:7 Row:30", Float) = 0
        [Toggle] _Tag_7_31 ("Tag Col:7 Row:31", Float) = 0
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

            #pragma fragment frag

            #include "UnityCG.cginc"
            
            sampler2D _MainTex;
            float4 _MainTex_ST;
            float4 _DisabledColor;
            int _TagDataColCount;
            int _TagDataRowCount;
            int _DISPLAY;
            // int _TagShowColCount;
            // int _TagShowRowCount;

            // shader variantで数制限して軽く？

            #define DEFINE_INSTANCED_PROP_TAG_ROW(col) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_00) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_01) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_02) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_03) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_04) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_05) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_06) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_07) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_08) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_09) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_10) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_11) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_12) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_13) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_14) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_15) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_16) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_17) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_18) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_19) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_20) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_21) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_22) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_23) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_24) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_25) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_26) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_27) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_28) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_29) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_30) \
                UNITY_DEFINE_INSTANCED_PROP(fixed, _Tag_##col##_31)

            UNITY_INSTANCING_BUFFER_START(Props)
                DEFINE_INSTANCED_PROP_TAG_ROW(0)
                DEFINE_INSTANCED_PROP_TAG_ROW(1)
                DEFINE_INSTANCED_PROP_TAG_ROW(2)
                DEFINE_INSTANCED_PROP_TAG_ROW(3)
                DEFINE_INSTANCED_PROP_TAG_ROW(4)
                DEFINE_INSTANCED_PROP_TAG_ROW(5)
                DEFINE_INSTANCED_PROP_TAG_ROW(6)
                DEFINE_INSTANCED_PROP_TAG_ROW(7)
            UNITY_INSTANCING_BUFFER_END(Props)
            
            #define VR_BILLBOARD_DISABLE_BILLBOARD
            #include "./VRBillboard.cginc"

            #define MAX_ROW 32
            #define MAX_COL 8

            #define PACK_TAG_COL(col) \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_00) >= 0.5) <<  0 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_01) >= 0.5) <<  1 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_02) >= 0.5) <<  2 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_03) >= 0.5) <<  3 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_04) >= 0.5) <<  4 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_05) >= 0.5) <<  5 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_06) >= 0.5) <<  6 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_07) >= 0.5) <<  7 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_08) >= 0.5) <<  8 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_09) >= 0.5) <<  9 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_10) >= 0.5) << 10 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_11) >= 0.5) << 11 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_12) >= 0.5) << 12 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_13) >= 0.5) << 13 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_14) >= 0.5) << 14 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_15) >= 0.5) << 15 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_16) >= 0.5) << 16 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_17) >= 0.5) << 17 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_18) >= 0.5) << 18 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_19) >= 0.5) << 19 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_20) >= 0.5) << 20 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_21) >= 0.5) << 21 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_22) >= 0.5) << 22 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_23) >= 0.5) << 23 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_24) >= 0.5) << 24 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_25) >= 0.5) << 25 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_26) >= 0.5) << 26 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_27) >= 0.5) << 27 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_28) >= 0.5) << 28 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_29) >= 0.5) << 29 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_30) >= 0.5) << 30 | \
                (UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_31) >= 0.5) << 31

            #define TAG_COL_ARRAY(col) \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_00) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_01) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_02) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_03) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_04) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_05) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_06) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_07) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_08) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_09) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_10) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_11) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_12) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_13) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_14) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_15) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_16) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_17) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_18) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_19) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_20) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_21) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_22) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_23) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_24) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_25) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_26) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_27) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_28) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_29) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_30) >= 0.5, \
                UNITY_ACCESS_INSTANCED_PROP(Props, _Tag_##col##_31) >= 0.5

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
                    color *= lerp(_DisabledColor, 1, tagStates[index]);
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
                    fixed4 color = tex2D(_MainTex, uv);

                    if (mainAxisSlot < 0 || subAxisSlot < 0 || mainAxisSlot >= mainAxisActiveSlotCount || subAxisSlot >= activeSlotCountBySubAxis[mainAxisSlot]) {
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
