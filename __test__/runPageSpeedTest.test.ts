// 型定義の追加（ファイルの先頭に記述）
declare namespace NodeJS {
  interface Global {
    SpreadsheetApp: any;
    Logger: any;
  }
}

// GASオブジェクトのモック（インポート前に配置）
const mockSheet = {
  getLastRow: jest.fn().mockReturnValue(1),
  getRange: jest.fn().mockReturnValue({
    setValues: jest.fn()
  })
};

const mockSpreadsheet = {
  getSheetByName: jest.fn().mockReturnValue(mockSheet)
};

global.SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet)
} as any;

global.Logger = {
  log: jest.fn()
} as any;

// モジュールをモック化
jest.mock('../src/PageSpeedInsightV5', () => {
  // 各インスタンスごとに独自のモックを作成するファクトリー関数
  let instanceCounter = 0;
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      const mockInstance = {
        runTest: jest.fn().mockImplementation((url, options) => {
          // モバイルかデスクトップかで異なる値を返すようにする
          return {
            accessibilityScore: 90,
            bestPracticesScore: 85,
            performanceScore: options.strategy === 'mobile' ? 75 : 80,
            pwaScore: 50,
            seoScore: 95,
            firstContentfulPaint: 1500,
            speedIndex: 2000,
            interactive: 3500,
            firstMeaningfulPaint: 1800,
            firstCpuIdle: 3000,
            estimatedInputLatency: 100
          };
        })
      };
      instanceCounter++;
      return mockInstance;
    })
  };
});

// 他のモックは変更なし
jest.mock('../src/Utils', () => ({
  __esModule: true,
  default: {
    getApiKey: jest.fn(),
    getColumValues: jest.fn()
  }
}));

// インポート（モック化の後に記述）
import { runPageSpeedTest } from '../src/runPageSpeedTest';
import PageSpeedInsightV5 from '../src/PageSpeedInsightV5';
import Utils from '../src/Utils';

describe('runPageSpeedTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Utilsのデフォルト戻り値を設定
    (Utils.getApiKey as jest.Mock).mockReturnValue('test-api-key');
    (Utils.getColumValues as jest.Mock).mockImplementation((sheetName, column) => {
      if (column === 'A') return ['https://example.com'];
      if (column === 'B') return ['TestSheet'];
      return null;
    });
  });

  test('正常にテストを実行して結果をシートに記録する', () => {
    // 関数実行
    runPageSpeedTest();

    // 検証
    expect(Utils.getApiKey).toHaveBeenCalled();
    expect(Utils.getColumValues).toHaveBeenCalledWith('config', 'A', 1);
    expect(Utils.getColumValues).toHaveBeenCalledWith('config', 'B', 1);
    
    // PageSpeedInsightV5が2回インスタンス化される（mobile, desktop）
    expect(PageSpeedInsightV5).toHaveBeenCalledTimes(2);
    expect(PageSpeedInsightV5).toHaveBeenCalledWith('test-api-key');
    
    // runTestが正しいオプションで呼び出されることを確認
    const mobileInstance = (PageSpeedInsightV5 as jest.Mock).mock.results[0].value;
    const desktopInstance = (PageSpeedInsightV5 as jest.Mock).mock.results[1].value;
    
    expect(mobileInstance.runTest).toHaveBeenCalledWith('https://example.com', { strategy: 'mobile' });
    expect(desktopInstance.runTest).toHaveBeenCalledWith('https://example.com', { strategy: 'desktop' });
    
    // スプレッドシートの操作確認
    expect(SpreadsheetApp.getActiveSpreadsheet).toHaveBeenCalled();
    expect(mockSpreadsheet.getSheetByName).toHaveBeenCalledWith('TestSheet');
    expect(mockSheet.getLastRow).toHaveBeenCalled();
    expect(mockSheet.getRange).toHaveBeenCalledWith('A2:W2');
    expect(mockSheet.getRange().setValues).toHaveBeenCalledTimes(1);
  });

  // 他のテストケースは変更なし
  test('APIキーが定義されていない場合はエラーをスローする', () => {
    (Utils.getApiKey as jest.Mock).mockReturnValue(null);
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('should define PSI_API_KEY in ScriptProperties');
  });

  test('URLが定義されていない場合はエラーをスローする', () => {
    (Utils.getColumValues as jest.Mock).mockImplementation((sheetName, column) => {
      if (column === 'A') return null;
      if (column === 'B') return ['TestSheet'];
      return null;
    });
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('should define urls in config sheet');
  });

  test('シート名が定義されていない場合はエラーをスローする', () => {
    (Utils.getColumValues as jest.Mock).mockImplementation((sheetName, column) => {
      if (column === 'A') return ['https://example.com'];
      if (column === 'B') return null;
      return null;
    });
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('should define sheetNames in config sheet');
  });

  test('アクティブなスプレッドシートが存在しない場合はエラーをスローする', () => {
    (SpreadsheetApp.getActiveSpreadsheet as jest.Mock).mockReturnValue(null);
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('Not found active spreadsheet');
  });

  test('指定されたシートが存在しない場合はエラーをスローする', () => {
    // このテストの前に明示的にSpreadsheetAppのモック状態を設定
    (SpreadsheetApp.getActiveSpreadsheet as jest.Mock).mockReturnValue({
      getSheetByName: jest.fn().mockReturnValue(null)
    });
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('Not found sheet by name:TestSheet');
  });

  test('PSIテスト実行中にエラーが発生した場合はエラーをスローする', () => {
    const psiInstance = {
      runTest: jest.fn().mockImplementation(() => {
        throw new Error('API error');
      })
    };
    (PageSpeedInsightV5 as jest.Mock).mockReturnValue(psiInstance);
    
    expect(() => {
      runPageSpeedTest();
    }).toThrow('API error');
  });
});
