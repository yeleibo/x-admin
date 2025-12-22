import { request } from '@@/exports';
import type { AppMessageQueryParams } from '@/pages/app-message/type';

export const AppMessageService = {
  // 获取应用消息列表
  list: (params: AppMessageQueryParams) =>
    request('/admin/api/App/items', {
      method: 'GET',
      params: params,
    }),

  // 新增应用消息
  create: (data: any) =>
    request('/admin/api/App', {
      method: 'POST',
      data,
    }),

  // 更新应用消息
  update: (id: number, data: any) =>
    request(`/admin/api/App/${id}`, {
      method: 'PUT',
      data,
    }),

  // 删除应用消息
  delete: (id: number) =>
    request(`/admin/api/App/${id}`, {
      method: 'DELETE',
    }),
};
