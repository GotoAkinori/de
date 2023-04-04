import * as fs from "fs/promises";
import * as util from "./util";
const conf = require("../../config/server.json");

export async function commandCreate(format: string, data: any): Promise<{ result: boolean, id: string, format: string }> {
    try {
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
        return { result: true, id: id, format: format };
    } catch (ex) {
        return { result: false, id: "", format: format };
    }
}

export async function commandLoad(format: string, id: string): Promise<any> {
    util.securityCheck_FilePath(format);
    util.securityCheck_FilePath(id);

    return await fs.readFile(`./data/forms/${format}/${id}.json`);
}

export async function commandRemove(format: string, id: string): Promise<any> {
    try {
        util.securityCheck_FilePath(format);
        util.securityCheck_FilePath(id);

        await fs.unlink(`./data/forms/${format}/${id}.json`);

        return { result: true, id: id, format: format };
    } catch (ex) {
        return { result: false, id: id, format: format };
    }
}

export async function commandDataList(format: string): Promise<any> {
    util.securityCheck_FilePath(format);

    return await fs.readdir(`./data/forms/${format}`);
}

export async function commandGetAllData(format: string): Promise<any> {
    util.securityCheck_FilePath(format);

    let files = await fs.readdir(`./data/forms/${format}`);

    let data: any[] = [];
    for (let file of files) {
        try {
            let content = await fs.readFile(`./data/forms/${format}/${file}`);
            data.push({
                id: file.substring(0, file.length - 5),
                data: JSON.parse(content.toString())
            });
        } catch (ex) {
            console.error(`[FILE Read Error] Path: ./data/forms/${format}/${file}; Cause: ${ex}`);
        }
    }

    return data;
}
