using System;
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
    public class TagMarkerPlayerState : UdonSharpBehaviour
    {
        [UdonSynced, NonSerialized] public ushort dataVersion;
        [UdonSynced, NonSerialized] public bool[] toggleStates = new bool[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];
        TagMarkerStateRenderer[] _listeners = new TagMarkerStateRenderer[0];

        public void _ToggleState(int index)
        {
            _SetToggleState(index, !toggleStates[index]);
        }

        public void _SetToggleState(int index, bool state)
        {
            toggleStates[index] = state;
            RequestSerialization();
            UpdateRenderer();
        }

        public void _AddListener(TagMarkerStateRenderer listener)
        {
            var len = _listeners.Length;
            for (var i = 0; i < len; i++)
            {
                if (_listeners[i] == listener) return;
            }
            var newListeners = new TagMarkerStateRenderer[len + 1];
            Array.Copy(_listeners, newListeners, len);
            newListeners[len] = listener;
            _listeners = newListeners;
            listener._UpdateRenderer();
        }

        public override void OnDeserialization()
        {
            UpdateRenderer();
        }

        void UpdateRenderer()
        {
            foreach (var listener in _listeners)
            {
                listener._UpdateRenderer();
            }
        }
    }
}
