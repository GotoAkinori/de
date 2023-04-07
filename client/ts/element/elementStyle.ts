namespace ooo.de.element {
    type partialCSSStyleDeclaration = { [K in keyof (CSSStyleDeclaration)]?: CSSStyleDeclaration[K] };

    export class DeStyleFactory extends DEEFactroyBase<DeStyle> {
        public constructor(
            private type: string,
            private buttonCaption: string,
            private styleProperties: partialCSSStyleDeclaration
        ) {
            super();
        }

        public getType() { return "style-" + this.type; }
        public loadElement(element: HTMLElement): DeStyle {
            return new DeStyle(
                this,
                element,
                Object.assign({}, this.styleProperties));
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = this.buttonCaption;
        }

        public createElement(range: Range): DeStyle {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("span");
                element.innerText = value;
                return element;
            });

            let deInput: DeStyle = new DeStyle(
                this,
                valueElementPair.element,
                Object.assign({}, this.styleProperties));
            deInput.properties.default_value = valueElementPair.value;

            return deInput;
        }
    }

    export class DeStyle extends DEEElementBase {
        public stylePropertyRoot: DEEPropertyRoot | null = null;
        public constructor(
            factory: DEEFactroyBase<DeStyle>,
            element: HTMLElement,
            private styleProperties: partialCSSStyleDeclaration
        ) {
            super(factory, element);
            this.onChange();
        }

        public getFormData(data: any): void { }
        public setFormData(data: any): void { }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public onChange() {
            for (let k in this.styleProperties) {
                this.element.style[k] = this.styleProperties[k] ?? "";
            }
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.stylePropertyRoot = new DEEPropertyRoot(pane, this.styleProperties as any);


            let styleBox = new element.DEEPropertyBox(this.stylePropertyRoot, "Style");
            new element.DEEPropertyItemInput(styleBox, "backgroundColor", "Background color", "Background color of the area.", () => this.onChange(), "color");
            new element.DEEPropertyItemInput(styleBox, "fontSize", "Font size", "Font size. For example, '15px', '10pt'.", () => this.onChange());
            new element.DEEPropertyItemSelect(styleBox, "fontWeight", [
                "", "lighter", "normal", "boolder", "bold"
            ], "Font weight", "Font weight. ", () => this.onChange());
            new element.DEEPropertyItemSelect(styleBox, "fontStyle", [
                "", "normal", "italic", "oblique"
            ], "Font weight", "Font weight. ", () => this.onChange());
            new element.DEEPropertyItemInput(styleBox, "color", "Font color", "Font color of the area.", () => this.onChange(), "color");
            new element.DEEPropertyItemSelect(styleBox, "display", [
                "", "inline", "block", "inline-block",
            ], "Display type", "Display type of the area.", () => this.onChange());
            return this.stylePropertyRoot;
        }

        public setReadonly(): void { }

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
        }
        public onClickViewMode(ev: MouseEvent): void { }

        public getSchema(schema: { [name: string]: any }): void { }
    }
}
