namespace ooo.de.element {
    export abstract class DEEElementBase {
        public static elementList: DEEElementBase[] = [];
        public static idCounter = 0;
        public id: number;
        public name: string = "";

        public constructor(public factory: DEEFactroyBase<any>, public element: HTMLElement, public propertyData: any = {}) {
            this.id = ++DEEElementBase.idCounter;
            DEEElementBase.elementList.push(this);
        }
        // Functions for "Form Create Mode"
        public abstract deleteElement(): void;
        public abstract showProperty(pane: HTMLDivElement): DEEPropertyRoot;
        public abstract getFormProperty(): any;
        public abstract setFormProperty(element: HTMLElement, data: any): void;

        // Functions for "Edit Mode"
        public abstract getFormData(): any;
        public abstract setFormData(data: any): void;
    }

    export abstract class DEEFactroyBase<element extends DEEElementBase>  {
        public abstract getType(): string;
        public abstract createElement(range: Range): element;
        public abstract loadElement(element: HTMLElement, data: any): element;
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
            if (range.startContainer != range.endContainer
                || range.startContainer.nodeType != Node.TEXT_NODE) {
                throw this.newError("Create Error");
            }

            let target = range.startContainer;
            let parent = target.parentNode!;
            let start: number, end: number;
            let doc = target.ownerDocument!;

            let value = target.textContent?.substring(range.startOffset, range.endOffset) ?? "";
            let element = create(value, doc);

            start = range.startOffset;
            end = range.endOffset;

            parent.insertBefore(
                doc.createTextNode(target.textContent?.substring(0, range.startOffset) ?? ""),
                target
            );
            parent.insertBefore(
                element,
                target
            );
            parent.insertBefore(
                doc.createTextNode(target.textContent?.substring(range.endOffset) ?? ""),
                target
            );
            parent.removeChild(target);

            return {
                value: value,
                element: element
            };
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