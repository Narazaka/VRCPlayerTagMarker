using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.IO;
using Narazaka.VRChat.TagMarker.Editor;
using System.Linq;

namespace Narazaka.VRChat.TagMarker.World.Editor
{
    [CustomEditor(typeof(Runtime.TagMarker))]
    public class TagMarkerEditor : UnityEditor.Editor
    {
        SerializedProperty texture;
        SerializedProperty materialOnPlayer;
        SerializedProperty materialOnUI;
        bool details;
        SerializedProperty toggleStateSender;
        SerializedProperty toggleStateSendersColumn;
        SerializedProperty tagMarkerUI;
        SerializedProperty tagView;
        SerializedProperty tagButtonsContainer;
        SerializedProperty tagMarkerOnPlayer;
        SerializedProperty tagMarkerOnPlayerView;

        VisualData data;

        const int MAX_COL = 32;

        void OnEnable()
        {
            texture = serializedObject.FindProperty(nameof(Runtime.TagMarker.texture));
            materialOnPlayer = serializedObject.FindProperty(nameof(Runtime.TagMarker.materialOnPlayer));
            materialOnUI = serializedObject.FindProperty(nameof(Runtime.TagMarker.materialOnUI));
            toggleStateSender = serializedObject.FindProperty(nameof(Runtime.TagMarker.ToggleStateSender));
            toggleStateSendersColumn = serializedObject.FindProperty(nameof(Runtime.TagMarker.ToggleStateSendersColumn));
            tagMarkerUI = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerUI));
            tagView = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagView));
            tagButtonsContainer = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagButtonsContainer));
            tagMarkerOnPlayer = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerOnPlayer));
            tagMarkerOnPlayerView = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerOnPlayerView));
        }

        public override void OnInspectorGUI()
        {
            serializedObject.UpdateIfRequiredOrScript();
            EditorGUI.BeginChangeCheck();
            EditorGUILayout.PropertyField(texture);
            if (EditorGUI.EndChangeCheck() || data == null)
            {
                data = PngData.Load(texture.objectReferenceValue as Texture2D);
            }
            if (texture.objectReferenceValue == null)
            {
                data = null;
            }
            if (data != null)
            {
                EditorGUILayout.HelpBox("valid png", MessageType.Info);
            }
            EditorGUILayout.PropertyField(materialOnPlayer);
            EditorGUILayout.PropertyField(materialOnUI);
            if (!MaterialsIsValid)
            {
                if (GUILayout.Button("Make Materials"))
                {
                    MakeMaterials();
                }
            }
            details = EditorGUILayout.Foldout(details, "Details");
            if (details)
            {
                EditorGUILayout.PropertyField(toggleStateSender);
                EditorGUILayout.PropertyField(toggleStateSendersColumn);
                EditorGUILayout.PropertyField(tagMarkerUI);
                EditorGUILayout.PropertyField(tagView);
                EditorGUILayout.PropertyField(tagButtonsContainer);
                EditorGUILayout.PropertyField(tagMarkerOnPlayer);
                EditorGUILayout.PropertyField(tagMarkerOnPlayerView);
            }
            serializedObject.ApplyModifiedProperties();

            EditorGUI.BeginDisabledGroup(data == null || !MaterialsIsValid);
            if (GUILayout.Button("Setup"))
            {
                Setup();
            }
            EditorGUI.EndDisabledGroup();
        }

        bool MaterialsIsValid => materialOnPlayer.objectReferenceValue != null && materialOnUI.objectReferenceValue != null;

        void MakeMaterials()
        {
            var onPlayer = materialOnPlayer.objectReferenceValue as Material;
            var onUI = materialOnUI.objectReferenceValue as Material;
            if (onPlayer == null)
            {
                var tex = texture.objectReferenceValue as Texture2D;
                var texParentPath = Path.GetDirectoryName(AssetDatabase.GetAssetPath(tex));
                var matPath = EditorUtility.SaveFilePanelInProject("material", Regex.Replace(tex.name, @"\.vrc-tag-marker", ""), "mat", "", texParentPath);
                if (string.IsNullOrEmpty(matPath))
                {
                    return;
                }
                onPlayer = new Material(shader);
                AssetDatabase.CreateAsset(onPlayer, matPath);
                materialOnPlayer.objectReferenceValue = onPlayer;
            }
            if (onUI == null)
            {
                var matPath = AssetDatabase.GetAssetPath(onPlayer);
                matPath = Regex.Replace(matPath, @"\.mat$", "_UI.mat");
                onUI = new Material(onPlayer);
                onUI.parent = onPlayer;
                AssetDatabase.CreateAsset(onUI, matPath);
                materialOnUI.objectReferenceValue = onUI;
            }
            AssetDatabase.Refresh();
            Setup();
        }

        void Setup()
        {
            var tex = texture.objectReferenceValue as Texture2D;
            var textureImporter = AssetImporter.GetAtPath(AssetDatabase.GetAssetPath(tex)) as TextureImporter;
            if (!textureImporter.alphaIsTransparency)
            {
                textureImporter.alphaIsTransparency = true;
                textureImporter.SaveAndReimport();
            }

            var onPlayer = materialOnPlayer.objectReferenceValue as Material;
            var onUI = materialOnUI.objectReferenceValue as Material;
            onPlayer.SetTexture("_MainTex", tex);
            onPlayer.SetFloat("_TagDataColCount", data.col);
            onPlayer.SetFloat("_TagDataRowCount", data.row);
            EditorUtility.SetDirty(onPlayer);
            onUI.SetFloat("_Billboard", 0);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "VR_BILLBOARD_ENABLE_BILLBOARD"), false);
            onUI.SetFloat("_DISPLAY", 0);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_FIXED"), true);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_ALIGN_ROW"), false);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_ALIGN_COL"), false);
            EditorUtility.SetDirty(onUI);

            var size = data.size;
            var tagMarker = target as Runtime.TagMarker;

            var uiTranform = tagMarker.tagMarkerUI.transform;
            Undo.RecordObject(uiTranform, "Set TagMarker UI Transform");
            uiTranform.localScale = new Vector3(size.x, size.y, 1f);
            Undo.RecordObject(tagMarker.tagView, "Set TagMarker UI Material");
            tagMarker.tagView.sharedMaterial = onUI;
            Undo.RecordObject(tagMarker.tagMarkerOnPlayerView, "Set TagMarker On Player View Material");
            tagMarker.tagMarkerOnPlayerView.sharedMaterial = onPlayer;
            var onPlayerViewTransform = tagMarker.tagMarkerOnPlayerView.transform;
            Undo.RecordObject(onPlayerViewTransform, "Set TagMarker On Player View Transform");
            onPlayerViewTransform.localScale = new Vector3(size.x, size.y, size.x);

            var toDeletes = new List<GameObject>();
            foreach (Transform child in tagMarker.tagButtonsContainer)
            {
                toDeletes.Add(child.gameObject);
            }
            foreach (var item in toDeletes)
            {
                Undo.DestroyObjectImmediate(item);
            }

            var activeCells = data.cells.Where(c => !string.IsNullOrEmpty(c.text)).Select(c => (c.col, c.row)).ToHashSet();
            for (var c = 0; c < data.col; c++)
            {
                var buttonsCol = PrefabUtility.InstantiatePrefab(tagMarker.ToggleStateSendersColumn, tagMarker.tagButtonsContainer) as GameObject;
                for (var r = 0; r < data.row; r++)
                {
                    var button = PrefabUtility.InstantiatePrefab(tagMarker.ToggleStateSender, buttonsCol.transform) as GameObject;
                    button.name = $"ToggleStateSender_{c}_{r}";
                    button.GetComponent<UnityEngine.UI.Button>().interactable = activeCells.Contains((c, r));
                    var sender = button.GetComponent<ToggleStateSender>();
                    var so = new SerializedObject(sender);
                    so.FindProperty("ui").objectReferenceValue = tagMarker.tagMarkerUI;
                    so.FindProperty("index").intValue = c * MAX_COL + r;
                    so.ApplyModifiedPropertiesWithoutUndo();
                }
                Undo.RegisterCreatedObjectUndo(buttonsCol, "Create ToggleStateSenders");
            }
        }

        static Shader _shader = null;
        public static Shader shader
        {
            get
            {
                if (_shader == null)
                {
                    _shader = Shader.Find("VRCPlayerTagMarker/TagMarker");
                }
                return _shader;
            }
        }
    }
}
