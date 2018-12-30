export default class Utils {
  public static fetch(url: string, requestOptions: any) {
    const response = UrlFetchApp.fetch(url, requestOptions);
    return JSON.parse(response.getContentText());
  }

  public static getReferer() {
    return PropertiesService.getScriptProperties().getProperty('REFERER');
  }

  public static getApiKey() {
    return PropertiesService.getScriptProperties().getProperty('PSI_API_KEY');
  }
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
