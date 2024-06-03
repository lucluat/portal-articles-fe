import {
    AuditOutlined,
    FileTextOutlined,
    UsergroupAddOutlined,
  } from "@ant-design/icons";
  import { Button, Col, Menu, Row } from "antd";
  import React, { memo, useState } from "react";
  // import ArticleFullTS from "./ArticleFullTS";
  import { useNavigate, useLocation, Link } from "react-router-dom";
  import { useEffect } from "react";
  import ArticleFullTS from "./ArticleFullTS";
  import { FullSearchTextAPI } from "../../../apis/user/auth/full-search-text/full-search-text.api.js";
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  
  const FullTextSearchArticle = memo(() => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const [articles, SetArticles] = useState([]);
      const [current, setCurrent] = useState(0);
      const [totalPage, setTotalPage] = useState(0);
    
    useEffect(() => {
        fetchFullSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const fetchFullSearch = () => {
        console.log(search);
        FullSearchTextAPI.getArticleSearch({ page: 0, search: search }).then((response) => {
          let articles = []
          if (response.data.data !== null) {
            if (response.data.data.data !== null || response.data.data.data.length !== 0) {
              response.data.data.data.forEach((element) => {
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
              });
                setTotalPage(response.data.data.currentPage)
                setCurrent(response.data.data.currentPage + 1);
            }
          }
            SetArticles(articles);
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

    const onChange = () => {
      if (current < totalPage) {
        FullSearchTextAPI.getArticleSearch({ page: current, search: search }).then((response) => {
          response.data.data.data.forEach((element) => {
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
          });
            setCurrent(current + 1);
            SetArticles(articles);
        });
      }
    }
  
    return (
      <div>
        <Row>
          <h3>Kết quả tìm kiếm: { search ? search : "Không tìm thấy kết quả" }</h3>
        </Row>
        <Row className="justify-between">
          <Col xs={17} className="">
            {articles.length !== 0 && <ArticleFullTS articles={articles} />}
            {
              current < totalPage && <Button
              type="primary"
                block
                onClick={onChange}
              className=" mt-3"
              style={{ fontSize: "15px", backgroundColor: "#2e2e2e" }}>
              Xem thêm bài viết
            </Button>
            }
            { current >= totalPage && <div>Đó là tất cả, không có gì hơn 🤐 </div>}
            
          </Col>
  
          <Col xs={6} style={{background: "#fff"}}>
            <Menu
              style={{
                fontSize: "18px"
              }}
              defaultSelectedKeys={["2"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              items={items}
            />
          </Col>
        </Row>
      </div>
    );
  });
  
  export default FullTextSearchArticle;
  