import * as createConfigSheetModule from '../src/createConfigSheet';

// 変数を先に宣言
let mockSheet: any;
let mockSpreadsheet: any;
let mockRange: any;

// グローバルオブジェクトの型定義 - 変更
declare global {
  // NodeJSのグローバル型を拡張
  namespace NodeJS {
    interface Global {
      SpreadsheetApp: typeof SpreadsheetApp;
      Logger: typeof Logger;
    }
  }
}

// 内部ヘルパー関数をスパイする
jest.spyOn(global, 'Function').mockImplementation((code: string) => {
  // createNewConfigSheetとsetupConfigHeaderをモックするためのハック
  if (code.includes('createNewConfigSheet')) {
    return function(ss: any) { return mockSheet; };
  }
  if (code.includes('setupConfigHeader')) {
    return function(sheet: any) {};
  }
  return Function.prototype;
});

describe('createConfigSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // モックの設定
    mockRange = {
      setBackground: jest.fn(),
      setValues: jest.fn()
    };
    
    mockSheet = {
      setName: jest.fn().mockReturnThis(),
      getRange: jest.fn().mockReturnValue(mockRange)
    };
    
    mockSpreadsheet = {
      getSheetByName: jest.fn(),
      insertSheet: jest.fn().mockReturnValue(mockSheet)
    };
    
    // グローバル変数として直接設定
    (global as any).SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet)
    };
    
    (global as any).Logger = {
      log: jest.fn()
    };
  });
    
  // 内部ヘルパー関数をスパイする
  jest.spyOn(global, 'Function').mockImplementation((code: string) => {
    // createNewConfigSheetとsetupConfigHeaderをモックするためのハック
    if (code.includes('createNewConfigSheet')) {
      return function(ss: any) { return mockSheet; };
    }
    if (code.includes('setupConfigHeader')) {
      return function(sheet: any) {};
    }
    return Function.prototype;
  });
  
  describe('createConfigSheet', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      
      // モックの設定
      mockRange = {
        setBackground: jest.fn(),
        setValues: jest.fn()
      };
      
      mockSheet = {
        setName: jest.fn().mockReturnThis(),
        getRange: jest.fn().mockReturnValue(mockRange)
      };
      
      mockSpreadsheet = {
        getSheetByName: jest.fn(),
        insertSheet: jest.fn().mockReturnValue(mockSheet)
      };
      
      // グローバル変数として直接設定
      (global as any).SpreadsheetApp = {
        getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet)
      };
      
      (global as any).Logger = {
        log: jest.fn()
      };
    });
        
    it('configシートを作成した場合、ヘッダー行の背景色が黄色に設定される', () => {
      // configシートがない場合を模擬
      (mockSpreadsheet.getSheetByName as jest.Mock).mockReturnValue(null);
      
      createConfigSheetModule.createConfigSheet();
      
      // ヘッダー行の範囲が取得されたか確認
      expect(mockSheet.getRange).toHaveBeenCalledWith('A1:B1');
      
      // 背景色が黄色に設定されたか確認
      expect(mockRange.setBackground).toHaveBeenCalledWith('yellow');
    });
  
    it('configシートを作成した場合、ヘッダーの内容が正しく設定される', () => {
      // configシートがない場合を模擬
      (mockSpreadsheet.getSheetByName as jest.Mock).mockReturnValue(null);
      
      createConfigSheetModule.createConfigSheet();
      
      // ヘッダーの内容が正しく設定されたか確認
      expect(mockRange.setValues).toHaveBeenCalledWith([['Urls', 'SheetName']]);
    });
  
    it('ログメッセージが正しく出力される', () => {
      // configシートがない場合を模擬
      (mockSpreadsheet.getSheetByName as jest.Mock).mockReturnValue(null);
      
      createConfigSheetModule.createConfigSheet();
      
      // ログが正しく出力されたか確認
      expect(Logger.log).toHaveBeenCalledWith('createConfigSheet start');
      expect(Logger.log).toHaveBeenCalledWith('createConfigSheet end');
    });
  });
});
