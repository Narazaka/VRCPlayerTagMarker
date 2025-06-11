using UdonSharp;
using UnityEngine;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerRenderer : UdonSharpBehaviour
    {
        [SerializeField] internal Renderer renderer;

        int[] tagPropertyIds = new int[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];

        protected void UpdateRenderer(bool[] toggleStates)
        {
            var len = toggleStates.Length;
            var materialPropertyBlock = new MaterialPropertyBlock();
            for (var i = 0; i < len; i++)
            {
                materialPropertyBlock.SetFloat(TagPropertyId(i), toggleStates[i] ? 1f : 0f);
            }
            renderer.SetPropertyBlock(materialPropertyBlock);
        }

        int TagPropertyId(int index)
        {
            if (tagPropertyIds[index] != 0) return tagPropertyIds[index];
            return tagPropertyIds[index] = TagMarkerConstants.TagPropertyId(index);
        }
    }
}
