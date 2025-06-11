using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class ToggleStateSender : UdonSharpBehaviour
    {
        [SerializeField] internal TagMarkerUI ui;
        [SerializeField] internal int index;

        public void Send()
        {
            ui.ToggleState(index);
        }
    }
}
