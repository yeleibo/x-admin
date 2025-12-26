import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  type ActionType,
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import AppMessageEdit from './AppMessageEdit';
import { AppMessageService } from './service';
import type { AppMessage, AppMessageQueryParams } from './type';

const AppMessageList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);

  // 编辑弹窗状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCurrentRow, setEditCurrentRow] = useState<AppMessage>();

  // 定义表格列
  const columns: ProColumns<AppMessage>[] = [
    {
      title: 'app名称',
      dataIndex: 'appName',
      width: 150,
    },
    {
      title: 'app版本',
      dataIndex: 'appVersion',
      width: 100,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 80,
      search: false,
      render: (_, record) => (record.platform === 0 ? 'Android' : 'iOS'),
    },
    {
      title: '是否强制更新',
      dataIndex: 'isFourceUpdate',
      width: 120,
      search: false,
      render: (_, record) => (record.isFourceUpdate ? '是' : '否'),
    },
    {
      title: '更新消息',
      dataIndex: 'updateMessage',
      width: 150,
      search: false,
      ellipsis: true,
    },
    {
      title: '下载地址',
      dataIndex: 'downUrl',
      ellipsis: true,
      search: false,
      render: (_, record) => (
        <a href={record.downUrl} target="_blank" rel="noopener noreferrer">
          {record.downUrl}
        </a>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<AppMessage, AppMessageQueryParams>
        headerTitle="应用消息列表"
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        request={async (params) => {
          const data = await AppMessageService.list(params);
          return {
            total: data.length,
            data: data.reverse(),
            success: true,
          };
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `总数：${total}`,
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditCurrentRow(undefined); // 清空当前行，表示新增模式
              setEditModalOpen(true); // 打开弹窗
            }}
          >
            新增
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
      />

      {/* 新增/编辑弹窗 */}
      <AppMessageEdit
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentRow={editCurrentRow}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditCurrentRow(undefined);
          actionRef.current?.reload(); // 刷新表格
        }}
      />
    </PageContainer>
  );
};

export default AppMessageList;
