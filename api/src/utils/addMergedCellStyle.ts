import ExcelJS from "exceljs";

export const addMergedCellStyle = <T>(worksheet: ExcelJS.Worksheet, startRow: number, endRow: number, col: number, style: T) => {
  for (let row = startRow; row <= endRow; row++) {
    const cell = worksheet.getCell(row, col);
    Object.assign(cell, { style });
  }
}