using UnityEngine;
using VRC.SDKBase;

namespace Narazaka.VRChat.TagMarker.World
{
    class TagMarkerConstants
    {
        public const int MaxCol = 16;
        public const int MaxRow = 32;

        public static string TagFlagsProperty(int col) => $"_TagFlags_{col}";
        public static int TagFlagsPropertyId(int col) => VRCShader.PropertyToID(TagFlagsProperty(col));
    }
}
