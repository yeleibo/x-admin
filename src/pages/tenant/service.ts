import { request } from '@@/exports';
import { GlobalUserQueryParam } from '@/pages/globalUser/type';
import type { TenantQueryParams } from '@/pages/tenant/type';

export const TenantService = {
  list: (params: TenantQueryParams) =>
    request('/admin/api/Tenant/items', {
      params: params,
    }),
};

export const EditService = {
  list: (params: EditQueryParams) =>
    request('/admin/api/Tenant/items', {
      params: params,
    }),
};

export const NewUserService = {
  list: (params: NewUserQueryParams) =>
    request('/admin/api/Tenant/items', {
      params: params,
    }),
};
