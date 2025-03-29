// GoogleAppsScriptの型定義
declare namespace GoogleAppsScript {
  namespace Base {
    type Weekday = number;
    
    interface Blob {
      getBytes(): number[];
      getDataAsString(): string;
      getName(): string;
      getContentType(): string;
      setContentType(contentType: string): Blob;
      setName(name: string): Blob;
      copyBlob(): Blob;
    }

    interface Ui {
      showModalDialog(html: HtmlOutput, title: string): void;
    }
  }

  namespace Spreadsheet {
    interface Range {
      setBackground(color: string): Range;
      setValues(values: unknown[][]): Range;
      getValues(): unknown[][];
    }

    interface Sheet {
      getRange(a1Notation: string): Range;
      setName(name: string): Sheet;
      getLastRow(): number;
    }
  }

  namespace URL_Fetch {
    interface URLFetchRequestOptions {
      method?: string;
      headers?: Record<string, string>;
      muteHttpExceptions?: boolean;
      payload?: string | Record<string, unknown>;
      contentType?: string;
      validateHttpsCertificates?: boolean;
      followRedirects?: boolean;
      useIntranet?: boolean;
    }

    interface HTTPResponse {
      getResponseCode(): number;
      getContentText(): string;
      getAllHeaders(): Record<string, string>;
      getHeaders(): Record<string, string>;
      getBlob(): GoogleAppsScript.Base.Blob;
    }
  }

  namespace HTML {
    interface HtmlOutput {
      setWidth(width: number): HtmlOutput;
      setHeight(height: number): HtmlOutput;
    }
  }

  namespace Script {
    interface TriggerBuilder {
      timeBased(): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      create(): Trigger;
    }

    interface TimeBasedTriggerBuilder {
      everyMinutes(minutes: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      everyHours(hours: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      atHour(hour: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      everyDays(days: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      onWeekDay(day: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      onMonthDay(day: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      nearMinute(minute: number): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      inTimezone(timezone: string): GoogleAppsScript.Script.TimeBasedTriggerBuilder;
      create(): GoogleAppsScript.Script.Trigger;
    }

    interface Trigger {
      getUniqueId(): string;
      getHandlerFunction(): string;
    }
  }
}

// グローバルGASオブジェクト定義
declare const Logger: {
  log: (message: string, ...args: unknown[]) => void;
};

declare const UrlFetchApp: {
  fetch: (url: string, options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions) => GoogleAppsScript.URL_Fetch.HTTPResponse;
};

declare const PropertiesService: {
  getScriptProperties: () => {
    getProperty: (key: string) => string | null;
    setProperty: (key: string, value: string) => void;
    deleteProperty: (key: string) => void;
  };
};

declare const SpreadsheetApp: {
  getActiveSpreadsheet: () => {
    getSheetByName: (name: string) => GoogleAppsScript.Spreadsheet.Sheet | null;
    // オーバーロードシグネチャを宣言
    insertSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet;
    insertSheet(): GoogleAppsScript.Spreadsheet.Sheet;
    addMenu: (name: string, menu: Array<{name: string; functionName: string}>) => void;
  };
  getUi: () => GoogleAppsScript.Base.Ui;
};

declare const HtmlService: {
  createHtmlOutputFromFile: (filename: string) => GoogleAppsScript.HTML.HtmlOutput;
};

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

declare const ScriptApp: {
  newTrigger: (functionName: string) => GoogleAppsScript.Script.TriggerBuilder;
  getProjectTriggers: () => GoogleAppsScript.Script.Trigger[];
  deleteTrigger: (trigger: GoogleAppsScript.Script.Trigger) => void;
  WeekDay: WeekDayEnum;
};

declare const Session: {
  getTimeZone: () => string;
};

declare interface HtmlOutput {
  setWidth(width: number): HtmlOutput;
  setHeight(height: number): HtmlOutput;
}