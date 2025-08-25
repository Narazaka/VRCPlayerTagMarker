using UdonSharp;
using UnityEngine;
using VRC.SDKBase;

namespace Narazaka.VRChat.TagMarker.World.Sample
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class ShowOnLocalOwned : UdonSharpBehaviour
    {
        [SerializeField] GameObject target;

        public override void OnPlayerJoined(VRCPlayerApi player)
        {
            if (player.isLocal)
            {
                Set();
            }
        }

        void Set()
        {
            target.SetActive(Networking.IsOwner(target));
        }
    }
}
