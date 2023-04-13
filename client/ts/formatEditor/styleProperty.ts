namespace ooo.de.formatEditor {
    export function initStyleView() {
        let styleView = document.getElementById("styleView") as HTMLDivElement;
        let root = new element.DEEPropertyRoot(styleView, formatProperty);

        // Change Event
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        formatBody.addEventListener("mouseup", () => {
            onChangeSelection();
        });
        formatBody.addEventListener("keyup", () => {
            onChangeSelection();
        });
        formatBody.addEventListener("paste", () => {
            arrangeTags();
        });
        formatBody.addEventListener("input", () => {
            // input event.
        });

        showStyleProperty();
    }

    function onChangeSelection() {
        for (let name in styleProperty) {
            delete styleProperty[name];
        }
        stylePropertyRoot.resetValue();
    }

    let stylePropertyRoot: element.DEEPropertyRoot;
    let styleProperty: { [name: string]: string } = {};
    function showStyleProperty() {
        let styleView = document.getElementById("styleView") as HTMLDivElement;
        stylePropertyRoot = new element.DEEPropertyRoot(
            styleView,
            styleProperty
        );
        let debug_tab = new element.DEEPropertyItemButton(stylePropertyRoot, "Debug Arrange", "", "", () => {
            arrangeTags();
        });
        let prop_tag = new element.DEEPropertyItemSelect(
            stylePropertyRoot,
            "tag", [
            { value: "span", caption: "Text", tooltip: "Document general text." },
            { value: "h1", caption: "Title(Level 1)", tooltip: "Caption title." },
            { value: "h2", caption: "Title(Level 2)", tooltip: "Section title." }
        ], "Text type", "", (v) => {
            // TODO
        });
        let prop_color = new element.DEEPropertyItemInput(
            stylePropertyRoot,
            "color", "Text color", "Change text color.", (v) => {
                setStyle("color", v);
                arrangeTags();
            }, "color");
    }

    let targetStyle: (keyof CSSStyleDeclaration)[] = [
        "color",
        "fontWeight",
        "fontFamily",
        "fontSize",
        "fontStyle",
        "background",
        "backgroundColor",
        "textDecoration",
        "textDecorationColor",
        "textDecorationLine",
    ];

    let targetTagName: string[] = [
        "SPAN", "U", "B", "I"
    ];

    function arrangeTags(target?: Node) {
        // Change Event
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;

        function arrangeTagUnit(e: Node) {
            // remove if this is empty
            if (isEmptyNode(e)) {
                let parent = e.parentNode;
                if (parent) {
                    parent.removeChild(e);
                }
                return;
            }

            // arrange child
            for (let i = 0; i < e.childNodes.length; i++) {
                arrangeTagUnit(e.childNodes[i]);
            }

            for (let i = e.childNodes.length - 1; i >= 1; i--) {
                // join sibling
                if (compairSiblingStyle(e.childNodes[i - 1], e.childNodes[i])) {
                    joinSiblingElements(e.childNodes[i - 1], e.childNodes[i]);
                }

                // join to parent
                if (e.childNodes.length == 1 && compairParentStyle(e)) {
                    joinParentElements(e.childNodes[0]);
                }
            }
        }

        function compairSiblingStyle(e1: Node, e2: Node) {
            // Tag Check
            if (!isTarget(e1) || !isTarget(e2)) {
                return false
            }

            // Style Check
            let e1Style = getElementStyle(e1);
            let e2Style = getElementStyle(e2);
            for (let styleName of targetStyle) {
                if (e1Style[styleName] != e2Style[styleName]) {
                    return false;
                }
            }

            return true;
        }

        function joinSiblingElements(e1: Node, e2: Node) {
            let parent = e1.parentNode!;

            if (e1 instanceof Text) {
                e1.textContent = removeDoubleNL((e1.textContent ?? "") + (e2.textContent ?? ""));
                parent.removeChild(e2);
            } else if (e1 instanceof HTMLElement) {
                e1.innerText = removeDoubleNL((e1.textContent ?? "") + (e2.textContent ?? ""));
                parent.removeChild(e2);
            }
        }

        function compairParentStyle(e: Node) {
            // It is possible only if Text or Span.
            if (e instanceof Text) {
                return true;
            } else if (e instanceof HTMLSpanElement) {
                let e1Style = getElementStyle(e);
                let e2Style = getElementStyle(e.parentElement!);
                for (let styleName of targetStyle) {
                    // if the style is set, check the parent.
                    if (e1Style[styleName] != e2Style[styleName]) {
                        return false;
                    }
                }

                return true;
            } else {
                return false;
            }
        }

        function joinParentElements(e: Node) {
            let parent = e.parentNode;
            if (parent instanceof HTMLElement) {
                parent.innerText = removeDoubleNL(e.textContent ?? "");
            }
        }

        function removeDoubleNL(s: string): string {
            return s.replace(/[ \n][ \n]+/g, "\n");
        }

        function isEmptyNode(e: Node) {
            if (e instanceof Text) {
                return e.textContent == "";
            } else if (e instanceof HTMLSpanElement) {
                return e.innerText == "" && e.childElementCount == 0;
            } else {
                return false;
            }
        }

        arrangeTagUnit(target ?? formatBody);
    }

    function isTarget(e: Node) {
        return e instanceof Text || (e instanceof HTMLElement && targetTagName.indexOf(e.tagName) >= 0);
    }

    function getElementStyle(e: Node): CSSStyleDeclaration {
        if (e instanceof Text) {
            return getComputedStyle(e.parentElement!);
        } else if (e instanceof HTMLElement) {
            return getComputedStyle(e);
        } else {
            console.log(e);
            throw "Unknown Node";
        }
    }

    function setStyle(name: keyof CSSStyleDeclaration, value: string) {
        let formatBody = document.getElementById("formatBody") as HTMLDivElement;
        let allSelection = getSelection();

        // check if selection is valid.
        if (!allSelection || allSelection.rangeCount == 0) {
            return;
        }

        let selection = allSelection.getRangeAt(0);

        // check if the selection is inside of 'formatBody'.
        if (!common.isChildOf(selection.startContainer, formatBody) ||
            !common.isChildOf(selection.endContainer, formatBody)) {
            return;
        }

        // get parents of targets to change style
        let targetParents: { node: Node, start?: number, end?: number }[] = [];
        function addStartPos(node: Node, start: number) {
            let t = targetParents.find(v => v.node == node);
            if (!t) {
                t = { node: node };
                targetParents.push(t);
            }
            t.start = start;
        }
        function addEndPos(node: Node, end: number) {
            let t = targetParents.find(v => v.node == node);
            if (!t) {
                t = { node: node };
                targetParents.push(t);
            }
            t.end = end;
        }
        function getChildIndex(node: Node): number {
            if (node.parentNode instanceof HTMLElement) {
                for (let i = 0; i < node.parentNode.childNodes.length; i++) {
                    if (node == node.parentNode.childNodes[i]) {
                        return i;
                    }
                }
            }
            console.log("Unexpected.");
            return -1;
        }

        // set start position
        addStartPos(selection.startContainer, selection.startOffset);
        for (
            let cur = selection.startContainer;
            cur.parentNode != null && !(cur instanceof HTMLBodyElement);
            cur = cur.parentNode
        ) {
            if (cur.parentNode instanceof HTMLElement) {
                addStartPos(cur.parentNode, getChildIndex(cur));
            } else {
                console.log("Unexpected.");
            }
        }

        // set end position
        addEndPos(selection.endContainer, selection.endOffset);
        for (
            let cur = selection.endContainer;
            cur.parentNode != null && !(cur instanceof HTMLBodyElement);
            cur = cur.parentNode
        ) {
            if (cur.parentNode instanceof HTMLElement) {
                addEndPos(cur.parentNode, getChildIndex(cur));
            } else {
                console.log("Unexpected.");
            }
        }

        // get target nodes
        let targetNodes: HTMLElement[] = [];

        for (let t of targetParents) {
            if (t.node instanceof Text) {
                if ((t.start == undefined || t.start == 0) && t.end == undefined) {
                    let newSpan = common.insertTagBefore(t.node, "span");
                    newSpan.innerText = t.node.textContent ?? "";
                    let parent = t.node.parentNode;
                    if (parent) {
                        parent.removeChild(t.node);
                    }
                    targetNodes.push(newSpan);
                } else if (t.end == undefined) {
                    let newSpan = common.insertTagAfter(t.node, "span");
                    let originalText = t.node.textContent ?? "";
                    newSpan.innerText = originalText.substring(t.start!);
                    t.node.textContent = originalText.substring(0, t.start!);
                    targetNodes.push(newSpan);
                } else if (t.start == undefined || t.start == 0) {
                    let newSpan = common.insertTagBefore(t.node, "span");
                    let originalText = t.node.textContent ?? "";
                    newSpan.innerText = originalText.substring(0, t.end!);
                    t.node.textContent = originalText.substring(t.end!);
                    targetNodes.push(newSpan);
                } else {
                    let newSpan = common.insertTagAfter(t.node, "span");

                    let originalText = t.node.textContent ?? "";
                    t.node.textContent = originalText.substring(0, t.start!);
                    newSpan.innerText = originalText.substring(t.start!, t.end!);
                    newSpan.insertAdjacentText("afterend", originalText.substring(t.end!));

                    targetNodes.push(newSpan);
                }
            } else if (t.node instanceof HTMLElement) {
                let startPos = t.start == undefined ? 0 : t.start + 1;
                let endPos = t.end == undefined ? t.node.childNodes.length : t.end;

                for (let pos = startPos; pos < endPos; pos++) {
                    let child = t.node.childNodes[pos];
                    if (child instanceof Text) {
                        let newSpan = common.insertTagAfter(child, "span");
                        newSpan.innerText = child.textContent ?? "";
                        t.node.removeChild(child);
                        targetNodes.push(newSpan);
                    } else if (child instanceof HTMLElement) {
                        targetNodes.push(child);
                    } else {
                        console.log("Unexpected");
                    }
                }
            } else {
                console.log("Unexpected");
            }
        }

        // set Style
        for (let target of targetNodes) {
            (target.style as any)[name] = value;
        }
    }
}