import { useEffect, useState } from "react";
import { useCertificationStore } from "../store/certificationStore";
import { getDetailCertification } from "../api/certification";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spin } from "antd";

export default function CertificationPage() {
  const { certifications, loading, error, fetchCertifications } = useCertificationStore();
  const [openId, setOpenId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleOpen = async (id) => {
    setOpenId(id);
    setLoadingDetail(true);
    try {
      const res = await getDetailCertification(id, "vi");
      setDetail(res);
    } catch (err) {
      console.error("Failed to fetch detail:", err);
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
      // Khi bấm Học
        navigate(`/${detail.id}/domains`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách chứng chỉ</h1>
      <ul className="grid grid-cols-5 gap-4 p-4 w-full">
  {certifications?.data?.map((cert) => (
    <li key={cert.id}>
      <div
        onClick={() => handleOpen(cert.id)}
        className="cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                   border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                   shadow-sm hover:shadow-lg hover:border-blue-500 
                   transition duration-200 ease-in-out 
                   flex items-center justify-center h-24 text-center p-2"
      >
        <div className="font-bold text-lg">
          {cert.code} - {cert.vendor}
        </div>
      </div>
    </li>
  ))}
</ul>


      {/* Ant Design Modal */}
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
    </div>
  );
}
