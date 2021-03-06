namespace ooo.de.element {
    export class DeInputFactory extends DEEFactroyBase<DeInput> {
        public getType() { return "input"; }
        public loadElement(element: HTMLElement, data: any): DeInput {
            let deInput: DeInput = new DeInput(this, element, data);
            (element as HTMLInputElement).value = data.property.default;

            element.addEventListener("focus", () => {
                DEEFactroyBase.onActive(deInput);
            });
            deInput.name = data.name;

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
            if (!deInput.propertyData.property) {
                deInput.propertyData.property = {};
            }
            deInput.propertyData.property.defaultValue = valueElementPair.value;

            valueElementPair.element.addEventListener("focus", () => {
                DEEFactroyBase.onActive(deInput);
            });

            return deInput;
        }
    }

    export class DeInput extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;

        public getFormProperty() {
            if (this.propertyRoot) {
                return this.propertyRoot.getValue();
            }
        }
        public setFormProperty(element: HTMLElement, data: any): void {
            throw new Error("Method not implemented.");
        }
        public getFormData(): any {
            return (this.element as HTMLInputElement).value;
        }
        public setFormData(data: any): void {
            (this.element as HTMLInputElement).value = data;
        }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane);
            if (!this.propertyData.property) {
                this.propertyData.property = {};
            }

            pane.innerHTML = "";
            new element.DEEPropertyItemString(this.propertyRoot, "name", this.propertyData, "Name", "Name of this element.", v => {
                (this.element as HTMLInputElement).name = v;
                this.name = v;
            });
            let property = new element.DEEPropertyBox(this.propertyRoot, "property", "Property");
            new element.DEEPropertyItemString(property, "default", this.propertyData.property, "Default Value", "Default value of the text box", v => {
                (this.element as HTMLInputElement).value = v;
            });
            new element.DEEPropertyItemString(property, "placeholder", this.propertyData.property, "Placeholder", "Placeholder of the text box");

            return this.propertyRoot;
        }
    }
}
