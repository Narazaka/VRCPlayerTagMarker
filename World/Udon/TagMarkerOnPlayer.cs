using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
    public class TagMarkerOnPlayer : TagMarkerRenderer
    {
        [UdonSynced] internal ushort dataVersion;
        [UdonSynced] internal bool[] toggleStates = new bool[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];

        public void _ToggleState(int index)
        {
            _SetToggleState(index, !toggleStates[index]);
        }

        public void _SetToggleState(int index, bool state)
        {
            toggleStates[index] = state;
            RequestSerialization();
            UpdateRenderer(toggleStates);
        }

        public override void OnDeserialization()
        {
            UpdateRenderer(toggleStates);
        }

        void LateUpdate()
        {
            var player = Networking.GetOwner(gameObject);
            var pos = player.GetPosition();
            var height = player.GetAvatarEyeHeightAsMeters();
            transform.position = pos + Vector3.up * height * 1.3f;
        }
    }
}
