import Utils from './Utils';

/**
 * 記録シートを作成する関数
 * 設定シートに定義されたシート名に基づいて、PSIテスト結果を記録するシートを作成
 */
export const createRecordingSheet = (): void => {
  Logger.log('createRecordingSheet start');
  // 設定シートから記録シート名を取得
  const sheetNames = Utils.getColumValues('config', 'B', 1);
  for (let sheetName of sheetNames) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      // シートが存在しない場合は新規作成
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
      sheet.setName(sheetName);
      // ヘッダー行を設定
      const range = sheet.getRange('A1:W1');
      range.setBackground('lightsteelblue');
      // ヘッダー内容を定義
      const headers: string[] = new Array();
      headers.push('DATE');
      // モバイル版のメトリクス
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
      // デスクトップ版のメトリクス
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
