import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  List,
  Modal,
  Pagination,
  Row,
  Tabs,
  Tooltip,
  message,
} from "antd";
import { useEffect } from "react";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { UserAPI } from "../../../apis/user/my-user.api";
import { useState } from "react";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import CardMyArticle from "./CardMyArticle";
import {
  CameraOutlined,
  InboxOutlined,
  IssuesCloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import React from "react";
import Dragger from "antd/es/upload/Dragger";
import { convertFileToBase64Only } from "../../../helper/convertUlti";

const MyArticle = memo(() => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState("");
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [topFive, setTopFive] = useState([]);
  const [registrationPeriod, setRegistrationPeriod] = useState({});
  const [complete, setComplete] = useState(false);
  const [numberArticles, setNumberArticles] = useState({});
  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStory, setEditedStory] = useState("");
  const [storyHasData, setStoryHasData] = useState(false);

  const handleStoryClick = () => {
    setIsEditing(true);
    setStoryHasData(false);
  };

  const handleStoryChange = (event) => {
    setEditedStory(event.target.value);
    setStoryHasData(false);
  };

  const fetchTopFive = () => {
    MyArticleAPI.fetchTopFive().then((response) => {
      setTopFive(response?.data?.data);
    });
  };

  const fetchRegistraitionPeriodInfor = () => {
    MyArticleAPI.fetchRegistraitionPeriodInfor().then((response) => {
      const registrationData = response?.data?.data;

      if (
        registrationData === null ||
        typeof registrationData.writtenArticlesCount === "undefined"
      ) {
        setHasData(false);
      } else {
        setRegistrationPeriod(registrationData);
        if (
          registrationData.writtenArticlesCount >=
          registrationData.assignedArticleCount
        ) {
          setComplete(true);
        } else {
          setComplete(false);
        }
        setHasData(true);
      }
    });
  };

  const fetchNumberArticle = () => {
    MyArticleAPI.fetchNumberArticles().then((response) => {
      setNumberArticles(response?.data?.data);
    });
  };

  useEffect(() => {
    fetchTopFive();
    fetchRegistraitionPeriodInfor();
    return () => {
      dispatch(SetUser([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyUser = () => {
    UserAPI.findByUserId().then((response) => {
      dispatch(SetUser(response?.data?.data));
      setUserId(response?.data?.data?.id);
      setEditedStory(response?.data?.data?.story);
      if (
        response?.data?.data?.story === null ||
        response?.data?.data?.story?.trim() === ""
      ) {
        setStoryHasData(true);
      } else {
        setStoryHasData(false);
      }
    });
  };
  useEffect(() => {
    fetchMyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userData = useAppSelector(GetUser);

  const fetchMyArticles = (key) => {
    const statusData = {
      userId: userId,
      title: "",
      status: parseInt(key),
      page: current - 1,
    };
    return MyArticleAPI.findMyArticleByStatus(statusData).then((response) => {
      dispatch(SetArticles(response?.data?.data?.data));
      setTotal(response?.data?.data?.totalPages);
    });
  };

  const fetchAllMyArticles = () => {
    MyArticleAPI.fetchAll({ page: current - 1 }).then((response) => {
      dispatch(SetArticles(response?.data?.data?.data));
      setTotal(response?.data?.data?.totalPages);
    });
  };

  useEffect(() => {
    fetchAllMyArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const dataArticle = useAppSelector(GetArticles);

  useEffect(() => {
    fetchNumberArticle();
  }, [dataArticle]);

  const onChange = (key) => {
    if (key === "10") {
      fetchAllMyArticles();
    } else {
      fetchMyArticles(key);
    }
  };

  const items = [
    {
      key: "10",
      label: (
        <span>
          Tất cả
          <Badge
            overflowCount={100}
            count={numberArticles.numberAll}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },
    {
      key: "1",
      label: (
        <span>
          Bản nháp
          <Badge
            overflowCount={100}
            count={numberArticles.numberDrafted}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },
    {
      key: "2",
      label: (
        <span>
          Chờ phê duyệt
          <Badge
            overflowCount={100}
            count={numberArticles.numberWaitForApproval}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },
    {
      key: "7",
      label: (
        <span>
          Gửi lại chờ phê duyệt
          <Badge
            overflowCount={100}
            count={numberArticles.numberResendWaitForApproval}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },
    {
      key: "3",
      label: (
        <span>
          Đã phê duyệt
          <Badge
            overflowCount={100}
            count={numberArticles.numberApproved}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },

    {
      key: "4",
      label: (
        <span>
          Bị từ chối
          <Badge
            overflowCount={100}
            count={numberArticles.numberRefused}
            className="custom-badge"
            style={{
              backgroundColor: "#1677ff",
              borderRadius: "50%",
              marginLeft: "5px",
            }}
          />
        </span>
      ),
      badgeCount: 5,
    },
  ];
  const items1 = [
    {
      key: "1",
      label: "Thông tin",
      children: (
        <div id="my-article">
          <Row gutter={24}>
            <Col lg={8} sm={24} md={24} className="mb-7  w-full">
              <Card title="Danh sách thống kê" bordered={false}>
                <Row className="pb-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết đã viết:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberAll}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết bị từ chối:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberRefused}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết đã đăng:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberPosted}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết đã gửi:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberSent}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết bị trùng:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberDuplicated}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col span={20}>
                    <span style={{ fontWeight: 500 }}>
                      Tổng số lượng bài viết đã phê duyệt:{" "}
                    </span>
                  </Col>
                  <Col span={4} className="text-right">
                    <span style={{ fontWeight: 500 }}>
                      {numberArticles.numberApproved}
                    </span>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg={8} sm={24} md={24} className="mb-7  w-full">
              {hasData ? (
                <Badge.Ribbon
                  text={complete ? "Đã hoàn thành" : "Chưa hoàn thành"}
                  color={complete ? "green" : "red"}
                >
                  <Card title="Đợt tham gia hiện tại" bordered={false}>
                    <Row className="pb-3">
                      <Col span={12}>
                        <span style={{ fontWeight: 500 }}>
                          Tên đợt đăng ký:{" "}
                        </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <span style={{ fontWeight: 500 }}>
                          {registrationPeriod.name}
                        </span>
                      </Col>
                    </Row>
                    <Row className="py-3">
                      <Col span={12}>
                        <span style={{ fontWeight: 500 }}>
                          Thời gian bắt đầu:{" "}
                        </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <span style={{ fontWeight: 500 }}>
                          {moment(registrationPeriod.fromDate).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </Col>
                    </Row>
                    <Row className="py-3">
                      <Col span={12}>
                        <span style={{ fontWeight: 500 }}>
                          Thời gian kết thúc:{" "}
                        </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <span style={{ fontWeight: 500 }}>
                          {moment(registrationPeriod.toDate).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      </Col>
                    </Row>
                    <Row className="py-3">
                      <Col span={12}>
                        <span style={{ fontWeight: 500 }}>
                          Số lượng bài viết phải viết:{" "}
                        </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <span style={{ fontWeight: 500 }}>
                          {registrationPeriod.assignedArticleCount}
                        </span>
                      </Col>
                    </Row>
                    <Row className="py-3">
                      <Col span={12}>
                        <span style={{ fontWeight: 500 }}>
                          Số lượng bài viết đã viết:{" "}
                        </span>
                      </Col>
                      <Col span={12} className="text-right">
                        <span style={{ fontWeight: 500 }}>
                          {registrationPeriod.writtenArticlesCount}
                        </span>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ) : (
                <Badge.Ribbon text="Không có đợt" color="red">
                  <Card title="Đợt tham gia hiện tại" bordered={false}>
                    <Row className="pb-3 justify-center">
                      <Empty />
                    </Row>
                  </Card>
                </Badge.Ribbon>
              )}
            </Col>
            <Col lg={8} sm={24} md={24} className="mb-7  w-full">
              <Card title="Top 5 bài viết được yêu thích nhất" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={topFive}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.previewImage} />}
                        title={
                          <Link style={{wordBreak: "break-word"}} to={`/user/my-article/${item.id}`}>
                            {item.title}
                          </Link>
                        }
                        description={
                          <span>
                            {item.descriptive} - {item.totalCount} lượt thích
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "2",
      label: "Danh sách bài viết",
      children: (
        <div className="">
          <Row>
            <Col lg={17}>
              <div>
                <Tabs defaultActiveKey="10" onChange={onChange} type="card">
                  {items.map((item) => (
                    <Tabs.TabPane key={item.key} tab={item.label}>
                      {item.children}
                      {dataArticle.length > 0 ? (
                        <CardMyArticle data={dataArticle} />
                      ) : (
                        <p>Không có bài viết</p>
                      )}
                      <div className="mt-5 text-center">
                        {total > 1 && (
                          <Pagination
                            simple
                            current={current}
                            onChange={(value) => {
                              setCurrent(value);
                            }}
                            total={total * 10}
                          />
                        )}
                      </div>
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </div>
            </Col>
          </Row>
        </div>
      ),
    },
  ];
  const request = { story: editedStory };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (editedStory.trim().length < 6 || editedStory.trim().length > 255) {
        message.warning("Tiểu sử phải lớn hơn 6 và nhỏ hơn 255 ký tự !!");
      } else {
        setIsEditing(false);
        try {
          UserAPI.updateStory(request).then(() => {
            fetchMyUser();
          });
          message.success("Cập nhật tiểu sử thành công!!!");
        } catch (error) {
          message.error("Đã xảy ra lỗi khi cập nhật tiểu sử");
        }
      }
    }
  };

  // Background
  const [fileList, setFileList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
    setFileList([]);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setFileList([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };
  const onFinish = () => {
    if (fileList.length === 0) {
      message.error("Chưa có file nào được chọn");
    } else {
      handleOk();
      convertFileToBase64Only(fileList[0])
    .then((base64String) => {
      setImagePreview(`data:image/png;base64,${base64String}`);
    })
    .catch((error) => {
        console.error(error);
    });
      setImageBase64(fileList[0]);
    }
  };

  const checkFile = (request) => {
    if (request.file.size <= 0) {
      message.error("Yêu cầu không nhập file rỗng");
      setFileList([]);
      return;
    }
    if (request.file.size > 10000000) {
      message.error("Yêu cầu file không được quá 10MB");
      setFileList([]);
      return;
    }
    if (
      !request.file.name.includes(".png") &&
      !request.file.name.includes(".jpg")
    ) {
      message.error("Vui lòng chọn một tệp ảnh file PNG hoặc JPG.");
      setFileList([]);
      return;
    }
    setFileList([request.file]);
  };

  // Avatar
  const [fileListAvatar, setFileListAvatar] = useState([]);
  const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);

  const showModalAvatar = () => {
    setIsModalOpenAvatar(true);
    setFileListAvatar([]);
  };
  const handleOkAvatar = () => {
    setIsModalOpenAvatar(false);
    setFileListAvatar([]);
  };
  const handleCancelAvatar = () => {
    setIsModalOpenAvatar(false);
    setFileListAvatar([]);
  };

  // avatar
  const onFinishAvatar = () => {
    if (fileListAvatar.length === 0) {
      message.error("Chưa có file nào được chọn");
    } else {
      handleOkAvatar();
      // setImageAvata(fileListAvatar);
      const data = { avatar: fileListAvatar };
      Modal.confirm({
        title: "Đổi Avatar",
        content: "Bạn có chắc chắn muốn đổi avatar không?",
        onOk: () => {
          UserAPI.updateAvatar(data).then(() => {
            fetchMyUser();
            message.success("Cập nhật ảnh đại diện thành công!!!");
          });
        },
        okText: "Lưu",
        okCancel: "Đóng",
      });
    }
  };
  const checkFileAvatar = (request) => {
    if (request.file.size <= 0) {
      message.error("Yêu cầu không nhập file rỗng");
      setFileListAvatar([]);
      return;
    }
    if (request.file.size > 10000000) {
      message.error("Yêu cầu file không được quá 10MB");
      setFileListAvatar([]);
      return;
    }
    if (
      !request.file.name.includes(".png") &&
      !request.file.name.includes(".jpg")
    ) {
      message.error("Vui lòng chọn một tệp ảnh file PNG hoặc JPG.");
      setFileListAvatar([]);
      return;
    }
    setFileListAvatar([request.file]);
  };

  // useEffect(() => {
  //   setCheckBackground(true);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, imageBase64)

  return (
    <div>
      <div>
        <Card
          style={{
            height: 250,
            backgroundImage: `url(${imagePreview === null ? userData?.background : imagePreview})`,
            backgroundSize: "cover", // Đảm bảo hình ảnh nằm vừa với kích thước của thẻ Card
            position: "relative", // Cần để phần tử con (hình ảnh và nút) nằm trên background
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              bottom: 0,
              position: "absolute",
              right: 0,
              marginRight: 15,
              marginBottom: 15,
            }}
          >
            {imagePreview !== null && (
              <>
                <Button
                  className="mx-5"
                  onClick={() => { setImageBase64([]);  setImagePreview(null)}}
                  icon={<IssuesCloseOutlined />}
                >
                  Hủy
                </Button>
                <Button
                  className="mx-5"
                  onClick={() => {
                    try {
                      Modal.confirm({
                        title: "Đổi background",
                        content: "Bạn có chắc chắn muốn đổi background không?",
                        onOk: () => {
                          UserAPI.updateBackground({
                            background: imageBase64,
                          }).then(() => {
                            fetchMyUser();
                            setImageBase64(null);
                            setImagePreview(null);
                            message.success("Cập nhật ảnh bìa thành công!!!");
                          });
                        },
                        okText: "Lưu",
                        okCancel: "Đóng",
                      });
                    } catch (error) {
                      message.error("Đã xảy ra lỗi khi cập nhật ảnh bìa");
                    }
                  }}
                  icon={<SaveOutlined />}
                >
                  Lưu
                </Button>
              </>
            )}
            {imagePreview === null && (
              <Tooltip title={"Đổi ảnh bìa"}>
                <Button
                  onClick={showModal}
                  icon={<CameraOutlined />}
                  style={{ backgroundColor: "white", border: "none" }}
                >
                  Đổi ảnh bìa
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Modal thêm từ file  */}
          <Modal
            title="Tải lên file"
            open={isModalOpen}
            cancelText="Đóng"
            okText="Tải lên"
            onOk={onFinish}
            onCancel={handleCancel}
          >
            <>
              <hr className="border-0 bg-gray-300 mt-3 mb-6" />

              <Dragger
                multiple={false}
                maxCount={1}
                customRequest={checkFile}
                fileList={fileList}
                // showUploadList={false} // Ẩn danh sách tệp đã tải lên
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Nhấn hoặc kéo tệp vào khu vực này để tải lên
                </p>
                <p className="ant-upload-hint">
                  Hỗ trợ tải một file có đuôi .png hoặc jpg, nhỏ hơn 10MB. Xin
                  cảm ơn! 😊😊😊
                </p>
              </Dragger>
            </>
          </Modal>
        </Card>

        <div className="pl-7">
          <Row>
            {/* <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <Avatar size={100} icon={<CameraOutlined />} />
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              className="absolute bottom-0 right-0"
              // onClick={handleOpenModal}
            />
          </div>
        </div> */}
            <Col xs={24} sm={12} md={4} className="pl-3">
              <div
                className="flex items-center justify-center"
                style={{ position: "relative" }}
              >
                <div className="relative">
                  <Avatar
                    size={180}
                    icon={<Image width={180} src={`${userData?.img}`} />}
                  />
                  <Button
                    className="absolute bottom-0 right-0"
                    onClick={showModalAvatar}
                    shape="circle"
                    style={{ width: "45px", height: "45px" }}
                    icon={<CameraOutlined />}
                  ></Button>
                </div>
              </div>
              <div
                style={{
                  bottom: 0,
                  position: "absolute",
                  right: 0,
                  marginRight: 15,
                }}
              >
                {/* Modal thêm từ file  */}
                <Modal
                  title="Đổi Ảnh"
                  open={isModalOpenAvatar}
                  cancelText="Đóng"
                  okText="Tải lên"
                  onOk={onFinishAvatar}
                  onCancel={handleCancelAvatar}
                >
                  <>
                    <hr className="border-0 bg-gray-300 mt-3 mb-6" />

                    <Dragger
                      multiple={false}
                      maxCount={1}
                      customRequest={checkFileAvatar}
                      fileList={fileListAvatar}
                      // showUploadList={false} // Ẩn danh sách tệp đã tải lên
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Nhấn hoặc kéo tệp vào khu vực này để tải lên
                      </p>
                      <p className="ant-upload-hint">
                        Hỗ trợ tải một file có đuôi .png hoặc jpg, nhỏ hơn 10MB.
                        Xin cảm ơn! 😊😊😊
                      </p>
                    </Dragger>
                  </>
                </Modal>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={18}
              className="ml-4 pl-6 flex flex-col justify-center"
            >
              <p className="text-3xl font-bold mt-1">{userData?.name}</p>
              {isEditing ? (
                <>
                  <Tooltip title={"Nhập tiểu sử sau đó nhấn Enter để cập nhật"}>
                    <Input
                      type="text"
                      value={editedStory}
                      onChange={handleStoryChange}
                      onKeyDown={handleKeyDown}
                      className="text-xl font-black"
                      style={{
                        width: "250px",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid black",
                        color: "light-black",
                        fontWeight: "bold",
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <span className="text-xl font-black" onClick={handleStoryClick}>
                  <Tooltip title={"Chỉnh sửa tiểu sử"}>
                    {userData?.story}
                  </Tooltip>
                </span>
              )}
              {storyHasData ? (
                <Button onClick={() => handleStoryClick()} style={{width: '100px'}}>Thêm tiểu sử</Button>
              ) : null}
            </Col>
          </Row>
        </div>
        <div className="pl-7 pt-8">
          <Tabs defaultActiveKey="1" items={items1} type="card" />
        </div>
        <div className="pl-7"></div>
        <div></div>
      </div>
    </div>
  );
});

export default MyArticle;
