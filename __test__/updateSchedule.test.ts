// GASオブジェクトのモック（インポート前に必ず配置）
const mockDeleteProperty = jest.fn();
const mockGetProperty = jest.fn();
const mockSetProperty = jest.fn();
const mockGetScriptProperties = jest.fn().mockReturnValue({
  getProperty: mockGetProperty,
  setProperty: mockSetProperty,
  deleteProperty: mockDeleteProperty
});

const mockWeekDay = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY'
};

const mockCreateTrigger = jest.fn().mockReturnValue({ getUniqueId: () => 'test-trigger-id' });
const mockTimeBasedTrigger = {
  everyMinutes: jest.fn().mockReturnThis(),
  everyHours: jest.fn().mockReturnThis(),
  everyDays: jest.fn().mockReturnThis(),
  atHour: jest.fn().mockReturnThis(),
  nearMinute: jest.fn().mockReturnThis(),
  inTimezone: jest.fn().mockReturnThis(),
  onWeekDay: jest.fn().mockReturnThis(),
  onMonthDay: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnValue({ getUniqueId: () => 'test-trigger-id' })
};
const mockNewTrigger = jest.fn().mockReturnValue({
  timeBased: jest.fn().mockReturnValue(mockTimeBasedTrigger)
});

const mockDeleteTrigger = jest.fn();
const mockGetTriggers = jest.fn().mockReturnValue([
  { getUniqueId: () => 'test-trigger-id' }
]);

global.ScriptApp = {
  newTrigger: mockNewTrigger,
  WeekDay: mockWeekDay,
  getProjectTriggers: mockGetTriggers,
  deleteTrigger: mockDeleteTrigger
} as any;

global.PropertiesService = {
  getScriptProperties: mockGetScriptProperties
} as any;

global.Session = {
  getTimeZone: jest.fn().mockReturnValue('Asia/Tokyo')
} as any;

global.Logger = {
  log: jest.fn()
} as any;

// モジュールをインポート（モック定義の後に配置）
import { updateSchedule } from '../src/updateSchedule';

describe('updateSchedule', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
  });

  // フォームデータの形式変換のテスト
  test('フォームデータを正しく変換して処理すること', () => {
    // 自動化無効のケース
    const formData = [
      { name: 'automate', value: 0 },
      { name: 'interval', value: 2 },
      { name: 'hourOfDay', value: 9 },
      { name: 'dayOfWeek', value: 1 },
      { name: 'dayOfMonth', value: 15 },
      { name: 'minitueOfHour', value: 30 }
    ];

    updateSchedule(formData);
    
    // 自動化が0の場合、トリガー削除だけが呼ばれる
    expect(mockGetProperty).toHaveBeenCalledWith('trigger');
    expect(mockNewTrigger).not.toHaveBeenCalled();
  });

  // 自動化有効ケースのテスト
  describe('自動化有効の場合', () => {
    test('分間隔でトリガーを設定すること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 0 },
        { name: 'minitueOfHour', value: 10 }
      ];

      updateSchedule(formData);
      
      expect(mockNewTrigger).toHaveBeenCalledWith('runPageSpeedTest');
      expect(mockTimeBasedTrigger.everyMinutes).toHaveBeenCalledWith(10);
      expect(mockSetProperty).toHaveBeenCalledWith('trigger', 'test-trigger-id');
    });

    test('時間間隔でトリガーを設定すること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 1 }
      ];

      updateSchedule(formData);
      
      expect(mockNewTrigger).toHaveBeenCalledWith('runPageSpeedTest');
      expect(mockTimeBasedTrigger.everyHours).toHaveBeenCalledWith(1);
      expect(mockSetProperty).toHaveBeenCalledWith('trigger', 'test-trigger-id');
    });

    test('毎日実行のトリガーを設定すること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 2 },
        { name: 'hourOfDay', value: 15 }
      ];

      updateSchedule(formData);
      
      expect(mockNewTrigger).toHaveBeenCalledWith('runPageSpeedTest');
      expect(mockTimeBasedTrigger.atHour).toHaveBeenCalledWith(15);
      expect(mockTimeBasedTrigger.everyDays).toHaveBeenCalledWith(1);
      expect(mockTimeBasedTrigger.inTimezone).toHaveBeenCalledWith('Asia/Tokyo');
      expect(mockSetProperty).toHaveBeenCalledWith('trigger', 'test-trigger-id');
    });

    test('毎週実行のトリガーを設定すること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 3 },
        { name: 'hourOfDay', value: 9 },
        { name: 'dayOfWeek', value: 1 }
      ];

      updateSchedule(formData);
      
      expect(mockNewTrigger).toHaveBeenCalledWith('runPageSpeedTest');
      expect(mockTimeBasedTrigger.onWeekDay).toHaveBeenCalledWith('TUESDAY'); // dayOfWeek=1 は火曜日
      expect(mockTimeBasedTrigger.atHour).toHaveBeenCalledWith(9);
      expect(mockTimeBasedTrigger.nearMinute).toHaveBeenCalledWith(30);
      expect(mockSetProperty).toHaveBeenCalledWith('trigger', 'test-trigger-id');
    });

    test('毎月実行のトリガーを設定すること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 4 },
        { name: 'hourOfDay', value: 12 },
        { name: 'dayOfMonth', value: 15 }
      ];

      updateSchedule(formData);
      
      expect(mockNewTrigger).toHaveBeenCalledWith('runPageSpeedTest');
      expect(mockTimeBasedTrigger.onMonthDay).toHaveBeenCalledWith(15);
      expect(mockTimeBasedTrigger.atHour).toHaveBeenCalledWith(12);
      expect(mockTimeBasedTrigger.nearMinute).toHaveBeenCalledWith(30);
      expect(mockSetProperty).toHaveBeenCalledWith('trigger', 'test-trigger-id');
    });

    test('不正な間隔値の場合エラーをスローすること', () => {
      const formData = [
        { name: 'automate', value: 1 },
        { name: 'interval', value: 99 }
      ];

      expect(() => updateSchedule(formData)).toThrow('Illegal Argments...');
    });
  });

  // トリガー削除のテスト
  describe('トリガー削除処理', () => {
    test('既存のトリガーが存在する場合に削除されること', () => {
      // トリガーIDが存在する場合
      mockGetProperty.mockReturnValueOnce('test-trigger-id');
      
      const formData = [
        { name: 'automate', value: 0 }
      ];

      updateSchedule(formData);
      
      expect(mockGetProperty).toHaveBeenCalledWith('trigger');
      expect(mockGetTriggers).toHaveBeenCalled();
      expect(mockDeleteTrigger).toHaveBeenCalled();
      expect(mockDeleteProperty).toHaveBeenCalledWith('trigger');
    });

    test('既存のトリガーが存在しない場合は何もしないこと', () => {
      // トリガーIDが存在しない場合
      mockGetProperty.mockReturnValueOnce(null);
      
      const formData = [
        { name: 'automate', value: 0 }
      ];

      updateSchedule(formData);
      
      expect(mockGetProperty).toHaveBeenCalledWith('trigger');
      expect(mockGetTriggers).not.toHaveBeenCalled();
      expect(mockDeleteTrigger).not.toHaveBeenCalled();
      expect(mockDeleteProperty).not.toHaveBeenCalled();
    });
  });
});
