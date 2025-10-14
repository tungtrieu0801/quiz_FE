import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createDomain, deleteDomain, getAllDomain } from "../api/domainApi";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const LANG_OPTIONS = [
  { label: "Tiếng Việt", value: "vi" },
  { label: "English", value: "en" },
];

export default function DomainPage() {
  const navigate = useNavigate();
  const { certificationId } = useParams();

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  // ⚙️ State quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 🧭 Gọi API lấy domain có phân trang
  const fetchDomains = async (page, limit) => {
    if (!certificationId) return;
    try {
      setLoading(true);
      const res = await getAllDomain(certificationId, "vi", page, limit);
      // API trả dạng { data: [...], pagination: { total, page, limit } }
      const data = res?.data || [];
      const total = res?.pagination?.total || 0;

      setDomains(Array.isArray(data) ? data : []);
      setPagination({
        current: page,
        pageSize: limit,
        total,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách domain");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains(pagination.current, pagination.pageSize);
  }, [certificationId]);

  // ⚡ Xử lý đổi trang
  const handleTableChange = (pag) => {
    fetchDomains(pag.current, pag.pageSize);
  };

  const handleNavigateQuiz = (domainId) => {
    navigate(
      `/quizpage?certificationId=${certificationId}&domainId=${domainId}&language=vi&page=1&limit=10&sortBy=id&order=asc`
    );
  };

  const navigateToAdminQuestionList = (certificationId, domainId) => {
    navigate(
      `/admin/question/list?certificationId=${certificationId}&domainId=${domainId}&page=1&limit=10&sortBy=id&order=asc`
    );
  };

  // 🆕 Thêm mới domain
  const handleAddNewDomain = async (values) => {
    setAddLoading(true);
    try {
      const body = {
        code: values.code,
        orderNumber: Number(values.orderNumber),
        certificationId: Number(certificationId),
        translations: values.translations?.map((tr) => ({
          languageCode: tr.languageCode,
          name: tr.name,
          description: tr.description,
        })),
      };
      const newDomain = await createDomain(body);
      if (newDomain && newDomain.id) {
        message.success("Thêm domain thành công");
        setAddModalOpen(false);
        form.resetFields();
        fetchDomains(); // Refresh list
      }
    } catch (err) {
      message.error("Không thể thêm domain");
    } finally {
      setAddLoading(false);
    }
  };

  // 🗑️ Xoá domain
  const handleDelete = async (id) => {
    try {
      const res = await deleteDomain(id);
      const code = res?.data?.code ?? res?.code;
      if (String(code) === "1") {
        message.success("Đã xoá domain");
        fetchDomains(pagination.current, pagination.pageSize);
      } else {
        message.error("Xoá domain thất bại");
      }
    } catch (err) {
      message.error("Lỗi khi xoá domain");
    }
  };

  // 🧩 Cột hiển thị bảng
  const columns = [
    {
      title: "Mã domain",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Chương",
      dataIndex: "orderNo",
      key: "orderNo",
      width: 100,
    },
    {
      title: "Bản dịch",
      key: "translations",
      render: (_, record) => (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {(record.domainTranslations || []).map((t) => (
            <li key={t.id}>
              {t.name} - {t.description} (<strong>{t.languageCode}</strong>)
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            style={{
              backgroundColor: "#4ade80",
              color: "#fff",
              border: "none",
            }}
            onClick={() => handleNavigateQuiz(record.id)}
          >
            Học
          </Button>
          <Button size="small" className="bg-green-400">
            Update
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá domain này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button size="small" danger>
              Xoá
            </Button>
          </Popconfirm>
          <Button
            size="small"
            onClick={() =>
              navigateToAdminQuestionList(certificationId, record.id)
            }
          >
            Danh sách câu hỏi
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Domains of Certification {certificationId}</h1>

      <Button
        danger
        size="small"
        style={{ marginBottom: 12 }}
        onClick={() => setAddModalOpen(true)}
      >
        Thêm domain
      </Button>

      {/* Bảng domain có phân trang */}
      <Table
        dataSource={domains}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} domain`,
        }}
        onChange={handleTableChange}
        locale={{ emptyText: "Không có domain" }}
      />

      {/* Modal thêm domain */}
      <Modal
        title="Thêm domain mới"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNewDomain}>
          <Form.Item label="Mã domain" name="code" required>
            <Input />
          </Form.Item>
          <Form.Item label="Chương" name="orderNumber" required>
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
                  <Space
                    key={field.key || field.name}
                    align="baseline"
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      name={[field.name, "languageCode"]}
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
                      rules={[{ required: true, message: "Tên bản dịch" }]}
                    >
                      <Input placeholder="Tên bản dịch" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, "description"]}
                      rules={[{ required: true, message: "Mô tả bản dịch" }]}
                    >
                      <Input placeholder="Mô tả bản dịch" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ color: "red" }}
                    />
                  </Space>
                ))}
              </>
            )}
          </Form.List>
          <div className="flex justify-end">
            <Button onClick={() => setAddModalOpen(false)}>Huỷ</Button>
            <Button type="primary" htmlType="submit" loading={addLoading}>
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
