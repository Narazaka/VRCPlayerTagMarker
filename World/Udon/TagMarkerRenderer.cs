using UdonSharp;
using UnityEngine;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerRenderer : UdonSharpBehaviour
    {
        [SerializeField] Renderer _renderer;

        int[] tagPropertyIds = new int[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];

        protected void UpdateRenderer(TagMarkerPlayerState playerState)
        {
            var mapLength = playerState._GetMapLength();
            var toggleStates = playerState._GetToggleStatesForRenderer();
            var materialPropertyBlock = new MaterialPropertyBlock();
            for (var i = 0; i < mapLength; i++)
            {
                var col = playerState._GetCol(i);
                var row = playerState._GetRow(i);
                var propId = TagPropertyId(col, row);
                materialPropertyBlock.SetFloat(propId, toggleStates[i] ? 1f : 0f);
            }
            _renderer.SetPropertyBlock(materialPropertyBlock);
        }

        int TagPropertyId(int col, int row)
        {
            var index = col * TagMarkerConstants.MaxRow + row;
            if (tagPropertyIds[index] != 0) return tagPropertyIds[index];
            return tagPropertyIds[index] = TagMarkerConstants.TagPropertyId(col, row);
        }
    }
}
