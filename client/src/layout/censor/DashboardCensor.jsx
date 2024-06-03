import logo from "../../assets/images/logo/logo-udpm-3.png";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Drawer, Row, Menu, Col, Badge } from "antd";
import Header from "../../components/censor/Header";
import {
  LineChartOutlined,
  WalletOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  VerticalAlignBottomOutlined,
  CarryOutOutlined,
  TeamOutlined,
  FormOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { CensorAPI } from "../../apis/censor/article/article.api";
import {
  GetCountArticle,
  SetCountArticle,
} from "../../app/reducers/articles/count-article.reducer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { connectNotifyUserSendArticleToAdmin } from "../../apis/stomp-client/config";
import { NotificationAPI } from "../../apis/censor/notification/notification.api";
import { SetCountNotification } from "../../app/reducers/notification/count-notification-censor.reducer";
import React from "react";
const { Header: AntHeader, Content } = Layout;

function DashboardAuthUser({ children }) {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [visible, setVisible] = useState(false);
  const openDrawer = () => setVisible(!visible);
  const [count, setCount] = useState(250);
  const dispatch = useAppDispatch();
  const onSlidebar = () => {
    if (count === 70) setCount(250);
    else setCount(70);
  };

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location]);

  const countApprovedArticle = () => {
    return CensorAPI.countApprovedArticle({}).then((response) => {
      dispatch(SetCountArticle(response.data.data));
    });
  };

  const fetchCountNotification = () => {
    return NotificationAPI.fetchCountNotification().then((response) => {
      dispatch(SetCountNotification(response.data.data));
    });
  };

  useEffect(() => {
    countApprovedArticle();
    fetchCountNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useAppSelector(GetCountArticle);

  useEffect(() => {
    const stompClient = connectNotifyUserSendArticleToAdmin();
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/portal-articles/create-number-article-censor",
        function () {
          countApprovedArticle();
          fetchCountNotification();
        }
      );
    });
    return () => {
      if (stompClient != null) {
        stompClient.disconnect();
      }
    };
  }, []);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  let title = "";

  if (pathname.includes("censor/category")) {
    title = "Quản lý thể loại";
  }
  if (pathname.includes("censor/chart")) {
    title = "Thống kê";
  }
  if (pathname.includes("censor/article")) {
    title = "Quản lý bài viết";
  }
  if (pathname.includes("censor/registration-period")) {
    title = "Quản lý đợt đăng ký";
  }
  if (pathname.includes("censor/cloud-article")) {
    title = "Kho lưu trữ";
  }
  if (pathname.includes("censor/approved-history")) {
    title = "Lịch sử phê duyệt";
  }
  if (pathname.includes("censor/form-send")) {
    title = "Quản lý form gửi đào tạo";
  }
  if (pathname.includes("censor/teacher")) {
    title = "Danh sách giảng viên";
  }
  const [collapsed, setCollapsed] = useState(false);
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem(
      <Link to="/censor/category">
        <ProjectOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Quản lý thể loại
        </span>
      </Link>,
      "/censor/category"
    ),

    getItem(
      <Link to="/censor/chart">
        <LineChartOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Thống kê</span>
      </Link>,
      "/censor/chart"
    ),
    getItem(
      <Link to="/censor/article">
        <SolutionOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Phê duyệt bài viết
        </span>
        <span>
          {/* {item.label}{" "} */}
          <Badge
            overflowCount={100}
            count={data}
            className="custom-badge"
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              marginLeft: -15,
            }}
          />
        </span>
      </Link>,
      "/censor/article"
    ),
    getItem(
      <Link to="/censor/teacher">
        <TeamOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Danh sách giảng viên
        </span>
      </Link>,
      "/censor/teacher"
    ),
    getItem(
      <Link to="/censor/registration-period">
        <CarryOutOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Quản lý đợt đăng ký
        </span>
      </Link>,
      "/censor/registration-period"
    ),
    getItem(
      <Link to="/censor/form-send">
        <FormOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Quản lý form gửi đào tạo
        </span>
      </Link>,
      "/censor/form-send"
    ),
    getItem(
      <Link to="/censor/cloud-article">
        <VerticalAlignBottomOutlined
          style={{ marginRight: "8px", marginTop: 7 }}
        />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Kho lưu trữ</span>
      </Link>,
      "/censor/cloud-article"
    ),
    getItem(
      <Link to="/censor/approved-history">
        <WalletOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Lịch sử phê duyệt
        </span>
      </Link>,
      "/censor/approved-history"
    ),
  ];
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      id="authe"
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}>
      <Drawer
        id="drawer_ui"
        title={false}
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={"left"}
        width={250}
        style={{ background: "#fff", overflowX: "hidden" }}
        className={`drawer-sidebar ${
          pathname === "rtl" ? "drawer-sidebar-rtl" : ""
        } `}>
        <Layout
          id="layout_drawer"
          style={{ background: "#fff", overflowX: "hidden" }}
          className={` bg-white layout-dashboard ${
            pathname === "rtl" ? "layout-dashboard-rtl" : ""
          }`}>
          <Row className="flex justify-center align-middle mt-5 pb-8">
            <div className="brand text-center">
              <Link
                to="/"
                className="active">
                <img
                  src={logo}
                  style={{
                    height: "80px",
                  }}
                  alt="Logo"
                />
              </Link>
            </div>
          </Row>
          <Menu
            mode="inline"
            items={items}
            onClick={openDrawer}
          />
        </Layout>
      </Drawer>
      <div className="bg-white">
        <Sider
          id="sildebar_ui"
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          className={`sider-primary ant-layout-sider-primary`}
          style={{
            background: "#fff",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 999,
            height: "100%",
          }}>
          <Row
            className="flex justify-center align-middle  mt-5 pb-8"
            style={{ height: "80px" }}
          />

          <Menu
            mode="inline"
            items={items}
            selectedKeys={selectedKey}
          />
        </Sider>
      </div>
      <Layout className="pb-14">
        <AntHeader style={{ zIndex: 1000, position: "fixed", width: "100%" }}>
          <Row className="items-center">
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <div className="brand text-center">
                    <Link
                      to="/"
                      className="active">
                      <img
                        src={logo}
                        style={{
                          height: "60px",
                        }}
                        alt="Logo"
                      />
                    </Link>
                  </div>
                </Col>
                <Col
                  span={12}
                  className="flex items-center">
                  <button
                    className="buttonSlider desktop"
                    onClick={toggleCollapse}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </button>
                  <button
                    className="buttonSlider mobile"
                    onClick={openDrawer}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </button>
                  <h1
                    style={{
                      marginLeft: "20px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}>
                    {title}
                  </h1>
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <Row>
                <Col span={15}></Col>
                <Col span={9}>
                  <Header
                    onPress={openDrawer}
                    onSlidebar={onSlidebar}
                    name={pathname}
                    subName={pathname}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </AntHeader>
        {collapsed ? (
          <Content
            className="content-ant"
            style={{ paddingLeft: "80px", marginTop: "125px" }}>
            {children}
          </Content>
        ) : (
          <Content
            className="content-ant"
            style={{ paddingLeft: "250px", marginTop: "125px" }}>
            {children}
          </Content>
        )}
      </Layout>
    </Layout>
  );
}
export default DashboardAuthUser;
