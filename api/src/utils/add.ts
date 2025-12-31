import { addMergedCellStyle } from "./addMergedCellStyle";
import ExcelJS from "exceljs";

export function mergeVerticallyWithStyle(worksheet: ExcelJS.Worksheet, startRow: number, endRow: number, totalCols: number, style: any) {

  for (let col = 1; col <= totalCols; col++) {
    // Merge vertically in this column
    worksheet.mergeCells(startRow, col, endRow, col);

    addMergedCellStyle(worksheet, startRow, endRow, col, style);

    // // Apply style to every cell inside that merged area
    // for (let row = startRow; row <= endRow; row++) {
    //   const cell = worksheet.getCell(row, col);
    //   Object.assign(cell, { style });
    // }
  }
}