namespace ooo.de.element {
    export class DeLinkFactory extends DEEFactroyBase<DeLink> {
        public getType() { return "link"; }
        public loadElement(element: HTMLElement): DeInput {
            return new DeInput(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Link";
        }

        public createElement(range: Range): DeInput {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("a");
                element.innerText = value;
                element.contentEditable = "false";
                return element;
            });

            let deInput: DeLink = new DeLink(this, valueElementPair.element);
            deInput.properties.text = valueElementPair.value;

            return deInput;
        }
    }

    export class DeLink extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;

        public async getFormData(data: any): Promise<void> {
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

            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "text", "Caption text", "Text of the item.", v => {
                (this.element as HTMLAnchorElement).innerText = v;
            });
            new element.DEEPropertyItemInput(property, "link", "Link", "Link of the item.", v => {
                (this.element as HTMLAnchorElement).href = v;
            });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLAnchorElement).setAttribute("readonly", "readonly");
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

        public onAfterCreate(): void {
            this.properties.name = this.id;
        }
    }
}
