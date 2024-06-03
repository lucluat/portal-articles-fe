import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Statistic,
  Table,
  Tooltip,
} from "antd";
import React from "react";
import {
  CheckCircleOutlined,
  FlagOutlined,
  SearchOutlined,
  SendOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
import { ChartAPI } from "../../../apis/censor/chart/progress-chart.api";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";

const DashboardCensorUi = () => {
  const [numberArticles, setNumberArticles] = useState({});
  const [registrationPeriod, setRegistrationPeriod] = useState([]);

  const [sizeUserAnalytics, setSizeUserAnalytics] = useState(10);
  const [currentUserAnalytics, setCurrentUserAnalytics] = useState(1);
  const [totalUserAnalytics, setTotalUserAnalytics] = useState(0);
  const [sizeRegAnalytics, setSizeRegAnalytics] = useState(5);
  const [currentRegAnalytics, setCurrentRegAnalytics] = useState(1);
  const [totalRegAnalytics, setTotalRegAnalytics] = useState(0);
  const [registrationPeriodId, setRegistrationPeriodId] = useState("");
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [registrationPeriodStatus, setRegistrationPeriodStatus] = useState("");
  const [registrationAnalytics, setRegistrationAnalytics] = useState([]);
  const [registrationAnalyticsByDate, setRegistrationAnalyticsByDate] =
    useState(0);
  const [inputGiangVien, setInputGiangVien] = useState("");
  const [fromDateSearch, setFromDateSearch] = useState(null);
  const [toDateSearch, setToDateSearch] = useState(null);
  const { RangePicker } = DatePicker;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentUserAnalytics(1);
      ChartAPI.getRegistrationAnalytics({
        id: registrationPeriodId,
        search: inputGiangVien,
        page: 0,
        size: sizeUserAnalytics,
      }).then((response) => {
        setUserAnalytics(response.data.data.data);
        setTotalUserAnalytics(response.data.data.totalPages);
      });
    }
  };

  const handleInputChange = (event) => {
    setInputGiangVien(event.target.value);
  };

  const fetchAllNumberArticles = () => {
    ChartAPI.getAllUsersAnalytics().then((response) => {
      setNumberArticles(response.data.data);
    });
  };

  const getAllRegistrationPeriod = () => {
    CensorRegistrationPeriodAPI.getAll().then((response) => {
      setRegistrationPeriod(response.data);
    });
  };

  useEffect(() => {
    fetchAllNumberArticles();
    getAllRegistrationPeriod();
  }, []);

  const getAllUsersAnalytics = () => {
    ChartAPI.getRegistrationAnalytics({
      id: registrationPeriodId,
      search: inputGiangVien,
      page: currentUserAnalytics - 1,
      size: sizeUserAnalytics,
    }).then((response) => {
      setUserAnalytics(response.data.data.data);
      setTotalUserAnalytics(response.data.data.totalPages);
    });
  };

  useEffect(() => {
    getAllUsersAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationPeriodId, currentUserAnalytics, sizeUserAnalytics]);

  const getNumberArticleOnRegistrationPeriod = () => {
    ChartAPI.getNumberArticleAnalytics({
      status: registrationPeriodStatus,
      size: sizeRegAnalytics,
      page: currentRegAnalytics - 1,
    }).then((response) => {
      setRegistrationAnalytics(response.data.data.data);
      setTotalRegAnalytics(response.data.data.totalPages);
    });
  };

  useEffect(() => {
    getNumberArticleOnRegistrationPeriod();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationPeriodStatus, currentRegAnalytics, sizeRegAnalytics]);

  const getNumberArticleOnRegistrationPeriodByDate = () => {
    ChartAPI.getNumberArticleByDateAnalytics({
      fromDate: fromDateSearch,
      toDate: toDateSearch,
    }).then((response) => {
      setRegistrationAnalyticsByDate(response.data.data.totalArticles);
      console.log(registrationAnalyticsByDate);
    });
  };

  useEffect(() => {
    getNumberArticleOnRegistrationPeriodByDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegistrationPeriodChange = (e) => {
    setRegistrationPeriodId(e);
  };

  const handleRegistrationPeriodStatusChange = (e) => {
    setRegistrationPeriodStatus(e.target.value);
    setCurrentRegAnalytics(1);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "userName",
      key: "userName",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {record.userName}
          </span>
        );
      },
    },
    {
      title: "Đã phê duyệt",
      dataIndex: "numberArticleApproved",
      key: "numberArticleApproved",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticleApproved) +
              parseInt(record.numberArticleSent) +
              parseInt(
                record.numberArticlePosted +
                  parseInt(record.numberArticleDuplicated)
              )}
          </span>
        );
      },
    },
    {
      title: "Đã gửi",
      dataIndex: "numberArticleSent",
      key: "numberArticleSent",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticleSent)}
          </span>
        );
      },
    },
    {
      title: "Đã đăng",
      dataIndex: "numberArticlePosted",
      key: "numberArticlePosted",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticlePosted)}
          </span>
        );
      },
    },
    {
      title: "Bị trùng",
      dataIndex: "numberArticleDuplicated",
      key: "numberArticleDuplicated",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticleDuplicated)}
          </span>
        );
      },
    },
    {
      title: "Lần phê duyệt",
      dataIndex: "numberArticleApprove",
      key: "numberArticleApprove",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticleApprove)}
          </span>
        );
      },
    },
    {
      title: "Lần từ chối",
      dataIndex: "numberArticleRefuse",
      key: "numberArticleRefuse",
      align: "center",
      render: (text, record) => {
        return (
          <span
            className={`${record.checkRes === 1 && "text-red-500 font-bold"}`}>
            {parseInt(record.numberArticleRefuse)}
          </span>
        );
      },
    },
  ];

  const columnsRes = [
    {
      title: "Tên đợt",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tổng",
      dataIndex: "numberAllArticles",
      key: "numberAllArticles",
    },
    {
      title: "Đã viết",
      dataIndex: "numberArticleWritten",
      key: "numberArticleWritten",
    },
  ];

  // const columnsResByDate = [
  //   {
  //     title: "Tên đợt",
  //     dataIndex: "name",
  //     key: "name",
  //   },
  //   {
  //     title: "Đã viết",
  //     dataIndex: "numberArticleWritten",
  //     key: "numberArticleWritten",
  //   },
  // ];

  const approved =
    parseInt(numberArticles.numberArticleApproved) +
    parseInt(numberArticles.numberArticleSent) +
    parseInt(numberArticles.numberArticlePosted) +
    parseInt(numberArticles.numberArticleDuplicated);

  // const filterOption = (input, option) => {
  //   return (
  //     option.props.children.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //   );
  // };

  const onShowSizeChange = (current, pageSize) => {
    setCurrentUserAnalytics(current);
    setSizeUserAnalytics(pageSize);
  };

  const onShowSizeChangeReg = (current, pageSize) => {
    setCurrentRegAnalytics(current);
    setSizeRegAnalytics(pageSize);
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [fromDate, toDate] = dates;

      if (fromDate instanceof Date) {
        fromDate.setHours(0, 0, 0, 0);
        setFromDateSearch(fromDate.valueOf());
      } else {
        // Chuyển đổi fromDate thành một đối tượng Date
        const fromDateAsDate = new Date(fromDate);
        fromDateAsDate.setHours(0, 0, 0, 0);
        setFromDateSearch(fromDateAsDate.valueOf());
      }

      if (toDate instanceof Date) {
        toDate.setHours(23, 59, 59, 999);
        setToDateSearch(toDate.valueOf());
      } else {
        // Chuyển đổi toDate thành một đối tượng Date
        const toDateAsDate = new Date(toDate);
        toDateAsDate.setHours(23, 59, 59, 999);
        setToDateSearch(toDateAsDate.valueOf());
      }
    } else {
      setFromDateSearch(null);
      setToDateSearch(null);
    }
  };

  return (
    <div>
      <Row gutter={24}>
        <Col
          xl={6}
          lg={12}
          sm={12}
          md={24}
          className="mb-6">
          <Card bordered={false}>
            <Statistic
              title={<span>Đã phê duyệt</span>}
              value={approved}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<CheckCircleOutlined />}
              suffix="Bài"
            />
          </Card>
        </Col>
        <Col
          xl={6}
          lg={12}
          sm={12}
          md={24}
          className="mb-6">
          <Card bordered={false}>
            <Statistic
              title={<span>Đã gửi</span>}
              value={numberArticles.numberArticleSent}
              valueStyle={{
                color: "#003eff",
              }}
              prefix={<SendOutlined />}
              suffix="Bài"
            />
          </Card>
        </Col>

        <Col
          xl={6}
          lg={12}
          sm={12}
          md={24}
          className="mb-6">
          <Card bordered={false}>
            <Statistic
              title={<span>Đã đăng</span>}
              value={numberArticles.numberArticlePosted}
              valueStyle={{
                color: "#ff5c00;",
              }}
              prefix={<FlagOutlined />}
              suffix="Bài"
            />
          </Card>
        </Col>

        <Col
          xl={6}
          lg={12}
          sm={12}
          md={24}
          className="mb-6">
          <Card bordered={false}>
            <Statistic
              title={<span>Bị trùng</span>}
              value={numberArticles.numberArticleDuplicated}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<StopOutlined />}
              suffix="Bài"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col
          xl={16}
          lg={24}
          md={24}
          sm={24}
          className="mb-6">
          <Card
            title="Giảng viên"
            extra={
              <>
                <Row gutter={12}>
                  <Col span={12}>
                    <Tooltip title={"Tìm kiếm theo tên hoặc mã"}>
                      <Input
                        value={inputGiangVien}
                        onKeyPress={handleKeyPress}
                        style={{ width: "200px" }}
                        onChange={handleInputChange}
                        placeholder="Tìm kiếm theo tên hoặc mã"
                      />
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <Select
                      showSearch
                      onChange={handleRegistrationPeriodChange}
                      value={registrationPeriodId}
                      style={{ width: "220px" }}
                      optionFilterProp="children"
                      // filterOption={filterOption}
                    >
                      <Select.Option
                        value=""
                        key="">
                        Chọn đợt viết bài
                      </Select.Option>
                      {registrationPeriod.map((regis) => (
                        <Select.Option
                          value={regis.id}
                          key={regis.id}>
                          <Tooltip title={regis.name}>{regis.name}</Tooltip>
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </>
            }>
            <Table
              columns={columns}
              dataSource={userAnalytics}
              pagination={false}
            />
            <div className="mt-5 text-center">
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                onChange={(value) => {
                  setCurrentUserAnalytics(value);
                }}
                current={currentUserAnalytics}
                total={totalUserAnalytics * sizeUserAnalytics}
              />
            </div>
          </Card>
        </Col>
        <Col
          xl={8}
          lg={24}
          md={24}
          sm={24}
          className="mb-6">
          <Card
            title="Đợt đăng ký"
            extra={
              <>
                <Radio.Group
                  value={registrationPeriodStatus}
                  onChange={handleRegistrationPeriodStatusChange}>
                  <Radio.Button value="">Tất cả</Radio.Button>
                  <Radio.Button value="0">Đang mở</Radio.Button>
                  <Radio.Button value="1">Đã đóng</Radio.Button>
                </Radio.Group>
              </>
            }>
            <Table
              columns={columnsRes}
              dataSource={registrationAnalytics}
              pagination={false}
            />
            <div className="mt-5 text-center">
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChangeReg}
                onChange={(value) => {
                  setCurrentRegAnalytics(value);
                }}
                current={currentRegAnalytics}
                total={totalRegAnalytics * sizeRegAnalytics}
              />
            </div>
          </Card>
          <Card
            style={{ marginTop: "17px" }}
            title="Số lượng bài viết theo khoảng ngày">
            <RangePicker
              style={{
                // marginLeft: "5px",
                marginRight: "5px",
                width: "230px",
                height: "40px",
              }}
              placeholder={["Từ ngày", "Đến ngày"]}
              renderExtraFooter={() => "Enter date"}
              onChange={handleDateChange}
            />
            <Button
              type="primary"
              className="searchButton1"
              onClick={() => getNumberArticleOnRegistrationPeriodByDate()}
              style={{ marginTop: "-3px" }}
              icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
            <h3 style={{ margin: "45px 0 45px 10px" }}>
              Tổng số lượng bài viết: {registrationAnalyticsByDate} bài
            </h3>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardCensorUi;
