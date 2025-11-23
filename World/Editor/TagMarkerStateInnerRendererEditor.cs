using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UdonSharpEditor;
using VRC.SDK3.Components;

namespace Narazaka.VRChat.TagMarker.World.Editor
{
    [CustomEditor(typeof(TagMarkerStateInnerRenderer), true)]
    public class TagMarkerStateInnerRendererEditor : UnityEditor.Editor
    {
        public override void OnInspectorGUI()
        {
            if (UdonSharpGUI.DrawDefaultUdonSharpBehaviourHeader(target)) return;
            base.OnInspectorGUI();
            if (!IsValid())
            {
                EditorGUILayout.HelpBox("TagMarkerOnPlayerオブジェクトの子にしてください", MessageType.Error);
            }
        }

        bool IsValid()
        {
            var component = target as TagMarkerStateInnerRenderer;
            var playerObject = component.GetComponentInParent<VRCPlayerObject>(true);
            if (playerObject == null) return false;
            return playerObject.GetComponentInChildren<TagMarkerPlayerState>(true) != null;
        }
    }
}
