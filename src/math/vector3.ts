export type Vector3 = Float32Array;

export function from(x: number, y: number, z: number): Vector3 {
    const v = new Float32Array(3);
    v[0] = x;
    v[1] = y;
    v[2] = z;
    return v;
}

export function subtract(a: Vector3, b: Vector3) {
    a[0] = a[0] - b[0];
    a[1] = a[1] - b[1];
    a[2] = a[2] - b[2];
}

export function subtractRet(a: Vector3, b: Vector3, dst: Vector3): Vector3 {
    dst[0] = a[0] - b[0];
    dst[1] = a[1] - b[1];
    dst[2] = a[2] - b[2];
    return dst;
}

export function normalize(dst: Vector3, v: Vector3): Vector3 {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const len = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);

    if (len > 0.00001) {
        dst[0] = v0 / len;
        dst[1] = v1 / len;
        dst[2] = v2 / len;
    } else {
        dst[0] = 0;
        dst[1] = 0;
        dst[2] = 0;
    }

    return dst;
}

export function cross(dst: Vector3, b: Vector3) {
    const t1 = dst[2] * b[0] - dst[0] * b[2];
    const t2 = dst[0] * b[1] - dst[1] * b[0];

    dst[0] = dst[1] * b[2] - dst[2] * b[1];
    dst[1] = t1;
    dst[2] = t2;
}

export function crossRet(a: Vector3, b: Vector3, dst: Vector3): Vector3 {
    const t1 = a[2] * b[0] - a[0] * b[2];
    const t2 = a[0] * b[1] - a[1] * b[0];
    dst[0] = a[1] * b[2] - a[2] * b[1];
    dst[1] = t1;
    dst[2] = t2;

    return dst;
}
