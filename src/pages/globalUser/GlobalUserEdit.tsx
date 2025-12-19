import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Col, Form, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { GlobalUserService } from '@/pages/globalUser/service';
import { TenantService } from '@/pages/tenant/service';
import type { GlobalUser } from './type';

interface EditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: GlobalUser;
  onSuccess?: () => void;
}

const GlobalUserEdit: React.FC<EditProps> = ({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  // 判断是新增还是编辑模式
  const isEdit = !!currentRow;

  useEffect(() => {
    form.setFieldsValue(currentRow);
  }, []);

  return (
    <ModalForm
      title={isEdit ? '编辑用户' : '新增用户'}
      open={open}
      form={form}
      onOpenChange={onOpenChange}
      initialValues={currentRow}
      modalProps={{
        destroyOnClose: true, // 关闭时销毁，确保下次打开时重新初始化
      }}
      onFinish={async (values) => {
        const formData = await form.validateFields();
        if (isEdit) {
          // 编辑模式
          console.log('编辑数据:', { ...currentRow, ...values });
          await GlobalUserService.edit(formData, currentRow?.id);

          message.success('编辑成功');
        } else {
          // 新增模式
          console.log('新增数据:', values);
          // TODO: 调用新增接口
          await GlobalUserService.add(formData);
          message.success('新增成功');
        }
        onSuccess?.();
        return true;
      }}
    >
      <Row>
        <Col span={12}>
          <ProFormText
            name="tenantUserLoginName"
            label="用户名称"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
            rules={[{ required: true, message: '请输入用户名称' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="tenantId"
            label="机构名称"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
            request={async () => {
              const params: any = {};
              const data = await TenantService.list(params);
              return data.map((item: any) => ({
                label: item.tenantName,
                value: item.id,
              }));
            }}
            rules={[{ required: true, message: '请选择机构' }]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormText
            name="phoneNumber"
            label="手机号码"
            rules={[{ required: true, message: '请输入手机号码' }]}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="role"
            label="角色"
            options={[
              { label: '普通角色', value: 0 },
              { label: '管理员', value: 1 },
            ]}
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormText
            name="remark"
            label="备注"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <ProFormText name="id" label="用户" hidden={true} />
    </ModalForm>
  );
};

export default GlobalUserEdit;
