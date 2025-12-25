import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Col, Form, message, Row } from 'antd';
import React from 'react';
import { AppMessageService } from './service';
import type { AppMessage } from './type';

// 定义组件的 Props 类型
interface AppMessageEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: AppMessage;
  onSuccess?: () => void;
}

const AppMessageEdit: React.FC<AppMessageEditProps> = ({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // 判断是编辑模式还是新增模式
  const isEdit = !!currentRow;

  // 根据版本和平台自动生成app名称
  const updateAppName = () => {
    const appVersion = form.getFieldValue('appVersion');
    const platform = form.getFieldValue('platform');
    if (appVersion !== undefined && platform !== undefined) {
      const platformName = platform === 0 ? '安卓' : 'iOS';
      form.setFieldValue('appName', `${platformName}-${appVersion}`);
    }
  };

  return (
    <ModalForm
      title={isEdit ? '编辑应用' : '新增应用'}
      open={open}
      form={form}
      onOpenChange={onOpenChange}
      initialValues={currentRow || { platform: 0 }}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        try {
          if (isEdit) {
            await AppMessageService.update(currentRow!.id, values);
            message.success('编辑成功');
          } else {
            await AppMessageService.create(values);
            message.success('新增成功');
          }
          onSuccess?.();
          return true;
        } catch (error) {
          console.error('操作失败:', error);
          message.error('操作失败，请稍后重试');
          return false;
        }
      }}
    >
      <Row>
        <Col span={12}>
          <ProFormText
            name="appVersion"
            label="app版本"
            placeholder="请输入app版本"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: '请输入app版本' }]}
            fieldProps={{
              onChange: updateAppName,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="appName"
            label="app名称"
            placeholder="请输入app名称"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: '请输入app名称' }]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <ProFormSelect
            name="platform"
            label="app平台"
            placeholder="请选择app平台"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            options={[
              { label: 'Android', value: 0 },
              { label: 'iOS', value: 1 },
            ]}
            rules={[{ required: true, message: '请选择app平台' }]}
            fieldProps={{
              onChange: updateAppName,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="isFourceUpdate"
            label="是否强制更新"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 18 }}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProFormText
            name="downUrl"
            label="下载地址"
            placeholder="请输入下载地址"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            rules={[
              { required: true, message: '请输入下载地址' },
              { type: 'url', message: '请输入有效的URL地址' },
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ProFormTextArea
            name="updateMessage"
            label="更新信息"
            placeholder="请输入更新信息"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            fieldProps={{
              rows: 4,
            }}
          />
        </Col>
      </Row>

      <ProFormText name="id" hidden />
    </ModalForm>
  );
};

export default AppMessageEdit;
