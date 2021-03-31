interface TableRow<T> {
    data: T;
    children: TableRow<T>[];
}

interface Table<T> {
    rows: TableRow<T>[];
}

interface TableRowComponent<T> {
    rowspan: number;
    data: T;
}

/*
* parses tree of table data to 2-dimensional list
*
*/
function parseRows <T> (row: TableRow<T>): TableRowComponent<T>[][] {
    const childrenLen = row.children?.length;
    if(childrenLen == 0)  return [[{ data: row.data, rowspan: 1 }]];


    const res = [];
    for(let child of row.children) {
        res.push(...parseRows(child));
    }
    const rowspan = res.reduce((sum, _) => sum+1, 0)
    const [ first, ...rest ] = res;
    return [[{ data: row.data, rowspan: rowspan }, ...first], ...rest];
}

/*
* generate HTML tr tag from parsed table data
*
*/
function generateRowHtml <T> (parsedRow: TableRowComponent<T>[]) {
    let res = '';
    for(let row of parsedRow) {
        res += (row.rowspan > 1) ? `<td rowspan="${row.rowspan}">${row.data}</td>` : `<td>${row.data}</td>`;
    }
    return `<tr>${res}</tr>`
}

/*
* generate HTML table tag from parsed table data
*
*/
function generateTableHtml <T> (parsedRows: TableRowComponent<T>[][]) {
    let res = '';
    const rowLen = parsedRows.length;
    for(let rowIdx = 0; rowIdx < rowLen; rowIdx++) {
        res += generateRowHtml(parsedRows[rowIdx]);
    }

    return `<table><tbody>${res}</tbody></table>`
}

(function() {
    const row = {
        data: 0,
        children: [
            {
                data: 1,
                children: [
                    {
                        data: 2,
                        children: [
                            {
                                data: 3,
                                children: []
                            },
                        ]
                    },
                ]
            },
            {
                data: 4,
                children: [
                    {
                        data: 5,
                        children: [
                            {
                                data: 6,
                                children: []
                            },
                            {
                                data: 7,
                                children: []
                            },
                            {
                                data: 8,
                                children: []
                            },
                        ]
                    },
                    {
                        data: 9,
                        children: [
                            {
                                data: 10,
                                children: []
                            },
                        ]
                    },
                ]
            },
            {
                data: 11,
                children: [
                    {
                        data: 12,
                        children: [
                            {
                                data: 13,
                                children: []
                            }
                        ]
                    },
                ]
            },
        ]
    }

    const res = parseRows(row);
    console.log(generateTableHtml(res))
})()