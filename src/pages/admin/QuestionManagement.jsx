import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { useSearchParams } from "react-router-dom";
import { getQuestions } from "../../api/quizApi";

export default function QuestionManagement() {
  const [searchParams] = useSearchParams();
  const certificationId = searchParams.get("certificationId");
  const domainId = searchParams.get("domainId");
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const sortBy = searchParams.get("sortBy") || "id";
  const order = searchParams.get("order") || "asc";

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({
    current: Number(page),
    pageSize: Number(limit),
    total: 0,
  });

  // 🧭 Gọi API lấy danh sách câu hỏi
  const fetchQuestions = async (currentPage = page) => {
    try {
      setLoading(true);
      const data = await getQuestions({
        certificationId,
        domainId,
        language: "vi",
        page: currentPage,
        limit,
        sortBy,
        order,
      });
      setQuestions(data.data || []);
      setPagination({
        current: data.pagination.page,
        pageSize: data.pagination.limit,
        total: data.pagination.total,
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [certificationId, domainId, page, limit, sortBy, order]);

  // 🧩 Cấu hình cột cho bảng
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Nội dung câu hỏi",
      dataIndex: "questionTranslations",
      key: "questionText",
      render: (translations) => translations?.[0]?.questionText || "—",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // 🧠 Xử lý Update
  const handleUpdate = (record) => {
    message.info(`Cập nhật câu hỏi ID: ${record.id}`);
    // Ở đây bạn có thể mở modal, hoặc navigate đến trang edit
  };

  // 🗑️ Xử lý Delete
  const handleDelete = (record) => {
    message.success(`Đã xoá câu hỏi ID: ${record.id}`);
    // Thực tế: gọi API xoá, sau đó fetch lại danh sách
  };

  // 📋 Render bảng
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        Danh sách câu hỏi (Domain {domainId})
      </h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={questions}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page) => fetchQuestions(page),
        }}
      />
    </div>
  );
}
