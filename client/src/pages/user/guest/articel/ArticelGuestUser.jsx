import {
  Col,
  Row,
  Pagination,
  Input,
  Button,
  Drawer,
  Space,
  DatePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import CardGuestList from "./CardList";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  GetArticles,
  SetArticles,
} from "../../../../app/reducers/articles/articles.reducer";
import locale from "antd/es/date-picker/locale/vi_VN";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { ArticleGuestAPI } from "../../../../apis/user/guest/article/article.api";

const ArticelGuestUser = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const titleParam = queryParams.get("title") || "";
  const nameParam = queryParams.get("name") || "";
  const categoryParam = queryParams.get("nameCategory") || "";
  const nameRegistrationParam = queryParams.get("nameRegistration") || "";
  const hashtagParam = queryParams.get("hashtag") || "";
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  // const [size, setSize] = useState(10);
  const [title, setTitle] = useState(titleParam);
  const [nameCategory, setNameCategory] = useState(categoryParam);
  const [hashtag, setHashtag] = useState(hashtagParam);
  const [nameRegistration, setNameRegistration] = useState(
    nameRegistrationParam
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [status, setStatus] = useState([]);
  const [name, setName] = useState(nameParam);
  const navigate = useNavigate();

  const fetchAllData = () => {
    const data = {
      title: title,
      name: name,
      category: nameCategory,
      nameRegistration: nameRegistration,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      hashtag: hashtag,
      // size: size,
      page: current - 1,
    };
    ArticleGuestAPI.fetchAllArticleGuest(data).then((response) => {
      if (response.data.data.totalPages === 0) {
        message.info("Không tìm thấy kết quả tìm kiếm!!");
      } else {
        dispatch(SetArticles(response.data.data.data));
        setTotalPages(response.data.data.totalPages);
        setCurrent(response.data.data.currentPage + 1);
      }
    });
    // Thêm query parameter mới vào danh sách
    queryParams.set("title", title);
    queryParams.set("name", name);
    queryParams.set("category", nameCategory);
    queryParams.set("nameRegistration", nameRegistration);
    queryParams.set("startDate", new Date(startDate).getTime());
    queryParams.set("endDate", new Date(endDate).getTime());
    queryParams.set("hashtag", hashtag);
    // queryParams.set("size", size);
    queryParams.set("page", current - 1);
    // queryParams.set("status", status);

    // Sau đó, sử dụng queryParams để cập nhật URL và điều hướng
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  // const fetchData = () => {
  //   ArticleAPI.fetchAllArticle().then((response) => {
  //     const responseData = response.data.data;
  //     dispatch(SetArticles(responseData.data));
  //     setData(responseData.data);
  //     setSearchResult(responseData.data);
  //     setTotalPages(responseData.totalPages);
  //     setCurrent(responseData.currentPage + 1);
  //   });
  // };

  useEffect(() => {
    navigate(`${location.pathname}?${queryParams.toString()}`);
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const articles = useAppSelector(GetArticles);

  const handlePageChange = (page) => {
    setCurrent(page);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSearchButtonClick = () => {
    queryParams.set("title", title);
    queryParams.set("name", name);
    queryParams.set("category", nameCategory);
    queryParams.set("nameRegistration", nameRegistration);
    queryParams.set("startDate", new Date(startDate).getTime());
    queryParams.set("endDate", new Date(endDate).getTime());
    queryParams.set("hashtag", hashtag);
    // queryParams.set("size", size);
    queryParams.set("page", current - 1);
    // queryParams.set("status", status);
    setCurrent(1);
    fetchAllData();
    onClose();
    navigate(`?${queryParams.toString()}`);
  };

  return (
    <div>
      <div
        className="m-auto scroll-smooth"
        style={{ paddingTop: "120px", background: "#fff" }}
      >
        <div style={{ maxWidth: "1336px" }} className="m-auto">
          <Row style={{ justifyContent: "right" }}>
            <Button
              type="link"
              size="large"
              style={{ float: "right", margin: "0 50px 20px 0" }}
              onClick={() => showDrawer()}
            >
              <MenuOutlined /> Bộ lọc
            </Button>
          </Row>
          <Row className="px-20">
            <Col lg={24} md={24} className="mx-4">
              <CardGuestList data={articles} />
              <Pagination
                className=" text-center"
                current={current}
                total={totalPages * pageSize}
                pageSize={pageSize}
                onChange={handlePageChange}
                style={{ marginBottom: "50px" }}
              />
            </Col>
            <Drawer
              title="Tìm kiếm thông tin bài viết"
              width={720}
              onClose={onClose}
              visible={open}
              bodyStyle={{
                paddingBottom: 80,
              }}
              footer={
                <Space>
                  <Button onClick={onClose}>Hủy</Button>
                  <Button type="primary" onClick={handleSearchButtonClick}>
                    Tìm kiếm
                  </Button>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <label>Tiêu đề</label>
                  <Input
                    placeholder="Nhập tiêu đề"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <label>Thể loại</label>
                  <Input
                    placeholder="Nhập thể loại"
                    value={nameCategory}
                    onChange={(e) => setNameCategory(e.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <label>Hashtag</label>
                  <Input
                    placeholder="Nhập hashtag"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <label>Đợt</label>
                  <Input
                    placeholder="Nhập đợt"
                    value={nameRegistration}
                    onChange={(e) => setNameRegistration(e.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <label>Tên giảng viên</label>
                  <Input
                    placeholder="Nhập tên giảng viên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <label>Ngày tạo</label>
                  <div className="flex justify-between">
                    <DatePicker
                      value={startDate}
                      onChange={(el) => setStartDate(el)}
                      locale={locale}
                      className="datePicker"
                      placeholder="Ngày bắt đầu"
                      format="DD/MM/YYYY"
                    />
                    <DatePicker
                      value={endDate}
                      onChange={(el) => setEndDate(el)}
                      locale={locale}
                      className="datePicker"
                      placeholder="Ngày kết thúc"
                      format="DD/MM/YYYY"
                    />
                  </div>
                </Col>
              </Row>
            </Drawer>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ArticelGuestUser;
