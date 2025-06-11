/// usage:
///
/// #pragma fragment frag
///
/// #include "UnityCG.cginc"
///
/// // define maintex first
/// sampler2D _MainTex;
/// float4 _MainTex_ST;
/// // as you need
/// UNITY_INSTANCING_BUFFER_START(Props)
///     UNITY_DEFINE_INSTANCED_PROP(float4, _Color)
/// UNITY_INSTANCING_BUFFER_END(Props)
///
/// // optional: default=_MainTex
/// #define VR_BILLBOARD_MAIN_TEX _MainTex
/// // optional: default=v2f
/// #define VR_BILLBOARD_VERT_TO_FRAG v2f
/// // optional: disable billboard (normal shader)
/// #define VR_BILLBOARD_DISABLE_BILLBOARD
/// // optional: enable billboard (is stronger than disable)
/// #define VR_BILLBOARD_ENABLE_BILLBOARD
/// #include "VRBillboard.cginc"
///
/// fixed4 frag (v2f i) : SV_Target
/// {
///     // required
///     UNITY_SETUP_INSTANCE_ID(i);
///
///     // your code
///     fixed4 col = tex2D(_MainTex, i.uv) * UNITY_ACCESS_INSTANCED_PROP(Props, _Color);
///
///     // required
///     UNITY_APPLY_FOG(i.fogCoord, col);
///     return col;
/// }

#ifndef VR_BILLBOARD_MAIN_TEX
#define VR_BILLBOARD_MAIN_TEX _MainTex
#endif
#ifndef VR_BILLBOARD_VERT_TO_FRAG
#define VR_BILLBOARD_VERT_TO_FRAG v2f
#endif

#define VR_BILLBOARD_FRAG_BEGIN(name) UNITY_SETUP_INSTANCE_ID(name);

#pragma vertex vert
// make fog work
#pragma multi_compile_fog
#pragma multi_compile_instancing

struct appdata
{
    float4 vertex : POSITION;
    float2 uv : TEXCOORD0;
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

struct VR_BILLBOARD_VERT_TO_FRAG
{
    float2 uv : TEXCOORD0;
    UNITY_FOG_COORDS(1)
    float4 vertex : SV_POSITION;
    UNITY_VERTEX_OUTPUT_STEREO
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

#if defined(VR_BILLBOARD_DISABLE_BILLBOARD) && !defined(VR_BILLBOARD_ENABLE_BILLBOARD)
VR_BILLBOARD_VERT_TO_FRAG vert (appdata v)
{
    VR_BILLBOARD_VERT_TO_FRAG o;
    UNITY_SETUP_INSTANCE_ID(v);
    UNITY_INITIALIZE_OUTPUT(VR_BILLBOARD_VERT_TO_FRAG, o);
    UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
    UNITY_TRANSFER_INSTANCE_ID(v, o);
    o.vertex = UnityObjectToClipPos(v.vertex);
    o.uv = TRANSFORM_TEX(v.uv, VR_BILLBOARD_MAIN_TEX);
    UNITY_TRANSFER_FOG(o, o.vertex);
    return o;
}
#else
VR_BILLBOARD_VERT_TO_FRAG vert (appdata v)
{
    VR_BILLBOARD_VERT_TO_FRAG o;
    UNITY_SETUP_INSTANCE_ID(v);
    UNITY_INITIALIZE_OUTPUT(VR_BILLBOARD_VERT_TO_FRAG, o);
    UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
    UNITY_TRANSFER_INSTANCE_ID(v, o); 
    float3 scale = float3(
        length(unity_ObjectToWorld._m00_m10_m20),
        length(unity_ObjectToWorld._m01_m11_m21),
        length(unity_ObjectToWorld._m02_m12_m22)
    );
    float3 rootPos = unity_ObjectToWorld._m03_m13_m23;
#if defined(USING_STEREO_MATRICES)
    float3 cameraPos = (unity_StereoWorldSpaceCameraPos[0] + unity_StereoWorldSpaceCameraPos[1]) * 0.5;
#else
    float3 cameraPos = _WorldSpaceCameraPos;
#endif
    float3 rootToCamera = cameraPos - rootPos;
    float3 up = float3(0, 1, 0);
    // right: normal to rootToCamera and up
    float3 right = normalize(cross(rootToCamera, up));

                
    float3 vertexPos = - right * v.vertex.x * scale.x - up * v.vertex.y * scale.y;
    float4 worldPos = float4(vertexPos + rootPos, 1);

    o.vertex = mul(UNITY_MATRIX_VP, worldPos);
    o.uv = TRANSFORM_TEX(v.uv, VR_BILLBOARD_MAIN_TEX);
    UNITY_TRANSFER_FOG(o, o.vertex);
    return o;
}
#endif
