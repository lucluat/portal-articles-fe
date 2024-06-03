import { useEffect, useState } from "react";
import React from "react";
import { Card, Row, Col, Image, Menu, Dropdown, Empty, message, DatePicker, Button, Input } from "antd";
import "./history.css";
import { Link } from "react-router-dom";
import { ClearOutlined, DeleteOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetHistory,
  SetHistory,
} from "../../../app/reducers/history/history.reducer";
import { UserHistoryAPI } from "../../../apis/user/auth/history/history-user.api";
import moment from "moment";
import FormSearch from "../../../components/card-search/FormSearch";

export default function History() {
  const dispatch = useAppDispatch();
  const [groupedHistory, setGroupedHistory] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [historyId, setHistoryId] = useState("");
  const [title, setTitle] = useState("");
  const [fromDateSearch, setFromDateSearch] = useState(null);
  const { RangePicker } = DatePicker;

  const fetchAll = async () => {
    const response = await UserHistoryAPI.fetchAllHistory();
    dispatch(SetHistory(response.data.data));
    if (response.data.data.length !== 0) {
      setHasData(true);
    } else {
      setHasData(false);
    }
  };

  useEffect(() => {
    const fetchAllHistory = async () => {
      const response = await UserHistoryAPI.fetchAllHistory();
      dispatch(SetHistory(response.data.data));
      if (response.data.data.length !== 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    fetchAllHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataHistory = useAppSelector(GetHistory);
  useEffect(() => {
    const groupedData = dataHistory.reduce((groups, history) => {
      const date = new Date(history.createAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(history);
      return groups;
    }, {});

    const groupedArray = Object.keys(groupedData).map((date) => {
      return {
        createAt: date,
        histories: groupedData[date],
      };
    });

    setGroupedHistory(groupedArray);
  }, [dataHistory]);


  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleDropdownMore = (e) => {
    setHistoryId(e.key);
  };

  const deleteHistory = () => {
    UserHistoryAPI.deleteHistory(historyId).then(() => {
      message.success("Xóa lịch sử thành công!!!");
      fetchAll();
    }).catch((error) => {
      message.error("Xóa lịch sử thất bại!!!");
    });
  };

  const handleSearch = () => {
    UserHistoryAPI.fetchAllHistory(
    {
      title: title,
      fromDate: fromDateSearch!== null ? new Date(fromDateSearch[0]).getTime() : null,
      toDate: fromDateSearch!== null ?  new Date(fromDateSearch[1]).getTime() : null
    }
    ).then((response) => {
      dispatch(SetHistory(response.data.data));
      if (response.data.data.length !== 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    })
  };

  const handleClearButtonClick = () => {
    setTitle("");
    setFromDateSearch(null);
    fetchAll();
  };

  const moreOption = (
    <Menu onClick={handleDropdownMore}>
      <Menu.Item key={historyId} onClick={() => deleteHistory()}>
        <DeleteOutlined className="mr-2"/>
        Xóa
      </Menu.Item>
    </Menu>
  );

  const handleDateChange = (dates) => {
    console.log(dates);
    setFromDateSearch(dates);
    // if (dates && dates.length === 2) {
    //   const [fromDate, toDate] = dates;

    //   setFromDateSearch(fromDate.valueOf());
    //   setToDateSearch(toDate.valueOf());
    // } else {
    //   setFromDateSearch(null);
    //   setToDateSearch(null);
    // }
  };

  return (
    <div>
      <FormSearch>
          <Row gutter={24}>
            <Col lg={12} sm={24} className=" w-full">
              <h1 className="label">Tiêu đề bài viết</h1>
              <div className="flex justify-between">
              <Input
              size="small"
              placeholder="Nhập tên bài viết"
              onChange={(event) => setTitle(event.target.value)}
                value={title}
                allowClear>
              </Input>
              </div>
            </Col>
            <Col lg={12} sm={24} className=" w-full">
              <h1 className="label">Ngày truy cập</h1>
              <div className="flex justify-between">
              <RangePicker
              className="w-full"
              placeholder={["Từ ngày", "Đến ngày"]}
              value={fromDateSearch}
              renderExtraFooter={() => "Enter date"}
              onChange={handleDateChange}
            />
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
                onClick={() => handleSearch()}
                icon={<SearchOutlined />}
                style={{ marginLeft: 5 }}
              >
                Tìm kiếm
              </Button>
            </div>
          </Col>
        </FormSearch>
      {hasData ? (
        <>
        {groupedHistory.map((group) => (
            <Card
              key={group.createAt}
              className="card-group"
              title={<b>{moment(group.createAt).format("DD/MM/YYYY")}</b>}
            >
              {group.histories.map((his, index) => (
                <div key={his.id} className="history-item">
                  <Row>
                    <Col span={4}>
                      <Image width={150} src={his.previewImage} />
                    </Col>
                    <Col span={19}>
                      <Link to={`/user/article/${his.articlesId}`}>
                        <h3
                          className="title-history"
                          style={{ overflowWrap: "break-word" }}
                        >
                          {his.title}
                        </h3>
                      </Link>
                      <span>
                        {his.name} - {formatDate(his.createdDate)}
                      </span>
                      <p>{his.descriptive}</p>
                    </Col>
                    <Col span={1}>
                      <div className="more-menu">
                        <Dropdown overlay={moreOption} trigger={["click"]} onClick={() => setHistoryId(his.id)}>
                          <MoreOutlined />
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                  {index < group.histories.length - 1 && (
                    <hr className="divider" />
                  )}
                </div>
              ))}
            </Card>
          ))}
        </>
      ) : (
        <Empty
          description={"Không có lịch sử truy cập bài viết"}
          style={{
            position: "absolute",
            top: "80%",
            transform: "translateY(-50%)",
            left: "20%",
            right: "0",
            zIndex: "0",
          }}
        />
      )}
    </div>
  );
}
