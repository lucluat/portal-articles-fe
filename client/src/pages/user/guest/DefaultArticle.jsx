import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, Col, Row, Space, Tooltip, Typography } from "antd";
import Card from "antd/es/card/Card";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  CloseCircleOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
const DefaultArticle = () => {
  const { postId } = useParams();

  console.log("====================================");
  console.log("aaaaaaaaaaaaaaaaaaa");
  console.log("====================================");
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
            <div className="flex "></div>
          </Col>
          <Col span={1}>
            <div
              style={{
                float: "right",
              }}
            >
              <Link
                type="link"
                to={`/home`}
                style={{ right: 0, color: "gray" }}
              >
                <Tooltip title={"Quay lại"}>
                  <CloseCircleOutlined style={{ fontSize: "20px" }} />
                </Tooltip>
              </Link>
            </div>
          </Col>
        </Row>
        <div>
          {/* Tiêu đề bài viết */}
          <h3
            className="text-2xl text-slate-900 font-bold not-italic"
            style={{ overflowWrap: "break-word" }}
          >
            HƯỚNG DẪN SỬ DỤNG MODULE DÀNH CHO GIẢNG VIÊN TẠO BÀI VIẾT
          </h3>
        </div>
        <div className="flex justify-between ">
          {/* <div className="flex">
            <Avatar
              src={cardsData.img}
              style={{ width: "60px", height: "60px" }}
            />
            <div className="ml-3">
              <div className="flex">
                <Typography variant="subtitle1" className="name1">
                  {cardsData.name}
                </Typography>
              </div>
              <span>{moment(cardsData.browseDate).format("DD/MM/YYYY")}</span>
            </div>
          </div> */}
        </div>
        <div style={{ marginTop: "20px" }}></div>
      </Card>
    </div>
  );
};

export default DefaultArticle;
