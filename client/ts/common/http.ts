namespace ooo.de.common {
    export function postJson(url: string, data?: any): Promise<any> {
        return new Promise((res, rej) => {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.addEventListener("load", () => {
                res(JSON.parse(xhr.responseText));
            });
            xhr.addEventListener("error", (err) => {
                rej(err);
            });
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(data ? JSON.stringify(data) : undefined);
        });
    }
}
