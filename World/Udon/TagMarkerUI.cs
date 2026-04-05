using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class TagMarkerUI : TagMarkerStateRenderer
    {
        [SerializeField] TagMarkerPlayerState tagMarkerPlayerStateInPrefab;

        TagMarkerPlayerState _tagMarkerPlayerState = null;

        protected override TagMarkerPlayerState tagMarkerPlayerState
        {
            get
            {
                if (_tagMarkerPlayerState != null) return _tagMarkerPlayerState;
                _tagMarkerPlayerState = (TagMarkerPlayerState)Networking.FindComponentInPlayerObjects(Networking.LocalPlayer, tagMarkerPlayerStateInPrefab);
                return _tagMarkerPlayerState;
            }
        }

        public void ToggleState(ushort cellId)
        {
            if (tagMarkerPlayerState == null) return;
            tagMarkerPlayerState._ToggleState(cellId);
        }
    }
}
