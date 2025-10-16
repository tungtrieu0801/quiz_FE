import { useEffect, useState } from "react";
import { deleteCertification, getDetailCertification, getAllCertifications, createCertification } from "../api/certification";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spin, message, Form, Input, Select, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useLanguageStore } from "../store/useLanguageStore";

const LANG_OPTIONS = [
  { label: "Tiếng Việt", value: "vi" },
  { label: "English", value: "en" },
  // Thêm ngôn ngữ khác nếu cần
];

export default function CertificationPage() {
  const [certList, setCertList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();

  const language = useLanguageStore((state) => state.language);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllCertifications();
        const list = res?.data || res?.result || [];
        setCertList(list);
      } catch (err) {
        setError("Không thể tải danh sách chứng chỉ");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language]);

  const handleOpen = async (id) => {
    setOpenId(id);
    setLoadingDetail(true);
    try {
      const res = await getDetailCertification(id, language);
      setDetail(res);
    } catch (err) {
      message.error("Lấy chi tiết thất bại");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleClose = () => {
    setOpenId(null);
    setDetail(null);
  };

  const handleLearn = () => {
    if (detail) {
      navigate(`/${detail.id}/domains`, {
        state: { certificationName: detail.name },
      });
    }
  };

  const handleAdd = async (values) => {
    setAddLoading(true);
    try {
      const body = {
        code: values.code,
        vendor: values.vendor,
        translations: values.translations?.map(tr => ({
          languageCode: tr.languageCode,
          name: tr.name,
          description: tr.description
        })),
      };
      console.log("body", body);
      
      const newCertification = await createCertification(body);
      if (newCertification && newCertification.id) {
        setCertList((prev) => [...prev, newCertification]);
        setAddModalOpen(false);
        form.resetFields();
        message.success("Thêm chứng chỉ thành công!");
      } else {
        message.error("Thêm chứng chỉ thất bại!");
      }
    } catch {
      message.error("Có lỗi khi thêm chứng chỉ!");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCertification(id);
      const code = res?.data?.code ?? res?.code;
      if (String(code) === "1") {
        setCertList((prev) => prev.filter((item) => String(item.id) !== String(id)));
        message.success("Xoá thành công!");
      } else {
        message.error("Xoá thất bại!");
      }
    } catch (err) {
      message.error("Có lỗi xảy ra khi xoá!");
    }
  };

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="">
      <div>
        <img
            src="/images/background2.JPG"
            alt="Logo"
            className="w-full h- mr-2" // 👈 chỉnh kích thước và khoảng cách phải
          />
      </div>
      <div className="flex px-15 bg-gray-50">
        <div className="w-1/4 text-start font-bold">
          <p>CATEGORIES</p>
          <ul>
            <li className="cursor-pointer hover:text-blue-500">All</li>
            <li className="cursor-pointer hover:text-blue-500">Development</li>
            <li className="cursor-pointer hover:text-blue-500">IT & Software</li>
          </ul>
        </div>
        <div className="w-3/4">
      <h1 className="text-start font-bold">CERTIFICATE LIBRARY</h1>

      <div>
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Thêm
        </Button>
      </div>

      <ul className="grid grid-cols-5 gap-4 p-4 w-full">
        {certList.map((cert) => (
          <li key={cert.id}>
            <div
              onMouseEnter={() => setHoverId(cert.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => handleOpen(cert.id)}
              className="relative cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                         border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                         shadow-sm hover:shadow-lg hover:border-blue-500 
                         transition duration-200 ease-in-out 
                         flex items-center justify-center h-24 text-center p-2"
            >
              <div className="font-bold text-lg">
                {cert.code} - {cert.vendor}
              </div>
              {hoverId === cert.id && (
                <Button
                  danger
                  size="small"
                  style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cert.id);
                  }}
                >
                  Xoá
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal
        title={detail ? `${detail.code} - ${detail.vendor}` : "Chi tiết chứng chỉ"}
        open={!!openId}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Đóng
          </Button>,
          <Button key="learn" type="primary" onClick={handleLearn} disabled={!detail}>
            Học
          </Button>,
        ]}
      >
        {loadingDetail ? (
          <Spin />
        ) : detail ? (
          <>
            <p>{detail.description}</p>
            <ul>
              {detail.translations?.map((t) => (
                <li key={t.languageCode}>
                  [{t.languageCode}] {t.name} - {t.description}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Không có dữ liệu chi tiết</p>
        )}
      </Modal>

      {/* Modal thêm chứng chỉ mới với bản dịch động */}
      <Modal
        title="Thêm chứng chỉ mới"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            label="Mã chứng chỉ"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã chứng chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nhà cung cấp"
            name="vendor"
            rules={[{ required: true, message: "Vui lòng nhập nhà cung cấp" }]}
          >
            <Input />
          </Form.Item>
          <Form.List name="translations">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 8 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm bản dịch
                  </Button>
                </div>
                {fields.map((field) => (
                  <Space key={field.key || field.name} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                    <Form.Item
                      name={[field.name, "languageCode"]}
                      fieldKey={[field.fieldKey, "languageCode"]}
                      rules={[{ required: true, message: "Chọn ngôn ngữ" }]}
                    >
                      <Select
                        placeholder="Ngôn ngữ"
                        style={{ width: 120 }}
                        options={LANG_OPTIONS}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[{ required: true, message: "Tên bản dịch" }]}
                    >
                      <Input placeholder="Tên bản dịch" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "description"]}
                      fieldKey={[field.fieldKey, "description"]}
                      rules={[{ required: true, message: "Mô tả bản dịch" }]}
                    >
                      <Input placeholder="Mô tả bản dịch" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: "red" }} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <div className="flex justify-end">
            <Button onClick={() => setAddModalOpen(false)} style={{ marginRight: 8 }}>
              Huỷ
            </Button>
            <Button type="primary" htmlType="submit" loading={addLoading}>
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>
        </div>
      </div>
    </div>
  );
}