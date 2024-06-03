import { Form, Input, Modal, message } from "antd";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import "./index.css";
const ModalThem = (props) => {
  const onFinishFailed = () => {
    message.error("Error");
  };
  const { modalOpen, setModalOpen, category, isSendArticle, fetchData } = props;
  const [form] = Form.useForm();

  if (category) {
    form.setFieldsValue(category);
  }
  const onFinish = () => {
    form
      .validateFields()
      .then((formValues) => {
        if (category === null) {
          CategoryAPI.create(formValues)
            .then((result) => {
              fetchData();
              message.success("Thành công!");
              if (isSendArticle) {
                props.onSave(result.data.data);
              }
              setModalOpen(false);
              form.resetFields();
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                message.error(error.response.data.message);
              } else {
                message.error("Lỗi.");
              }
            });
        } else {
          CategoryAPI.update(formValues, category.id)
            .then((response) => {
              fetchData();
              message.success("Thành công!");
              if (isSendArticle) {
                props.onSave(response.data.data);
              }
              setModalOpen(false);
              form.resetFields();
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                message.error(error.response.data.message);
              } else {
                message.error("Lỗi.");
              }
            });
        }
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin.");
      });
  };

  const onCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const validateSpace = (rule, value, callback) => {
    if (/\s{2,}/.test(value)) {
      callback("Không được chứa nhiều khoảng trắng liên tục");
    } else if (/^\s|\s$/.test(value)) {
      callback("Không được chứa khoảng trắng ở đầu hoặc cuối");
    } else {
      callback();
    }
  };

  return (
    <>
      <Modal
        title="Thể loại bài viết"
        open={modalOpen}
        onCancel={onCancel}
        footer={null}
      >
        <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          {/* <Form.Item label="Mã" name="code">
            <Input disabled />
          </Form.Item> */}

          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên thể loại không được để trống",
              },
              {
                min: 4,
                message: "Tên thể loại phải tối thiểu 4 kí tự",
              },
              {
                max: 255,
                message: "Tên thể loại chỉ tối đa 255 kí tự",
              },
              {
                validator: validateSpace,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <button onClick={onCancel} className="submit-button">
              Đóng
            </button>
            <button htmlType="submit" className="submit-button ml-2">
              OK
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalThem;
