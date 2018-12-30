export const createConfigSheet = (): void => {
  Logger.log('createConfigSheet start');
  const configSheetName = 'config';
  let configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  if (!configSheet) {
    configSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    configSheet.setName(configSheetName);
    const range = configSheet.getRange('A1:B1');
    range.setBackground('yellow');
    const headers: string[] = new Array();
    headers.push('Urls');
    headers.push('SheetName');
    range.setValues([headers]);
  }
  Logger.log('createConfigSheet end');
};
