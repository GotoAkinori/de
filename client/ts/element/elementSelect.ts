namespace ooo.de.element {
    export class DeSelectFactory extends DEEFactroyBase<DeSelect> {
        public getType() { return "select"; }
        public loadElement(element: HTMLElement): DeSelect {
            let deSelect = new DeSelect(this, element);
            if (deSelect.properties.default_value) {
                (element as HTMLSelectElement).value = deSelect.properties.default_value;
            }
            return deSelect;
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Select";
        }

        public createElement(range: Range): DeSelect {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("select");
                return element;
            });

            let deSelect: DeSelect = new DeSelect(this, valueElementPair.element);

            return deSelect;
        }
    }

    export class DeSelect extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;

        public getFormData(data: any): void {
            if (this.properties.name) {
                data[this.properties.name] = (this.element as HTMLSelectElement).value;
            }
        }
        public setFormData(data: any): void {
            if (this.properties.name) {
                (this.element as HTMLSelectElement).value = data[this.properties.name] ?? this.properties.default_value ?? "";
            }
        }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            pane.innerHTML = "";
            new element.DEEPropertyItemInput(this.propertyRoot, "name", "Name", "Name of this element.", v => {
                (this.element as HTMLInputElement).name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "default_value", "Default Value", "Default value of the text box", v => {
                (this.element as HTMLSelectElement).value = v;
            });
            let propertyOptions = new element.DEEPropertyItemDataTable(
                property,
                "options",
                [{
                    name: "value",
                    caption: "Value",
                    description: "Data value of item.",
                    notNull: true
                }, {
                    name: "caption",
                    caption: "Caption",
                    description: "Text displayed in option list."
                }],
                "Options", "Options of select", () => {
                    let select = this.element as HTMLSelectElement;
                    select.innerHTML = "";
                    for (let d of JSON.parse(propertyOptions.data.options)) {
                        let option = common.addTag(select, "option");
                        option.innerText = d.caption || d.value;
                        option.value = d.value;
                    }
                });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLSelectElement).setAttribute("readonly", "readonly");
        }

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
        }
        public onClickViewMode(ev: MouseEvent): void { }

        public getSchema(schema: { [name: string]: any }): void {
            schema[this.properties.name] = {
                type: "list",
                options: JSON.parse(this.properties.options).map((v: any) => v.value),
                optionsCaption: JSON.parse(this.properties.options).map((v: any) => v.caption)
            }
        }
    }
}
