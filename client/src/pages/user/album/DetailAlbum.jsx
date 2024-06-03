import {
  AuditOutlined,
  CalendarOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Dropdown,
  Empty,
  Image,
  Input,
  Menu,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
import { useParams, useNavigate } from "react-router-dom";
import { AuthAlbumAPI } from "../../../apis/user/auth/album/user.album.api";

export default function DetailAlbum() {
  const [articles, setArticles] = useState([]);
  const [album, setAlbum] = useState({});
  const { id } = useParams();
  const [articleId, setArticleId] = useState(null);
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [albumHasArticles, setAlbumHasArticles] = useState(false);
  const [firstImage, setFirstImage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Để kiểm tra xem title đang được chỉnh sửa hay không
  const [editedTitle, setEditedTitle] = useState(""); // State để lưu trữ title đang chỉnh sửa
  const [editedStatus, setEditedStatus] = useState(true);
  const { Option } = Select;

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleStatusChange = (value) => {
    setEditedStatus(value);
    const request = { title: editedTitle, status: value };
    AuthAlbumAPI.updateAlbum(request, id)
      .then(() => {
        message.success("Update album thành công!!!");
        getAlbumById();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else {
          message.error("Lỗi hệ thống");
        }
      });
  };

  const getAllArticlesByAlbum = () => {
    AuthAlbumAPI.fetchAllArticleByAlbum(id).then((response) => {
      setArticles(response.data.data.data);
      if (response.data.data.data.length === 0) {
        setAlbumHasArticles(false);
      } else {
        setAlbumHasArticles(true);
        setFirstImage(response.data.data.data[0].previewImage);
      }
    });
  };

  const getAlbumById = () => {
    AuthAlbumAPI.fetchAlbumById(id).then((response) => {
      setAlbum(response.data.data);
      setEditedTitle(response.data.data.title);
      setEditedStatus(response.data.data.status);
    });
  };

  const handleKeyDown = (event) => {
    const request = { title: editedTitle, status: editedStatus };
    if (event.key === "Enter") {
      if (editedTitle.length < 6 || editedTitle.length > 255) {
        message.warning("Tên album phải lớn hơn 6 và nhỏ hơn 255 ký tự !!");
      } else {
        setIsEditing(false);
        AuthAlbumAPI.updateAlbum(request, id)
          .then(() => {
            getAlbumById();
            message.success("Đổi tên album thành công!!!");
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message.error(error.response.data.message);
            } else {
              message.error("Lỗi hệ thống");
            }
          });
      }
    }
  };

  useEffect(() => {
    getAllArticlesByAlbum();
    getAlbumById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDropdownMore = (e) => {
    setArticleId(e.key);
  };

  const moreOption = (
    <Menu onClick={handleDropdownMore}>
      <Menu.Item key={articleId} onClick={() => deleteArticle()}>
        <DeleteOutlined className="mr-2" />
        Xóa khỏi album
      </Menu.Item>
    </Menu>
  );

  const setIdBaiViet = (id) => {
    setArticleId(id);
  };

  const deleteArticle = () => {
    AuthAlbumAPI.deleteArticleOnAlbum(articleId, id)
      .then(() => {
        getAllArticlesByAlbum();
        getAlbumById();
        message.success("Xóa bài viết khỏi album thành công");
      })
      .catch((error) => {
        message.error("Xóa bài viết khỏi album thất bại");
      });
  };

  const handleClickArticle = (id) => {
    navigate(`/user/article/${id}`);
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteAlbum = (id) => {
    showDeleteModal();
  };

  const confirmDeleteAlbum = (id) => {
    AuthAlbumAPI.deleteAlbum(id)
      .then(() => {
        setIsDeleteModalVisible(false);
        navigate("/user/album");
        message.success("Xóa album thành công!");
      })
      .catch((error) => {
        message.error("Xóa album thất bại");
      });
  };

  const cancelDeleteAlbum = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <div id="album">
      <div>
        <Row>
          <Col xs={8} className="mr-6">
            <Card
              className="ablum-filter"
              hoverable
              style={{
                width: "auto",
                overflow: "hidden",
                // background: `url(${anh1})`
                background: album.userImg,
              }}
            >
              <div style={{}}>
                <Image
                  src={albumHasArticles ? firstImage : album.userImg}
                  style={{
                    width: "100%",
                  }}
                ></Image>
                <div className="pt-3 justify-between">
                  <Row>
                    <Col xs={22}>
                      {isEditing ? (
                        <>
                          <Input
                            type="text"
                            value={editedTitle}
                            onChange={handleTitleChange}
                            onKeyDown={handleKeyDown}
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              borderBottom: "3px solid white", // Thêm border chỉ bên dưới
                              color: "white",
                              fontWeight: "bolder",
                            }}
                            className="text-3xl font-black"
                          />
                        </>
                      ) : (
                        <span
                          className="text-3xl font-black"
                          onClick={handleTitleClick}
                        >
                          {album.title}
                        </span>
                      )}
                    </Col>
                    <Col
                      xs={2}
                      className="pt-2"
                      style={{ fontSize: "20px" }}
                    ></Col>
                  </Row>
                  <Row className="pt-3">
                    <span className="text-xl">
                      <AuditOutlined className="mr-2" />
                      {album.userName}
                    </span>
                  </Row>
                  <Row className="pt-3">
                    <span className="text-base">
                      {album.numberOfArticle} bài viết
                    </span>
                    <span className="text-base ml-3">
                      <CalendarOutlined className="mr-1" />
                      {formatDate(album.creatAt)}
                    </span>
                  </Row>
                  <Row className="pt-3">
                    <Col xs={22}>
                      <span className="father_of_cbb">
                        <Select
                          value={editedStatus}
                          onChange={handleStatusChange}
                        >
                          <Option value={false}>Công khai</Option>
                          <Option value={true}>Riêng tư</Option>
                        </Select>
                      </span>
                    </Col>
                    <Col xs={2} className="pt-2" style={{ fontSize: "15px" }}>
                      <Tooltip title={"Xóa album"}>
                        <DeleteOutlined
                          onClick={() => handleDeleteAlbum(album.id)}
                          className="float-right"
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={15}>
            {albumHasArticles ? (
              <div className="article-list">
                {articles.map((a) => (
                  <Card className="mb-4">
                    <Row>
                      <Col span={23}>
                        <div className="ml-1">
                          <Row className="justify-between">
                            <Col span={6}>
                              <Image
                                alt="example"
                                src={a.previewImage}
                                style={{
                                  width: "320px",
                                  height: "auto",
                                  borderRadius: "5px",
                                }}
                              />
                            </Col>
                            <Col span={17}>
                              <div className="pt-2">
                                <span
                                  className="text-lg font-semibold"
                                  onClick={() => handleClickArticle(a.id)}
                                >
                                  {a.title.length > 100
                                    ? `${a.title.substring(0, 100)} ...`
                                    : a.title}
                                </span>
                                <Row>
                                  <span className="text-lg">{a.name}</span>
                                </Row>
                                <div>
                                  <CalendarOutlined className="w-6 h-6 pt-5" />
                                  <span>
                                    {a.browseDate == null
                                      ? "Chưa phê duyệt"
                                      : formatDate(a.browseDate)}
                                  </span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col span={1}>
                        <Dropdown
                          overlay={moreOption}
                          onClick={() => setIdBaiViet(a.id)}
                          trigger={["click"]}
                        >
                          <Space className="text-base">
                            <MoreOutlined />
                          </Space>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description={"Không có bài viết"}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "0",
                  right: "0",
                  zIndex: "0",
                }}
              />
            )}
          </Col>
        </Row>
        <Modal
          title="Xác nhận xóa album"
          visible={isDeleteModalVisible}
          onOk={() => confirmDeleteAlbum(id)}
          onCancel={cancelDeleteAlbum}
          okText="Xác nhận"
          okType="danger"
          cancelText="Hủy"
        >
          Khi xóa album sẽ xóa luôn tất cả bài viết bạn đã thêm vào album đó.{" "}
          <br />
          Bạn có chắc chắn muốn xóa album này?
        </Modal>
      </div>
    </div>
  );
}
