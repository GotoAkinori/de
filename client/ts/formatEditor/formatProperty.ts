namespace ooo.de.formatEditor {
    export let formatProperty: { [key: string]: any } = {};
    let formatPropertyListToReset: element.DEEPropertyBase[] = [];
    export function onChangeFormProperty() {
        for (let e of formatPropertyListToReset) {
            e.resetValue();
        }
    }
    export async function makeCommonInfoPane() {
        let commonInfoView = document.getElementById("commonInfoView") as HTMLDivElement;
        let formBody = document.getElementById("formatBody") as HTMLDivElement;

        let root = new element.DEEPropertyRoot(commonInfoView, formatProperty);
        let box = new element.DEEPropertyBox(root, "Format Information");

        // Format name
        let formatName = new element.DEEPropertyItemInput(box, "formatName", "Format Name", "Name of the format.");
        formatPropertyListToReset.push(formatName);

        // Schema of format
        let makeSchema = new element.DEEPropertyItemCheckBox(box, "makeSchema", "Make schema", "If you want to make schema of this format, please check this.", (v) => {
            if (v) {
                schemaGroup.show();
            } else {
                schemaGroup.hide();
            }
        });
        formatPropertyListToReset.push(makeSchema);

        let schemaGroup = new element.DEEPropertyGroup(box, "", "Schema Information");
        schemaGroup.hide();

        let schemaName = new element.DEEPropertyItemInput(schemaGroup, "schemaName", "Schema name", "Set schema name. If empty, schema name is equals to format name.");
        formatPropertyListToReset.push(schemaName);

        let idProperty = new element.DEEPropertyItemSelect(schemaGroup, "idProperty",
            propertyNameList(),
            "Document ID property", "Set id property name. If empty, id is random value.");
        {
            let updateIdProp = () => {
                elementListUpdate();
                idProperty.setOptions(propertyNameList());
            }
            idProperty.select.addEventListener("click", updateIdProp);
            idProperty.select.addEventListener("key", updateIdProp);
        }
        formatPropertyListToReset.push(idProperty);

        // Element List
        let elementsSelect = new element.DEEPropertyItemSelect(box, "activeElement", [], "Elements", "Element list in this form.", (v) => {
            let target = element.DEEElementBase.elementList.find(e => e.id == v);
            if (target) {
                activate(target);
            }
        });
        formatPropertyListToReset.push(elementsSelect);

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
        let schema: { [key: string]: string } = {};

        for (let elem of element.DEEElementBase.elementList) {
            elem.getSchema(schema);
        }

        return schema;
    }
}