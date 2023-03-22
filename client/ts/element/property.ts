namespace ooo.de.element {
    export abstract class DEEPropertySet {
        propertyItems: { [name: string]: DEEPropertySet } = {};

        public getValue(): any {
            let data: { [key: string]: any } = {};
            for (let key in this.propertyItems) {
                data[key] = this.propertyItems[key].getValue();
            }
            return data;
        }
        public setValue(data: any) {
            for (let key in data) {
                let prop = this.propertyItems[key];
                if (prop) {
                    prop.setValue(data[key]);
                }
            }
        }
        public abstract getBody(): HTMLDivElement;
    }
    export class DEEPropertyRoot extends DEEPropertySet {
        public constructor(private pane: HTMLDivElement) {
            super();
        }

        public getBody() {
            return this.pane;
        }
    }
    export class DEEPropertyBox extends DEEPropertySet {
        base: HTMLDivElement;
        header: HTMLDivElement;
        body: HTMLDivElement;
        name: string = "";

        public constructor(parent: DEEPropertySet, name: string, caption: string) {
            super();

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

            this.name = name;
            parent.propertyItems[name] = this;
        }

        public getBody() {
            return this.body;
        }
    }

    export class DEEPropertyItemString extends DEEPropertySet {
        input: HTMLInputElement;
        public constructor(parent: DEEPropertySet, name: string, data: any, caption?: string, description?: string, onChange?: (value: string) => void) {
            super();

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }
            parent.propertyItems[name] = this;

            this.input = common.addTag(parent.getBody(), "input");
            this.input.style.marginLeft = "10px";
            this.input.value = data ? data[name] ?? "" : "";
            this.input.addEventListener("change", () => {
                data[name] = this.input.value;
                if (onChange) {
                    onChange(this.input.value);
                }
            });
        }
        public setValue(value: string) {
            this.input.value = value;
        }
        public getValue(): string {
            return this.input.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }

    export class DEEPropertyItemSelect extends DEEPropertySet {
        select: HTMLSelectElement;
        public constructor(parent: DEEPropertySet, name: string, data: any, options: (string | { value: string, caption: string, tooltip: string })[], caption?: string, description?: string, onChange?: (value: string) => void) {
            super();

            let div = common.addTag(parent.getBody(), "div", "property-name");
            div.innerText = caption ?? name;
            if (description) { div.title = description; }
            parent.propertyItems[name] = this;

            this.select = common.addTag(parent.getBody(), "select");
            this.select.style.marginLeft = "10px";
            this.select.value = data ? data[name] ?? "" : "";
            this.select.addEventListener("change", () => {
                data[name] = this.select.value;
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
        public getValue(): string {
            return this.select.value;
        }
        public getBody(): HTMLDivElement {
            throw new Error("Method not implemented.");
        }
    }
}
