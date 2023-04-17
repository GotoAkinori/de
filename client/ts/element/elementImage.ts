namespace ooo.de.element {
    export class DeImageFactory extends DEEFactroyBase<DeImage> {
        public getType() { return "image"; }
        public loadElement(element: HTMLElement): DeImage {
            return new DeImage(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "Image";
        }

        public createElement(range: Range): DeImage {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("img");
                element.style.width = "20px";
                return element;
            });

            let dee: DeImage = new DeImage(this, valueElementPair.element);
            dee.properties.width = "20";
            dee.objectToDataset();

            return dee;
        }
    }

    export class DeImage extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;

        public async getFormData(data: any): Promise<void> { }
        public setFormData(data: any): void { }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");

            let property_image = new element.DEEPropertyItemFile(property, "image", "Image File", "Upload image file.", v => {
                let reader = new FileReader();
                if (property_image.input.files && property_image.input.files[0]) {
                    reader.addEventListener("load", () => {
                        (this.element as HTMLImageElement).src = reader.result as string;
                    });
                    reader.readAsDataURL(property_image.input.files[0]);
                }
            });

            new element.DEEPropertyItemInput(property, "width", "Image width", "Set image width.", v => {
                (this.element as HTMLImageElement).style.width = (v == "0" || v == "") ? "" : v + "px";
            }, "number");
            property.getBody().append("px");

            new element.DEEPropertyItemInput(property, "height", "Image height", "Set image height.", v => {
                (this.element as HTMLImageElement).style.height = (v == "0" || v == "") ? "" : v + "px";
            }, "number");
            property.getBody().append("px");

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

        public onAfterCreate(): void {
            this.properties.name = this.id;
        }
    }
}
