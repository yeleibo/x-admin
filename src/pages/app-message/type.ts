import type { CommonParams } from '@/components/params';

// 应用消息数据类型
export interface AppMessage {
  id: number;
  appName: string;           // app名称（如 "安卓-1.3.35"）
  appVersion: string;        // app版本（如 "1.3.35"）
  platform: number;          // 平台（0、1等）
  isFourceUpdate: boolean;   // 是否强制更新
  downUrl: string;           // 下载地址
  updateMessage: string;     // 更新消息
}

// 查询参数类型
export type AppMessageQueryParams = CommonParams & {
  appName?: string;
  appVersion?: string;
  platform?: number;
};
