// トリガーを識別するためのキー
const KEY = 'trigger';
// 実行する関数名
const FUNCTION_NAME = 'runPageSpeedTest';

// 曜日の定義
const weekDay = [
  ScriptApp.WeekDay.MONDAY,
  ScriptApp.WeekDay.TUESDAY,
  ScriptApp.WeekDay.WEDNESDAY,
  ScriptApp.WeekDay.THURSDAY,
  ScriptApp.WeekDay.FRIDAY,
  ScriptApp.WeekDay.SATURDAY,
  ScriptApp.WeekDay.SUNDAY
];

/**
 * フォームから送信されるデータの型定義
 */
type FormData = {
  automate: number; // 自動化するかどうか (0: 無効, 1: 有効)
  interval: number; // 実行間隔 (0: 分ごと, 1: 時間ごと, 2: 毎日, 3: 毎週, 4: 毎月)
  hourOfDay: number; // 実行する時間
  dayOfWeek: number; // 実行する曜日 (0: 月曜日〜6: 日曜日)
  dayOfMonth: number; // 実行する日付 (0: 1日〜30: 31日)
  minitueOfHour: number; // 実行する分間隔
};

/**
 * スケジュールを更新する関数
 * フォームから送信されたデータに基づいてトリガーを設定
 * @param formData フォームデータ
 */
export const updateSchedule = (formData: any): void => {
  const data: FormData = toJson_(formData);
  Logger.log(data);
  if (data != null) {
    if (data.automate == 0) {
      // 自動化無効の場合、トリガーを削除
      deleteTrigger_();
    } else if (data.automate == 1) {
      if (data.interval == 0) {
        // 分ごとの実行
        deleteTrigger_();
        let triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyMinutes(data.minitueOfHour)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 1) {
        // 1時間ごとの実行
        deleteTrigger_();
        let triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyHours(1)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 2) {
        // 毎日実行
        deleteTrigger_();
        let triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .atHour(data.hourOfDay)
          .everyDays(1)
          .inTimezone(Session.getTimeZone())
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 3) {
        // 毎週実行
        deleteTrigger_();
        let triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onWeekDay(weekDay[data.dayOfWeek])
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval == 4) {
        // 毎月実行
        deleteTrigger_();
        var triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onMonthDay(data.dayOfMonth)
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else {
        throw new Error('Illegal Argments...');
      }
    }
  }
};

/**
 * serializeArrayをjsonに変換する
 * @param formData フォームから送信されたデータ
 * @returns 整形されたFormDataオブジェクト
 */
function toJson_(formData): FormData {
  var result = {};
  var automateValue = 0;
  formData.forEach(function(elem, i) {
    if (elem['name'] == 'automate' && elem['value'] == 1) {
      automateValue = 1;
    }
    result[elem.name] = elem.value;
  });
  result['automate'] = automateValue;

  const data: FormData = {
    automate: result['automate'],
    interval: result['interval'],
    hourOfDay: result['hourOfDay'],
    dayOfWeek: result['dayOfWeek'],
    dayOfMonth: result['dayOfMonth'],
    minitueOfHour: result['minitueOfHour']
  };
  return data;
}

/**
 * 指定したkeyに保存されているトリガーIDを使って、トリガーを削除する
 */
function deleteTrigger_() {
  var triggerId = PropertiesService.getScriptProperties().getProperty(KEY);
  if (!triggerId) return;
  ScriptApp.getProjectTriggers()
    .filter(function(trigger) {
      return trigger.getUniqueId() == triggerId;
    })
    .forEach(function(trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
  PropertiesService.getScriptProperties().deleteProperty(KEY);
}

/**
 * トリガーIDをプロパティに保存
 * @param triggerId トリガーID
 */
function setTrigger_(triggerId) {
  // あとでトリガーを削除するためにトリガーIDを保存しておく
  PropertiesService.getScriptProperties().setProperty(KEY, triggerId);
}
