namespace ooo.de.element {
    type keyValue = { [name: string]: string };
    export abstract class DEEPropertyBase {
        protected children: DEEPropertyBase[] = [];

        public constructor(protected parent: DEEPropertyBase | undefined, public name: string, public data: keyValue) {
            if (parent) {
                parent.children.push(this);
            }
        }

        public getValue(): void {
            for (let key in this.children) {
                this.children[key].getValue();
            }
        }
        public setValue(data: any) {
            for (let key in this.children) {
                let prop = this.children[key];
                if (prop) {
                    prop.setValue(data);
                }
            }
        }
        public abstract getBody(): HTMLDivElement;
    }
    export class DEEPropertyRoot extends DEEPropertyBase {
        public constructor(private pane: HTMLDivElement, public data: keyValue) {
            super(undefined, "", data);
        }

        public getBody() {
            return this.pane;
        }
    }
    export class DEEPropertyBox extends DEEPropertyBase {
        base: HTMLDivElement;
        header: HTMLDivElement;
        body: HTMLDivElement;

        public constructor(parent: DEEPropertyBase, caption: string) {
            super(parent, "", parent.data);

            this.base = common.addTag(parent.getBody(), "div", "prop-base");
            this.header = common.addTag(this.base, "div", "prop-header");
            this.body = common.addTag(this.base, "div", "prop-body");

            this.header.innerHTML = caption;
            let open = true;
            let openButton = common.addButton(this.header, "▲", () => {
                open = !open;
                if (open) {
                    this.body.classList.remove("shrink");
                    openButton.innerText = "▲";
                } else {
                    this.body.classList.add("shrink");
                    openButton.innerText = "▼";
                }
            }, "open");
        }

        public getBody() {
            return this.body;
        }
    }

    export class DEEPropertyItemString extends DEEPropertyBase {
        input: HTMLInputElement;
        public constructor(parent: DEEPropertyBase, public name: string, caption?: string, description?: string, onChange?: (value: string) => void) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }

            this.input = common.addTag(parent.getBody(), "input");
            this.input.style.marginLeft = "10px";
            this.input.value = this.data ? this.data[name] ?? "" : "";
            this.input.addEventListener("change", () => {
                this.data[name] = this.input.value;
                if (onChange) {
                    onChange(this.input.value);
                }
            });
        }
        public setValue(value: string) {
            this.input.value = value;
        }
        public getValue(): void {
            this.data[this.name] = this.input.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemSelect extends DEEPropertyBase {
        select: HTMLSelectElement;
        public constructor(parent: DEEPropertyBase, public name: string, options: (string | { value: string, caption: string, tooltip: string })[], caption?: string, description?: string, onChange?: (value: string) => void) {
            super(parent, name, parent.data);

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }

            this.select = common.addTag(parent.getBody(), "select");
            this.select.style.marginLeft = "10px";
            this.select.value = this.data ? this.data[name] ?? "" : "";
            this.select.addEventListener("change", () => {
                this.data[name] = this.select.value;
                if (onChange) {
                    onChange(this.select.value);
                }
            });

            for (let option of options) {
                let value: string;
                let caption: string;
                let tooltip: string;
                if (typeof (option) == "string") {
                    value = option;
                    caption = option;
                    tooltip = option;
                } else {
                    value = option.value;
                    caption = option.caption;
                    tooltip = option.tooltip;
                }

                let optionElement = common.addTag(this.select, "option");
                optionElement.value = value;
                optionElement.title = tooltip;
                optionElement.innerText = caption;
            }
        }
        public setValue(value: string) {
            this.select.value = value;
        }
        public getValue(): void {
            this.data[this.name] = this.select.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemCheckBox extends DEEPropertyBase {
        input: HTMLInputElement;
        label: HTMLLabelElement;
        public constructor(parent: DEEPropertyBase, public name: string, caption?: string, description?: string, onChange?: (value: boolean) => void) {
            super(parent, name, parent.data);

            this.label = common.addTag(parent.getBody(), "label");

            this.input = common.addTag(this.label, "input");
            this.input.style.marginLeft = "10px";
            this.input.type = "checkbox";
            this.input.addEventListener("change", () => {
                this.data[name] = this.input.checked ? "1" : "0";
                if (onChange) {
                    onChange(this.input.checked);
                }
            });
            this.input.checked = this.data[name] == "1";

            let span = common.addTag(this.label, "span");
            span.innerText = caption ?? name;
        }
        public setValue(value: string) {
            this.input.checked = (value == "1");
        }
        public getValue(): void {
            this.data[this.name] = this.input.checked ? "1" : "0";
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }
}
