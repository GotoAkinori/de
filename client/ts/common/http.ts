namespace ooo.de.common {
    export function post(url: string, data?: any): Promise<string> {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.addEventListener("load", () => {
                if (xhr.status == 200) {
                    res(xhr.responseText);
                } else {
                    rej(xhr);
                }
            });
            xhr.addEventListener("error", (err) => {
                rej(err);
            });
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(data ? JSON.stringify(data) : undefined);
        });
    }

    export async function postJson(url: string, data?: any): Promise<any> {
        return JSON.parse(await post(url, data));
    }
}
