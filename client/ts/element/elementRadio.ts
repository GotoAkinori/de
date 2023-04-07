namespace ooo.de.element {
    export class DeRadioFactory extends DEEFactroyBase<DeRadio> {
        public getType() { return "radio"; }
        public loadElement(element: HTMLElement): DeRadio {
            return new DeRadio(this, element, "", "load");
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Radio Button";
        }

        public createElement(range: Range): DeRadio {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("label");
                return element;
            });

            let deRadio: DeRadio = new DeRadio(this, valueElementPair.element, valueElementPair.value, "create");

            return deRadio;
        }
    }

    export class DeRadio extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public radioElement!: HTMLInputElement;
        public textElement!: HTMLSpanElement;

        public constructor(public factory: DEEFactroyBase<any>, public element: HTMLElement, value: string, mode: "create" | "load") {
            super(factory, element);

            if (mode == "create") {
                this.radioElement = common.addTag(element, "input");
                this.radioElement.type = "radio";
                this.radioElement.dataset.desubtype = "radio";

                this.textElement = common.addTag(element, "span");
                this.textElement.innerText = value;
                this.textElement.dataset.desubtype = "text";

                this.properties.value = value;
                this.properties.caption = value;
            } else if (mode == "load") {
                for (let i = 0; i < element.children.length; i++) {
                    let child = element.children.item(i);
                    if (child instanceof HTMLInputElement && child.dataset.desubtype == "radio") {
                        this.radioElement = child;
                    } else if (child instanceof HTMLSpanElement && child.dataset.desubtype == "text") {
                        this.textElement = child;
                    }
                }
            }
        }

        public getFormData(data: any): any {
            if (this.radioElement.checked) {
                data[this.properties.name] = this.properties.value;
            }
        }
        public setFormData(data: any): void {
            if (data[this.properties.name] == this.properties.value) {
                this.radioElement.checked = true;
            }
        }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            new element.DEEPropertyItemInput(this.propertyRoot, "name", "Name", "Name of this element.", v => {
                this.radioElement.name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "value", "Value", "Value of this element.", v => {
                this.textElement.innerText = this.properties.caption || v;
                this.radioElement.value = v;
            });
            new element.DEEPropertyItemInput(property, "caption", "Caption", "Caption of this element.", v => {
                this.textElement.innerText = this.properties.caption || v;
            });
            new element.DEEPropertyItemCheckBox(property, "default", "Default", "Check if this item is default.", v => {
                this.radioElement.checked = v;

                for (let dee of DEEElementBase.elementList) {
                    // unset radio buttons with the same name.
                    if (dee instanceof DeRadio && dee.properties.name == this.properties.name && dee != this) {
                        dee.unSetDefault();
                    }
                }
            });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLInputElement).setAttribute("readonly", "readonly");
        }

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
        }
        public onClickViewMode(ev: MouseEvent): void { }

        public unSetDefault() {
            this.properties.default = "0";
            this.radioElement.checked = false;
        }

        public getSchema(schema: { [name: string]: any }): void {
            if (schema[this.properties.name]) {
                schema[this.properties.name].options.push(this.properties.value);
                schema[this.properties.name].optionsCaption.push(this.properties.caption);
            } else {
                schema[this.properties.name] = {
                    type: "list",
                    options: [this.properties.value],
                    optionsCaption: [this.properties.caption]
                }
            }
        }
    }
}
