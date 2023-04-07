namespace ooo.de.element {
    export class DeInputFactory extends DEEFactroyBase<DeInput> {
        public getType() { return "input"; }
        public loadElement(element: HTMLElement): DeInput {
            return new DeInput(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Text Box";
        }

        public createElement(range: Range): DeInput {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("input");
                element.value = value;
                return element;
            });

            let deInput: DeInput = new DeInput(this, valueElementPair.element);
            deInput.properties.default_value = valueElementPair.value;

            return deInput;
        }
    }

    export class DeInput extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;

        public getFormData(data: any): void {
            if (this.properties.name) {
                data[this.properties.name] = (this.element as HTMLInputElement).value;
            }
        }
        public setFormData(data: any): void {
            if (this.properties.name) {
                (this.element as HTMLInputElement).value = data[this.properties.name] ?? this.properties.default_value ?? "";
            }
        }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            new element.DEEPropertyItemInput(this.propertyRoot, "name", "Name", "Name of this element.", v => {
                (this.element as HTMLInputElement).name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "default_value", "Default Value", "Default value of the text box", v => {
                (this.element as HTMLInputElement).value = v;
            });
            new element.DEEPropertyItemInput(property, "placeholder", "Placeholder", "Placeholder of the text box", v => {
                (this.element as HTMLInputElement).placeholder = v;
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

        public getSchema(schema: { [name: string]: any }): void {
            schema[this.properties.name] = {
                type: "text"
            }
        }
    }
}
