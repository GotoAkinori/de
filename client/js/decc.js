"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var common;
        (function (common) {
            //#region Add New Element
            /**
             * Add new HTML element.
             * @param parent Parent element of new element.
             * @param tagName tag name of new element.
             * @param className class name of new element.
             */
            function addTag(parent, tagName, className) {
                var _a;
                var doc = (_a = parent.ownerDocument, (_a !== null && _a !== void 0 ? _a : document));
                var element = doc.createElement(tagName);
                parent.appendChild(element);
                if (className) {
                    element.classList.add(className);
                }
                return element;
            }
            common.addTag = addTag;
            /**
             * Insert new HTML element.
             * @param target Target element of new element. New element is insert before this.
             * @param tagName tag name of new element.
             * @param className class name of new element.
             */
            function insertTagBefore(target, tagName, className) {
                var _a, _b;
                var doc = (_a = target.ownerDocument, (_a !== null && _a !== void 0 ? _a : document));
                var parent = target.parentElement;
                var element = doc.createElement(tagName);
                (_b = parent) === null || _b === void 0 ? void 0 : _b.insertBefore(element, target);
                if (className) {
                    element.classList.add(className);
                }
                return element;
            }
            common.insertTagBefore = insertTagBefore;
            function addTextDiv(parent, text, className) {
                var div = addTag(parent, "div", className);
                div.innerText = text;
                return div;
            }
            common.addTextDiv = addTextDiv;
            /**
             * Insert new HTML element.
             * @param target Target element of new element. New element is insert after this.
             * @param tagName tag name of new element.
             * @param className class name of new element.
             */
            function insertTagAfter(target, tagName, className) {
                var _a, _b;
                var doc = (_a = target.ownerDocument, (_a !== null && _a !== void 0 ? _a : document));
                var parent = target.parentElement;
                var element = doc.createElement(tagName);
                (_b = parent) === null || _b === void 0 ? void 0 : _b.insertBefore(element, target.nextSibling);
                if (className) {
                    element.classList.add(className);
                }
                return element;
            }
            common.insertTagAfter = insertTagAfter;
            /**
             * Add new button.
             * @param parent Parent element of new button
             * @param caption Caption of new button
             * @param callback Callback function when the button is clicked
             * @param className class name of new button.
             */
            function addButton(parent, caption, callback, className) {
                var button = addTag(parent, "button", className);
                button.addEventListener("click", callback);
                button.innerHTML = caption;
                return button;
            }
            common.addButton = addButton;
            //#endregion
            //#region Others
            function checkIsChild(parent, child) {
                var cursor = child;
                while (cursor) {
                    if (parent == cursor) {
                        return true;
                    }
                    cursor = cursor.parentNode;
                }
                return false;
            }
            common.checkIsChild = checkIsChild;
            function modal() {
                var back = common.addTag(document.body, "div");
                var base = common.addTag(back, "div");
                back.classList.add("back");
                base.classList.add("base");
                back.addEventListener("click", function (ev) {
                    if (ev.target == back) {
                        back.remove();
                    }
                });
                return [base, back];
            }
            common.modal = modal;
            //#endregion
        })(common = de.common || (de.common = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var common;
        (function (common) {
            function postJson(url, data) {
                return new Promise(function (res, rej) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url);
                    xhr.addEventListener("load", function () {
                        res(JSON.parse(xhr.responseText));
                    });
                    xhr.addEventListener("error", function (err) {
                        rej(err);
                    });
                    xhr.setRequestHeader("content-type", "application/json");
                    xhr.send(data ? JSON.stringify(data) : undefined);
                });
            }
            common.postJson = postJson;
        })(common = de.common || (de.common = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var element;
        (function (element_1) {
            var DEEElementBase = /** @class */ (function () {
                function DEEElementBase(factory, element, propertyData) {
                    if (propertyData === void 0) { propertyData = {}; }
                    this.factory = factory;
                    this.element = element;
                    this.propertyData = propertyData;
                    this.name = "";
                    this.id = ++DEEElementBase.idCounter;
                    DEEElementBase.elementList.push(this);
                }
                DEEElementBase.elementList = [];
                DEEElementBase.idCounter = 0;
                return DEEElementBase;
            }());
            element_1.DEEElementBase = DEEElementBase;
            var DEEFactroyBase = /** @class */ (function () {
                function DEEFactroyBase() {
                }
                //#region General Function
                DEEFactroyBase.prototype.newError = function (code) {
                    return new DEEError(this.constructor.name, code);
                };
                //#endregion
                //#region Common function for "createElement".
                DEEFactroyBase.prototype.createSimpleElement = function (range, create) {
                    var _a, _b, _c, _d, _e, _f;
                    // Check the range condition
                    if (range.startContainer != range.endContainer
                        || range.startContainer.nodeType != Node.TEXT_NODE) {
                        throw this.newError("Create Error");
                    }
                    var target = range.startContainer;
                    var parent = target.parentNode;
                    var start, end;
                    var doc = target.ownerDocument;
                    var value = (_b = (_a = target.textContent) === null || _a === void 0 ? void 0 : _a.substring(range.startOffset, range.endOffset), (_b !== null && _b !== void 0 ? _b : ""));
                    var element = create(value, doc);
                    start = range.startOffset;
                    end = range.endOffset;
                    parent.insertBefore(doc.createTextNode((_d = (_c = target.textContent) === null || _c === void 0 ? void 0 : _c.substring(0, range.startOffset), (_d !== null && _d !== void 0 ? _d : ""))), target);
                    parent.insertBefore(element, target);
                    parent.insertBefore(doc.createTextNode((_f = (_e = target.textContent) === null || _e === void 0 ? void 0 : _e.substring(range.endOffset), (_f !== null && _f !== void 0 ? _f : ""))), target);
                    parent.removeChild(target);
                    return {
                        value: value,
                        element: element
                    };
                };
                return DEEFactroyBase;
            }());
            element_1.DEEFactroyBase = DEEFactroyBase;
            var DEEError = /** @class */ (function () {
                function DEEError(type, code) {
                    this.type = type;
                    this.code = code;
                }
                DEEError.prototype.getMessage = function () {
                    return "[" + this.type + ", " + this.code + "]";
                };
                return DEEError;
            }());
            element_1.DEEError = DEEError;
        })(element = de.element || (de.element = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var element;
        (function (element_2) {
            var DeInputFactory = /** @class */ (function (_super) {
                __extends(DeInputFactory, _super);
                function DeInputFactory() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DeInputFactory.prototype.getType = function () { return "input"; };
                DeInputFactory.prototype.loadElement = function (element, data) {
                    var deInput = new DeInput(this, element, data);
                    element.value = data.property.default;
                    element.addEventListener("focus", function () {
                        element_2.DEEFactroyBase.onActive(deInput);
                    });
                    deInput.name = data.name;
                    return deInput;
                };
                DeInputFactory.prototype.makeToolButton = function (toolbutton) {
                    toolbutton.innerHTML = "Text Box";
                };
                DeInputFactory.prototype.createElement = function (range) {
                    var _this = this;
                    var valueElementPair = this.createSimpleElement(range, function (value, doc) {
                        var element = doc.createElement("input");
                        element.value = value;
                        element.dataset.detype = _this.getType();
                        return element;
                    });
                    var deInput = new DeInput(this, valueElementPair.element);
                    if (!deInput.propertyData.property) {
                        deInput.propertyData.property = {};
                    }
                    deInput.propertyData.property.defaultValue = valueElementPair.value;
                    valueElementPair.element.addEventListener("focus", function () {
                        element_2.DEEFactroyBase.onActive(deInput);
                    });
                    return deInput;
                };
                return DeInputFactory;
            }(element_2.DEEFactroyBase));
            element_2.DeInputFactory = DeInputFactory;
            var DeInput = /** @class */ (function (_super) {
                __extends(DeInput, _super);
                function DeInput() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.propertyRoot = null;
                    return _this;
                }
                DeInput.prototype.getFormProperty = function () {
                    if (this.propertyRoot) {
                        return this.propertyRoot.getValue();
                    }
                };
                DeInput.prototype.setFormProperty = function (element, data) {
                    throw new Error("Method not implemented.");
                };
                DeInput.prototype.getFormData = function () {
                    return this.element.value;
                };
                DeInput.prototype.setFormData = function (data) {
                    this.element.value = data;
                };
                DeInput.prototype.deleteElement = function () {
                    throw new Error("Method not implemented.");
                };
                DeInput.prototype.showProperty = function (pane) {
                    var _this = this;
                    this.propertyRoot = new element_2.DEEPropertyRoot(pane);
                    if (!this.propertyData.property) {
                        this.propertyData.property = {};
                    }
                    pane.innerHTML = "";
                    new element.DEEPropertyItemString(this.propertyRoot, "name", this.propertyData, "Name", "Name of this element.", function (v) {
                        _this.element.name = v;
                        _this.name = v;
                    });
                    var property = new element.DEEPropertyBox(this.propertyRoot, "property", "Property");
                    new element.DEEPropertyItemString(property, "default", this.propertyData.property, "Default Value", "Default value of the text box", function (v) {
                        _this.element.value = v;
                    });
                    new element.DEEPropertyItemString(property, "placeholder", this.propertyData.property, "Placeholder", "Placeholder of the text box");
                    return this.propertyRoot;
                };
                return DeInput;
            }(element_2.DEEElementBase));
            element_2.DeInput = DeInput;
        })(element = de.element || (de.element = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var element;
        (function (element) {
            var DEEPropertySet = /** @class */ (function () {
                function DEEPropertySet() {
                    this.propertyItems = {};
                }
                DEEPropertySet.prototype.getValue = function () {
                    var data = {};
                    for (var key in this.propertyItems) {
                        data[key] = this.propertyItems[key].getValue();
                    }
                    return data;
                };
                DEEPropertySet.prototype.setValue = function (data) {
                    for (var key in data) {
                        var prop = this.propertyItems[key];
                        if (prop) {
                            prop.setValue(data[key]);
                        }
                    }
                };
                return DEEPropertySet;
            }());
            element.DEEPropertySet = DEEPropertySet;
            var DEEPropertyRoot = /** @class */ (function (_super) {
                __extends(DEEPropertyRoot, _super);
                function DEEPropertyRoot(pane) {
                    var _this = _super.call(this) || this;
                    _this.pane = pane;
                    return _this;
                }
                DEEPropertyRoot.prototype.getBody = function () {
                    return this.pane;
                };
                return DEEPropertyRoot;
            }(DEEPropertySet));
            element.DEEPropertyRoot = DEEPropertyRoot;
            var DEEPropertyBox = /** @class */ (function (_super) {
                __extends(DEEPropertyBox, _super);
                function DEEPropertyBox(parent, name, caption) {
                    var _this = _super.call(this) || this;
                    _this.name = "";
                    _this.base = de.common.addTag(parent.getBody(), "div", "prop-base");
                    _this.header = de.common.addTag(_this.base, "div", "prop-header");
                    _this.body = de.common.addTag(_this.base, "div", "prop-body");
                    _this.header.innerHTML = caption;
                    var open = true;
                    var openButton = de.common.addButton(_this.header, "▲", function () {
                        open = !open;
                        if (open) {
                            _this.body.classList.remove("shrink");
                            openButton.innerText = "▼";
                        }
                        else {
                            _this.body.classList.add("shrink");
                            openButton.innerText = "▲";
                        }
                    }, "open");
                    _this.name = name;
                    parent.propertyItems[name] = _this;
                    return _this;
                }
                DEEPropertyBox.prototype.getBody = function () {
                    return this.body;
                };
                return DEEPropertyBox;
            }(DEEPropertySet));
            element.DEEPropertyBox = DEEPropertyBox;
            var DEEPropertyItemString = /** @class */ (function (_super) {
                __extends(DEEPropertyItemString, _super);
                function DEEPropertyItemString(parent, name, data, caption, description, onChange) {
                    var _a;
                    var _this = _super.call(this) || this;
                    var div = de.common.addTag(parent.getBody(), "div", "property-name");
                    div.innerText = (caption !== null && caption !== void 0 ? caption : name);
                    if (description) {
                        div.title = description;
                    }
                    parent.propertyItems[name] = _this;
                    _this.input = de.common.addTag(parent.getBody(), "input");
                    _this.input.style.marginLeft = "10px";
                    _this.input.value = data ? (_a = data[name], (_a !== null && _a !== void 0 ? _a : "")) : "";
                    _this.input.addEventListener("change", function () {
                        data[name] = _this.input.value;
                        if (onChange) {
                            onChange(_this.input.value);
                        }
                    });
                    return _this;
                }
                DEEPropertyItemString.prototype.setValue = function (value) {
                    this.input.value = value;
                };
                DEEPropertyItemString.prototype.getValue = function () {
                    return this.input.value;
                };
                DEEPropertyItemString.prototype.getBody = function () {
                    throw new Error("Method not implemented.");
                };
                return DEEPropertyItemString;
            }(DEEPropertySet));
            element.DEEPropertyItemString = DEEPropertyItemString;
        })(element = de.element || (de.element = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
var ooo;
(function (ooo) {
    var de;
    (function (de) {
        var formatEditor;
        (function (formatEditor) {
            formatEditor.DeeList = [];
            //#region Make Format
            function init_format() {
                AddDEE(new de.element.DeInputFactory());
                de.element.DEEFactroyBase.onActive = onActive;
                document.getElementById("menubutton").addEventListener("click", showMenu);
            }
            formatEditor.init_format = init_format;
            var properties = {};
            var activeProperty = -1;
            /**
             * Add new DEEBase element.
             * @param factory New DEEBase element.
             */
            function AddDEE(factory) {
                var toolbarPane = document.getElementById("toolbar");
                var formatBody = document.getElementById("formatBody");
                formatEditor.DeeList.push(factory);
                factory.makeToolButton(de.common.addButton(toolbarPane, "", function () {
                    var selection = document.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        var target = selection.getRangeAt(0).startContainer;
                        if (de.common.checkIsChild(formatBody, target)) {
                            var data = factory.createElement(selection.getRangeAt(0));
                        }
                    }
                }, "toolbutton"));
            }
            function onActive(element) {
                var propertyView = document.getElementById("propertyView");
                if (activeProperty != element.id) {
                    element.showProperty(propertyView);
                }
            }
            function showMenu() {
                var _a = ooo.de.common.modal(), base = _a[0], back = _a[1];
                var button = document.getElementById("menubutton");
                base.style.top = button.getBoundingClientRect().bottom + "px";
                // Save
                var saveMenu = de.common.addTag(base, "div", "menu-item");
                saveMenu.addEventListener("click", function () {
                    back.remove();
                    showSaveDialog();
                });
                saveMenu.innerText = "Save";
                // Load
                var loadMenu = de.common.addTag(base, "div", "menu-item");
                loadMenu.addEventListener("click", function () {
                    back.remove();
                    showLoadDialog();
                });
                loadMenu.innerText = "Load";
            }
            function showSaveDialog() {
                var _this = this;
                var _a = ooo.de.common.modal(), base = _a[0], back = _a[1];
                base.style.top = "10px";
                base.style.left = "10px";
                de.common.addTextDiv(base, "Format Name");
                var input = de.common.addTag(base, "input");
                input.placeholder = "Format Name";
                input.focus();
                de.common.addButton(base, "Save", function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, save(input.value)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            function save(formatName) {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var formBody, data, _i, _b, elem;
                    return __generator(this, function (_c) {
                        formBody = document.getElementById("formatBody");
                        data = {
                            html: (_a = formBody) === null || _a === void 0 ? void 0 : _a.innerHTML,
                            properties: {}
                        };
                        for (_i = 0, _b = de.element.DEEElementBase.elementList; _i < _b.length; _i++) {
                            elem = _b[_i];
                            data.properties[elem.name] = elem.getFormProperty();
                        }
                        de.common.postJson("../command/format/save/" + formatName, data);
                        return [2 /*return*/];
                    });
                });
            }
            function showLoadDialog() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, base, back, listDiv, list, selectedItem, selectedFormatName, _loop_1, _i, list_1, name_1, loadButton;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = ooo.de.common.modal(), base = _a[0], back = _a[1];
                                base.style.top = "10px";
                                base.style.left = "10px";
                                de.common.addTextDiv(base, "Format List");
                                listDiv = de.common.addTag(base, "div");
                                return [4 /*yield*/, de.common.postJson("../command/format/list/all")];
                            case 1:
                                list = _b.sent();
                                selectedItem = undefined;
                                selectedFormatName = "";
                                _loop_1 = function (name_1) {
                                    var formatName = name_1.substring(0, name_1.length - 5);
                                    var listItem = de.common.addTextDiv(base, formatName, "menu-item");
                                    listItem.addEventListener("click", function () {
                                        if (selectedItem) {
                                            selectedItem.classList.remove("selected");
                                        }
                                        listItem.classList.add("selected");
                                        selectedItem = listItem;
                                        selectedFormatName = formatName;
                                        loadButton.disabled = false;
                                    });
                                    listItem.addEventListener("dblclick", function () {
                                        load(formatName);
                                    });
                                };
                                for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                                    name_1 = list_1[_i];
                                    _loop_1(name_1);
                                }
                                loadButton = de.common.addButton(base, "Load", function () {
                                    load(selectedFormatName);
                                });
                                loadButton.disabled = true;
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function load(formatName) {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var data, formatBody, properties, _loop_2, name_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, de.common.postJson("../command/format/load/" + formatName)];
                            case 1:
                                data = _b.sent();
                                formatBody = document.getElementById("formatBody");
                                formatBody.innerHTML = data.html;
                                properties = data.properties;
                                _loop_2 = function (name_2) {
                                    var element_3 = formatBody.querySelector("*[name='" + name_2 + "']");
                                    if (element_3) {
                                        var defactory = formatEditor.DeeList.find(function (e) { return e.getType() == element_3.dataset.detype; });
                                        (_a = defactory) === null || _a === void 0 ? void 0 : _a.loadElement(element_3, properties[name_2]);
                                    }
                                };
                                for (name_2 in properties) {
                                    _loop_2(name_2);
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }
            //#endregion
            //#region 
            //#endregion
        })(formatEditor = de.formatEditor || (de.formatEditor = {}));
    })(de = ooo.de || (ooo.de = {}));
})(ooo || (ooo = {}));
//# sourceMappingURL=decc.js.map