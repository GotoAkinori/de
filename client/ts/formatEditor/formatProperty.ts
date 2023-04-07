namespace ooo.de.formatEditor {
    export let formatProperty: { [key: string]: any } = {};
    let formatPropertyList: element.DEEPropertyBase[] = [];
    export function setFormProperty() {
        for (let e of formatPropertyList) {
            e.setValue(formatProperty);
        }
    }

    export async function makeCommonInfoPane() {
        let commonInfoView = document.getElementById("commonInfoView") as HTMLDivElement;

        let root = new element.DEEPropertyRoot(commonInfoView, formatProperty);

        let boxFormatInfo = new element.DEEPropertyBox(root, "Format Information");

        // Save/Load
        new element.DEEPropertyItemButton(boxFormatInfo, "", "../image/save.svg", "Save format.", showSaveDialog);
        new element.DEEPropertyItemButton(boxFormatInfo, "", "../image/load.svg", "Load format.", showLoadDialog);
        new element.DEEPropertyItemButton(boxFormatInfo, "", "../image/view.svg", "View format.", () => {
            if (formatProperty.formatName) {
                window.open(`./viewer.html?format=${formatProperty.formatName}`);
            }
        });
        new element.DEEPropertyItemButton(boxFormatInfo, "", "../image/html.svg", "Save format.", showLoadHTMLDialog);

        // Format name
        let formatName = new element.DEEPropertyItemInput(boxFormatInfo, "formatName", "Format Name", "Name of the format.");
        formatPropertyList.push(formatName);

        // Schema of format
        let makeSchema = new element.DEEPropertyItemCheckBox(boxFormatInfo, "makeSchema", "Make schema", "If you want to make schema of this format, please check this.", (v) => {
            if (v) {
                schemaGroup.show();
            } else {
                schemaGroup.hide();
            }
        }, true);
        formatPropertyList.push(makeSchema);

        let schemaGroup = new element.DEEPropertyGroup(boxFormatInfo, "", "Schema Information");
        schemaGroup.hide();

        let schemaName = new element.DEEPropertyItemInput(schemaGroup, "schemaName", "Schema name", "Set schema name. If empty, schema name is format name.");
        formatPropertyList.push(schemaName);

        let idProperty = new element.DEEPropertyItemSelect(boxFormatInfo, "idProperty",
            [],
            "Document ID property", "Set id property name. If empty, ID is random value.");
        {
            let updateIdProp = () => {
                elementListUpdate();
                idProperty.setOptions(["", ...propertyNameList()]);
            }
            idProperty.select.addEventListener("click", updateIdProp);
            idProperty.select.addEventListener("key", updateIdProp);
        }
        formatPropertyList.push(idProperty);

        // Element List
        let elementsSelect = new element.DEEPropertyItemSelect(boxFormatInfo, "activeElement", [], "Elements", "Element list in this form.", (v) => {
            let target = element.DEEElementBase.elementList.find(e => e.id == v);
            if (target) {
                activate(target);
            }
        });
        formatPropertyList.push(elementsSelect);

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

        elementsSelect.select.addEventListener("click", update);
        elementsSelect.select.addEventListener("keydown", update);
        elementsSelect.select.addEventListener("change", () => {
            let id = elementsSelect.select.value;
            let target = element.DEEElementBase.elementList.find(e => e.id == id);
            if (target) {
                activate(target);
            }
        });
    }

    function elementListUpdate() {
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

    function propertyNameList() {
        return element.DEEElementBase.elementList.map(v => v.properties.name).filter((v, i, arr) => v && arr.indexOf(v) == i);
    };

    export function getSchema() {
        let schema: { [key: string]: any } = {};

        for (let elem of element.DEEElementBase.elementList) {
            elem.getSchema(schema);
        }

        return schema;
    }
}