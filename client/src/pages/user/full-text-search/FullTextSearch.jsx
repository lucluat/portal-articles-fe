import {
  AuditOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Col, Menu, Row } from "antd";
import React, { memo, useState } from "react";
// import ArticleFullTS from "./ArticleFullTS";
import AllFullTS from "./AllFullTS";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FullSearchTextAPI } from "../../../apis/user/auth/full-search-text/full-search-text.api.js";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const FullTextSearch = memo(() => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const dispatch = useAppDispatch();

  const articles = useAppSelector(GetArticles);
  const user = useAppSelector(GetUser);

  useEffect(() => {
    fetchFullSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchFullSearch = () => {
    FullSearchTextAPI.getSearchAll({ page: 0, search: search }).then((response) => {
      let user = []
      let articles = []
      response.data.data.forEach((element) => {
        if (element.classify === 1) {
          articles.push({
            id: element.id,
            name: element.name,
            title: element.name,
            img: element.avatar,
            nameCategory: element.nameCategory,
            descriptive: element.content,
            favorite: element.favorite,
            tym: element.countTym,
          });
        } else if (element.classify === 2) {
          user.push(element);
        }
      });
      dispatch(SetUser(user));
      dispatch(SetArticles(articles));
    });
  };


  const items = [
    getItem("Tất cả", "1", <Link to={`/user/all/search?search=${search}`}><AuditOutlined style={{ fontSize: "25px", marginRight: "8px", marginTop: 7  }} /></Link>),
    {
      type: "divider",
    },
    getItem("Bài viết", "2", <Link to={`/user/posts/search?search=${search}`}><FileTextOutlined style={{ fontSize: "25px", marginRight: "8px", marginTop: 7  }} /></Link>),
    {
      type: "divider",
    },
    getItem(
      "Mọi người",
      "3",
      <Link to={`/user/peopel/search?search=${search}`}><UsergroupAddOutlined style={{ fontSize: "25px", marginRight: "8px", marginTop: 7  }} /></Link>
    ),
  ];

  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.get("search")])

  return (
    <div>
      <Row>
        <h3>Kết quả tìm kiếm: { search ? search : "Không tìm thấy kết quả" }</h3>
      </Row>
      <Row className="justify-between">
        <Col xs={17} className="">
          <AllFullTS articles={articles} user={user} search={search} />
        </Col>

        <Col xs={6} style={{background: "#fff"}}>
          <Menu
            style={{
              fontSize: "18px"
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Col>
      </Row>
    </div>
  );
});

export default FullTextSearch;
