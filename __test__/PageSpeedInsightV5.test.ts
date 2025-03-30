// Utilsをモック化（インポート前に配置）
const mockFetch = jest.fn();
const mockGetReferer = jest.fn();
const mockConvertDisplayValueToNumber = jest.fn();

jest.mock('../src/Utils', () => ({
  __esModule: true,
  default: {
    fetch: mockFetch,
    getReferer: mockGetReferer,
    convertDisplayValueToNumber: mockConvertDisplayValueToNumber
  }
}));

// クラスと型のインポート
import PageSpeedInsightV5, { PageSpeedInsightV5Result } from '../src/PageSpeedInsightV5';

describe('PageSpeedInsightV5', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // デフォルトのモック動作を設定
    mockGetReferer.mockReturnValue('https://script.google.com');
    mockConvertDisplayValueToNumber.mockImplementation((value: string) => {
      // 数値が含まれた文字列から数値を抽出する簡易実装
      const match = value.match(/[0-9.]+/);
      return match ? parseFloat(match[0]) : 0;
    });
  });

  describe('generateRunTestURL', () => {
    test('デフォルト値でURLが正しく生成される', () => {
      // 準備
      const psi = new PageSpeedInsightV5('test-api-key');
      const url = 'https://example.com';
      
      // 実行
      const result = psi.generateRunTestURL(url);
      
      // 検証
      expect(result).toContain('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
      expect(result).toContain('key=test-api-key');
      // URLエンコードの検証方法を修正
      // queryString.stringifyはURLを%3A%2F%2Fのようにエンコードするため
      const encodedUrlPart = encodeURIComponent(url);
      expect(result).toContain(`url=${encodedUrlPart}`);
      expect(result).toContain('locale=ja_JP');
      expect(result).toContain('strategy=desktop');
    });

    test('オプションを指定した場合に正しくURLが生成される', () => {
      // 準備
      const psi = new PageSpeedInsightV5('test-api-key');
      const url = 'https://example.com';
      const options = {
        locale: 'en_US',
        strategy: 'mobile',
        category: 'performance',
        utm_source: 'test-source',
        utm_campaign: 'test-campaign'
      };
      
      // 実行
      const result = psi.generateRunTestURL(url, options);
      
      // 検証
      expect(result).toContain('locale=en_US');
      expect(result).toContain('strategy=mobile');
      expect(result).toContain('category=performance');
      expect(result).toContain('utm_source=test-source');
      expect(result).toContain('utm_campaign=test-campaign');
    });
  });

  describe('convertWebPageResponseToResult', () => {
    test('APIレスポンスを正しく変換する', () => {
      // 準備
      const psi = new PageSpeedInsightV5();
      const mockResponse = {
        lighthouseResult: {
          categories: {
            accessibility: { score: 0.95 },
            'best-practices': { score: 0.87 },
            performance: { score: 0.76 },
            pwa: { score: 0.65 },
            seo: { score: 0.98 }
          },
          audits: {
            'first-contentful-paint': { displayValue: '1.2 s' },
            'speed-index': { displayValue: '2.3 s' },
            'interactive': { displayValue: '3.4 s' },
            'first-meaningful-paint': { displayValue: '1.5 s' }
          }
        }
      };
      
      mockConvertDisplayValueToNumber.mockImplementation((value) => {
        switch(value) {
          case '1.2 s': return 1.2;
          case '2.3 s': return 2.3;
          case '3.4 s': return 3.4;
          case '1.5 s': return 1.5;
          default: return 0;
        }
      });
      
      // 実行
      const result = psi.convertWebPageResponseToResult(mockResponse);
      
      // 検証
      expect(result.accessibilityScore).toBe(0.95);
      expect(result.bestPracticesScore).toBe(0.87);
      expect(result.performanceScore).toBe(0.76);
      expect(result.pwaScore).toBe(0.65);
      expect(result.seoScore).toBe(0.98);
      expect(result.firstContentfulPaint).toBe(1.2);
      expect(result.speedIndex).toBe(2.3);
      expect(result.interactive).toBe(3.4);
      expect(result.firstMeaningfulPaint).toBe(1.5);
      expect(result.firstCpuIdle).toBeUndefined(); // 廃止されたメトリクス
      expect(result.estimatedInputLatency).toBeUndefined(); // 廃止されたメトリクス
    });

    test('PWAスコアが存在しない場合に空文字を返す', () => {
      // 準備
      const psi = new PageSpeedInsightV5();
      const mockResponse = {
        lighthouseResult: {
          categories: {
            accessibility: { score: 0.95 },
            'best-practices': { score: 0.87 },
            performance: { score: 0.76 },
            seo: { score: 0.98 }
            // pwaカテゴリがない
          },
          audits: {
            'first-contentful-paint': { displayValue: '1.2 s' },
            'speed-index': { displayValue: '2.3 s' },
            'interactive': { displayValue: '3.4 s' },
            'first-meaningful-paint': { displayValue: '1.5 s' }
          }
        }
      };
      
      // 実行
      const result = psi.convertWebPageResponseToResult(mockResponse);
      
      // 検証
      expect(result.pwaScore).toBe('');
    });
  });

  describe('runTest', () => {
    test('正常なAPIレスポンスを処理する', () => {
      // 準備
      const psi = new PageSpeedInsightV5('test-api-key');
      const url = 'https://example.com';
      
      const mockApiResponse = {
        lighthouseResult: {
          categories: {
            accessibility: { score: 0.95 },
            'best-practices': { score: 0.87 },
            performance: { score: 0.76 },
            pwa: { score: 0.65 },
            seo: { score: 0.98 }
          },
          audits: {
            'first-contentful-paint': { displayValue: '1.2 s' },
            'speed-index': { displayValue: '2.3 s' },
            'interactive': { displayValue: '3.4 s' },
            'first-meaningful-paint': { displayValue: '1.5 s' }
          }
        }
      };
      
      mockFetch.mockReturnValue(mockApiResponse);
      
      // 実行
      const result = psi.runTest(url);
      
      // 検証
      expect(mockGetReferer).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://www.googleapis.com/pagespeedonline/v5/runPagespeed'),
        expect.objectContaining({
          method: 'get',
          headers: { referer: 'https://script.google.com' }
        })
      );
      expect(result.performanceScore).toBe(0.76);
    });

    test('リファラーが存在しない場合も正常に処理する', () => {
      // 準備
      const psi = new PageSpeedInsightV5('test-api-key');
      const url = 'https://example.com';
      
      mockGetReferer.mockReturnValue(null);
      mockFetch.mockReturnValue({
        lighthouseResult: {
          categories: {
            accessibility: { score: 0.9 },
            'best-practices': { score: 0.8 },
            performance: { score: 0.7 },
            pwa: { score: 0.6 },
            seo: { score: 0.95 }
          },
          audits: {
            'first-contentful-paint': { displayValue: '1.0 s' },
            'speed-index': { displayValue: '2.0 s' },
            'interactive': { displayValue: '3.0 s' },
            'first-meaningful-paint': { displayValue: '1.2 s' }
          }
        }
      });
      
      // 実行
      psi.runTest(url);
      
      // 検証
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'get',
          muteHttpExceptions: false
          // headersプロパティがないことを確認
        })
      );
      expect(mockFetch.mock.calls[0][1]).not.toHaveProperty('headers');
    });

    test('APIエラー時に例外が投げられる', () => {
      // 準備
      const psi = new PageSpeedInsightV5('test-api-key');
      const url = 'https://example.com';
      
      const error = new Error('API error');
      mockFetch.mockImplementation(() => {
        throw error;
      });
      
      // 実行と検証
      expect(() => psi.runTest(url)).toThrow('API error');
    });
  });
});
