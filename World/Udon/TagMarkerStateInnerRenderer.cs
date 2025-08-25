using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerStateInnerRenderer : TagMarkerStateRenderer
    {
        [SerializeField] TagMarkerPlayerState _tagMarkerPlayerState;

        protected override TagMarkerPlayerState tagMarkerPlayerState => _tagMarkerPlayerState;
    }
}
