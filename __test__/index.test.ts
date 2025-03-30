// モジュールをモック化
jest.mock('../src/createConfigSheet', () => ({
  createConfigSheet: jest.fn()
}));
jest.mock('../src/createRecordingSheet', () => ({
  createRecordingSheet: jest.fn()
}));
jest.mock('../src/runPageSpeedTest', () => ({
  runPageSpeedTest: jest.fn()
}));
jest.mock('../src/createSchedule', () => ({
  createSchedule: jest.fn()
}));
jest.mock('../src/updateSchedule', () => ({
  updateSchedule: jest.fn()
}));

// GASオブジェクトを直接モック化
// スパイではなく直接グローバルオブジェクトを設定
const mockSheet = {
  getRange: jest.fn().mockReturnThis(),
  getLastRow: jest.fn().mockReturnValue(10),
  getDataRange: jest.fn().mockReturnThis(),
  getValues: jest.fn().mockReturnValue([]),
  setValues: jest.fn(),
  appendRow: jest.fn(),
  activate: jest.fn(),
  clear: jest.fn(),
  clearContents: jest.fn(),
  getActiveCell: jest.fn().mockReturnThis(),
  getColumn: jest.fn().mockReturnValue(1),
  getRow: jest.fn().mockReturnValue(1),
};

const mockSheets = [mockSheet];

const mockSpreadsheet = {
  getSheetByName: jest.fn().mockReturnValue(mockSheet),
  getActiveSheet: jest.fn().mockReturnValue(mockSheet),
  insertSheet: jest.fn().mockReturnValue(mockSheet),
  getSheets: jest.fn().mockReturnValue(mockSheets),
  addMenu: jest.fn(),
  toast: jest.fn(),
};

// グローバルオブジェクトのモック化
(global as any).SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet),
  getActive: jest.fn().mockReturnValue(mockSpreadsheet),
};

(global as any).HtmlService = {
  createTemplateFromFile: jest.fn().mockReturnValue({
    evaluate: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setWidth: jest.fn().mockReturnThis(),
    setHeight: jest.fn().mockReturnThis(),
  }),
};

(global as any).Utilities = {
  formatDate: jest.fn().mockImplementation(() => '2025-03-30'),
};

(global as any).PropertiesService = {
  getScriptProperties: jest.fn().mockReturnValue({
    getProperties: jest.fn().mockReturnValue({}),
    getProperty: jest.fn().mockReturnValue('mock-api-key'),
  }),
};

(global as any).UrlFetchApp = {
  fetch: jest.fn().mockReturnValue({
    getContentText: jest.fn().mockReturnValue('{}'),
    getResponseCode: jest.fn().mockReturnValue(200),
  }),
};

(global as any).ScriptApp = {
  getProjectTriggers: jest.fn().mockReturnValue([]),
  WeekDay: {
    SUNDAY: 1,
    MONDAY: 2,
    TUESDAY: 3,
    WEDNESDAY: 4,
    THURSDAY: 5,
    FRIDAY: 6,
    SATURDAY: 7
  }
};

(global as any).Logger = {
  log: jest.fn(),
  error: jest.fn(),
};

// テスト対象のインポート（モック設定後に行う）
import '../src/index';

// テスト中で使用するモックオブジェクトをエクスポート
const mocks = { mockSpreadsheet, mockSheet };

describe('index.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('onOpen', () => {
    it('スプレッドシートを開いたときにカスタムメニューが追加されること', () => {
      // グローバルスコープの関数を呼び出す
      (global as any).onOpen();

      // SpreadsheetApp.getActiveSpreadsheet().addMenuが呼ばれたことを確認
      expect(SpreadsheetApp.getActiveSpreadsheet).toHaveBeenCalled();
      expect(mockSpreadsheet.addMenu).toHaveBeenCalledWith(
        'gas-PageSpeedInsights-v5',
        expect.arrayContaining([
          { name: 'Create config sheet', functionName: 'createConfigSheet' },
          { name: 'Create recording sheet', functionName: 'createRecordingSheet' },
          { name: 'Run test', functionName: 'runPageSpeedTest' },
          { name: 'Schedule', functionName: 'createSchedule' }
        ])
      );
    });
  });

  describe('グローバルスコープの関数エクスポート', () => {
    it('必要な関数がグローバルスコープにエクスポートされていること', () => {
      // 各関数がグローバルスコープに存在することを確認
      expect(typeof (global as any).onOpen).toBe('function');
      expect(typeof (global as any).createConfigSheet).toBe('function');
      expect(typeof (global as any).createRecordingSheet).toBe('function');
      expect(typeof (global as any).runPageSpeedTest).toBe('function');
      expect(typeof (global as any).createSchedule).toBe('function');
      expect(typeof (global as any).updateSchedule).toBe('function');
    });
  });
});
