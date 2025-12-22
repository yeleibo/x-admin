import type { CommonParams } from '@/components/params';

// 机构数据类型
export interface Tenant {
  id: number;            // 机构ID
  tenantName: string;    // 机构名称
  tenantCode?: string;   // 机构代码
  // 可以根据实际需要添加其他字段
}

// 查询参数类型
export type TenantQueryParams = CommonParams & {
  tenantId?: number;
  tenantName?: string;   // 支持按机构名称搜索
  tenantCode?: string;   // 支持按机构代码搜索
};

export type TenantConfig = {
  id: number;
  tenantId: number;
  tenantServiceUrl: string;
  gisServiceUrl: string; // 允许 null 或 string 类型
  dataBaseConnectString: string; // 允许 null 或 string 类型
  otherConfig: string ; // 兼容 JSON 字符串和解析后的对象类型
  androidAppId: number;
  iosAppId: number;
  allowedLoginMethods: number;
}
