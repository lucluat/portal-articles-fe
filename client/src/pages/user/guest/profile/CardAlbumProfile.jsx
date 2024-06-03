import React, { useState, useEffect } from "react";
import { Card, Col, Row, Empty, Image } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const CardAlbumProfile = (props) => {
  const [cardsData, setCardsData] = useState([]);
  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);
  const navigate = useNavigate();
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleClickAlbum = (id) => {
    navigate(`/profile/${cardsData[0].userId}/album/${id}`);
  };

  return (
    <div>
      {Array.isArray(cardsData) && cardsData.length > 0 ? (
        cardsData.map((a) => (
          <Card className="mb-4" onClick={() => handleClickAlbum(a.id)}>
            <Row>
              <Col span={3} className="col-anh">
                <Image
                  alt="example"
                  src={a.userImg}
                  style={{
                    width: "320px",
                    height: "100px",
                    borderRadius: "5px",
                  }}
                />
              </Col>
              <Col span={20}>
                <div className="pt-3">
                  <span className="title">{a.title}</span>
                  {/* {a.status ? (
                    <span style={{}}>
                      <LockOutlined /> Riêng tư
                    </span>
                  ) : (
                    <span style={{}}>
                      <GlobalOutlined /> Công khai
                    </span>
                  )} */}
                  <Row>
                    <span className="text-lg">
                      Số lượng bài viết : {a.numberOfArticle}
                    </span>
                  </Row>
                  <div className="-ml-1 -mt-3">
                    <CalendarOutlined className="w-6 h-6 pt-5" />
                    <span>{formatDate(a.creatAt)}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <Empty description={"Không có album"} />
      )}
    </div>
  );
};

export default CardAlbumProfile;
