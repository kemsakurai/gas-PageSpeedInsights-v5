import Utils from './Utils';

export const createRecordingSheet = (): void => {
  Logger.log('createRecordingSheet start');
  const sheetNameRows = Utils.getColumValues('config', 'B', 1);
  
  for (let i = 0; i < sheetNameRows.length; i++) {
    // 文字列値を安全に取り出す
    const sheetNameValue = sheetNameRows[i] && sheetNameRows[i][0] ? String(sheetNameRows[i][0]) : '';
    if (!sheetNameValue) {
      Logger.log(`スキップ: 空のシート名 (インデックス ${i})`);
      continue;
    }
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('Active spreadsheet not found');
    }
    
    let sheet = spreadsheet.getSheetByName(sheetNameValue);
    if (!sheet) {
      sheet = spreadsheet.insertSheet();
      sheet.setName(sheetNameValue);
      const range = sheet.getRange('A1:W1');
      range.setBackground('lightsteelblue');
      const headers: string[] = [];
      headers.push('DATE');
      headers.push('MOBILE.accessibilityScore');
      headers.push('MOBILE.bestPracticesScore');
      headers.push('MOBILE.performanceScore');
      headers.push('MOBILE.pwaScore');
      headers.push('MOBILE.seoScore');
      headers.push('MOBILE.firstContentfulPaint');
      headers.push('MOBILE.speedIndex');
      headers.push('MOBILE.interactive');
      headers.push('MOBILE.firstMeaningfulPaint');
      headers.push('MOBILE.firstCpuIdle');
      headers.push('MOBILE.estimatedInputLatency');
      headers.push('DESKTOP.accessibilityScore');
      headers.push('DESKTOP.bestPracticesScore');
      headers.push('DESKTOP.performanceScore');
      headers.push('DESKTOP.pwaScore');
      headers.push('DESKTOP.seoScore');
      headers.push('DESKTOP.firstContentfulPaint');
      headers.push('DESKTOP.speedIndex');
      headers.push('DESKTOP.interactive');
      headers.push('DESKTOP.firstMeaningfulPaint');
      headers.push('DESKTOP.firstCpuIdle');
      headers.push('DESKTOP.estimatedInputLatency');
      range.setValues([headers]);
    }
  }
  Logger.log('createRecordingSheet end');
};