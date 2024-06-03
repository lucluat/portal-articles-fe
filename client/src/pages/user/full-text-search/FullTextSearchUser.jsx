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
import ResultUser from "./ResultUser";
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

const FullTextSearchUser = memo(() => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [user, SetUser] = useState([]);
  const [current, setCurrent] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchFullSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchFullSearch = () => {
    FullSearchTextAPI.getUserSearch({ page: 0, search: search }).then(
      (response) => {
        SetUser(response.data.data.data);
        setTotalPage(response.data.data.totalPages);
        setCurrent(response.data.data.currentPage + 1);
      }
    );
  };

  const onChange = () => {
    console.log(totalPage);
    console.log(current);
    let filter = {
      page: current,
      search: search,
    };
    if (current < totalPage) {
      console.log(filter);
      FullSearchTextAPI.getUserSearch(filter).then((response) => {
        for (let index = 0; index < response.data.data.data.length; index++) {
          const element = response.data.data.data[index];
          user.push(element);
        }
        SetUser(user);
        setTotalPage(response.data.data.totalPages);
        setCurrent(response.data.data.currentPage + 1);
      });
    }
  };

  const items = [
    getItem(
      "Tất cả",
      "1",
      <Link to={`/user/all/search?search=${search}`}>
        <AuditOutlined
          style={{ fontSize: "25px", marginRight: "8px", marginTop: 7 }}
        />
      </Link>
    ),
    {
      type: "divider",
    },
    getItem(
      "Bài viết",
      "2",
      <Link to={`/user/posts/search?search=${search}`}>
        <FileTextOutlined
          style={{ fontSize: "25px", marginRight: "8px", marginTop: 7 }}
        />
      </Link>
    ),
    {
      type: "divider",
    },
    getItem(
      "Mọi người",
      "3",
      <Link to={`/user/peopel/search?search=${search}`}>
        <UsergroupAddOutlined
          style={{ fontSize: "25px", marginRight: "8px", marginTop: 7 }}
        />
      </Link>
    ),
  ];

  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.get("search")]);

  return (
    <div>
      <Row>
        <h3>Kết quả tìm kiếm: {search ? search : "Không tìm thấy kết quả"}</h3>
      </Row>
      <Row className="justify-between">
        <Col xs={17} className="">
          {user.length !== 0 && <ResultUser data={user} />}
          {current < totalPage && (
            <Button
              type="primary"
              block
              onClick={onChange}
              className=" mt-3"
              style={{ fontSize: "15px", backgroundColor: "#2e2e2e" }}
            >
              Xem tất cả
            </Button>
          )}

          {current >= totalPage && <div>Đó là tất cả, không có gì hơn 🤐 </div>}
        </Col>

        <Col xs={6} style={{ background: "#fff" }}>
          <Menu
            style={{
              fontSize: "18px",
            }}
            defaultSelectedKeys={["3"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Col>
      </Row>
    </div>
  );
});

export default FullTextSearchUser;
