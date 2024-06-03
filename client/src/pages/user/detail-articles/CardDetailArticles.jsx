import React from "react";
import { Avatar, Col, Row, Space, Tag, Tooltip, Typography } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import "./index.css";
import { ArticleAPI } from "../../../apis/user/auth/article/article.api";
import { Link } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import { store } from "../../../app/store";
import {
  finishLoading,
  startLoading,
} from "../../../app/reducers/loading/loading.reducer";

const DetailArticles = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const [articleByAuthor, setArticleByAuthor] = useState([]);
  const [articleByCategory, setArticleByCategory] = useState([]);

  useEffect(() => {
    setCardsData(props.data);
    console.log(props.data);
  }, [props.data]);

  useEffect(() => {
    const fetchArticlesByAuthor = async () => {
      const dataByAuthor = {
        userId: cardsData.userId,
        size: 4,
        idDetails: cardsData.id,
      };
      const dataByCate = {
        categoryName: cardsData.nameCategory,
        size: 4,
        idDetails: cardsData.id,
      };
      const response = await ArticleAPI.fetchAllArticleByAuthor(dataByAuthor);
      setArticleByAuthor(response.data.data.data);

      const response1 = await ArticleAPI.fetchAllArticleByCategory(dataByCate);
      setArticleByCategory(response1.data.data.data);
    };
    fetchArticlesByAuthor();
  }, [cardsData]);
  window.onscroll = function () {
    const content = document.getElementById("iconDetailArticl");
    if (content) {
      if (window.scrollY > this.prevScrollY) {
        content.className =
          "opacity-0 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
      } else {
        content.className =
          "opacity-100 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
      }

      this.prevScrollY = window.scrollY;
    }
  };

  const handleGoBack = () => {
    store.dispatch(startLoading());
    window.history.back();
    store.dispatch(finishLoading());
  };

  return (
    <div className="justify-items-center">
      <Row className="mb-10">
        <Card style={{ background: "#ffffff", width: "100%" }}>
          <Row>
            <Col span={23}>
              <div className="flex ">
                {cardsData.namePeriod ? (
                  <Typography className="category1" variant="subtitle1">
                    {cardsData.namePeriod}
                  </Typography>
                ) : null}

                {cardsData.nameCategory ? (
                  <Typography
                    variant="subtitle1"
                    className="category2"
                    style={{ marginLeft: "10px" }}
                  >
                    {cardsData.nameCategory}
                  </Typography>
                ) : null}
              </div>
            </Col>
            <Col span={1}>
              <div
                style={{
                  float: "right",
                }}
              >
                <span
                  onClick={() => handleGoBack()}
                  style={{ right: 0, color: "gray" }}
                >
                  <Tooltip title={"Quay lại"}>
                    <CloseCircleOutlined style={{ fontSize: "20px" }} />
                  </Tooltip>
                </span>
              </div>
            </Col>
          </Row>

          {/* Tiêu đề bài viết */}
          <h3
            className="text-5xl text-slate-900 font-bold not-italic"
            style={{ overflowWrap: "break-word" }}
          >
            {cardsData.title}
          </h3>
          {cardsData.hashtags
            ? cardsData.hashtags.split(",").map((el) => (
                <Tag color="green" style={{ fontSize: "15px" }}>
                  {el}
                </Tag>
              ))
            : null}
          <Row>
            <Col span={18}>
              <div className="flex mt-3 mb-3">
                <div>
                  <a href="# ">
                    <Avatar
                      src={cardsData.img}
                      style={{ width: "48px", height: "48px" }}
                    />
                  </a>
                </div>
                <div className="ms-5">
                  <div className="flex">
                    <Typography variant="subtitle1" className="name1">
                      {cardsData.name}
                    </Typography>
                  </div>
                  <span>
                    {moment(cardsData.createdDate).format("DD/MM/YYYY HH:mm")}
                  </span>
                </div>
              </div>
            </Col>
            {/* Icon like cmt share */}
            <Col span={6}>
              <div className="flex justify-end pt-6"></div>
            </Col>
          </Row>
          <div style={{ marginTop: "20px" }}>
            <JoditEditor
              value={cardsData.content}
              tabIndex={-1}
              config={{
                readonly: true,
                toolbar: false,
                showCharsCounter: false,
                showWordsCounter: false,
                showStatusbar: true,
                showPoweredBy: false,
                className: "view_editor_jodit",
                style: {
                  backgroundColor: "#ffffff",
                  border: "none",
                },
              }}
            />
          </div>
          {/* <DemoComment></DemoComment> */}
        </Card>
      </Row>
      <div>
        <div>
          {articleByAuthor.length !== 0 ? (
            <>
              <Row className="mt-16 mb-14">
                <Col span={24} className="text-center">
                  <hr className="w-full bg-gray-200 border-0" />
                  <span
                    className="text w-full"
                    style={{
                      color: "gray",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    BÀI VIẾT KHÁC CỦA: {cardsData.name}
                  </span>
                  <hr className="w-full bg-gray-200 border-0" />
                  {/* </Link> */}
                </Col>
              </Row>
              <Row className="justify-between">
                {articleByAuthor.map((item) => (
                  <Col
                    lg={11}
                    sm={24}
                    md={24}
                    xs={24}
                    style={{ marginTop: "20px" }}
                  >
                    <Card>
                      <div>
                        <div className="flex -ml-2">
                          <div className="flex ml-2">
                            <Avatar className="mb-2" src={item.img} />
                            <Typography
                              className="ml-2 pt-1"
                              variant="subtitle1"
                            >
                              {item.name}
                            </Typography>
                          </div>
                          <span className="text-3xl text-slate-900 font-normal ml-1 -mt-3 ">
                            .
                          </span>
                          <div className="flex ml-1 pt-1">
                            <span>
                              {moment(item.browseDate).format("DD/MM/YYYY")}
                            </span>
                            <span> </span>
                          </div>
                        </div>

                        <Meta
                          className="flex mb-4 "
                          style={{ marginTop: "-20px" }}
                          title={
                            <Link to={`/user/article/${item.id}`}>
                              <span className="text-xl">{item.title}</span>
                            </Link>
                          }
                          description={
                            <span className="text-base">
                              {item.descriptive.length > 70
                                ? item.descriptive.substring(0, 70) + "..."
                                : item.descriptive}
                            </span>
                          }
                        />

                        <Space size={[0, 8]} wrap>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : null}
        </div>
        <div>
          {articleByCategory.length !== 0 ? (
            <>
              <Row className="mt-16 mb-14">
                <Col span={24} className="text-center">
                  <hr className="w-full bg-gray-200 border-0" />
                  <span
                    className="text w-full"
                    style={{
                      color: "gray",
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    Bài viết cùng loại: {cardsData.nameCategory}
                  </span>
                  <hr className="w-full bg-gray-200 border-0" />
                  {/* </Link> */}
                </Col>
              </Row>
              <Row className="justify-between">
                {articleByCategory.map((item1) => (
                  <Col
                    lg={11}
                    sm={24}
                    md={24}
                    xs={24}
                    style={{ marginTop: "20px" }}
                  >
                    <Card>
                      <div>
                        <div className="flex -ml-2">
                          <div className="flex ml-2">
                            <Avatar className="mb-2" src={item1.img} />
                            <Typography
                              className="ml-2 pt-1"
                              variant="subtitle1"
                            >
                              {item1.name}
                            </Typography>
                          </div>
                          <span className="text-3xl text-slate-900 font-normal ml-1 -mt-3 ">
                            .
                          </span>
                          <div className="flex ml-1 pt-1">
                            <span>
                              {moment(item1.browseDate).format("DD/MM/YYYY")}
                            </span>
                            <span> </span>
                          </div>
                        </div>

                        <Meta
                          className="flex mb-4"
                          title={
                            <Link to={`/user/article/${item1.id}`}>
                              <span className="text-xl">{item1.title}</span>
                            </Link>
                          }
                          description={
                            <span className="text-base">
                              {item1.descriptive.length > 60
                                ? item1.descriptive.substring(0, 60) + "..."
                                : item1.descriptive}
                            </span>
                          }
                        />

                        <Space size={[0, 8]} wrap>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DetailArticles;
