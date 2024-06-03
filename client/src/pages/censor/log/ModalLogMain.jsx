import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { CensorLogApi } from "../../../apis/censor/log/log.api";
import "./index.css";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";

const ModalLogMain = (props) => {
  const [logData, setLogData] = useState(null);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(null);
  const [size, setSize] = useState(10);
  const [registrationPeriod, setRegistrationPeriod] = useState(null);
  const [idRegis, setIdRegis] = useState(null);
  const [content, setContent] = useState("");

  const { isModalOpen, setIsModalOpen } = props;

  const getAllRegistrationPeriod = () => {
    CensorRegistrationPeriodAPI.getAll().then((response) => {
      if (response.status === 200) {
        setRegistrationPeriod(response.data);
        setIdRegis(response.data[0].id);
      }
    });
  };

  useEffect(() => {
    getAllRegistrationPeriod();
  }, []);

  const fetchLogMain = () => {
    if (idRegis !== null) {
      CensorLogApi.fetchLogMain(
        { idRegis: idRegis, page: current - 1, size: size },
        {
          content: content,
          createDate: "",
          ip: "",
          userName: "",
          pathFile: "",
        }
      )
        .then((response) => {
          if (response.status === 200) {
            setLogData(response.data.data);
            setTotal(response.data.totalPages);
            // setCurrent(response.data.currentPage + 1);
            if (total > response.data.totalPages) {
              setCurrent(1);
            } else {
              setCurrent(response.data.currentPage + 1);
            }
          }
        })
        .catch((error) => {
          setLogData(null);
          message.error("Đợt không có dữ liệu!!!");
        });
    }
  };

  const handleRegistrationPeriodChange = (e) => {
    setIdRegis(e);
  };

  const filterOption = (input, option) => {
    return (
      option.props.children.props.title
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  };

  useEffect(() => {
    fetchLogMain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const handleSearch = () => {
    CensorLogApi.fetchLogMain(
      { idRegis: idRegis, page: 0, size: size },
      {
        content: content,
        createDate: "",
        ip: "",
        userName: "",
        pathFile: "",
      }
    )
      .then((response) => {
        if (response.status === 200) {
          setLogData(response.data.data);
          setCurrent(response.data.currentPage + 1);
          setTotal(response.data.totalPages);
        }
      })
      .catch((error) => {
        setLogData(null);
        message.error("Đợt không có dữ liệu!!!");
      });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày thao tác",
      dataIndex: "createDate",
      key: "createDate",
    },
    {
      title: "Người thao tác",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Người được tác động",
      dataIndex: "userActive",
      key: "userActive",
      render: (text) => <span>{text}</span>,
    },
  ];

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(current);
    setSize(pageSize);
  };

  const handleClearButtonClick = () => {
    setContent("");
  };

  return (
    <>
      <Modal open={isModalOpen} width={1200} footer={false} onCancel={onCancel}>
        <Row className="mt-7 ml-3 mr-4">
          <Col span={3}>
            <span style={{ lineHeight: "40px", fontWeight: "bold" }}>
              Chọn đợt viết bài<span style={{ color: "red" }}> (*)</span>:
            </span>
          </Col>
          <Col span={21}>
            <Select
              showSearch
              onChange={handleRegistrationPeriodChange}
              value={idRegis}
              style={{ width: "100%", height: "40px", marginLeft: "10px" }}
              optionFilterProp="children"
              filterOption={filterOption}
            >
              {registrationPeriod
                ? registrationPeriod.map((regis) => (
                    <Select.Option value={regis.id} key={regis.id}>
                      <Tooltip title={regis.name}>{regis.name}</Tooltip>
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Col>
        </Row>
        <Card className="mb-2 mt-5">
          <Form className="-mt-1">
            <Row>
              <Col span={19}>
                <h1 className="text-xl -mt-2">Tìm kiếm</h1>
              </Col>
              <Col span={5}></Col>
            </Row>
            <Row>
              <Col span={3}>
                <span style={{ lineHeight: "40px", fontWeight: "bold" }}>
                  Nội dung:{" "}
                </span>
              </Col>
              <Col span={21}>
                <div className="relative w-full mr-6">
                  <Input
                    style={{ height: "40px" }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung"
                  />
                </div>
              </Col>
            </Row>

            <Col className="flex justify-center mt-5">
              {/* Hàng chứa hai nút */}
              <div>
                <Button
                  type="primary"
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
                  onClick={() => handleSearch()}
                  icon={<SearchOutlined />}
                  style={{ marginLeft: 5 }}
                >
                  Tìm kiếm
                </Button>
              </div>
            </Col>
          </Form>
        </Card>
        <>
          <div className="mt-5">
            <Table
              columns={columns}
              dataSource={logData ? logData : null}
              pagination={false}
              className="custom-table"
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
        </>
      </Modal>
    </>
  );
};

export default ModalLogMain;
