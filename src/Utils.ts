// グローバルオブジェクトの型定義を追加
declare const Logger: {
  log: (message: string, ...args: unknown[]) => void;
};

declare const UrlFetchApp: {
  fetch: (url: string, options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions) => GoogleAppsScript.URL_Fetch.HTTPResponse;
};

declare const PropertiesService: {
  getScriptProperties: () => {
    getProperty: (key: string) => string | null;
    setProperty: (key: string, value: string) => void;
    deleteProperty: (key: string) => void;
  };
};

declare const SpreadsheetApp: {
  getActiveSpreadsheet: () => {
    getSheetByName: (name: string) => GoogleAppsScript.Spreadsheet.Sheet | null;
    insertSheet: () => GoogleAppsScript.Spreadsheet.Sheet;
    addMenu: (name: string, menu: Array<{name: string; functionName: string}>) => void;
  };
  getUi: () => GoogleAppsScript.Base.Ui;
};

export default class Utils {
  /**
   * JSONをパースして型安全に返す
   * @param json パースするJSON文字列
   * @returns パースされたオブジェクト
   */
  public static parseJSON<T>(json: string): T {
    try {
      // 段階的に型を変換して型安全性を確保
      const jsonObject = JSON.parse(json) as unknown;
      
      // パースされたJSONをunknown型として扱い、明示的に型変換
      return jsonObject as T;
    } catch (error) {
      Logger.log('Failed to parse JSON: %s', error);
      throw new Error('JSON parse error: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * API呼び出しを行い、JSONレスポンスを返す
   * @param url API URL
   * @param options リクエストオプション
   * @returns 解析済みのJSONレスポンス
   */
  public static fetch<T>(url: string, options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): T {
    try {
      Logger.log('Fetching URL: %s', url);
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      Logger.log('Response code: %d', responseCode);
      
      if (responseCode >= 200 && responseCode < 300) {
        const content = response.getContentText();
        try {
          // コンテンツを一旦unknown型として安全にパース
          const parsedContent = this.parseJSON<unknown>(content);
          // 呼び出し元で適切な型チェックを行うよう、明示的に型変換を行う
          return parsedContent as T;
        } catch (parseError) {
          Logger.log('Failed to parse JSON response: %s', parseError);
          Logger.log('Response content (first 500 chars): %s', content.substring(0, 500));
          throw new Error('Failed to parse API response: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
        }
      } else {
        Logger.log('API returned error status: %d', responseCode);
        Logger.log('Response content: %s', response.getContentText());
        throw new Error('API request failed with status: ' + responseCode);
      }
    } catch (error) {
      Logger.log('Fetch error: %s', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * リファラー値を取得する
   * @returns リファラー値
   */
  public static getReferer(): string | null {
    return PropertiesService.getScriptProperties().getProperty('REFERER');
  }

  /**
   * API Keyを取得する
   * @returns API Key
   */
  public static getApiKey(): string | null {
    return PropertiesService.getScriptProperties().getProperty('PSI_API_KEY');
  }
  
  /**
   * 指定シートの特定列から値を取得する
   * @param sheetName シート名
   * @param columnName 列名
   * @param startIndex 開始インデックス
   * @returns 取得した値の配列
   */
  public static getColumValues(sheetName: string, columnName: string, startIndex: number): string[][] {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet not found: ${sheetName}`);
    }
    const values = sheet.getRange(columnName + ':' + columnName).getValues();
    const result: string[][] = [];
    for (let i = 0; i < values.length; i++) {
      if (i >= startIndex) {
        if (values[i][0] != null && values[i][0] !== '') {
          result.push(values[i] as string[]);
        }
      }
    }
    return result;
  }
  
  /**
   * 表示用の値を数値に変換する
   * @param displayValue 表示用の値
   * @returns 変換後の数値
   */
  public static convertDisplayValueToNumber(displayValue: string): number {
    if (displayValue) {
      return parseFloat(
        displayValue
          .replace('秒', '')
          .replace('ミリ', '')
          .replace(' ', '')
          .replace('ms', '')
          .replace('s', '')
      );
    }
    return 0;
  }
}
