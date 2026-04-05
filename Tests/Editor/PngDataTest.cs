using NUnit.Framework;
using Narazaka.VRChat.TagMarker.Editor;

namespace Narazaka.VRChat.TagMarker.Tests.Editor
{
    public class PngDataTest
    {
        [Test]
        public void Load_Version2PNG_CellIdが正しく読み取れる()
        {
            var path = "Packages/net.narazaka.vrchat.tag-marker/World/Sample/Sample.vrc-tag-marker.png";
            var data = PngData.Load(path);
            Assert.IsNotNull(data, "PNG data should not be null");
            Assert.AreEqual(2, data.version);
            Assert.IsTrue(data.cells.Length > 0, "Should have cells");
            foreach (var cell in data.cells)
            {
                if (!string.IsNullOrEmpty(cell.text))
                {
                    Assert.Greater(cell.cellId, (ushort)0, $"Cell ({cell.col},{cell.row}) '{cell.text}' should have cellId > 0");
                }
            }
        }

        [Test]
        public void Load_Version1PNG_VersionIsLessThan2()
        {
            var path = "Packages/net.narazaka.vrchat.tag-marker/World/Sample/Sample_v1.vrc-tag-marker.png";
            var data = PngData.Load(path);
            Assert.IsNotNull(data, "PNG data should not be null");
            Assert.Less(data.version, 2);
        }
    }
}
