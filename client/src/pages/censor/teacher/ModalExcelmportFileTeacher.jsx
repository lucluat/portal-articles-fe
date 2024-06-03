import Modal from "antd/es/modal/Modal";
import "./index.css";
import { Button, Tooltip, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CensorRegistrationUserAPI } from "../../../apis/censor/registration-user/registration-user.api";

const ModalExcelmportFileTeacher = (props) => {
  const { visible, onClose, id, fetchData } = props;
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImportFile = () => {
    CensorRegistrationUserAPI.downloadExcel_xlsx()
      .then((res) => {
        message.success("Tải về thành công");
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "template_import_giang_vien.xlsx"; // Tên file tải về
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        message.error("Lỗi", err);
      });
    onClose();
  };

  const handleUpload = (file) => {
    const isExcel =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      message.error("Vui lòng chọn một tệp Excel (.xlsx)!");
      return false;
    }

    setSelectedFile(file);
    return false;
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      // Gọi hàm để gửi tệp Excel đến BE
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("idTeacher", id);
      CensorRegistrationUserAPI.importExcel(formData)
        .then((response) => {
          if (
            response.headers["content-type"] ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            // Xử lý trường hợp tệp Excel lỗi
            const blob = new Blob([response.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              "template_import_giang_vien_error.xlsx"
            );
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.error("Bạn có 1 file dữ liệu lỗi !!");
          } else {
            message.success("Thành công!");
          }
          setSelectedFile(null);
          onClose();
          fetchData();
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message.error(error.response.data.message);
          } else {
            message.error("Lỗi hệ thống");
          }
        });
    }
  };

  return (
    <Modal
      title="Tải lên File Excel"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button type="primary" onClick={handleImportFile}>
          Mẫu Excel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUploadClick}
          disabled={!selectedFile}
        >
          Tải lên
        </Button>,
      ]}
    >
      <hr className="border-0 bg-gray-300 mt-3 mb-6" />
      <div style={{ textAlign: "center" }}>
        <Tooltip title=" Tải lên Excel">
          <Upload
            listType="picture"
            accept=".xlsx"
            multiple={false}
            maxCount={1}
            beforeUpload={handleUpload}
          >
            <Button
              icon={<InboxOutlined />}
              className="upload-button "
              style={{
                fontSize: "16px",
              }}
            >
              Tải lên Excel
            </Button>
          </Upload>
        </Tooltip>
      </div>
    </Modal>
  );
};

export default ModalExcelmportFileTeacher;
