using NUnit.Framework;
using Narazaka.VRChat.TagMarker.Editor;
using Narazaka.VRChat.TagMarker.World.Editor;

namespace Narazaka.VRChat.TagMarker.Tests.Editor
{
    public class TagMarkerEditorTest
    {
        [Test]
        public void BuildMappingTables_アクティブセルのみマッピングされる()
        {
            var cells = new[]
            {
                new VisualData.CellProp { col = 0, row = 0, text = "hello", cellId = 10 },
                new VisualData.CellProp { col = 1, row = 0, text = "", cellId = 20 },
                new VisualData.CellProp { col = 0, row = 1, text = "world", cellId = 30 },
            };

            TagMarkerEditor.BuildMappingTables(cells, out var mapCellIds, out var mapColPositions, out var mapRowPositions);

            Assert.AreEqual(2, mapCellIds.Length);
            Assert.AreEqual(10, mapCellIds[0]);
            Assert.AreEqual(30, mapCellIds[1]);
            Assert.AreEqual(0, mapColPositions[0]);
            Assert.AreEqual(0, mapColPositions[1]);
            Assert.AreEqual(0, mapRowPositions[0]);
            Assert.AreEqual(1, mapRowPositions[1]);
        }

        [Test]
        public void BuildMappingTables_空セルのみの場合は空配列()
        {
            var cells = new[]
            {
                new VisualData.CellProp { col = 0, row = 0, text = "", cellId = 10 },
            };

            TagMarkerEditor.BuildMappingTables(cells, out var mapCellIds, out var mapColPositions, out var mapRowPositions);

            Assert.AreEqual(0, mapCellIds.Length);
            Assert.AreEqual(0, mapColPositions.Length);
            Assert.AreEqual(0, mapRowPositions.Length);
        }

        [Test]
        public void GetLayoutKeyword_8列以下は8x32()
        {
            Assert.AreEqual("_TAG_LAYOUT_L8X32", TagMarkerEditor.GetLayoutKeyword(1, 4));
            Assert.AreEqual("_TAG_LAYOUT_L8X32", TagMarkerEditor.GetLayoutKeyword(8, 32));
            Assert.AreEqual("_TAG_LAYOUT_L8X32", TagMarkerEditor.GetLayoutKeyword(8, 16));
        }

        [Test]
        public void GetLayoutKeyword_16列以下かつ16行以下は16x16()
        {
            Assert.AreEqual("_TAG_LAYOUT_L16X16", TagMarkerEditor.GetLayoutKeyword(9, 16));
            Assert.AreEqual("_TAG_LAYOUT_L16X16", TagMarkerEditor.GetLayoutKeyword(16, 16));
            Assert.AreEqual("_TAG_LAYOUT_L16X16", TagMarkerEditor.GetLayoutKeyword(16, 1));
        }

        [Test]
        public void GetLayoutKeyword_16列以下かつ17行以上は16x32()
        {
            Assert.AreEqual("_TAG_LAYOUT_L16X32", TagMarkerEditor.GetLayoutKeyword(9, 17));
            Assert.AreEqual("_TAG_LAYOUT_L16X32", TagMarkerEditor.GetLayoutKeyword(16, 32));
        }
    }
}
