import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
  Avatar,
  List,
  Menu,
  Spin,
} from "antd";
import {
  MoreOutlined,
  BellFilled,
  ClockCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import tym from "../../../assets/images/38064371 (2).jpg";
import comment from "../../../assets/images/38064371 (3).jpg";
import approved from "../../../assets/images/check.png";
import refuse from "../../../assets/images/cancel.png";
import evaluate from "../../../assets/images/star.png";
import { NotificationAPI } from "../../../apis/user/auth/notification/notification.api";
import {
  AddNotification,
  GetNotification,
  SetNotification,
} from "../../../app/reducers/notification/notification.reducer";
import {
  GetCountNotification,
  SetCountNotification,
} from "../../../app/reducers/notification/count-notification-user.reducer";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import moment from "moment";
import { deleteToken, getToken, getTokenObj, userToken } from "../../../helper/userToken";
import {
  connectStompClient,
  getStompClient,
} from "../../../apis/stomp-client/config";
import jwtDecode from "jwt-decode";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [notificationHasData, setNotificationHasData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasData, setHasData] = useState(false);

  const token = getToken();
  // const decodedToken = jwtDecode(token);
  const fetchCountNotification = async () => {
    const response = await NotificationAPI.fetchCountNotification();
    dispatch(SetCountNotification(response.data));
  };

  useEffect(() => {
    fetchCountNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const dataCountNotification = useAppSelector(GetCountNotification);

  const fetchNotification = async () => {
    const response = await NotificationAPI.fetchNotification({
      page: current,
      size: 10,
    });
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
    // connectStompClient();
    // getStompClient().connect({}, () => {
    //   getStompClient().subscribe(
    //     `/portal-articles/create-notification-user/` + decodedToken.id,
    //     (result) => {
    //       dispatch(SetCountNotification(JSON.parse(result.body).data));
    //     }
    //   );
    // });
  };
  // useEffect(() => {
  //   connectStompClient();
  // }, []);
  const stompClient = getStompClient();
  // const connect = () => {
  //   stompClient.connect({}, () => {
  //     getStompClient().subscribe(
  //       `/portal-articles/create-notification-user/` + decodedToken.id,
  //       (result) => {
  //         dispatch(SetCountNotification(JSON.parse(result.body).data));
  //       }
  //     );
  //   });
  // };
  // useEffect(() => {
  //   if (stompClient != null) {
  //     connect();
  //   }
  //   return () => {
  //     if (stompClient != null) {
  //       getStompClient().disconnect();
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stompClient]);

  useEffect(() => {
    // NotificationAPI.fetchNotification({
    //   page: current,
    // }).then((response) => {
    //   dispatch(SetNotification(response.data.data.data));
    // });
    fetchNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, dataCountNotification]);

  const dataNotification = useAppSelector(GetNotification);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };

  const AvatarMap = {
    1: comment,
    2: approved,
    3: evaluate,
    4: tym,
    5: refuse,
  };

  const deleteNotification = async (id) => {
    const response = await NotificationAPI.delete(id);
    if (response.status === 200) {
      const updatedData = dataNotification.filter((item) => item.id !== id);
      dispatch(SetNotification(updatedData));
      const newResponse = await NotificationAPI.fetchNotification();
      const newData = newResponse.data.data.data;
      dispatch(SetNotification(newData));
      fetchCountNotification();
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 1 || item.type === 5) {
      navigate(`/user/my-article/${item.articlesId}`);
    } else {
      navigate(`/user/article/${item.articlesId}`);
    }
    // Chỉ xem 1 thông báo
    NotificationAPI.readOne(item.id).then(() => {
      fetchCountNotification();
      setIsOpen(!isOpen);
      NotificationAPI.fetchNotification({
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
      NotificationAPI.fetchNotification({
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
    }, 500);
    setCurrent(current + 1);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  const items = [
    {
      key: "1",
      label: (
        <div
          type="ghost"
          onClick={() => {
            navigate(`/author-switch?Token=${getTokenObj()}`);
          }}
        >
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
                      height: "580px",
                      overflow: "scroll",
                    }}
                    className="header-notifications-dropdown"
                    itemLayout="horizontal"
                    dataSource={dataNotification}
                    renderItem={(item) => (
                      <List.Item
                        className={`notification-item ${hoveredItem === item.id ? "hovered" : ""
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
                                src={item.previewImage}
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
                              className="notification-options absolute"
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
                        {loadingMore ? (
                          <Spin indicator={antIcon} />
                        ) : (
                          "Xem thêm"
                        )}
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
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          /> */}
        </Col>
      </Row>
    </div>
  );
}

export default Header;
