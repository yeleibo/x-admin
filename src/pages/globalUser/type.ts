import type { CommonParams } from '@/components/params';

export interface GlobalUser {
  id: number;
  tenantId?: number;
  tenantUserLoginName?: string;
  phoneNumber?: string;
  remark?: string;
  role: number;
}

export type GlobalUserQueryParam = CommonParams & {
  phoneNumber?: string;
  /** 用户名 */
  tenantUserLoginName?: string;
  /** 备注 */
  remark?: string;
  /** 机构名字 */
  tenantId?: number;
};
