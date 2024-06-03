import React from "react";
import {
  Row,
  Col,
  Radio,
  Input,
  Select,
  Button,
  Drawer,
  Space,
  Table,
  DatePicker,
  Pagination,
  Card,
  Tooltip,
} from "antd";
import CardDemo from "../../card/ViewCard";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  GetArticles,
  SetArticles,
} from "../../../../app/reducers/articles/articles.reducer";
import {
  BorderlessTableOutlined,
  EyeOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const ListArticel = () => {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const dispatch = useAppDispatch();
  // eslint-disable-next-line no-unused-vars
  const [size, setSize] = useState(10);
  const [title, setTitle] = useState("");
  const [nameCategory, setNameCategory] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [nameRegistration, setNameRegistration] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState([]);
  const [name, setName] = useState("");

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
      align: "center",
    },
    {
      title: "Thể loại",
      dataIndex: "nameCategory",
      key: "nameCategory",
      align: "center",
      render: (text) => (text ? text : "Chưa có"),
    },
    {
      title: "Hashtag",
      dataIndex: "hashtags",
      key: "hashtags",
      align: "center",
    },
    {
      title: "Người đăng",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (createdDate) => {
        return moment(createdDate).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Đợt",
      dataIndex: "nameRegistration",
      key: "nameRegistration",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        switch (status) {
          case 2:
            return "Chờ phê duyệt";
          case 3:
            return "Đã phê duyệt";
          case 6:
            return "Đã gửi đào tạo";
          case 7:
            return "Gửi lại chờ phê duyệt";
          case 8:
            return "Đã đăng";
          case 9:
            return "Bị trùng";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Space align="center">
            <Link to={`/user/article/${record.id}`} className="w-1/5">
              <Button type="link" className="btn__table">
                <EyeOutlined />
              </Button>
            </Link>
          </Space>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const fetchData = () => {
    const data = {
      title: title,
      name: name,
      category: nameCategory,
      nameRegistration: nameRegistration,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      hashtag: hashtag,
      size: size,
      page: current - 1,
      status: status,
    };
    ArticleAPI.fetchAllArticle(data).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(0);
    setSize(pageSize);
  };

  const articles = useAppSelector(GetArticles);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const { Option } = Select;
  const [selectedCity, setSelectedCity] = useState("a");
  const [showTable, setShowTable] = useState(true);
  const [showCard, setShowCard] = useState(false);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);

    if (e.target.value === "a") {
      setShowTable(true);
      setShowCard(false);
      onClose();
    }
    if (e.target.value === "b") {
      setShowTable(false);
      setShowCard(true);
      onClose();
    }
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    const data = {
      title: title,
      name: name,
      category: nameCategory,
      nameRegistration: nameRegistration,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      hashtag: hashtag,
      size: size,
      page: 0,
      status: status,
    };
    ArticleAPI.fetchAllArticle(data).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>Danh sách bài viết</h2>
        <Radio.Group
          defaultValue="a"
          onChange={handleCityChange}
          value={selectedCity}
        >
          <Tooltip title="Danh sách bài viết dạng bảng">
            <Radio.Button value="a">
              <BorderlessTableOutlined />
            </Radio.Button>
          </Tooltip>
          <Tooltip title="Danh sách bài viết dạng thẻ">
            <Radio.Button value="b">
              <UnorderedListOutlined />
            </Radio.Button>
          </Tooltip>
          <Tooltip title="Tìm kiếm bài viết">
            <Radio.Button onClick={showDrawer}>
              <SearchOutlined />
            </Radio.Button>
          </Tooltip>
        </Radio.Group>
      </div>

      <hr className="border-0 bg-gray-300 mt-3 mb-6" />
      <Drawer
        title="Tìm kiếm thông tin bài viết"
        width={720}
        onClose={onClose}
        visible={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        footer={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="primary" onClick={handleSearchButtonClick}>
              Tìm kiếm
            </Button>
          </Space>
        }
      >
        <Row gutter={16} className="pb-5">
          <Col span={12}>
            <label>Tiêu đề</label>
            <Input
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label>Thể loại</label>
            <Input
              placeholder="Nhập thể loại"
              value={nameCategory}
              onChange={(e) => setNameCategory(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className="pb-5">
          <Col span={12}>
            <label>Hashtag</label>
            <Input
              placeholder="Nhập hashtag"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label>Đợt</label>
            <Input
              placeholder="Nhập đợt"
              value={nameRegistration}
              onChange={(e) => setNameRegistration(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className="pb-5">
          <Col span={12}>
            <label>Tên giảng viên</label>
            <Input
              placeholder="Nhập tên giảng viên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <label>Ngày tạo</label>
            <div className="flex justify-between">
              <DatePicker
                value={startDate}
                onChange={(el) => setStartDate(el)}
                locale={locale}
                className="datePicker"
                placeholder="Từ ngày"
                format="DD-MM-YYYY HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
              />
              <DatePicker
                style={{ height: 40 }}
                value={endDate}
                onChange={(el) => setEndDate(el)}
                locale={locale}
                className="datePicker1 ml-5"
                placeholder="Đến ngày"
                format="DD-MM-YYYY HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("23:59:59", "HH:mm:ss"),
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            <label>Trạng thái</label>
            <div className="flex justify-between">
              <Select
                value={status}
                onChange={(value) => {
                  if (value === "") {
                    setStatus([]);
                  } else {
                    setStatus(value);
                  }
                }}
                size="large"
                placeholder="Chọn trạng thái"
              >
                <Option value="">Không có gì</Option>
                <Option value="2">Chờ phê duyệt</Option>
                <Option value="3">Đã phê duyệt</Option>
                <Option value="6">Đã gửi đào tạo</Option>
                <Option value="7">Gửi lại chờ phê duyệt</Option>
                <Option value="8">Đã đăng</Option>
                <Option value="9">Bị trùng</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Drawer>
      {/* danh sách bài viết */}

      {showTable && (
        <>
          <Card>
            <div className="mt-5">
              <Table
                pagination={false}
                dataSource={articles}
                columns={columns}
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
      )}
      {showCard && (
        <Row
          id="content"
          style={{
            marginTop: 60,
          }}
          className="justify-center m-auto"
        >
          <Col xl={24}>
            <div className="px-10">
              <CardDemo data={articles} />
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
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ListArticel;
