import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, message, Row } from 'antd';
import React from 'react';
import { TenantService } from './service';
import type { Tenant } from './type';

// 定义组件的 Props 类型
interface TenantEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Tenant;
  onSuccess?: () => void;
}

const TenantEdit: React.FC<TenantEditProps> = ({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // 判断是编辑模式还是新增模式
  const isEdit = !!currentRow;

  return (
    <ModalForm
      title={isEdit ? '编辑机构' : '新增机构'}
      open={open}
      form={form}
      onOpenChange={onOpenChange}
      initialValues={currentRow}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        try {
          if (isEdit) {
            await TenantService.update(currentRow!.id, values);
            message.success('编辑成功');
          } else {
            await TenantService.create(values);
            message.success('新增成功');
          }
          onSuccess?.();
          return true;
        } catch (error) {
          message.error('操作失败');
          return false;
        }
      }}
    >
      <Row>
        <Col span={12}>
          <ProFormText
            name="tenantName"
            label="机构名称"
            placeholder="请输入机构名称"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[
              { required: true, message: '请输入机构名称' },
              { max: 50, message: '机构名称最多50个字符' },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="tenantCode"
            label="机构代码"
            placeholder="请输入机构代码"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[
              { max: 20, message: '机构代码最多20个字符' },
            ]}
          />
        </Col>
      </Row>

      <ProFormText name="id" hidden />
    </ModalForm>
  );
};

export default TenantEdit;
