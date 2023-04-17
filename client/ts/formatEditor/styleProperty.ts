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
            setTimeout(() => {
                refreshElements();
                arrangeTags();
            }, 0);
        });
        formatBody.addEventListener("focus", () => {
            arrangeTags();
        });
        formatBody.addEventListener("input", () => {
            // input event.
        });
        formatBody.addEventListener("blur", () => {
            arrangeTags();
            keepSelection();
        });
        styleView.addEventListener("focus", reproduceSelection);

        showStyleProperty();
    }

    function onChangeSelection() {
        for (let name in styleProperty) {
            delete styleProperty[name];
        }
        stylePropertyRoot.resetValue();
        targetNodes = undefined;
    }

    let selectionInfo: {
        startContainer: Node
        endContainer: Node
        startOffset: number
        endOffset: number
    }

    function keepSelection() {
        let selection = getSelection();
        if (selection) {
            let formatBody = document.getElementById("formatBody") as HTMLDivElement;
            for (let i = 0; i < selection.rangeCount; i++) {
                let range = selection.getRangeAt(i);
                if (common.isChildOf(range.startContainer, formatBody) && common.isChildOf(range.endContainer, formatBody)) {
                    selectionInfo = {
                        startContainer: range.startContainer,
                        endContainer: range.endContainer,
                        startOffset: range.startOffset,
                        endOffset: range.endOffset
                    }
                    break;
                }
            }
        }
    }

    function reproduceSelection() {
        if (selectionInfo) {
            let selection = window.getSelection();
            let range = new Range();
            range.setStart(selectionInfo.startContainer, selectionInfo.startOffset);
            range.setEnd(selectionInfo.endContainer, selectionInfo.endOffset);
            selection?.addRange(range);
        }
    }

    let stylePropertyRoot: element.DEEPropertyRoot;
    let styleProperty: { [name: string]: string } = {};
    function showStyleProperty() {
        let styleView = document.getElementById("styleView") as HTMLDivElement;
        stylePropertyRoot = new element.DEEPropertyRoot(
            styleView,
            styleProperty
        );
        let prop_tag = new element.DEEPropertyItemSelect(
            stylePropertyRoot,
            "tag", [
            { value: "span", caption: "Text", tooltip: "Document general text." },
            { value: "h1", caption: "Title(Level 1)", tooltip: "Caption title." },
            { value: "h2", caption: "Title(Level 2)", tooltip: "Section title." }
        ], "Text type", "", (v) => {
            // TODO
        });

        function setStyleButton(style: keyof CSSStyleDeclaration & string, parent: element.DEEPropertyBase, getValue: () => string) {
            new element.DEEPropertyItemButton(parent,
                "Set", "", "", () => {
                    setStyle(style, getValue());
                }
            );
            new element.DEEPropertyItemButton(parent,
                "Clear", "", "", () => {
                    setStyle(style, "");
                }
            );
        }

        let font = new element.DEEPropertyBox(stylePropertyRoot, "Font");

        // color
        let color = new element.DEEPropertyItemInput(
            font, "color", "Color", "Change font color.", undefined, "color"
        )
        setStyleButton("color", font, () => {
            return color.input.value;
        });

        // fontWeight
        let fontWeight = new element.DEEPropertyItemSelect(
            font, "fontWeight", [
            "lighter", "normal", "bolder", "bold"
        ], "Width", "Change font width.");
        setStyleButton("fontWeight", font, () => {
            return fontWeight.select.value;
        });

        // font size
        let fontSize = new element.DEEPropertyItemInput(
            font, "fontSize", "Size", "Change font size.", undefined, "number"
        )
        font.getBody().append("px");
        setStyleButton("fontSize", font, () => {
            return fontSize.input.value + "px";
        });

        // font style
        let fontStyle = new element.DEEPropertyItemSelect(
            font, "fontStyle", [
            "normal", "italic", "oblique"
        ], "Style", "Change font style(italic/oblique).");
        setStyleButton("fontStyle", font, () => {
            return fontStyle.select.value;
        });

        let background = new element.DEEPropertyBox(stylePropertyRoot, "Background");

        // background color
        let backgroundColor = new element.DEEPropertyItemInput(
            background, "backgroundColor", "Color", "Change background color.", undefined, "color"
        )
        background.getBody().append(document.createElement("br"));
        setStyleButton("backgroundColor", background, () => {
            return backgroundColor.input.value;
        });

        let textDecoration = new element.DEEPropertyBox(stylePropertyRoot, "Text line");

        // textdecoration line
        let textDecorationLine = new element.DEEPropertyItemSelect(
            textDecoration, "textDecorationLine", [
            "none", "underline", "overline", "line-through", "blink"
        ], "Line type", "Change line type.");

        // textdecoration color
        let textDecorationColor = new element.DEEPropertyItemInput(
            textDecoration, "textDecorationColor", "Color", "Change line color.", undefined, "color"
        )

        // textdecoration style
        let textDecorationStyle = new element.DEEPropertyItemSelect(
            textDecoration, "textDecorationStyle", [
            "solid", "double", "dotted", "dashed", "wavy"
        ], "Line style", "Change line style.");

        // textdecoration thickness
        let textDecorationThickness = new element.DEEPropertyItemInput(
            textDecoration, "textDecorationThickness", "Thickness", "Change line thickness.", undefined, "number"
        )
        textDecoration.getBody().append("px");
        textDecoration.getBody().append(document.createElement("br"));

        setStyleButton("textDecoration", textDecoration, () => {
            let lineType = textDecorationLine.select.value;
            let lineColor = textDecorationColor.input.value;
            let lineStyle = textDecorationStyle.select.value;
            let lineThickness = textDecorationThickness.input.value + "px";
            return `${lineType} ${lineColor} ${lineStyle} ${lineThickness}`;
        });


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
        for (let target of getTargetNodes()) {
            (target.style as any)[name] = value;
        }
    }

    let targetNodes: HTMLElement[] | undefined;
    function getTargetNodes(): HTMLElement[] {
        if (!selectionInfo) {
            // check if selection is valid.
            return [];
        } else if (targetNodes == undefined) {
            // check if a range is selected
            if (selectionInfo.startContainer == selectionInfo.endContainer && selectionInfo.startOffset == selectionInfo.endOffset) {
                return [selectionInfo.startContainer.parentElement!];
            }

            targetNodes = [];

            // get parents of targets to change style
            let targetParents: { node: Node, start?: number, end?: number }[] = [];
            let addStartPos = (node: Node, start: number) => {
                let t = targetParents.find(v => v.node == node);
                if (!t) {
                    t = { node: node };
                    targetParents.push(t);
                }
                t.start = start;
            }
            let addEndPos = (node: Node, end: number) => {
                let t = targetParents.find(v => v.node == node);
                if (!t) {
                    t = { node: node };
                    targetParents.push(t);
                }
                t.end = end;
            }
            let getChildIndex = (node: Node) => {
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
            addStartPos(selectionInfo.startContainer, selectionInfo.startOffset);
            for (
                let cur = selectionInfo.startContainer;
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
            addEndPos(selectionInfo.endContainer, selectionInfo.endOffset);
            for (
                let cur = selectionInfo.endContainer;
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
            targetNodes = [];

            for (let t of targetParents) {
                if (t.node instanceof Text) {
                    if ((t.start == undefined || t.start == 0) && (t.end == undefined || t.end == t.node.textContent?.length)) {
                        let newSpan = common.insertTagBefore(t.node, "span");
                        newSpan.innerText = t.node.textContent ?? "";
                        let parent = t.node.parentNode;
                        if (parent) {
                            parent.removeChild(t.node);
                        }
                        targetNodes.push(newSpan);
                    } else if (t.end == undefined || t.end == t.node.textContent?.length) {
                        let newSpan = common.insertTagAfter(t.node, "span");
                        let originalText = t.node.textContent ?? "";
                        newSpan.innerText = originalText.substring(t.start!);
                        t.node.textContent = originalText.substring(0, t.start!);
                        targetNodes.push(newSpan);

                        selectionInfo.startContainer = newSpan.childNodes[0];
                        selectionInfo.startOffset = 0;
                    } else if (t.start == undefined || t.start == 0) {
                        let newSpan = common.insertTagBefore(t.node, "span");
                        let originalText = t.node.textContent ?? "";
                        newSpan.innerText = originalText.substring(0, t.end!);
                        t.node.textContent = originalText.substring(t.end!);
                        targetNodes.push(newSpan);

                        selectionInfo.endContainer = newSpan.childNodes[0];
                        selectionInfo.endOffset = newSpan.childNodes[0].textContent?.length ?? 0;
                    } else {
                        let newSpan = common.insertTagAfter(t.node, "span");

                        let originalText = t.node.textContent ?? "";
                        t.node.textContent = originalText.substring(0, t.start!);
                        newSpan.innerText = originalText.substring(t.start!, t.end!);
                        newSpan.insertAdjacentText("afterend", originalText.substring(t.end!));
                        targetNodes.push(newSpan);

                        selectionInfo.startContainer = newSpan.childNodes[0];
                        selectionInfo.startOffset = 0;
                        selectionInfo.endContainer = newSpan.childNodes[0];
                        selectionInfo.endOffset = newSpan.childNodes[0].textContent?.length ?? 0;
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

            return targetNodes;
        } else {
            return targetNodes;
        }
    }
}