using JetBrains.Annotations;
using UdonSharp;

namespace Narazaka.VRChat.TagMarker.World
{
    public abstract class TagMarkerRendererEventReceiver : UdonSharpBehaviour
    {
        [PublicAPI]
        public abstract void _OnTagMarkerPlayerStateUpdated();
    }
}
