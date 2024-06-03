import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Space,
  Tooltip,
  Typography,
  Image,
  Dropdown,
  Menu,
  message,
  Modal,
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import {
  CalendarFilled,
  DeleteOutlined,
  EditOutlined,
  LineOutlined,
  MoreOutlined,
  ProjectFilled,
} from "@ant-design/icons";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { useAppDispatch } from "../../../app/hooks";
import { DeleteArticles } from "../../../app/reducers/articles/articles.reducer";

const CardMyArticle = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idArticle, setIdArticle] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  const handleUpdateClick = (id) => {
    navigate(`/user/my-article/update/${id}`);
  };

  const handleDeleteClick = (id) => {
    setIdArticle(id);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    MyArticleAPI.delete(idArticle).then((res) => {
      message.success("Xóa bài viết thành công");
      dispatch(DeleteArticles(idArticle));
    });
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };

  const moreOption = (id) => (
    <Menu>
      <Menu.Item onClick={() => handleUpdateClick(id)}>
        <EditOutlined className="mr-2" />
        Cập nhật
      </Menu.Item>
      <Menu.Item onClick={() => handleDeleteClick(id)}>
        <DeleteOutlined className="mr-2" />
        Xóa
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="pb-10">
      <div>
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md relative mb-6"
          >
            <Card>
              <Row>
                <Col span={16}>
                  <div className="flex pb-2">
                    <div className="flex">
                      <Avatar
                        style={{ width: 45, height: 45 }}
                        src={card.img}
                      />
                      <div className="ml-3 pt-1 font-bold">
                        <Typography avatar={card.img} variant="subtitle1">
                          {card.name}
                        </Typography>
                        <Tag
                          color="magenta"
                          className={`status-${card.status}`}
                        >
                          {card.status === 1
                            ? "Bản nháp"
                            : card.status === 2
                            ? "Chờ phê duyệt"
                            : card.status === 3
                            ? "Đã phê duyệt"
                            : card.status === 4
                            ? "Bị từ chối"
                            : card.status === 6
                            ? "Đã gửi cho đào tạo"
                            : card.status === 7
                            ? "Gửi lại chờ phê duyệt"
                            : card.status === 8
                            ? "Đã đăng"
                            : card.status === 9
                            ? "Bài viết trùng"
                            : "Không xác định"}
                        </Tag>
                      </div>
                    </div>
                    <div className="flex pt-1">
                      <span>
                        <LineOutlined style={{ transform: "rotate(90deg)" }} />
                      </span>
                      <span>
                        <span className="text-green-400">
                          <CalendarFilled style={{ marginRight: "2px" }} />
                        </span>
                        {moment(card.createdDate).format("DD/MM/YYYY")}
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        <span className="text-blue-400">
                          <ProjectFilled style={{ marginRight: "2px" }} />
                        </span>
                        {card.nameCategory}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Meta
                      title={
                        <Tooltip title="Xem chi tiết">
                          <Link
                            to={`/user/my-article/${card.id}`}
                            className="text-xl text-black hover:text-black"
                          >
                            {" "}
                            {card.title}
                          </Link>
                        </Tooltip>
                      }
                      description={
                        <>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* HashTag */}
                            <Space
                              size={[0, 8]}
                              wrap
                              className="float-left mt-3"
                            >
                            </Space>

                            {/* Description */}
                            <div className="flex items-center">
                              <p
                                className="w-4/5"
                                style={{
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: "80%",
                                  width: "auto",
                                }}
                              >
                                {card.descriptive}
                              </p>{" "}
                              <Link
                                className="w-1/5"
                                to={`/user/my-article/${card.id}`}
                              >
                                Xem thêm
                              </Link>
                            </div>
                          </div>
                        </>
                      }
                      className="text-left"
                    />
                  </div>
                </Col>
                <Col span={7} className="flex justify-end items-center">
                  <div
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      float: "right",
                    }}
                  >
                    <Image
                      style={{
                        height: "130px",
                        objectFit: "cover",
                      }}
                      alt="example"
                      src={card.previewImage}
                    />
                  </div>
                </Col>
                <Col span={1}>
                  {[1, 2, 4, 7].includes(card.status) && (
                    <div className="more-menu">
                      <Dropdown
                        overlay={moreOption(card.id)}
                        trigger={["click"]}
                      >
                        <MoreOutlined />
                      </Dropdown>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </div>
        ))}
      </div>
      <Modal
        title="Xác nhận xóa"
        visible={isModalVisible}
        onOk={() => handleDeleteConfirm(idArticle)}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
      </Modal>
    </div>
  );
};

export default CardMyArticle;
