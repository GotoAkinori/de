namespace ooo.de.common {
    //#region Add New Element
    /**
     * Add new HTML element.
     * @param parent Parent element of new element.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    export function addTag<T extends keyof HTMLElementTagNameMap>(parent: HTMLElement, tagName: T, className?: string | string[]): HTMLElementTagNameMap[T] {
        let doc = parent.ownerDocument ?? document;
        let element = doc.createElement(tagName);
        parent.appendChild(element);

        if (className) {
            if (Array.isArray(className)) {
                for (let classNameItem of className) {
                    element.classList.add(classNameItem);
                }
            } else {
                element.classList.add(className);
            }
        }

        return element;
    }

    export function addTextDiv(parent: HTMLElement, text: string, className?: string | string[]): HTMLDivElement {
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
    export function insertTagBefore<T extends keyof HTMLElementTagNameMap>(target: Node, tagName: T, className?: string | string[]): HTMLElementTagNameMap[T] {
        let doc = target.ownerDocument ?? document;
        let parent = target.parentElement;
        let element = doc.createElement(tagName);
        parent?.insertBefore(element, target);

        if (className) {
            if (Array.isArray(className)) {
                for (let classNameItem of className) {
                    element.classList.add(classNameItem);
                }
            } else {
                element.classList.add(className);
            }
        }


        return element;
    }

    /**
     * Insert new HTML element.
     * @param target Target element of new element. New element is insert after this.
     * @param tagName tag name of new element.
     * @param className class name of new element.
     */
    export function insertTagAfter<T extends keyof HTMLElementTagNameMap>(target: Node, tagName: T, className?: string | string[]): HTMLElementTagNameMap[T] {
        let doc = target.ownerDocument ?? document;
        let parent = target.parentElement;
        let element = doc.createElement(tagName);
        parent?.insertBefore(element, target.nextSibling);

        if (className) {
            if (Array.isArray(className)) {
                for (let classNameItem of className) {
                    element.classList.add(classNameItem);
                }
            } else {
                element.classList.add(className);
            }
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
    export function addButton(parent: HTMLElement, caption: string, callback: (ev: MouseEvent) => void, className?: string | string[]) {
        let button = addTag(parent, "button", className);
        button.addEventListener("click", callback);
        button.innerHTML = caption;
        return button;
    }

    export function addImageButton(parent: HTMLElement, image: string, callback: (ev: MouseEvent) => void, className?: string | string[]) {
        let button = addTag(parent, "button", className);
        button.addEventListener("click", callback);
        let imageTag = addTag(button, "img");
        imageTag.src = image;
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

    //#region Tab
    type TabItemInfo = {
        caption: string,
        name: string,
        htmlID?: string
    }

    const scrollWidth = 40;

    export class TabView {
        private headArea: HTMLDivElement;
        private headAreaScroll: HTMLDivElement;
        private bodyArea: HTMLDivElement;
        private items: {
            name: string,
            header: HTMLSpanElement,
            body: HTMLDivElement
        }[] = [];

        public constructor(private parent: HTMLElement, tabItemInfoList: TabItemInfo[]) {
            parent.classList.add("pane-tab");
            let headAreaTop = addTag(parent, "div", "head-area");
            this.headAreaScroll = addTag(headAreaTop, "div", "head-area-scroll");
            this.headArea = addTag(this.headAreaScroll, "div", "head-area-items");
            this.bodyArea = addTag(parent, "div", "body-area");

            addImageButton(headAreaTop, "../image/leftArrow.svg", () => {
                this.headAreaScroll.scrollBy({
                    left: -scrollWidth
                });
            }, ["tab-button", "left"]);
            addImageButton(headAreaTop, "../image/rightArrow.svg", () => {
                this.headAreaScroll.scrollBy({
                    left: scrollWidth
                });
            }, ["tab-button", "right"]);

            for (let tabItemInfo of tabItemInfoList) {
                this.addTabItem(tabItemInfo);
            }

            if (tabItemInfoList.length > 0) {
                this.activateTabItem(tabItemInfoList[0].name, false);
            }
            this.adjustHeaderSize();
        }

        public addTabItem(tabItemInfo: TabItemInfo) {
            // add header
            let header = addTag(this.headArea, "span", "tab-head-item");
            header.innerHTML = tabItemInfo.caption;

            // add body
            let body = addTag(this.bodyArea, "div", "tab-item");
            if (tabItemInfo.htmlID) {
                body.id = tabItemInfo.htmlID;
            }

            // click event
            header.addEventListener("click", () => {
                this.activateTabItem(tabItemInfo.name);
            });

            // add tab item
            this.items.push({
                name: tabItemInfo.name,
                header: header,
                body: body
            });

        }

        public getTabItem(name: string): HTMLDivElement | undefined {
            return this.items.find(v => v.name == name)?.body
        }

        public activateTabItem(name: string, adjust: boolean = true) {
            for (let item of this.items) {
                if (item.name == name) {
                    item.header.classList.add("active");
                    item.body.classList.add("active");
                } else {
                    item.header.classList.remove("active");
                    item.body.classList.remove("active");
                }
            }

            if (adjust) {
                this.adjustHeaderSize();
            }
        }

        private adjustHeaderSize() {
            this.headArea.style.width = this.items.reduce((p, v) => p + v.header.offsetWidth, 5) + "px";
        }
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

    export function isChildOf(c: Node, p: Node): boolean {
        let cur = c.parentNode;
        while (cur != null) {
            if (cur == p) {
                return true;
            }
            cur = cur.parentNode;
        }
        return false;
    }

    //#endregion
}