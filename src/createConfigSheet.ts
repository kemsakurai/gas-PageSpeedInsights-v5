/**
 * 設定シートを作成する関数
 * URLとシート名を管理するための設定シート（config）を作成します
 */
export const createConfigSheet = (): void => {
  Logger.log('createConfigSheet start');
  const configSheetName = 'config';
  // 既存のconfig sheetを探す
  let configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(configSheetName);
  if (!configSheet) {
    // config sheetがない場合は新規作成
    configSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    configSheet.setName(configSheetName);
    // ヘッダー行の背景色を設定
    const range = configSheet.getRange('A1:B1');
    range.setBackground('yellow');
    // ヘッダーの内容を設定
    const headers: string[] = new Array();
    headers.push('Urls');
    headers.push('SheetName');
    range.setValues([headers]);
  }
  Logger.log('createConfigSheet end');
};
