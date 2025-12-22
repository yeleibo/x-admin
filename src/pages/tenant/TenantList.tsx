import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  type ActionType,
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { TenantService } from './service';
import type { Tenant, TenantQueryParams } from './type';
import TenantEdit from './TenantEdit';
import TenantConfig from './TenantConfig';

const TenantList: React.FC = () => {
  // 用于控制表格刷新
  const actionRef = useRef<ActionType>(null);

  // 编辑弹窗相关状态
  const [editModalOpen, setEditModalOpen] = useState(false);  // 控制编辑弹窗显示
  const [editCurrentRow, setEditCurrentRow] = useState<Tenant>();  // 当前编辑的行数据

  // 配置弹窗相关状态
  const [configModalOpen, setConfigModalOpen] = useState(false);  // 控制配置弹窗显示
  const [configCurrentRow, setConfigCurrentRow] = useState<Tenant>();  // 当前配置的行数据

  // 定义表格列
  const columns: ProColumns<Tenant>[] = [
    {
      title: '机构名称',
      dataIndex: 'tenantName',
      // 不在搜索表单中显示
      search: false,
    },
    {
      title: '机构代码',
      dataIndex: 'tenantCode',
      // 不在搜索表单中显示
      search: false,
    },
    {
      title: '机构id',
      dataIndex: 'id',
      // 不在搜索表单中显示
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 300,
      render: (_, record) => [
        // 编辑按钮（蓝色边框）
        <Button
          key="edit"
          type="default"
          style={{ color: '#1890ff', borderColor: '#1890ff' }}
          onClick={() => {
            setEditCurrentRow(record);  // 保存当前行数据
            setEditModalOpen(true);     // 打开编辑弹窗
          }}
        >
          编辑
        </Button>,
        // 配置按钮（红色边框）
        <Button
          key="config"
          type="default"
          style={{ color: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => {
            setConfigCurrentRow(record);  // 保存当前行数据
            setConfigModalOpen(true);     // 打开配置弹窗
          }}
        >
          配置
        </Button>,
        // 删除按钮（绿色边框 + 二次确认）
        <Popconfirm
          key="delete"
          title="确定要删除这个机构吗？"
          onConfirm={() => {
            TenantService.delete(record.id).then(() => {
              message.success('删除成功');
              // 刷新表格
              actionRef.current?.reload();
            });
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="default"
            danger
            style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Tenant, TenantQueryParams>
        // 表格标题
        headerTitle="机构列表"
        // 列定义
        columns={columns}
        // 行的唯一键
        rowKey="id"
        // 表格引用，用于刷新
        actionRef={actionRef}
        // 请求数据的方法
        request={async (params) => {
          const data = await TenantService.list(params);
          return {
            // 这里根据你的 API 返回格式调整
            total: data.length,
            data: data,
            success: true,
          };
        }}
        // 分页配置
        pagination={{
          showSizeChanger: true, // 显示每页条数选择器
          showQuickJumper: true, // 显示快速跳转
          showTotal: (total) => `总数：${total}`, // 显示总数
          defaultPageSize: 10, // 默认每页10条
        }}
        // 工具栏按钮
        toolBarRender={() => [
          // 新增按钮
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditCurrentRow(undefined);  // 清空当前行，表示新增模式
              setEditModalOpen(true);        // 打开编辑弹窗
            }}
          >
            新增
          </Button>,


        ]}
        // 搜索表单配置
        search={{
          labelWidth: 'auto',
        }}
      />

      {/* 编辑弹窗 */}
      <TenantEdit
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentRow={editCurrentRow}
        onSuccess={() => {
          setEditModalOpen(false);     // 关闭弹窗
          setEditCurrentRow(undefined);  // 清空当前行数据
          actionRef.current?.reload();   // 刷新表格
        }}
      />

      {/* 配置弹窗 */}
      <TenantConfig
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        currentRow={configCurrentRow}
        onSuccess={() => {
          setConfigModalOpen(false);      // 关闭弹窗
          setConfigCurrentRow(undefined);  // 清空当前行数据
          actionRef.current?.reload();     // 刷新表格（如果配置影响列表显示）
        }}
      />
    </PageContainer>
  );
};

export default TenantList;
