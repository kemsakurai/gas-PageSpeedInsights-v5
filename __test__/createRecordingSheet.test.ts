import { createRecordingSheet } from '../src/createRecordingSheet';
import Utils from '../src/Utils';

// Utilsモジュールのモック
jest.mock('../src/Utils', () => ({
  getColumValues: jest.fn()
}));

describe('createRecordingSheet', () => {
  // モック用の変数
  let mockSheet: any;
  let mockSpreadsheet: any;
  let mockRange: any;
  
  beforeEach(() => {
    // テスト実行前にモックをリセット
    jest.clearAllMocks();
    
    // モックの定義
    mockRange = {
      setBackground: jest.fn(),
      setValues: jest.fn()
    };
    
    mockSheet = {
      getRange: jest.fn().mockReturnValue(mockRange),
      setName: jest.fn()
    };
    
    mockSpreadsheet = {
      getSheetByName: jest.fn(),
      insertSheet: jest.fn().mockReturnValue(mockSheet)
    };
    
    // GASのグローバルオブジェクトをモック
    global.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet)
    } as any;
    
    global.Logger = {
      log: jest.fn()
    } as any;
  });
  
  test('既存のシートが存在する場合は新規作成しない', () => {
    // 準備
    const mockSheetNames = ['ExistingSheet'];
    (Utils.getColumValues as jest.Mock).mockReturnValue(mockSheetNames);
    mockSpreadsheet.getSheetByName.mockReturnValue(mockSheet);
    
    // 実行
    createRecordingSheet();
    
    // 検証
    expect(Utils.getColumValues).toHaveBeenCalledWith('config', 'B', 1);
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledWith('ExistingSheet');
    expect(mockSpreadsheet.insertSheet).not.toHaveBeenCalled();
    expect(mockSheet.setName).not.toHaveBeenCalled();
    expect(mockSheet.getRange).not.toHaveBeenCalled();
  });
  
  test('シートが存在しない場合は新規作成してヘッダーを設定する', () => {
    // 準備
    const mockSheetNames = ['NewSheet'];
    (Utils.getColumValues as jest.Mock).mockReturnValue(mockSheetNames);
    mockSpreadsheet.getSheetByName.mockReturnValue(null);
    
    // 実行
    createRecordingSheet();
    
    // 検証
    expect(Utils.getColumValues).toHaveBeenCalledWith('config', 'B', 1);
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledWith('NewSheet');
    expect(mockSpreadsheet.insertSheet).toHaveBeenCalled();
    expect(mockSheet.setName).toHaveBeenCalledWith('NewSheet');
    expect(mockSheet.getRange).toHaveBeenCalledWith('A1:W1');
    expect(mockRange.setBackground).toHaveBeenCalledWith('lightsteelblue');
    
    // ヘッダー設定の検証
    const expectedHeaders = [
      'DATE',
      'MOBILE.accessibilityScore',
      'MOBILE.bestPracticesScore',
      'MOBILE.performanceScore',
      'MOBILE.pwaScore',
      'MOBILE.seoScore',
      'MOBILE.firstContentfulPaint',
      'MOBILE.speedIndex',
      'MOBILE.interactive',
      'MOBILE.firstMeaningfulPaint',
      'MOBILE.firstCpuIdle',
      'MOBILE.estimatedInputLatency',
      'DESKTOP.accessibilityScore',
      'DESKTOP.bestPracticesScore',
      'DESKTOP.performanceScore',
      'DESKTOP.pwaScore',
      'DESKTOP.seoScore',
      'DESKTOP.firstContentfulPaint',
      'DESKTOP.speedIndex',
      'DESKTOP.interactive',
      'DESKTOP.firstMeaningfulPaint',
      'DESKTOP.firstCpuIdle',
      'DESKTOP.estimatedInputLatency'
    ];
    expect(mockRange.setValues).toHaveBeenCalledWith([expectedHeaders]);
  });
  
  test('複数のシート名が設定されている場合、すべてのシートを処理する', () => {
    // 準備
    const mockSheetNames = ['Sheet1', 'Sheet2', 'Sheet3'];
    (Utils.getColumValues as jest.Mock).mockReturnValue(mockSheetNames);
    // Sheet1とSheet3は存在し、Sheet2は存在しない設定
    mockSpreadsheet.getSheetByName
      .mockReturnValueOnce(mockSheet)      // Sheet1は存在
      .mockReturnValueOnce(null)           // Sheet2は存在しない
      .mockReturnValueOnce(mockSheet);     // Sheet3は存在
    
    // 実行
    createRecordingSheet();
    
    // 検証
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledTimes(3);
    expect(mockSpreadsheet.getSheetByName).toHaveBeenNthCalledWith(1, 'Sheet1');
    expect(mockSpreadsheet.getSheetByName).toHaveBeenNthCalledWith(2, 'Sheet2');
    expect(mockSpreadsheet.getSheetByName).toHaveBeenNthCalledWith(3, 'Sheet3');
    
    // Sheet2のみ新規作成される
    expect(mockSpreadsheet.insertSheet).toHaveBeenCalledTimes(1);
    expect(mockSheet.setName).toHaveBeenCalledWith('Sheet2');
  });
  
  test('Loggerが開始と終了時に呼び出される', () => {
    // 準備
    (Utils.getColumValues as jest.Mock).mockReturnValue([]);
    
    // 実行
    createRecordingSheet();
    
    // 検証
    expect(Logger.log).toHaveBeenCalledTimes(2);
    expect(Logger.log).toHaveBeenNthCalledWith(1, 'createRecordingSheet start');
    expect(Logger.log).toHaveBeenNthCalledWith(2, 'createRecordingSheet end');
  });
});
