import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Tooltip,
  Typography,
  Image,
  message,
  Modal,
  Checkbox,
  Input,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import {
  // CommentOutlined,
  HeartFilled,
  HeartOutlined,
  LineOutlined,
  StarFilled,
  ArrowLeftOutlined,
  PlusSquareOutlined,
  FolderAddOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { TymAPI } from "../../../apis/user/auth/tym/tym.api";
import { AuthUserAlbumAPI } from "../../../apis/user/auth/album/user-album.api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetArticlesAlbum,
  SetArticlesAlbum,
} from "../../../app/reducers/articles-album/articles-album.reducer";
import { getStompClient } from "../../../apis/stomp-client/config";
import { SetCountNotification } from "../../../app/reducers/notification/count-notification-user.reducer";
import { AuthAlbumAPI } from "../../../apis/user/auth/album/user.album.api";
import jwtDecode from "jwt-decode";
import { getToken } from "../../../helper/userToken";

const { Option } = Select;
const CardDemo = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const dispatch = useAppDispatch();
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("true");
  const [articlesId, setArticlesId] = useState("");
  const [visible, setVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [titleError, setTitleError] = useState(null);
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const idUser = decodedToken.id;

  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  // realtime tym
  const stompClient = getStompClient();

  const connect = () => {
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/portal-articles/create-notification-user/" + idUser,
        function (message) {
          const data = JSON.parse(message.body).data;
          dispatch(SetCountNotification(data));
        }
      );
    });
  };

  useEffect(() => {
    if (stompClient != null) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //create album
  const fetchArticleAlbum = (id) => {
    AuthUserAlbumAPI.findAllSimpleAllBumByUserId(id).then((response) => {
      dispatch(SetArticlesAlbum(response.data.data));
    });
  };

  const dataAlbum = useAppSelector(GetArticlesAlbum);

  useEffect(() => {
    const albumsWithArticles = dataAlbum.filter(
      (album) => album.countArticle > 0
    );
    const albumIdsWithArticles = albumsWithArticles.map((album) => album.id);
    setCheckedItems(albumIdsWithArticles);
  }, [dataAlbum]);

  const createArticleAlbum = (albumId) => {
    const data = {
      articlesId: articlesId,
      albumId: albumId,
    };
    return AuthUserAlbumAPI.create(data)
      .then((response) => {
        const result = response.data;
        message.success("Đã thêm vào album");
        return result;
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        throw error;
      });
  };

  const deleteArticleAlbum = (albumId) => {
    const data = {
      articleId: articlesId,
      albumId: albumId,
    };
    return AuthUserAlbumAPI.delete(data)
      .then((response) => {
        const result = response.data;
        message.success("Đã xóa khỏi album");
        return result;
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        throw error;
      });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const createAlbum = () => {
    if (title.trim() === "") {
      setTitleError("Tên không được để trống");
      return;
    }

    const titlePattern =
      /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
    const isTitleValid = titlePattern.test(title.trim());
    const isTitleLengthValid =
      title.trim().length >= 6 && title.trim().length <= 250;

    if (!isTitleValid) {
      setTitleError("Tiêu đề không được có các kí tự đặc biệt");
      return;
    }

    if (!isTitleLengthValid) {
      setTitleError("Tiêu đề phải từ 6 đến 250 kí tự");
      return;
    }

    const data = {
      title: title.trim(),
      status: status,
    };

    return AuthAlbumAPI.addAlbum(data)
      .then((response) => {
        const result = response.data.data;
        createArticleAlbum(result.id);
        setTitleError(null);
        handleModalClose();
        return result;
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

  const handleCheckboxChange = (id) => {
    const isChecked = checkedItems.includes(id);

    if (isChecked) {
      setCheckedItems((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== id)
      );
      deleteArticleAlbum(id);
    } else {
      setCheckedItems((prevCheckedItems) => [...prevCheckedItems, id]);
      createArticleAlbum(id);
    }
  };

  const handleModalOpen = () => {
    setVisible(true);
  };

  const handleModalClose = () => {
    setVisible(false);
    setShowAdditionalFields(false);
    setTitle("");
    setShowBackButton(false);
  };

  const handleToggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    setShowBackButton(!showBackButton);
  };

  const handleBack = () => {
    setShowAdditionalFields(false);
    setShowBackButton(false);
  };

  const handleCombinedClick = (id) => {
    fetchArticleAlbum(id);
    setArticlesId(id);
    handleModalOpen();
  };
  //end create album

  const handleLike = async (id) => {
    await TymAPI.createTymArticle({
      articlesId: id,
    });
    setCardsData((prevCardsData) =>
      prevCardsData.map((card) => {
        if (card.id === id) {
          const newFavoriteValue = card.favorite === 0 ? 1 : 0;
          const newTymValue = newFavoriteValue === 1 ? card.tym + 1 : card.tym;
          return { ...card, favorite: newFavoriteValue, tym: newTymValue };
        }
        return card;
      })
    );
    stompClient.send("/action/create-notification-user/" + idUser);
  };
  const handleUnlike = async (id) => {
    await TymAPI.deleteTymArticle(id);
    setCardsData((prevCardsData) =>
      prevCardsData.map((card) => {
        if (card.id === id) {
          const newFavoriteValue = card.favorite === 1 ? 0 : 1;
          const newTymValue =
            newFavoriteValue === 1 ? card.tym + 1 : card.tym - 1;
          return { ...card, favorite: newFavoriteValue, tym: newTymValue };
        }
        return card;
      })
    );
  };
  return (
    <div className="pb-10">
      <div>
        {cardsData.map((card) => (
          <div
            // key={card.id}
            className="bg-white rounded-lg shadow-md relative mb-6">
            <Card>
              <Row>
                <Col span={16}>
                  <div className="flex pb-2">
                    <div className="flex">
                      <Tooltip
                        key={card.id}
                        color="#fff"
                        placement="right"
                        className="img-cusor">
                        <Avatar src={card.img} />
                      </Tooltip>

                      <Typography
                        avatar={card.img}
                        variant="subtitle1"
                        className="ml-3 pt-1 font-bold">
                        <Link
                          style={{ color: "black" }}
                          to={`/user/profile/${card.userId}`}>
                          {card.name}
                        </Link>
                      </Typography>
                    </div>
                    <div className="flex pt-1">
                      <span>
                        <LineOutlined style={{ transform: "rotate(90deg)" }} />
                      </span>
                      <span>
                        {moment(card.createdDate).format("DD/MM/YYYY HH:mm")}
                      </span>
                      <span className="text-yellow-400">
                        <StarFilled style={{ marginLeft: "10px" }} />
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        {/* <Link
                          to={`/user/article?category=${card.nameCategory}`}
                        > */}
                        {card.nameCategory}
                        {/* </Link> */}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Meta
                      title={<span className="text-xl"> {card.title}</span>}
                      description={
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}>
                            {/* HashTag */}
                            <Space
                              size={[0, 8]}
                              wrap
                              className="float-left mt-3"></Space>

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
                                }}>
                                {card.descriptive}
                              </p>
                              {" ..."}
                              <Link
                                className="w-1/5"
                                to={`/user/article/${card.id}`}>
                                Xem thêm
                              </Link>
                            </div>

                            {/* Like share comment */}
                            {card.status === 7 ? (
                              "Gửi lại chờ phê duyệt"
                            ) : card.status === 2 ? (
                              "Chờ phê duyệt"
                            ) : (
                              <>
                                <div className="flex mt-3 -ml-3.5 float-left">
                                  <span className="flex items-center ml-4 text-base">
                                    {card.favorite === 1 ? (
                                      <HeartFilled
                                        style={{ color: "red" }}
                                        onClick={() => handleUnlike(card.id)}
                                      />
                                    ) : (
                                      <HeartOutlined
                                        onClick={() => handleLike(card.id)}
                                      />
                                    )}
                                    <span className="text-base ml-1">
                                      {card.tym}
                                    </span>
                                  </span>
                                  <span className="flex items-center ml-4 text-base cursor-pointer">
                                    <Tooltip title="Thêm bài viết vào album">
                                      <FolderAddOutlined
                                        onClick={() => {
                                          handleCombinedClick(card.id);
                                        }}
                                        className="hover:text-blue-500"
                                      />
                                    </Tooltip>
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </>
                      }
                      className="text-left"
                    />
                  </div>
                </Col>
                <Col
                  span={8}
                  className="flex justify-end items-center">
                  <div
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      float: "right",
                    }}>
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
              </Row>
            </Card>
          </div>
        ))}
      </div>
      <div>
        <Modal
          title="Tạo album mới"
          visible={visible}
          onCancel={handleModalClose}
          footer={
            showBackButton
              ? [
                  <div className="flex items-center">
                    <span
                      className="flex items-center text-base cursor-pointer"
                      onClick={handleBack}>
                      <ArrowLeftOutlined className="mr-2" />
                    </span>
                    <Button
                      style={{ borderRadius: "20px" }}
                      onClick={createAlbum}
                      className="hover:bg-blue-50 ml-auto">
                      Tạo
                    </Button>
                  </div>,
                ]
              : [
                  <span
                    className="flex items-center text-base cursor-pointer"
                    onClick={handleToggleAdditionalFields}>
                    <PlusSquareOutlined className="mr-2" />
                    Tạo album mới
                  </span>,
                ]
          }>
          {dataAlbum.map((album) => (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(album.id)}
                checked={checkedItems.includes(album.id)}
                key={album.id}
                value={album.id}>
                {album.title}
              </Checkbox>
              <span className="float-right">
                {album.status ? <LockOutlined /> : <GlobalOutlined />}
              </span>
              <br></br>
            </>
          ))}

          {showAdditionalFields && (
            <>
              <label style={{ display: "block", marginTop: "10px" }}>Tên</label>
              <Input
                value={title}
                onChange={handleTitleChange}
                style={{ border: "none", borderBottom: "1px solid #000" }}
                placeholder="Nhập tên album"
                key="inputField"
              />
              {titleError && <p style={{ color: "red" }}>{titleError}</p>}
              <label style={{ display: "block", marginTop: "10px" }}>
                Quyền riêng tư
              </label>
              <Select
                value={status}
                onChange={handleStatusChange}
                style={{ width: "100%", marginTop: 10 }}
                placeholder="Chọn một giá trị"
                key="selectField">
                <Option value="false">
                  <span className="flex items-center text-base cursor-pointer mt-2">
                    <GlobalOutlined className="mr-2" />
                    Công khai
                  </span>
                </Option>
                <Option value="true">
                  <span className="flex items-center text-base cursor-pointer mt-2">
                    <LockOutlined className="mr-2" />
                    Không công khai
                  </span>
                </Option>
              </Select>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CardDemo;
