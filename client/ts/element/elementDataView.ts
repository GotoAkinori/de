namespace ooo.de.element {
    export class DeDataViewFactory extends DEEFactroyBase<DeDataView> {
        public getType() { return "dataview"; }
        public loadElement(element: HTMLElement): DeDataView {
            return new DeDataView(this, element, "load");
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Data View";
        }

        public createElement(range: Range): DeDataView {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("table");
                element.classList.add("dataview");
                element.contentEditable = "false";
                return element;
            });

            let dee: DeDataView = new DeDataView(this, valueElementPair.element, "create");
            dee.properties.default_value = valueElementPair.value;

            return dee;
        }
    }

    type ColumnInfo = { name: string, caption: string, title: string };

    export class DeDataView extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public thead!: HTMLTableSectionElement;
        public headerRow!: HTMLTableRowElement;
        public tbody!: HTMLTableSectionElement;

        public constructor(public factory: DEEFactroyBase<any>, public element: HTMLElement, mode: "create" | "load") {
            super(factory, element);

            if (mode == "create") {
                this.thead = common.addTag(element, "thead");
                this.tbody = common.addTag(element, "tbody");
                this.headerRow = common.addTag(this.thead, "tr");

                this.properties.columns = '[{"name":"Header 1"},{"name":"Header 2"}]';
                this.setHeader();

                this.tbody.dataset.desubtype = "dataview-body";
            } else if (mode == "load") {
                this.thead = (element as HTMLTableElement).tHead!;
                this.tbody = (element as HTMLTableElement).tBodies[0];

                if (formatEditor.pageMode == "view") {
                    this.loadData();
                }
            }
        }

        public async getFormData(data: any): Promise<void> { }
        public setFormData(data: any): void { }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            new element.DEEPropertyItemInput(this.propertyRoot, "data", "Format/Schema Name", "Name of data format.", v => {
                (this.element as HTMLInputElement).name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "Propertys");
            new element.DEEPropertyItemDataTable(
                property,
                "columns",
                [{
                    name: "name",
                    caption: "Name",
                    description: "Column name of item.",
                    notNull: true
                }, {
                    name: "caption",
                    caption: "Caption",
                    description: "Text displayed in table header list."
                }, {
                    name: "title",
                    caption: "Title",
                    description: "Text displayed as tooltip."
                }],
                "Columns", "Columns of data table", () => {
                    this.setHeader();
                });

            let propertyTool = new element.DEEPropertyGroup(property, "Tool Button");
            new element.DEEPropertyItemCheckBox(propertyTool, "button_remove", "Remove Button");
            new element.DEEPropertyItemCheckBox(propertyTool, "button_view", "View Button");
            new element.DEEPropertyItemCheckBox(propertyTool, "button_edit", "Edit Button");

            return this.propertyRoot;
        }

        public setReadonly(): void { }

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
        }
        public onClickViewMode(ev: MouseEvent): void { }

        public async loadData() {
            try {
                let dataList: {
                    id: string,
                    data: any
                }[] = await common.postJson(`${common.COMMAND_PATH}/form/${this.properties.data}/getAll`)

                // Clear data
                this.tbody.innerHTML = "";

                // Show data
                let columns: ColumnInfo[] = JSON.parse(this.properties.columns);
                for (let item of dataList) {
                    let [tr, tds] = common.addTR(this.tbody, columns.length + 2);

                    // Tool column
                    this.setButton(tds[0], item.id);

                    // ID column
                    tds[1].innerText = item.id;

                    // Data columns
                    for (let c = 0; c < columns.length; c++) {
                        tds[c + 2].innerText = item.data[columns[c].name];
                    }
                }
            } catch (ex) {
                console.log(`[Data Load Error] data: ${this.properties.data}`);
            }
        }

        public async setHeader() {
            let columns: ColumnInfo[]
            if (this.properties.columns) {
                columns = JSON.parse(this.properties.columns);
            } else {
                columns = [];
            }

            this.headerRow.innerHTML = "";

            let td_tool = common.addTag(this.headerRow, "td");
            let td_id = common.addTag(this.headerRow, "td");
            td_id.innerText = "ID";

            for (let c = 0; c < columns.length; c++) {
                let td = common.addTag(this.headerRow, "td");
                td.innerText = columns[c].caption || columns[c].name;
                td.title = columns[c].title || columns[c].caption || columns[c].name;
            }
        }

        private showData(data: any): string {
            switch (typeof data) {
                case "string": {
                    return data;
                } break;
                case "number": {
                    return data.toString();
                } break;
                case "object": {
                    if (Array.isArray(data)) {
                        return "<div>" + data.map(v => this.showData(v)).join("</div><div>") + "</div>";
                    } else {
                        let retS = "<table>";
                        let retE = "</table>";

                        let retM = "";
                        for (let k in data) {
                            retM += `<tr><td>${k}</td><td>${this.showData(data[k])}</td></tr>`;
                        }

                        return retS + retM + retE;
                    }
                } break;

                default: {
                    return data.toString();
                }
            }
        }

        private setButton(td: HTMLTableCellElement, id: string) {
            // Remove Button
            if (this.properties.button_remove == "1") {
                let removeButton = common.addButton(td, "", async () => {
                    let result = await common.postJson(`${common.COMMAND_PATH}/form/${this.properties.format}/remove/${id}`)
                    if (result.result) {
                        td.parentElement?.remove();
                    }
                });
                let img = common.addTag(removeButton, "img");
                img.src = "../image/cross.svg";
            }

            // View Button
            if (this.properties.button_view == "1") {
                let viewButton = common.addButton(td, "", async () => {
                    window.open(`./viewer.html?format=${this.properties.data}&id=${id}&readonly=1`);
                });
                let img = common.addTag(viewButton, "img");
                img.src = "../image/view.svg";
            }

            // Edit Button
            if (this.properties.button_edit == "1") {
                let editButton = common.addButton(td, "", async () => {
                    window.open(`./viewer.html?format=${this.properties.data}&id=${id}`);
                });
                let img = common.addTag(editButton, "img");
                img.src = "../image/edit.svg";
            }
        }
    }
}
