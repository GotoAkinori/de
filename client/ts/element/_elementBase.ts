namespace ooo.de.element {
    export abstract class DEEElementBase {
        public static elementList: DEEElementBase[] = [];
        public id: string = "";
        public name: string = "";
        public properties: { [key: string]: string } = {};

        public constructor(public factory: DEEFactroyBase<any>, public element: HTMLElement) {
            DEEElementBase.elementList.push(this);
            common.datasetToObject(element, this.properties);
        }
        // Functions for "Form Create Mode"
        public abstract deleteElement(): void;
        public abstract showProperty(pane: HTMLDivElement): DEEPropertyRoot;
        public abstract onClickFormatMode(ev: MouseEvent): void;
        public objectToDataset(): void {
            if (this.element) {
                common.objectToDataset(this.element, this.properties);
            }
        }
        public getSchema(schema: { [name: string]: any }): void { }

        // Functions for "View Mode"
        public abstract getFormData(data: any): void;
        public abstract setFormData(data: any): void;
        public abstract setReadonly(): void;
        public abstract onClickViewMode(ev: MouseEvent): void;
    }

    export abstract class DEEFactroyBase<element extends DEEElementBase>  {
        public abstract getType(): string;
        public abstract createElement(range: Range): element;
        public abstract loadElement(element: HTMLElement): element;
        public abstract makeToolButton(toolbutton: HTMLButtonElement): void;

        //#region General Function
        public newError(code: string): DEEError {
            return new DEEError(this.constructor.name, code);
        }
        //#endregion

        //#region Common function for "createElement".

        protected createSimpleElement(range: Range, create: (value: string, doc: Document) => HTMLElement): {
            value: string,
            element: HTMLElement
        } {
            // Check the range condition
            if (range.startContainer == range.endContainer) {
                if (range.startContainer.nodeType == Node.TEXT_NODE) {
                    let target = range.startContainer;
                    let parent = target.parentNode!;
                    let doc = target.ownerDocument!;

                    let value = target.textContent?.substring(range.startOffset, range.endOffset) ?? "";
                    let element = create(value, doc);

                    let start = range.startOffset;
                    let end = range.endOffset;

                    parent.insertBefore(
                        doc.createTextNode(target.textContent?.substring(0, start) ?? ""),
                        target
                    );
                    parent.insertBefore(
                        element,
                        target
                    );
                    parent.insertBefore(
                        doc.createTextNode(target.textContent?.substring(end) ?? ""),
                        target
                    );
                    parent.removeChild(target);

                    return {
                        value: value,
                        element: element
                    };
                } else {
                    let parent = range.startContainer!;
                    let doc = parent.ownerDocument!;

                    let value = "";
                    let element = create(value, doc);

                    let start = range.startOffset;

                    parent.insertBefore(
                        element,
                        parent.childNodes.item(start + 1)
                    );

                    return {
                        value: value,
                        element: element
                    };
                }
            } else {
                throw this.newError("Create Error");
            }
        }

        //#endregion

        //#region Event

        public static onActive: (element: DEEElementBase) => void;

        //#endregion
    }

    export class DEEError {
        public constructor(public type: string, public code: string) { }
        public getMessage() {
            return `[${this.type}, ${this.code}]`;
        }
    }
}