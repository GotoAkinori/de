namespace ooo.de.element {
    export class DeInputFactory extends DEEFactroyBase<DeInput> {
        public getType() { return "input"; }
        public loadElement(element: HTMLElement): DeInput {
            let deInput: DeInput = new DeInput(this, element);

            element.addEventListener("click", () => {
                if (formatEditor.pageMode == "format") {
                    DEEFactroyBase.onActive(deInput);
                }
            });
            deInput.id = element.dataset["deid"] ?? "";

            return deInput;
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Text Box";
        }

        public createElement(range: Range): DeInput {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("input");
                element.value = value;
                element.dataset.detype = this.getType();
                return element;
            });

            let deInput: DeInput = new DeInput(this, valueElementPair.element);
            deInput.properties.default_value = valueElementPair.value;
            let id = common.newID();
            deInput.id = id;
            valueElementPair.element.dataset["deid"] = id;

            valueElementPair.element.addEventListener("focus", () => {
                DEEFactroyBase.onActive(deInput);
            });

            return deInput;
        }
    }

    export class DeInput extends DEEElementBase {
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
            new element.DEEPropertyItemString(this.propertyRoot, "name", "Name", "Name of this element.", v => {
                (this.element as HTMLInputElement).name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemString(property, "default_value", "Default Value", "Default value of the text box", v => {
                (this.element as HTMLInputElement).value = v;
            });
            new element.DEEPropertyItemString(property, "placeholder", "Placeholder", "Placeholder of the text box", v => {
                (this.element as HTMLInputElement).placeholder = v;
            });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLInputElement).setAttribute("readonly", "readonly");
        }
    }
}
