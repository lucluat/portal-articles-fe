import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
  Row,
  Col,
  message,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  ClearOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TeacherAPI } from "../../../apis/censor/teacher/teacher.api";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
import { Link } from "react-router-dom";
import "./index.css";
import React from "react";
import FormSearch from "../../../components/card-search/FormSearch";

export default function Teacher() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  useEffect(() => {
    TeacherAPI.getAllTeacher().then((response) => {
      fetchData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = () => {
    const data = {
      search: title.trim(),
      page: current,
      size: size,
    };
    TeacherAPI.fetchAll(data).then((response) => {
      dispatch(SetUser(response.data.data.data));
      setCurrent(response.data.data.currentPage);
      setTotal(response.data.data.totalPages);
      if (total > response.data.data.totalPages) {
        setCurrent(0);
      } else {
        setCurrent(response.data.data.currentPage);
      }
    });
  };

  const dataTeacher = useAppSelector(GetUser);
  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết giảng viên">
            <Link to={`/censor/teacher/${record.key}`}>
              <Button type="link" className="btn__table">
                <FormOutlined className="icon" />
              </Button>
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Chọn hàng lẻ",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Chọn hàng chẵn",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const handleAddTeachersToPeriod = () => {
    if (selectedRowKeys.length === 0) {
      message.error("Vui lòng chọn giảng viên");
    } else {
      // Thực hiện hành động khi selectedRowKeys.length > 0
      const selectedTeachers = dataTeacher.filter((item) =>
        selectedRowKeys.includes(item.key)
      );
      dispatch(SetUser(selectedTeachers));
    }
  };

  const handleSearch = () => {
    setCurrent(0);
    const data = {
      search: title.trim(),
      page: 0,
      size: size,
    };
    TeacherAPI.fetchAll(data).then((response) => {
      dispatch(SetUser(response.data.data.data));
      setCurrent(response.data.data.currentPage);
      setTotal(response.data.data.totalPages);
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(0);
    setSize(pageSize);
  };

  const handleClearButtonClick = () => {
    setTitle("");
  };

  return (
    <>
      <FormSearch>
        <Row>
          <Col span={24} className="">
            <h1 className="label">Tìm kiếm theo mã, tên, email</h1>
            <Input
              prefix={<UserOutlined />}
              placeholder="Tìm kiếm theo mã, tên, email"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
        </Row>
        <Col className="flex justify-center mt-5">
          {/* Hàng chứa hai nút */}
          <div>
            <Button
              type="primary"
              className="searchButton1"
              onClick={handleClearButtonClick}
              icon={<ClearOutlined />}
              style={{ marginRight: 5 }}
            >
              Làm mới
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              className="searchButton1"
              onClick={() => handleSearch()}
              icon={<SearchOutlined />}
              style={{ marginLeft: 5 }}
            >
              Tìm kiếm
            </Button>
          </div>
        </Col>
      </FormSearch>

      <Card>
        <div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl m-0">
                <UnorderedListOutlined className="mr-3" /> Danh sách giảng viên
              </h1>
            </div>
            <div>
              <span>
                <Link
                  className={
                    selectedRowKeys.length === 0 ? "cursor-not-allowed" : ""
                  }
                  to="/censor/teacher/registration"
                >
                  <button
                    className={
                      selectedRowKeys.length === 0
                        ? "header_card_button_disabled cursor-not-allowed"
                        : "header_card_button"
                    }
                    onClick={handleAddTeachersToPeriod}
                    disabled={selectedRowKeys.length === 0}
                  >
                    <PlusOutlined />
                    Thêm giảng viên vào đợt
                  </button>
                </Link>
              </span>
              {/* <span>
                <Tooltip title="Đồng bộ">
                  <Button type="primary" onClick={handleHihi}>
                    <PlusOutlined />
                    Đồng bộ identity
                  </Button>
                </Tooltip>
              </span> */}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataTeacher}
            pagination={false}
          />
        </div>
        <div className="mt-5 text-center">
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={(value) => {
              setCurrent(value - 1);
            }}
            current={current + 1}
            total={total * size}
          />
        </div>
      </Card>
    </>
  );
}
