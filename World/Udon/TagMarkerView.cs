using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class TagMarkerView : TagMarkerStateInnerRenderer
    {
        [SerializeField] public bool showAll;
    }
}
