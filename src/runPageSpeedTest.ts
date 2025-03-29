import { createPageSpeedInsightV5, PageSpeedInsightV5Result, Options } from './PageSpeedInsightV5';

/**
 * PageSpeed Insightsでウェブサイトのパフォーマンスをテストする
 * 
 * @param {string} apiKey - PageSpeed Insights API キー
 * @param {string} url - テスト対象のURL
 * @param {Options} [options] - テストオプション
 * @param {string} [sheetName] - 結果を記録するシート名
 * @returns {PageSpeedInsightV5Result} テスト結果
 */
export function runPageSpeedTest(
  apiKey: string,
  url: string,
  options?: Options,
  sheetName?: string
): PageSpeedInsightV5Result {
  try {
    // 設定をログに記録
    Logger.log('Executing PageSpeed test for URL: %s', url);
    if (options) {
      Logger.log('With options: %s', JSON.stringify(options));
    }
    
    // PageSpeedInsightV5インスタンスを作成
    const psi = createPageSpeedInsightV5(apiKey);
    
    // テスト実行
    const testResult = psi.runTest(url, options);
    
    // 結果をログに記録
    Logger.log('PageSpeed test completed successfully');
    
    // 結果を記録（必要な場合）
    if (sheetName) {
      saveResultToSheet(testResult, url, sheetName);
    }
    
    return testResult;
  } catch (error) {
    // エラー処理
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log('Error in runPageSpeedTest: %s', errorMessage);
    
    // エラー情報を含む結果オブジェクトを返す
    return {
      accessibilityScore: null,
      bestPracticesScore: null,
      performanceScore: null,
      pwaScore: null,
      seoScore: null,
      error: errorMessage,
      errorType: 'EXECUTION_ERROR'
    };
  }
}

/**
 * テスト結果をスプレッドシートに保存する
 * 
 * @param {PageSpeedInsightV5Result} result - テスト結果
 * @param {string} url - テスト対象のURL
 * @param {string} sheetName - 保存先のシート名
 */
function saveResultToSheet(result: PageSpeedInsightV5Result, url: string, sheetName: string): void {
  try {
    // 現在のスプレッドシートを取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(sheetName);
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // ヘッダー行の設定
      sheet.appendRow([
        'URL',
        'Timestamp',
        'Performance',
        'Accessibility',
        'Best Practices',
        'SEO',
        'PWA',
        'FCP',
        'Speed Index',
        'TTI',
        'Error'
      ]);
    }
    
    // 問題が発生している箇所を修正
    // スコアを計算する前に型安全に処理（null/undefinedチェック）
    let performanceScore: number | string = 'N/A';
    let accessibilityScore: number | string = 'N/A';
    let bestPracticesScore: number | string = 'N/A';
    let seoScore: number | string = 'N/A';
    let pwaScore: number | string = 'N/A';

    if (typeof result.performanceScore === 'number') {
      performanceScore = result.performanceScore * 100;
    }
    if (typeof result.accessibilityScore === 'number') {
      accessibilityScore = result.accessibilityScore * 100;
    }
    if (typeof result.bestPracticesScore === 'number') {
      bestPracticesScore = result.bestPracticesScore * 100;
    }
    if (typeof result.seoScore === 'number') {
      seoScore = result.seoScore * 100;
    }
    if (typeof result.pwaScore === 'number') {
      pwaScore = result.pwaScore * 100;
    }
    
    // 結果をシートに追加
    sheet.appendRow([
      url,
      new Date().toISOString(),
      performanceScore,
      accessibilityScore,
      bestPracticesScore,
      seoScore,
      pwaScore,
      result.firstContentfulPaint || 'N/A',
      result.speedIndex || 'N/A',
      result.interactive || 'N/A',
      result.error || ''
    ]);
    
    Logger.log('Test results saved to sheet: %s', sheetName);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log('Error saving results to sheet: %s', errorMessage);
  }
}

/**
 * 複数のURLに対してPageSpeed Insightsテストを実行する
 * 
 * @param {string} apiKey - PageSpeed Insights API キー
 * @param {string[]} urls - テスト対象のURL配列
 * @param {Options} [options] - テストオプション
 * @param {string} [sheetName] - 結果を記録するシート名
 * @returns {PageSpeedInsightV5Result[]} テスト結果の配列
 */
export function runBatchPageSpeedTest(
  apiKey: string,
  urls: string[],
  options?: Options,
  sheetName?: string
): PageSpeedInsightV5Result[] {
  const results: PageSpeedInsightV5Result[] = [];
  
  // URLごとにテスト実行
  for (const url of urls) {
    try {
      Logger.log('Processing URL: %s', url);
      const result = runPageSpeedTest(apiKey, url, options, sheetName);
      results.push(result);
      
      // API制限を考慮して少し待機
      Utilities.sleep(1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.log('Error processing URL %s: %s', url, errorMessage);
      
      // エラー情報を含む結果オブジェクトを追加
      results.push({
        accessibilityScore: null,
        bestPracticesScore: null,
        performanceScore: null,
        pwaScore: null,
        seoScore: null,
        error: 'Failed to test URL: ' + url + '. Error: ' + errorMessage,
        errorType: 'BATCH_PROCESSING_ERROR'
      });
    }
  }
  
  return results;
}
