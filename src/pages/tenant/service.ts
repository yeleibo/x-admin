import {request} from '@@/exports';
import type {TenantQueryParams} from '@/pages/tenant/type';

export const TenantService = {
  // 获取机构列表
  list: (params: TenantQueryParams) =>
    request('/admin/api/Tenant/items', {
      params: params,
    }),

  // 删除机构
  delete: (id: number) =>
    request(`/admin/api/Tenant/${id}`, {
      method: 'DELETE',
    }),

  // 新增机构
  create: (data: any) =>
    request('/admin/api/Tenant', {
      method: 'POST',
      data,
    }),

  // 更新机构
  update: (id: number, data: any) =>
    request(`/admin/api/Tenant/${id}`, {
      method: 'PUT',
      data,
    }),

  // 获取机构配置信息列表
  getConfigList: () =>
    request('/admin/api/TenantConfig/items', {
      method: 'GET',
    }),

  // 根据机构ID获取配置（从列表中筛选）
  getConfig: async (id: number) => {
    return await request('/admin/api/TenantConfig/items', {
      method: 'GET',
      params: {
        tenantId: id,
      }
    });
  },

  // 保存机构配置
  saveConfig: (id: number, data: any) =>
    request(`/admin/api/TenantConfig/${id}`, {
      method: 'PUT',
      data,
    }),
};
