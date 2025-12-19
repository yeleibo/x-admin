import { request } from '@umijs/max';
import {GlobalUser, GlobalUserQueryParam} from '@/pages/globalUser/type';

export const GlobalUserService = {
  list: (params: GlobalUserQueryParam) =>
    request('/admin/api/GlobalUser/items', {
      method: 'GET',
      params: params,
    }),

  add:(data:GlobalUser) =>
    request('/admin/api/GlobalUser', {
      method: 'POST',
      data: data,
    }),

  edit:(data:GlobalUser, id:number) =>
    request(`/admin/api/GlobalUser/${id}`, {
      method: 'PUT',
      data: data,
    })
};
