import React from "react";
import {
  Avatar,
  Button,
  Col,
  Row,
  Space,
  Modal,
  Typography,
  Select,
  Tooltip,
  Popconfirm,
} from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import { UpdateArticles } from "../../../app/reducers/articles/articles.reducer";
import { useAppDispatch } from "../../../app/hooks";
import { message } from "antd";

import { getStompClient } from "../../../apis/stomp-client/config";
import TextArea from "antd/es/input/TextArea";
import { SetCountArticle } from "../../../app/reducers/articles/count-article.reducer";
import ModalThem from "./ModalAddCategory";

const DetaiConsorArticle = () => {
  const navigate = useNavigate();
  const [detailArticle, setDetailArticle] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [approvalText, setApprovalText] = useState("Đã đạt yêu cầu");
  const [refuseText, setRefuseText] = useState("Chưa đạt yêu cầu");
  const [modal2Open, setModal2Open] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isApprovalTextValid, setIsApprovalTextValid] = useState(true);
  const [isRefuseTextValid, setIsRefuseTextValid] = useState(true);
  const [idUser, setIdUser] = useState("");

  // useEffect(() => {
  //   connectStompClient();
  // });

  const stompClient = getStompClient();

  useEffect(() => {
    const fetchListCategory = async () => {
      const response1 = await CategoryAPI.fetchAllCategory();
      setListCategory(response1.data.data);
    };
    fetchListCategory();
  }, []);

  useEffect(() => {
    const fetchDetailArticles = async () => {
      const response = await CensorAPI.getOne(id);
      setDetailArticle(response.data.data);
      setIdUser(response.data.data.userId);
    };
    fetchDetailArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTextApproval = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/\s+/g, " ");
    setApprovalText(formattedValue);
    setIsApprovalTextValid(e.target.value.trim().length >= 6);
  };

  const onChangeTextRefuse = (e) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/\s+/g, " ");
    setRefuseText(formattedValue);
    setIsRefuseTextValid(e.target.value.trim() !== "");
  };

  const onChangeSelect = (value) => {
    setSelectedCategory(value);
    setIsCategorySelected(value !== null);
  };

  const handleApproval = () => {
    if (!isCategorySelected) {
      message.error("Vui lòng chọn thể loại trước khi phê duyệt.");
      return;
    }

    if (!isApprovalTextValid) {
      message.error("Nhận xét phải có ít nhất 6 kí tự");
      return;
    }

    const dataApproval = {
      id: id,
      categoryId: selectedCategory,
      feedback: approvalText,
    };

    CensorAPI.approveArticle(dataApproval).then((result) => {
      if (result.status === 201) {
        message.error(
          "Bài viết này không thể phê duyệt. Vui lòng kiểm tra lại!!!"
        );
        navigate("/censor/article");
      } else {
        dispatch(UpdateArticles(result.data.data));
        stompClient.send("/action/create-notification-user/" + idUser);
        setModal1Open(false);
        navigate("/censor/article");
        message.success("Phê duyệt thành công!");

        CensorAPI.countApprovedArticle({}).then((response) => {
          dispatch(SetCountArticle(response.data.data));
        });
      }
    });
  };

  const handleRefuse = () => {
    if (!isRefuseTextValid) {
      message.error("Vui lòng nhập nhận xét trước khi từ chối bài viết.");
      return;
    }

    const dataRefuse = {
      id: id,
      feedback: refuseText,
    };
    CensorAPI.refuseArticle(dataRefuse).then((result) => {
      if (result.status === 201) {
        message.error(
          "Bài viết này không thể từ chối. Vui lòng kiểm tra lại!!!"
        );
        navigate("/censor/article");
      } else {
        dispatch(UpdateArticles(result.data.data));
        stompClient.send("/action/create-notification-user/" + idUser);
        setModal2Open(false);
        message.success("Bài viết đã bị từ chối!");
        navigate("/censor/article");

        CensorAPI.countApprovedArticle({}).then((response) => {
          dispatch(SetCountArticle(response.data.data));
        });
      }
    });
  };

  const handleSaveCategory = (newCategory) => {
    setListCategory([newCategory, ...listCategory]);
  };
  return (
    <>
      <div className="justify-items-center bg-white -mt-2 rounded-md">
        {/* open model */}
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}>
          <button
            className="header_card_button mr-3"
            style={{ marginRight: "20px" }}
            onClick={() => setModal1Open(true)}>
            Phê duyệt
          </button>
          <Modal
            title={
              <>
                <p style={{ fontSize: "16px" }}>Phê duyệt bài viết</p>
                <hr className="border-0 bg-gray-300 mb-6" />
              </>
            }
            style={{
              top: 20,
            }}
            open={modal1Open}
            footer={
              <>
                <Button
                  danger
                  onClick={() => setModal1Open(false)}>
                  Hủy bỏ
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn phê duyệt?"
                  onConfirm={handleApproval}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  className="ok">
                  <Button>Xác nhận</Button>
                </Popconfirm>
              </>
            }
            onCancel={() => setModal1Open(false)}>
            {showModal && (
              <ModalThem
                modalOpen={showModal}
                setModalOpen={setShowModal}
                category={detailCategory}
                SetCategory={setDetailCategory}
                isSendArticle={true}
                onSave={handleSaveCategory}
              />
            )}

            {/* select category */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "25px",
                marginTop: "15px",
              }}>
              <Select
                style={{ width: "100%" }}
                showSearch
                size="large"
                placeholder="Thể loại"
                optionFilterProp="children"
                onChange={onChangeSelect}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={listCategory.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
              <div style={{ marginLeft: "5px" }}>
                <div className="flex flex-row-reverse">
                  <div>
                    <span>
                      <Tooltip title="Thêm thể loại">
                        <button
                          style={{ height: "40px" }}
                          className="header_card_button"
                          onClick={() => {
                            setShowModal(true);
                            setDetailCategory(null);
                          }}>
                          <PlusOutlined className="mr-1" />
                        </button>
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* input text phê duyệt */}
            <TextArea
              autoSize={{ minRows: 5, maxRows: 20 }}
              style={{
                height: 120,
                marginBottom: 24,
              }}
              onChange={onChangeTextApproval}
              defaultValue={"Đã đạt yêu cầu"}
              value={approvalText}
            />
          </Modal>
          <button
            className="header_card_button mr-3"
            onClick={() => setModal2Open(true)}>
            Từ chối
          </button>
          <Modal
            title={
              <>
                <p style={{ fontSize: "16px" }}>Từ chối bài viết</p>
                <hr className="border-0 bg-gray-300 mb-6" />
              </>
            }
            style={{
              top: 20,
            }}
            open={modal2Open}
            onOk={handleRefuse}
            onCancel={() => setModal2Open(false)}>
            <TextArea
              autoSize={{ minRows: 5, maxRows: 20 }}
              style={{
                height: 120,
                marginBottom: 24,
              }}
              onChange={onChangeTextRefuse}
              defaultValue={"Chưa đạt yêu cầu"}
              value={refuseText}
            />
          </Modal>
          <div
            style={{
              float: "right",
            }}>
            <Link
              type="link"
              to={`/censor/article`}
              style={{ right: 0, color: "gray" }}>
              <Tooltip title={"Quay lại"}>
                <CloseCircleOutlined style={{ fontSize: "20px" }} />
              </Tooltip>
            </Link>
          </div>
          {/* detail bài viết */}
          <Row>
            <Col span={24}>
              <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8 work-break">
                {detailArticle.title}
              </h1>
              <div className="flex">
                <Avatar
                  src={detailArticle.img}
                  style={{ width: "50px", height: "50px" }}
                />

                <div className="ml-3">
                  <div className="flex">
                    <Typography
                      variant="subtitle1"
                      className="name1">
                      {detailArticle.name}
                    </Typography>
                  </div>
                  <span>
                    {moment(detailArticle.createdDate).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              <div>
                <JoditEditor
                  value={detailArticle.content}
                  tabIndex={-1}
                  className="bg-transparent"
                  config={{
                    readonly: true,
                    toolbar: false,
                    showCharsCounter: false,
                    showWordsCounter: false,
                    showStatusbar: true,
                    showPoweredBy: false,
                  }}
                />
              </div>
              <Row>
                <div className=" float-left pt-5 pb-10">
                  <Space
                    size={[0, 8]}
                    wrap></Space>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default DetaiConsorArticle;
