import * as fs from "fs/promises";
import * as util from "./util";
const conf = require("../../config/server.json");

export async function commandCreate(format: string, data: any): Promise<{ id: string }> {
    util.securityCheck_FilePath(format);

    let id = util.getID(8);

    try {
        await fs.access(`./data/forms/${format}`);
    } catch (e) {
        await fs.mkdir(`./data/forms/${format}`, {
            recursive: true
        });
    }

    await fs.writeFile(`./data/forms/${format}/${id}.json`, JSON.stringify(data), {});
    return { id: id };
}

export async function commandLoad(format: string, id: string, data: any): Promise<any> {
    util.securityCheck_FilePath(format);

    return await fs.readFile(`./data/forms/${format}/${id}.json`);
}
