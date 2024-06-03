import React from "react";
import anh1 from "../../../assets/images/face-1.jpg";
import {
  Avatar,
  Button,
  Col,
  Row,
  Space,
  Modal,
  Typography,
  Tooltip,
  Table,
  Card,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import { useParams, Link } from "react-router-dom";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import {
  FaCheckCircle,
  FaCheckSquare,
  FaCopy,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import { CensorHistoryAPI } from "../../../apis/censor/history/history-user.api";

const DetaiConsorApprovedArticle = () => {
  const [detailArticle, setDetailArticle] = useState([]);
  const { id } = useParams();
  const [dataTimeline, setDataTimeline] = useState([]);
  const [isModalOpenHistory, setModalOpenHistory] = useState(false);

  useEffect(() => {
    const fetchDetailArticles = async () => {
      const response = await CensorAPI.detailApprovedArticle(id);
      setDetailArticle(response.data.data);
    };
    fetchDetailArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchTimelineArticleHistory = async () => {
      const data = {
        articleId: id,
      };
      await CensorHistoryAPI.findTimelineArticleHistory(data).then(
        (response) => {
          setDataTimeline(response.data.data);
        }
      );
    };
    fetchTimelineArticleHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showIcon = (status) => {
    if (status === "2") {
      return BiLoader;
    } else if (status === "3") {
      return FaRegCalendarCheck;
    } else if (status === "4") {
      return BsFileEarmarkExcelFill;
    } else if (status === "6") {
      return FaCheckCircle;
    } else if (status === "7") {
      return GiReturnArrow;
    } else if (status === "8") {
      return FaCheckSquare;
    } else if (status === "9") {
      return FaCopy;
    } else {
      return BsFileEarmarkExcelFill;
    }
  };

  const openModalHistory = () => {
    setModalOpenHistory(true);
  };

  const closeModalHistory = () => {
    setModalOpenHistory(false);
  };

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let icon;
        let title;
        switch (status) {
          case "2":
            icon = <BiLoader />;
            title = "Chờ phê duyệt";
            break;
          case "3":
            icon = <FaRegCalendarCheck />;
            title = "Đã phê duyệt";
            break;
          case "4":
            icon = <BsFileEarmarkExcelFill />;
            title = "Đã bị từ chối";
            break;
          case "5":
            icon = <BsFileEarmarkExcelFill />;
            title = "Đã xóa";
            break;
          case "7":
            icon = <GiReturnArrow />;
            title = "Đã gửi lại chờ phê duyệt";
            break;
          case "6":
            icon = <FaCheckCircle />;
            title = "Đã gửi đào tạo";
            break;
          case "8":
            icon = <FaCheckSquare />;
            title = "Đã đăng";
            break;
          // case "9":
          //   icon = <BsFileEarmarkExcelFill />;
          //   title = "";
          //   break;
          default:
            icon = <FaCopy />;
            title = "Bị trùng";
            break;
        }
        return (
          <span>
            {icon} {title}
          </span>
        );
      },
      style: { background: "#FFFFFF" },
    },
    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "createAt",
      style: { background: "#FFFFFF" },
      render: (createAt) =>
        createAt ? moment(createAt).format("HH:mm:ss DD-MM-YYYY") : "Không có", // Định dạng thời gian và hiển thị "Không có" nếu không có dữ liệu
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      style: { background: "#FFFFFF" },
      render: (note) => (note ? note : "Không có"), // Hiển thị "Không có" nếu không có dữ liệu
    },
  ];

  return (
    <>
      <Card className="justify-items-center bg-white -mt-2 mb-4 rounded-md">
        <div>
          <Row>
            <Col span={23}></Col>
            <Col span={1}>
              <div
                style={{
                  float: "right",
                }}
              >
                <Link
                  type="link"
                  to={`/censor/approved-history`}
                  style={{ right: 0, color: "gray" }}
                >
                  <Tooltip title={"Quay lại"}>
                    <CloseCircleOutlined style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Link>
              </div>
            </Col>
          </Row>
          {dataTimeline ? (
            <div className="scroll-container">
              <Timeline
                minEvents={dataTimeline.length + 3}
                placeholder
                className="time-line"
              >
                {dataTimeline.map((item, index) => (
                  <TimelineEvent
                    color={
                      item.status !== "4" && item.status !== "9"
                        ? "#0099FF"
                        : "#FF0000"
                    }
                    icon={showIcon(item.status)}
                    title={
                      item.status === "1"
                        ? "Lưu thành bản nháp"
                        : item.status === "2"
                        ? "Chờ phê duyệt"
                        : item.status === "3"
                        ? "Đã phê duyệt"
                        : item.status === "4"
                        ? "Đã bị từ chối"
                        : item.status === "5"
                        ? "Đã xóa"
                        : item.status === "7"
                        ? "Đã gửi lại chờ phê duyệt"
                        : item.status === "6"
                        ? "Đã gửi đào tạo"
                        : item.status === "8"
                        ? "Đã đăng"
                        : "Bị trùng"
                    }
                    subtitle={moment(item.createAt).format(
                      " HH:mm:ss DD-MM-YYYY "
                    )}
                  />
                ))}
              </Timeline>
            </div>
          ) : (
            <p>Không có dữ liệu để hiển thị.</p>
          )}
        </div>
        <div className="text-center">
          {/* <div style={{ }}> */}
          <Button
            className="add-button"
            style={{ marginTop: -40, float: "right" }}
            onClick={openModalHistory}
          >
            Lịch sử
          </Button>
          {/* </div> */}
          <Modal
            visible={isModalOpenHistory}
            onCancel={closeModalHistory}
            width={800}
            style={{ background: "none" }} // Đặt màu nền của modal thành trong suốt
            footer={null}
          >
            <h2>Lịch sử</h2>
            <Table
              columns={columns}
              dataSource={dataTimeline}
              pagination={false} // Tắt phân trang nếu không muốn nút "Đóng" trong footer
              style={{ background: "none" }} // Đặt màu nền của bảng thành trong suốt
            />
          </Modal>
        </div>
      </Card>
      <div className="justify-items-center bg-white -mt-2 rounded-md">
        {/* open model */}
        <Card>
          <div
            style={{
              marginTop: "-50px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {/* detail bài viết */}
            <Row>
              <Col span={24}>
                <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8 work-break">
                  {detailArticle.title}
                </h1>
                <div className="flex">
                  <Avatar
                    src={anh1}
                    style={{ width: "50px", height: "50px" }}
                  />

                  <div className="ml-3">
                    <div className="flex">
                      <Typography variant="subtitle1" className="name1">
                        {detailArticle.name}
                      </Typography>
                    </div>
                    <span>
                      {moment(detailArticle.createdDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
                <div>
                  <JoditEditor
                    value={detailArticle.content}
                    tabIndex={-1}
                    className="bg-transparent"
                    config={{
                      readonly: true,
                      toolbar: false,
                      showCharsCounter: false,
                      showWordsCounter: false,
                      showStatusbar: true,
                      showPoweredBy: false,
                    }}
                  />
                </div>
                <Row>
                  <div className=" float-left pt-5 pb-10">
                    <Space size={[0, 8]} wrap>
                    </Space>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </>
  );
};

export default DetaiConsorApprovedArticle;
