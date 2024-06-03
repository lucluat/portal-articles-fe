import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Input,
  Select,
  Tag,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import {
  SearchOutlined,
  ClearOutlined,
  UnorderedListOutlined,
  FormOutlined,
} from "@ant-design/icons";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import "./index.css";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import dayjs from "dayjs";
import React from "react";
import FormSearch from "../../../components/card-search/FormSearch";

export default function ApprovedHistory() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { Option } = Select;
  const [status, setStatus] = useState([]);
  const [size, setSize] = useState(10);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const fetchData = () => {
    CensorAPI.getAllHistoryArticle({
      title: title.trim(),
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      page: current - 1,
      statusList: status,
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
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    CensorAPI.getAllHistoryArticle({
      title: title.trim(),
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      page: 0,
      statusList: status,
      size: size,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(0);
    setSize(pageSize);
  };

  const data = useAppSelector(GetArticles);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleClearButtonClick = () => {
    setTitle("");
    setEndDate(null);
    setStartDate(null);
    setStatus([]);
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
    },
    {
      title: "Tác giả",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thể loại",
      dataIndex: "nameCategory",
      key: "nameCategory",
      render: (nameCategory) => {
        return nameCategory ? nameCategory : "Không có";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Ngày thao tác",
      dataIndex: "browseDate",
      key: "browseDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color, text;

        switch (status) {
          case "3":
            color = "green"; // Màu xanh lá cây cho trạng thái "Đã phê duyệt"
            text = "Đã phê duyệt";
            break;
          case "4":
            color = "red"; // Màu đỏ cho trạng thái "Đã từ chối"
            text = "Đã từ chối";
            break;
          case "2":
            color = "blue"; // Màu đang xử lý cho trạng thái "Chờ phê duyệt"
            text = "Chờ phê duyệt";
            break;
          case "6":
            color = "orange"; // Màu mặc định cho trạng thái "Đã gửi đào tạo"
            text = "Đã gửi đào tạo";
            break;
          case "7":
            color = "blue"; // Màu mặc định cho trạng thái "Gửi lại, chờ phê duyệt"
            text = "Gửi lại, chờ phê duyệt";
            break;
          case "8":
            color = "green"; // Màu mặc định cho trạng thái "Đã đăng"
            text = "Đã đăng";
            break;
          case "9":
            color = "red"; // Màu mặc định cho trạng thái "Bị trùng"
            text = "Bị trùng";
            break;
          default:
            color = "default"; // Màu mặc định cho các trạng thái khác
            text = "Chưa xác định";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/censor/approved-history/${record.id}`}>
              <Button
                type="link"
                className="btn__table">
                <FormOutlined />
              </Button>
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <FormSearch>
        <Row gutter={24}>
          <Col lg={8} sm={24} className="w-full">
            <h1>Tiêu đề bài viết</h1>
            <Input
              placeholder="Tìm kiếm theo tiêu đề bài viết"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
          <Col lg={8} sm={24} className="w-full">
            <h1>Trạng thái</h1>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: "100%" }}
              onChange={(value) => {
                setStatus(value); // Cập nhật giá trị trạng thái
              }}
              value={status}
              size="large"
            >
              <Option value="">Tất cả</Option>
              <Option value="4">Đã từ chối</Option>
              <Option value="3">Đã phê duyệt</Option>
              <Option value="7">Gửi lại chờ phê duyệt</Option>
              <Option value="6">Đã gửi đào tạo</Option>
              <Option value="8">Đã đăng</Option>
              <Option value="9">Bị trùng</Option>
            </Select>
          </Col>
          <Col lg={8} sm={24} className="w-full">
            <h1>Ngày thao tác</h1>
            <div className="flex">
              <DatePicker
                size="large"
                value={startDate}
                onChange={(el) => setStartDate(el)}
                locale={locale}
                className="datePicker mr-1"
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
                onClick={handleSearchButtonClick}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button> */}
            </div>
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
          <h1 className="text-xl m-0">
            <UnorderedListOutlined className="mr-3" />
            Danh sách lịch sử phê duyệt
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
      </Card>
    </>
  );
}
