/**
 * 共通で使用するユーティリティ関数を提供するクラス
 */
export default class Utils {
  /**
   * HTTPリクエストを実行して結果をJSONとして返す
   * @param url リクエスト先URL
   * @param requestOptions リクエストオプション
   * @returns JSONオブジェクト
   */
  public static fetch(url: string, requestOptions: any) {
    const response = UrlFetchApp.fetch(url, requestOptions);
    return JSON.parse(response.getContentText());
  }

  /**
   * リファラー情報を取得
   * @returns リファラー文字列
   */
  public static getReferer() {
    return PropertiesService.getScriptProperties().getProperty('REFERER');
  }

  /**
   * PageSpeed Insights APIキーを取得
   * @returns APIキー
   */
  public static getApiKey() {
    return PropertiesService.getScriptProperties().getProperty('PSI_API_KEY');
  }

  /**
   * 特定シートの特定列の値を取得
   * @param sheetName シート名
   * @param columnName 列名（A,B,Cなど）
   * @param startIndex 開始インデックス（行番号）
   * @returns 列の値の配列
   */
  public static getColumValues(sheetName: string, columnName: string, startIndex: number) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const values = sheet.getRange(columnName + ':' + columnName).getValues();
    let result = new Array();
    for (let i = 0; i < values.length; i++) {
      if (i >= startIndex) {
        if (values[i][0] != null && values[i][0] != '') {
          result.push(values[i]);
        }
      }
    }
    return result;
  }

  /**
   * 表示値から数値に変換
   * 単位（秒、ミリ秒など）を取り除いて数値化
   * @param displayValue 表示値（例: "1.5秒", "500ms"）
   * @returns 数値
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
