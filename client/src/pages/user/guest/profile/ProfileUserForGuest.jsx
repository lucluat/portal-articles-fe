import { Avatar, Card, Col, Image, Row, Tabs } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { UserAPI } from "../../../../apis/user/my-user.api";
import { AlbumAPI } from "../../../../apis/user/guest/album/album.api";
import CardGuestList from "../articel/CardList";
import {
  GetArticles,
  SetArticles,
} from "../../../../app/reducers/articles/articles.reducer";
import React from "react";
import CardAlbumProfile from "./CardAlbumProfile";

const ProfileUserForGuest = memo(() => {
  const [user, setUser] = useState({});
  const userParam = useParams();
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState("1");
  const [album, setAlbum] = useState({});
  const dispatch = useAppDispatch();

  const onChange = (key) => {
    setActiveTab(key);
  };

  useEffect(() => {
    UserAPI.findById(userParam.id)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Error calling API for Tab 1:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "1") {
      const data = {
        userId: userParam.id,
        page: 0,
      };
      ArticleAPI.fetchAllArticleByAuthor(data)
        .then((response) => {
          dispatch(SetArticles(response.data.data.data));
        })
        .catch((error) => {
          console.error("Error calling API for Tab 1:", error);
        });
    } else if (activeTab === "2") {
      const data = {
        userId: userParam.id,
      };
      AlbumAPI.fetchAlbumByIdUser(data)
        .then((response) => {
          setAlbum(response.data.data.data);
        })
        .catch((error) => {
          console.error("Error calling API for Tab 2:", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userParam.id]);
  const dataArticle = useAppSelector(GetArticles);

  return (
    <div style={{ padding: "10px 100px 0 100px" }}>
      <Card
        style={{
          height: 250,
          backgroundImage: `url(${user.background})`,
          backgroundSize: "cover", // Đảm bảo hình ảnh nằm vừa với kích thước của thẻ Card
          backgroundPosition: "center",
        }}
      />
      <Row>
        <Col span={4} xs={24} sm={24} md={4} className="-mt-8">
          <Avatar size={180} icon={<Image width={180} src={user.img} />} />
        </Col>
        <Col span={20} xs={24} sm={24} md={20} className="pt-5 pl-3">
          <p className="text-3xl font-bold mt-1">{user.name}</p>
          <span className="text-xl font-black">{user.story}</span>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <div style={{ minHeight: 300 }}>
            <Tabs defaultActiveKey="1" onChange={onChange}>
              <TabPane tab="Bài viết" key="1">
                {<CardGuestList data={dataArticle} />}
              </TabPane>
              <TabPane tab="Album" key="2">
                {<CardAlbumProfile data={album} />}
              </TabPane>
            </Tabs>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default ProfileUserForGuest;
