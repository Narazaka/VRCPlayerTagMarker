using UnityEngine;
using VRC.SDKBase;

namespace Narazaka.VRChat.TagMarker.World
{
    class TagMarkerConstants
    {
        public const int MaxCol = 8;
        public const int MaxRow = 32;

        public static int TagPropertyId(int index) => TagPropertyId(index / MaxRow, index % MaxRow);

        public static int TagPropertyId(int col, int row) => VRCShader.PropertyToID(TagProperty(col, row));

        public static string TagProperty(int col, int row) => $"_Tag_{col}_{row.ToString().PadLeft(2, '0')}";
    }
}
