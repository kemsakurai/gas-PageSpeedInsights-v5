/**
 * スケジュール設定画面を表示する関数
 * updateSchedule.htmlを使用してモーダルダイアログを表示
 */
export const createSchedule = (): void => {
  let htmlOutput = HtmlService.createHtmlOutputFromFile('updateSchedule')
    .setWidth(600)
    .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Create schedule');
};
