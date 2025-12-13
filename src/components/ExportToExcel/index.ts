import type { Order } from "../../services/ordersApi";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function ExportToExcel (
    orders: Order[], 
    exportType: string,
    filterValue?: string
) {
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();

    const gray900Color = getComputedStyle(document.documentElement)
        .getPropertyValue('--gray-900')
        .trim();

    const getArgb = (color: string) => `FF${color.replace('#', '')}`;

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Pedidos", {
        properties: {tabColor: {argb: 'FF0066CC'} }
    })
    
    const biggestNameLength = orders.reduce((max, order) => 
        Math.max(max, order.name.length)
    , 0)

    const biggestAddressLength = orders.reduce((max, order) => 
        Math.max(max, order.deliveryAddress!.length)
    , 0)

    // * Altura = tamanho fonte + 15
    worksheet.columns = exportType === "Delivery" && filterValue === "Apenas Entregas" ? (
        [
            {header: "Nome", key: "name", width: biggestNameLength * 2},
            {header: "Horário", key: "time", width: 24},
            {header: "Endereço", key:"address", width: biggestAddressLength * 2}, 
        ]
    ) : 
    ([
        {header: "Nome", key: "name", width: biggestNameLength * 2},
        {header: "Horário", key: "time", width: 24},
        {header: "Item 1", key:"item1", width: 50},
        {header: "Item 2", key:"item2", width: 50},
        {header: "Item 3", key:"item3", width: 50},
        {header: "Item 4", key:"item4", width: 50},
        {header: "Item 5", key:"item5", width: 50},
        {header: "Item 6", key:"item6", width: 50},
        {header: "Item 7", key:"item7", width: 50},
        {header: "Item 8", key:"item8", width: 50},
        {header: "Item 9", key:"item9", width: 50},
        {header: "Item 10", key:"item10", width: 50},
    ])

    const headerRow = worksheet.getRow(1)
    headerRow.font = {
        bold: true,
        size: 25,
        color: { argb: 'FFFFFFFF' } 
    }

    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: getArgb(primaryColor) }
    }

    headerRow.alignment = { 
      vertical: 'middle', 
      horizontal: 'center' 
    }

    headerRow.height = 35

    // Adiciona bordas ao cabeçalho
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    const sortedOrders = [...orders].sort((orderA, orderB) => 
        orderA.time.localeCompare(orderB.time)
    )

    // Formata cada pedido dentro 1 linha 
    sortedOrders.forEach((order, index) => {
        const items: Record<string, string> = {}

        for (let i = 0; i < 10; i++) {
            items[`item${i + 1}`] = order.productsStrings[i] ?? ""
        }

        const row = worksheet.addRow(
            exportType === "Delivery" && filterValue === "Apenas Entregas" ? ({
                name: order.name,
                time: order.time,
                address: order.deliveryAddress
            }) : ({
                name: order.name,
                time: order.time,
                ...items
            })
        )

        // Linhas Zebradas
        if (index % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF5F5F5' }
            };
        }

        row.alignment = { vertical: 'middle', wrapText: true };
        row.getCell('name').alignment = { 
            vertical: 'middle', 
            horizontal: 'center', 
            wrapText: true
        }
        row.getCell('time').alignment = { 
            vertical: 'middle', 
            horizontal: 'center', 
        }

        if (exportType === "Delivery" && filterValue === "Apenas Entregas") {
            row.getCell("address").alignment = {
                vertical: 'middle', 
                horizontal: 'center', 
                wrapText: true 
            }
        } else {
            for (let i = 0; i < 10; i++) {
                row.getCell(`item${i + 1}`).alignment = { 
                    vertical: 'middle', 
                    horizontal: 'center', 
                    wrapText: true 
                }
            }
        }

        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
            }
        })

        row.height = 35
        row.font = {
            bold: true,
            size: 20,
            color: { argb: getArgb(gray900Color) } 
        }
    })
    
    // Nome do arquivo 
    const fileName = getFileName(filterValue!, exportType)

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, fileName);
}

function getFileName(filterValue: string, exportType: string) {
    const date = new Date().toLocaleDateString("sv-SE")

    switch (exportType) {
        case "Category": 
            return `pedidos_${filterValue.toLowerCase().replace(/\s+/g, "_")}_${date}.xlsx`
        case "Delivery": {
            const deliveryType = filterValue === "Apenas Entregas" ? "entregas" : "retiradas"
            return `pedidos_${deliveryType}_${date}.xlsx`
        }
        case "Status":
            return `pedidos_${filterValue}_${date}.xlsx` 
        default:
            return `pedidos_completo}_${date}.xlsx` 
    }
}