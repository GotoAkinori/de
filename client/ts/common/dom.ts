namespace ooo.de.common {
    //#region Add New Element
    /**
     * Add new HTML element.
     * @param parent Parent element of new element.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    export function addTag<T extends keyof HTMLElementTagNameMap>(parent: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T] {
        let doc = parent.ownerDocument ?? document;
        let element = doc.createElement(tagName);
        parent.appendChild(element);

        if (className) {
            element.classList.add(className);
        }

        return element;
    }

    export function addTextDiv(parent: HTMLElement, text: string, className?: string): HTMLDivElement {
        let div = addTag(parent, "div", className);
        div.innerText = text;
        return div;
    }

    /**
     * Insert new HTML element.
     * @param target Target element of new element. New element is insert before this.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    export function insertTagBefore<T extends keyof HTMLElementTagNameMap>(target: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T] {
        let doc = target.ownerDocument ?? document;
        let parent = target.parentElement;
        let element = doc.createElement(tagName);
        parent?.insertBefore(element, target);

        if (className) {
            element.classList.add(className);
        }

        return element;
    }

    /**
     * Insert new HTML element.
     * @param target Target element of new element. New element is insert after this.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    export function insertTagAfter<T extends keyof HTMLElementTagNameMap>(target: HTMLElement, tagName: T, className?: string): HTMLElementTagNameMap[T] {
        let doc = target.ownerDocument ?? document;
        let parent = target.parentElement;
        let element = doc.createElement(tagName);
        parent?.insertBefore(element, target.nextSibling);

        if (className) {
            element.classList.add(className);
        }

        return element;
    }

    /**
     * Add new button.
     * @param parent Parent element of new button
     * @param caption Caption of new button
     * @param callback Callback function when the button is clicked
     * @param className class name of new button.
     */
    export function addButton(parent: HTMLElement, caption: string, callback: () => void, className?: string) {
        let button = addTag(parent, "button", className);
        button.addEventListener("click", callback);
        button.innerHTML = caption;
        return button;
    }

    export function addTR(
        parent: HTMLTableElement | HTMLTableSectionElement,
        columns: number, trClassName?: string, tdClassName?: string
    ): [HTMLTableRowElement, HTMLTableCellElement[]] {
        let tr = addTag(parent, "tr", trClassName);
        let tds: HTMLTableCellElement[] = [];
        for (let i = 0; i < columns; i++) {
            tds.push(addTag(tr, "td", tdClassName));
        }

        return [tr, tds];
    }

    //#endregion

    //#region Others
    export function checkIsChild(parent: Node, child: Node): boolean {
        let cursor: Node | null = child;

        while (cursor) {
            if (parent == cursor) {
                return true;
            }
            cursor = cursor.parentNode;
        }

        return false;
    }

    export function modal(): [HTMLDivElement, HTMLDivElement] {
        const back = common.addTag(document.body, "div");
        const base = common.addTag(back, "div");
        back.classList.add("back");
        base.classList.add("base");

        back.addEventListener("click", (ev) => {
            if (ev.target == back) {
                back.remove();
            }
        });

        return [base, back];
    }

    export function newID(): string {
        for (let i = 1; true; i++) {
            let element = document.querySelector(`*[data-deid='#${i}']`);
            if (element == null) {
                return `#${i}`;
            }
        }
    }

    export function objectToDataset(element: HTMLElement, properties: { [key: string]: any }) {
        for (let key in properties) {
            element.dataset["de_" + key] = properties[key];
        }
    }

    export function datasetToObject(element: HTMLElement, properties: { [key: string]: string }) {
        for (let key in element.dataset) {
            if (key.startsWith("de_")) {
                let key2 = key.substring(3);
                properties[key2] = element.dataset[key] ?? "";
            }
        }
    }

    //#endregion
}