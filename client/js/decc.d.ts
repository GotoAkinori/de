declare namespace ooo.de.common {
    /**
     * Add new HTML element.
     * @param parent Parent element of new element.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    function addTag<T extends keyof HTMLElementTagNameMap>(parent: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T];
    /**
     * Insert new HTML element.
     * @param target Target element of new element. New element is insert before this.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    function insertTagBefore<T extends keyof HTMLElementTagNameMap>(target: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T];
    function addTextDiv(parent: HTMLElement, text: string, className?: string): HTMLDivElement;
    /**
     * Insert new HTML element.
     * @param target Target element of new element. New element is insert after this.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    function insertTagAfter<T extends keyof HTMLElementTagNameMap>(target: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T];
    /**
     * Add new button.
     * @param parent Parent element of new button
     * @param caption Caption of new button
     * @param callback Callback function when the button is clicked
     * @param className class name of new button.
     */
    function addButton(parent: HTMLElement, caption: string, callback: () => void, className?: string): HTMLButtonElement;
    function checkIsChild(parent: Node, child: Node): boolean;
    function modal(): [HTMLDivElement, HTMLDivElement];
}
declare namespace ooo.de.common {
    function postJson(url: string, data?: any): Promise<any>;
}
declare namespace ooo.de.element {
    abstract class DEEElementBase {
        factory: DEEFactroyBase<any>;
        element: HTMLElement;
        propertyData: any;
        static elementList: DEEElementBase[];
        static idCounter: number;
        id: number;
        name: string;
        constructor(factory: DEEFactroyBase<any>, element: HTMLElement, propertyData?: any);
        abstract deleteElement(): void;
        abstract showProperty(pane: HTMLDivElement): DEEPropertyRoot;
        abstract getFormProperty(): any;
        abstract setFormProperty(element: HTMLElement, data: any): void;
        abstract getFormData(): any;
        abstract setFormData(data: any): void;
    }
    abstract class DEEFactroyBase<element extends DEEElementBase> {
        abstract getType(): string;
        abstract createElement(range: Range): element;
        abstract loadElement(element: HTMLElement, data: any): element;
        abstract makeToolButton(toolbutton: HTMLButtonElement): void;
        newError(code: string): DEEError;
        protected createSimpleElement(range: Range, create: (value: string, doc: Document) => HTMLElement): {
            value: string;
            element: HTMLElement;
        };
        static onActive: (element: DEEElementBase) => void;
    }
    class DEEError {
        type: string;
        code: string;
        constructor(type: string, code: string);
        getMessage(): string;
    }
}
declare namespace ooo.de.element {
    class DeInputFactory extends DEEFactroyBase<DeInput> {
        getType(): string;
        loadElement(element: HTMLElement, data: any): DeInput;
        propContainer?: element.DEEPropertyBox;
        makeToolButton(toolbutton: HTMLButtonElement): void;
        createElement(range: Range): DeInput;
    }
    class DeInput extends DEEElementBase {
        propertyRoot: DEEPropertyRoot | null;
        getFormProperty(): any;
        setFormProperty(element: HTMLElement, data: any): void;
        getFormData(): any;
        setFormData(data: any): void;
        deleteElement(): void;
        showProperty(pane: HTMLDivElement): DEEPropertyRoot;
    }
}
declare namespace ooo.de.element {
    abstract class DEEPropertySet {
        propertyItems: {
            [name: string]: DEEPropertySet;
        };
        getValue(): any;
        setValue(data: any): void;
        abstract getBody(): HTMLDivElement;
    }
    class DEEPropertyRoot extends DEEPropertySet {
        private pane;
        constructor(pane: HTMLDivElement);
        getBody(): HTMLDivElement;
    }
    class DEEPropertyBox extends DEEPropertySet {
        base: HTMLDivElement;
        header: HTMLDivElement;
        body: HTMLDivElement;
        name: string;
        constructor(parent: DEEPropertySet, name: string, caption: string);
        getBody(): HTMLDivElement;
    }
    class DEEPropertyItemString extends DEEPropertySet {
        input: HTMLInputElement;
        constructor(parent: DEEPropertySet, name: string, data: any, caption?: string, description?: string, onChange?: (value: string) => void);
        setValue(value: string): void;
        getValue(): string;
        getBody(): HTMLDivElement;
    }
}
declare namespace ooo.de.formatEditor {
    let DeeList: element.DEEFactroyBase<any>[];
    function init_format(): void;
}
