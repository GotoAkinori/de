namespace ooo.de.element {
    export class DeFileFactory extends DEEFactroyBase<DeFile> {
        public getType() { return "file"; }
        public loadElement(element: HTMLElement): DeFile {
            return new DeFile(this, element, "load");
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "File Input";
        }

        public createElement(range: Range): DeFile {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("span");
                element.classList.add("file");
                element.contentEditable = "false";
                return element;
            });

            let deInput: DeFile = new DeFile(this, valueElementPair.element, "create");
            deInput.properties.default_value = valueElementPair.value;

            return deInput;
        }
    }

    export class DeFile extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public input!: HTMLInputElement;
        public downloadButton!: HTMLButtonElement;
        public deleteButton!: HTMLButtonElement;
        public buffer: ArrayBuffer | undefined;
        public fileUpdatedFlug = false;
        public previousData: { name: string, data: string }[] = [];

        public constructor(factory: DEEFactroyBase<any>, element: HTMLElement, mode: "create" | "load") {
            super(factory, element);

            if (mode == "create") {
                this.input = common.addTag(this.element, "input");
                this.input.type = "file";
                this.input.dataset.desubtype = "file-input";
                this.input.addEventListener("change", () => {
                    this.fileUpdatedFlug = true;
                    this.downloadButton.disabled = true;
                });

                this.downloadButton = common.addTag(this.element, "button");
                this.downloadButton.dataset.desubtype = "file-download";

                let downloadImg = common.addTag(this.downloadButton, "img");
                downloadImg.src = "../image/load.svg";
                downloadImg.style.width = "15px";
                downloadImg.style.height = "15px";

                this.deleteButton = common.addTag(this.element, "button");
                this.deleteButton.dataset.desubtype = "file-delete";
                let deleteImg = common.addTag(this.deleteButton, "img");
                deleteImg.src = "../image/cross.svg";
                deleteImg.style.width = "15px";
                deleteImg.style.height = "15px";
            } else if (mode == "load") {
                this.input = this.element.children[0] as HTMLInputElement;
                this.downloadButton = this.element.children[1] as HTMLButtonElement;
                this.deleteButton = this.element.children[2] as HTMLButtonElement;
                this.downloadButton.disabled = false;
            }

            if (formatEditor.pageMode == "view") {
                this.downloadButton.addEventListener("click", () => {
                    this.download();
                });
                this.deleteButton.addEventListener("click", () => {
                    this.input.value = "";
                });
            }
        }

        public async getFormData(data: any): Promise<void> {
            if (this.properties.name) {
                let fileList: { name: string, data: string }[] = [];
                if (this.input.files) {
                    for (let i = 0; i < this.input.files.length; i++) {
                        let file = this.input.files[i];
                        let fileData = await file.arrayBuffer();
                        let fileString = common.ArrayBufferToBase64(fileData);
                        fileList.push({
                            "name": file.name,
                            "data": fileString
                        });
                    }
                }

                data[this.properties.name] = fileList;
            }
        }
        public setFormData(data: any): void {
            if (this.properties.name) {
                this.fileUpdatedFlug = false;
                this.downloadButton.disabled = false;
                this.previousData = data[this.properties.name] ?? []
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
            new element.DEEPropertyItemInput(property, "placeholder", "Placeholder", "Placeholder of the text box", v => {
                (this.element as HTMLInputElement).placeholder = v;
            });

            return this.propertyRoot;
        }

        public setReadonly(): void {
            this.input.setAttribute("readonly", "readonly");
            this.deleteButton.setAttribute("readonly", "readonly");
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

        private download() {
            if (this.previousData.length > 0) {
                for (let fileInfo of this.previousData) {
                    let file = new File(
                        [common.Base64ToArrayBuffer(fileInfo.data)],
                        fileInfo.name
                    );
                    let url = window.URL.createObjectURL(file);

                    let link = document.createElement("a");
                    link.href = url;
                    link.download = fileInfo.name;
                    link.click();
                }
            }
        }
    }
}
