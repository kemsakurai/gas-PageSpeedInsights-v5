/**
 * スプレッドシートのシートを表す型
 */
export interface SheetType {
  getRange(a1Notation: string): RangeType;
  setValues(values: readonly (string | number | boolean | Date)[][]): SheetType;
  getLastRow(): number;
  getLastColumn(): number;
  getDataRange(): RangeType;
  setName(name: string): SheetType;
}

/**
 * スプレッドシートの範囲を表す型
 */
export interface RangeType {
  setBackground(color: string): RangeType;
  setValues(values: readonly (string | number | boolean | Date)[][]): RangeType;
}

/**
 * スプレッドシート自体を表す型
 */
export interface SpreadsheetType {
  getSheetByName(name: string): SheetType | null;
  insertSheet(sheetName?: string): SheetType;
  addMenu(name: string, subMenus: readonly { name: string; functionName: string }[]): void;
}

declare namespace GoogleAppsScript {
  namespace Spreadsheet {
    interface Spreadsheet {
      getSheetByName(name: string): Sheet | null;
      insertSheet(sheetName?: string): Sheet;
      addMenu(name: string, subMenus: { name: string; functionName: string }[]): void;
    }

    interface Sheet {
      getRange(a1Notation: string): Range;
      setValues(values: unknown[][]): Sheet;
      getLastRow(): number;
      getLastColumn(): number;
      getDataRange(): Range;
      setName(name: string): Sheet;
    }

    interface Range {
      setBackground(color: string): Range;
      setValues(values: unknown[][]): Range;
    }

    interface SpreadsheetApp {
      getActiveSpreadsheet(): Spreadsheet;
    }
  }
}

