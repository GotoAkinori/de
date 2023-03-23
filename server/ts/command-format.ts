import * as fs from "fs/promises";
const conf = require("../../config/server.json");

export async function commandSave(format: string, data: any): Promise<void> {
    await fs.writeFile(`./data/format/${format}.json`, JSON.stringify(data));
}

export async function commandLoad(format: string): Promise<any> {
    return await fs.readFile(`./data/format/${format}.json`);
}

export async function commandList(): Promise<any> {
    return await fs.readdir(`./data/format/`);
}


