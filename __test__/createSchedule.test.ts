import { setupAllGasMocks } from './helpers/gasMocks';
import { createSchedule } from '../src/createSchedule';

// GASオブジェクトのモックを設定
const mocks = setupAllGasMocks();

describe('createSchedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ダイアログを表示すること', () => {
    // UIモックを準備する
    (global as any).SpreadsheetApp.getUi = jest.fn().mockReturnValue({
      showModalDialog: jest.fn()
    });
    
    // テンプレートの代わりにHTMLモックを作成
    const mockHtmlOutput = {
      setWidth: jest.fn().mockReturnThis(),
      setHeight: jest.fn().mockReturnThis(),
    };
    
    // createHtmlOutputFromFileメソッドをモック化（実際のコードが使用しているメソッド名に合わせる）
    (global as any).HtmlService.createHtmlOutputFromFile = jest.fn().mockReturnValue(mockHtmlOutput);
    
    // 関数を実行
    createSchedule();
    
    // HtmlServiceが使用されたことを確認
    expect(HtmlService.createHtmlOutputFromFile).toHaveBeenCalledWith('updateSchedule');
    expect(mockHtmlOutput.setWidth).toHaveBeenCalledWith(600);
    expect(mockHtmlOutput.setHeight).toHaveBeenCalledWith(100);
    
    // UIダイアログが表示されたことを確認
    expect(SpreadsheetApp.getUi).toHaveBeenCalled();
    expect(SpreadsheetApp.getUi().showModalDialog).toHaveBeenCalledWith(
      mockHtmlOutput,
      'Create schedule'
    );
  });
});
