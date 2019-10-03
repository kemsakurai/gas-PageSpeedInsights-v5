import Utils from './Utils';

export const createRecordingSheet = (): void => {
  Logger.log('createRecordingSheet start');
  const sheetNames = Utils.getColumValues('config', 'B', 1);
  for (let sheetName of sheetNames) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
      sheet.setName(sheetName);
      const range = sheet.getRange('A1:W1');
      range.setBackground('lightsteelblue');
      const headers: string[] = new Array();
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
