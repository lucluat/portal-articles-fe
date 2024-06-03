import React from "react";
import {
  Avatar,
  Col,
  Row,
  Typography,
  Tooltip,
  message,
  Card,
} from "antd";
import {
  CloseCircleOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import "./index.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { PrAPI } from "../../../apis/pr/article/article.pr.api";
const CardDetailArticles = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCardsData(props.data);
    console.log(props.data);
  }, [props.data]);

  const handleUpdateStar = () => {
    PrAPI.putStar(cardsData.id).then((res) => {
      if (res.status === 200) {
        message.success("Cập nhập thành công");
        navigate(`/pr/article`);
      }
    });
  }
  
  return (
    <Card>
      <div className="justify-items-center bg-white rounded-md">
        <Row>
          <Col span={23}>
              {cardsData.isStar ?
                <Tooltip title={"Gỡ sao"}>
                  <StarFilled className="icon me-2" onClick={handleUpdateStar} />
                </Tooltip>
                :
                <Tooltip title={"Gắn sao"}>
                  <StarOutlined className="icon me-2" onClick={handleUpdateStar} />
                </Tooltip>
              }
              {cardsData.nameCategory ? (
                <Typography className="category1" variant="subtitle1">
                  {cardsData.nameCategory}
                </Typography>
              ) : null}

              {cardsData.namePeriod ? (
                <Typography
                  variant="subtitle1"
                  className="category2"
                  style={{ marginLeft: "10px" }}
                >
                  {cardsData.namePeriod}
                </Typography>
              ) : null}
            <h1
              className="text-5xl text-slate-900 font-bold not-italic mb-8 "
              style={{ overflowWrap: "break-word" }}
            >
              {cardsData.title}
            </h1>
            <div className="flex">
              <Avatar
                src={cardsData.img}
                style={{ width: "48px", height: "48px" }}
              />
              <div className="ml-3">
                <div className="flex">
                  <Typography variant="subtitle1" className="name1">
                    {cardsData.name}
                  </Typography>
                </div>
                <span>
                  {moment(cardsData.createdDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
            {/* </div> */}

            <div style={{ marginTop: "20px", wordBreak: "break-word" }}>
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
                    backgroundColor: "white",
                    border: "none",
                  },
                }}
              />
            </div>
          </Col>
          <Col span={1}>
            <div
              style={{
                float: "right",
              }}
            >
              <Link
                type="link"
                to={`/pr/article`}
                style={{ right: 0, color: "gray" }}
              >
                <Tooltip title={"Quay lại"}>
                  <CloseCircleOutlined style={{ fontSize: "20px" }} />
                </Tooltip>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default CardDetailArticles;
