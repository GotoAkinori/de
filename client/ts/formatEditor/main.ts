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
    function AddDEE(factory: element.DEEFactroyBase<any>, parent: HTMLDivElement) {
        DeeList.push(factory);

        if (pageMode == "format") {
            let formatBody = document.getElementById("formatBody") as HTMLDivElement;

            factory.makeToolButton(common.addButton(parent, "", () => {
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
                        dee.onAfterCreate();
                    }
                }
            }, "toolbutton"));
        }
    }

    function AddSystemDEE() {
        let toolbarData = document.getElementById("toolbar-data") as HTMLDivElement;
        let toolbarOthers = document.getElementById("toolbar-others") as HTMLDivElement;

        // Data elements
        AddDEE(new element.DeInputFactory(), toolbarData);
        AddDEE(new element.DeSelectFactory(), toolbarData);
        AddDEE(new element.DeRadioFactory(), toolbarData);
        AddDEE(new element.DeFileFactory(), toolbarData);
        AddDEE(new element.DeInputExFactory("date", "Date"), toolbarData);
        AddDEE(new element.DeInputExFactory("number", "Number"), toolbarData);
        AddDEE(new element.DeInputExFactory("color", "Color"), toolbarData);

        // Other elements
        AddDEE(new element.DeLinkFactory(), toolbarOthers);
        AddDEE(new element.DeCommandButtonFactory(), toolbarOthers);
        AddDEE(new element.DeTableFactory(), toolbarOthers);
        AddDEE(new element.DeDataViewFactory(), toolbarOthers);
        AddDEE(new element.DeImageFactory(), toolbarOthers);
    }
    //#endregion

    //#region Make Format
    export function init_format() {
        pageMode = "format";
        AddSystemDEE();

        element.DEEFactroyBase.onActive = activate;

        makePropertyTab();

        initFormatProperty();
        initStyleView();

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

    function makePropertyTab() {
        let parent = document.getElementById("propertyViewPane") as HTMLDivElement;
        let propertyTab = new common.TabView(parent, [{
            caption: "Format",
            name: "format",
            htmlID: "commonInfoView"
        }, {
            caption: "Data",
            name: "data"
        }, {
            caption: "Style",
            name: "style",
            htmlID: "styleView"
        }]);

        let elementSelectArea = common.addTag(propertyTab.getTabItem("data")!, "div");
        let propertyArea = common.addTag(propertyTab.getTabItem("data")!, "div");
        propertyArea.id = "propertyView";

        // Element List
        let elementsSelectRoot = new element.DEEPropertyRoot(elementSelectArea, {});
        let elementsSelect = new element.DEEPropertyItemSelect(elementsSelectRoot, "activeElement", [], "Elements", "Element list in this form.", (v) => {
            let target = element.DEEElementBase.elementList.find(e => e.id == v);
            if (target) {
                activate(target);
            }
        });

        elementsSelect.select.addEventListener("click", update);
        elementsSelect.select.addEventListener("keydown", update);
        elementsSelect.select.addEventListener("change", () => {
            let id = elementsSelect.select.value;
            let target = element.DEEElementBase.elementList.find(e => e.id == id);
            if (target) {
                activate(target);
            }
        });

        async function update() {
            elementListUpdate();
            elementsSelect.setOptions(
                element.DEEElementBase.elementList.map(e => {
                    return {
                        value: e.id,
                        caption: e.properties.name || e.id,
                        tooltip: e.properties.description || e.properties.name || e.id
                    }
                })
            );
        }
    }

    export function elementListUpdate() {
        let formBody = document.getElementById("formatBody") as HTMLDivElement;
        for (let i = 0; i < element.DEEElementBase.elementList.length;) {
            let e = element.DEEElementBase.elementList[i];
            if (!formBody.querySelector(`*[data-deid="${e.id}"]`)) {
                element.DEEElementBase.elementList.splice(i, 1);
            } else {
                i++
            }
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

    export function loadElement(element: HTMLElement) {
        let defactory = DeeList.find(e => e.getType() == element.dataset.detype);
        if (defactory) {
            let dee = defactory.loadElement(element);
            dee.id = element.dataset.deid;
            setOnClickElementEvent(dee);
        }
    }

    export function refreshElements() {
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        let htmlElements = formatBody.querySelectorAll("*[data-deid]");

        // Remove deleted element
        for (let i = 0; i < element.DEEElementBase.elementList.length;) {
            if (common.isChildOf(element.DEEElementBase.elementList[i].element, formatBody)) {
                i++;
            } else {
                element.DEEElementBase.elementList.splice(i, 1);
            }
        }

        // Reset element's id
        for (let i = 0; i < htmlElements.length; i++) {
            let htmlElement = htmlElements[i] as HTMLElement;
            let deid = htmlElement.dataset.deid!;

            let dee = element.DEEElementBase.elementList.find(e => e.id == deid);
            if (dee) {
                if (dee.element == htmlElement) {
                    // The DEE is this element. => Do nothing.
                } else {
                    // The item is Copied. => Make new element.
                    htmlElement.dataset.deid = common.newID();
                    loadElement(htmlElement);
                }
            } else {
                // The item is not loaded.
                loadElement(htmlElement);
            }
        }
    }

    //#endregion
}
