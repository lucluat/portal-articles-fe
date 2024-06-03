import { Link, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Row,
  Col,
  Table,
  Card,
  Tooltip,
  Pagination,
  Button,
} from "antd";
import { useState, useEffect } from "react";
import { TeacherAPI } from "../../../apis/censor/teacher/teacher.api";
import { PlusOutlined } from "@ant-design/icons";
import ModalExcelmportFileTeacher from "./ModalExcelmportFileTeacher";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetRegistrationUser,
  SetRegistrationUser,
} from "../../../app/reducers/registration-user/registration-user.reducer";
import moment from "moment";
const DetailTeacher = () => {
  const { id } = useParams();
  const [detailTeacher, setDetailTeacher] = useState(null);
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    TeacherAPI.detail({}, id).then((response) => {
      setDetailTeacher(response.data.data);
      setCheck(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    TeacherAPI.page().then((response) => {
      dispatch(SetRegistrationUser(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  }, [dispatch]);

  const data = useAppSelector(GetRegistrationUser);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const fetchData = () => {
    const data = {
      idUser: id,
      page: current - 1,
    };
    TeacherAPI.page(data).then((response) => {
      dispatch(SetRegistrationUser(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  // Start excel
  const [showModalExcel, setShowModalExcel] = useState(false);
  const handleOpenModalExcel = () => {
    setShowModalExcel(true);
  };
  // End excel
  if (check) {
    data.map((item) => {
      const fromDateFormatted = moment(item.fromDate).format("DD/MM/YYYY");
      const toDateFormatted = moment(item.toDate).format("DD/MM/YYYY");
      return {
        ...item,
        date: `${fromDateFormatted} - ${toDateFormatted}`,
      };
    });
  }

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
      title: "Tên đợt đăng ký",
      dataIndex: "nameRegistrationPeriod",
      key: "nameRegistrationPeriod",
    },
    {
      title: "Số lượng bài viết",
      dataIndex: "numberArticles",
      key: "numberArticles",
      align: "center",
    },
    {
      title: "Thời gian",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (_, record) => {
        const fromDateFormatted = moment(record.fromDate).format(
          "DD/MM/YYYY HH:mm"
        );
        const toDateFormatted = moment(record.toDate).format(
          "DD/MM/YYYY HH:mm"
        );
        return `${fromDateFormatted} - ${toDateFormatted}`;
      },
    },
    {
      title: "Trạng thái",
      key: "reminderStatus",
      dataIndex: "reminderStatus",
      render: (_, record) => {
        return record.reminderStatus === 0 ? "Hoạt động" : "Không hoạt động";
      },
    },
  ];

  return (
    <>
      <Card>
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
        >
          <h1 style={{ fontSize: "22px", textAlign: "center" }}>
            Thông tin giảng viên
          </h1>
          {detailTeacher ? (
            // Hiển thị dữ liệu nếu detailTeacher có giá trị
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label={<h1 className="label">Mã giảng viên</h1>}>
                    <Input value={detailTeacher.code} disabled />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={<h1 className="label">Họ và tên giảng viên</h1>}
                  >
                    <Input value={detailTeacher.name} disabled />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                    <Form.Item label="Số điện thoại">
                      <Input value={detailTeacher.phoneNumber} />
                    </Form.Item>
                  </Col> */}
                <Col span={24}>
                  <Form.Item
                    label={<h1 className="label">Email giảng viên</h1>}
                  >
                    <Input value={detailTeacher.email} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Link type="link" to={`/censor/teacher`}>
                  <Button type="primary" className="searchButton1">
                    Quay lại
                  </Button>
                </Link>
              </Row>
            </>
          ) : (
            // Hiển thị thông báo nếu detailTeacher là null
            <div>Không có dữ liệu.</div>
          )}
        </Form>
      </Card>
      <Card style={{ marginTop: "30px" }}>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span className=" mr-5">
                <Tooltip title="Import giảng viên vào đợt">
                  <button
                    onClick={handleOpenModalExcel}
                    className="header_card_button mx-3"
                  >
                    <PlusOutlined className="mr-1" />
                    Import giảng viên vào đợt
                  </button>
                </Tooltip>
              </span>
            </div>
            {showModalExcel && (
              <ModalExcelmportFileTeacher
                visible={showModalExcel}
                onClose={() => setShowModalExcel(false)}
                id={id}
                fetchData={() => fetchData()}
              />
            )}
          </div>
        </div>
        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            key={"TableTeach"}
          />
        </div>
        <div className="mt-5 text-center">
          <Pagination
            simple
            current={current}
            onChange={(value) => {
              setCurrent(value);
            }}
            total={total * 10}
          />
        </div>
      </Card>
    </>
  );
};
export default DetailTeacher;
