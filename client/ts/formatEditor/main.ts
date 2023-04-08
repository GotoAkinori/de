namespace ooo.de.formatEditor {
    export const META_INFO_TAG_ID = "ooo_de_meta_tag";

    export let DeeList: element.DEEFactroyBase<any>[] = [];
    export let pageMode: "view" | "format";
    export let schema: { [key: string]: any };

    //#region Common

    /**
     * Add new DEEBase element.
     * @param factory New DEEBase element.
     */
    function AddDEE(factory: element.DEEFactroyBase<any>) {
        DeeList.push(factory);

        if (pageMode == "format") {
            let toolbarPane = document.getElementById("toolbar") as HTMLDivElement;
            let formatBody = document.getElementById("formatBody") as HTMLDivElement;

            factory.makeToolButton(common.addButton(toolbarPane, "", () => {
                let selection = document.getSelection();

                if (selection && selection.rangeCount > 0) {
                    let target = selection.getRangeAt(0).startContainer;

                    if (common.checkIsChild(formatBody, target)) {
                        let dee = factory.createElement(selection.getRangeAt(0)) as element.DEEElementBase;
                        let id = common.newID();
                        dee.id = id;
                        dee.element.dataset.deid = id;
                        dee.element.dataset.detype = factory.getType();
                        setOnClickElementEvent(dee);
                        activate(dee);
                    }
                }
            }, "toolbutton"));
        }
    }

    function AddSystemDEE() {
        AddDEE(new element.DeInputFactory());
        AddDEE(new element.DeTableFactory());
        AddDEE(new element.DeSelectFactory());
        AddDEE(new element.DeRadioFactory());
        AddDEE(new element.DeCommandButtonFactory());
        AddDEE(new element.DeDataViewFactory());
        AddDEE(new element.DeStyleFactory(
            "bold",
            "<span style='font-weight:bold'>Bold</span>", {
            fontWeight: "bold"
        }));
        AddDEE(new element.DeFileFactory());
    }
    //#endregion

    //#region Make Format
    export function init_format() {
        pageMode = "format";
        AddSystemDEE();

        element.DEEFactroyBase.onActive = activate;
        // document.getElementById("menubutton")!.addEventListener("click", showMenu);

        makeCommonInfoPane();

        params = urlArgs();
        if (params.format) {
            load(params.format);
        }
    }

    let activeProperty: string;

    export function activate(element: element.DEEElementBase) {
        let propertyView = document.getElementById("propertyView") as HTMLDivElement;

        if (activeProperty != element.id) {
            propertyView.innerHTML = "";
            element.showProperty(propertyView);
        }
    }
    //#endregion

    //#region View
    function urlArgs(): { [key: string]: string } {
        let ret: { [key: string]: string } = {};

        let searchString = location.search.replace("?", "");
        for (let [key, value] of searchString.split("&").map(v => v.split("=").map(a => decodeURIComponent(a)))) {
            ret[key] = value;
        }

        return ret;
    }

    let params: { [key: string]: string; };
    export async function init_viewer() {
        params = urlArgs();
        pageMode = "view";

        AddSystemDEE();

        element.DEEFactroyBase.onActive = () => { };
        await load(params.format);

        // get format info
        let schemaName;
        {
            let metaInfo = document.getElementById(META_INFO_TAG_ID);
            if (metaInfo && metaInfo.dataset.de_makeSchema == "1") {
                schemaName = metaInfo.dataset.de_schemaName || params.format;
            } else {
                schemaName = params.format;
            }
        }

        if (params.id) {
            try {
                let data = await common.postJson(`${common.COMMAND_PATH}/doc/${schemaName}/load/${params.id}`);

                for (let elem of element.DEEElementBase.elementList) {
                    if (elem.properties.name) {
                        elem.setFormData(data);
                    }
                    if (params.readonly) {
                        elem.setReadonly();
                    }
                }
            } catch (ex) {
                console.error(ex);
            }
        }

        postMessage("load-end");
    }

    export function setOnClickElementEvent(dee: element.DEEElementBase) {
        switch (pageMode) {
            case "format": {
                dee.element.addEventListener("click", (ev) => {
                    if (
                        ev.target instanceof HTMLElement &&
                        ev.target.closest("*[data-detype]") == dee.element
                    ) {
                        dee.onClickFormatMode(ev);
                    }
                });
            } break;
            case "view": {
                dee.element.addEventListener("click", (ev) => {
                    if (
                        ev.target instanceof HTMLElement &&
                        ev.target.closest("*[data-detype]") == dee.element
                    ) {
                        dee.onClickViewMode(ev);
                    }
                });
            } break;
        }
    }

    export async function submit() {
        let properties: { [key: string]: any } = {};
        for (let elem of element.DEEElementBase.elementList) {
            await elem.getFormData(properties);
        }

        let schemaName = formatProperty.schemaName ?? params.format;

        let id: string | undefined = undefined;
        if (formatProperty.idProperty) {
            id = properties[formatProperty.idProperty];
        } else if (params.id) {
            id = params.id;
        }

        try {
            if (id) {
                await common.post(`${common.COMMAND_PATH}/doc/${schemaName}/update/${id}`, JSON.stringify(properties), common.HH_CT_JSON);
            } else {
                await common.post(`${common.COMMAND_PATH}/doc/${schemaName}/create/`, JSON.stringify(properties), common.HH_CT_JSON);
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    export function clear() {
        for (let elem of element.DEEElementBase.elementList) {
            elem.setFormData({});
        }
    }

    export function showLoadHTMLDialog(ev: MouseEvent) {
        let [base, back] = ooo.de.common.modal();

        common.addTextDiv(base, "HTML File");
        let input = common.addTag(base, "input");
        input.placeholder = "Select HTML file";
        input.type = "file";
        input.focus();

        let exec = async () => {
            try {
                if (input.files && input.files.length > 0) {
                    await loadHTML(input.files[0]);
                    back.remove();
                }
            } catch (ex) {
                console.error(ex);
            }
        }
        common.addButton(base, "Load", exec);
        input.addEventListener("keypress", (ev) => {
            if (ev.key == "Enter") {
                exec();
            }
        });

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
    }

    async function loadHTML(file: File) {
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatProperty = {};

        let byteArray = await file.arrayBuffer();
        let htmlString = common.ArrayBufferToString(byteArray);

        let htmlDoc = new DOMParser().parseFromString(htmlString, 'text/html');

        // move css items to html body.
        let headerElements = htmlDoc.head.querySelectorAll("link,style");
        for (let i = 0; i < headerElements.length; i++) {
            htmlDoc.body.innerHTML += (headerElements[i] as HTMLElement).outerHTML;
        }

        // script can't move.
        let modifiedHtmlString = htmlDoc.body.innerHTML;
        formatBody.innerHTML = modifiedHtmlString;
    }

    //#endregion
}
