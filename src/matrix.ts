// Rounding error, fairly high due to floating point precision breakdown
export const EPSILON = 0.04;

export function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
    const f = 1.0 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
        const nf = 1 / (near - far);
        out[10] = (far + near) * nf;
        out[14] = 2 * far * near * nf;
    } else {
        out[10] = -1;
        out[14] = -2 * near;
    }
    return out;
}


// Identity matrix
export function identity() {
    const m = new Float32Array(16);
    m[0] = 1.0;
    m[5] = 1.0;
    m[10] = 1.0;
    m[15] = 1.0;
    return m;
}

// Set the position of a matrix
export function position(m: Float32Array, x: number, y: number, z: number) {
    m[12] = x;
    m[13] = y;
    m[14] = z;
    return;
}

// Set the scale of a matrix uniformly
export function uniformScale(m: Float32Array, s: number) {
    m[0] *= s;
    m[1] *= s;
    m[2] *= s;
    m[3] *= s;
    m[4] *= s;
    m[5] *= s;
    m[6] *= s;
    m[7] *= s;
    m[8] *= s;
    m[9] *= s;
    m[10] *= s;
    m[11] *= s;
    m[12] *= s;
    m[13] *= s;
    m[14] *= s;
    m[15] *= s;

    return;
}

// Set the scale of a matrix
export function scale(m: Float32Array, x: number, y: number, z: number) {
    m[0] *= x;
    m[1] *= x;
    m[2] *= x;
    m[3] *= x;
    m[4] *= y;
    m[5] *= y;
    m[6] *= y;
    m[7] *= y;
    m[8] *= z;
    m[9] *= z;
    m[10] *= z;
    m[11] *= z;
    return;
}

// Rotate around x axis
export function rotationX(m: Float32Array, angle: number) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    m[5] = c;
    m[6] = s;
    m[9] = -s;
    m[10] = c;
    return;
}

// Rotate around Y axis
export function rotationY(m: Float32Array, angle: number) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    m[0] = c;
    m[2] = -s;
    m[8] = s;
    m[10] = c;
    return;
}

// Rotate around Z axis
export function rotationZ(m: Float32Array, angle: number) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    m[0] = c;
    m[1] = s;
    m[4] = -s;
    m[5] = c;
    return;
}


// Apply matrix to a offset in a array
export function inject(m: Float32Array, array: Float32Array, offset: number) {
    array[offset + 0] = m[0];
    array[offset + 1] = m[1];
    array[offset + 2] = m[2];
    array[offset + 3] = m[3];
    array[offset + 4] = m[4];
    array[offset + 5] = m[5];
    array[offset + 6] = m[6];
    array[offset + 7] = m[7];
    array[offset + 8] = m[8];
    array[offset + 9] = m[9];
    array[offset + 10] = m[10];
    array[offset + 11] = m[11];
    array[offset + 12] = m[12];
    array[offset + 13] = m[13];
    array[offset + 14] = m[14];
    array[offset + 15] = m[15];
    return;
}

export function lookAt(m: Float32Array, cameraPosition: Float32Array, center: Float32Array, up: Float32Array): Float32Array {

    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    let cameraPositionx = cameraPosition[0];
    let cameraPositiony = cameraPosition[1];
    let cameraPositionz = cameraPosition[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    z0 = cameraPositionx - centerx;
    z1 = cameraPositiony - centery;
    z2 = cameraPositionz - centerz;

    let lenSquare = z0 * z0 + z1 * z1 + z2 * z2;

    if (Math.abs(lenSquare) < EPSILON) {
        return identity();
    }

    len = 1 / Math.sqrt(lenSquare);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;

    lenSquare = x0 * x0 + x1 * x1 + x2 * x2;
    if (!lenSquare) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / Math.sqrt(lenSquare);
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    lenSquare = y0 * y0 + y1 * y1 + y2 * y2;
    if (!lenSquare) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / Math.sqrt(lenSquare);
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    m[0] = x0;
    m[1] = y0;
    m[2] = z0;
    m[3] = 0;
    m[4] = x1;
    m[5] = y1;
    m[6] = z1;
    m[7] = 0;
    m[8] = x2;
    m[9] = y2;
    m[10] = z2;
    m[11] = 0;
    m[12] = -(x0 * cameraPositionx + x1 * cameraPositiony + x2 * cameraPositionz);
    m[13] = -(y0 * cameraPositionx + y1 * cameraPositiony + y2 * cameraPositionz);
    m[14] = -(z0 * cameraPositionx + z1 * cameraPositiony + z2 * cameraPositionz);
    m[15] = 1;

    return m;
}

export function rotate(out: Float32Array, a: Float32Array, rad: Number, axis: Float32Array) {
    let x = axis[0],
        y = axis[1],
        z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (len < EPSILON) {
        return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
}

export function multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    // Cache only the current line of the second matrix
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

export function translate(out: Float32Array, a: Float32Array, v: Float32Array) {
    const x = v[0],
        y = v[1],
        z = v[2];

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a13 = a[7];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a23 = a[11];

        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
}