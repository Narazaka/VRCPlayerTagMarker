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
        [SerializeField] bool useHeadPositionAsEyePosition;

        void LateUpdate()
        {
            var player = Networking.GetOwner(gameObject);
            var pos = player.GetPosition();
            if (useHeadPositionAsEyePosition)
            {
                var headPos = player.GetBonePosition(HumanBodyBones.Head);
                var height = headPos.y - pos.y;
                transform.position = headPos + Vector3.up * height * (scaleFromEyePosition - 1f);
            }
            else
            {
                var height = player.GetAvatarEyeHeightAsMeters();
                transform.position = pos + Vector3.up * height * scaleFromEyePosition;
            }
        }

        void Reset()
        {
            useHeadPositionAsEyePosition = true;
        }
    }
}
