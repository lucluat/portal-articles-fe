/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import logo from "../../../assets/images/logo/logo-udpm-3.png";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Drawer, Row, Menu, Col } from "antd";
import Header from "../../../components/user/auth/Header";
import {
  EditOutlined,
  FileTextOutlined,
  HeartOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import React from "react";
const { Header: AntHeader, Content } = Layout;

function DashboardAuthUser({ children }) {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [visible, setVisible] = useState(false);
  const openDrawer = () => setVisible(!visible);
  const [count, setCount] = useState(250);
  const onSlidebar = () => {
    if (count === 70) setCount(250);
    else setCount(70);
  };
  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location])

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  let title = "";

  if (pathname.includes("user/create-article")) {
    title = "Tạo bài viết";
  }
  if (pathname.includes("user/article")) {
    title = "Bài viết";
  }
  if (pathname.includes("user/my-article")) {
    title = "Bài viết của tôi";
  }
  if (pathname.includes("user/search")) {
    title = "Tìm kiếm";
  }
  if (pathname.includes("user/my-favourite-article")) {
    title = "Bài viết yêu thích";
  }
  if (pathname.includes("user/profile")) {
    title = "Hồ sơ";
  }

  if (pathname.includes("user/history")) {
    title = "Lịch sử";
  }
  if (pathname.includes("user/album")) {
     title = "Album";
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
      <Link to="/user/create-article">
        <EditOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Tạo bài viết</span>
      </Link>,
      "/user/create-article"
    ),
    getItem(
      <Link to="/user/article">
        <FileTextOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Danh sách bài viết
        </span>
      </Link>,
      "/user/article"
    ),
    getItem(
      <Link to="/user/my-article">
        <SolutionOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Bài viết của tôi
        </span>
      </Link>,
      "/user/my-article"
    ),
    getItem(
      <Link to="/user/my-favourite-article">
        <HeartOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Bài viết yêu thích
        </span>
      </Link>,
      "/user/my-favourite-article"
    ),
    getItem(
      <Link to="/user/album">
        <WalletOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Album</span>
      </Link>,
      "/user/album"
    ),
    getItem(
      <Link to="/user/history">
        <HistoryOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Lịch sử</span>
      </Link>,
      "/user/history"
    ),
  ];
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      id="authe"
      className={`layout-dashboard ${pathname === "profile" ? "layout-profile" : ""
        } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
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
        className={`drawer-sidebar ${pathname === "rtl" ? "drawer-sidebar-rtl" : ""
          } `}
      >
        <Layout
          id="layout_drawer"
          style={{ background: "#fff", overflowX: "hidden" }}
          className={` bg-white layout-dashboard ${pathname === "rtl" ? "layout-dashboard-rtl" : ""
            }`}
        >
          <Row className="flex justify-center align-middle mt-5 pb-8">
            <div className="brand text-center">
              <Link to="/" className="active">
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
          <Menu mode="inline" items={items} onClick={openDrawer} />
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
          }}
        >
          <Row
            className="flex justify-center align-middle  mt-5 pb-8"
            style={{ height: "80px" }}
          />

          <Menu mode="inline" items={items} selectedKeys={selectedKey} />
        </Sider>
      </div>
      <Layout className="pb-14">
        <AntHeader style={{ zIndex: 1000, position: "fixed", width: "100%" }}>
          <Row className="items-center">
            <Col span={8}>
              <Row>
                {/* {!collapsed ? ( */}
                <Col span={12}>
                  <div className="brand text-center">
                    <Link to="/" className="active">
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
                {/* ) : (
                  <Col span={4}></Col>
                )} */}
                <Col span={12} className="flex items-center">
                  <button
                    className="buttonSlider desktop"
                    onClick={toggleCollapse}
                  >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </button>
                  <button className="buttonSlider mobile" onClick={openDrawer}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </button>
                  <h1
                    style={{
                      marginLeft: "20px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
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
            style={{ paddingLeft: "80px", marginTop: "120px" }}
          >
            {children}
          </Content>
        ) : (
          <Content
            className="content-ant"
            style={{ paddingLeft: "250px", marginTop: "120px" }}
          >
            {children}
          </Content>
        )}
      </Layout>
    </Layout>
  );
}
export default DashboardAuthUser;
