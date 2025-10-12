import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createDomain, deleteDomain, getAllDomain } from "../api/domainApi";
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useLanguageStore } from "../store/useLanguageStore";
const LANG_OPTIONS = [
  { label: "Tiếng Việt", value: "vi" },
  { label: "English", value: "en" },
  // Thêm ngôn ngữ khác nếu cần
];

export default function DomainPage() {
  const param = useParams();
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const { certificationId } = useParams();
  const [addLoading, setAddLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const certName = useLocation().state?.certificationName;
  const language = useLanguageStore(state => state.language);

  useEffect(() => {
    if (!certificationId) return;
    const fetchDomains = async () => {
      const res = await getAllDomain(certificationId, language);
      console.log("Data", res)
      setDomains(Array.isArray(res.data) ? res.data : []);
    };
    fetchDomains();
  }, [certificationId]);

  const handleNavigateQuiz = (domainId) => {
      navigate(`/quizpage?certificationId=${certificationId}&domainId=${domainId}&language=vi&page=1&limit=10&sortBy=id&order=asc`);
  };

  const handleAddNewDomain = async (values) => {
    setAddLoading(true);
    try {
      const body = {
        code: values.code,
        orderNumber: Number(values.orderNumber),
        certificationId: Number(param.certificationId),
        translations: values.translations?.map(tr => ({
          languageCode: tr.languageCode,
          name: tr.name,
          description: tr.description
        })),
      }
      console.log("body", body);
      const newDomain = await createDomain(body);
      if (newDomain && newDomain.id) {
        setDomains((prev) => [...prev, newDomain]);
        setAddModalOpen(false);
        form.resetFields();
      }
    } catch {

    } finally {
      setAddLoading(false);
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteDomain(id);
      const code = res?.data?.code ?? res?.code;
      if (String(code) === "1") {
        setDomains((prev) => prev.filter((item) => String(item.id) !== String(id)));
      } else {
      }
    } catch (err) {
    }
  };

  const columns = [
    {
      title: "Mã domain",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Chương",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "Bản dịch",
      key: "translations",
      render: (_, record) => (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {(record.domainTranslations || []).map((t) => (
            <li key={t.id}>
              {t.name} - {t.description}( <strong>{t.languageCode}</strong> )
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Thao tac",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            style={{ backgroundColor: "#4ade80", color: "#fff", border: "none" }}
            onClick={() => handleNavigateQuiz(record.id)}
          >
            Học
          </Button>
          <Button className="bg-green-400" size="small" onClick={() => handleEdit(record)}>
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
        </Space>
      )
    }
  ];

  return (
    <div>
      <h1 className="text-2xl" >Chapter in {certName}</h1>
      <Button danger size="small" onClick={() => setAddModalOpen(true)}> them </Button>
      <Table
        dataSource={domains}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: "Khong co domain" }}
        pagination={false}>
      </Table>
      {/* Add modal */}
      <Modal
        title="Theem module moi"
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNewDomain}>
          <Form.Item label="Mã domain" name="code">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Chương" name="orderNumber">
            <Input></Input>
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
            <Button onClick={() => setAddModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit" loading={addLoading}>Them</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}