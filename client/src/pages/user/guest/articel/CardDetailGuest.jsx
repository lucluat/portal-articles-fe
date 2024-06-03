import React from "react";
import { Avatar, Col, Row, Space, Tooltip, Typography } from "antd";
import {
  CloseCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import "./index.css";
import { Link } from "react-router-dom";
import { ArticleGuestAPI } from "../../../../apis/user/guest/article/article.api";

const CardArticlesGuest = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const [articleByAuthor, setArticleByAuthor] = useState([]);
  const [articleByCategory, setArticleByCategory] = useState([]);
  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  useEffect(() => {
    const fetchArticlesByAuthor = async () => {
      const dataByAuthor = {
        userId: cardsData.userId,
        size: 3,
      };
      const dataByCate = {
        categoryName: cardsData.nameCategory,
      };
      const response = await ArticleGuestAPI.fetchAllArticleByAuthor(
        dataByAuthor
      );
      setArticleByAuthor(response.data.data.data);
      const response1 = await ArticleGuestAPI.fetchAllArticleByCategory(
        dataByCate
      );
      setArticleByCategory(response1.data.data.data);
    };

    fetchArticlesByAuthor();
  }, [cardsData]);
  //   window.onscroll = function () {
  //     const content = document.getElementById("iconDetailArticl");
  //     if (content) {
  //       if (window.scrollY > this.prevScrollY) {
  //         content.className =
  //           "opacity-0 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
  //       } else {
  //         content.className =
  //           "opacity-100 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
  //       }

  //       this.prevScrollY = window.scrollY;
  //     }
  //   };

  const goBack = () => {
    window.history.back();
  }

  return (
    <div
      className="justify-items-center"
      style={{
        paddingTop: "130px",
        paddingLeft: "150px",
        paddingRight: "150px",
        paddingBottom: "150px",
      }}
    >
      <Card id="iconDetailArticl" className=" bg-white rounded-lg pt-5">
        <Row>
          <Col span={23}>
            <div className="flex ">
              <Typography className="category1" variant="subtitle1">
                {cardsData.nameCategory}
              </Typography>
              <Typography
                variant="subtitle1"
                className="category2"
                style={{ marginLeft: "10px" }}
              >
                {/* Đợt đăng bài: */}
                {cardsData.namePeriod}
              </Typography>
            </div>
          </Col>
          <Col span={1}>
            <div
              style={{
                float: "right",
              }}
            >
                <Tooltip title={"Quay lại"}>
                  <CloseCircleOutlined style={{ fontSize: "20px" }} onClick={() => goBack()}/>
                </Tooltip>
            </div>
          </Col>
        </Row>
        <div>
          {/* Tiêu đề bài viết */}
          <h3
            className="text-5xl text-slate-900 font-bold not-italic"
            style={{ overflowWrap: "break-word" }}
          >
            {cardsData.title}
          </h3>
        </div>
        <div className="flex justify-between ">
          <div className="flex">
            <Avatar src={cardsData.img} style={{ width: "60px", height: "60px" }} />
            <div className="ml-3">
              <div className="flex">
                <Typography variant="subtitle1" className="name1">
                  {cardsData.name}
                </Typography>
              </div>
              <span>{moment(cardsData.browseDate).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </div>
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
      </Card>

      <div>
        <div>
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
                BÀI VIẾT KHÁC CỦA {cardsData.name}
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
                        <Typography className="ml-2 pt-1" variant="subtitle1">
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
                      className="flex"
                      style={{ marginTop: "-20px" }}
                      title={<span className="text-xl">{item.title}</span>}
                    />
                    {/* Description */}
                    <div className="flex items-center mt-3">
                      <div
                        className="max-w-4/5"
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.descriptive}
                      </div>
                      {" ... "}
                      <Link className="w-1/5" to={`/article/${item.id}`}>
                        Xem thêm
                      </Link>
                    </div>
                    <div className="flex mt-3 -ml-3">
                      <span className="flex items-center ml-4 text-">
                        <HeartOutlined className="text-base" />
                        <span className="text-base ml-1 -mt-1">{item.tym}</span>
                      </span>
                      <span className="flex items-center ml-4 text-base">
                        <ShareAltOutlined className="text-base ml-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div>
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
                BÀI VIẾT CÙNG LOẠI {cardsData.nameCategory}
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
                        <Typography className="ml-2 pt-1" variant="subtitle1">
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
                      className="flex"
                      title={<span className="text-xl">{item1.title}</span>}
                    />
                    {/* Description */}
                    <div className="flex items-center mt-3">
                      <div
                        className="max-w-4/5"
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item1.descriptive}
                      </div>
                      {" ... "}
                      <Link className="w-1/5" to={`/article/${item1.id}`}>
                        Xem thêm
                      </Link>
                    </div>
                    <Space size={[0, 8]} wrap></Space>

                    <div className="flex mt-3 -ml-3">
                      <span className="flex items-center ml-4 text-">
                        <HeartOutlined className="text-base" />
                        <span className="text-base ml-1 -mt-1">
                          {item1.tym}
                        </span>
                      </span>
                      {/* <span className="flex items-center ml-4 text-base">
                        <CommentOutlined className="text-base ml-1" />
                        <span className="text-base ml-1">{item1.numberComment}</span>
                      </span> */}
                      <span className="flex items-center ml-4 text-base">
                        <ShareAltOutlined className="text-base ml-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default CardArticlesGuest;
