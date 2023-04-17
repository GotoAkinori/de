namespace ooo.de.element {
    export class DeInputExFactory extends DEEFactroyBase<DeInput> {
        public constructor(private type: string, private innerHTML: string) {
            super();
        }
        public getType() { return "input_" + this.type; }
        public loadElement(element: HTMLElement): DeInput {
            return new DeInput(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = this.innerHTML;
        }

        public createElement(range: Range): DeInput {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("input");
                element.value = value;
                element.type = this.type;
                element.contentEditable = "false";
                return element;
            });

            let deInput: DeInput = new DeInput(this, valueElementPair.element);
            deInput.properties.default_value = valueElementPair.value;

            return deInput;
        }
    }
}
