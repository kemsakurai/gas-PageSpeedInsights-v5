import Utils from './Utils';
import * as queryString from 'querystring';

/**
 * PageSpeed Insights APIのオプション
 */
declare type Options = Partial<{
  locale: string; // ロケール設定（例: 'ja_JP'）
  strategy: string; // テスト戦略（'mobile'または'desktop'）
  category: string; // テストカテゴリ
  utm_source: string; // UTMソース
  utm_campaign: string; // UTMキャンペーン
  fields: string[]; // 取得するフィールド
}>;

/**
 * PageSpeed Insights API V5の結果を格納する型
 */
export type PageSpeedInsightV5Result = {
  accessibilityScore: number; // アクセシビリティスコア
  bestPracticesScore: number; // ベストプラクティススコア
  performanceScore: number; // パフォーマンススコア
  pwaScore: number; // PWAスコア
  seoScore: number; // SEOスコア
  firstContentfulPaint: number; // 初回コンテンツ描画時間
  speedIndex: number; // スピードインデックス
  interactive: number; // インタラクティブになるまでの時間
  firstMeaningfulPaint: number; // 初回意味のある描画時間
  firstCpuIdle: number; // 初回CPU待機状態
  estimatedInputLatency: number; // 推定入力レイテンシ
};

/**
 * PageSpeed Insights API V5を使用するクラス
 */
export default class PageSpeedInsightV5 {
  /**
   * コンストラクタ
   * @param key APIキー - runTestするときは必須
   */
  constructor(private key?: string) {}

  /**
   * PageSpeedInsight テストを実行
   *
   * @param url テスト対象のURL
   * @param options テストオプション
   * @return テスト結果
   */
  public runTest(url: string, options?: Options): PageSpeedInsightV5Result {
    // リファラーを取得し、ヘッダーに設定
    const referer = Utils.getReferer();
    let headers = null;
    if (referer) {
      headers = {
        referer: referer
      };
    }

    // リクエストオプションを設定
    let requestOptions = null;
    if (headers) {
      requestOptions = {
        method: 'get',
        headers: headers,
        muteHttpExceptions: false
      };
    } else {
      requestOptions = {
        method: 'get',
        muteHttpExceptions: false
      };
    }

    // リクエストURLを生成して実行
    const requestURL = this.generateRunTestURL(url, options);
    try {
      const response = Utils.fetch(requestURL, requestOptions);
      return this.convertWebPageResponseToResult(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * WebPagetestのレスポンスからResultオブジェクトに変換
   * @param response APIレスポンス
   * @returns 整形された結果オブジェクト
   */
  public convertWebPageResponseToResult(response: any): PageSpeedInsightV5Result {
    const result: PageSpeedInsightV5Result = {
      accessibilityScore: response.lighthouseResult.categories.accessibility.score,
      bestPracticesScore: response.lighthouseResult.categories['best-practices'].score,
      performanceScore: response.lighthouseResult.categories.performance.score,
      pwaScore: response.lighthouseResult.categories.pwa
        ? response.lighthouseResult.categories.pwa.score
        : '',
      seoScore: response.lighthouseResult.categories.seo.score,
      firstContentfulPaint: Utils.convertDisplayValueToNumber(
        response.lighthouseResult.audits['first-contentful-paint'].displayValue
      ),
      speedIndex: Utils.convertDisplayValueToNumber(
        response.lighthouseResult.audits['speed-index'].displayValue
      ),
      interactive: Utils.convertDisplayValueToNumber(
        response.lighthouseResult.audits['interactive'].displayValue
      ),
      firstMeaningfulPaint: Utils.convertDisplayValueToNumber(
        response.lighthouseResult.audits['first-meaningful-paint'].displayValue
      ),
      // First CPU Idle is deprecated from Lighthouse 6.0. see. https://developer.chrome.com/docs/lighthouse/performance/first-cpu-idle/
      firstCpuIdle: undefined,
      estimatedInputLatency: undefined
    };
    return result;
  }

  /**
   * PageSpeedInsight実行用のURLを生成
   *
   * @param url テスト対象のURL
   * @param options テストオプション
   * @return 生成されたリクエストURL
   */
  public generateRunTestURL(url: string, options: Options = {}): string {
    const apiEndpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const query = queryString.stringify({
      key: this.key,
      url: encodeURI(url),
      locale: options.locale || 'ja_JP', // デフォルトは'en'
      strategy: options.strategy || 'desktop',
      category: options.category || [
        'accessibility',
        'best-practices',
        'performance',
        'pwa',
        'seo'
      ],
      utm_source: options.utm_source || 'script.google.com',
      utm_campaign: options.utm_campaign || 'PSI_TEST',
      fields:
        options.fields ||
        'analysisUTCTimestamp,lighthouseResult(audits,categories(accessibility/score,best-practices/score,performance/score,pwa/score,seo/score))'
    });
    return `${apiEndpoint}?${query}`;
  }
}
