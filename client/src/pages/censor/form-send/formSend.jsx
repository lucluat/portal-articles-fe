import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Table,
  Card,
  Input,
  Tooltip,
  Row,
  Col,
  message,
  Modal,
  DatePicker,
  Tag,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  CloseOutlined,
  ClearOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { FormSendAPI } from "../../../apis/censor/form-send/form-send.api";
import {
  GetFormSend,
  SetFormSend,
} from "../../../app/reducers/form-send/form-send.reducer";
import ModalThem from "./ModalAdd";
import "./index.css";
import React from "react";
import dayjs from "dayjs";
import ModalLog from "../log/ModalLog";
import FormSearch from "../../../components/card-search/FormSearch";

export default function FormSend() {
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const fetchData = () => {
    const data = {
      title: title.trim(),
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      page: current - 1,
      size: size,
    };
    FormSendAPI.fetchAll(data).then((response) => {
      dispatch(SetFormSend(response.data.data.data));
      setCurrent(response.data.data.currentPage + 1);
      setTotal(response.data.data.totalPages);
      if (total > response.data.data.totalPages) {
        setCurrent(1);
      } else {
        setCurrent(response.data.data.currentPage + 1);
      }
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(1);
    setSize(pageSize);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.delete(id)
          .then(() => {
            message.success("Xóa thành công!");
            handleSearchButtonClick();
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
      },
    });
  };

  const handleSetDefault = (id) => {
    Modal.confirm({
      title: "Xác nhận ghim",
      content: "Bạn có chắc chắn muốn ghim không?",
      okText: "Ghim",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.setDefault(id)
          .then(() => {
            message.success("Ghim thành công!");
            fetchData();
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
      },
    });
  };

  const handleUnSetDefault = (id) => {
    Modal.confirm({
      title: "Xác nhận hủy ghim",
      content: "Bạn có chắc chắn muốn hủy ghim không?",
      okText: "Hủy ghim",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.unSetDefault(id)
          .then(() => {
            message.success("Hủy ghim thành công!");
            fetchData();
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
      },
    });
  };

  const handleClearButtonClick = () => {
    setTitle("");
    setStartDate(null);
    setEndDate(null);
  };

  const handleViewLog = () => {
    setIsModalOpen(true);
  };

  const data = useAppSelector(GetFormSend);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    const data = {
      title: title.trim(),
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      page: 0,
      size: size,
    };
    FormSendAPI.fetchAll(data).then((response) => {
      dispatch(SetFormSend(response.data.data.data));
      setCurrent(response.data.data.currentPage + 1);
      setTotal(response.data.data.totalPages);
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      render: (text, record) => {
        const isRed = record.defaulted === true; // Kiểm tra trạng thái status
        const shortenedText =
          text.length > 50 ? text.substring(0, 50) + "..." : text;
        return (
          <span style={{ color: isRed ? "red" : "inherit" }}>
            {shortenedText}
          </span>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag
          color={isActive === "1" || isActive === "ACTIVE" ? "green" : "red"}
        >
          {isActive === "1" || isActive === "ACTIVE"
            ? "Hoạt động"
            : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title={record.defaulted ? "Hủy ghim" : "Ghim"}>
            <Button
              type="link"
              className="btn__table"
              onClick={() =>
                record.defaulted
                  ? handleUnSetDefault(record.key)
                  : handleSetDefault(record.key)
              }
            >
              {record.defaulted ? (
                <CloseOutlined className="icon" />
              ) : (
                <PushpinOutlined className="icon" />
              )}
            </Button>
          </Tooltip>
          <Tooltip title="Cập nhật">
            <Button
              type="link"
              className="btn__table"
              onClick={() => {
                setDetailCategory(record);
                setShowModal(true);
              }}
            >
              <EditOutlined className="icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="link"
              className="btn__table"
              onClick={() => handleDelete(record.key)}
            >
              <DeleteOutlined className="icon" />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      {isModalOpen && (
        <ModalLog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          path={1}
        />
      )}
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          category={detailCategory}
          SetCategory={setDetailCategory}
          fetchData={() => fetchData()}
        />
      )}

      <FormSearch>
        <Row gutter={24}>
          <Col lg={12} sm={24} className="w-full">
            <h1 className="label">Tiêu đề form</h1>
            <Input
              placeholder="Tìm kiếm theo tiêu đề form"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
          <Col lg={12} sm={24} className="w-full">
            <h1 className="label">Ngày tạo</h1>
            <Row gutter={24}>
              <Col span={12} className="w-full">
                <DatePicker
                  size="large"
                  value={startDate}
                  onChange={(el) => setStartDate(el)}
                  locale={locale}
                  className="datePicker1 w-full"
                  placeholder="Ngày bắt đầu"
                  format="DD-MM-YYYY HH:mm:ss"
                  showTime={{
                    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                  }}
                />
              </Col>
              <Col span={12} className="w-full">
                <DatePicker
                  value={endDate}
                  size="large"
                  onChange={(el) => setEndDate(el)}
                  locale={locale}
                  className="datePicker1 w-full"
                  placeholder="Ngày kết thúc"
                  format="DD-MM-YYYY HH:mm:ss"
                  showTime={{
                    defaultValue: dayjs("23:59:59", "HH:mm:ss"),
                  }}
                />
              </Col>

              {/* <Button
                type="primary"
                className="search-button"
                onClick={handleSearchButtonClick}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button> */}
            </Row>
          </Col>
        </Row>
        <Col className="flex justify-center mt-5">
          {/* Hàng ch?a hai nút */}
          <div>
            <Button
              type="primary"
              className="searchButton1"
              onClick={handleClearButtonClick}
              icon={<ClearOutlined />}
              style={{ marginRight: 5 }}
            >
              Làm mới
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              className="searchButton1"
              onClick={handleSearchButtonClick}
              icon={<SearchOutlined />}
              style={{ marginLeft: 5 }}
            >
              Tìm kiếm
            </Button>
          </div>
        </Col>
      </FormSearch>

      <Card>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl m-0">
                <UnorderedListOutlined className="mr-3" /> Danh sách form
              </h1>
            </div>
            <div>
              <span>
                <button
                  className="header_card_button mx-3"
                  onClick={() => {
                    handleViewLog();
                  }}
                >
                  <HistoryOutlined className="mr-1" />
                  Lịch sử
                </button>
                <button
                  className="header_card_button"
                  onClick={() => {
                    setShowModal(true);
                    setDetailCategory(null);
                  }}
                >
                  <PlusOutlined className="mr-1" />
                  Thêm form
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
          />
        </div>
        <div className="mt-5 text-center">
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={(value) => {
              setCurrent(value);
            }}
            current={current}
            total={total * size}
          />
        </div>
      </Card>
    </>
  );
}
