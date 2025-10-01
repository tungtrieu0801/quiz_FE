import { useState } from "react";
import { Button, Card, Radio, Alert } from "antd";
import { useParams } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "Java 17 có phải LTS không?",
    options: ["Có", "Không"],
    answer: "Có",
    explanation: "Java 17 là phiên bản LTS (Long Term Support) phát hành tháng 9/2021.",
  },
  {
    id: 2,
    question: "Từ khóa để định nghĩa hằng trong Java?",
    options: ["let", "const", "final"],
    answer: "final",
    explanation: "Trong Java, dùng từ khóa 'final' để khai báo hằng số.",
  },
];

export default function QuizPage() {
  const { id } = useParams(); // id quiz được truyền từ URL
  const currentq = questions.find(q => q.id === Number(id)) || questions[0];

  const [currentId, setCurrentId] = useState(questions[0].id);
  const [selected, setSelected] = useState({});
  const [confirmed, setConfirmed] = useState({});
  const current = questions.find((q) => q.id === currentId);

  const handleConfirm = () => {
    if (!selected[currentId]) return;
    setConfirmed((prev) => ({ ...prev, [currentId]: true }));
  };

  return (
    <div className="flex gap-4">
      {/* Sidebar (20%) */}
      <aside className="w-1/5 bg-gray-100 p-2">
        <div className="grid grid-cols-2 gap-2">
          {questions.map((q) => (
            <Button
              key={q.id}
              type={currentId === q.id ? "primary" : "default"}
              onClick={() => setCurrentId(q.id)}
              className="w-full"
            >
              {q.id}
            </Button>
          ))}
        </div>
      </aside>

      {/* Nội dung (80%) */}
      <section className="flex-1">
        <Card title={`Câu hỏi ${current.id}`}>
          <p className="mb-4">{current.question}</p>

          {/* Danh sách đáp án */}
          <Radio.Group
            onChange={(e) => setSelected({ ...selected, [currentId]: e.target.value })}
            value={selected[currentId]}
            disabled={confirmed[currentId]} // khoá chọn khi đã xác nhận
          >
            {current.options.map((opt, i) => (
              <Radio key={i} value={opt} style={{ display: "block", margin: "8px 0" }}>
                {opt}
              </Radio>
            ))}
          </Radio.Group>

          {/* Nút xác nhận */}
          {!confirmed[currentId] && (
            <Button
              type="primary"
              onClick={handleConfirm}
              disabled={!selected[currentId]}
              className="mt-4"
            >
              Xác nhận
            </Button>
          )}

          {/* Kết quả + giải thích */}
          {confirmed[currentId] && (
            <div className="mt-4">
              {selected[currentId] === current.answer ? (
                <Alert message="Chính xác! 🎉🎉🎉" type="success" showIcon />
              ) : (
                <Alert message={`Sai rồi. Đáp án đúng là: ${current.answer}`} type="error" showIcon />
              )}
              <p className="mt-2 text-gray-700">
                <strong>Giải thích:</strong> {current.explanation}
              </p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
