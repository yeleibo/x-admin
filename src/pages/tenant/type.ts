import type { CommonParams } from '@/components/params';

export type TenantQueryParams = CommonParams & {
  tenantId?: number;
};
