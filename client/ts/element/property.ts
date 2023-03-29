namespace ooo.de.element {
    type keyValue = { [name: string]: string };
    export abstract class DEEPropertyBase {
        protected children: DEEPropertyBase[] = [];

        public constructor(protected parent: DEEPropertyBase | undefined, public name: string, public data: keyValue) {
            if (parent) {
                parent.children.push(this);
            }
        }

        public getValue(): void {
            for (let key in this.children) {
                this.children[key].getValue();
            }
        }
        public setValue(data: any) {
            for (let key in this.children) {
                let prop = this.children[key];
                if (prop) {
                    prop.setValue(data);
                }
            }
        }
        public abstract getBody(): HTMLDivElement;

        public newLine() {
            common.addTag(this.getBody(), "br");
        }
    }
    export class DEEPropertyRoot extends DEEPropertyBase {
        public constructor(private pane: HTMLDivElement, public data: keyValue) {
            super(undefined, "", data);
        }

        public getBody() {
            return this.pane;
        }
    }
    export class DEEPropertyBox extends DEEPropertyBase {
        base: HTMLDivElement;
        header: HTMLDivElement;
        body: HTMLDivElement;

        public constructor(parent: DEEPropertyBase, caption: string) {
            super(parent, "", parent.data);

            this.base = common.addTag(parent.getBody(), "div", "prop-base");
            this.header = common.addTag(this.base, "div", "prop-header");
            this.body = common.addTag(this.base, "div", "prop-body");

            this.header.innerHTML = caption;
            let open = true;
            let openButton = common.addButton(this.header, "▲", () => {
                open = !open;
                if (open) {
                    this.body.classList.remove("shrink");
                    openButton.innerText = "▲";
                } else {
                    this.body.classList.add("shrink");
                    openButton.innerText = "▼";
                }
            }, "open");
        }

        public getBody() {
            return this.body;
        }
    }

    export class DEEPropertyGroup extends DEEPropertyBase {
        body: HTMLDivElement;

        public constructor(parent: DEEPropertyBase, caption: string, description?: string) {
            super(parent, "", parent.data);

            this.body = common.addTag(parent.getBody(), "div", "prop-body");
            this.body.style.padding = "0px";

            let div = common.addTag(this.body, "div", "property-name");
            div.style.padding = "0px";
            div.innerText = caption;
            if (description) { div.title = description; }
        }

        public getBody() {
            return this.body;
        }
    }

    export class DEEPropertyItemInput extends DEEPropertyBase {
        input: HTMLInputElement;
        public constructor(parent: DEEPropertyBase, public name: string, caption?: string, description?: string, onChange?: (value: string) => void, type?: string) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }

            this.input = common.addTag(parent.getBody(), "input");
            this.input.style.marginLeft = "10px";
            this.input.value = this.data ? this.data[name] ?? "" : "";
            this.input.addEventListener("change", () => {
                this.data[name] = this.input.value;
                if (onChange) {
                    onChange(this.input.value);
                }
            });
            if (type) {
                this.input.type = type;
            }
        }
        public setValue(value: string) {
            this.input.value = value;
        }
        public getValue(): void {
            this.data[this.name] = this.input.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemSelect extends DEEPropertyBase {
        select: HTMLSelectElement;
        public constructor(parent: DEEPropertyBase, public name: string, options: (string | { value: string, caption: string, tooltip: string })[], caption?: string, description?: string, onChange?: (value: string) => void) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }

            this.select = common.addTag(parent.getBody(), "select");
            this.select.style.marginLeft = "10px";
            this.select.addEventListener("change", () => {
                this.data[name] = this.select.value;
                if (onChange) {
                    onChange(this.select.value);
                }
            });

            for (let option of options) {
                let value: string;
                let caption: string;
                let tooltip: string;
                if (typeof (option) == "string") {
                    value = option;
                    caption = option;
                    tooltip = option;
                } else {
                    value = option.value;
                    caption = option.caption;
                    tooltip = option.tooltip;
                }

                let optionElement = common.addTag(this.select, "option");
                optionElement.value = value;
                optionElement.title = tooltip;
                optionElement.innerText = caption;
            }

            this.select.value = this.data ? this.data[name] ?? "" : "";
        }
        public setValue(value: string) {
            this.select.value = value;
        }
        public getValue(): void {
            this.data[this.name] = this.select.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemCheckBox extends DEEPropertyBase {
        input: HTMLInputElement;
        label: HTMLLabelElement;
        public constructor(parent: DEEPropertyBase, public name: string, caption?: string, description?: string, onChange?: (value: boolean) => void) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div");
            this.label = common.addTag(div, "label");

            this.input = common.addTag(this.label, "input");
            this.input.style.marginLeft = "10px";
            this.input.type = "checkbox";
            this.input.addEventListener("change", () => {
                this.data[name] = this.input.checked ? "1" : "0";
                if (onChange) {
                    onChange(this.input.checked);
                }
            });
            this.input.checked = this.data[name] == "1";

            let span = common.addTag(this.label, "span");
            span.innerText = caption ?? name;
        }
        public setValue(value: string) {
            this.input.checked = (value == "1");
        }
        public getValue(): void {
            this.data[this.name] = this.input.checked ? "1" : "0";
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemButton extends DEEPropertyBase {
        button: HTMLButtonElement;
        public constructor(parent: DEEPropertyBase, caption: string, icon?: string, description?: string, onClick?: () => void) {
            super(parent, "", parent.data);

            this.button = common.addButton(parent.getBody(), "button", () => {
                if (onClick) {
                    onClick();
                }
            });
            this.button.style.marginLeft = "10px";
            this.button.innerText = caption;
            this.button.title = description ?? "";

            if (icon) {
                let img = common.addTag(this.button, "img");
                img.src = "../image/" + icon;
            }
        }
        public setValue(value: string) { }
        public getValue(): void { }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemDataTable extends DEEPropertyBase {
        private table: HTMLTableElement;
        private thead: HTMLTableSectionElement;
        private tbody: HTMLTableSectionElement;
        private tbody_add: HTMLTableSectionElement;

        public constructor(parent: DEEPropertyBase,
            public name: string,
            public columns: { name: string, caption?: string, description?: string, type?: "string" | "check", notNull?: boolean }[],
            caption?: string, description?: string,
            private onChange?: () => void
        ) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }

            this.table = common.addTag(parent.getBody(), "table", "prop-datatable");
            this.table.style.marginLeft = "10px";

            this.thead = common.addTag(this.table, "thead", "prop-head");
            this.tbody = common.addTag(this.table, "tbody", "prop-body");
            this.tbody_add = common.addTag(this.table, "tbody", "prop-body");

            // set header
            let [, tds_headers] = common.addTR(this.thead, columns.length + 1);
            for (let i = 0; i < columns.length; i++) {
                tds_headers[i + 1].innerText = columns[i].caption ?? columns[i].name;
                if (columns[i].description) {
                    tds_headers[i + 1].title = columns[i].description!;
                }
            }

            // set property
            let data = parent.data[name];
            if (data) {
                this.setValue(data);
            }

            // initial process
            this.addAddRow();
        }

        // add new row event
        private newRow() {
            try {
                let tr = this.tbody_add.firstChild as HTMLTableRowElement;
                this.tbody.insertBefore(tr, null);
                this.setToolTD(tr);
                this.addAddRow();
            } catch (ex) {
                console.log("NG");
            }
        }

        // set row to add
        private addAddRow() {
            let [tr_add, tds_add] = common.addTR(this.tbody_add, this.columns.length + 1);
            for (let i = 0; i < this.columns.length; i++) {
                let input = common.addTag(tds_add[i + 1], "input");
                input.addEventListener("change", () => {
                    this.onChangeInput(input);
                });
                input.addEventListener("keydown", ev => {
                    if (ev.key == "Enter") {
                        this.onChangeInput(input);
                    }
                });
            }
        }

        // on change item
        private onChangeInput(input: HTMLInputElement) {
            let td = input.parentElement as HTMLTableCellElement;
            let tr = td.parentElement as HTMLTableRowElement;

            if (tr.parentElement == this.tbody_add) {
                this.newRow();
            }
            this.getValue();
            if (this.onChange) {
                this.onChange();
            }
        }

        // add tool cell
        private setToolTD(tr: HTMLTableRowElement) {
            let div = common.addTag(tr.firstChild as HTMLTableRowElement, "div");

            // up button
            let upButton = common.addButton(div, "", () => {
                if (tr.rowIndex > 1) {
                    this.tbody.insertBefore(tr, tr.previousSibling);
                }
                this.getValue();
                if (this.onChange) {
                    this.onChange();
                }
            });
            let upImg = common.addTag(upButton, "img");
            upImg.src = "../image/upArrow.svg";

            // down button
            let downButton = common.addButton(div, "", () => {
                if (tr.rowIndex < this.tbody.rows.length) {
                    this.tbody.insertBefore(tr, tr.nextElementSibling!.nextElementSibling);
                }
                this.getValue();
                if (this.onChange) {
                    this.onChange();
                }
            });
            let downImg = common.addTag(downButton, "img");
            downImg.src = "../image/downArrow.svg";

            // remove button
            let removeButton = common.addButton(div, "", () => {
                tr.remove();
                this.getValue();
                if (this.onChange) {
                    this.onChange();
                }
            });
            let removeImg = common.addTag(removeButton, "img");
            removeImg.src = "../image/cross.svg";
        }

        public setValue(value: string) {
            let data = JSON.parse(value);
            this.tbody.innerHTML = "";

            for (let rowData of data) {
                let [tr, tds] = common.addTR(this.tbody, this.columns.length + 1);
                this.setToolTD(tr);
                for (let i = 0; i < this.columns.length; i++) {
                    let input = common.addTag(tds[i + 1], "input");
                    input.addEventListener("change", () => {
                        this.onChangeInput(input);
                    });
                    input.addEventListener("keydown", ev => {
                        if (ev.key == "Enter") {
                            this.onChangeInput(input);
                        }
                    });
                    input.value = rowData[this.columns[i].name] ?? "";
                }
            }
        }

        public getValue(): void {
            this.data[this.name] = JSON.stringify(this.getData());
        }

        public getData() {
            let data: any[] = [];
            for (let r = 0; r < this.tbody.rows.length; r++) {
                let rowData: any = {};
                data.push(rowData);
                for (let c = 1; c < this.tbody.rows[r].cells.length; c++) {
                    rowData[this.columns[c - 1].name] = (this.tbody.rows[r].cells[c].firstChild as HTMLInputElement).value;
                }
            }
            return data;
        }

        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }
}
