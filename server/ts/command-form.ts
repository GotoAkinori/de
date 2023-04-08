import * as fs from "fs/promises";
import * as util from "./util";
const conf = require("../../config/server.json");

export async function commandCreate(format: string, data: any): Promise<{ result: boolean, id: string, format: string }> {
    try {
        util.securityCheck_FilePath(format);
        let id = util.getID(8);

        try {
            await fs.access(`./data/doc/${format}`);
        } catch (e) {
            await fs.mkdir(`./data/doc/${format}`, {
                recursive: true
            });
        }

        await fs.writeFile(`./data/doc/${format}/${id}.json`, JSON.stringify(data), {});
        return { result: true, id: id, format: format };
    } catch (ex) {
        return { result: false, id: "", format: format };
    }
}

export async function commandUpdate(format: string, data: any, id: string): Promise<any> {
    try {
        util.securityCheck_FilePath(format);
        util.securityCheck_FilePath(id);

        try {
            await fs.access(`./data/doc/${format}`);
        } catch (e) {
            await fs.mkdir(`./data/doc/${format}`, {
                recursive: true
            });
        }

        await fs.writeFile(`./data/doc/${format}/${id}.json`, JSON.stringify(data), {});
        return { result: true, id: id, format: format };
    } catch (ex) {
        return { result: false, id: "", format: format };
    }
}

export async function commandLoad(format: string, id: string): Promise<any> {
    util.securityCheck_FilePath(format);
    util.securityCheck_FilePath(id);

    return await fs.readFile(`./data/doc/${format}/${id}.json`);
}

export async function commandRemove(format: string, id: string): Promise<any> {
    try {
        util.securityCheck_FilePath(format);
        util.securityCheck_FilePath(id);

        await fs.unlink(`./data/doc/${format}/${id}.json`);

        return { result: true, id: id, format: format };
    } catch (ex) {
        return { result: false, id: id, format: format };
    }
}

export async function commandDataList(format: string): Promise<any> {
    util.securityCheck_FilePath(format);

    return await fs.readdir(`./data/doc/${format}`);
}

export async function commandGetAllData(format: string): Promise<any> {
    util.securityCheck_FilePath(format);

    let files = await fs.readdir(`./data/doc/${format}`);

    let data: any[] = [];
    for (let file of files) {
        try {
            let content = await fs.readFile(`./data/doc/${format}/${file}`);
            data.push({
                id: file.substring(0, file.length - 5),
                data: JSON.parse(content.toString())
            });
        } catch (ex) {
            console.error(`[FILE Read Error] Path: ./data/doc/${format}/${file}; Cause: ${ex}`);
        }
    }

    return data;
}
