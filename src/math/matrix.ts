import * as Vector3 from './vector3';

export type Matrix = Float32Array;

export function identity(): Matrix {
    const matrix = new Float32Array(16);
    matrix[0] = 1;
    matrix[5] = 1;
    matrix[10] = 1;
    matrix[15] = 1;
    return matrix;
}

export function from(matrix: Matrix,
    v0: number, v1: number, v2: number, v3: number,
    v4: number, v5: number, v6: number, v7: number,
    v8: number, v9: number, v10: number, v11: number,
    v12: number, v13: number, v14: number, v15: number
): Matrix {
    matrix[0] = v0;
    matrix[1] = v1;
    matrix[2] = v2;
    matrix[3] = v3;
    matrix[4] = v4;
    matrix[5] = v5;
    matrix[6] = v6;
    matrix[7] = v7;
    matrix[8] = v8;
    matrix[9] = v9;
    matrix[10] = v10;
    matrix[11] = v11;
    matrix[12] = v12;
    matrix[13] = v13;
    matrix[14] = v14;
    matrix[15] = v15;
    return matrix;
}

export function translation(dst: Matrix, v: Vector3): Matrix {
    dst[12] = v[0];
    dst[13] = v[1];
    dst[14] = v[2];
    return dst;
}
/*
export function translation(dst: Matrix, v: Vector3) {
    dst[0] = 1; dst[1] = 0; dst[2] = 0; dst[3] = 0;
    dst[4] = 0; dst[5] = 1; dst[6] = 0; dst[7] = 0;
    dst[8] = 0; dst[9] = 0; dst[10] = 1; dst[11] = 0;
    dst[12] = v[0]; dst[13] = v[1]; dst[14] = v[2]; dst[15] = 1;
    return dst;
}
*/

export function translate(dst: Matrix, v: Vector3) {

    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const m00 = dst[0];
    const m01 = dst[1];
    const m02 = dst[2];
    const m03 = dst[3];
    const m10 = dst[1 * 4 + 0];
    const m11 = dst[1 * 4 + 1];
    const m12 = dst[1 * 4 + 2];
    const m13 = dst[1 * 4 + 3];
    const m20 = dst[2 * 4 + 0];
    const m21 = dst[2 * 4 + 1];
    const m22 = dst[2 * 4 + 2];
    const m23 = dst[2 * 4 + 3];
    const m30 = dst[3 * 4 + 0];
    const m31 = dst[3 * 4 + 1];
    const m32 = dst[3 * 4 + 2];
    const m33 = dst[3 * 4 + 3];

    dst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
    dst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
    dst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
    dst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
}


export function perspective(dst: Matrix, fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): Matrix {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);

    dst[0] = f / aspect;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;

    dst[4] = 0;
    dst[5] = f;
    dst[6] = 0;
    dst[7] = 0;

    dst[8] = 0;
    dst[9] = 0;
    dst[11] = -1;

    dst[12] = 0;
    dst[13] = 0;
    dst[15] = 0;

    if (zFar === Infinity) {
        dst[10] = -1;
        dst[14] = -zNear;
    } else {
        const rangeInv = 1 / (zNear - zFar);
        dst[10] = zFar * rangeInv;
        dst[14] = zFar * zNear * rangeInv;
    }

    return dst;
}

export function multiply(dst: Matrix, a: Matrix): Matrix {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4 + 0];
    const a11 = a[4 + 1];
    const a12 = a[4 + 2];
    const a13 = a[4 + 3];
    const a20 = a[8 + 0];
    const a21 = a[8 + 1];
    const a22 = a[8 + 2];
    const a23 = a[8 + 3];
    const a30 = a[12 + 0];
    const a31 = a[12 + 1];
    const a32 = a[12 + 2];
    const a33 = a[12 + 3];
    const b00 = dst[0];
    const b01 = dst[1];
    const b02 = dst[2];
    const b03 = dst[3];
    const b10 = dst[4 + 0];
    const b11 = dst[4 + 1];
    const b12 = dst[4 + 2];
    const b13 = dst[4 + 3];
    const b20 = dst[8 + 0];
    const b21 = dst[8 + 1];
    const b22 = dst[8 + 2];
    const b23 = dst[8 + 3];
    const b30 = dst[12 + 0];
    const b31 = dst[12 + 1];
    const b32 = dst[12 + 2];
    const b33 = dst[12 + 3];

    dst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    dst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    dst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    dst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
    dst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    dst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    dst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    dst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
    dst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    dst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    dst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    dst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
    dst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    dst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    dst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    dst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;

    return dst;
}

export function rotate(dst: Matrix, m: Matrix, angleInRadians: number, axis: Vector3): Matrix {
    const x0 = axis[0];
    const y0 = axis[1];
    const z0 = axis[2];
    const n = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0);
    const x = x0 / n;
    const y = y0 / n;
    const z = z0 / n;
    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const oneMinusCosine = 1 - c;

    const r00 = xx + (1 - xx) * c;
    const r01 = x * y * oneMinusCosine + z * s;
    const r02 = x * z * oneMinusCosine - y * s;
    const r10 = x * y * oneMinusCosine - z * s;
    const r11 = yy + (1 - yy) * c;
    const r12 = y * z * oneMinusCosine + x * s;
    const r20 = x * z * oneMinusCosine + y * s;
    const r21 = y * z * oneMinusCosine - x * s;
    const r22 = zz + (1 - zz) * c;

    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m03 = m[3];
    const m10 = m[4];
    const m11 = m[5];
    const m12 = m[6];
    const m13 = m[7];
    const m20 = m[8];
    const m21 = m[9];
    const m22 = m[10];
    const m23 = m[11];

    dst[0] = r00 * m00 + r01 * m10 + r02 * m20;
    dst[1] = r00 * m01 + r01 * m11 + r02 * m21;
    dst[2] = r00 * m02 + r01 * m12 + r02 * m22;
    dst[3] = r00 * m03 + r01 * m13 + r02 * m23;
    dst[4] = r10 * m00 + r11 * m10 + r12 * m20;
    dst[5] = r10 * m01 + r11 * m11 + r12 * m21;
    dst[6] = r10 * m02 + r11 * m12 + r12 * m22;
    dst[7] = r10 * m03 + r11 * m13 + r12 * m23;
    dst[8] = r20 * m00 + r21 * m10 + r22 * m20;
    dst[9] = r20 * m01 + r21 * m11 + r22 * m21;
    dst[10] = r20 * m02 + r21 * m12 + r22 * m22;
    dst[11] = r20 * m03 + r21 * m13 + r22 * m23;

    if (m !== dst) {
        dst[12] = m[12];
        dst[13] = m[13];
        dst[14] = m[14];
        dst[15] = m[15];
    }

    return dst;
}

export function rotateX(dst: Matrix, angleInRadians: Number) {
    const m10 = dst[4];
    const m11 = dst[5];
    const m12 = dst[6];
    const m13 = dst[7];
    const m20 = dst[8];
    const m21 = dst[9];
    const m22 = dst[10];
    const m23 = dst[11];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    dst[4] = c * m10 + s * m20;
    dst[5] = c * m11 + s * m21;
    dst[6] = c * m12 + s * m22;
    dst[7] = c * m13 + s * m23;
    dst[8] = c * m20 - s * m10;
    dst[9] = c * m21 - s * m11;
    dst[10] = c * m22 - s * m12;
    dst[11] = c * m23 - s * m13;
}

export function rotateY(dst: Matrix, angleInRadians: Number) {
    const m00 = dst[0 * 4 + 0];
    const m01 = dst[0 * 4 + 1];
    const m02 = dst[0 * 4 + 2];
    const m03 = dst[0 * 4 + 3];
    const m20 = dst[2 * 4 + 0];
    const m21 = dst[2 * 4 + 1];
    const m22 = dst[2 * 4 + 2];
    const m23 = dst[2 * 4 + 3];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    dst[0] = c * m00 - s * m20;
    dst[1] = c * m01 - s * m21;
    dst[2] = c * m02 - s * m22;
    dst[3] = c * m03 - s * m23;
    dst[8] = c * m20 + s * m00;
    dst[9] = c * m21 + s * m01;
    dst[10] = c * m22 + s * m02;
    dst[11] = c * m23 + s * m03;
}

export function rotateZ(dst: Matrix, angleInRadians: Number) {

    const m00 = dst[0 * 4 + 0];
    const m01 = dst[0 * 4 + 1];
    const m02 = dst[0 * 4 + 2];
    const m03 = dst[0 * 4 + 3];
    const m10 = dst[1 * 4 + 0];
    const m11 = dst[1 * 4 + 1];
    const m12 = dst[1 * 4 + 2];
    const m13 = dst[1 * 4 + 3];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    dst[0] = c * m00 + s * m10;
    dst[1] = c * m01 + s * m11;
    dst[2] = c * m02 + s * m12;
    dst[3] = c * m03 + s * m13;
    dst[4] = c * m10 - s * m00;
    dst[5] = c * m11 - s * m01;
    dst[6] = c * m12 - s * m02;
    dst[7] = c * m13 - s * m03;
}

export function scale(dst: Matrix, v: Vector3) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];

    dst[0] = v0 * dst[0 * 4 + 0];
    dst[1] = v0 * dst[0 * 4 + 1];
    dst[2] = v0 * dst[0 * 4 + 2];
    dst[3] = v0 * dst[0 * 4 + 3];
    dst[4] = v1 * dst[1 * 4 + 0];
    dst[5] = v1 * dst[1 * 4 + 1];
    dst[6] = v1 * dst[1 * 4 + 2];
    dst[7] = v1 * dst[1 * 4 + 3];
    dst[8] = v2 * dst[2 * 4 + 0];
    dst[9] = v2 * dst[2 * 4 + 1];
    dst[10] = v2 * dst[2 * 4 + 2];
    dst[11] = v2 * dst[2 * 4 + 3];
}

/*
export function lookAt(dst: Matrix, eye: Vector3, target: Vector3, up: Vector3) {
    var xAxis = Vector3.from(0, 0, 0);
    var yAxis = Vector3.from(0, 0, 0);
    var zAxis = Vector3.from(0, 0, 0);

    Vector3.subtract(eye, target)
    Vector3.cross(up, zAxis)
    Vector3.cross(zAxis, xAxis)

    Vector3.normalize(zAxis, eye);
    Vector3.normalize(xAxis, up);
    Vector3.normalize(yAxis, zAxis);

    dst[0] = xAxis[0]; dst[1] = yAxis[0]; dst[2] = zAxis[0]; dst[3] = 0;
    dst[4] = xAxis[1]; dst[5] = yAxis[1]; dst[6] = zAxis[1]; dst[7] = 0;
    dst[8] = xAxis[2]; dst[9] = yAxis[2]; dst[10] = zAxis[2]; dst[11] = 0;

    dst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
    dst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
    dst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
    dst[15] = 1;
}*/

// twats
export function lookAt(dst: Matrix, eye: Vector3, target: Vector3, up: Vector3) {

    var xAxis = Vector3.from(0, 0, 0);
    var yAxis = Vector3.from(0, 0, 0);
    var zAxis = Vector3.from(0, 0, 0);

    Vector3.normalize(zAxis, Vector3.subtractRet(eye, target, zAxis));
    Vector3.normalize(xAxis, Vector3.crossRet(up, zAxis, xAxis));
    Vector3.normalize(yAxis, Vector3.crossRet(zAxis, xAxis, yAxis));

    dst[0] = xAxis[0]; dst[1] = yAxis[0]; dst[2] = zAxis[0]; dst[3] = 0;
    dst[4] = xAxis[1]; dst[5] = yAxis[1]; dst[6] = zAxis[1]; dst[7] = 0;
    dst[8] = xAxis[2]; dst[9] = yAxis[2]; dst[10] = zAxis[2]; dst[11] = 0;

    dst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
    dst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
    dst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
    dst[15] = 1;
}