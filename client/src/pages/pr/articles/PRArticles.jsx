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
    Popover,
} from "antd";
import {
    CheckOutlined,
    ClearOutlined,
    CloudDownloadOutlined,
    CloudServerOutlined,
    CloudUploadOutlined,
    CopyOutlined,
    DollarOutlined,
    DownloadOutlined,
    ExclamationOutlined,
    EyeOutlined,
    FileAddOutlined,
    FormOutlined,
    HistoryOutlined,
    SafetyOutlined,
    SearchOutlined,
    SendOutlined,
    StarFilled,
    StarOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import React from "react";
import FormSearch from "../../../components/card-search/FormSearch";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import { Link } from "react-router-dom";
import { PrAPI } from "../../../apis/pr/article/article.pr.api";

const PRArticle = () => {
    const [current, setCurrent] = useState(1);
    const [previewContent, setPreviewContent] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [cbbCategory, setCbbCategory] = useState([]);
    const [res, setCbbRes] = useState([]);
    const [size, setSize] = useState(10);
    const [data, setData] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [category, setCategory] = useState(null);
    const [isStar, setIsStar] = useState(null);

    const showPreview = (articleId, title) => {
        CensorAPI.detail(articleId).then((response) => {
            setPreviewContent(response.data.data.content);
            setPreviewTitle(title);
        });
        setPreviewVisible(true);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const fetchData = () => {
        PrAPI.fetchAll({
            category: category,
            isStar: isStar,
            page: current - 1,
            size: size
        }).then((response) => {
            setData(response.data.data.data)
            console.log(response.data.data.data);
        })
    }

    const handleChangeIsStar = (id) => {
        PrAPI.putStar(id).then((res) => {
            if (res.status === 200) {
                fetchData();
                message.success("Cập nhập thành công");
            }
        });
    }

    useEffect(() => {
        console.log("isStar", { isStar });
        console.log("category", { category });
        fetchData();
    }, [isStar, category, current, size]);

    useEffect(() => {
        fetchData()
    }, [current, size]);

    useEffect(() => {
        const fetchAllCategory = async () => {
            try {
                const res = await PrAPI.getAllCategory({});
                setListCategory(res.data.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllCategory();
    }, []);

    const nhuanBut = (
        <div>
            <p>Nhuận bút:         </p>
            <p>Đánh giá: </p>
            <p>Ghi chú: </p>
        </div>
    );

    const clearForm = () => {
        setIsStar(null);
        setCategory(null);
    }

    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            key: "stt",
            render: (_, record) => {
                return (
                    <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
                        {record.stt}
                    </span>
                );
            },
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            render: (_, record) => {
                return (
                    <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
                        {record.title}
                    </span>
                );
            },
        },
        {
            title: "Tác giả",
            dataIndex: "name",
            key: "name",
            render: (_, record) => {
                return (
                    <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
                        {record.name}
                    </span>
                );
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (_, record) => {
                return (
                    <span style={{ color: record.registrationCount === 0 ? "red" : "" }}>
                        {formatDate(record.createdDate)}
                    </span>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                let color, text;

                if (
                    record.status === "2" ||
                    (record.status === 2 && record.registrationCount === 0)
                ) {
                    color = "blue"; // Màu đỏ khi status là "2" và registrationCount là 0
                    text = "Chờ phê duyệt";
                } else {
                    // Xử lý các trạng thái khác
                    switch (status) {
                        case "7":
                            color = "green"; // Màu mặc định cho trạng thái "Gửi lại, chờ phê duyệt"
                            text = "Gửi lại, chờ phê duyệt";
                            break;
                        case "3":
                            color = "orange"; // Màu mặc định cho trạng thái "Đã phê duyệt"
                            text = "Đã phê duyệt";
                            break;
                        case "6":
                            color = "green"; // Màu mặc định cho trạng thái "Đã gửi cho đào tạo"
                            text = "Đã gửi cho đào tạo";
                            break;
                        default:
                            color = "default"; // Màu mặc định cho các trạng thái khác
                            text = "Không xác định";
                    }
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: () => <div>Hành động</div>,
            key: "action",
            align: "center",
            render: (record) =>
            (record.isStar ?
                (
                    <div>
                        <Button
                            onClick={() => handleChangeIsStar(record.id)}
                            type="link"
                            className="btn__table">
                            <StarFilled className="icon" style={{ color: "#fadb14" }} />
                        </Button>
                        <Space wrap>
                            <Popover content={nhuanBut} title=" " trigger="hover">
                            <Popover content={nhuanBut} title=" " trigger="focus">
                                <Button
                                    type="link"
                                    className="btn__table">
                                    <DollarOutlined className="icon" />
                                </Button>
                            </Popover>
                            </Popover>
                        </Space>
                        <Link to={`/pr/article/${record.id}`}>
                            <Button
                                type="link"
                                className="btn__table">
                                <EyeOutlined className="icon" />
                            </Button>
                        </Link>
                    </div>
                )
                :
                <div>
                    <Button
                        onClick={() => handleChangeIsStar(record.id)}
                        type="link"
                        className="btn__table">
                        <StarOutlined className="icon" />
                    </Button>
                    <Link to={`/pr/article/${record.id}`}>
                        <Button
                            type="link"
                            className="btn__table">
                            <EyeOutlined className="icon" />
                        </Button>
                    </Link>
                </div>
            )
        },
    ];



    return (
        <>
            <FormSearch id="cloudArticle">
                <Form
                    //   form={form}
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    layout="horizontal"
                //   onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col lg={12} className="w-full">
                            <Form.Item
                                name="registrationId"
                                label={<h1 className="label">Bài viết gắn sao</h1>}
                            >
                                <Select defaultValue={isStar} onChange={(value) => setIsStar(value)}>
                                    <Select.Option value={null}>
                                        -- Tất cả bài viết --
                                    </Select.Option>
                                    <Select.Option value={true}>
                                        Chọn bài viết gắn sao
                                    </Select.Option>
                                    <Select.Option value={false}>
                                        Chọn bài viết không gắn sao
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col lg={12} className="w-full">
                            <Form.Item
                                name="categoryId"
                                label={<h1 className="label">Thể loại bài viết</h1>}
                            >
                                <Select defaultValue={null} onChange={(value) => setCategory(value)}>
                                    <Select.Option value={null}>-- Chọn thể loại --</Select.Option>
                                    {listCategory.length !== 0 &&
                                        listCategory.map((el) => (
                                            <Select.Option value={el.name}>{el.name}</Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col className="flex justify-center mt-5">
                        {/* Hàng ch?a hai nút */}
                        <div>
                            <Button
                                type="primary"
                                className="searchButton1"
                                onClick={clearForm}
                                style={{ marginRight: 5 }}
                            >
                                <ClearOutlined />
                                Làm mới
                            </Button>
                        </div>
                        <div>
                            <Button
                                type="primary"
                                className="searchButton1"
                                // onClick={fetchData}
                                style={{ marginLeft: 5 }}
                            >
                                <SearchOutlined />
                                Tìm kiếm
                            </Button>
                        </div>
                    </Col>
                </Form>
            </FormSearch>

            <Card>
                <div>
                    <h1 className="text-xl m-0">
                        <UnorderedListOutlined className="mr-3" /> Danh sách bài viết
                    </h1>
                </div>
                <div className="mt-5">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        pagination={false}
                    />
                </div>
            </Card>
        </>
    );
};
export default PRArticle;
