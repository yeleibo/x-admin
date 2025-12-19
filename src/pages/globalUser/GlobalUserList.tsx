import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, {useRef, useState} from 'react';
import type { GlobalUser, GlobalUserQueryParam } from '@/pages/globalUser/type';
import { TenantService } from '@/pages/tenant/service';
import Edit from './Edit';
import {GlobalUserService} from "@/pages/globalUser/service";

const GlobalUserList: React.FC = () => {
  // 步骤7.2：定义状态
  const [modalOpen, setModalOpen] = useState(false); // 控制弹窗显示
  const [currentRow, setCurrentRow] = useState<GlobalUser>(); // 当前编辑的行数据
  const actionRef = useRef<ActionType>();

  // 第1步：定义表格列
  const columns: ProColumns<GlobalUser>[] = [
    {
      title: '用户名称',
      dataIndex: 'tenantUserLoginName',
    },
    {
      title: '机构名称',
      dataIndex: 'tenantId',
      valueType: 'select',
      request: async (params) => {
        const data = await TenantService.list(params);
        return data.map((item: any) => {
          return {
            label: item.tenantName,
            value: item.id,
          };
        });
      },
    },

    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
    },
    {
      title: '角色',
      dataIndex: 'role',
      search: false,
      render: (text, record) => (record.role === 0 ? '普通角色' : '管理员'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRow(record); // 保存当前行数据
            setModalOpen(true); // 打开弹窗
          }}
        >
          编辑
        </Button>,
        <Button key="delete" type="link" danger>
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<GlobalUser, GlobalUserQueryParam>
        headerTitle="用户列表"
        columns={columns}
        rowKey="id"
        request={async (params) => {
          const data = await GlobalUserService.list(params);
          return {
            total: data.length,
            data: data,
          };
        }}
        pagination={{
          showSizeChanger: true, // 显示每页条数选择器
          showQuickJumper: true, // 显示快速跳转
          showTotal: (total) => `总数：${total}`, // 显示总数
        }}
        rowSelection={{}} // 启用行选择（复选框）
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRow(undefined); // 清空当前行，表示新增模式
              setModalOpen(true);
            }}
          >
            新增
          </Button>,
          <Button
            key="delete"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              // TODO: 批量删除
            }}
          >
            删除
          </Button>,
        ]}
      />

      {/* 编辑弹窗 */}
      <Edit
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentRow={currentRow}
        onSuccess={() => {
          setCurrentRow(undefined);
          setModalOpen(false);
          actionRef.current?.reload;
        }}
      />
    </PageContainer>
  );
};

export default GlobalUserList;
