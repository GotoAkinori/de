namespace ooo.de.element {
    export class DeCommandButtonFactory extends DEEFactroyBase<DeCommandButton> {
        public getType() { return "commandbutton"; }
        public loadElement(element: HTMLElement): DeCommandButton {
            let deButton: DeCommandButton = new DeCommandButton(this, element);

            element.addEventListener("click", () => {
                if (formatEditor.pageMode == "format") {
                    DEEFactroyBase.onActive(deButton);
                } else if (formatEditor.pageMode == "view") {
                    this.command[deButton.properties.command]();
                }
            });

            deButton.id = element.dataset.deid ?? "";

            return deButton;
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Command Button";
        }

        public createElement(range: Range): DeCommandButton {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element: HTMLButtonElement = doc.createElement("button");
                element.innerText = value || "button";
                element.dataset.detype = this.getType();
                element.style.userSelect = "none";
                return element;
            });

            let deButton: DeCommandButton = new DeCommandButton(this, valueElementPair.element);
            deButton.properties.text = valueElementPair.value || "button";
            let id = common.newID();
            deButton.id = id;
            valueElementPair.element.dataset["deid"] = id;

            valueElementPair.element.addEventListener("click", () => {
                DEEFactroyBase.onActive(deButton);
            });

            return deButton;
        }

        private command: { [name: string]: () => void } = {
            submit: function () {
                formatEditor.submit();
            },
            clear: function () {
                formatEditor.clear();
            }
        }
    }

    export class DeCommandButton extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public getFormData(): any {
            return undefined;
        }
        public setFormData(data: any): void { }
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
            new element.DEEPropertyItemString(property, "text", "Caption text", "Caption text of the button.", v => {
                (this.element as HTMLInputElement).innerText = v;
            });
            new element.DEEPropertyItemSelect(property, "command",
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

        public setReadonly(): void {
            (this.element as HTMLButtonElement).setAttribute("hidden", "hidden");
        }
    }
}
