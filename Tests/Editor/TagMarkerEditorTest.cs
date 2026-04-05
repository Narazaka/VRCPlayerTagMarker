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
    }
}
