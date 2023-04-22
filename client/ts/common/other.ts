namespace ooo.de.common {
    export function ArrayBufferToString(array: ArrayBuffer): string {
        let bytes = new Uint8Array(array);
        let base64 = "";
        for (let i = 0; i < bytes.length; i++) {
            base64 += String.fromCharCode(bytes[i]);
        }
        return base64;
    }
    export function StringToArrayBuffer(binary_string: string): ArrayBuffer {
        let length = binary_string.length;
        let bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    export function ArrayBufferToBase64(array: ArrayBuffer): string {
        return btoa(ArrayBufferToString(array));
    }
    export function Base64ToArrayBuffer(base64: string): ArrayBuffer {
        return StringToArrayBuffer(atob(base64));
    }
}