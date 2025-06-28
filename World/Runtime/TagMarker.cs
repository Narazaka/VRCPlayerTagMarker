using System.Runtime.CompilerServices;
using UnityEngine;
using VRC.SDKBase;

[assembly: InternalsVisibleTo("Narazaka.VRChat.TagMarker.World.Editor")]

namespace Narazaka.VRChat.TagMarker.World.Runtime
{
    public class TagMarker : MonoBehaviour, IEditorOnly
    {
        [SerializeField] internal Texture2D texture;
        [SerializeField] internal Material materialOnPlayer;
        [SerializeField] internal Material materialOnUI;

        [Space]

        [SerializeField] internal GameObject ToggleStateSender;
        [SerializeField] internal GameObject ToggleStateSendersColumn;
        [SerializeField] internal TagMarkerUI tagMarkerUI;
        [SerializeField] internal Renderer tagView;
        [SerializeField] internal Transform tagButtonsContainer;
        [SerializeField] internal TagMarkerOnPlayer tagMarkerOnPlayer;
        [SerializeField] internal Renderer tagMarkerOnPlayerView;
    }
}
