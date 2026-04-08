using System;
using System.Runtime.CompilerServices;
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

[assembly: InternalsVisibleTo("Narazaka.VRChat.TagMarker.Tests.Udon")]

namespace Narazaka.VRChat.TagMarker.World
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.Manual)]
    public class TagMarkerPlayerState : UdonSharpBehaviour
    {
        // --- Synced fields ---
        [UdonSynced, NonSerialized] public ushort dataVersion;
        [UdonSynced, NonSerialized] public bool[] toggleStates = new bool[0];
        [UdonSynced, NonSerialized] public ushort[] selectedCellIds = new ushort[0];

        // --- Editor-injected mapping tables ---
        [SerializeField] byte[] mapRowPositions;
        [SerializeField] byte[] mapColPositions;
        [SerializeField] ushort[] mapCellIds;
        [SerializeField] bool skipMigration;

        TagMarkerStateRenderer[] _listeners = new TagMarkerStateRenderer[0];

        public void _ToggleState(ushort cellId)
        {
            var index = Array.IndexOf(selectedCellIds, cellId);
            if (index >= 0)
            {
                // Remove
                var newIds = new ushort[selectedCellIds.Length - 1];
                Array.Copy(selectedCellIds, 0, newIds, 0, index);
                Array.Copy(selectedCellIds, index + 1, newIds, index, selectedCellIds.Length - index - 1);
                selectedCellIds = newIds;
            }
            else
            {
                // Add
                var newIds = new ushort[selectedCellIds.Length + 1];
                Array.Copy(selectedCellIds, newIds, selectedCellIds.Length);
                newIds[selectedCellIds.Length] = cellId;
                selectedCellIds = newIds;
            }
            RequestSerialization();
            UpdateRenderer();
        }

        public bool[] _GetToggleStatesForRenderer()
        {
            var states = new bool[mapCellIds.Length];
            for (var i = 0; i < selectedCellIds.Length; i++)
            {
                var cellId = selectedCellIds[i];
                var mapIndex = Array.IndexOf(mapCellIds, cellId);
                if (mapIndex >= 0)
                {
                    states[mapIndex] = true;
                }
            }
            return states;
        }

        public int _GetCol(int mapIndex)
        {
            return mapColPositions[mapIndex];
        }

        public int _GetRow(int mapIndex)
        {
            return mapRowPositions[mapIndex];
        }

        public int _GetMapLength()
        {
            return mapCellIds.Length;
        }

        public void _MigrateFromV0()
        {
            if (dataVersion >= 2) return;
            if (skipMigration)
            {
                toggleStates = new bool[0];
                selectedCellIds = new ushort[0];
                dataVersion = 2;
                RequestSerialization();
                return;
            }
            var count = 0;
            for (var i = 0; i < toggleStates.Length; i++)
            {
                if (toggleStates[i]) count++;
            }
            var newIds = new ushort[count];
            var idx = 0;
            for (var i = 0; i < toggleStates.Length; i++)
            {
                if (!toggleStates[i]) continue;
                const int v0MaxRow = 32;
                var oldCol = i / v0MaxRow;
                var oldRow = i % v0MaxRow;
                for (var j = 0; j < mapCellIds.Length; j++)
                {
                    if (mapColPositions[j] == oldCol && mapRowPositions[j] == oldRow)
                    {
                        newIds[idx++] = mapCellIds[j];
                        break;
                    }
                }
            }
            if (idx < count)
            {
                var trimmed = new ushort[idx];
                Array.Copy(newIds, trimmed, idx);
                selectedCellIds = trimmed;
            }
            else
            {
                selectedCellIds = newIds;
            }
            toggleStates = new bool[0];
            dataVersion = 2;
            RequestSerialization();
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
