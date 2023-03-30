import * as fs from "fs";

export function getID(length: number) {
    let id = "";
    for (let i = 0; i < length; i++) {
        let r = Math.floor(Math.random() * 62);
        if (r < 10) {
            // 0 - 9
            id += String.fromCharCode(r + 48);
        } else if (r < 36) {
            // a - z
            id += String.fromCharCode(r + 97 - 10);
        } else {
            id += String.fromCharCode(r + 65 - 36);
        }
    }
    return id;
}

export function securityCheck_FilePath(filepath: string) {
    // not allowed to refer parent path
    if (filepath.indexOf("..")) {
        console.error("[Security Error] Invalid File Path - " + filepath);
    }
}
