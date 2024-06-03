import {
  Button,
  Card,
  Form,
  Input,
  Space,
  DatePicker,
  message,
  Modal,
  Row,
} from "antd";
import React from "react";
import TableRegistration from "./TableDetail";
import ModalRegistration from "./ModalRegistration";
import { useEffect, useState } from "react";
import { CensorRegistrationUserAPI } from "../../../../apis/censor/registration-user/registration-user.api";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  GetRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../../app/reducers/registration-period/registration-period.reducer";
import dayjs from "dayjs";
import { CensorRegistrationPeriodAPI } from "../../../../apis/censor/registration-period/registration-period.api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../index.css";
import moment from "moment";
dayjs.extend(customParseFormat);

export default function DetailRegistration() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const fetchData = async () => {
    const response = await CensorRegistrationUserAPI.fetchAll({}, id);
    
    const responseData = response.data.data;
    console.log(responseData);
    if (responseData !== null) {
      let dem = 0;
      responseData.censorUserInRegistrationReponses.forEach((el) => {
        dem = dem + el.numberArticles;
      });

      const updatedRegistrationPeriod = {
        ...responseData.registrationPeriod,
        restNumber: dem,
      };

      dispatch(SetRegistrationPeriod(updatedRegistrationPeriod));
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const registrationPeriod = useAppSelector(GetRegistrationPeriod);
  const [fromDateNew, setFromDateNew] = useState(null);
  const [toDateNew, setToDateNew] = useState(null);
  useEffect(() => {
    const a = registrationPeriod.fromDate;
    const b = registrationPeriod.toDate;
    setFromDateNew(a);
    setToDateNew(b);
  }, [registrationPeriod]);
  useEffect(() => {
    const initialValues = {
      code: registrationPeriod.code,
      name: registrationPeriod.name,
      numberArticles: registrationPeriod.numberArticles,
      status:
        registrationPeriod.registrationPeriodStatus === "INACTIVE" ? "1" : "0",
    };
    form.setFieldsValue(initialValues);
  }, [form, registrationPeriod]);

  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [fromDate, toDate] = dates;
      setFromDateNew(fromDate ? fromDate.valueOf() : null);
      setToDateNew(toDate ? toDate.valueOf() : null);
    } else {
      setFromDateNew(undefined);
      setToDateNew(undefined);
    }
  };

  const validateNumberArticles = (rule, value) => {
    return new Promise((resolve, reject) => {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue <= 0) {
        reject("Số lượng bài viết phải là số hợp lệ lớn hơn 0");
      } else {
        resolve();
      }
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  function areDatesEqual(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    return date1.getTime() === date2.getTime();
  }

  const onFinish = () => {
    var formData = form.getFieldValue();
    let isValid = true;

    if (areDatesEqual(formatDate(fromDateNew), formatDate(toDateNew))) {
      isValid = false;
      message.error("Ngày bắt đầu và ngày kết thúc không được giống nhau.");
    }

    if (!formData.name.trim()) {
      isValid = false;
      message.error("Tên đợt đăng kí không được trống");
    } else if (formData.name.length < 6) {
      isValid = false;
      message.error("Tên đợt đăng ký tối thiểu 6 kí tự");
    }
    // else if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\/]/.test(formData.name)) {
    //   isValid = false;
    //   message.error("Tên đợt đăng ký không được chứa kí tự đặc biệt");
    // }

    if (!fromDateNew || !toDateNew) {
      isValid = false;
      message.error("Thời gian đợt đăng kí không hợp lệ");
    }
    const regex = /^[0-9]+$/;
    const parsedNumberArticles = parseFloat(formData.numberArticles);
    if (!formData.numberArticles) {
      isValid = false;
      message.error("Số lượng bài viết không được bỏ trống");
    } else if (isNaN(parsedNumberArticles)) {
      isValid = false;
      message.error("Số lượng bài viết phải là số");
    } else if (parsedNumberArticles <= 0) {
      isValid = false;
      message.error("Số lượng bài viết phải lớn hơn 0");
    } else if (
      !regex.test(formData.numberArticles) ||
      formData.numberArticles === 0
    ) {
      isValid = false;
      message.error("Vui lòng nhập một số nguyên dương");
    }
    const data = {
      name: `Đợt ${moment(fromDateNew).format("DD/MM/YYYY")} - ${moment(
        toDateNew
      ).format("DD/MM/YYYY")}`,
      numberArticles: parseFloat(formData.numberArticles),
      status: formData.status,
      fromDate: fromDateNew,
      toDate: toDateNew,
    };

    if (isValid) {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn cập nhật đợt đăng ký?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          CensorRegistrationPeriodAPI.update(data, id)
            .then((response) => {
              fetchData();
              message.success("Thành công!");
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
    }
  };

  const onFinishFailed = () => {
    message.error("Error, please reinform!!");
  };

  const handleButtonCloseClick = () => {
    CensorRegistrationPeriodAPI.close({}, id)
      .then((response) => {
        fetchData();
        message.success("Thành công!");
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
  };

  return (
    <>
      {showModal && (
        <ModalRegistration
          modalOpen={showModal}
          setModalOpen={setShowModal}
          width={1200}
          id={id}
          numberAll={
            registrationPeriod.numberArticles - registrationPeriod.restNumber
          }
        />
      )}

      <Card className="px-10 pt-5">
        <h1
          style={{ fontSize: "22px", marginTop: "-20px", textAlign: "center" }}
        >
          ĐỢT ĐĂNG KÝ:{" "}
          {registrationPeriod.name ? registrationPeriod.name.toUpperCase() : ""}
        </h1>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelAlign="left"
          form={form}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <Form.Item label="Mã đợt đăng ký" name="code">
                <Input
                  readOnly
                  style={{
                    marginLeft: "10px",
                    width: "300px",
                    fontWeight: "bold",
                  }}
                />
              </Form.Item>
              <Form.Item label="Tên đợt đăng ký" name="name">
                <Input
                  disabled
                  style={{ marginLeft: "10px", width: "300px" }}
                />
              </Form.Item>

              <Form.Item label="Thời gian">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <RangePicker
                    style={{
                      marginLeft: "50px",
                      width: "300px",
                      height: "40px",
                    }}
                    value={[dayjs(fromDateNew), dayjs(toDateNew)]}
                    renderExtraFooter={() => "Enter date"}
                    onChange={handleDateChange}
                  />
                </Space>
              </Form.Item>
              {/* <Form.Item label="Status" name="status">
                <Input
                  readOnly
                  style={{
                    marginLeft: "70px",
                    width: "300px",
                    fontWeight: "bold",
                  }}
                />
              </Form.Item> */}
            </div>
            <div>
              <Form.Item
                label="Số lượng bài viết quy định trong kỳ"
                name="numberArticles"
                rules={[
                  {
                    required: true,
                    message: "Số lượng bài viết không được trống",
                  },

                  {
                    validator: validateNumberArticles,
                  },
                ]}
              >
                <Input style={{ marginLeft: "30px" }} type="number" max={100} />
              </Form.Item>
              <Form.Item label="Số lượng bài viết đã giao">
                <label style={{ paddingLeft: "95px" }}>
                  {registrationPeriod.restNumber} Bài
                </label>
              </Form.Item>
              <Form.Item label="Số lượng bài viết chưa giao">
                <label style={{ paddingLeft: "85px" }}>
                  {registrationPeriod.numberArticles -
                    registrationPeriod.restNumber <
                    0 && "Dư"}{" "}
                  {Math.abs(
                    registrationPeriod.numberArticles -
                      registrationPeriod.restNumber
                  )}{" "}
                  bài
                </label>
              </Form.Item>
            </div>
          </div>
        <Row className="justify-center">
          {registrationPeriod.registrationPeriodStatus === "ACTIVE" ? (
            <>
                <Button
                  type="primary"
                  className="searchButton1  mx-1"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Thêm giảng viên vào đợt
                </Button>
                <Button
                  type="primary"
                  className="searchButton1  mx-1"
                  // htmlType="button"
                  onClick={() => {
                    if (
                      registrationPeriod.registrationPeriodStatus !== "INACTIVE"
                    ) {
                      onFinish();
                    }
                  }}
                >
                  Cập nhật đợt
                </Button>
                <Button
                  type="primary"
                  className="searchButton1  mx-1"
                  onClick={() => {
                    if (
                      registrationPeriod.registrationPeriodStatus !== "INACTIVE"
                    ) {
                      Modal.confirm({
                        title: "Xác nhận cập nhật",
                        content: "Bạn có chắc chắn muốn đóng đợt không?",
                        okText: "Đồng ý",
                        cancelText: "Hủy",
                        onOk() {
                          handleButtonCloseClick();
                        },
                      });
                    }
                  }}
                >
                  Đóng đợt
                </Button>
                <Link type="link" to={`/censor/registration-period`}>
                  <Button
                    type="primary"
                    className="searchButton1  mx-1"
                  >
                    Quay lại
                  </Button>
                </Link>
            </>
          ) : (
              <Link type="link" to={`/censor/registration-period`}>
                <Button
                  type="primary"
                  className="searchButton1  mx-1"
                >
                  Quay lại
                </Button>
              </Link>
            )}
        </Row>
        </Form>
      </Card>
      <Card className="mt-12">
        <TableRegistration
          check={registrationPeriod.registrationPeriodStatus === "INACTIVE"}
          numberAll={
            registrationPeriod.numberArticles - registrationPeriod.restNumber
          }
        />
      </Card>
    </>
  );
}
