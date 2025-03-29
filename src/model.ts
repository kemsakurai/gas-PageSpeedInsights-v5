/**
 * PageSpeed Insights API v5のレスポンス型定義
 * APIの仕様に合わせて詳細に定義
 */
export interface PageSpeedInsightsResponse {
  captchaResult?: string;
  kind: string;
  id: string;
  loadingExperience?: LoadingExperience;
  originLoadingExperience?: LoadingExperience;
  lighthouseResult: LighthouseResult;
  analysisUTCTimestamp: string;
  version?: {
    major: number;
    minor: number;
  };
}

/**
 * ページの読み込み体験のメトリクス
 */
export interface LoadingExperience {
  id: string;
  metrics: Record<string, Metric>;
  overall_category: string;
  initial_url: string;
}

/**
 * メトリクスの詳細
 */
export interface Metric {
  percentile: number;
  distributions: Array<Distribution>;
  category: string;
}

/**
 * メトリクスの分布
 */
export interface Distribution {
  min: number;
  max?: number;
  proportion: number;
}

/**
 * Lighthouseの結果
 */
export interface LighthouseResult {
  requestedUrl: string;
  finalUrl: string;
  lighthouseVersion: string;
  userAgent: string;
  fetchTime: string;
  environment: LighthouseEnvironment;
  runWarnings: unknown[];
  configSettings: LighthouseConfigSettings;
  audits: Record<string, LighthouseAudit>;
  categories: Record<string, LighthouseCategory>;
  categoryGroups?: Record<string, LighthouseCategoryGroup>;
  timing: {
    total: number;
  };
  i18n: {
    rendererFormattedStrings: Record<string, string>;
  };
}

/**
 * Lighthouse実行環境
 */
export interface LighthouseEnvironment {
  networkUserAgent: string;
  hostUserAgent: string;
  benchmarkIndex: number;
}

/**
 * Lighthouse設定
 */
export interface LighthouseConfigSettings {
  emulatedFormFactor: string;
  formFactor?: string;
  locale: string;
  onlyCategories?: string[];
  channel?: string;
  throttling?: {
    rttMs?: number;
    throughputKbps?: number;
    requestLatencyMs?: number;
    downloadThroughputKbps?: number;
    uploadThroughputKbps?: number;
    cpuSlowdownMultiplier?: number;
  };
  screenEmulation?: {
    width?: number;
    height?: number;
    deviceScaleFactor?: number;
    mobile?: boolean;
    disabled?: boolean;
  };
  skipAudits?: string[];
}

/**
 * Lighthouse監査項目
 */
export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  warnings?: string[];
  explanation?: string;
  errorMessage?: string;
  numericValue?: number;
  numericUnit?: string;
  details?: LighthouseAuditDetails;
}

/**
 * Lighthouse監査詳細
 */
export interface LighthouseAuditDetails {
  type: string;
  headings?: Array<{
    key?: string;
    itemType?: string;
    text?: string;
    label?: string;
    valueType?: string;
    subItemsHeading?: {
      key: string;
      valueType?: string;
    };
    granularity?: number;
  }>;
  items?: unknown[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  summary?: Record<string, unknown>;
  scale?: number;
  p10?: number;
  median?: number;
  p90?: number;
}

/**
 * Lighthouseカテゴリ
 */
export interface LighthouseCategory {
  id: string;
  title: string;
  description?: string;
  score: number | null;
  manualDescription?: string;
  auditRefs: Array<{
    id: string;
    weight: number;
    group?: string;
    acronym?: string;
    relevantAudits?: string[];
  }>;
}

/**
 * Lighthouseカテゴリグループ
 */
export interface LighthouseCategoryGroup {
  title: string;
  description?: string;
}

/**
 * PageSpeedInsight v5の実行オプション
 */
export interface Options {
  strategy?: 'mobile' | 'desktop';
  category?: string[] | string;
  locale?: string;
  utm_source?: string;
  utm_campaign?: string;
  fields?: string[] | string;
  [key: string]: unknown;
}

/**
 * PageSpeedInsight v5の結果を格納する型
 */
export interface PageSpeedInsightV5Result {
  url?: string;
  strategy?: string;
  fetchTime?: string;
  
  // パフォーマンススコア - string型も許可
  performanceScore: number | string | null;
  accessibilityScore: number | string | null;
  bestPracticesScore: number | string | null;
  seoScore: number | string | null;
  // PWAカテゴリーが廃止されても後方互換性のために型を維持
  pwaScore: number | string | null;
  
  // 主要なメトリクス - string型も許可
  firstContentfulPaint?: number | string;
  speedIndex?: number | string;
  largestContentfulPaint?: number | string;
  interactive?: number | string;
  totalBlockingTime?: number | string;
  cumulativeLayoutShift?: number | string;
  firstMeaningfulPaint?: number | string;
  firstCpuIdle?: number | string;
  maxPotentialFid?: number | string;
  estimatedInputLatency?: number | string;
  
  // オリジナルのレスポンス
  originalResponse?: PageSpeedInsightsResponse;
  
  // エラー情報
  error?: string;
  errorType?: string;
}

/**
 * PageSpeedInsightsのエラー型
 */
export interface PageSpeedInsightsError {
  type: string;
  message: string;
  details?: unknown;
}
