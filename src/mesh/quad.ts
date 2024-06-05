
export const VertexSize = 4 * 8; // Byte size of one quad vertex.
export const PositionOffset = 0;
export const ColorOffset = 4 * 4; // Byte offset of quad vertex color attribute.
export const UVOffset = 4 * 6;
export const VertexCount = 6;

export const VertexArray = new Float32Array([
    // float4 position, float4 color, float2 uv,
    -1, -1, 0, 1, 0, 0, 1, 1,
    1, -1, 0, 1, 1, 0, 0, 1,
    1, 1, 0, 1, 1, 1, 0, 0,
    -1, 1, 0, 1, 0, 1, 1, 0,
    -1, -1, 0, 1, 0, 0, 1, 1,
    1, 1, 0, 1, 1, 1, 0, 0,
]);