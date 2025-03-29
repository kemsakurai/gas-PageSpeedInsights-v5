// SpreadsheetApp関連の操作を型安全に行う
export const createConfigSheet = (): void => {
  Logger.log('createConfigSheet start');
  const configSheetName = 'config';
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Active spreadsheet not found');
  }
  
  let configSheet = spreadsheet.getSheetByName(configSheetName);
  if (!configSheet) {
    configSheet = spreadsheet.insertSheet();
    configSheet.setName(configSheetName);
    const range = configSheet.getRange('A1:B1');
    range.setBackground('yellow');
    const headers: string[] = [];
    headers.push('Urls');
    headers.push('SheetName');
    range.setValues([headers]);
  }
  Logger.log('createConfigSheet end');
};
