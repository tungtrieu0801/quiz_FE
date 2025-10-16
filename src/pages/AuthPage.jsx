// ...existing code...
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Typography,
} from "antd";
import { login } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function AuthPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // chỉnh endpoint theo backend của bạn
      const res = await login(values.email, values.password);
      if (res?.accessToken) {
        setAuth(res.accessToken, res.user || null);
        await new Promise((r) => setTimeout(r, 100));
        navigate("/certificate");

      } else {
        console.log("lỗi")
      }
    } catch (err) {
      console.error(err);
      // message.error("Lỗi khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // chuẩn hóa payload nếu cần
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      const res = await apiPost("/api/auth/register", payload);
      if (res?.id || res?.success) {
        message.success("Đăng ký thành công. Vui lòng đăng nhập.");
        registerForm.resetFields();
      } else {
        message.error(res?.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 420, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Title level={4} style={{ margin: 0 }}>Hệ thống ôn tập</Title>
          <Text type="secondary">Đăng nhập hoặc đăng ký để tiếp tục</Text>
        </div>

        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="Đăng nhập" key="login">
            <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Email hoặc tên người dùng"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email hoặc tên người dùng" }]}
              >
                <Input placeholder="Email hoặc username" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" initialValue>
                <Checkbox>Ghi nhớ</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Đăng ký" key="register">
            <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
              <Form.Item
                label="Tên người dùng"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
              >
                <Input placeholder="Tên người dùng" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                hasFeedback
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
// ...existing code...