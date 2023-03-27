namespace ooo.de.element {
    const DEFAULT_COLUMNS = 2;
    const DEFAULT_ROWS = 2;
    let tableClassList = ["grid", "pane"];

    export class DeTableFactory extends DEEFactroyBase<DeTable> {
        public getType() { return "table"; }
        public loadElement(element: HTMLElement): DeTable {
            let deTable: DeTable = new DeTable(this, element);

            element.addEventListener("click", (ev) => {
                if ((ev.target as HTMLElement).closest(`*[data-detype]`) == element) {
                    if (formatEditor.pageMode == "format") {
                        DEEFactroyBase.onActive(deTable);
                    }
                }
            });
            deTable.id = element.dataset["deid"] ?? "";

            return deTable;
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "TABLE";
        }

        public createElement(range: Range): DeTable {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("table");
                element.dataset.detype = this.getType();
                element.classList.add(tableClassList[0]);
                return element;
            });

            let deTable: DeTable = new DeTable(this, valueElementPair.element);
            let id = common.newID();
            deTable.properties.name = id;
            (valueElementPair.element as HTMLInputElement).dataset["deid"] = id;

            for (let r = 0; r < DEFAULT_ROWS; r++) {
                let [tr, tds] = common.addTR(valueElementPair.element as HTMLTableElement, DEFAULT_COLUMNS);
                for (let td of tds) {
                    common.addTag(td, "div");
                }
            }

            valueElementPair.element.addEventListener("click", (ev) => {
                if ((ev.target as HTMLElement).closest(`*[data-detype]`) == valueElementPair.element) {
                    if (formatEditor.pageMode == "format") {
                        DEEFactroyBase.onActive(deTable);
                    }
                }
            });

            deTable.properties.border = "1";

            return deTable;
        }
    }

    export class DeTable extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public getFormData(): any {
            return (this.element as HTMLInputElement).value;
        }
        public setFormData(data: any): void {
            (this.element as HTMLInputElement).value = data ?? this.properties.default_value ?? "";
        }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            pane.innerHTML = "";
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemCheckBox(property, "border", "Border", "", v => {
                if (v) {
                    (this.element as HTMLTableElement).classList.add("grid");
                } else {
                    (this.element as HTMLTableElement).classList.remove("grid");
                }
            });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLInputElement).setAttribute("readonly", "readonly");
        }
    }
}
