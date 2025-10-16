import { Avatar, Dropdown, Space, Button } from "antd";
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  BulbOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useLanguageStore } from "../store/useLanguageStore";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const navOptions = [
  { key: "certificate", label: "Certificate", href: "/certificate" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "ielts", label: "Ielts", href: "/ielts" },
  { key: "about", label: "About me", href: "/about" },
];

const LANG_OPTIONS = [
  { key: "vi", label: "Tiếng Việt" },
  { key: "en", label: "English" },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const langMenu = {
    items: LANG_OPTIONS.map((opt) => ({
      key: opt.key,
      label: (
        <span onClick={() => setLanguage(opt.key)}>
          {opt.label}
        </span>
      ),
    })),
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: <span onClick={() => navigate("/profile")}>Profile</span>,
      },
      {
        key: "logout",
        label: (
          <span
            onClick={() => {
              clearAuth();
              navigate("/login");
            }}
          >
            Logout
          </span>
        ),
      },
    ],
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 shadow z-20 bg-white">
      {/* ✅ Giới hạn nội dung trong max-w */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-3 items-center px-8 h-full">
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-black font-bold text-lg">Logo</span>
        </div>

        {/* Center: Options */}
        <nav className="flex justify-center">
          <div className="flex gap-12">
            {navOptions.map((option) => (
              <Link
                key={option.key}
                to={option.href}
                className="text-gray-700 hover:text-blue-500 font-medium transition"
              >
                {option.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right: Icons & User */}
        <div className="flex justify-end items-center gap-4">
          <Dropdown menu={langMenu} trigger={["click"]}>
            <Space className="cursor-pointer">
              <GlobalOutlined />
              <span className="font-medium">
                {LANG_OPTIONS.find((opt) => opt.key === language)?.label || "Tiếng Việt"}
              </span>
              <DownOutlined style={{ color: "#333" }} />
            </Space>
          </Dropdown>

          <Button type="text" icon={<BulbOutlined />} />
          <Button type="text" icon={<BellOutlined />} />

          {user ? (
            <Dropdown menu={userMenu} trigger={["click"]} className="cursor-pointer">
              <Space>
                <Avatar src={user.avatar} icon={!user?.avatar ? <UserOutlined /> : null} />
                <span className="text-gray-800 font-medium">
                  {user.name || user.username}
                </span>
                <DownOutlined style={{ color: "#333" }} />
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="link" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button type="primary" onClick={() => navigate("/auth?tab=register")}>
                Đăng ký
              </Button>
            </Space>
          )}
        </div>
      </div>
    </header>
  );
}
