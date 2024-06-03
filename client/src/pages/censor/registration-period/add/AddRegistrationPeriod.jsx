import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import "./add-registration-period.css";
import { useEffect, useState } from "react";
import { TeacherAPI } from "../../../../apis/censor/teacher/teacher.api";
import { DeleteFilled } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/vi";
import { CensorRegistrationPeriodAPI } from "../../../../apis/censor/registration-period/registration-period.api";
import { Link, useNavigate } from "react-router-dom";

const AddRegistrationPeriod = () => {
  const [form] = Form.useForm();
  const [dataTeacher, setDataTeacher] = useState([]);
  const navigate = useNavigate();
  const [newSize, setNewSize] = useState(5);
  const fetchListTeacher = () => {
    TeacherAPI.list().then((res) => {
      setDataTeacher(res.data.data);
    });
  };

  useEffect(() => {
    fetchListTeacher();
  }, []);

  const handleChange = (value, record) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.stt === record.stt);
    if (index !== -1) {
      newData[index].users = value;
      setData(newData);
    }
  };

  const [data, setData] = useState([]);
  const dataDetail = () => {
    const formData = form.getFieldsValue();
    if (formData.qualityRegistration == null) {
      message.error("Vui lòng nhập số đợt đăng ký trước .");
      return;
    }

    if (formData.fromDate == null) {
      message.error("Vui lòng nhập ngày bắt đầu .");
      return;
    }

    if (formData.toDate == null) {
      message.error("Vui lòng nhập ngày kết thúc .");
      return;
    }

    const newRecords = [];
    let startDate = formData.fromDate;
    let endDate = formData.toDate;

    // Kiểm tra xem ngày bắt đầu và ngày kết thúc có là ngày đầu tiên và ngày cuối cùng của tháng
    const isStartFirstDay =
      startDate &&
      moment(startDate).isSame(moment(startDate).startOf("month"), "day");
    const isEndLastDay =
      endDate && moment(endDate).isSame(moment(endDate).endOf("month"), "day");

    // đếm số ngày
    const numberOfDays =
      isStartFirstDay && isEndLastDay
        ? moment(startDate).endOf("month").diff(startDate, "days") + 1
        : moment(endDate).diff(startDate, "days");

    for (let i = 1; i <= formData.qualityRegistration; i++) {
      const formattedStartDate = moment(startDate).format("DD/MM/YYYY");
      const formattedEndDate = moment(endDate).format("DD/MM/YYYY");

      const newRecord = {
        key: `${i}`,
        name: `Đợt ${formattedStartDate} - ${formattedEndDate}`,
        fromDate: startDate,
        toDate: endDate,
        users: [],
        stt: i,
      };
      newRecords.push(newRecord);

      if (!startDate || (isStartFirstDay && isEndLastDay)) {
        startDate = moment(endDate).add(1, "days").format("YYYY-MM-DD");
        endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");
      } else {
        startDate = moment(endDate).add(1, "days").format("YYYY-MM-DD");
        endDate = moment(startDate)
          .add(numberOfDays, "days")
          .format("YYYY-MM-DD");
      }
    }

    setData(newRecords);
  };

  const [isNewData, setIsNewData] = useState(false);

  const handleChangeToDate = () => {
    const formData = form.getFieldsValue();
    if (
      formData.qualityRegistration != null &&
      formData.fromDate != null &&
      formData.toDate != null
    ) {
      if (!moment(formData.fromDate).isBefore(formData.toDate)) {
        message.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        setIsNewData(false);
        return;
      }
      setIsNewData(true);
      dataDetail();
    }
  };

  const handleUpload = () => {
    return new Promise((resolve, reject) => {
      form
        .validateFields()
        .then((values) => {
          Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có đồng ý thêm không?",
            okText: "Đồng ý",
            cancelText: "Hủy",
            onOk: () => resolve(values),
            onCancel: () => reject("Hủy bỏ"),
          });
        })
        .catch((errorInfo) => {
          reject(errorInfo);
        });
    })
      .then(() => {
        const newData = data.map((item) => ({
          ...item,
          fromDate: moment(item.fromDate, "YYYY-MM-DD").valueOf(),
          toDate: moment(item.toDate, "YYYY-MM-DD").valueOf(),
        }));

        return CensorRegistrationPeriodAPI.createList(newData)
          .then(() => {
            message.success("Thành công!");
            form.resetFields();
            navigate(`/censor/registration-period`);
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
            throw error;
          });
      })
      .catch((error) => {
        if (error === "Hủy bỏ") {
          return;
        }
        console.error(error);
      });
  };

  const handleDateChange = (dateString, key, field) => {
    const updatedData = data.map((record) => {
      if (record.key === key) {
        return { ...record, [field]: dateString };
      }
      return record;
    });

    setData(updatedData);
  };

  const integerValidator = (rule, value, callback) => {
    const integerRegex = /^[1-9]\d*$/;
    if (value === "") {
      callback("Vui lòng nhập số đợt đăng ký.");
    } else if (value <= 0) {
      callback("Vui lòng nhập số đợt đăng ký lớn hơn 0.");
    } else if (!integerRegex.test(value)) {
      callback("Vui lòng nhập một số nguyên.");
    } else {
      callback();
    }
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có đồng ý xóa không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        const updatedData = data.filter((record) => record.key !== key);
        setData(updatedData);
      },
    });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
    },
    {
      title: "Tên đợt đăng ký",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "fromDate",
      key: "fromDate",
      width: "15%",
      render: (_, record) => (
        <Input
          readOnly
          value={record.fromDate}
          type="date"
          onChange={(date, dateString) =>
            handleDateChange(dateString, record.key, "fromDate")
          }
        />
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "toDate",
      key: "toDate",
      width: "15%",
      render: (_, record) => (
        <Input
          readOnly
          value={record.toDate}
          type="date"
          onChange={(date, dateString) =>
            handleDateChange(dateString, record.key, "toDate")
          }
        />
      ),
    },
    {
      title: "Thêm giảng viên tham gia",
      dataIndex: "users",
      key: "users",
      render: (_, record) => (
        <Select
          mode="tags"
          style={{
            width: "100%",
          }}
          placeholder="Chọn giảng viên"
          onChange={(value) => handleChange(value, record)}
          options={dataTeacher.map((option) => ({
            label: option.name,
            value: option.key,
          }))}
          value={record.users}
          maxTagCount={2}
        ></Select>
      ),
    },
    {
      title: () => <div>Hành động</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={"Xóa " + record.name}>
            <Button type="danger" onClick={() => handleDelete(record.key)}>
              <DeleteFilled
                style={{ fontSize: "20px", color: "red" }}
                className="icon"
              />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card className="mb-2" style={{ borderRadius: "2%" }}>
        <div className="filter">
          <div
            className="title_product"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: "25px", fontWeight: "bold", marginTop: "5%" }}
            >
              THÊM ĐỢT ĐĂNG KÝ
            </span>
          </div>

          <div style={{ marginTop: "50px" }}>
            <div>
              <Form form={form}>
                <Form.Item
                  label="Số lượng đợt đăng ký : "
                  name="qualityRegistration"
                  labelCol={{ span: 4 }}
                  style={{ fontWeight: "bold" }}
                  rules={[
                    {
                      validator: integerValidator,
                    },
                  ]}
                >
                  <Input
                    type="number"
                    className="form-input"
                    onChange={handleChangeToDate}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày bắt đầu"
                      name="fromDate"
                      labelCol={{ span: 8 }}
                      style={{ fontWeight: "bold" }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập ngày bắt đầu",
                        },
                      ]}
                    >
                      <Input
                        className="form-input-date"
                        type="date"
                        onChange={handleChangeToDate}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Ngày kết thúc"
                      name="toDate"
                      labelCol={{ span: 5 }}
                      style={{ fontWeight: "bold" }}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập ngày kết thúc",
                        },
                      ]}
                    >
                      <Input
                        className="form-input-date"
                        type="date"
                        onChange={handleChangeToDate}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>

          {/* chi tiet dot dang ky */}
          <div>
            <div className="button-hoan-tat">
              <Form.Item>
                <Tooltip title="Thêm đợt đăng ký ">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="form-submit-btn"
                    style={{
                      color: "#fff",
                      borderRadius: "5px",
                      marginLeft: "10px",
                    }}
                    onClick={handleUpload}
                    disabled={isNewData ? "" : "disabled"}
                  >
                    Hoàn Tất
                  </Button>
                </Tooltip>
                <Link type="link" to={`/censor/registration-period`}>
                  <Button
                    style={{
                      color: "#fff",
                      borderRadius: "5px",
                      marginLeft: "10px",
                    }}
                    type="ghost"
                    className="bg-red-500  hover:bg-red-400  hover:border-red-400 mx-5"
                  >
                    Quay lại
                  </Button>
                </Link>
              </Form.Item>
            </div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={data}
              pagination={{
                pageSize: newSize,
                pageSizeOptions: ["5", "10", "20"],
                showSizeChanger: true,
                onShowSizeChange: (current, newSize) => {
                  setNewSize(newSize);
                  // You can call dataDetail() or any other logic to update data based on newSize
                },
                style: { display: "flex", justifyContent: "center" },
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default AddRegistrationPeriod;
