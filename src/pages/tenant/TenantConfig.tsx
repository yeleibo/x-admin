import {ModalForm, ProFormSelect, ProFormSwitch, ProFormText,} from '@ant-design/pro-components';
import {Col, Form, message, Row} from 'antd';
import React, {useEffect} from 'react';
import {AppMessageService} from '@/pages/app-message/service';
import type {AppMessage, AppMessageQueryParams,} from '@/pages/app-message/type';
import {TenantService} from './service';
import type {Tenant} from './type';

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


  // 当弹窗打开时，从 API 获取配置信息
  useEffect(() => {
    const loadConfigData = async () => {
      if (!open || !currentRow?.id) return;

      try {
        // 调用获取配置的 API
        const response = await TenantService.getConfig(currentRow.id);

        // 将配置数据填充到表单
        const configData = response[0];

        // 解析 otherConfig JSON 字符串
        if (configData.otherConfig) {
          try {
            const otherConfig = JSON.parse(configData.otherConfig);
            configData.isShowConsumerLayer =
              otherConfig.IsShowConsumerLayer ?? false;
            configData.mobileAppEnablePatrol =
              otherConfig.MobileAppEnablePatrol ?? false;
          } catch (e) {
            console.error('解析 otherConfig 失败:', e);
          }
        }

        form.setFieldsValue(configData);
      } catch (error) {
        console.error('加载配置信息失败:', error);
        message.error('加载配置信息失败');
      } finally {
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

          // 将 isShowConsumerLayer 和 mobileAppEnablePatrol 转换为 otherConfig JSON 字符串
          const otherConfig = {
            IsShowConsumerLayer: values.isShowConsumerLayer ?? false,
            MobileAppEnablePatrol: values.mobileAppEnablePatrol ?? false,
          };
          values.otherConfig = JSON.stringify(otherConfig);

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
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            '配置保存失败，请稍后重试';
          message.error(errorMessage);
          return false;
        }
      }}
    >
      <ProFormText name={'id'} hidden={ true}/>
      <ProFormText
        name="tenantId"
        label="机构名称"
       hidden={ true}
      />
      <Row>
        <Col span={12}>
          <ProFormText
            name="tenantServiceUrl"
            label="机构服务地址"
            placeholder="请输入机构服务地址"
            rules={[{required: true, message: '请输入机构服务地址'}]}
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="gisServiceUrl"
            label="GIS服务地址"
            placeholder="请输入GIS服务地址"
            labelCol={{ span: 6 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormText
            name="dataBaseConnectString"
            label="数据库连接字符串"
            placeholder="请输入数据库连接字符串"
            labelCol={{ span: 9 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="mobileAppEnablePatrol"
            label="app是否启用巡检"
            labelCol={{ span: 9 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormSelect
            name="androidAppId"
            label="app的安卓版本"
            placeholder="请选择安卓版本"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
            request={async () => {
              const params: AppMessageQueryParams = {};
              const data: AppMessage[] = await AppMessageService.list(params);

              return data
                .filter((e) => e.platform === 0)
                .map((item: any) => {
                  return {
                    label: item.appName,
                    value: item.id,
                  };
                });
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="iosAppId"
            label="app的苹果版本"
            labelCol={{ span: 8 }} // 设置标签占据的栅格数
            wrapperCol={{ span: 18 }} // 设置输入控件占据的栅格数
            request={async () => {
              const params: AppMessageQueryParams = {};
              const data: AppMessage[] = await AppMessageService.list(params);

              return data
                .filter((e) => e.platform === 1)
                .map((item: any) => {
                  return {
                    label: item.appName,
                    value: item.id,
                  };
                });
            }}
            placeholder="请选择苹果版本"
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormSwitch name="isShowConsumerLayer" label="app是否显示用户图层"/>
        </Col>
      </Row>


    </ModalForm>
  );
};

export default TenantConfig;
