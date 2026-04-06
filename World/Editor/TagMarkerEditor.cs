using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.IO;
using Narazaka.VRChat.TagMarker.Editor;
using System.Linq;

[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("Narazaka.VRChat.TagMarker.Tests.Editor")]

namespace Narazaka.VRChat.TagMarker.World.Editor
{
    [CustomEditor(typeof(Runtime.TagMarker))]
    public class TagMarkerEditor : UnityEditor.Editor
    {
        SerializedProperty texture;
        SerializedProperty materialBase;
        SerializedProperty materialOnPlayer;
        SerializedProperty materialOnUI;

        bool details;

        SerializedProperty tagMarkerPlayerState;
        SerializedProperty toggleStateSender;
        SerializedProperty toggleStateSendersColumn;
        SerializedProperty tagMarkerUIRendererPath;
        SerializedProperty tagMarkerUITagButtonsContainerPath;

        VisualData data;

        const int MAX_COL = 32;

        void OnEnable()
        {
            texture = serializedObject.FindProperty(nameof(Runtime.TagMarker.texture));
            materialBase = serializedObject.FindProperty(nameof(Runtime.TagMarker.materialBase));
            materialOnPlayer = serializedObject.FindProperty(nameof(Runtime.TagMarker.materialOnPlayer));
            materialOnUI = serializedObject.FindProperty(nameof(Runtime.TagMarker.materialOnUI));

            tagMarkerPlayerState = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerPlayerState));
            toggleStateSender = serializedObject.FindProperty(nameof(Runtime.TagMarker.ToggleStateSender));
            toggleStateSendersColumn = serializedObject.FindProperty(nameof(Runtime.TagMarker.ToggleStateSendersColumn));
            tagMarkerUIRendererPath = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerUIRendererPath));
            tagMarkerUITagButtonsContainerPath = serializedObject.FindProperty(nameof(Runtime.TagMarker.tagMarkerUITagButtonsContainerPath));
        }

        public override void OnInspectorGUI()
        {
            serializedObject.UpdateIfRequiredOrScript();
            if (GUILayout.Button("タグを編集する (Webサイトを開きます)"))
            {
                Application.OpenURL("https://vrc-tag-marker.narazaka.net");
            }
            EditorGUILayout.HelpBox("ブラウザでタグを設定し、画像をダウンロードしてTexture欄に設定してください。", MessageType.Info);
            EditorGUI.BeginChangeCheck();
            EditorGUILayout.PropertyField(texture);
            if (EditorGUI.EndChangeCheck() || data == null)
            {
                data = PngData.Load(texture.objectReferenceValue as Texture2D);
            }
            if (texture.objectReferenceValue == null)
            {
                data = null;
                EditorGUILayout.HelpBox("テクスチャを設定してください", MessageType.Warning);
            }
            else
            {
                if (data == null)
                {
                    EditorGUILayout.HelpBox("PNGにタグデータが含まれていません", MessageType.Error);
                }
                else if (data.version < 2)
                {
                    EditorGUILayout.HelpBox("このPNGは旧形式です。「タグを編集する」ボタンからWebサイトを開き、PNGを読み込んで再度ダウンロードしてください。", MessageType.Error);
                    data = null;
                }
                else
                {
                    EditorGUILayout.HelpBox("タグデータ付きPNGです", MessageType.Info);
                }
            }
            EditorGUILayout.PropertyField(materialBase);
            EditorGUILayout.PropertyField(materialOnPlayer);
            EditorGUILayout.PropertyField(materialOnUI);
            if (!MaterialsIsValid)
            {
                EditorGUI.BeginDisabledGroup(data == null);
                if (GUILayout.Button("Make Materials"))
                {
                    MakeMaterials();
                }
                EditorGUI.EndDisabledGroup();
            }

            EditorGUILayout.Space();

            details = EditorGUILayout.Foldout(details, "Details");
            if (details)
            {
                EditorGUILayout.PropertyField(tagMarkerPlayerState);
                EditorGUILayout.PropertyField(toggleStateSender);
                EditorGUILayout.PropertyField(toggleStateSendersColumn);
                EditorGUILayout.PropertyField(tagMarkerUIRendererPath);
                EditorGUILayout.PropertyField(tagMarkerUITagButtonsContainerPath);
            }
            serializedObject.ApplyModifiedProperties();

            if (tagMarkerPlayerState.objectReferenceValue != null)
            {
                var playerStateSo = new SerializedObject(tagMarkerPlayerState.objectReferenceValue);
                var skipMigrationProp = playerStateSo.FindProperty("skipMigration");
                playerStateSo.Update();
                EditorGUILayout.PropertyField(skipMigrationProp, new GUIContent("旧データからの移行をスキップ"));
                if (skipMigrationProp.boolValue)
                {
                    EditorGUILayout.HelpBox("ONにすると、旧形式のタグ選択データを新形式に移行せず、リセットします。タグ構成を大幅に変更して旧データとの対応が取れない場合に使用してください。", MessageType.Warning);
                }
                playerStateSo.ApplyModifiedProperties();
            }

            EditorGUI.BeginDisabledGroup(data == null || !MaterialsIsValid);
            if (GUILayout.Button("Setup"))
            {
                Setup();
            }
            EditorGUI.EndDisabledGroup();
        }

        bool MaterialsIsValid => materialBase.objectReferenceValue != null && materialOnPlayer.objectReferenceValue != null && materialOnUI.objectReferenceValue != null;

        void MakeMaterials()
        {
            var onBase = materialBase.objectReferenceValue as Material;
            var onPlayer = materialOnPlayer.objectReferenceValue as Material;
            var onUI = materialOnUI.objectReferenceValue as Material;
            if (onBase == null)
            {
                var tex = texture.objectReferenceValue as Texture2D;
                var texParentPath = Path.GetDirectoryName(AssetDatabase.GetAssetPath(tex));
                var matPath = EditorUtility.SaveFilePanelInProject("material", tex.name, "mat", "", texParentPath);
                if (string.IsNullOrEmpty(matPath))
                {
                    return;
                }
                onBase = new Material(shader);
                AssetDatabase.CreateAsset(onBase, matPath);
                materialBase.objectReferenceValue = onBase;
            }
            if (onPlayer == null)
            {
                var matPath = AssetDatabase.GetAssetPath(onBase);
                matPath = Regex.Replace(matPath, @"\.mat$", "_OnPlayer.mat");
                onPlayer = new Material(onBase);
                onPlayer.parent = onBase;
                AssetDatabase.CreateAsset(onPlayer, matPath);
                materialOnPlayer.objectReferenceValue = onPlayer;
            }
            if (onUI == null)
            {
                var matPath = AssetDatabase.GetAssetPath(onBase);
                matPath = Regex.Replace(matPath, @"\.mat$", "_UI.mat");
                onUI = new Material(onBase);
                onUI.parent = onBase;
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

            var onBase = materialBase.objectReferenceValue as Material;
            var onPlayer = materialOnPlayer.objectReferenceValue as Material;
            var onUI = materialOnUI.objectReferenceValue as Material;
            onBase.SetTexture("_MainTex", tex);
            onBase.SetFloat("_TagDataColCount", data.col);
            onBase.SetFloat("_TagDataRowCount", data.row);
            onBase.SetFloat("_Billboard", 0);
            onBase.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "VR_BILLBOARD_ENABLE_BILLBOARD"), false);
            onBase.enableInstancing = true;
            EditorUtility.SetDirty(onBase);
            onPlayer.SetFloat("_Billboard", 1);
            onPlayer.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "VR_BILLBOARD_ENABLE_BILLBOARD"), true);
            EditorUtility.SetDirty(onPlayer);
            onUI.SetFloat("_Billboard", 0);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "VR_BILLBOARD_ENABLE_BILLBOARD"), false);
            onUI.SetFloat("_DISPLAY", 0);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_FIXED"), true);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_ALIGN_ROW"), false);
            onUI.SetKeyword(new UnityEngine.Rendering.LocalKeyword(shader, "_DISPLAY_ALIGN_COL"), false);
            EditorUtility.SetDirty(onUI);

            // Build mapping tables from PNG data
            BuildMappingTables(data.cells, out var mapCellIds, out var mapColPositions, out var mapRowPositions);

            var size = data.size;
            var tagMarker = target as Runtime.TagMarker;

            // Inject mapping tables into TagMarkerPlayerState
            var tagMarkerPlayerStateSo = new SerializedObject(tagMarker.tagMarkerPlayerState);
            tagMarkerPlayerStateSo.FindProperty("mapCellIds").ClearArray();
            for (var i = 0; i < mapCellIds.Length; i++)
            {
                tagMarkerPlayerStateSo.FindProperty("mapCellIds").InsertArrayElementAtIndex(i);
                tagMarkerPlayerStateSo.FindProperty("mapCellIds").GetArrayElementAtIndex(i).intValue = mapCellIds[i];
            }
            tagMarkerPlayerStateSo.FindProperty("mapColPositions").ClearArray();
            for (var i = 0; i < mapColPositions.Length; i++)
            {
                tagMarkerPlayerStateSo.FindProperty("mapColPositions").InsertArrayElementAtIndex(i);
                tagMarkerPlayerStateSo.FindProperty("mapColPositions").GetArrayElementAtIndex(i).intValue = mapColPositions[i];
            }
            tagMarkerPlayerStateSo.FindProperty("mapRowPositions").ClearArray();
            for (var i = 0; i < mapRowPositions.Length; i++)
            {
                tagMarkerPlayerStateSo.FindProperty("mapRowPositions").InsertArrayElementAtIndex(i);
                tagMarkerPlayerStateSo.FindProperty("mapRowPositions").GetArrayElementAtIndex(i).intValue = mapRowPositions[i];
            }
            tagMarkerPlayerStateSo.ApplyModifiedProperties();

            var tagMarkerUIs = tagMarker.GetComponentsInChildren<TagMarkerUI>(true);
            var tagMarkerRenders = tagMarker.GetComponentsInChildren<TagMarkerRenderer>(true).Where(c => !tagMarkerUIs.Contains(c)).ToArray();

            foreach (var tagMarkerRender in tagMarkerRenders)
            {
                var tagMarkerRenderSo = new SerializedObject(tagMarkerRender);
                var renderer = tagMarkerRenderSo.FindProperty("_renderer").objectReferenceValue as Renderer;
                Undo.RecordObject(renderer, "Set TagMarker Renderer Material");
                if (tagMarkerRender is TagMarkerViewOnPlayer)
                {
                    renderer.sharedMaterial = onPlayer;
                }
                else if (tagMarkerRender is TagMarkerView && (tagMarkerRender as TagMarkerView).showAll)
                {
                    renderer.sharedMaterial = onUI;
                }
                else
                {
                    renderer.sharedMaterial = onBase;
                }
                var onPlayerViewTransform = renderer.transform;
                Undo.RecordObject(onPlayerViewTransform, "Set TagMarker Renderer Transform");
                onPlayerViewTransform.localScale = new Vector3(size.x, size.y, size.x);
                if (tagMarkerRender is TagMarkerStateInnerRenderer)
                {
                    tagMarkerRenderSo.FindProperty("_tagMarkerPlayerState").objectReferenceValue = tagMarker.tagMarkerPlayerState;
                    tagMarkerRenderSo.ApplyModifiedProperties();
                }
            }

            foreach (var tagMarkerUI in tagMarkerUIs)
            {
                var tagMarkerUISo = new SerializedObject(tagMarkerUI);
                tagMarkerUISo.FindProperty("tagMarkerPlayerStateInPrefab").objectReferenceValue = tagMarker.tagMarkerPlayerState;
                tagMarkerUISo.ApplyModifiedProperties();
                var uiTranform = tagMarkerUI.transform;
                Undo.RecordObject(uiTranform, "Set TagMarker UI Transform");
                uiTranform.localScale = new Vector3(size.x, size.y, 1f);
                var tagView = tagMarkerUI.transform.Find(tagMarker.tagMarkerUIRendererPath).GetComponent<Renderer>();
                Undo.RecordObject(tagView, "Set TagMarker UI Material");
                tagView.sharedMaterial = onUI;

                var tagButtonsContainer = tagMarkerUI.transform.Find(tagMarker.tagMarkerUITagButtonsContainerPath);

                var toDeletes = new List<GameObject>();
                foreach (Transform child in tagButtonsContainer)
                {
                    toDeletes.Add(child.gameObject);
                }
                foreach (var item in toDeletes)
                {
                    Undo.DestroyObjectImmediate(item);
                }

                var activeCellSet = data.cells.Where(c => !string.IsNullOrEmpty(c.text)).ToDictionary(c => (c.col, c.row), c => c.cellId);
                for (var c = 0; c < data.col; c++)
                {
                    var buttonsCol = PrefabUtility.InstantiatePrefab(tagMarker.ToggleStateSendersColumn, tagButtonsContainer) as GameObject;
                    for (var r = 0; r < data.row; r++)
                    {
                        var button = PrefabUtility.InstantiatePrefab(tagMarker.ToggleStateSender, buttonsCol.transform) as GameObject;
                        button.name = $"ToggleStateSender_{c}_{r}";
                        var hasCell = activeCellSet.TryGetValue((c, r), out var btnCellId);
                        button.GetComponent<UnityEngine.UI.Button>().interactable = hasCell;
                        var sender = button.GetComponent<ToggleStateSender>();
                        var so = new SerializedObject(sender);
                        so.FindProperty("ui").objectReferenceValue = tagMarkerUI;
                        so.FindProperty("cellId").intValue = hasCell ? btnCellId : 0;
                        so.ApplyModifiedPropertiesWithoutUndo();
                    }
                    Undo.RegisterCreatedObjectUndo(buttonsCol, "Create ToggleStateSenders");
                }
            }
        }

        internal static void BuildMappingTables(
            VisualData.CellProp[] cells,
            out ushort[] mapCellIds,
            out byte[] mapColPositions,
            out byte[] mapRowPositions)
        {
            var activeCells = cells.Where(c => !string.IsNullOrEmpty(c.text)).ToArray();
            mapCellIds = activeCells.Select(c => c.cellId).ToArray();
            mapColPositions = activeCells.Select(c => (byte)c.col).ToArray();
            mapRowPositions = activeCells.Select(c => (byte)c.row).ToArray();
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
