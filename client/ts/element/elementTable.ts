namespace ooo.de.element {
    const DEFAULT_COLUMNS = 2;
    const DEFAULT_ROWS = 2;
    let tableClassList = ["grid", "pane"];

    type CellInfo = { row: number, column: number, cell: HTMLTableCellElement };
    function getTop(info: CellInfo) {
        return info.row;
    }
    function getBottom(info: CellInfo) {
        return info.row + info.cell.rowSpan;
    }
    function getLeft(info: CellInfo) {
        return info.column;
    }
    function getRight(info: CellInfo) {
        return info.column + info.cell.colSpan;
    }
    function getNextCell(tableInfo: CellInfo[][], row: number, col: number): HTMLTableCellElement | null {
        let ret: HTMLTableCellElement | null = null;

        for (let c = col; c < tableInfo[0].length; c++) {
            if (tableInfo[row][c].row == row) {
                return tableInfo[row][c].cell;
            }
        }

        return ret;
    }

    export class DeTableFactory extends DEEFactroyBase<DeTable> {
        public getType() { return "table"; }
        public loadElement(element: HTMLElement): DeTable {
            return new DeTable(this, element);
        }
        propContainer?: element.DEEPropertyBox;

        public makeToolButton(toolbutton: HTMLButtonElement): void {
            toolbutton.innerHTML = "TABLE";
        }

        public createElement(range: Range): DeTable {
            let valueElementPair = this.createSimpleElement(range, (value, doc) => {
                let element = doc.createElement("table");
                element.classList.add(tableClassList[0]);
                return element;
            });

            let deTable: DeTable = new DeTable(this, valueElementPair.element);

            for (let r = 0; r < DEFAULT_ROWS; r++) {
                let [tr, tds] = common.addTR(valueElementPair.element as HTMLTableElement, DEFAULT_COLUMNS);
                for (let td of tds) {
                    common.addTag(td, "div");
                }
            }

            deTable.properties.border = "1";
            deTable.properties.columns = DEFAULT_COLUMNS.toString();
            deTable.properties.rows = DEFAULT_ROWS.toString();

            return deTable;
        }
    }

    export class DeTable extends DEEElementBase {
        public propertyRoot: DEEPropertyRoot | null = null;
        public rows: number = DEFAULT_ROWS;
        public columns: number = DEFAULT_COLUMNS;

        public getFormData(data: any): void { }
        public setFormData(data: any): void { }
        public deleteElement(): void {
            throw new Error("Method not implemented.");
        }

        public showProperty(pane: HTMLDivElement): DEEPropertyRoot {
            this.propertyRoot = new DEEPropertyRoot(pane, this.properties);

            let property = new element.DEEPropertyBox(this.propertyRoot, "Property");
            new element.DEEPropertyItemInput(property, "columns", "Columns", "Columns number", v => {
                this.onChangeTableSize();
            }, "number");
            new element.DEEPropertyItemInput(property, "rows", "Rows", "Rows number", v => {
                this.onChangeTableSize();
            }, "number");
            let propertyStyle = new DEEPropertyGroup(property, "Table style");
            new element.DEEPropertyItemCheckBox(propertyStyle, "border", "Border", "", v => {
                if (v) {
                    (this.element as HTMLTableElement).classList.add("grid");
                } else {
                    (this.element as HTMLTableElement).classList.remove("grid");
                }
            });
            let tool = new element.DEEPropertyBox(this.propertyRoot, "Tool");
            let toolExpandGroup = new element.DEEPropertyGroup(tool, "Expand");
            new element.DEEPropertyItemButton(toolExpandGroup, "", "rightArrow.svg", "", () => {
                this.expandColRight();
            });
            new element.DEEPropertyItemButton(toolExpandGroup, "", "downArrow.svg", "", () => {
                this.expandRowBottom();
            });
            let toolShrinkGroup = new element.DEEPropertyGroup(tool, "Shrink");
            new element.DEEPropertyItemButton(toolShrinkGroup, "", "leftArrow.svg", "", () => {
                this.shrinkRight();
            });
            new element.DEEPropertyItemButton(toolShrinkGroup, "", "upArrow.svg", "", () => {
                this.shrinkBottom();
            });

            this.rows = this.getCurrentRows();
            this.columns = this.getCurrentColumns();

            return this.propertyRoot;
        }

        public setReadonly(): void {
            (this.element as HTMLInputElement).setAttribute("readonly", "readonly");
        }

        public onClickFormatMode(ev: MouseEvent): void {
            DEEFactroyBase.onActive(this);
            if (ev.target) {
                this.targetTD = this.getTargetTD(ev.target as Node);
            }
        }
        public onClickViewMode(ev: MouseEvent): void { }

        //#region Table Size Changing
        public onChangeTableSize() {
            const newRows = Number(this.properties.rows);
            const newColumns = Number(this.properties.columns);
            let table = this.element as HTMLTableElement;

            const currentRows = this.getCurrentRows();
            const currentColumns = this.getCurrentColumns();
            let info = this.getTableMergeInfo();

            // Shrink Rows
            if (newRows < currentRows) {
                for (let c = 0; c < currentColumns; c++) {
                    if (info[newRows][c].column == c) {
                        if (info[newRows][c].row < newRows) {
                            info[newRows][c].cell.rowSpan = newRows - info[newRows][c].row;
                        }
                    }
                }
                for (let r = newRows; r < currentRows; r++) {
                    table.rows[r].remove();
                }
            }

            // Expand Rows
            else if (newRows > currentRows) {
                for (let r = currentRows; r < newRows; r++) {
                    let [, tds] = common.addTR(table, currentColumns);
                    for (let td of tds) {
                        common.addTag(td, "div");
                    }
                }
            }

            // Reset Information
            info = this.getTableMergeInfo();

            // Shrink Columns
            if (newColumns < currentColumns) {
                for (let r = 0; r < newRows; r++) {
                    if (info[r][newColumns].row == r) {
                        if (info[r][newColumns].column < newColumns) {
                            info[r][newColumns].cell.colSpan = newColumns - info[r][newColumns].column;
                        } else {
                            info[r][newColumns].cell.remove();
                        }
                    }

                    for (let c = newColumns + 1; c < currentColumns; c++) {
                        if (
                            info[r][c].row == r &&
                            info[r][c].column == c
                        ) {
                            info[r][c].cell.remove();
                        }
                    }
                }
            }

            // Expand Columns
            else if (newColumns > currentColumns) {
                for (let r = 0; r < newRows; r++) {
                    let row = table.rows[r];
                    for (let c = currentColumns; c < newColumns; c++) {
                        let td = common.addTag(row, "td");
                        common.addTag(td, "div");
                    }
                }
            }

            this.columns = newColumns;
            this.rows = newRows;
        }

        private getCurrentColumns() {
            let columns = 0;
            if ((this.element as HTMLTableElement).rows.length > 0) {
                let row = (this.element as HTMLTableElement).rows[0];
                for (let c = 0; c < row.cells.length; c++) {
                    columns += row.cells[c].colSpan;
                }
            }
            return columns;
        }

        private getCurrentRows() {
            return (this.element as HTMLTableElement).rows.length;
        }

        private targetTD: HTMLTableCellElement | undefined;
        private getTargetTD(node: Node): HTMLTableCellElement | undefined {
            let cur: HTMLElement | null = node instanceof HTMLElement ? node : node.parentElement;
            let td: HTMLTableCellElement | undefined;

            while (cur) {
                if (cur instanceof HTMLTableCellElement) {
                    td = cur;
                } else if (cur == this.element) {
                    return td;
                }

                cur = cur.parentElement;
            }
            this.targetTD = undefined;
        }

        private getTableMergeInfo(): CellInfo[][] {
            let data: (CellInfo | undefined)[][] = [];

            const rows = this.getCurrentRows();
            const columns = this.getCurrentColumns();

            // initialize table
            for (let row = 0; row < rows; row++) {
                let rowData: (CellInfo | undefined)[] = [];
                data.push(rowData);
                for (let column = 0; column < columns; column++) {
                    rowData.push(undefined);
                }
            }

            // get information
            for (let row = 0; row < rows; row++) {
                let columnIndex = 0;
                for (let column = 0; column < columns; column++) {
                    if (data[row][column] == undefined) {
                        let td = (this.element as HTMLTableElement).rows[row].cells[columnIndex] as HTMLTableCellElement;
                        for (let sr = 0; sr < td.rowSpan; sr++) {
                            for (let sc = 0; sc < td.colSpan; sc++) {
                                data[row + sr][column + sc] = {
                                    row: row,
                                    column: column,
                                    cell: td
                                }
                            }
                        }
                        columnIndex++;
                    }
                }
            }

            return data as CellInfo[][];
        }

        private expandColRight() {
            if (this.targetTD) {
                let tableInfo = this.getTableMergeInfo();
                let targetCellInfo = tableInfo.map(v => v.find(v => v.cell == this.targetTD))
                    .find(v => v != undefined);

                // check if target cell is in the table.
                if (targetCellInfo == undefined) {
                    return;
                }

                // check if the td can be expanded in right direction.
                if (getRight(targetCellInfo) >= this.columns) {
                    return;
                }

                // check merged cell collision.
                let rightTopCellInfo = tableInfo[getTop(targetCellInfo)][getRight(targetCellInfo)];
                let rightBottomCellInfo = tableInfo[getBottom(targetCellInfo) - 1][getRight(targetCellInfo)];
                if (getTop(rightTopCellInfo) < getTop(targetCellInfo)) {
                    return;
                }
                if (getBottom(rightBottomCellInfo) > getBottom(targetCellInfo)) {
                    return;
                }

                // shrink next cells.
                let shrinkCol = getRight(targetCellInfo);
                for (let r = getTop(targetCellInfo); r < getBottom(targetCellInfo);) {
                    let nextCellInfo = tableInfo[r][shrinkCol];

                    if (nextCellInfo.cell.colSpan > 1) {
                        nextCellInfo.cell.colSpan--;
                    } else {
                        nextCellInfo.cell.remove();
                    }

                    r += nextCellInfo.cell.rowSpan;
                }

                // expand cell
                this.targetTD.colSpan++;
            }
        }

        private expandRowBottom() {
            if (this.targetTD) {
                let tableInfo = this.getTableMergeInfo();
                let targetCellInfo = tableInfo.map(v => v.find(v => v.cell == this.targetTD))
                    .find(v => v != undefined);

                // check if target cell is in the table.
                if (targetCellInfo == undefined) {
                    return;
                }

                // check if the td can be expanded in bottom direction.
                if (getBottom(targetCellInfo) >= this.rows) {
                    return;
                }

                // check merged cell collision.
                let bottomLeftCellInfo = tableInfo[getBottom(targetCellInfo)][getLeft(targetCellInfo)];
                let bottomRightCellInfo = tableInfo[getBottom(targetCellInfo)][getRight(targetCellInfo) - 1];
                if (getLeft(bottomLeftCellInfo) < getLeft(targetCellInfo)) {
                    return;
                }
                if (getRight(bottomRightCellInfo) > getRight(targetCellInfo)) {
                    return;
                }

                // shrink next cells.
                let shrinkRow = getBottom(targetCellInfo);
                let insertPos: HTMLTableCellElement | null = null;

                if (shrinkRow < this.rows - 1) {
                    insertPos = getNextCell(tableInfo, shrinkRow + 1, getRight(targetCellInfo));
                }

                for (let c = getLeft(targetCellInfo); c < getRight(targetCellInfo);) {
                    let nextCellInfo = tableInfo[shrinkRow][c];

                    if (nextCellInfo.cell.rowSpan > 1) {
                        nextCellInfo.cell.remove();
                        nextCellInfo.cell.rowSpan--;
                        (this.element as HTMLTableElement).rows[shrinkRow + 1].insertBefore(nextCellInfo.cell, insertPos);
                    } else {
                        nextCellInfo.cell.remove();
                    }

                    c += nextCellInfo.cell.colSpan;
                }

                // expand cell
                this.targetTD.rowSpan++;
            }
        }

        public shrinkRight() {
            if (this.targetTD) {
                let tableInfo = this.getTableMergeInfo();
                let targetCellInfo = tableInfo.map(v => v.find(v => v.cell == this.targetTD))
                    .find(v => v != undefined);

                // check if target cell is in the table.
                if (targetCellInfo == undefined) {
                    return;
                }

                // check if the td can be shrinked.
                if (targetCellInfo.cell.colSpan == 1) {
                    return;
                }

                // add new cells in right
                for (let r = getTop(targetCellInfo); r < getBottom(targetCellInfo); r++) {
                    let insertPos = getNextCell(tableInfo, r, getRight(targetCellInfo));
                    let newCell = this.element.ownerDocument.createElement("td");
                    (this.element as HTMLTableElement).rows[r].insertBefore(newCell, insertPos);

                    common.addTag(newCell, "div");
                }

                // shrink cell
                targetCellInfo.cell.colSpan--;
            }
        }

        private shrinkBottom() {
            if (this.targetTD) {
                let tableInfo = this.getTableMergeInfo();
                let targetCellInfo = tableInfo.map(v => v.find(v => v.cell == this.targetTD))
                    .find(v => v != undefined);

                // check if target cell is in the table.
                if (targetCellInfo == undefined) {
                    return;
                }

                // check if the td can be shrinked.
                if (targetCellInfo.cell.rowSpan == 1) {
                    return;
                }

                // add new cells in bottom
                let shrinkRow = getBottom(targetCellInfo) - 1;
                let insertPos = getNextCell(tableInfo, shrinkRow, getRight(targetCellInfo));
                for (let c = getLeft(targetCellInfo); c < getRight(targetCellInfo); c++) {
                    let newCell = this.element.ownerDocument.createElement("td");
                    (this.element as HTMLTableElement).rows[shrinkRow].insertBefore(newCell, insertPos);

                    common.addTag(newCell, "div");
                }

                // shrink cell
                targetCellInfo.cell.rowSpan--;
            }
        }
        //#endregion
    }
}
