namespace ooo.de.formatEditor {
    export let DeeList: element.DEEFactroyBase<any>[] = [];

    //#region Make Format
    export function init_format() {
        AddDEE(new element.DeInputFactory());
        AddDEE(new element.DeCommandButtonFactory());

        element.DEEFactroyBase.onActive = onActive;
        document.getElementById("menubutton")!.addEventListener("click", showMenu);
    }

    let properties: {
        [id: number]: {
            element: element.DEEFactroyBase<any>,
            propertyData: any,
            keepData: any
        }
    } = {};
    let activeProperty: number = -1;

    /**
     * Add new DEEBase element.
     * @param factory New DEEBase element.
     */
    function AddDEE(factory: element.DEEFactroyBase<any>) {
        let toolbarPane = document.getElementById("toolbar") as HTMLDivElement;
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;

        DeeList.push(factory);
        factory.makeToolButton(common.addButton(toolbarPane, "", () => {
            let selection = document.getSelection();

            if (selection && selection.rangeCount > 0) {
                let target = selection.getRangeAt(0).startContainer;

                if (common.checkIsChild(formatBody, target)) {
                    let data = factory.createElement(selection.getRangeAt(0));
                }
            }
        }, "toolbutton"));
    }

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
        let formBody = document.getElementById("formatBody");
        let data = {
            html: formBody?.innerHTML,
            properties: {} as { [key: string]: any }
        };
        for (let elem of element.DEEElementBase.elementList) {
            data.properties[elem.propertyData.name] = elem.getFormProperty();
        }
        try {
            common.post("../command/format/save/" + formatName, data);
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
        let list = await common.postJson("../command/format/list/all") as string[];
        let selectedItem: HTMLDivElement | undefined = undefined;
        let selectedFormatName: string = "";
        for (let name of list) {
            let formatName = name.substring(0, name.length - 5);
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
        let data = await common.postJson("../command/format/load/" + formatName);

        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatBody.innerHTML = data.html;
        let properties = data.properties;

        for (let name in properties) {
            let element: HTMLElement | null = formatBody.querySelector(`*[name='${name}']`);
            if (element) {
                let defactory = DeeList.find(e => e.getType() == element!.dataset.detype);
                defactory?.loadElement(element, properties[name]);
            }
        }
    }
    //#endregion

    //#region 



    //#endregion
}