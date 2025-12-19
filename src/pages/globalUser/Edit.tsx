import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {Form, message} from 'antd';
import React, {useEffect} from 'react';
import { TenantService } from '@/pages/tenant/service';
import type { GlobalUser } from './type';
import {GlobalUserService} from "@/pages/globalUser/service";

interface EditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: GlobalUser;
  onSuccess?: () => void;
}

const Edit: React.FC<EditProps> = ({
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
          await GlobalUserService.edit(formData, currentRow?.id)

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
      <ProFormText
        name="id"
        label="用户"
        hidden={true}
      />
      <ProFormText
        name="tenantUserLoginName"
        label="用户名称"
        rules={[{ required: true, message: '请输入用户名称' }]}
      />
      <ProFormSelect
        name="tenantId"
        label="机构名称"
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
      <ProFormText name="phoneNumber" label="电话号码" />
      <ProFormSelect
        name="role"
        label="角色"
        options={[
          { label: '普通角色', value: 0 },
          { label: '管理员', value: 1 },
        ]}
      />
      <ProFormText name="remark" label="备注" />
    </ModalForm>
  );
};

export default Edit;
