import * as fs from "fs";
const conf = require("../../config/server.json");

export async function command(action: string, format: string, data: any): Promise<any> {
    switch (action) {
        case "save": {
            return await commandSave(format, data);
        } break;
        case "load": {
            return await commandLoad(format);
        } break;
        case "list": {
            return await commandList(format);
        } break;
    }
}

function commandSave(format: string, data: any): Promise<void> {
    return new Promise((res, rej) => {
        fs.writeFile(`./data/format/${format}.json`, JSON.stringify(data), {}, e => {
            if (e?.errno) {
                res();
            } else {
                rej(e);
            }
        });
    });
}

function commandLoad(format: string): Promise<any> {
    return new Promise((res, rej) => {
        fs.readFile(`./data/format/${format}.json`, (err, data) => {
            if (err) {
                rej(err);
            } else {
                res(data);
            }
        });
    });
}

function commandList(format: string): Promise<any> {
    return new Promise((res, rej) => {
        fs.readdir(`./data/format/`, (err, files) => {
            if (err) {
                rej(err);
            } else {
                res(files);
            }
        });
    });
}


