import * as fs from "fs/promises";
import * as util from "./util";
const conf = require("../../config/server.json");

export async function commandSave(format: string, data: any): Promise<void> {
    util.securityCheck_FilePath(format);

    await fs.writeFile(`./data/format/${format}.txt`, data);
}

export async function commandLoad(format: string): Promise<any> {
    util.securityCheck_FilePath(format);

    return await fs.readFile(`./data/format/${format}.txt`);
}

export async function commandList(): Promise<any> {
    return await fs.readdir(`./data/format/`);
}

export async function commandDocList(): Promise<any> {
    return await fs.readdir(`./data/doc/`);
}

