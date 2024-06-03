import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
  Avatar,
  List,
  Menu,
  message,
  Spin,
} from "antd";

import {
  MoreOutlined,
  BellFilled,
  ClockCircleFilled,
  UserOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import tym from "../../assets/images/38064371 (2).jpg";
import comment from "../../assets/images/38064371 (3).jpg";
import approved from "../../assets/images/check.png";
import refuse from "../../assets/images/cancel.png";
import evaluate from "../../assets/images/star.png";
import {
  AddNotification,
  GetNotification,
  SetNotification,
} from "../../app/reducers/notification/notification.reducer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { NotificationAPI } from "../../apis/censor/notification/notification.api";
import {
  GetCountNotification,
  SetCountNotification,
} from "../../app/reducers/notification/count-notification-user.reducer";
import { deleteToken, getToken, getTokenObj, userToken } from "../../helper/userToken";
import moment from "moment";
import {
  connectNotifyUserSendArticleToAdmin,
  connectStompClient,
  getStompClient,
} from "../../apis/stomp-client/config";
import React from "react";
function Header({ onSlidebar, onPress, name, subName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [countNotification, setCountNotification] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [notificationHasData, setNotificationHasData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasData, setHasData] = useState(false);

  const fetchNotification = async () => {
    try {
      const response = await NotificationAPI.fetchAll({
        page: current,
        size: 10,
      });
      console.log(response);
      if (response.data.data.data !== 0) {
        response.data.data.data.forEach((element) => {
          dispatch(AddNotification(element));
        });
      }
      setCurrent(response.data.data.currentPage);
      if (response.data.data.totalPages - current <= 1) {
        setNotificationHasData(false);
      } else {
        setNotificationHasData(true);
      }
      if (response.data.data.data.length > 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {}
  };
  useEffect(() => {
    const stompClient = connectNotifyUserSendArticleToAdmin();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        `/portal-articles/create-notification-censor`,
        (result) => {
          dispatch(SetCountNotification(JSON.parse(result.body).data));
        }
      );
    });
    return () => {
      if (stompClient != null) {
        stompClient.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    connectStompClient();
  }, []);
  const stompClient = getStompClient();
  const connect = () => {
    // stompClient.connect({}, () => {
    //   stompClient.subscribe(
    //     `/portal-articles/create-notification-censor`,
    //     (result) => {
    //       dispatch(SetCountNotification(JSON.parse(result.body).data));
    //     }
    //   );
    // });
  };
  useEffect(() => {
    if (stompClient != null) {
      connect();
    }
    return () => {
      if (stompClient != null) {
        stompClient.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchNotification();
    fetchCountNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const fetchCountNotification = () => {
    return NotificationAPI.fetchCountNotification().then((response) => {
      dispatch(SetCountNotification(response.data.data));
      console.log(response.data.data);
    });
  };

  const dataNotification = useAppSelector(GetNotification);

  const dataCountNotification = useAppSelector(GetCountNotification);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };
  const AvatarMap = {
    0: comment,
    1: approved,
    2: evaluate,
    4: tym,
    5: refuse,
    6: approved,
  };

  const deleteNotification = async (id) => {
    try {
      const response = await NotificationAPI.delete(id);
      if (response.status === 200) {
        const updatedData = dataNotification.filter((item) => item.id !== id);
        dispatch(SetNotification(updatedData));
        const newResponse = await NotificationAPI.fetchAll();
        const newData = newResponse.data.data.data;
        dispatch(SetNotification(newData));
        const newCount = countNotification - 1;
        setCountNotification(newCount);
      }
    } catch (error) {}
  };
  const handleItemClick = (item) => {
    if (item.type === 1 && item.articleStatus === 2) {
      navigate(`/censor/article/${item.articlesId}`);
    } else {
      message.info(`Bài viết này đã được phê duyệt!`);
      navigate(`/censor/approved-history/${item.articlesId}`);
    }
    NotificationAPI.readOne(item.id).then(() => {
      fetchCountNotification();
      setIsOpen(!isOpen);
      NotificationAPI.fetchAll({
        page: 0,
        size: 10,
      }).then((response) => {
        dispatch(SetNotification(response.data.data.data));
      });
    });
  };

  const markAsRead = () => {
    NotificationAPI.markAllAsRead().then(() => {
      setIsOpen(!isOpen);
      fetchCountNotification();
      NotificationAPI.fetchAll({
        page: 0,
        size: 10,
      }).then((response) => {
        dispatch(SetNotification(response.data.data.data));
      });
    });
  };

  const loadMoreItems = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
      setCurrent(current + 1);
    }, 500);
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          type="ghost"
          onClick={() => {
            navigate(`/author-switch?Token=${getTokenObj()}`);
          }}>
          Đổi quyền
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          type="ghost"
          onClick={() => {
            deleteToken();
            navigate(`/home`);
          }}>
          Đăng xuất
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "5px 0 0 0",
      }}>
      <Row gutter={[24, 0]}>
        <Col
          span={24}
          className="header-control">
          {/* chuông */}
          <Badge
            size="small"
            count={dataCountNotification}>
            <Dropdown
              overlay={
                <>
                  {hasData ? (
                    <div
                      style={{
                        backgroundColor: "white",
                        marginTop: "20px",
                        marginBottom: "-10px",
                      }}>
                      <Button
                        type="link"
                        style={{ width: "100%", textAlign: "left" }}
                        onClick={() => markAsRead()}>
                        <u>Đánh dấu tất cả đã đọc</u>
                      </Button>
                    </div>
                  ) : null}
                  <List
                    style={{
                      width: "300px",
                      height: "450px",
                      overflow: "scroll",
                    }}
                    className="header-notifications-dropdown"
                    itemLayout="horizontal"
                    dataSource={dataNotification}
                    renderItem={(item) => (
                      <List.Item
                        className={`notification-item ${
                          hoveredItem === item.id ? "hovered" : ""
                        }`}
                        onMouseEnter={() => handleItemHover(item.id)}
                        onMouseLeave={() => handleItemHover(null)}
                        onClick={() => handleItemClick(item)}
                        style={{ cursor: "pointer" }}>
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}>
                              <Avatar
                                shape="circle"
                                src={
                                  item.img
                                    ? item.img
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                style={{ width: "50px", height: "50px" }}
                              />
                              <Avatar
                                shape="circle"
                                src={AvatarMap[item.type]}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  position: "absolute",
                                  bottom: "-5px",
                                  right: 0,
                                }}
                              />
                            </div>
                          }
                          title={
                            <span
                              style={{
                                fontWeight: !item.status ? "bold" : "400",
                                overflowWrap: "break-word",
                              }}>
                              {item.contentActivity}
                              {!item.status ? (
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "blue",
                                    borderRadius: "55%",
                                    float: "right",
                                    marginRight: "-8px",
                                    marginTop: "-35px",
                                  }}
                                />
                              ) : null}
                            </span>
                          }
                          description={
                            <>
                              {item.name ? (
                                <>
                                  <UserOutlined />
                                  {item.name} <br />
                                </>
                              ) : null}
                              <ClockCircleFilled />{" "}
                              {moment(item.createdDate).format("DD/MM/YYYY")}
                            </>
                          }
                        />
                        {hoveredItem === item.id && (
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item
                                  key="delete"
                                  onClick={() => deleteNotification(item.id)}>
                                  <a href="# ">Xóa</a>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}>
                            <Button
                              shape="circle"
                              style={{
                                border: "none",
                                boxShadow: "none",
                                right: "0",
                              }}
                              className="notification-options absolute "
                              icon={<MoreOutlined />}
                            />
                          </Dropdown>
                        )}
                      </List.Item>
                    )}
                  />
                  {notificationHasData ? (
                    <div
                      style={{
                        textAlign: "center",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        marginTop: "-15px",
                      }}>
                      <Button
                        type="link"
                        onClick={loadMoreItems}
                        style={{
                          backgroundColor: "white",
                          width: "300px",
                        }}
                        disabled={loadingMore}>
                        {loadingMore ? <Spin /> : "Xem thêm"}
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        backgroundColor: "white",
                        borderRadius: "5px",
                        marginTop: "-35px",
                      }}>
                      <Button
                        type="link"
                        style={{
                          backgroundColor: "white",
                          width: "300px",
                        }}
                        disabled>
                        Bạn đã xem hết thông báo
                      </Button>
                    </div>
                  )}
                </>
              }
              trigger={["click"]}
              visible={isOpen}
              onVisibleChange={toggleNotifications}
              placement="bottomRight"
              overlayClassName="notification-dropdown">
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}>
                <BellFilled />
              </a>
            </Dropdown>
          </Badge>
          <Dropdown
            menu={{ items }}
            placement="bottom">
            <span className="mx-1 cursor-pointer">
              {" "}
              {userToken() !== null
                ? `Xin chào, ${userToken()}`
                : "Bạn chưa đăng nhập"}{" "}
            </span>
          </Dropdown>
          {/* <Avatar icon={<Image src={userToken().img} />} />  */}
          {/* <Input
            className="header-search"
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          /> */}
        </Col>
      </Row>
    </div>
  );
}

export default Header;
