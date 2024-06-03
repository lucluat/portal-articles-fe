import { DatePicker, Space, Form, Input, Modal, message } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import { SetRegistrationPeriod } from "../../../app/reducers/registration-period/registration-period.reducer";
import "./index.css";
const ModalThem = (props) => {
  const { modalOpen, setModalOpen, category } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [name, setName] = useState("");
  const [numberArticles, setNumberArticles] = useState(null);
  const { RangePicker } = DatePicker;

  if (category) {
    form.setFieldsValue(category);
  }

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

  //"Đợt "+ formatDate(fromDate) + " - " + formatDate(toDate)
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [fromDate, toDate] = dates;
      setFromDate(fromDate.valueOf());
      setToDate(toDate.valueOf());
      setName("Đợt " + formatDate(fromDate) + " - " + formatDate(toDate));
    } else {
      setFromDate(null); // Đặt giá trị ngày thành null nếu không có ngày được chọn
      setToDate(null);
    }
  };

  const handleInputChange = (e) => {
    setNumberArticles(e.target.value);
    form.setFieldsValue({ numberArticles: e.target.value }); // Cập nhật giá trị trong form
  };

  const fetchData = () => {
    const data = {
      search: "",
      fromDate: new Date(null).getTime(),
      toDate: new Date(null).getTime(),
      status: "",
      numberArticles: null,
      page: 0,
    };
    CensorRegistrationPeriodAPI.fetchAll(data).then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      // setCheck(true);
    });
  };

  const onFinish = () => {
    let isValid = true;

    if (areDatesEqual(formatDate(fromDate), formatDate(toDate))) {
      isValid = false;
      message.error("Ngày bắt đầu và ngày kết thúc không được giống nhau.");
    }

    if (!fromDate || !toDate) {
      isValid = false;
      message.error("Thời gian đợt đăng kí không được trống");
    }

    const parsedNumberArticles = parseInt(numberArticles);
    const regex = /^[0-9]+$/;
    if (!numberArticles) {
      isValid = false;
      message.error("Số lượng bài viết không được bỏ trống");
    } else if (isNaN(parsedNumberArticles)) {
      isValid = false;
      message.error("Số lượng bài viết phải là số");
    } else if (parsedNumberArticles <= 0) {
      isValid = false;
      message.error("Số lượng bài viết phải lớn hơn 0");
    } else if (!regex.test(numberArticles) || numberArticles === 0) {
      isValid = false;
      message.error("Số lượng bài viết phải là số nguyên dương");
    }

    const data = {
      name: name,
      fromDate: fromDate,
      toDate: toDate,
      numberArticles: parsedNumberArticles,
    };
    if (isValid) {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn thêm đợt đăng ký không?",
        onOk: () => {
          console.log("Data đăng ký đợt: ",{data});
          CensorRegistrationPeriodAPI.create(data)
          .then((result) => {
            fetchData();
            message.success("Thành công!");
            setModalOpen(false);
            form.setFieldValue(null);
          })
          .catch((error) => {
            console.log("Lỗi: ",{error});
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
        }
      })

      // .finally(() => {
      //   setSubmitLoading(false); // Tắt trạng thái "loading" sau khi hoàn thành
      // });
    }
  };
  const onFinishFailed = () => {
    message.error("Error, please reinform!!");
  };
  const onCancel = () => {
    setModalOpen(false);
    form.setFieldValue(null);
  };

  return (
    <>
      <Modal
        title="Tạo đợt đăng ký"
        open={modalOpen}
        onCancel={onCancel}
        footer={null}
      >
        <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            // maxWidth: 600,
            marginRight: "20px",
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item label="Tên">
            <Input name="name" value={name} disabled />
          </Form.Item>
          <Form.Item label="Thời gian" style={{ width: "100%" }}>
            <Space direction="vertical">
              <RangePicker
                style={{ height: "40px", width: "339px" }}
                renderExtraFooter={() => "Chọn ngày"}
                onChange={handleDateChange}
                format={"DD/MM/YYYY HH:mm:ss"}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              />
            </Space>
          </Form.Item>

          <Form.Item
            label="Số lượng bài viết"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              name="numberArticles"
              value={numberArticles}
              onChange={handleInputChange}
              type="number"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <button onClick={onCancel} className="submit-button">
              Đóng
            </button>
            <button htmltype="submit" className="submit-button ml-2">
              Thêm
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalThem;
