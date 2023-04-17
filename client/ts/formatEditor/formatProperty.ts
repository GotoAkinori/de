namespace ooo.de.formatEditor {
    export let formatProperty: { [key: string]: any } = {};
    let formatPropertyList: element.DEEPropertyBase[] = [];
    export function setFormProperty() {
        for (let e of formatPropertyList) {
            e.setValue(formatProperty);
        }
    }

    export async function initFormatProperty() {
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