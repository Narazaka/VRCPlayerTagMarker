using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class TagMarkerViewOnPlayer : TagMarkerStateInnerRenderer
    {
        [SerializeField] float scaleFromEyePosition = 1.1f;

        void LateUpdate()
        {
            var player = Networking.GetOwner(gameObject);
            var pos = player.GetPosition();
            var height = player.GetAvatarEyeHeightAsMeters();
            transform.position = pos + Vector3.up * height * scaleFromEyePosition;
        }
    }
}
