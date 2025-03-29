const KEY = 'trigger';
const FUNCTION_NAME = 'runPageSpeedTest';

// WeekDayの型を明示的に定義
interface WeekDayEnum {
  MONDAY: number;
  TUESDAY: number;
  WEDNESDAY: number;
  THURSDAY: number;
  FRIDAY: number;
  SATURDAY: number;
  SUNDAY: number;
}

// ScriptAppの型定義
declare const ScriptApp: {
  newTrigger: (functionName: string) => GoogleAppsScript.Script.TriggerBuilder;
  getProjectTriggers: () => GoogleAppsScript.Script.Trigger[];
  deleteTrigger: (trigger: GoogleAppsScript.Script.Trigger) => void;
  WeekDay: WeekDayEnum;
};

declare const Session: {
  getTimeZone: () => string;
};

// 型安全な WeekDay 配列の定義
const weekDay: number[] = [
  ScriptApp.WeekDay.MONDAY,
  ScriptApp.WeekDay.TUESDAY,
  ScriptApp.WeekDay.WEDNESDAY,
  ScriptApp.WeekDay.THURSDAY,
  ScriptApp.WeekDay.FRIDAY,
  ScriptApp.WeekDay.SATURDAY,
  ScriptApp.WeekDay.SUNDAY,
];

type FormData = {
  automate: number;
  interval: number;
  hourOfDay: number;
  dayOfWeek: number;
  dayOfMonth: number;
  minitueOfHour: number;
};

type FormElement = {
  name: string;
  value: string | number;
};

export const updateSchedule = (formData: FormElement[]): void => {
  const data: FormData = toJson_(formData);
  Logger.log('Form data: %s', JSON.stringify(data)); // 文字列として渡す
  if (data != null) {
    if (data.automate === 0) {
      deleteTrigger_();
    } else if (data.automate === 1) {
      if (data.interval === 0) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyMinutes(data.minitueOfHour)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval === 1) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .everyHours(1)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval === 2) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .atHour(data.hourOfDay)
          .everyDays(1)
          .inTimezone(Session.getTimeZone())
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval === 3) {
        deleteTrigger_();
        // WeekDayの型安全な使用
        const weekDayValue = weekDay[data.dayOfWeek];
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onWeekDay(weekDayValue)
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else if (data.interval === 4) {
        deleteTrigger_();
        const triggerId = ScriptApp.newTrigger(FUNCTION_NAME)
          .timeBased()
          .onMonthDay(data.dayOfMonth + 1) // 0-based to 1-based
          .atHour(data.hourOfDay)
          .nearMinute(30)
          .create()
          .getUniqueId();
        setTrigger_(triggerId);
      } else {
        throw new Error('Illegal Arguments...');
      }
    }
  }
};

// serializeArrayをjsonに変換する
function toJson_(formData: FormElement[]): FormData {
  const result: Record<string, string | number> = {};
  let automateValue = 0;
  
  formData.forEach(function (elem: FormElement) {
    if (elem.name === 'automate' && elem.value === 1) {
      automateValue = 1;
    }
    result[elem.name] = elem.value;
  });
  result.automate = automateValue;

  const data: FormData = {
    automate: Number(result.automate) || 0,
    interval: Number(result.interval) || 0,
    hourOfDay: Number(result.hourOfDay) || 0,
    dayOfWeek: Number(result.dayOfWeek) || 0,
    dayOfMonth: Number(result.dayOfMonth) || 0,
    minitueOfHour: Number(result.minitueOfHour) || 1,
  };
  return data;
}

// 指定したkeyに保存されているトリガーIDを使って、トリガーを削除する
function deleteTrigger_(): void {
  const triggerId = PropertiesService.getScriptProperties().getProperty(KEY);
  if (!triggerId) return;
  
  // 型安全なトリガー操作
  const triggers = ScriptApp.getProjectTriggers();
  
  // 型安全な方法でトリガーの削除を実装
  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i];
    if (trigger.getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
  
  PropertiesService.getScriptProperties().deleteProperty(KEY);
}

// トリガーを発行
function setTrigger_(triggerId: string): void {
  // あとでトリガーを削除するためにトリガーIDを保存しておく
  PropertiesService.getScriptProperties().setProperty(KEY, triggerId);
}
