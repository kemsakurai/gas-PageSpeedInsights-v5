import Utils from './Utils';
import * as queryString from 'querystring';
import { PageSpeedInsightsResponse, PageSpeedInsightV5Result, Options } from './model';

// model.tsからの型を再エクスポート
export type { PageSpeedInsightV5Result, Options } from './model';

/**
 * PageSpeedInsight 実行用 URL 生成
 *
 * @param {string}    key - API Key（省略可能）
 * @param {string}    url - 測定対象URL（必須）
 * @param {Options}   options - 測定オプション（省略可能）
 *
 * @return {string} 生成されたAPI呼び出し用URL
 */
export function generateRunTestURL(key: string | undefined, url: string, options: Options): string {
  const apiEndpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  // カテゴリーをフォーマット（配列の場合はカンマ区切りに変換）
  const category = options.category 
    ? (Array.isArray(options.category) ? options.category.join(',') : String(options.category))
    : 'accessibility,best-practices,performance,pwa,seo';

  // フィールドをフォーマット（配列の場合はカンマ区切りに変換）
  const fields = options.fields
    ? (Array.isArray(options.fields) ? options.fields.join(',') : String(options.fields))
    : 'analysisUTCTimestamp,lighthouseResult(audits,categories(accessibility/score,best-practices/score,performance/score,pwa/score,seo/score))';

  // クエリパラメータの構築
  const query = queryString.stringify({
    key: key,
    url: encodeURI(url),
    locale: options.locale || 'ja_JP', // default is 'en'
    strategy: options.strategy || 'desktop',
    category: category,
    utm_source: options.utm_source || 'script.google.com',
    utm_campaign: options.utm_campaign || 'PSI_TEST',
    fields: fields,
  });
  return apiEndpoint + "?" + query;
}

/**
 * API レスポンスから結果オブジェクトを生成
 * 
 * @param {PageSpeedInsightsResponse} response - API レスポンス
 * @return {PageSpeedInsightV5Result} 変換された結果オブジェクト
 */
export function convertWebPageResponseToResult(
  response: PageSpeedInsightsResponse,
): PageSpeedInsightV5Result {
  // デフォルト結果オブジェクト（エラー時に返す用）
  const defaultResult: PageSpeedInsightV5Result = {
    accessibilityScore: null,
    bestPracticesScore: null,
    performanceScore: null,
    pwaScore: null,
    seoScore: null,
  };

  // APIレスポンスの構造を検証・ログ出力
  const responseStructure = {
    hasLighthouseResult: !!response?.lighthouseResult,
    hasCategories: !!response?.lighthouseResult?.categories,
    categoryKeys: response?.lighthouseResult?.categories ? Object.keys(response.lighthouseResult.categories) : [],
  };
  Logger.log('API Response Structure: ' + JSON.stringify(responseStructure));

  // エラーチェック: lighthouseResultの存在確認
  if (!response?.lighthouseResult) {
    const errorMessage = 'Lighthouse result missing in API response';
    Logger.log(errorMessage + ': ' + JSON.stringify(response).substring(0, 500));
    return Object.assign({}, defaultResult, {
      error: errorMessage,
      errorType: 'MISSING_LIGHTHOUSE_RESULT'
    });
  }

  // エラーチェック: categoriesの存在確認
  if (!response.lighthouseResult.categories) {
    const categoriesErrorMessage = 'Categories missing in Lighthouse result';
    Logger.log(categoriesErrorMessage + ': ' + JSON.stringify(response.lighthouseResult).substring(0, 500));
    return Object.assign({}, defaultResult, {
      error: categoriesErrorMessage,
      errorType: 'MISSING_CATEGORIES'
    });
  }

  // 各カテゴリーの検証
  const categories = response.lighthouseResult.categories;
  const audits = response.lighthouseResult.audits || {};
  
  // PWAカテゴリーの存在確認（廃止された可能性あり）
  const hasPwaCategory = 'pwa' in categories;
  if (!hasPwaCategory) {
    Logger.log('PWAカテゴリーが存在しません。後方互換性のためにnull値を使用します。');
  }

  // カテゴリー詳細のログ出力
  Logger.log('Categories details: ' + JSON.stringify({
    accessibility: 'accessibility' in categories,
    accessibilityScore: categories.accessibility?.score,
    bestPractices: 'best-practices' in categories,
    bestPracticesScore: categories['best-practices']?.score,
    performance: 'performance' in categories,
    performanceScore: categories.performance?.score,
    pwa: hasPwaCategory,
    pwaScore: hasPwaCategory ? categories.pwa?.score : null,
    seo: 'seo' in categories,
    seoScore: categories.seo?.score,
  }));

  // 監査項目詳細のログ出力
  Logger.log('Audits details: ' + JSON.stringify({
    firstContentfulPaint: 'first-contentful-paint' in audits,
    firstContentfulPaintDisplayValue: audits['first-contentful-paint']?.displayValue,
    speedIndex: 'speed-index' in audits,
    interactive: 'interactive' in audits,
    firstMeaningfulPaint: 'first-meaningful-paint' in audits,
    firstCpuIdle: 'first-cpu-idle' in audits,
    estimatedInputLatency: 'estimated-input-latency' in audits,
  }));

  try {
    // 結果オブジェクトの構築（従来の条件分岐を使用）
    const result: PageSpeedInsightV5Result = {
      // カテゴリースコアの安全な取得
      accessibilityScore: typeof categories.accessibility?.score === 'number' ? categories.accessibility.score : null,
      bestPracticesScore: typeof categories['best-practices']?.score === 'number' ? categories['best-practices'].score : null,
      performanceScore: typeof categories.performance?.score === 'number' ? categories.performance.score : null,
      pwaScore: hasPwaCategory && typeof categories.pwa?.score === 'number' ? categories.pwa.score : null,
      seoScore: typeof categories.seo?.score === 'number' ? categories.seo.score : null,

      // 各パフォーマンス指標の値取得
      firstContentfulPaint: Utils.convertDisplayValueToNumber(audits['first-contentful-paint']?.displayValue ?? ''),
      speedIndex: Utils.convertDisplayValueToNumber(audits['speed-index']?.displayValue ?? ''),
      interactive: Utils.convertDisplayValueToNumber(audits['interactive']?.displayValue ?? ''),
      firstMeaningfulPaint: Utils.convertDisplayValueToNumber(audits['first-meaningful-paint']?.displayValue ?? ''),
      
      // 廃止された可能性がある指標は条件付きで取得
      firstCpuIdle: audits['first-cpu-idle']?.displayValue 
      ? Utils.convertDisplayValueToNumber(audits['first-cpu-idle'].displayValue)
      : undefined,
      estimatedInputLatency: audits['estimated-input-latency']?.displayValue
      ? Utils.convertDisplayValueToNumber(audits['estimated-input-latency'].displayValue)
      : undefined,
    };

    return result;
  } catch (error) {
    // 例外発生時の詳細ログ記録
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log('Error creating result object: ' + JSON.stringify(error, Object.getOwnPropertyNames(error)));
    Logger.log('API Response preview: ' + JSON.stringify(response).substring(0, 1000));
    
    return Object.assign({}, defaultResult, {
      error: errorMessage,
      errorType: 'RESULT_CONVERSION_ERROR'
    });
  }
}

/**
 * PageSpeedInsight テスト実行
 *
 * @param {string}    key - API Key（省略可能）
 * @param {string}    url - 測定対象URL（必須）
 * @param {Options}   options - 測定オプション（省略可能）
 *
 * @return {PageSpeedInsightV5Result} テスト結果
 */
export function runTest(key: string | undefined, url: string, options: Options = {}): PageSpeedInsightV5Result {
  // リファラー情報の取得と設定
  const referer = Utils.getReferer();
  const requestOptions: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'get',
    muteHttpExceptions: false,
  };
  
  // リファラーがある場合のみヘッダーに追加（より保守的な条件式に変更）
  if (referer !== null && referer !== undefined && referer !== '') {
    requestOptions.headers = { "referer": referer };
  }
  
  // リクエストURLの生成
  const requestURL = generateRunTestURL(key, url, options);

  try {
    // API呼び出しと結果変換
    const responseData = Utils.fetch<PageSpeedInsightsResponse>(requestURL, requestOptions);
    return convertWebPageResponseToResult(responseData);
  } catch (error) {
    // エラーハンドリングと結果オブジェクト返却
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.log('API呼び出しエラー: ' + errorMessage);
    
    return Object.assign({}, {
      accessibilityScore: null,
      bestPracticesScore: null,
      performanceScore: null,
      pwaScore: null,
      seoScore: null,
      error: errorMessage,
      errorType: 'API_ERROR'
    });
  }
}

/**
 * PageSpeedInsightV5の関数インターフェース
 */
export interface PageSpeedInsightV5Interface {
  runTest: (url: string, options?: Options) => PageSpeedInsightV5Result;
  convertWebPageResponseToResult: (response: PageSpeedInsightsResponse) => PageSpeedInsightV5Result;
  generateRunTestURL: (url: string, options: Options) => string;
}

/**
 * PageSpeedInsightV5の関数を初期化して返す
 * @param key API キー
 * @returns PageSpeedInsightV5Interface インターフェイスを実装したオブジェクト
 */
export function createPageSpeedInsightV5(key?: string): PageSpeedInsightV5Interface {
  return {
    runTest: (url: string, options?: Options): PageSpeedInsightV5Result => runTest(key, url, options || {}),
    convertWebPageResponseToResult,
    generateRunTestURL: (url: string, options: Options): string => generateRunTestURL(key, url, options)
  };
}

// 後方互換性のために、デフォルトエクスポートとしてfactory関数を提供
export default createPageSpeedInsightV5;
