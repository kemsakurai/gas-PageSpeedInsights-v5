import PageSpeedInsightV5, { PageSpeedInsightV5Result, Options } from './PageSpeedInsightV5';
import Utils from './Utils';

export const runPageSpeedTest = (): void => {
  Logger.log('runPageSpeedTest start');

  const key = Utils.getApiKey();
  if (!key) {
    throw new Error('should define PSI_API_KEY in ScriptProperties');
  }
  const urls = Utils.getColumValues('config', 'A', 1);
  if (!urls) {
    throw new Error('should define urls in config sheet');
  }
  const sheetNames = Utils.getColumValues('config', 'B', 1);
  if (!sheetNames) {
    throw new Error('should define sheetNames in config sheet');
  }
  const mobileOrDesktop: string[] = ['mobile', 'desktop'];
  for (let i in urls) {
    let resultArr: any[] = new Array();
    resultArr.push(new Date().toISOString());
    for (let strategy of mobileOrDesktop) {
      const psi = new PageSpeedInsightV5(key);
      let result: PageSpeedInsightV5Result;
      try {
        // urls[i][0]が存在することを確認し、明示的に文字列に変換
        const url = urls[i] && urls[i][0] ? String(urls[i][0]) : '';
        if (!url) {
          throw new Error(`Invalid URL at index ${i}: ${urls[i]}`);
        }

        // 明示的にOptions型の変数を作成する（推奨方法）
        const options: Options = {
          strategy: strategy
        };
        result = psi.runTest(url, options);
      } catch (error) {
        Logger.log('Failed runTest', error as Object);
        throw error;
      }
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
