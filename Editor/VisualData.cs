using System;
using System.Runtime.CompilerServices;
using UnityEngine;
using UnityEngine.Serialization;
using UnityEditor;
using System.Linq;
using System.Collections.Generic;
using static UnityEngine.UIElements.UxmlAttributeDescription;

[assembly: InternalsVisibleTo("Narazaka.VRChat.TagMarker.World.Editor")]

namespace Narazaka.VRChat.TagMarker.Editor
{
    [CreateAssetMenu]
    public class VisualData : ScriptableObject
    {
        [SerializeField] internal int version = 1;
        [SerializeField] internal Texture2D mainTex;
        [SerializeField] internal int col = 3;
        [SerializeField] internal int row = 4;
        [SerializeField] internal int cellWidth = 256;
        [SerializeField] internal int cellHeight = 64;
        [SerializeField] internal int spacing = 6;
        [SerializeField] internal VisualProps baseVisual;
        [SerializeField] internal PartialVisualProps[] colVisuals;
        [SerializeField] internal PartialVisualProps[] rowVisuals;
        [SerializeField] internal CellProp[] cells;

        [CustomEditor(typeof(VisualData))]
        public class VisualDataEditor : UnityEditor.Editor
        {
            public override void OnInspectorGUI()
            {
                base.OnInspectorGUI();
                if (GUILayout.Button("Json"))
                {
                    Debug.Log(JsonUtility.ToJson(target));
                    Debug.Log(EditorJsonUtility.ToJson(target));
                }
            }
        }

        [Serializable]
        public class VisualProps
        {
            public Color TextColor
            {
                get => ColorUtility.TryParseHtmlString(textColor, out var color) ? color : Color.white;
                set => textColor = "#" + ColorUtility.ToHtmlStringRGB(value);
            }
            [SerializeField] internal string textColor = "#ffffff";
            public Color BackgroundColor
            {
                get => ColorUtility.TryParseHtmlString(backgroundColor, out var color) ? color : Color.gray;
                set => backgroundColor = "#" + ColorUtility.ToHtmlStringRGB(value);
            }
            [SerializeField] internal string backgroundColor = "#666666";
            public Color OutlineColor
            {
                get => ColorUtility.TryParseHtmlString(outlineColor, out var color) ? color : Color.black;
                set => outlineColor = "#" + ColorUtility.ToHtmlStringRGB(value);
            }
            [SerializeField] internal string outlineColor = "#000000";
            public int outlineWidth = 7;
            public OutlineType OutlineType
            {
                get => (OutlineType)Enum.Parse(typeof(OutlineType), outlineType);
                set => outlineType = value.ToString();
            }
            [SerializeField] internal string outlineType = OutlineType.blur.ToString();
            public int fontSize = 24;
            public string fontFamily = "Rounded Mgen+ 1p heavy";
            public FontWeight FontWeight
            {
                get => (FontWeight)Enum.Parse(typeof(FontWeight), fontWeight);
                set => fontWeight = value.ToString();
            }
            [SerializeField] internal string fontWeight = FontWeight.normal.ToString();
            public TextAlign TextAlign
            {
                get => (TextAlign)Enum.Parse(typeof(TextAlign), textAlign);
                set => textAlign = value.ToString();
            }
            [SerializeField] internal string textAlign = TextAlign.center.ToString();
            public TextBaseline TextBaseline
            {
                get => (TextBaseline)Enum.Parse(typeof(TextBaseline), textBaseline);
                set => textBaseline = value.ToString();
            }
            [SerializeField] internal string textBaseline = TextBaseline.middle.ToString();
            public float lineHeight = 1.3f;
            public float scaleX = 1;
            public bool charWrap = true;

            [CustomPropertyDrawer(typeof(VisualProps))]
            public class VisualPropsDrawer : PropertyDrawer
            {
                static Dictionary<string, Type> enumParams = new Dictionary<string, Type>
                {
                    { nameof(VisualProps.outlineType), typeof(OutlineType) },
                    { nameof(VisualProps.fontWeight), typeof(FontWeight) },
                    { nameof(VisualProps.textAlign), typeof(TextAlign) },
                    { nameof(VisualProps.textBaseline), typeof(TextBaseline) }
                };
                static HashSet<string> colorParams = new HashSet<string>
                {
                    nameof(VisualProps.textColor),
                    nameof(VisualProps.backgroundColor),
                    nameof(VisualProps.outlineColor)
                };

                protected static bool IsEnumType(SerializedProperty property, out Type enumType)
                {
                    return enumParams.TryGetValue(property.name, out enumType);
                }

                protected static bool IsColorType(SerializedProperty property)
                {
                    return colorParams.Contains(property.name);
                }

                public override void OnGUI(Rect position, UnityEditor.SerializedProperty property, GUIContent label)
                {
                    position.height = EditorGUIUtility.singleLineHeight;
                    EditorGUI.BeginProperty(position, label, property);
                    property.isExpanded = EditorGUI.Foldout(position, property.isExpanded, label);
                    if (!property.isExpanded)
                    {
                        EditorGUI.EndProperty();
                        return;
                    }
                    position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    EditorGUI.indentLevel++;
                    position = DrawCustomProperty(position, property, label);
                    foreach (SerializedProperty prop in property.Copy())
                    {
                        if (IsIgnoreProperty(prop))
                        {
                            continue;
                        }
                        position = DrawProperty(position, property, prop);
                    }
                    EditorGUI.indentLevel--;
                    EditorGUI.EndProperty();
                }

                public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
                {
                    return EditorGUI.GetPropertyHeight(property, label, true);
                }

                protected virtual Rect DrawProperty(Rect position, SerializedProperty parentProperty, SerializedProperty property)
                {
                    if (IsEnumType(property, out var enumType))
                    {
                        var propLabel = new GUIContent(property.displayName);
                        EditorGUI.BeginProperty(position, propLabel, property);
                        if (!Enum.TryParse(enumType, property.stringValue, out var enumValue))
                        {
                            enumValue = Enum.GetValues(enumType).GetValue(0);
                        }
                        property.stringValue = Enum.GetName(enumType, EditorGUI.EnumPopup(position, propLabel, (Enum)enumValue));
                        EditorGUI.EndProperty();
                    }
                    else if (IsColorType(property))
                    {
                        var propLabel = new GUIContent(property.displayName);
                        EditorGUI.BeginProperty(position, propLabel, property);
                        if (ColorUtility.TryParseHtmlString(property.stringValue, out var color))
                        {
                            color = EditorGUI.ColorField(position, propLabel, color);
                            property.stringValue = "#" + ColorUtility.ToHtmlStringRGB(color);
                        }
                        else
                        {
                            EditorGUI.PropertyField(position, property);
                        }
                        EditorGUI.EndProperty();
                    }
                    else
                    {
                        EditorGUI.PropertyField(position, property);
                    }
                    position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    return position;
                }

                protected virtual bool IsIgnoreProperty(SerializedProperty property) => false;

                protected virtual Rect DrawCustomProperty(Rect position, SerializedProperty property, GUIContent label)
                {
                    return position;
                }
            }
        }

        [Serializable]
        public class PartialVisualProps : VisualProps
        {
            public bool useTextColor = true;
            public bool useBackgroundColor = true;
            public bool useOutlineColor = true;
            public bool useOutlineWidth = true;
            public bool useOutlineType = true;
            public bool useFontSize = true;
            public bool useFontFamily = true;
            public bool useFontWeight = true;
            public bool useTextAlign = true;
            public bool useTextBaseline = true;
            public bool useLineHeight = true;
            public bool useScaleX = true;
            public bool useCharWrap = true;

            [CustomPropertyDrawer(typeof(PartialVisualProps))]
            public class PartialVisualPropsDrawer : VisualPropsDrawer
            {

                public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
                {
                    return (EditorGUI.GetPropertyHeight(property, label, true) + EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing * 2) / 2;
                }

                protected override Rect DrawProperty(Rect position, SerializedProperty parentProperty, SerializedProperty property)
                {
                    var propName = property.name;
                    var usePropPos = position;
                    usePropPos.width = EditorGUIUtility.singleLineHeight;
                    var usePropName = "use" + propName.Substring(0, 1).ToUpper() + propName.Substring(1);
                    var useProp = parentProperty.FindPropertyRelative(usePropName);
                    EditorGUI.PropertyField(usePropPos, useProp, GUIContent.none);
                    EditorGUI.BeginDisabledGroup(useProp.boolValue == false);
                    var propPosition = position;
                    propPosition.xMin += EditorGUIUtility.singleLineHeight + 2;
                    propPosition = base.DrawProperty(propPosition, parentProperty, property);
                    EditorGUI.EndDisabledGroup();
                    position.y = propPosition.y;
                    return position;
                }

                protected override bool IsIgnoreProperty(SerializedProperty property)
                {
                    return property.name.StartsWith("use") || base.IsIgnoreProperty(property);
                }
            }
        }

        [Serializable]
        public class CellProp : PartialVisualProps
        {
            public int col;
            public int row;
            public string text;

            [CustomPropertyDrawer(typeof(CellProp))]
            public class CellPropDrawer : PartialVisualPropsDrawer
            {
                static string[] ignoreProps = new string[]
                {
                    nameof(CellProp.col),
                    nameof(CellProp.row),
                    nameof(CellProp.text)
                };
                protected override Rect DrawCustomProperty(Rect position, SerializedProperty property, GUIContent label)
                {
                    EditorGUI.PropertyField(position, property.FindPropertyRelative(nameof(CellProp.col)));
                    position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    EditorGUI.PropertyField(position, property.FindPropertyRelative(nameof(CellProp.row)));
                    position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    EditorGUI.PropertyField(position, property.FindPropertyRelative(nameof(CellProp.text)));
                    position.y += EditorGUIUtility.singleLineHeight + EditorGUIUtility.standardVerticalSpacing;
                    return position;
                }

                protected override bool IsIgnoreProperty(SerializedProperty property)
                {
                    return ignoreProps.Contains(property.name) || base.IsIgnoreProperty(property);
                }

                public override float GetPropertyHeight(SerializedProperty property, GUIContent label)
                {
                    return property.isExpanded ? (EditorGUI.GetPropertyHeight(property, label, true) + EditorGUIUtility.singleLineHeight * 4 + EditorGUIUtility.standardVerticalSpacing * 5) / 2 : EditorGUI.GetPropertyHeight(property, label, true);
                }
            }
        }

        public enum OutlineType
        {
            thick,
            blur
        }

        public enum FontWeight
        {
            normal,
            bold,
        }

        public enum TextAlign
        {
            left,
            center,
            right,
        }

        public enum TextBaseline
        {
            top,
            middle,
            bottom,
        }
    }
}
