using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;
using VRC.Udon.Common.Interfaces;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerStateRenderer : TagMarkerRenderer
    {
        protected abstract TagMarkerPlayerState tagMarkerPlayerState { get; }

        public void _OnTagMarkerPlayerStateUpdated()
        {
            UpdateRenderer(tagMarkerPlayerState);
        }

        public override void OnPlayerRestored(VRCPlayerApi player)
        {
            if (Networking.IsOwner(player, tagMarkerPlayerState.gameObject))
            {
                tagMarkerPlayerState._MigrateFromV0();
                tagMarkerPlayerState._AddListener((IUdonEventReceiver)this);
            }
        }
    }
}
