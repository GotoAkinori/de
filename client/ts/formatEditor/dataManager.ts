namespace ooo.de.formatEditor {
    export function init_datamanager() {
        let formatTableHead = document.getElementById("formatTableHead") as HTMLTableSectionElement;
        let formatTableBody = document.getElementById("formatTableBody") as HTMLTableSectionElement;
        let formatTableNew = document.getElementById("formatTableNew") as HTMLTableSectionElement;

        let dataHead = document.getElementById("dataHead") as HTMLTableSectionElement;
        let dataBody = document.getElementById("dataBody") as HTMLTableSectionElement;

        makeFormatTable();

        let viewer = document.getElementById("viewer") as HTMLIFrameElement;
        let loadEndFunctions: (() => Promise<void>)[] = [];
        viewer.addEventListener("load", () => {
            viewer.contentWindow!.addEventListener("message", async (ev) => {
                if (ev.data == "load-end") {
                    for (let f of loadEndFunctions) {
                        await f();
                    }
                    loadEndFunctions.length = 0;
                }
            });
        });

        async function makeFormatTable() {
            formatTableHead.innerHTML = "";
            formatTableBody.innerHTML = "";

            // header
            let [, [, h_item]] = common.addTR(formatTableHead, 2);
            h_item.innerText = "Format/Schema";

            // body
            let list = await common.postJson(`${common.COMMAND_PATH}/format/list/`) as string[];
            for (let item of list) {
                let format = item.substring(0, item.length - 4);
                let [, [d_tool, d_item]] = common.addTR(formatTableBody, 2);
                d_item.innerText = format;

                // open button
                common.addImageButton(d_tool, "../image/edit.svg", async () => {
                    window.open(`./formatEditor.html?format=${format}`);
                });

                // view button
                common.addImageButton(d_tool, "../image/view.svg", async () => {
                    viewFormat(format);
                });
            }
        }

        async function viewFormat(format: string) {
            dataHead.innerHTML = "";
            dataBody.innerHTML = "";

            let viewer = document.getElementById("viewer") as HTMLIFrameElement;
            viewer.src = `./viewer.html?format=${format}`;
            loadEndFunctions.push(async () => {
                try {
                    let commonInfo = viewer.contentDocument?.getElementById(META_INFO_TAG_ID);
                    let schemaName: string;
                    if (commonInfo && commonInfo?.dataset.de_makeSchema === "1") {
                        schemaName = commonInfo?.dataset.de_schemaName ?? format;
                    } else {
                        schemaName = format;
                    }

                    document.getElementById("schema-name")!.innerText = schemaName;

                    dataHead.innerHTML = "";
                    dataBody.innerHTML = "";

                    let dataList: {
                        id: string,
                        data: any
                    }[] = await common.postJson(`${common.COMMAND_PATH}/doc/${schemaName}/getAll`);

                    if (dataList.length == 0) {
                        return;
                    }

                    // get header list
                    let headerList: string[] = [];
                    for (let doc of dataList) {
                        for (let name in doc.data) {
                            if (headerList.indexOf(name) == -1) {
                                headerList.push(name);
                            }
                        }
                    }

                    // header
                    let [, [, h_id, ...h_items]] = common.addTR(dataHead, headerList.length + 2);
                    h_id.innerText = "ID";
                    for (let i = 0; i < headerList.length; i++) {
                        h_items[i].innerText = headerList[i];
                    }

                    // body
                    for (let doc of dataList) {
                        let [, [d_tool, d_id, ...d_items]] = common.addTR(dataBody, headerList.length + 2);

                        // ID
                        d_id.innerText = doc.id;

                        // data
                        for (let i = 0; i < headerList.length; i++) {
                            d_items[i].innerText = doc.data[headerList[i]] ?? "";
                        }

                        // edit button
                        common.addImageButton(d_tool, "../image/edit.svg", async () => {
                            window.open(`./viewer.html?format=${format}&id=${doc.id}`);
                        });

                        // view button
                        common.addImageButton(d_tool, "../image/open.svg", async () => {
                            window.open(`./viewer.html?format=${format}&id=${doc.id}&readonly=1`);
                        });

                        // view button
                        common.addImageButton(d_tool, "../image/view.svg", async () => {
                            let viewer = document.getElementById("viewer") as HTMLIFrameElement;
                            viewer.src = `./viewer.html?format=${format}&id=${doc.id}&readonly=1`;
                        });
                    }
                } catch (ex) {
                    // if data is empty, getting 'dataList' will throw exeption.
                }
            });
        }

        formatTableNew.addEventListener("click", () => {
            open("./formatEditor.html");
        });
    }
}