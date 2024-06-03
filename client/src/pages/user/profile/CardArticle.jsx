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
} from "antd";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import { LineOutlined, StarFilled } from "@ant-design/icons";
import moment from "moment";

const CardArticle = (props) => {
  const [cardsData, setCardsData] = useState([]);
  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  return (
    <div className="pb-10">
      <div>
        {cardsData.map((card) => (
          <div
            // key={card.id}
            className="bg-white rounded-lg shadow-md relative mb-6"
          >
            <Card>
              <Row>
                <Col span={16}>
                  <div className="flex pb-2">
                    <div className="flex">
                      <Tooltip
                        key={card.id}
                        color="#fff"
                        placement="right"
                        className="img-cusor"
                      >
                        <Avatar src={card.img} />
                      </Tooltip>

                      <Typography
                        avatar={card.img}
                        variant="subtitle1"
                        className="ml-3 pt-1 font-bold"
                      >
                        {card.name}
                      </Typography>
                    </div>
                    <div className="flex pt-1">
                      <span>
                        <LineOutlined style={{ transform: "rotate(90deg)" }} />
                      </span>
                      <span>
                        {moment(card.browseDate).format("DD/MM/YYYY")}
                      </span>
                      <span className="text-yellow-400">
                        <StarFilled style={{ marginLeft: "10px" }} />
                      </span>
                      <span style={{ marginLeft: "10px" }}>
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
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* HashTag */}
                            <Space
                              size={[0, 8]}
                              wrap
                              className="float-left mt-3"
                            ></Space>

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
                                to={`/user/profile/${card.userId}/article/${card.id}`}
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
                <Col span={8} className="flex justify-end items-center">
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
              </Row>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardArticle;
