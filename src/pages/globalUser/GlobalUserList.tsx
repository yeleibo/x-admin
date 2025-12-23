import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  type ActionType,
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, message, Popconfirm, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { GlobalUserService } from '@/pages/globalUser/service';
import type { GlobalUser, GlobalUserQueryParam } from '@/pages/globalUser/type';
import { TenantService } from '@/pages/tenant/service';
import GlobalUserEdit from './GlobalUserEdit';

const GlobalUserList: React.FC = () => {
  // 步骤7.2：定义状态
  const [modalOpen, setModalOpen] = useState(false); // 控制弹窗显示
  const [currentRow, setCurrentRow] = useState<GlobalUser>(); // 当前编辑的行数据
  const [uploading, setUploading] = useState(false); // 导入loading状态
  const actionRef = useRef<ActionType>(null);

  // Excel导入处理
  const handleImport: UploadProps['beforeUpload'] = (file) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, {
          header: 1,
        });

        // 从第二行开始读取（跳过标题行）
        const users: GlobalUser[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row.length > 0 && row[0]) {
            users.push({
              tenantUserLoginName: String(row[0] || ''),
              phoneNumber: String(row[1] || ''),
              tenantId: row[2] ? Number(row[2]) : undefined,
              remark: String(row[3] || ''),
              role: row[4] ? Number(row[4]) : 0,
            });
          }
        }

        if (users.length === 0) {
          message.warning('Excel中没有有效的用户数据');
          return;
        }

        // 调用批量新增接口
        await GlobalUserService.addUsers(users);
        message.success(`成功导入 ${users.length} 个用户`);
        actionRef.current?.reload();
      } catch (error) {
        message.error('导入失败，请检查Excel格式是否正确');
        console.error(error);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // 阻止自动上传
  };

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
      width: 150,
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
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
          onConfirm={async () => {
            await GlobalUserService.delete(record.id!);
            message.success('删除成功');
            await actionRef.current?.reload(); // 刷新表格
          }}
          okText="确定"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
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
        actionRef={actionRef}
        pagination={{
          showSizeChanger: true, // 显示每页条数选择器
          showQuickJumper: true, // 显示快速跳转
          showTotal: (total) => `总数：${total}`, // 显示总数
        }}
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
            key="download"
            icon={<DownloadOutlined />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/doc/用户模板.xlsx';
              link.download = '用户模板.xlsx';
              link.click();
            }}
          >
            下载用户模板
          </Button>,
          <Upload
            key="import"
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleImport}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              导入用户
            </Button>
          </Upload>,
        ]}
      />

      {/* 编辑弹窗 */}
      <GlobalUserEdit
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentRow={currentRow}
        onSuccess={async () => {
          setCurrentRow(undefined);
          setModalOpen(false);
          await actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default GlobalUserList;
