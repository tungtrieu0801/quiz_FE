import { useEffect, useState } from "react";
import { Button, Card, Radio, Alert, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { getQuestions } from "../api/quizApi";
import { useLanguageStore } from "../store/useLanguageStore";

export default function QuizPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const certificationId = params.get("certificationId");
  const domainId = params.get("domainId");
  const page = params.get("page") || 1;
  const limit = params.get("limit") || 10;
  const sortBy = params.get("sortBy") || "id";
  const order = params.get("order") || "asc";
  const language = useLanguageStore((state) => state.language);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [selected, setSelected] = useState({});
  const [confirmed, setConfirmed] = useState({});

  // Chuyển đổi dữ liệu API sang dạng dễ dùng cho UI
  function mapApiQuestions(apiData, language) {
    return (apiData || []).map((q) => {
      const qTrans =
        (q.questionTranslations || []).find(
          (qt) => qt.languageCode === language
        ) || q.questionTranslations?.[0] || {};
      const options = [];
      let answer = null;
      (q.answers || []).forEach((ans) => {
        const ansTrans =
          (ans.answerTranslations || []).find(
            (at) => at.languageCode === language
          ) || ans.answerTranslations?.[0];
        if (ansTrans) {
          options.push({
            id: ans.id,
            text: ansTrans.answerText,
            isCorrect: ans.isCorrect,
          });
          if (ans.isCorrect) answer = ansTrans.answerText;
        }
      });
      return {
        id: q.id,
        question: qTrans.questionText,
        explanation: qTrans.explanation,
        options,
        answer,
      };
    });
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getQuestions({
          certificationId,
          domainId,
          language,
          page,
          limit,
          sortBy,
          order,
        });
        const mapped = mapApiQuestions(res?.data, language);
        setQuestions(mapped);
        setCurrentId(mapped.length > 0 ? mapped[0].id : null);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [certificationId, domainId, language, page, limit, sortBy, order]);

  const current = questions.find((q) => q.id === currentId);

  // 🔹 Reset selected & confirmed khi chuyển câu hỏi
  useEffect(() => {
    if (currentId) {
      setSelected((prev) => ({ ...prev, [currentId]: null }));
      setConfirmed((prev) => ({ ...prev, [currentId]: false }));
    }
  }, [currentId]);

  const handleConfirm = () => {
    if (!selected[currentId]) return;
    setConfirmed((prev) => ({ ...prev, [currentId]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!questions.length) {
    return <div className="text-center mt-10">Không có câu hỏi nào.</div>;
  }

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
        {current ? (
          <Card title={`Câu hỏi ${current.id}`}>
            <p className="mb-4">{current.question}</p>

            {/* Danh sách đáp án */}
            <Radio.Group
              onChange={(e) =>
                setSelected({ ...selected, [currentId]: e.target.value })
              }
              value={selected[currentId]}
              disabled={confirmed[currentId]}
            >
              {(current.options || []).map((opt) => (
                <Radio
                  key={opt.id}
                  value={opt.text}
                  style={{ display: "block", margin: "8px 0" }}
                >
                  {opt.text}
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
                  <Alert
                    message={`Sai rồi. Đáp án đúng là: ${current.answer}`}
                    type="error"
                    showIcon
                  />
                )}
                <p className="mt-2 text-gray-700">
                  <strong>Giải thích:</strong> {current.explanation}
                </p>
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <p>Không có câu hỏi nào.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
