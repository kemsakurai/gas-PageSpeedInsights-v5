import Utils from './Utils';
import * as queryString from 'querystring';

declare type Options = Partial<{
  locale: string;
  strategy: string;
  category: string;
  utm_source: string;
  utm_campaign: string;
  fields: string[];
}>;

export type PageSpeedInsightV5Result = {
  accessibilityScore: number;
  bestPracticesScore: number;
  performanceScore: number;
  pwaScore: number;
  seoScore: number;
  firstContentfulPaint: number;
  speedIndex: number;
  interactive: number;
  firstMeaningfulPaint: number;
  firstCpuIdle: number;
  estimatedInputLatency: number;
};

export default class PageSpeedInsightV5 {
  /**
   * @param {type}    key - runTest するときは必須。
   */
  constructor(private key?: string) {}

  /**
   * PageSpeedInsight 実行
   *
   * @param {type}    url - this is the parameter url
   * @param {type}    options - this is the parameter options
   *
   * @return {} PageSpeedInsightV5Result
   */
  public runTest(url: string, options?: Options): PageSpeedInsightV5Result {
    const referer = Utils.getReferer();
    let headers = null;
    if (referer) {
      headers = {
        referer: referer
      };
    }
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
    const requestURL = this.generateRunTestURL(url, options);
    try {
      const response = Utils.fetch(requestURL, requestOptions);
      return this.convertWebPageResponseToResult(response);
    } catch (error) {
      throw error;
    }
  }
  /**
   * WebPagetestのresponseからTestResultオブジェクトに変換します
   * @param response
   */
  public convertWebPageResponseToResult(response: any): PageSpeedInsightV5Result {
    const result: PageSpeedInsightV5Result = {
      accessibilityScore: response.lighthouseResult.categories.accessibility.score,
      bestPracticesScore: response.lighthouseResult.categories['best-practices'].score,
      performanceScore: response.lighthouseResult.categories.performance.score,
      pwaScore: response.lighthouseResult.categories.pwa.score,
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
   * PageSpeedInsight 実行用 URL 生成
   *
   * @param {type}    url - 必須。
   * @param {type}    options - 省略可能。
   *
   * @return {String} URL
   */
  public generateRunTestURL(url: string, options: Options = {}): string {
    const apiEndpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    const query = queryString.stringify({
      key: this.key,
      url: encodeURI(url),
      locale: options.locale || 'ja_JP', // default is 'en'
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
