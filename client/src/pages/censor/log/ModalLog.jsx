import { Modal, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { CensorLogApi } from "../../../apis/censor/log/log.api";
import "./index.css";

const ModalLog = (props) => {
  const [logData, setLogData] = useState(null);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);

  const { isModalOpen, setIsModalOpen, path } = props;

  const fetchLog = () => {
    CensorLogApi.fetchLog(
      { path: path, page: current - 1, size: size },
      {
        content: "",
        createDate: "",
        ip: "",
        userName: "",
        pathFile: "",
      }
    ).then((response) => {
      setLogData(response.data.data);
      setCurrent(response.data.currentPage + 1);
      setTotal(response.data.totalPages);
    });
  };

  useEffect(() => {
    fetchLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, size]);

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (
        <span>{index + 1 + current * size}</span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => <span style={{ wordBreak: "break-word" }}>{text}</span>,
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
  ];

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(current);
    setSize(pageSize);
  };

  return (
    <>
      <Modal open={isModalOpen} width={1200} footer={false} onCancel={onCancel}>
        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={logData}
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
      </Modal>
    </>
  );
};

export default ModalLog;
