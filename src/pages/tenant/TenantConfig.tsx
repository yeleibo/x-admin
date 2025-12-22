import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import type { Tenant } from './type';
import { TenantService } from './service';

// 定义组件的 Props 类型
interface TenantConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Tenant;
  onSuccess?: () => void;
}

const TenantConfig: React.FC<TenantConfigProps> = ({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);  // 加载状态

  // 当弹窗打开时，从 API 获取配置信息
  useEffect(() => {
    const loadConfigData = async () => {
      if (!open || !currentRow?.id) return;

      try {
        setLoading(true);

        // 调用获取配置的 API
        const response = await TenantService.getConfig(currentRow.id);

        // 将配置数据填充到表单

          form.setFieldsValue(response[0]);

      } catch (error) {
        console.error('加载配置信息失败:', error);
        message.error('加载配置信息失败');
      } finally {
        setLoading(false);
      }
    };

    loadConfigData();
  }, [open, currentRow?.id, form]);

  return (
    <ModalForm
      title={`配置机构：${currentRow?.tenantName || ''}`}
      open={open}
      form={form}
      onOpenChange={onOpenChange}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        try {
          console.log('准备保存配置，机构ID:', currentRow?.id);
          console.log('保存的配置数据:', values);

          // 调用配置保存接口
          const result = await TenantService.saveConfig(currentRow!.id, values);

          console.log('保存成功，返回结果:', result);
          message.success('配置保存成功');
          onSuccess?.();
          return true;
        } catch (error: any) {
          console.error('保存配置失败，完整错误信息:', error);
          console.error('错误详情:', {
            message: error?.message,
            response: error?.response,
            status: error?.response?.status,
            data: error?.response?.data,
          });

          // 显示更详细的错误信息
          const errorMessage = error?.response?.data?.message ||
                              error?.message ||
                              '配置保存失败，请稍后重试';
          message.error(errorMessage);
          return false;
        }
      }}
    >
      <Spin spinning={loading} tip="正在加载配置信息...">
        {/* 机构配置信息 */}
        <ProFormText
          name="tenantServiceUrl"
          label="机构服务地址"
          placeholder="请输入机构服务地址"
          rules={[
            { required: true, message: '请输入机构服务地址' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
        />

      <ProFormText
        name="gisServiceUrl"
        label="GIS服务地址"
        placeholder="请输入GIS服务地址"
        rules={[
          { required: true, message: '请输入GIS服务地址' },
          { type: 'url', message: '请输入有效的URL地址' },
        ]}
      />

      <ProFormText
        name="dataBaseConnectString"
        label="数据库连接字符串"
        placeholder="请输入数据库连接字符串"
        rules={[
          { required: true, message: '请输入数据库连接字符串' },
        ]}
      />


      <ProFormSwitch
        name="otherConfig"
        label="app是否启用巡检"
      />

      <ProFormSelect
        name="androidAppId"
        label="app的安卓版本"
        options={[

        ]}
        placeholder="请选择安卓版本"
      />

      <ProFormSelect
        name="iosAppId"
        label="app的苹果版本"
        options={[

        ]}
        placeholder="请选择苹果版本"
      />

      <ProFormSwitch
        name="allowedLoginMethods"
        label="app是否显示用户图层"
      />
      </Spin>
    </ModalForm>

  );
};

export default TenantConfig;
