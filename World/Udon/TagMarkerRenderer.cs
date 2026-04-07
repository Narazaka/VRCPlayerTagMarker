using UdonSharp;
using UnityEngine;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerRenderer : UdonSharpBehaviour
    {
        [SerializeField] Renderer _renderer;

        int[] tagFlagsPropIds;

        protected void UpdateRenderer(TagMarkerPlayerState playerState)
        {
            if (tagFlagsPropIds == null)
            {
                tagFlagsPropIds = new int[TagMarkerConstants.MaxCol];
                for (var col = 0; col < TagMarkerConstants.MaxCol; col++)
                {
                    tagFlagsPropIds[col] = TagMarkerConstants.TagFlagsPropertyId(col);
                }
            }

            var mapLength = playerState._GetMapLength();
            var toggleStates = playerState._GetToggleStatesForRenderer();
            var tagFlags = new int[TagMarkerConstants.MaxCol];
            for (var i = 0; i < mapLength; i++)
            {
                if (toggleStates[i])
                {
                    var col = playerState._GetCol(i);
                    var row = playerState._GetRow(i);
                    tagFlags[col] |= 1 << row;
                }
            }
            var materialPropertyBlock = new MaterialPropertyBlock();
            for (var col = 0; col < TagMarkerConstants.MaxCol; col++)
            {
                materialPropertyBlock.SetInteger(tagFlagsPropIds[col], tagFlags[col]);
            }
            _renderer.SetPropertyBlock(materialPropertyBlock);
        }
    }
}
