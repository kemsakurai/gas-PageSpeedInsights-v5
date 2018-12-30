import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { runPageSpeedTest } from './runPageSpeedTest';
import { createConfigSheet } from './createConfigSheet';
import { createRecordingSheet } from './createRecordingSheet';

function onOpen() {
  const menu = [
    { name: 'Create config sheet', functionName: 'createConfigSheet' },
    { name: 'Create recording sheet', functionName: 'createRecordingSheet' },
    { name: 'Run test', functionName: 'runPageSpeedTest' },
    { name: 'Schedule', functionName: 'createSchedule' }
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('gas-PageSpeedInsights-v5', menu);
}

declare let global: any;
global.onOpen = onOpen;
global.createConfigSheet = createConfigSheet;
global.createRecordingSheet = createRecordingSheet;
global.runPageSpeedTest = runPageSpeedTest;
global.createSchedule = createSchedule;
global.createConfigSheet = createConfigSheet;
global.updateSchedule = updateSchedule;
