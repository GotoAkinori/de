namespace ooo.de.common {
    export function ArrayBufferToBase64(array: ArrayBuffer): string {
        let bytes = new Uint8Array(array);
        let base64 = "";
        for (let i = 0; i < bytes.length; i++) {
            base64 += String.fromCharCode(bytes[i]);
        }
        return btoa(base64);
    }
    export function Base64ToArrayBuffer(base64: string): ArrayBuffer {
        let binary_string = atob(base64);
        let length = binary_string.length;
        let bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}