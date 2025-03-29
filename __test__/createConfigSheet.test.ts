import { createConfigSheet } from '../src/createConfigSheet'; // ファイルパスは実際の構造に合わせて調整

// Google Apps Script環境のモック設定
const mockSheet = {
  getRange: jest.fn().mockReturnThis(),
  setValues: jest.fn(),
  setFontWeight: jest.fn(),
  setBackground: jest.fn(),
  setName: jest.fn() // setNameメソッドを追加
};

const mockSpreadsheet = {
  getSheetByName: jest.fn(),
  insertSheet: jest.fn().mockReturnValue(mockSheet)
};

(global as any).SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet)
};

// Loggerのモックを追加
(global as any).Logger = {
  log: jest.fn()
};

describe('createConfigSheet', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  test('設定シートが存在しない場合、新しく作成されること', () => {
    // 設定シートが存在しないケースをシミュレート
    mockSpreadsheet.getSheetByName.mockReturnValue(null);
    
    // 関数実行
    createConfigSheet();
    
    // 検証
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledWith('config'); // 'Config'ではなく'config'に修正（大文字小文字の違い）
    expect(mockSpreadsheet.insertSheet).toHaveBeenCalled();
    expect(mockSheet.setName).toHaveBeenCalledWith('config'); // setNameの呼び出しを検証
  });

  test('設定シートが既に存在する場合、何もしないこと', () => {
    // 設定シートが既に存在するケースをシミュレート
    mockSpreadsheet.getSheetByName.mockReturnValue(mockSheet);
    
    // 関数実行
    createConfigSheet();
    
    // 検証
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledWith('config'); // 'Config'ではなく'config'に修正（大文字小文字の違い）
    expect(mockSpreadsheet.insertSheet).not.toHaveBeenCalled();
  });
});