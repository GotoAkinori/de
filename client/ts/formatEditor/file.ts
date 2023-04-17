namespace ooo.de.formatEditor {
    export function showSaveDialog(ev: MouseEvent) {
        let [base, back] = ooo.de.common.modal();

        // Adjust window position
        {
            base.style.top = ev.clientY + ".px";
            base.style.left = ev.clientX + ".px";
            let clientRect = base.getBoundingClientRect();
            if (clientRect.left < 0) {
                base.style.left = "0px";
            } else if (clientRect.right >= window.innerWidth) {
                base.style.left = (window.innerWidth - clientRect.width) + "px";
            }
            if (clientRect.top < 0) {
                base.style.top = "0px";
            } else if (clientRect.bottom >= window.innerHeight) {
                base.style.top = (window.innerHeight - clientRect.height) + "px";
            }
        }

        common.addTextDiv(base, "Format Name");
        let input = common.addTag(base, "input");
        input.placeholder = "Format Name";
        input.value = formatProperty.formatName || "";
        input.focus();

        let execSave = async () => {
            try {
                await save(input.value);
                back.remove();
            } catch (ex) {
                console.error(ex);
            }
        }
        common.addButton(base, "Save", execSave);
        input.addEventListener("keypress", (ev) => {
            if (ev.key == "Enter") {
                execSave();
            }
        });
    }

    export async function save(formatName: string) {
        // Save Format
        for (let elem of element.DEEElementBase.elementList) {
            elem.objectToDataset();
        }

        {
            // insert meta-information-tag
            let metaInfo = document.getElementById(META_INFO_TAG_ID);
            if (!metaInfo) {
                let formatBody = document.getElementById("formatBody")!;
                metaInfo = common.addTag(formatBody, "div");
                metaInfo.id = META_INFO_TAG_ID;
                metaInfo.contentEditable = "false";
            }
            common.objectToDataset(metaInfo, formatProperty);
        }

        let html = document.getElementById("formatBody")!.innerHTML;

        try {
            common.post(`${common.COMMAND_PATH}/format/save/${formatName}`, html, common.HH_CT_TEXT);
        } catch (ex) {
            console.error(ex);
        }

        // Save Schema
        if (formatProperty.makeSchema == "1") {
            try {
                let schemaName = formatProperty.schemaName || formatName;
                await common.post(`${common.COMMAND_PATH}/schema/save/${schemaName}`, JSON.stringify(getSchema()), common.HH_CT_JSON);
            } catch (ex) {
                console.error(ex);
            }
        }
    }

    export async function showLoadDialog(ev: MouseEvent) {
        let [base, back] = ooo.de.common.modal();

        // Adjust window position
        {
            base.style.top = ev.clientY + ".px";
            base.style.left = ev.clientX + ".px";
            let clientRect = base.getBoundingClientRect();
            if (clientRect.left < 0) {
                base.style.left = "0px";
            } else if (clientRect.right >= window.innerWidth) {
                base.style.left = (window.innerWidth - clientRect.width) + "px";
            }
            if (clientRect.top < 0) {
                base.style.top = "0px";
            } else if (clientRect.bottom >= window.innerHeight) {
                base.style.top = (window.innerHeight - clientRect.height) + "px";
            }
        }

        common.addTextDiv(base, "Format List");
        let listDiv = common.addTag(base, "div");
        let list = await common.postJson(`${common.COMMAND_PATH}/format/list/all`) as string[];
        let selectedItem: HTMLDivElement | undefined = undefined;
        let selectedFormatName: string = "";
        for (let name of list) {
            let formatName = name.substring(0, name.length - 4);
            let listItem = common.addTextDiv(base, formatName, "menu-item");

            listItem.addEventListener("click", () => {
                if (selectedItem) {
                    selectedItem.classList.remove("selected");
                }
                listItem.classList.add("selected");
                selectedItem = listItem;
                selectedFormatName = formatName;
                loadButton.disabled = false;
            });
            listItem.addEventListener("dblclick", async () => {
                try {
                    await load(formatName);
                    back.remove();
                } catch (ex) {
                    console.error(ex);
                }
            });
        }

        let loadButton = common.addButton(base, "Load", async () => {
            try {
                await load(selectedFormatName);
                back.remove();
            } catch (ex) {
                console.error(ex);
            }
        });
        loadButton.disabled = true;
    }

    export async function load(formatName: string) {
        let data = await common.post(`${common.COMMAND_PATH}/format/load/${formatName}`);

        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatBody.innerHTML = data;
        formatProperty = {};

        {
            // get meta-information-tag info
            let metaInfo = document.getElementById(META_INFO_TAG_ID);
            if (metaInfo) {
                common.datasetToObject(metaInfo, formatProperty);
            } else {
                formatProperty.formatName = formatName;
            }
        }

        // clear elements
        element.DEEElementBase.elementList.length = 0;

        // create dee-elements
        let elements = formatBody.querySelectorAll(`*[data-deid]`);
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                loadElement(element);
            }
        });

        {
            // load schema
            if (formatProperty?.makeSchema == "1") {
                let schemaName: string = formatProperty.schemaName ?? formatProperty.formatName;
                schema = await common.postJson(`${common.COMMAND_PATH}/schema/load/${schemaName}`);
            }
        }

        setFormProperty();
    }
}