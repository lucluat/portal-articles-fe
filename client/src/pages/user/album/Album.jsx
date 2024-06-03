import { useEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Empty,
  message,
} from "antd";
import "./album.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  AddAlbum,
  GetAlbum,
  SetAlbum,
} from "../../../app/reducers/album/album.reducer";
import { AuthAlbumAPI } from "../../../apis/user/auth/album/user.album.api";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import {
  // CheckCircleOutlined,
  // LockOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import React from "react";

export default function Album() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(false);
  const [hasData, setHasData] = useState(false);

  const getAllAlbum = () => {
    AuthAlbumAPI.fetchAllAlbum().then((response) => {
      dispatch(SetAlbum(response.data.data));
      if (response.data.data.length > 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    });
  };

  const dataAlbum = useAppSelector(GetAlbum);
  useEffect(() => {
    getAllAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleClickAlbum = (id) => {
    navigate(`/user/album/${id}`);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSubmit = (values) => {
    const data = {
      title: values.title,
      status: values.status,
    };
    addAlbum(data);
    setShowModal(false);
  };

  const addAlbum = async (data) => {
    try {
      const response = await AuthAlbumAPI.addAlbum(data);
      dispatch(AddAlbum(response.data));
      message.success("Tạo mới album thành công");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Lỗi hệ thống");
      }
    }
    getAllAlbum();
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
    <div>
      <div className="flex flex-row-reverse">
        <Button onClick={handleOpenModal} type="primary" className="btn-add">
          Tạo mới album
        </Button>
      </div>
      {hasData ? (
        <>
          {dataAlbum.map((a) => (
            <Card className="mb-4" onClick={() => handleClickAlbum(a.id)}>
              <Row>
                <Col span={3} className="col-anh">
                  <Image
                    alt="example"
                    src={a.userImg}
                    style={{
                      width: "320px",
                      height: "110px",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
                <Col span={20}>
                  <div className="pt-1">
                    <span className="title">{a.title}</span>

                    <p className="text-lg -mt-1 -mb-2">{a.userName}</p>

                    <div className="">
                      <CalendarOutlined className="w-6 h-6 pt-5" />
                      <span>{formatDate(a.creatAt)}</span>
                    </div>
                  </div>
                  <div>
                    {a.status === false ? (
                      <div>
                        <CheckCircleOutlined />
                        <span className="ml-3">Công khai</span>
                      </div>
                    ) : a.status === true ? (
                      <div>
                        <LockOutlined />
                        <span className="ml-3">Riêng tư</span>
                      </div>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </>
      ) : (
        <Empty
          description={"Không có album"}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "0",
            right: "0",
            zIndex: "0",
          }}
        />
      )}
      {showModal && (
        <Modal
          title="Tạo mới album"
          open={showModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form onFinish={handleSubmit}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                {
                  required: true,
                  // message: "Vui lòng nhập tiêu đề",
                  message: <span className="ml-4">Vui lòng nhập tiêu đề</span>,
                },
                {
                  pattern:
                    /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
                  message: "Tiêu đề không được có các kí tự đặc biệt",
                },
                {
                  min: 6,
                  message: "Tiêu đề không được nhỏ hơn 6 kí tự",
                },
                {
                  max: 250,
                  message: "Tiêu đề không được nhiều hơn 250 kí tự",
                },
                {
                  validator: validateSpace,
                },
              ]}
            >
              <Input
                style={{ width: 400, marginLeft: 14 }}
                value={title}
                onChange={handleTitleChange}
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Bạn cần phải chọn 1 trạng thái cho album",
                },
              ]}
            >
              <Select value={status} onChange={handleStatusChange}>
                <Select.Option value={false}>Công khai</Select.Option>
                <Select.Option value={true}>Riêng tư</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 24,
              }}
              className="pt-5 -mb-1"
            >
              <Button
                key="cancel"
                onClick={handleCloseModal}
                className="submit-button"
              >
                Đóng
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                className="submit-button ml-2"
              >
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
