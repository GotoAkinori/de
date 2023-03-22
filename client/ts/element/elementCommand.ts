namespace ooo.de.element {
    export class DeCommandButtonFactory extends DEEFactroyBase<DeCommandButton> {
        public getType() { return "commandbutton"; }
        public loadElement(element: HTMLElement, data: any): DeCommandButton {
            let deButton: DeCommandButton = new DeCommandButton(this, element, data);
            (element as HTMLButtonElement).innerText = data.property.text;

            element.addEventListener("focus", () => {
                DEEFactroyBase.onActive(deButton);
            });
            deButton.name = data.name;

            return deButton;
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Command Button";
        }

        public createElement(range: Range): DeCommandButton {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("button");
                element.innerText = value || "button";
                element.dataset.detype = this.getType();
                element.style.userSelect = "none";
                return element;
            });

            let deButton: DeCommandButton = new DeCommandButton(this, valueElementPair.element);
            if (!deButton.propertyData.property) {
                deButton.propertyData.property = {};
            }
            deButton.propertyData.property.text = valueElementPair.value || "button";
            let elementName = common.newName();
            deButton.propertyData.name = elementName;
            (valueElementPair.element as HTMLButtonElement).name = elementName;

            valueElementPair.element.addEventListener("click", () => {
                DEEFactroyBase.onActive(deButton);
            });

            return deButton;
        }
    }

    export class DeCommandButton extends DEEElementBase {
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
            new element.DEEPropertyItemString(property, "text", this.propertyData.property, "Caption text", "Caption text of the button.", v => {
                (this.element as HTMLInputElement).innerText = v;
            });
            new element.DEEPropertyItemSelect(property, "command", this.propertyData.property,
                [
                    { value: "", caption: "", tooltip: "" },
                    { value: "submit", caption: "submit", tooltip: "Submit the form." },
                    { value: "clear", caption: "clear", tooltip: "Clear the form." },
                ],
                "Command type", "Command type of the button.", v => {
                    (this.element as HTMLInputElement).placeholder = v;
                });

            return this.propertyRoot;
        }
    }
}
