import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  Image,
} from "antd";
import Meta from "antd/es/card/Meta";
import { LineOutlined, StarFilled } from "@ant-design/icons";
import moment from "moment";
import { Link } from "react-router-dom";

const CardGuestList = (props) => {
  useEffect(() => {
    if (props.data != null && props.data.length > 0) setCardsData(props.data);
  }, [props.data]);

  const [cardsData, setCardsData] = useState([]);

  return (
    <div>
      <div className="pb-10">
        <div>
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-md relative mb-6"
            >
              <Card>
                <Row className="flex justify-between">
                  <Col span={18}>
                    <div className="flex pb-2">
                      <div className="flex">
                        <Tooltip key={card.id} color="#fff" placement="right">
                          <Avatar src={card.img} />
                        </Tooltip>
                        <Typography
                          avatar={card.img}
                          variant="subtitle1"
                          className="ml-3 pt-1 font-bold"
                        >
                          <Link
                            style={{ color: "black" }}
                            to={`/profile/${card.userId}`}
                          >
                            {card.name}
                          </Link>
                        </Typography>
                      </div>
                      <div className="flex pt-1">
                        <span>
                          <LineOutlined
                            style={{ transform: "rotate(90deg)" }}
                          />
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
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* HashTag */}
                              <Space
                                size={[0, 8]}
                                wrap
                                className="float-left mt-3"
                              >
                                {card.hashtags != null &&
                                  [...new Set(card.hashtags.split(", "))].map(
                                    (el) => (
                                      <Tag
                                        bordered={false}
                                        className="rounded-lg"
                                      >
                                        <Link to={`/article`}>
                                          {el}
                                        </Link>
                                      </Tag>
                                    )
                                  )}
                              </Space>

                              {/* Description */}
                              <div className="flex items-center">
                                <p
                                  className="max-w-4/5"
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {card.descriptive}
                                </p>
                                {/* {" ... "} */}
                                <Link
                                  // className="w-1/5"
                                  style={{ width: 180 }}
                                  to={`/article/${card.id}`}
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
                  <Col span={5} className="flex justify-end items-center">
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
      <div></div>
    </div>
  );
};

export default CardGuestList;
