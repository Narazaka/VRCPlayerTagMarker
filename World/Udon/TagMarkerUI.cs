using UdonSharp;
using UnityEngine;
using UnityEngine.UI;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class TagMarkerUI : TagMarkerRenderer
    {
        [SerializeField] TagMarkerOnPlayer tagMarkerOnPlayerInPrefab;

        TagMarkerOnPlayer _tagMarkerOnPlayer = null;

        TagMarkerOnPlayer tagMarkerOnPlayer
        {
            get
            {
                if (_tagMarkerOnPlayer != null) return _tagMarkerOnPlayer;
                _tagMarkerOnPlayer = (TagMarkerOnPlayer)Networking.FindComponentInPlayerObjects(Networking.LocalPlayer, tagMarkerOnPlayerInPrefab);
                return _tagMarkerOnPlayer;
            }
        }

        public override void OnPlayerRestored(VRCPlayerApi player)
        {
            UpdateRenderer(tagMarkerOnPlayer.toggleStates);
        }

        public void ToggleState(int index)
        {
            if (tagMarkerOnPlayer == null) return;
            tagMarkerOnPlayer._ToggleState(index);
            UpdateRenderer(tagMarkerOnPlayer.toggleStates);
        }
    }
}
