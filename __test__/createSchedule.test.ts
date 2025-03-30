import { createSchedule } from '../src/createSchedule';

// GASのグローバルオブジェクトをモック化
const mockHtmlOutput = {
  setWidth: jest.fn().mockReturnThis(),
  setHeight: jest.fn().mockReturnThis()
};

const mockUi = {
  showModalDialog: jest.fn()
};

// グローバル変数として直接モック化
global.HtmlService = {
  createHtmlOutputFromFile: jest.fn().mockReturnValue(mockHtmlOutput)
} as any;

global.SpreadsheetApp = {
  getUi: jest.fn().mockReturnValue(mockUi)
} as any;

describe('createSchedule', () => {
  beforeEach(() => {
    // テスト前にモックをリセット
    jest.clearAllMocks();
  });

  test('正しいHTMLファイルでモーダルダイアログを表示すること', () => {
    // 関数実行
    createSchedule();
    
    // HtmlServiceが正しいファイル名で呼び出されたか検証
    expect(HtmlService.createHtmlOutputFromFile).toHaveBeenCalledWith('updateSchedule');
    
    // 幅と高さが正しく設定されたか検証
    expect(mockHtmlOutput.setWidth).toHaveBeenCalledWith(600);
    expect(mockHtmlOutput.setHeight).toHaveBeenCalledWith(100);
    
    // UIでモーダルダイアログが表示されたか検証
    expect(SpreadsheetApp.getUi).toHaveBeenCalled();
    expect(mockUi.showModalDialog).toHaveBeenCalledWith(mockHtmlOutput, 'Create schedule');
  });
});
