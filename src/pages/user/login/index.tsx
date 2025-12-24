import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  history,
  SelectLang,
  useIntl,
  useModel,
} from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    loginCard: {
      width: 500,
      padding: '40px 32px',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: '90vw',
      opacity: 0.9,
    },
    title: {
      fontSize: 24,
      fontWeight: 400,
      color: '#666666',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 24,
      color: '#333',
      fontWeight: 600,
    },
    inputWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    inputLabel: {
      fontSize: 14,
      color: '#333',
    },
    remember: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      color: '#666',
    },
    loginButton: {
      width: '100%',
      height: 40,
      backgroundColor: '#1890ff',
      borderColor: '#1890ff',
      color: '#fff',
      fontSize: 16,
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#40a9ff',
        borderColor: '#40a9ff',
      },
    },
    footer: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
      marginTop: 16,
    },
  };
});

// const ActionIcons = () => {
//   const { styles } = useStyles();
//
//   return (
//     <>
//       <AlipayCircleOutlined
//         key="AlipayCircleOutlined"
//         className={styles.action}
//       />
//       <TaobaoCircleOutlined
//         key="TaobaoCircleOutlined"
//         className={styles.action}
//       />
//       <WeiboCircleOutlined
//         key="WeiboCircleOutlined"
//         className={styles.action}
//       />
//     </>
//   );
// };

// const Lang = () => {
//   const { styles } = useStyles();
//
//   return (
//     <div className={styles.lang} data-lang>
//       {SelectLang && <SelectLang />}
//     </div>
//   );
// };

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      title={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const [rememberPassword, setRememberPassword] = useState<boolean>(
    localStorage.getItem('password') !== undefined &&
      localStorage.getItem('password') !== null,
  );
  const intl = useIntl();

  const handleSubmit = async (values: API.LoginParams) => {
    if (values.username !== null) {
      localStorage.setItem('username', values.username!);
    }
    if (values.password !== null && rememberPassword) {
      localStorage.setItem('password', values.password ?? '');
    } else {
      localStorage.removeItem('password');
    }
    try {
      // 登录
      const msg = await login({ ...values });

      // 保存 token 到 localStorage
      if (msg.token) {
        localStorage.setItem('token', msg.token);
      }
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      message.success(defaultLoginSuccessMessage);
      // 登录成功后跳转到用户管理页面
      history.push('/globalUser');
      return;
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f0f2f5', // 备用背景色
      }}
    >
      <Helmet>
        <title>{'登录'}</title>
      </Helmet>

      {/* 登录卡片 */}
      <div className={styles.loginCard}>
        {/* 标题 */}
        <div style={{ marginLeft: 45 }}>
          <div className={styles.title}>欢迎登录</div>
          <div className={styles.subtitle}>{'新方位后台管理'}</div>
        </div>

        {/* 表单 */}
        <LoginForm
          contentStyle={{
            padding: 0,
            margin: 0,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {status === 'error' && loginType === 'username' && (
            <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
          )}
          {/* 账号输入框 */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputLabel}>账号</div>
            <ProFormText
              name="username"
              initialValue={localStorage.getItem('username')}
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
                placeholder: '请输入账号',
              }}
              rules={[
                {
                  required: true,
                  message: '账号是必填项！',
                },
              ]}
            />
          </div>

          {/* 密码输入框 */}
          <div className={styles.inputWrapper}>
            <div className={styles.inputLabel}>密码</div>
            <ProFormText.Password
              name="password"
              initialValue={localStorage.getItem('password')}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
                placeholder: '请输入密码',
              }}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </div>

          {/* 记住密码 */}
          <div className={styles.remember}>
            <ProFormCheckbox
              name="remember"
              fieldProps={{
                checked: rememberPassword,
                onChange: (e) => {
                  const checked = e.target.checked;
                  setRememberPassword(checked);
                },
              }}
            >
              记住密码
            </ProFormCheckbox>
          </div>
        </LoginForm>

        {/*/!* 底部提示 *!/*/}
        {/*<div className={styles.footer}>*/}
        {/*  推荐使用*/}
        {/*  <a*/}
        {/*    href="https://www.microsoft.com/zh-cn/edge/download"*/}
        {/*    target="_blank"*/}
        {/*    rel="noopener noreferrer"*/}
        {/*    style={{ color: '#1890ff', cursor: 'pointer', textDecoration: 'none' }}*/}
        {/*    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}*/}
        {/*    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}*/}
        {/*  >*/}
        {/*    新版 Microsoft Edge 浏览器*/}
        {/*  </a>*/}
        {/*  访问本系统*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Login;
