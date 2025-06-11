using UnityEngine;

namespace Narazaka.VRChat.TagMarker.World
{
    class TagMarkerConstants
    {
        public const int MaxCol = 8;
        public const int MaxRow = 32;

        public static int TagPropertyId(int index) => TagPropertyId(index / MaxRow, index % MaxRow);

        public static int TagPropertyId(int col, int row) => Animator.StringToHash($"_Tag_{col}_{row.ToString().PadLeft(2, '0')}");
    }
}
