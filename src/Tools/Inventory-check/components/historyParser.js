const QTY_HEADER = 'qty change';
const RES_HEADER = 'res change';
const TOTAL_HEADER = 'total qty';
const DATE_HEADER = 'date';
const EVENT_HEADER = 'event';
const DEFAULT_DATE_INDEX = 0;
const DEFAULT_EVENT_INDEX = 2;
const DEFAULT_QTY_INDEX = 5;
const DEFAULT_RES_INDEX = 6;
const DEFAULT_TOTAL_INDEX = 7;
const DEFAULT_COLUMN_COUNT = 8;
const MAX_LISTED_ERRORS = 5;

function splitLine(line){
    return (line.includes('\t') ? line.split('\t') : line.split(/\s{2,}/)).map(cell => cell.trim());
}

function parseQuantity(cell){
    const value = (cell ?? '').replace(/,/g, '').replace(/[−]/g, '-');
    if(value === '' || /^[-–—]$/.test(value)){
        return 0;
    }
    if(!/^[+-]?\d+(\.\d+)?$/.test(value)){
        return NaN;
    }
    return Number(value);
}

/**
 * Parses pasted Rain inventory history. The top row is the most recent event, so the
 * returned changes are ordered oldest first, the same order manual entry produces.
 * totalQty is Rain's own running total after the change, or null when it is missing or unreadable.
 * date and event are null when the column is missing or blank.
 * @returns {{changes: {inventory: number, reserved: number, totalQty: number|null, date: string|null, event: string|null}[], errors: string[]}}
 */
export function parseHistory(text){
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if(!lines.length){
        return { changes: [], errors: ['No data was provided to import.'] };
    }

    let qtyIndex = DEFAULT_QTY_INDEX;
    let resIndex = DEFAULT_RES_INDEX;
    let totalIndex = DEFAULT_TOTAL_INDEX;
    let dateIndex = DEFAULT_DATE_INDEX;
    let eventIndex = DEFAULT_EVENT_INDEX;
    let columnCount = DEFAULT_COLUMN_COUNT;
    let dataLines = lines;
    let firstDataLineNumber = 1;

    const headerCells = splitLine(lines[0]).map(cell => cell.toLowerCase());
    if(headerCells.includes(QTY_HEADER) || headerCells.includes(RES_HEADER)){
        qtyIndex = headerCells.indexOf(QTY_HEADER);
        resIndex = headerCells.indexOf(RES_HEADER);
        if(qtyIndex === -1 || resIndex === -1){
            return {
                changes: [],
                errors: [`The header row is missing the "${qtyIndex === -1 ? 'Qty Change' : 'Res Change'}" column.`],
            };
        }
        totalIndex = headerCells.indexOf(TOTAL_HEADER);
        dateIndex = headerCells.indexOf(DATE_HEADER);
        eventIndex = headerCells.indexOf(EVENT_HEADER);
        columnCount = headerCells.length;
        dataLines = lines.slice(1);
        firstDataLineNumber = 2;
    }

    const changes = [];
    const errors = [];
    dataLines.forEach((line, index) => {
        const lineNumber = index + firstDataLineNumber;
        const cells = splitLine(line);
        //space separated text loses empty cells (e.g. a blank Employee), so count from the right instead
        const offset = line.includes('\t') ? 0 : cells.length - columnCount;
        const qtyCell = cells[qtyIndex + offset];
        const resCell = cells[resIndex + offset];
        if(qtyIndex + offset < 0 || qtyCell === undefined || resCell === undefined){
            errors.push(`Line ${lineNumber} does not have the Qty Change and Res Change columns.`);
            return;
        }
        const inventory = parseQuantity(qtyCell);
        const reserved = parseQuantity(resCell);
        if(isNaN(inventory) || isNaN(reserved)){
            errors.push(`Line ${lineNumber} has a Qty Change ("${qtyCell}") or Res Change ("${resCell}") that is not a number.`);
            return;
        }
        const totalCell = totalIndex === -1 ? undefined : cells[totalIndex + offset];
        const parsedTotal = totalCell === undefined ? NaN : parseQuantity(totalCell);
        const totalQty = isNaN(parsedTotal) ? null : parsedTotal;
        //Date and Event sit left of the cells that can be blank (Event ID, Employee), so they are read from the left
        const date = dateIndex === -1 ? null : cells[dateIndex] || null;
        const event = eventIndex === -1 ? null : cells[eventIndex] || null;
        //matches manual entry, which ignores rows that change nothing
        if(inventory !== 0 || reserved !== 0){
            changes.push({ inventory, reserved, totalQty, date, event });
        }
    });

    if(errors.length){
        const hidden = errors.length - MAX_LISTED_ERRORS;
        const listed = errors.slice(0, MAX_LISTED_ERRORS);
        if(hidden > 0){
            listed.push(`...and ${hidden} more line${hidden === 1 ? '' : 's'} with problems.`);
        }
        return { changes: [], errors: listed };
    }
    if(!changes.length){
        return { changes: [], errors: ['No rows with an inventory or reserved change were found.'] };
    }
    return { changes: changes.reverse(), errors: [] };
}
