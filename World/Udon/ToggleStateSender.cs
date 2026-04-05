using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class ToggleStateSender : UdonSharpBehaviour
    {
        [SerializeField] TagMarkerUI ui;
        [SerializeField] ushort cellId;

        public void Send()
        {
            ui.ToggleState(cellId);
        }
    }
}
