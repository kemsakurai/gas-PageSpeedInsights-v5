// グローバルオブジェクトの型拡張
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      UrlFetchApp: any;
      PropertiesService: any;
      SpreadsheetApp: any;
    }
  }
}

// モック定義（インポート前に配置）
const mockUrlFetchResponse = {
  getContentText: jest.fn().mockReturnValue('{"key": "value"}')
};

global.UrlFetchApp = {
  fetch: jest.fn().mockReturnValue(mockUrlFetchResponse)
} as any;

global.PropertiesService = {
  getScriptProperties: jest.fn().mockReturnValue({
    getProperty: jest.fn((key) => {
      if (key === 'REFERER') return 'test-referer';
      if (key === 'PSI_API_KEY') return 'test-api-key';
      return null;
    })
  })
} as any;

const mockValues = [
  [''], // 空のヘッダー行
  ['url1'],
  ['url2'],
  ['url3'],
  [''], // 空の行
  ['url4']
];

const mockSheet = {
  getRange: jest.fn().mockReturnValue({
    getValues: jest.fn().mockReturnValue(mockValues)
  })
};

global.SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn().mockReturnValue({
    getSheetByName: jest.fn().mockReturnValue(mockSheet)
  })
} as any;

// インポート
import Utils from '../src/Utils';

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch', () => {
    test('URLとオプションを指定してJSONを取得できること', () => {
      const url = 'https://example.com/api';
      const options = { method: 'GET' };
      
      const result = Utils.fetch(url, options);
      
      expect(UrlFetchApp.fetch).toHaveBeenCalledWith(url, options);
      expect(mockUrlFetchResponse.getContentText).toHaveBeenCalled();
      expect(result).toEqual({ key: 'value' });
    });
  });

  describe('getReferer', () => {
    test('スクリプトプロパティからREFERERを取得できること', () => {
      const result = Utils.getReferer();
      
      expect(PropertiesService.getScriptProperties).toHaveBeenCalled();
      expect(PropertiesService.getScriptProperties().getProperty).toHaveBeenCalledWith('REFERER');
      expect(result).toBe('test-referer');
    });
  });

  describe('getApiKey', () => {
    test('スクリプトプロパティからPSI_API_KEYを取得できること', () => {
      const result = Utils.getApiKey();
      
      expect(PropertiesService.getScriptProperties).toHaveBeenCalled();
      expect(PropertiesService.getScriptProperties().getProperty).toHaveBeenCalledWith('PSI_API_KEY');
      expect(result).toBe('test-api-key');
    });
  });

  describe('getColumValues', () => {
    test('指定したシートの列データを取得できること', () => {
      const result = Utils.getColumValues('TestSheet', 'A', 1);
      
      expect(SpreadsheetApp.getActiveSpreadsheet).toHaveBeenCalled();
      expect(SpreadsheetApp.getActiveSpreadsheet().getSheetByName).toHaveBeenCalledWith('TestSheet');
      expect(mockSheet.getRange).toHaveBeenCalledWith('A:A');
      expect(result).toEqual([['url1'], ['url2'], ['url3'], ['url4']]);
    });

    test('開始インデックスを指定して列データを取得できること', () => {
      const result = Utils.getColumValues('TestSheet', 'A', 3);
      
      expect(result).toEqual([['url3'], ['url4']]);
    });
  });

  describe('convertDisplayValueToNumber', () => {
    test.each([
      ['1.5秒', 1.5],
      ['500ms', 500],
      ['2s', 2],
      ['1.2 s', 1.2],
      ['300ミリ', 300],
      ['', 0],
      [null, 0]
    ])('%sを数値に変換すると%fになること', (input, expected) => {
      const result = Utils.convertDisplayValueToNumber(input as string);
      expect(result).toBe(expected);
    });
  });
});
