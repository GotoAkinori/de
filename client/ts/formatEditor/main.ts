namespace ooo.de.formatEditor {
    export let DeeList: element.DEEFactroyBase<any>[] = [];
    export let pageMode: "view" | "format";

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
                    }
                }
            }, "toolbutton"));
        }
    }

    function AddSystemDEE() {
        AddDEE(new element.DeInputFactory());
        AddDEE(new element.DeCommandButtonFactory());
        AddDEE(new element.DeTableFactory());
    }
    //#endregion

    //#region Make Format
    export function init_format() {
        pageMode = "format";
        AddSystemDEE();

        element.DEEFactroyBase.onActive = onActive;
        document.getElementById("menubutton")!.addEventListener("click", showMenu);
    }

    let activeProperty: string;

    function onActive(element: element.DEEElementBase) {
        let propertyView = document.getElementById("propertyView") as HTMLDivElement;

        if (activeProperty != element.id) {
            element.showProperty(propertyView);
        }
    }

    function showMenu() {
        let [base, back] = ooo.de.common.modal();
        let button = document.getElementById("menubutton") as HTMLButtonElement;
        base.style.top = button.getBoundingClientRect().bottom + "px";

        // Save
        const saveMenu = common.addTag(base, "div", "menu-item");
        saveMenu.addEventListener("click", () => {
            back.remove();
            showSaveDialog();
        });
        saveMenu.innerText = "Save";

        // Load
        const loadMenu = common.addTag(base, "div", "menu-item");
        loadMenu.addEventListener("click", () => {
            back.remove();
            showLoadDialog();
        });
        loadMenu.innerText = "Load";
    }

    function showSaveDialog() {
        let [base, back] = ooo.de.common.modal();
        base.style.top = "10px";
        base.style.left = "10px";

        common.addTextDiv(base, "Format Name");
        let input = common.addTag(base, "input");
        input.placeholder = "Format Name";
        input.focus();
        common.addButton(base, "Save", async () => {
            try {
                await save(input.value);
                back.remove();
            } catch (ex) {
                console.error(ex);
            }
        });
    }

    async function save(formatName: string) {
        for (let elem of element.DEEElementBase.elementList) {
            elem.objectToDataset();
        }

        let html = document.getElementById("formatBody")!.innerHTML;
        try {
            common.post("../../command/format/save/" + formatName, html, common.HH_CT_TEXT);
        } catch (ex) {
            console.error(ex);
        }
    }

    async function showLoadDialog() {
        let [base, back] = ooo.de.common.modal();
        base.style.top = "10px";
        base.style.left = "10px";

        common.addTextDiv(base, "Format List");
        let listDiv = common.addTag(base, "div");
        let list = await common.postJson("../../command/format/list/all") as string[];
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

    async function load(formatName: string) {
        let data = await common.post("../../command/format/load/" + formatName);

        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatBody.innerHTML = data;

        let elements = formatBody.querySelectorAll(`*[data-deid]`);
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                let defactory = DeeList.find(e => e.getType() == element!.dataset.detype);
                if (defactory) {
                    let dee = defactory.loadElement(element);
                    dee.id = element.dataset["deid"] ?? "";
                    setOnClickElementEvent(dee);
                }
            }
        });
    }

    function setOnClickElementEvent(dee: element.DEEElementBase) {
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

        let data = await common.post("../../command/format/load/" + params.format);

        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatBody.innerHTML = data;

        let elements = formatBody.querySelectorAll(`*[data-deid]`);
        elements.forEach(element => {
            if (element instanceof HTMLElement) {
                let defactory = DeeList.find(e => e.getType() == element!.dataset.detype);
                defactory?.loadElement(element);
            }
        });

        if (params.id) {
            try {
                let data = await common.postJson(`../../command/form/${params.format}/load/${params.id}`);

                for (let elem of element.DEEElementBase.elementList) {
                    elem.setFormData(data[elem.id]);
                    if (params.readonly) {
                        elem.setReadonly();
                    }
                }
            } catch (ex) {
                console.error(ex);
            }
        }
    }

    export function submit() {
        let properties: { [key: string]: any } = {};
        for (let elem of element.DEEElementBase.elementList) {
            if (elem.properties.name) {
                properties[elem.properties.name] = elem.getFormData();
            }
        }

        try {
            common.post(`../../command/form/${params.format}/create/`, JSON.stringify(properties), common.HH_CT_JSON);
        } catch (ex) {
            console.error(ex);
        }
    }

    export function clear() {
        for (let elem of element.DEEElementBase.elementList) {
            elem.setFormData(undefined);
        }
    }

    //#endregion
}
