import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Table,
  Card,
  Input,
  Select,
  DatePicker,
  Col,
  Row,
  Modal,
  message,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  ClearOutlined,
  SearchOutlined,
  DownloadOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
  DeleteFilled,
  FormOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import {
  GetRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../app/reducers/registration-period/registration-period.reducer";
import ModalThem from "./ModalAdd";
import moment from "moment";
import { Link } from "react-router-dom";
import "./index.css";
import ModalExcelmportFile from "./ModalExcelmportFile";
import React from "react";
import dayjs from "dayjs";
import { TeacherAPI } from "../../../apis/censor/teacher/teacher.api";
import ModalLog from "../log/ModalLog";
import FormSearch from "../../../components/card-search/FormSearch";

export default function RegistrationPeriod() {
  const [showModal, setShowModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [detailRegistrationPeriod, setDetailRegistrationPeriod] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [check, setCheck] = useState(false);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startQuantity, setStartQuantity] = useState(null);
  const [endQuantity, setEndQuantity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Start excel
  const [showModalExcel, setShowModalExcel] = useState(false);
  const handleOpenModalExcel = () => {
    setShowModalExcel(true);
  };
  // End excel

  useEffect(() => {
    CensorRegistrationPeriodAPI.fetchAll().then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  }, [dispatch]);

  useEffect(() => {
    TeacherAPI.getAllTeacher().then((response) => {});
  }, []);

  const data = useAppSelector(GetRegistrationPeriod);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const fetchData = () => {
    SetRegistrationPeriod([]);
    const data = {
      search: search.trim(),
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      status: status,
      startQuantity: startQuantity,
      endQuantity: endQuantity,
      page: current - 1,
      size: size,
    };
    CensorRegistrationPeriodAPI.fetchAll(data).then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
      if (total > response.data.data.totalPages) {
        setCurrent(1);
      } else {
        setCurrent(response.data.data.currentPage + 1);
      }
    });
  };

  const handleViewLog = () => {
    setIsModalOpen(true);
  };

  let dataMap = [];
  if (check) {
    dataMap = data.map((item) => {
      const fromDateFormatted = moment(item.fromDate).format("DD/MM/YYYY");
      const toDateFormatted = moment(item.toDate).format("DD/MM/YYYY");
      return {
        ...item,
        date: `${fromDateFormatted} - ${toDateFormatted}`,
      };
    });
  }
  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      render: (text) => <span>{text}</span>,
      // ...getColumnSearchProps("code"),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <span>{text}</span>;
      },
      // ...getColumnSearchProps("name"),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số lượng BV quy định",
      dataIndex: "numberArticle",
      key: "numberArticle",
      align: "center",
      render: (text, record) => {
        return <span>{record.numberArticles}</span>;
        //   record.numberArticleExistInRes === undefined
        //     ? "0"
        //     : record.numberArticleExistInRes
        // } /
        // ${record.numberArticles}`;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "registrationPeriodStatus",
      key: "registrationPeriodStatus",
      render: (registrationPeriodStatus) => {
        const isActive =
          parseInt(registrationPeriodStatus) === 0 ||
          registrationPeriodStatus === "ACTIVE";

        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Hoạt động" : "Không hoạt động"}
          </Tag>
        );
      },
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link
              to={`/censor/registration-period/${record.id}`}
              // onClick={() => handleUpdateClick(record)}
            >
              <Button type="link" className="btn__table">
                <FormOutlined className="icon" />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              className="btn__table"
              onClick={() => handleDeleteRegistration(record.id)}
              type="link"
            >
              <DeleteFilled />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];
  const handleDeleteRegistration = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa đợt",
      content: "Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa đợt",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        CensorRegistrationPeriodAPI.delete(id)
          .then(() => {
            message.success("Xóa đợt thành công!");
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

  const handleSearchButtonClick = () => {
    setCurrent(1);
    SetRegistrationPeriod([]);
    const regex = /^[0-9]+$/;

    if (startQuantity !== null && !regex.test(startQuantity)) {
      message.error("Số lượng bài viết phải là số nguyên dương");
      return;
    }
    if (endQuantity !== null && !regex.test(endQuantity)) {
      message.error("Số lượng bài viết phải là số nguyên dương");
      return;
    }

    const data = {
      search: search.trim(),
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      status: status,
      startQuantity: startQuantity,
      endQuantity: endQuantity,
      page: 0,
      size: size,
    };
    CensorRegistrationPeriodAPI.fetchAll(data).then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  };

  const handleClearButtonClick = () => {
    setSearch("");
    setStatus("");
    setStartDate(null);
    setEndDate(null);
    setEndQuantity(null);
    setStartQuantity(null);
    fetchData();
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(0);
    setSize(pageSize);
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;

    if (name === "startQuantity") {
      if (value.trim().length === 0) {
        setStartQuantity(null);
      } else {
        setStartQuantity(value);
      }
    } else if (name === "endQuantity") {
      if (value.trim().length === 0) {
        setEndQuantity(null);
      } else {
        setEndQuantity(value);
      }
    }
  };

  return (
    <>
      {isModalOpen && (
        <ModalLog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          path={2}
        />
      )}
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          width={1200}
        />
      )}
      <FormSearch>
        <Row className="justify-between">
          <Col span={11}>
            {/* Hàng 1 */}
            <div>
              <h1 className="label">Tìm kiếm theo tên hoặc mã:</h1>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc mã..."
              />
            </div>
            <div>
              <h1 className="label">Số lượng bài viết quy định: </h1>
              <Row className="justify-between">
                <Col span={11}>
                  <Input
                    name="startQuantity"
                    placeholder="Từ: "
                    type="number"
                    value={startQuantity}
                    onChange={handleQuantityChange}
                  />
                </Col>
                <Col span={11}>
                  <Input
                    name="endQuantity"
                    placeholder="Đến: "
                    type="number"
                    value={endQuantity}
                    onChange={handleQuantityChange}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={11}>
            {/* Hàng 2 */}
            <div>
              <h1 className="label">Trạng thái: </h1>
              <Select
                style={{ width: "100%", height: 40 }}
                placeholder="Chọn status"
                value={status}
                onChange={(value) => setStatus(value)}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value="0">Hoạt động</Select.Option>
                <Select.Option value="1">Không hoạt động</Select.Option>
              </Select>
            </div>
            <div>
              <h1 className="label">Ngày diễn ra đợt: </h1>
              <Row className="justify-between">
                {/* <div className="flex justify-between"> */}
                <Col span={11}>
                  <DatePicker
                    value={startDate}
                    onChange={(el) => setStartDate(el)}
                    className="datePicker"
                    placeholder="Ngày bắt đầu"
                    style={{ height: 40, width: "100%" }}
                    format="DD-MM-YYYY HH:mm:ss"
                    showTime={{
                      defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                    }}
                  />
                </Col>
                <Col span={11}>
                  <DatePicker
                    value={endDate}
                    onChange={(el) => setEndDate(el)}
                    className="datePicker"
                    placeholder="Ngày kết thúc"
                    style={{ height: 40, width: "100%" }}
                    format="DD-MM-YYYY HH:mm:ss"
                    showTime={{
                      defaultValue: dayjs("23:59:59", "HH:mm:ss"),
                    }}
                  />
                </Col>
              </Row>
              {/* </div> */}
            </div>
          </Col>
        </Row>
        <Col className="flex justify-center mt-5">
          {/* Hàng chứa hai nút */}
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
                <UnorderedListOutlined className="mr-3" /> Danh sách đợt đăng ký
              </h1>
            </div>
            <div>
              <button
                onClick={handleOpenModalExcel}
                className="header_card_button mx-3"
              >
                <DownloadOutlined className="mr-1" />
                Import File
              </button>
              <button
                onClick={() => {
                  handleViewLog();
                }}
                className="header_card_button"
              >
                <HistoryOutlined className="mr-1" />
                Lịch sử
              </button>
              <button
                className="header_card_button mx-3"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <PlusOutlined className="mr-1" />
                Tạo đợt đăng ký
              </button>

              <Link to={`/censor/registration-period/add`}>
                <button className="header_card_button">
                  <PlusOutlined className="mr-1" />
                  Tạo nhanh đợt đăng ký
                </button>
              </Link>
            </div>
            {showModalExcel && (
              <ModalExcelmportFile
                visible={showModalExcel}
                onClose={() => setShowModalExcel(false)}
                fetchData={() => fetchData()}
              />
            )}
          </div>
        </div>

        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={dataMap}
            rowKey="id"
            pagination={false}
            key={"TableDetail"}
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
