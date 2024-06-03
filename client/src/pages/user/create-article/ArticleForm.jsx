import {
  FolderAddOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Form,
  Modal,
  Button,
  Input,
  Select,
  Row,
  message,
  Upload,
  Image,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { convertFileToBase64Only } from "../../../helper/convertUlti";

const ModalForm = ({ visible, onCancel, onOk, data, isUpdatePage }) => {
  const options = [{ value: "fptpolytechnic", label: "fptpolytechnic" }];
  const [registrationPeriod, setRegistrationPeriod] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      setImagePreview(data.previewImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  const handleSaveDraft = () => {
    form
      .validateFields()
      .then((formValues) => {
        const formData = {
          title: formValues.title,
          hashtags: formValues.hashtags,
          registrationPeriodId: formValues.idRegistration,
          isChoose: "draft",
          previewImage: fileList.length === 0 ? null : fileList[0],
        };
        onOk(formData);
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin.");
      });
  };

  const handleSavePublic = () => {
    form
      .validateFields()
      .then((formValues) => {
        const formData = {
          title: formValues.title,
          hashtags: formValues.hashtags,
          registrationPeriodId: formValues.idRegistration,
          isChoose: "public",
          previewImage: fileList.length === 0 ? null : fileList[0],
        };
        onOk(formData);
      })
      .catch((error) => {
        message.error("Vui lòng điền đầy đủ thông tin.");
      });
  };

  useEffect(() => {
    MyArticleAPI.fetchRegistraition().then((res) => {
      setRegistrationPeriod(res.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // const uploadedImage = null;
  const checkFileAvatar = (request) => {
    if (imagePreview !== null) {
      if (request.file.size <= 0) {
        message.error("Yêu cầu không nhập file rỗng");
        setFileList([]);
        return;
      }
      if (request.file.size > 10000000) {
        message.error("Yêu cầu file không được quá 10MB");
        setFileList([]);
        return;
      }
      if (
        !request.file.name.includes(".png") &&
        !request.file.name.includes(".jpg")
      ) {
        message.error("Vui lòng chọn một tệp ảnh file PNG hoặc JPG.");
        setFileList([]);
        return;
      }

      // Cập nhật danh sách file
      setFileList([request.file]);
      convertFileToBase64Only(request.file)
        .then((base64String) => {
          setImagePreview(`data:image/png;base64,${base64String}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Modal
      title="Đăng bài viết"
      width={700}
      footer={
        <>
          <Row className="justify-end">
            <Button className="mx-10" onClick={onCancel}>
              Đóng
            </Button>
            <Button
              type="primary"
              className="mx-10"
              icon={<FolderAddOutlined />}
              onClick={handleSaveDraft}
            >
              Lưu
            </Button>
            <Button
              type="primary"
              className="mr-10"
              icon={<SendOutlined />}
              onClick={handleSavePublic}
            >
              {isUpdatePage ? "Cập nhật" : "Tạo bài viết"}
            </Button>
          </Row>
        </>
      }
      visible={visible}
      onCancel={onCancel}
    >
      <>
        <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <Form form={form} initialValues={data} {...layout}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề bài viết",
                whitespace: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value.trim() && value.trim().length >= 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Tiêu đề phải có ít nhất 6 ký tự");
                },
              }),
            ]}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>

          <Form.Item
            name="idRegistration"
            label="Đợt viết bài"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Mời bạn chọn đợt viết bài"
              options={registrationPeriod.map((el) => ({
                value: el.id,
                label: el.name,
              }))}
            ></Select>
          </Form.Item>
          <Form.Item
            name="hashtags"
            label="HashTag"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              mode="tags"
              className="w-11/12"
              size="large"
              tokenSeparators={[","]}
              options={options}
              placeholder="Hashtag"
            />
          </Form.Item>
          <Form.Item name="image" label="Ảnh thu nhỏ">
            <Upload
              className="update_image_article"
              listType="picture"
              fileList={fileList}
              customRequest={checkFileAvatar}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Row>
            <Col span={6}></Col>
            <Col span={18}>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Chọn ảnh"
                  style={{ maxWidth: "100%", marginBottom: "10px" }}
                />
              )}
            </Col>
          </Row>
        </Form>
      </>
    </Modal>
  );
};

export default ModalForm;
