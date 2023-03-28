namespace ooo.de.element {
    export class DeCommandButtonFactory extends DEEFactroyBase<DeCommandButton> {
        public getType() { return "commandbutton"; }
        public loadElement(element: HTMLElement): DeCommandButton {
            return new DeCommandButton(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Command Button";
        }

        public createElement(range: Range): DeCommandButton {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element: HTMLButtonElement = doc.createElement("button");
                element.innerText = value || "button";
                element.style.userSelect = "none";
                return element;
            });

            let deButton: DeCommandButton = new DeCommandButton(this, valueElementPair.element);
            deButton.properties.text = valueElementPair.value || "button";

            return deButton;
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
            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "text", "Caption text", "Caption text of the button.", v => {
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

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
        }
        public onClickViewMode(ev: MouseEvent): void {
            command[this.properties.command]();
        }
    }

    let command: { [name: string]: () => void } = {
        submit: function () {
            formatEditor.submit();
        },
        clear: function () {
            formatEditor.clear();
        }
    }
}
