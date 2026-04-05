using UdonSharp;
using UnityEngine;
using Koyashiro.UdonTest;

namespace Narazaka.VRChat.TagMarker.World.Tests
{
    [UdonBehaviourSyncMode(BehaviourSyncMode.None)]
    public class TagMarkerPlayerStateTest : UdonSharpBehaviour
    {
        [SerializeField] TagMarkerPlayerState playerState;

        void Start()
        {
            Test_ToggleState_ON();
            Test_ToggleState_OFF();
            Test_GetToggleStatesForRenderer();
            Test_GetToggleStatesForRenderer_UnknownCellIdIgnored();
            Test_MigrateFromV0();
            Test_MigrateFromV0_SkippedWhenVersion2();
            Test_MigrateFromV0_UnmappedPositionSkipped();
        }

        void Test_ToggleState_ON()
        {
            Debug.Log("[Test] Test_ToggleState_ON");
            playerState.selectedCellIds = new ushort[0];
            playerState._ToggleState(10);
            Assert.Equal(new ushort[] { 10 }, playerState.selectedCellIds, this);
        }

        void Test_ToggleState_OFF()
        {
            Debug.Log("[Test] Test_ToggleState_OFF");
            playerState.selectedCellIds = new ushort[] { 10, 20 };
            playerState._ToggleState(10);
            Assert.Equal(new ushort[] { 20 }, playerState.selectedCellIds, this);
        }

        void Test_GetToggleStatesForRenderer()
        {
            Debug.Log("[Test] Test_GetToggleStatesForRenderer");
            playerState.selectedCellIds = new ushort[] { 200 };
            var states = playerState._GetToggleStatesForRenderer();
            Assert.False(states[0], this);
            Assert.True(states[1], this);
            Assert.False(states[2], this);
        }

        void Test_GetToggleStatesForRenderer_UnknownCellIdIgnored()
        {
            Debug.Log("[Test] Test_GetToggleStatesForRenderer_UnknownCellIdIgnored");
            playerState.selectedCellIds = new ushort[] { 999 };
            var states = playerState._GetToggleStatesForRenderer();
            for (var i = 0; i < states.Length; i++)
            {
                Assert.False(states[i], this);
            }
        }

        void Test_MigrateFromV0()
        {
            Debug.Log("[Test] Test_MigrateFromV0");
            playerState.dataVersion = 0;
            var ts = new bool[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];
            ts[0 * TagMarkerConstants.MaxRow + 0] = true;
            ts[1 * TagMarkerConstants.MaxRow + 0] = true;
            playerState.toggleStates = ts;
            playerState.selectedCellIds = new ushort[0];

            playerState._MigrateFromV0();

            Assert.Equal((ushort)2, playerState.dataVersion, this);
            Assert.Equal(0, playerState.toggleStates.Length, this);
            Assert.Equal(2, playerState.selectedCellIds.Length, this);
            var found100 = false;
            var found200 = false;
            for (var i = 0; i < playerState.selectedCellIds.Length; i++)
            {
                if (playerState.selectedCellIds[i] == 100) found100 = true;
                if (playerState.selectedCellIds[i] == 200) found200 = true;
            }
            Assert.True(found100, this);
            Assert.True(found200, this);
        }

        void Test_MigrateFromV0_SkippedWhenVersion2()
        {
            Debug.Log("[Test] Test_MigrateFromV0_SkippedWhenVersion2");
            playerState.dataVersion = 2;
            playerState.selectedCellIds = new ushort[] { 42 };
            playerState._MigrateFromV0();
            Assert.Equal(new ushort[] { 42 }, playerState.selectedCellIds, this);
        }

        void Test_MigrateFromV0_UnmappedPositionSkipped()
        {
            Debug.Log("[Test] Test_MigrateFromV0_UnmappedPositionSkipped");
            playerState.dataVersion = 0;
            var ts = new bool[TagMarkerConstants.MaxCol * TagMarkerConstants.MaxRow];
            ts[7 * TagMarkerConstants.MaxRow + 31] = true;
            playerState.toggleStates = ts;
            playerState.selectedCellIds = new ushort[0];

            playerState._MigrateFromV0();

            Assert.Equal((ushort)2, playerState.dataVersion, this);
            Assert.Equal(0, playerState.selectedCellIds.Length, this);
        }
    }
}
