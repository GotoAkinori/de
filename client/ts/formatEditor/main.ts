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
        load(params.format);

        if (params.id) {
            try {
                let data = await common.postJson(`${common.COMMAND_PATH}/form/${params.format}/load/${params.id}`);

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

        try {
            await common.post(`${common.COMMAND_PATH}/form/${params.format}/create/`, JSON.stringify(properties), common.HH_CT_JSON);
        } catch (ex) {
            console.error(ex);
        }
    }

    export function clear() {
        for (let elem of element.DEEElementBase.elementList) {
            elem.setFormData({});
        }
    }

    //#endregion
}
