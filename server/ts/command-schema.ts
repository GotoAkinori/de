import * as fs from "fs/promises";
import * as util from "./util";
const conf = require("../../config/server.json");

export async function commandSave(name: string, data: any): Promise<void> {
    util.securityCheck_FilePath(name);

    await fs.writeFile(`./data/schema/${name}.json`, JSON.stringify(data));
}

export async function commandLoad(name: string): Promise<any> {
    util.securityCheck_FilePath(name);

    return await fs.readFile(`./data/schema/${name}.json`);
}

export async function commandList(): Promise<any> {
    return await fs.readdir(`./data/schema/`);
}


