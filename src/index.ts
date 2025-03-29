import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { runPageSpeedTest } from './runPageSpeedTest';
import { createConfigSheet } from './createConfigSheet';
import { createRecordingSheet } from './createRecordingSheet';

function onOpen(): void {
  const menu = [
    { name: 'Create config sheet', functionName: 'createConfigSheet' },
    { name: 'Create recording sheet', functionName: 'createRecordingSheet' },
    { name: 'Run test', functionName: 'runPageSpeedTest' },
    { name: 'Schedule', functionName: 'createSchedule' },
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('gas-PageSpeedInsights-v5', menu);
}

// ESLintエラー回避のための修正
interface GlobalThis {
  onOpen: typeof onOpen;
  createConfigSheet: typeof createConfigSheet;
  createRecordingSheet: typeof createRecordingSheet;
  runPageSpeedTest: typeof runPageSpeedTest;
  createSchedule: typeof createSchedule;
  updateSchedule: typeof updateSchedule;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: GlobalThis;

global.onOpen = onOpen;
global.createConfigSheet = createConfigSheet;
global.createRecordingSheet = createRecordingSheet;
global.runPageSpeedTest = runPageSpeedTest;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
