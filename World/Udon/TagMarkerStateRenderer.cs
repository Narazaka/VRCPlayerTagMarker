using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerStateRenderer : TagMarkerRenderer
    {
        protected abstract TagMarkerPlayerState tagMarkerPlayerState { get; }

        public void _UpdateRenderer()
        {
            UpdateRenderer(tagMarkerPlayerState);
        }

        public override void OnPlayerRestored(VRCPlayerApi player)
        {
            if (Networking.IsOwner(player, tagMarkerPlayerState.gameObject))
            {
                tagMarkerPlayerState._MigrateFromV0();
                tagMarkerPlayerState._AddListener(this);
            }
        }
    }
}
