/* eslint-disable jsx-a11y/iframe-has-title */
import {
  Button,
  Pagination,
  Table,
  Card,
  Input,
  Tooltip,
  message,
  Select,
  Space,
  Form,
  Row,
  Col,
  Modal,
  Badge,
  Tag,
  Radio,
} from "antd";
import {
  CheckOutlined,
  ClearOutlined,
  CloudDownloadOutlined,
  CloudServerOutlined,
  CloudUploadOutlined,
  CopyOutlined,
  DownloadOutlined,
  ExclamationOutlined,
  EyeOutlined,
  FileAddOutlined,
  HistoryOutlined,
  SafetyOutlined,
  SearchOutlined,
  SendOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { DownloadArticleAPI } from "../../../apis/censor/download/download.api";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import ViewEditorJodit from "./preview-article";
import React from "react";
import moment from "moment";
import ModalLog from "../log/ModalLog";
import FormSearch from "../../../components/card-search/FormSearch";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CensorSendDataApi } from "../../../apis/censor/send-data/send-data.api";
import { GetFormSend, SetFormSend } from "../../../app/reducers/form-send/form-send.reducer";
import Meta from "antd/es/card/Meta";
import ModalThem from "../form-send/ModalAdd";

export default function DownloadArticle() {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [lstUser, setLstUser] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newSelectedRowKeys, setNewSelectedRowKeys] = useState([]);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cbbCategory, setCbbCategory] = useState([]);
  const [res, setCbbRes] = useState([]);
  const [size, setSize] = useState(10);
  const [countDaPheDuyet, setCountDaPheDuyet] = useState(0);
  const [countDaGui, setCountDaGui] = useState(0);
  const [countDaDang, setCountDaDang] = useState(0);
  const [countBiTrung, setCountBiTrung] = useState(0);
  const [status, setStatus] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);

  const handleRowClick = (record) => {
    const { pathDriver } = record;
    if (pathDriver !== null && pathDriver !== undefined) {
      navigator.clipboard
        .writeText(pathDriver)
        .then(() => {
          message.success("Đường dẫn driver đã được sao chép vào clipboard!!");
        })
        .catch(() => {
          message.error("Lỗi khi sao chép đường dẫn");
        });
    } else {
      message.error("Không có đường dẫn driver hoặc đường dẫn bị lỗi!!");
    }
  };

  const [form] = Form.useForm();

  const clearForm = () => {
    setSelectedRowKeys([]);
    setNewSelectedRowKeys([]);
    form.setFieldsValue({
      categoryId: "",
      codeUser: "",
      contentActivity: "",
      nameUser: "",
      registrationId: "",
      status: 3,
      titleArticle: "",
    });
    setStatus(3);
    fetchData();
  };

  useEffect(() => {
    DownloadArticleAPI.fetchLoadCbb().then((response) => {
      setCbbRes(response.data.data.Registration);
      setCbbCategory(response.data.data.cbbCategory);
    });
    countMenu();
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size, status]);
  const fetchData = () => {
    const values = form.getFieldsValue();
    const filter = {
      categoryId: values.categoryId,
      codeUser: values.codeUser,
      contentActivity: values.contentActivity,
      nameUser: values.nameUser,
      registrationId: values.registrationId,
      status: status,
      titleArticle: values.titleArticle,
      page: current - 1,
      size: size,
    };
    DownloadArticleAPI.fetchAll(filter).then((response) => {
      setLstUser(response.data.data.data);
      setTotal(response.data.data.totalPages);
      if (total > response.data.data.totalPages) {
        setCurrent(1);
      } else {
        setCurrent(response.data.data.currentPage + 1);
      }
      countMenu();
    });
  };

  const countMenu = () => {
    DownloadArticleAPI.countMenu().then((response) => {
      let list = response.data.data;
      if (list && list.length !== 0) {
        for (let index = 0; index < list.length; index++) {
          const el = list[index];
          if (el.status === 3) {
            setCountDaPheDuyet(el.count);
          }
          if (el.status === 6) {
            setCountDaGui(el.count);
          }
          if (el.status === 8) {
            setCountDaDang(el.count);
          }
          if (el.status === 9) {
            setCountBiTrung(el.count);
          }
        }
      }
    });
  };

  const showPreview = (articleId, title) => {
    CensorAPI.detail(articleId).then((response) => {
      setPreviewContent(response.data.data.content);
      setPreviewTitle(title);
    });
    setPreviewVisible(true);
  };

  const pathFileDownload = (url) => {
    if (url === null || url === undefined) {
      message.error("Bài viết chưa được đẩy lên driver!!!");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.click();
    window.URL.revokeObjectURL(url);
    message.success("Tải về thành công !!!");
  };

  const pathFileDriver = (url) => {
    if (url === null || url === undefined) {
      message.error("Bài viết chưa được đẩy lên driver!!!");
    } else {
      window.open(url, "_blank");
    }
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(0);
    setSize(pageSize);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      width: 60,
    },
    {
      title: "Tiêu đề bài viết",
      dataIndex: "articleName",
    },
    {
      title: "Số lần phê duyệt",
      dataIndex: "countApprove",
      align: "center",
    },
    {
      title: "Số lần từ chối",
      dataIndex: "countRefuse",
      align: "center",
    },
    {
      title: "Thể loại",
      dataIndex: "categoryName",
    },
    {
      title: "Giảng viên",
      dataIndex: "userCode",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color, text;

        switch (status) {
          case 3:
            color = "green";
            text = "Đã phê duyệt";
            break;
          case 6:
            color = "blue";
            text = "Đã gửi";
            break;
          case 8:
            color = "orange";
            text = "Đã đăng";
            break;
          case 9:
            color = "red";
            text = "Bị trùng";
            break;
          default:
            color = "default";
            text = "Không xác định";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Tên đợt đăng ký",
      dataIndex: "registrationName",
    },
    {
      title: "Ngày phê duyệt",
      dataIndex: "browseDate",
      render: (_, record) => {
        return <span>{moment(record.browseDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Copy đường dẫn driver">
            <Button
              type="link"
              className="btn__table"
              onClick={() => handleRowClick(record)}>
              <CopyOutlined />
            </Button>
          </Tooltip>
          {/* <SendArticle id={record.articleId} pathDriver={ record.pathDriver } /> */}
          <Tooltip title="Chọn form gửi">
            <Button
              type="link"
              className="btn__table"
              onClick={() => {
                navigator.clipboard.writeText(record.pathDriver);
                setId(record.articleId);
                if (urlForm) {
                  openModalFormSend(
                    urlForm.url,
                    urlForm.title,
                    record.articleId
                  );
                } else {
                  openModal();
                }
              }}>
              <SendOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Xem nhanh">
            <Button
              type="link"
              className="btn__table"
              // className="detail-button w-12"
              onClick={() => showPreview(record.articleId, record.articleName)}>
              <EyeOutlined className="icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Tải bài viết">
            <Button
              type="link"
              className="btn__table"
              onClick={() => pathFileDownload(record.pathDownload)}>
              <CloudDownloadOutlined className="icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Xem trước trên driver">
            <Button
              type="link"
              className="btn__table"
              onClick={() => pathFileDriver(record.pathDriver)}>
              <CloudServerOutlined className="icon" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setNewSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDownloadAll = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      DownloadArticleAPI.export(newSelectedRowKeys).then((response) => {
        setNewSelectedRowKeys([]);
        setSelectedRowKeys([]);
        message.success("Tải về thành công !!!");
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "documents.zip"; // Tên file tải về
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  };

  const updateStatus = (status) => {
    DownloadArticleAPI.updateStatus(newSelectedRowKeys, {
      status: status,
    }).then((response) => {
      if (response.data.data) {
        setSelectedRowKeys([]);
        setNewSelectedRowKeys([]);
        message.success("Chuyển đổi trạng thái thành công");
        clearForm();
        countMenu();
      } else {
        message.error("Lỗi hệ thống !!!");
      }
    });
  };

  const transferApprove = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else if (status === 3) {
      message.error("Bài viết đang ở trạng thái đã phê duyệt");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content:
          "Bạn có chắc chắn muốn chuyển trạng thái thành đã phê duyệt không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(3);
          setCountDaPheDuyet(0);
          setCountDaGui(0);
          setCountDaDang(0);
          setCountBiTrung(0);
        },
      });
    }
  };
  const transferSent = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else if (status === 6) {
      message.error("Bài viết đang ở trạng thái đã gửi");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành đã gửi không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(6);
          setCountDaPheDuyet(0);
          setCountDaGui(0);
          setCountDaDang(0);
          setCountBiTrung(0);
        },
      });
    }
  };
  const transferUp = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else if (status === 8) {
      message.error("Bài viết đang ở trạng thái đã gửi");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành đã đăng không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(8);
          setCountDaPheDuyet(0);
          setCountDaGui(0);
          setCountDaDang(0);
          setCountBiTrung(0);
        },
      });
    }
  };
  const transferDuplicate = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else if (status === 9) {
      message.error("Bài viết đang ở trạng thái đã bị trùng");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content:
          "Bạn có chắc chắn muốn chuyển trạng thái thành bị trùng không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(9);
          setCountDaPheDuyet(0);
          setCountDaGui(0);
          setCountDaDang(0);
          setCountBiTrung(0);
        },
      });
    }
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    const filter = {
      categoryId: values.categoryId,
      codeUser: values.code === undefined ? "" : values.code.trim(),
      contentActivity:
        values.contentActivity === undefined
          ? ""
          : values.contentActivity.trim(),
      nameUser: values.nameUser === undefined ? "" : values.nameUser.trim(),
      registrationId: values.registrationId,
      status: status,
      titleArticle:
        values.titleArticle === undefined ? "" : values.titleArticle.trim(),
      page: 0,
    };
    DownloadArticleAPI.fetchAll(filter).then((response) => {
      setLstUser(response.data.data.data);
      setTotal(response.data.data.totalPages);
      setCurrent(1);
    });
    countMenu();
  };

  const handleStatusChange = (e) => {
    setSelectedRowKeys([]);
    setNewSelectedRowKeys([]);
    const selectedValue = e.target.value;
    setStatus(parseInt(selectedValue));
  };

  const handleViewLog = () => {
    setIsModalOpen(true);
  };

  // Form Send

  const [urlForm, setUrlForm] = useState({});
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    CensorSendDataApi.ferchUrlForm().then((response) => {
      setUrlForm(response.data.data);
    });

    CensorSendDataApi.ferchUrlFormAll().then((response) => {
      dispatch(SetFormSend(response.data.data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useAppSelector(GetFormSend);
  const openModalFormSend = (url, title, id) => {
    if (url) {
      const modal = Modal.confirm({
        title: (
          <Row>
            <Col span={12}>
              <h3 className="m-0 font-semibold">{title}</h3>
            </Col>
            <Col span={12}></Col>
          </Row>
        ),
        icon: null,
        content: (
          <>
            <hr className="border-0 bg-gray-300 mt-3 mb-6" />
            <div style={{ maxWidth: "100%" }}>
              <iframe
                width={"100%"}
                className="border-0"
                height={windowHeight - 200}
                src={`${url}?embedded=true`}
              />
            </div>
          </>
        ),
        width: "70%",
        maskClosable: true,
        style: { top: "50%", transform: "translateY(-50%)", maxWidth: "100%" },
        closable: true,
        okText: "Chọn form khác",
        cancelText: "Đóng",
        footer: (
          <>
            <div className="text-end">
              <Button
                className="mr-5"
                onClick={() => {
                  modal.destroy();
                }}>
                Đóng
              </Button>
              <Button
                className="mr-5"
                type="primary"
                onClick={() => {
                  openModal();
                }}>
                Chọn form khác
              </Button>
              <Button
                style={{
                  backgroundColor: "#1d8b25",
                  color: "white",
                }}
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận cập nhật",
                    content:
                      "Bạn có chắc chắn muốn chuyển trạng thái thành đã gửi không?",
                    okText: "Đồng ý",
                    cancelText: "Hủy",
                    onOk() {
                      console.log(id);
                      DownloadArticleAPI.updateStatus([id], {
                        status: 6,
                      }).then((response) => {
                        if (response.data.data) {
                          modal.destroy();
                          fetchData();
                          message.success("Chuyển đổi trạng thái thành công");
                        } else {
                          message.error("Lỗi hệ thống !!!");
                        }
                      });
                    },
                  });
                }}>
                Xác nhận đã gửi
              </Button>
            </div>
          </>
        ),
        onOk: () => {
          openModal();
        },
      });
    } else {
      openModal();
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const openModal = () => {
    setIsModalVisible(true);
  };

  const backgrounds = [
    "rgb(103, 58, 183)",
    "rgb(169 58 58);",
    "rgb(31 131 25)",
    "rgb(25 67 131)",
    "rgb(180 159 7)",
    "rgb(148 26 120)",
    "rgb(148 26 133)",
    "rgb(26 146 148)",
  ];

  // Hàm để chọn ngẫu nhiên một phần tử từ mảng backgrounds
  function getRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
  }

  return (
    <>
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          category={null}
          SetCategory={null}
          isSendArticle={true}
        />
      )}

      {isModalVisible && (
        <Modal
          title={
            <span>
              <h3 className="m-0 font-semibold">
                Danh sách Form
                <Tooltip title="Thêm form mới">
                  <Button
                    shape="circle ml-6"
                    style={{ width: "40px" }}
                    onClick={() => {
                      setShowModal(true);
                    }}
                    icon={<FileAddOutlined />}
                  />
                </Tooltip>
              </h3>
            </span>
          }
          icon={null}
          width={"80%"}
          maskClosable={true}
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "100%",
          }}
          closable={true}
          okText="Đóng"
          cancelButtonProps={{ style: { display: "none" } }}
          visible={isModalVisible}
          onOk={() => {
            closeModal();
          }}
          onCancel={() => {
            closeModal();
          }}>
          <hr className="border-0 bg-gray-300 mt-3 mb-6" />
          <Row>
            {data.map((item) => (
              <Col
                xl={6}
                lg={8}
                md={12}
                sm={24}
                key={item.id}>
                <Card
                  hoverable
                  style={{
                    width: 240,
                    marginTop: 15,
                  }}
                  onClick={() => {
                    closeModal();
                    openModalFormSend(item.url, item.title, id);
                  }}>
                  <div
                    className="JH79cc RVEQke b33AEc"
                    style={{ backgroundColor: getRandomBackground() }}></div>
                  <Meta
                    title={item.title}
                    description={item.url}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Modal>
      )}
      {isModalOpen && (
        <ModalLog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          path={3}
        />
      )}
      <FormSearch id="cloudArticle">
        <Form
          form={form}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="horizontal"
          onFinish={onFinish}>
          {/* Dòng 1 */}
          <Row gutter={24}>
            <Col
              lg={24}
              className="w-full">
              <Form.Item
                name="titleArticle"
                label={<h1 className="label">Tiêu đề bài viết</h1>}>
                <Input placeholder="Tìm kiếm tiêu đề bài viết..." />
              </Form.Item>
            </Col>
            {/* <Col lg={11}>
              <Form.Item
                name="contentActivity"
                label={<span className="font-medium">Số lần phê duyệt</span>}
              >
                <Input placeholder="Tìm kiếm số lần phê duyệt..." />
              </Form.Item>
            </Col> */}
          </Row>
          {/* Dòng 2 */}
          <Row gutter={24}>
            <Col
              lg={12}
              className="w-full">
              <Form.Item
                name="codeUser"
                label={<h1 className="label">Mã giảng viên</h1>}>
                <Input placeholder="Tìm kiếm mã giảng viên..." />
              </Form.Item>
            </Col>
            <Col
              lg={12}
              className="w-full">
              <Form.Item
                name="nameUser"
                label={<h1 className="label">Tên giảng viên</h1>}>
                <Input placeholder="Tìm kiếm tên giảng viên..." />
              </Form.Item>
            </Col>
          </Row>
          {/* Dòng 3 */}
          <Row gutter={24}>
            <Col
              lg={12}
              className="w-full">
              <Form.Item
                name="registrationId"
                label={<h1 className="label">Đợt đăng ký</h1>}>
                <Select defaultValue="">
                  <Select.Option
                    key={1}
                    value="">
                    -- Chọn đợt đăng ký --
                  </Select.Option>
                  {res.length !== 0 &&
                    res.map((el) => (
                      <Select.Option value={el.id}>{el.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col
              lg={12}
              className="w-full">
              <Form.Item
                name="categoryId"
                label={<h1 className="label">Thể loại bài viết</h1>}>
                <Select defaultValue="">
                  <Select.Option value="">-- Chọn thể loại --</Select.Option>
                  {cbbCategory.length !== 0 &&
                    cbbCategory.map((el) => (
                      <Select.Option value={el.id}>{el.name}</Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row className="justify-center"> */}
          {/* <Button onClick={clearForm} type="primary m-2">
              Làm mới
            </Button>
            <Button onClick={onFinish} type="primary m-2">
              Tìm kiếm
            </Button> */}
          {/* </Row> */}
          <Col className="flex justify-center mt-5">
            {/* Hàng ch?a hai nút */}
            <div>
              <Button
                type="primary"
                className="searchButton1"
                onClick={clearForm}
                style={{ marginRight: 5 }}>
                <ClearOutlined />
                Làm mới
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                className="searchButton1"
                onClick={fetchData}
                style={{ marginLeft: 5 }}>
                <SearchOutlined />
                Tìm kiếm
              </Button>
            </div>
          </Col>
        </Form>
      </FormSearch>

      <Row className="justify-end">
        <Col
          span={24}
          className="text-end">
          <Radio.Group
            onChange={handleStatusChange}
            value={status}>
            <Badge
              count={countDaPheDuyet}
              showZero={true}
              style={{ zIndex: 9 }}>
              <Radio.Button value="3">Đã phê duyệt</Radio.Button>
            </Badge>
            <Badge
              count={countDaGui}
              showZero={true}
              style={{ zIndex: 9 }}>
              <Radio.Button value="6">Đã gửi</Radio.Button>
            </Badge>
            <Badge
              count={countDaDang}
              showZero={true}
              style={{ zIndex: 9 }}>
              <Radio.Button value="8">Đã đăng</Radio.Button>
            </Badge>
            <Badge
              count={countBiTrung}
              showZero={true}
              style={{ zIndex: 9 }}>
              <Radio.Button value="9">Bị trùng</Radio.Button>
            </Badge>
          </Radio.Group>
        </Col>
      </Row>
      <Card>
        <div>
          <Row className="flex justify-between items-center">
            <div>
              <h1 className="text-xl m-0">
                <UnorderedListOutlined className="mr-3" />
                Danh sách bài viết
                {status === 3
                  ? " đã phê duyệt"
                  : status === 6
                  ? " đã gửi"
                  : status === 8
                  ? " đã đăng"
                  : " bị trùng"}
              </h1>
            </div>
            <div>
              <Tooltip title="Tải tất cả bài viết">
                <button
                  className="header_card_button mr-3"
                  onClick={handleDownloadAll}>
                  <DownloadOutlined className="mr-2" />
                  Tải bài viết
                </button>
              </Tooltip>

              <Tooltip title="Xem lịch sử">
                <button
                  className="header_card_button mr-3"
                  onClick={() => {
                    handleViewLog();
                  }}>
                  <HistoryOutlined className="mr-2" />
                  Lịch sử
                </button>
              </Tooltip>
              {status !== 3 && (
                <Tooltip title="Chuyển sang trạng thái sang bài viết đã phê duyệt">
                  <button
                    className="header_card_button mr-3"
                    onClick={transferApprove}>
                    <CheckOutlined className="mr-2" />
                    Đã phê duyệt
                  </button>
                </Tooltip>
              )}
              {status !== 6 && (
                <Tooltip title="Chuyển sang trạng thái sang bài viết đã gửi">
                  <button
                    className="header_card_button mr-3"
                    onClick={transferSent}>
                    <SafetyOutlined className="mr-2" />
                    Đã gửi
                  </button>
                </Tooltip>
              )}
              {/*{status !== 8 && (*/}
              {/*  <Tooltip title="Chuyển sang trạng thái sang bài viết đã đăng">*/}
              {/*    <button*/}
              {/*      className="header_card_button mr-3"*/}
              {/*      onClick={transferUp}>*/}
              {/*      <CloudUploadOutlined className="mr-2" />*/}
              {/*      Đã đăng*/}
              {/*    </button>*/}
              {/*  </Tooltip>*/}
              {/*)}*/}
              {/*{status !== 9 && (*/}
              {/*  <Tooltip title="Chuyển sang trạng thái sang bài viết bị trùng">*/}
              {/*    <button*/}
              {/*      className="header_card_button"*/}
              {/*      onClick={transferDuplicate}>*/}
              {/*      <ExclamationOutlined className="mr-2" />*/}
              {/*      Bị trùng*/}
              {/*    </button>*/}
              {/*  </Tooltip>*/}
              {/*)}*/}
            </div>
          </Row>

          <div className="mt-5">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={lstUser}
              pagination={false}
              rowKey="articleId"
            />
          </div>
          <div className="mt-5 text-center">
            <Pagination
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              onChange={(value) => {
                setCurrent(value);
              }}
              current={current}
              total={total * size}
            />
          </div>
        </div>
      </Card>
      {previewVisible && (
        <Modal
          title={previewTitle}
          visible={previewVisible}
          onCancel={closePreview}
          footer={null}
          width={1000}>
          <hr className="border-0 bg-gray-300 mt-3 mb-6" />
          <ViewEditorJodit value={previewContent} />
        </Modal>
      )}
    </>
  );
}
