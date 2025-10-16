import { Avatar, Dropdown, Space, Button } from 'antd';
import { BellOutlined, DownOutlined, UserOutlined, BulbOutlined, GlobalOutlined } from '@ant-design/icons';
import { useLanguageStore } from '../store/useLanguageStore';

const userMenu = {
  items: [
    { key: '1', label: 'Profile' },
    { key: '2', label: 'Logout' },
  ],
};

const navOptions = [
  { key: 'certificate', label: 'Certificate', href: '/certificate' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'ielts', label: 'Ielts', href: '/ielts' },
  { key: 'about', label: 'About me', href: '/about' },
];

const LANG_OPTIONS = [
  { key: 'vi', label: 'Tiếng Việt' },
  { key: 'en', label: 'English' },
];

export default function AppHeader() {
  const language = useLanguageStore(state => state.language);
  const setLanguage = useLanguageStore(state => state.setLanguage);

  const langMenu = {
    items: LANG_OPTIONS.map(opt => ({
      key: opt.key,
      label: (
        <span onClick={() => setLanguage(opt.key)}>
          {opt.label}
        </span>
      ),
    })),
  };

  const currentLangLabel = LANG_OPTIONS.find(opt => opt.key === language)?.label || 'Tiếng Việt';

  return (
    <header className="fixed top-0 left-0 w-full h-16 shadow z-20 bg-white grid grid-cols-3 items-center px-8">
      {/* Left: Logo */}
      <div className="flex items-center">
        <span className="text-black font-bold text-lg">Logo</span>
      </div>

      {/* Center: Options */}
      <nav className="flex justify-center">
        <div className="flex gap-20">
          {navOptions.map(option => (
            <a
              key={option.key}
              href={option.href}
              className="text-gray-700 hover:text-blue-500 font-medium transition"
            >
              {option.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Right: Icons & User */}
      <div className="flex justify-end items-center gap-4">
        {/* Language Dropdown */}
        <Dropdown menu={langMenu} trigger={['click']}>
          <Space className="cursor-pointer">
            <GlobalOutlined />
                <span className="font-medium">{currentLangLabel}</span>
            <DownOutlined style={{ color: '#333' }} />
          </Space>
        </Dropdown>
        <Button type="text" icon={<BulbOutlined />} />
        <Button type="text" icon={<BellOutlined />} />
        <Dropdown menu={userMenu} trigger={['click']} className="cursor-pointer">
          <Space>
            <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" icon={<UserOutlined />} />
            <span className="text-gray-800 font-medium">Musharof</span>
            <DownOutlined style={{ color: '#333' }} />
          </Space>
        </Dropdown>
      </div>
    </header>
  );
}