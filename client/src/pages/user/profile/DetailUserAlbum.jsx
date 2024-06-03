import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Col, Empty, Row, Image } from "antd";
import { AuthAlbumAPI } from "../../../apis/user/auth/album/user.album.api";
import { AuditOutlined, CalendarOutlined } from "@ant-design/icons";
import "./index.css";
const DetailUserAlbumInProfile = () => {
  const [articles, setArticles] = useState([]);
  const [album, setAlbum] = useState({});
  const navigate = useNavigate();
  const [albumHasArticles, setAlbumHasArticles] = useState(false);
  const { idUser, idAlbum } = useParams();

  const dataProcess = {
    albumId: idAlbum,
    userId: idUser,
  };

  const getAllArticlesByAlbum = () => {
    AuthAlbumAPI.fetchAllArticleByAlbumInProfile(dataProcess).then(
      (response) => {
        setArticles(response.data.data.data);

        if (response.data.data.data.length === 0) {
          setAlbumHasArticles(false);
        } else {
          setAlbumHasArticles(true);
        }
      }
    );
  };

  const getAlbumById = () => {
    AuthAlbumAPI.fetchAlbumById(dataProcess.albumId).then((response) => {
      setAlbum(response.data.data);
    });
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

  const handleClickArticle = (id) => {
    navigate(`/user/profile/${idUser}/album/${idAlbum}/article/${id}`);
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
              }}
            >
              <div style={{}}>
                <Image
                  src={album.userImg}
                  style={{
                    width: "auto",
                    borderRadius: "10px",
                  }}
                ></Image>
                <div className="pt-3 justify-between">
                  <Row>
                    <Col xs={22}>
                      <span className="text-3xl font-black">{album.title}</span>
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
                      <span className="text-base">
                        {album.status === false
                          ? "Công khai"
                          : "Không công khai"}
                      </span>
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
                                src={a.img}
                                style={{
                                  width: "320px",
                                  height: "100px",
                                  borderRadius: "5px",
                                }}
                              />
                            </Col>
                            <Col span={17}>
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
                              <div className="-mt-5">
                                <span className="text-5xl text-slate-900 font-normal mr-1">
                                  .
                                </span>
                                <span>{formatDate(a.browseDate)}</span>
                              </div>
                            </Col>
                          </Row>
                        </div>
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
      </div>
    </div>
  );
};

export default DetailUserAlbumInProfile;
