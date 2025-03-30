# Google Apps ScriptのJestテストにおける型エラー解消

## 会話の概要

TypeScriptでGAS（Google Apps Script）のテストコードを書く際に発生する型エラーについて議論しました。JestでGASのオブジェクト（ScriptApp, PropertiesService, Session, Loggerなど）をモック化する際に発生する型エラーの解消法を検討し、ファイル内でのグローバル型定義の追加によって問題を解決しました。

## 生成AIのモデル名称

GitHub Copilot

## 履歴

1. **問題提起**: `__test__/updateSchedule.test.ts`で型エラーが発生
   