import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Pagination,
  Table,
  Card,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Input,
  Tag,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import locale from "antd/es/date-picker/locale/vi_VN";
import {
  SearchOutlined,
  ClearOutlined,
  HistoryOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import "./index.css";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import dayjs from "dayjs";
import React from "react";
import ModalLogMain from "../log/ModalLogMain";
import FormSearch from "../../../components/card-search/FormSearch";
import { getStompClient } from "../../../apis/stomp-client/config";

export default function DanhSachActicles() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [registrationPeriodName, setRegistrationPeriodName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   connectStompClient();
  // }, []);

  const stompClient = getStompClient();
  const connect = () => {
    stompClient.connect({}, () => {
      stompClient.subscribe("/portal-articles/get-article", function () {
        fetchData();
      });
    });
  };
  useEffect(() => {
    if (stompClient != null) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stompClient]);
  // useEffect(() => {
  //   const stompClient = getNotifyUserSendArticleToAdmin();
  //   stompClient.connect({}, () => {
  //     stompClient.connect({}, () => {
  //       stompClient.subscribe("/portal-articles/get-article", function () {
  //         fetchData();
  //       });
  //     });
  //   });
  //   // return () => {
  //   //   if (stompClient != null) {
  //   //     stompClient.disconnect();
  //   //   }
  //   // };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleViewLog = () => {
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const fetchData = () => {
    CensorAPI.fetchAll({
      search: search.trim(),
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      registrationPeriodName: registrationPeriodName,
      page: current - 1,
      size: size,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
      if (total > response.data.data.totalPages) {
        setCurrent(1);
      } else {
        setCurrent(response.data.data.currentPage + 1);
      }
    });
    const queryParams = new URLSearchParams(location.search);
    if (search !== "") queryParams.set("search", search);
    if (startDate != null) queryParams.set("startDates", formatDate(startDate));
    if (endDate != null) queryParams.set("endDates", formatDate(endDate));
    if (current != null) queryParams.set("page", current);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(1);
    setSize(pageSize);
  };

  const data = useAppSelector(GetArticles);

  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      render: (_, record) => {
        return (
          <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
            {record.stt}
          </span>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (_, record) => {
        return (
          <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
            {record.title}
          </span>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
            {record.name}
          </span>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (_, record) => {
        return (
          <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
            {formatDate(record.createdDate)}
          </span>
        );
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (_,record) => {
    //     return <span  style={{color: record.registrationCount === 0 ? "red": ""}}>
    //       {record.status === "2" ? "Chờ phê duyệt" : record.status === "7" ? "Gửi lại, chờ phê duyêt" : record.status === "3" ? "Đã phê duyệt" : record.status === "6" ? "Đã gửi cho đào tạo" : "Không xác định"}
    //       </span>
    //   }
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color, text;

        if (
          record.status === "2" ||
          (record.status === 2 && record.registrationCount === 0)
        ) {
          color = "blue"; // Màu đỏ khi status là "2" và registrationCount là 0
          text = "Chờ phê duyệt";
        } else {
          // Xử lý các trạng thái khác
          switch (status) {
            case "7":
              color = "green"; // Màu mặc định cho trạng thái "Gửi lại, chờ phê duyệt"
              text = "Gửi lại, chờ phê duyệt";
              break;
            case "3":
              color = "orange"; // Màu mặc định cho trạng thái "Đã phê duyệt"
              text = "Đã phê duyệt";
              break;
            case "6":
              color = "green"; // Màu mặc định cho trạng thái "Đã gửi cho đào tạo"
              text = "Đã gửi cho đào tạo";
              break;
            default:
              color = "default"; // Màu mặc định cho các trạng thái khác
              text = "Không xác định";
          }
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Đợt viết bài",
      dataIndex: "rpName",
      key: "rpName",
      render: (_, record) => {
        return (
          <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
            {record.rpName}
          </span>
        );
      },
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (record) => (
        <Tooltip title="Xem chi tiết">
          <Link to={`/censor/article/${record.id}`}>
            <Button
              type="link"
              className="btn__table">
              <FormOutlined className="icon" />
            </Button>
          </Link>
        </Tooltip>
      ),
    },
  ];
  const handleClearButtonClick = () => {
    setSearch("");
    setStartDate(null);
    setEndDate(null);
    setRegistrationPeriodName("");
  };

  const handleSearch = () => {
    CensorAPI.fetchAll({
      search: search.trim(),
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      registrationPeriodName: registrationPeriodName,
      page: 0,
      size: size,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
    const queryParams = new URLSearchParams(location.search);
    if (search !== "") queryParams.set("search", search);
    if (startDate != null) queryParams.set("startDates", formatDate(startDate));
    if (endDate != null) queryParams.set("endDates", formatDate(endDate));
    if (current != null) queryParams.set("page", current);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  return (
    <>
      {isModalOpen && (
        <ModalLogMain
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <div>
        <FormSearch>
          <Row gutter={24}>
            <Col
              lg={8}
              sm={24}
              className="w-full">
              <h1 className="label">Tiêu đề và tác giả</h1>
              <Input
                placeholder="Tìm kiếm theo tiêu đề bài viết và tác giả"
                onChange={(event) => setSearch(event.target.value)}
                value={search}
                allowClear
              />
            </Col>
            <Col
              lg={8}
              sm={24}
              className="w-full">
              <h1 className="label">Tên đợt viết bài</h1>
              <Input
                width={"100%"}
                placeholder="Tìm kiếm theo tên đợt viết bài"
                onChange={(event) =>
                  setRegistrationPeriodName(event.target.value)
                }
                value={registrationPeriodName}
                allowClear
              />
            </Col>
            <Col
              lg={7}
              sm={24}
              className=" w-full">
              <h1 className="label">Ngày tạo</h1>
              <div className="flex justify-between">
                <DatePicker
                  size="large"
                  value={startDate}
                  onChange={(el) => setStartDate(el)}
                  locale={locale}
                  className="datePicker"
                  placeholder="Ngày bắt đầu"
                  format="DD-MM-YYYY HH:mm:ss"
                  showTime={{
                    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                  }}
                />
                <DatePicker
                  size="large"
                  value={endDate}
                  onChange={(el) => setEndDate(el)}
                  locale={locale}
                  className="datePicker ml-1"
                  placeholder="Ngày kết thúc"
                  format="DD-MM-YYYY HH:mm:ss"
                  showTime={{
                    defaultValue: dayjs("23:59:59", "HH:mm:ss"),
                  }}
                />
                {/* <Button
                  type="primary"
                  className="search-button"
                  onClick={fetchData}
                  icon={<SearchOutlined />}
                >
                  Tìm kiếm
                </Button> */}
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
                style={{ marginRight: 5 }}>
                Làm mới
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                className="searchButton1"
                onClick={() => handleSearch()}
                icon={<SearchOutlined />}
                style={{ marginLeft: 5 }}>
                Tìm kiếm
              </Button>
            </div>
            <div>
              <Button
                className="searchButton1"
                type="primary"
                onClick={() => {
                  handleViewLog();
                }}
                style={{ marginLeft: 10 }}>
                <HistoryOutlined className="mr-1" />
                Lịch sử
              </Button>
            </div>
          </Col>
        </FormSearch>

        <Card>
          <div>
            <h1 className="text-xl m-0">
              <UnorderedListOutlined className="mr-3" /> Danh sách bài viết
            </h1>
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
          <Row style={{ float: "right" }}>
            <i
              style={{
                margin: " 0 10px 0 10px",
                color: "red",
                fontWeight: "bold",
              }}>
              *** Chú ý: Giảng viên không được giao viết bài trong đợt sẽ được
              bôi đỏ ***
            </i>
          </Row>
        </Card>
      </div>
    </>
  );
}
