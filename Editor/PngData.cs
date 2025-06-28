using UnityEngine;
using UnityEditor;
using System.IO;
using System;
using System.Linq;

namespace Narazaka.VRChat.TagMarker.Editor
{
    public static class PngData
    {
        const int PNG_SIGNATURE_SIZE = 8;
        const int IHDR_SIZE = 25;
        const int CHUNK_TYPE_SIZE = 4;
        static byte[] target_chunk_keyword = "vrcTagMarkerDataUnity\0".Select(c => (byte)c).ToArray();
        static int CHUNK_KEYWORD_SIZE = target_chunk_keyword.Length;
        const int CHUNK_ITXT_BEFORE_VALUE_SIZE = 4;
        const int CHUNK_CRC_SIZE = 4;

        static byte[] png_signature = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
        static byte[] chunk_itxt_before_value_signature = new byte[] { 0, 0, 0, 0 };
        static byte[] chunk_type_iTXt = "iTXt".Select(c => (byte)c).ToArray();
        static byte[] chunk_type_IEND = "IEND".Select(c => (byte)c).ToArray();

        public static VisualData Load(FileStream file)
        {
            file.Seek(0, SeekOrigin.Begin);
            byte[] png_signature_buf = new byte[PNG_SIGNATURE_SIZE];
            file.Read(png_signature_buf, 0, PNG_SIGNATURE_SIZE);
            if (!png_signature_buf.SequenceEqual(png_signature))
            {
                return null;
            }
            file.Seek(IHDR_SIZE, SeekOrigin.Current);

            uint chunk_length = 0;
            byte[] chunk_length_buf = new byte[4];
            byte[] chunk_type = new byte[CHUNK_TYPE_SIZE];
            byte[] chunk_keyword = new byte[CHUNK_KEYWORD_SIZE];
            byte[] chunk_itxt_before_value = new byte[CHUNK_ITXT_BEFORE_VALUE_SIZE];
            while (true)
            {
                file.Read(chunk_length_buf, 0, 4);
                if (BitConverter.IsLittleEndian)
                {
                    Array.Reverse(chunk_length_buf);
                }
                chunk_length = BitConverter.ToUInt32(chunk_length_buf, 0);
                file.Read(chunk_type, 0, CHUNK_TYPE_SIZE);
                if (chunk_type.SequenceEqual(chunk_type_iTXt))
                {
                    file.Read(chunk_keyword, 0, CHUNK_KEYWORD_SIZE);
                    chunk_length -= (uint)CHUNK_KEYWORD_SIZE;
                    if (chunk_keyword.SequenceEqual(target_chunk_keyword))
                    {
                        file.Read(chunk_itxt_before_value, 0, CHUNK_ITXT_BEFORE_VALUE_SIZE);
                        if (!chunk_itxt_before_value.SequenceEqual(chunk_itxt_before_value_signature))
                        {
                            return null; // Invalid iTXt chunk format
                        }
                        chunk_length -= (uint)CHUNK_ITXT_BEFORE_VALUE_SIZE;
                        byte[] value = new byte[chunk_length + 1];
                        value[chunk_length] = 0; // Null-terminate the string
                        file.Read(value, 0, (int)chunk_length);
                        string text = System.Text.Encoding.UTF8.GetString(value);
                        return JsonUtility.FromJson<VisualData>(text);
                    }
                }
                else if (chunk_type.SequenceEqual(chunk_type_IEND))
                {
                    return null; // Reached the end of the PNG file
                }
                file.Seek(chunk_length + CHUNK_CRC_SIZE, SeekOrigin.Current);
            }
        }

        public static VisualData Load(string path)
        {
            if (!System.IO.File.Exists(path)) return null;
            using (var file = File.OpenRead(path))
            {
                return Load(file);
            }
        }

        public static VisualData Load(Texture2D texture)
        {
            if (texture == null) return null;
            return Load(AssetDatabase.GetAssetPath(texture));
        }
    }
}
