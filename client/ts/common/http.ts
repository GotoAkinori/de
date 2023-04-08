namespace ooo.de.common {
    export let HH_CT_JSON = { "Content-Type": "application/json" }
    export let HH_CT_HTML = { "Content-Type": "text/html; charset=UTF-8" }
    export let HH_CT_TEXT = { "Content-Type": "text/plain; charset=UTF-8" }
    export function post(url: string, data?: any, headers?: any): Promise<string> {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.addEventListener("load", () => {
                if (xhr.status == 200) {
                    res(xhr.responseText);
                } else {
                    console.error(url);
                    rej(xhr);
                }
            });
            xhr.addEventListener("error", (err) => {
                console.error(url);
                rej(err);
            });
            if (headers) {
                for (let key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }
            xhr.send(data ?? undefined);
        });
    }

    export async function postJson(url: string, data?: any, headers?: any): Promise<any> {
        return JSON.parse(await post(url, data, headers));
    }

    export const COMMAND_PATH = "../../command";
}
