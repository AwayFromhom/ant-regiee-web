// @ts-ignore
/* eslint-disable */
import {request} from 'umi';
import {TableListItem} from './data';
import {Result} from "@/pages/EmployeeTableList/data";

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('api/category/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Result>('/api/category', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Result>('/api/category', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */

export async function removeRule(keys: number[]) {
  console.log(keys);
  return request<Result>('/api/category', {
    method: 'DELETE',
    data: keys,
  });
}