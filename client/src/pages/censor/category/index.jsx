/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  FormOutlined,
  ClearOutlined,
  SearchOutlined,
  HistoryOutlined,
  UnorderedListOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import {
  GetCategory,
  SetCategory,
} from "../../../app/reducers/category/category.reducer";
import ModalThem from "./ModalAdd";
import ModalDetail from "./ModalDetail";

import "./index.css";
import React from "react";
import ModalLog from "../log/ModalLog";
import FormSearch from "../../../components/card-search/FormSearch";

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    CategoryAPI.fetchAll().then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [current, size]);

  const fetchData = () => {
    CategoryAPI.fetchAll({
      search: search.trim(),
      page: current - 1,
      size: size,
    }).then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setTotal(response.data.data.totalPages);
      if (total > response.data.data.totalPages) {
        setCurrent(1);
      } else {
        setCurrent(response.data.data.currentPage + 1);
      }
    });
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(1);
    setSize(pageSize);
  };

  const handleDeleteCategory = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa thể loại",
      content: "Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa thể loại",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        CategoryAPI.delete(id)
          .then(() => {
            message.success("Xóa thể loại thành công!");
            fetchData();
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message.error(error.response.data.message);
            } else {
              message.error("Lỗi.");
            }
          });
      },
    });
  };

  const data = useAppSelector(GetCategory);

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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Cập nhật">
            <Button
              type="link"
              className="btn__table"
              onClick={() => {
                setDetailCategory(record);
                setShowModal(true);
              }}
            >
              <EditOutlined className="icon" />
            </Button>
          </Tooltip>
          <ModalDetail category={record} icon={<FormOutlined />} />
          <Tooltip title="Xóa">
            <Button
              className="btn__table"
              onClick={() => handleDeleteCategory(record.id)}
              type="link"
            >
              <DeleteFilled />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setCurrent(1);
      fetchData();
    }
  };
  const handleClearButtonClick = () => {
    setSearch("");
  };

  const handleSearch = () => {
    setCurrent(1);
    CategoryAPI.fetchAll({
      search: search.trim(),
      page: 0,
      size: size,
    }).then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setCurrent(response.data.data.currentPage + 1);
      setTotal(response.data.data.totalPages);
    });
  };

  const handleViewLogCategory = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      {isModalOpen && (
        <ModalLog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          path={0}
        />
      )}
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          category={detailCategory}
          SetCategory={setDetailCategory}
          fetchData={() => fetchData()}
        />
      )}

      <FormSearch>
        <Row>
          <Col xs={24}>
            <div className="relative w-full mr-6">
              <h1 className="label">Tìm kiếm theo tên hoặc mã</h1>
              <Input
                onKeyDown={handleEnterKey}
                // style={{ borderRadius: "30px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm tên hoặc mã..."
              />
            </div>
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
              style={{ marginRight: 5 }}>
              Làm mới
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              className="searchButton1"
              onClick={() => handleSearch()}
              icon={<SearchOutlined />}
              style={{ marginLeft: 5 }}>
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
                <UnorderedListOutlined className="mr-3" /> Danh sách thể loại
              </h1>
            </div>
            <div>
              <button
                className="header_card_button mr-3"
                onClick={() => {
                  handleViewLogCategory();
                }}
                style={{ marginLeft: 10 }}>
                <HistoryOutlined className="mr-1" />
                Lịch sử
              </button>
              <button
                className="header_card_button"
                onClick={() => {
                  setShowModal(true);
                  setDetailCategory(null);
                }}>
                <PlusOutlined className="mr-1" />
                Thêm thể loại
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
          />
        </div>
        {total > 1 && (
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
        )}
      </Card>
    </>
  );
}
