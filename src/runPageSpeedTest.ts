import PageSpeedInsightV5 from './PageSpeedInsightV5';
import { PageSpeedInsightV5Result } from './PageSpeedInsightV5';
import Utils from './Utils';

/**
 * PageSpeed Insightテストを実行する関数
 * 設定シートに記載されたURLに対してPSIテストを実行し、結果を記録シートに保存
 */
export const runPageSpeedTest = (): void => {
  Logger.log('runPageSpeedTest start');

  // APIキーを取得
  const key = Utils.getApiKey();
  if (!key) {
    throw new Error('should define PSI_API_KEY in ScriptProperties');
  }

  // 設定シートからURLリストを取得
  const urls = Utils.getColumValues('config', 'A', 1);
  if (!urls) {
    throw new Error('should define urls in config sheet');
  }

  // 設定シートから対応するシート名リストを取得
  const sheetNames = Utils.getColumValues('config', 'B', 1);
  if (!sheetNames) {
    throw new Error('should define sheetNames in config sheet');
  }

  // モバイルとデスクトップの両方でテスト実行
  const mobileOrDesktop: string[] = ['mobile', 'desktop'];
  for (let i in urls) {
    let resultArr: any[] = new Array();
    // タイムスタンプを記録
    resultArr.push(new Date().toISOString());

    // 各デバイスタイプでテストを実行
    for (let strategy of mobileOrDesktop) {
      const psi = new PageSpeedInsightV5(key);
      let result: PageSpeedInsightV5Result;
      try {
        result = psi.runTest(urls[i], { strategy: strategy });
      } catch (error) {
        Logger.log('Failed runTest', error);
        throw error;
      }

      // 結果を配列に追加
      resultArr.push(result.accessibilityScore);
      resultArr.push(result.bestPracticesScore);
      resultArr.push(result.performanceScore);
      resultArr.push(result.pwaScore);
      resultArr.push(result.seoScore);
      resultArr.push(result.firstContentfulPaint);
      resultArr.push(result.speedIndex);
      resultArr.push(result.interactive);
      resultArr.push(result.firstMeaningfulPaint);
      resultArr.push(result.firstCpuIdle ?? '');
      resultArr.push(result.estimatedInputLatency ?? '');
    }

    // 結果を対応するシートに書き込み
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!activeSpreadsheet) {
      throw new Error('Not found active spreadsheet');
    }
    const sheetName = sheetNames[i];
    const sheet = activeSpreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Not found sheet by name:${sheetName}`);
    }
    const targetRowIndex = sheet.getLastRow() + 1;
    const range = sheet.getRange('A' + targetRowIndex + ':W' + targetRowIndex);
    range.setValues([resultArr]);
  }
  Logger.log('runPageSpeedTest end');
};
