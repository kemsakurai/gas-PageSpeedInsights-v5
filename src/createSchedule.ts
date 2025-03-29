export const createSchedule = (): void => {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('updateSchedule')
    .setWidth(600)
    .setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Create schedule');
};
