import * as fs from "fs/promises";
const conf = require("../../config/server.json");

export async function commandSave(format: string, data: any): Promise<void> {
    await fs.writeFile(`./data/format/${format}.txt`, data);
}

export async function commandLoad(format: string): Promise<any> {
    return await fs.readFile(`./data/format/${format}.txt`);
}

export async function commandList(): Promise<any> {
    return await fs.readdir(`./data/format/`);
}


