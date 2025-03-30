/**
 * GASオブジェクトのモック化ヘルパー
 * 
 * 一貫したモック化方法を提供し、テストコード間での重複を減らします。
 * `as any`を使用して型エラーを回避しつつ、将来的にはより型安全な方法への移行を容易にします。
 */

export const setupSpreadsheetAppMock = () => {
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
  
  const mockUI = {
    showModalDialog: jest.fn(),
    alert: jest.fn(),
    prompt: jest.fn()
  };
  
  const mockSpreadsheet = {
    getSheetByName: jest.fn().mockReturnValue(mockSheet),
    getActiveSheet: jest.fn().mockReturnValue(mockSheet),
    insertSheet: jest.fn().mockReturnValue(mockSheet),
    getSheets: jest.fn().mockReturnValue(mockSheets),
    addMenu: jest.fn(),
    toast: jest.fn(),
  };

  (global as any).SpreadsheetApp = {
    getActiveSpreadsheet: jest.fn().mockReturnValue(mockSpreadsheet),
    getActive: jest.fn().mockReturnValue(mockSpreadsheet),
    getUi: jest.fn().mockReturnValue(mockUI),
  };

  return {
    mockSpreadsheet,
    mockSheet,
    mockUI,
  };
};

export const setupHtmlServiceMock = () => {
  const mockTemplate = {
    evaluate: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setWidth: jest.fn().mockReturnThis(),
    setHeight: jest.fn().mockReturnThis(),
  };

  (global as any).HtmlService = {
    createTemplateFromFile: jest.fn().mockReturnValue(mockTemplate),
    createHtmlOutput: jest.fn().mockReturnValue(mockTemplate),
    createHtmlOutputFromFile: jest.fn().mockReturnValue(mockTemplate),
  };

  return {
    mockTemplate,
  };
};

export const setupUtilitiesMock = () => {
  (global as any).Utilities = {
    formatDate: jest.fn().mockImplementation((date, timezone, format) => '2025-03-30'),
  };
};

export const setupPropertiesServiceMock = () => {
  const mockProperties = {
    getProperties: jest.fn().mockReturnValue({}),
    getProperty: jest.fn().mockImplementation((key) => {
      if (key === 'PSI_API_KEY') return 'mock-api-key';
      return null;
    }),
    setProperty: jest.fn(),
    setProperties: jest.fn(),
    deleteProperty: jest.fn(),
  };

  (global as any).PropertiesService = {
    getScriptProperties: jest.fn().mockReturnValue(mockProperties),
    getUserProperties: jest.fn().mockReturnValue(mockProperties),
  };

  return {
    mockProperties,
  };
};

export const setupUrlFetchAppMock = () => {
  const mockHttpResponse = {
    getContentText: jest.fn().mockReturnValue(JSON.stringify({ 
      lighthouseResult: {
        categories: {
          performance: { score: 0.9 },
          accessibility: { score: 0.85 },
          'best-practices': { score: 0.92 },
          seo: { score: 0.95 }
        },
        audits: {
          'first-contentful-paint': { 
            numericValue: 1200,
            displayValue: '1.2 s'
          },
          'speed-index': {
            numericValue: 1500,
            displayValue: '1.5 s'
          },
          'largest-contentful-paint': {
            numericValue: 2500,
            displayValue: '2.5 s'
          },
          'time-to-interactive': {
            numericValue: 3000,
            displayValue: '3.0 s'
          },
          'total-blocking-time': {
            numericValue: 50,
            displayValue: '50 ms'
          },
          'cumulative-layout-shift': {
            numericValue: 0.05,
            displayValue: '0.05'
          }
        }
      }
    })),
    getResponseCode: jest.fn().mockReturnValue(200),
  };

  (global as any).UrlFetchApp = {
    fetch: jest.fn().mockReturnValue(mockHttpResponse),
  };

  return {
    mockHttpResponse,
  };
};

export const setupScriptAppMock = () => {
  const mockTrigger = {
    getUniqueId: jest.fn().mockReturnValue('trigger123'),
    delete: jest.fn(),
  };

  (global as any).ScriptApp = {
    getProjectTriggers: jest.fn().mockReturnValue([mockTrigger]),
    newTrigger: jest.fn().mockReturnThis(),
    EventType: {
      CLOCK: 'CLOCK',
    },
    TriggerSource: {
      SPREADSHEETS: 'SPREADSHEETS',
    },
    ClockTriggerBuilder: {
      create: jest.fn().mockReturnThis(),
      timeBased: jest.fn().mockReturnThis(),
      everyMinutes: jest.fn().mockReturnValue(mockTrigger),
      everyHours: jest.fn().mockReturnValue(mockTrigger),
      everyDays: jest.fn().mockReturnValue(mockTrigger),
      everyWeeks: jest.fn().mockReturnValue(mockTrigger),
      onMonthDay: jest.fn().mockReturnValue(mockTrigger),
      atHour: jest.fn().mockReturnThis(),
      nearMinute: jest.fn().mockReturnThis(),
    },
    deleteTrigger: jest.fn(),
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

  return {
    mockTrigger,
  };
};

export const setupLoggerMock = () => {
  (global as any).Logger = {
    log: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };
};

export const setupAllGasMocks = () => {
  // モック設定の前に特定のグローバル変数をクリア
  // テスト実行時の他のテストからの影響を避けるため
  (global as any).SpreadsheetApp = undefined;
  (global as any).HtmlService = undefined;
  (global as any).Utilities = undefined;
  (global as any).PropertiesService = undefined;
  (global as any).UrlFetchApp = undefined;
  (global as any).ScriptApp = undefined;
  (global as any).Logger = undefined;

  const spreadsheetMocks = setupSpreadsheetAppMock();
  const htmlMocks = setupHtmlServiceMock();
  setupUtilitiesMock();
  const propertiesMocks = setupPropertiesServiceMock();
  const urlFetchMocks = setupUrlFetchAppMock();
  const scriptMocks = setupScriptAppMock();
  setupLoggerMock();

  return {
    ...spreadsheetMocks,
    ...htmlMocks,
    ...propertiesMocks,
    ...urlFetchMocks,
    ...scriptMocks,
  };
};
