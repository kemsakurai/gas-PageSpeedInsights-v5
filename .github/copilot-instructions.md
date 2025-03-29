# gas-PageSpeedInsights-v5 プロジェクト指示

## プロジェクト概要
このプロジェクトは、Google Apps Script (GAS) を使用して PageSpeed Insights API v5 と連携し、ウェブサイトのパフォーマンス分析を行うためのツールです。TypeScriptで記述され、テスト環境としてJestを採用しています。

## 主要コンポーネント
- **PageSpeedInsightV5.ts**: API連携のコア機能を提供
- **runPageSpeedTest.ts**: テスト実行とデータ処理を担当
- **updateSchedule.ts**: スケジュール管理機能
- **Utils.ts**: 共通ユーティリティ関数

## コーディング規約

### TypeScript
- 厳格な型チェックを使用する (`strict: true`)
- 不明確な型は `any` ではなく `unknown` を使う
- オブジェクトには明示的なインターフェースまたは型を定義する
- 型アサーションは必要な場合のみ使用し、可能な限り変数を介した明示的な型指定を優先

### Google Apps Script
- GAS APIのモックには `as unknown as` パターンを使用
- SpreadsheetAppなどのGAS APIを直接参照する代わりに抽象化レイヤーを検討

## テスト戦略
- Jestをテストフレームワークとして使用
- テストファイルは `test/` ディレクトリに配置し、`.test.ts` 拡張子を使用
- GAS APIのモックを作成して単体テストを実施
- 異なるシナリオ（エラーケース、境界値など）を考慮したテストケース作成
- describe/it/expectパターンに従ってテストを構造化

## 既知の課題と解決策

### 型エラーの解決
- `undefined` が許容される数値フィールドには `number | undefined` 型を使用
- オブジェクト引数には明示的な型を付与し、必要に応じて型アサーションを使用
- 複雑な型エラーには変数を介した明示的な型指定が効果的

### テスト環境の設定
- Jest設定ファイル (`jest.config.js`) では適切な `testMatch` パターンを設定
- TypeScriptのテストには `ts-jest` プリセットを使用
- package.jsonとjest.config.jsの設定の一貫性を確保

## 今後の改善点
1. コード全体のリファクタリングによる型安全性の向上
2. テストカバレッジの拡充（他の関数のテストケース追加）
3. CI/CDパイプラインへのテスト統合
4. E2Eテストの追加検討
5. PageSpeed Insights API v5の最新仕様に合わせた型定義の更新
