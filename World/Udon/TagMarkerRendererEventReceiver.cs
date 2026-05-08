using UdonSharp;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerRendererEventReceiver : UdonSharpBehaviour
    {
        public abstract void _OnTagMarkerPlayerStateUpdated();
    }
}
