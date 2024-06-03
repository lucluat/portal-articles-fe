import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Card, Row, message, Modal, Tooltip } from "antd";
import {
  CloudUploadOutlined,
  ImportOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import {
  AddArticles,
  UpdateArticles,
} from "../../../app/reducers/articles/articles.reducer";
import { getStompClient } from "../../../apis/stomp-client/config";
import { ImportArticle } from "../../../apis/user/auth/article/document.api";
import Dragger from "antd/es/upload/Dragger";
import React from "react";
import ModalForm from "./ArticleForm";
import { useLocation } from "react-router-dom";

const Texteditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const config = {
    globalFullSize: false,
    fullSize: false,
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ["source", "fullsize", "print", "about"],
    toolbarButtonSize: "middle",
    theme: "default",
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 400,
    direction: "ltr",
    language: "en",
    debugLanguage: false,
    i18n: "en",
    tabIndex: -1,
    toolbar: true,
    enter: "P",
    useSplitMode: false,
    colorPickerDefaultTab: "background",
    imageDefaultWidth: 400,
    removeButtons: [],
    disablePlugins: ["paste", "stat", "source"],
    events: {},
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    placeholder: "",
    showXPathInStatusbar: false,
  };

  const processText = (text) => {
    const strippedText = text
      .replace(/<\/?[^>]+(>|$)/g, " ")
      .replace(/(&nbsp;)+/g, " ");
    const words = strippedText.split(" ");
    const first60Words = words.slice(0, 60);
    const first60WordsString = first60Words.join(" ");
    return first60WordsString;
  };

  // useEffect(() => {
  //   connectStompClient();
  // }, []);

  const stompClient = getStompClient();

  const sendMessagesSequentially = async () => {
    try {
      stompClient.send("/action/create-notification-censor");
      console.log("Sent create-notification-censor");

      stompClient.send("/action/create-number-article-censor");
      console.log("Sent create-number-article-censor");

      stompClient.send("/action/get-article", {}, {});
      console.log("Sent get-article");

      console.log("All messages sent successfully!");
    } catch (error) {
      console.error("Error during sending messages:", error);
    }
  };

  const handlePublish = (data) => {
    if (location.pathname.includes("create-article")) {
      Modal.confirm({
        title: "Xác nhận gửi yêu cầu phê duyệt?",
        content: "Bạn có chắc chắn muốn gửi yêu cầu phê duyệt?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          // Người dùng đã nhấn OK
          MyArticleAPI.createArticleToCensor(data)
            .then(() => {
              sendMessagesSequentially();
              navigate("/user/my-article");
              message.success("Gửi yêu cầu phê duyệt thành công!");
            })
            .catch((error) => {
              console.log(error);
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                message.error(error.response.data.message);
              }
            });
        },
      });
    } else {
      Modal.confirm({
        title: "Xác nhận gửi yêu cầu phê duyệt?",
        content: "Bạn có chắc chắn muốn gửi yêu cầu phê duyệt?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          MyArticleAPI.updateArticleTCensor(data, id)
            .then((result) => {
              sendMessagesSequentially();
              dispatch(UpdateArticles(result.data.data));
              navigate("/user/my-article");
              message.success("Gửi yêu cầu phê duyệt thành công!");
            })
            .catch((error) => {
              if (
                error.response &&
                error.response.data &&
                error.response.data.message
              ) {
                message.error(error.response.data.message);
              }
            });
        },
      });
    }
  };
  const handleSave = async (data) => {
    try {
      if (location.pathname.includes("create-article")) {
        Modal.confirm({
          title: "Xác nhận tạo bản nháp?",
          content: "Bạn có chắc chắn muốn tạo bản nháp?",
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => {
            MyArticleAPI.createDraftArticle(data).then((result) => {
              dispatch(AddArticles(result.data.data));
              navigate(`/user/my-article`);
              message.success("Đã lưu bản nháp thành công!");
            });
          },
        });
      } else {
        Modal.confirm({
          title: "Xác nhận cập nhật bản nháp?",
          content: "Bạn có chắc chắn muốn cập nhật bản nháp?",
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => {
            MyArticleAPI.updateDraftArticle(data, id).then((result) => {
              dispatch(UpdateArticles(result.data.data));
              navigate(`/user/my-article`);
              message.success("Đã cập nhật bản nháp thành công!");
            });
          },
        });
      }
    } catch (error) {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      }
    }
  };

  const [modalData, setModalData] = useState({});

  const location = useLocation(); // Sử dụng useLocation để lấy thông tin về đường dẫn URL

  useEffect(() => {
    if (location.pathname.includes("create-article")) {
      // console.log("Đường dẫn là 'create-article', xóa form");
      setModalData({
        title: "",
        hashtags: [],
        idRegistration: "",
      });
      setContent("");
    } else {
      // console.log("Đường dẫn không phải 'create-article', gọi API");
      MyArticleAPI.detailMyArticle(id)
        .then((result) => {
          const { idRegistration, title, hashtags, content, previewImage } =
            result.data.data;
          const modalData = {
            title: title,
            content: content,
          };

          if (hashtags != null) {
            modalData.hashtags = hashtags.split(", ");
          }

          if (idRegistration != null) {
            modalData.idRegistration = idRegistration;
          }

          modalData.previewImage = previewImage;

          setModalData(modalData);
          setContent(content);
        })
        .catch((error) => {
          setModalData({
            title: "",
            hashtags: [],
            idRegistration: "",
          });
          setContent("");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Thêm location.pathname vào mảng dependencies của useEffect

  const onFinish = () => {
    if (fileList.length === 0) {
      message.error("Chưa có file nào được chọn");
    } else {
      handleOk();
      const formData = new FormData();
      formData.append("file", fileList[0]);
      ImportArticle.importData(formData)
        .then((response) => {
          setContent(response.data);
          message.success("Tải tệp DOCX lên thành công");
        })
        .catch((error) => {
          message.error("Lỗi khi tải tệp lên");
        });
      setFileList([]);
    }
  };
  const checkFile = (request) => {
    // Kiểm tra loại tệp
    if (request.file.size <= 0) {
      message.error("Yêu cầu không nhập file rỗng");
      setFileList([]);
      return;
    }
    if (request.file.size > 10000000) {
      message.error("Yêu cầu file không được quá 10MB");
      setFileList([]);
      return;
    }
    if (!request.file.name.includes(".docx")) {
      message.error("Vui lòng chọn một tệp DOCX.");
      setFileList([]);
      return;
    }
    setFileList([request.file]);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    setFileList([]);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setFileList([]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setFileList([]);
  };

  const [isModalOpenArticle, setIsModalOpenArticle] = useState(false);

  const checkCommonConditions = (data) => {
    if (
      content.trim().length === 0 ||
      content.trim().replace(/<p>|<\/p>|<br>|&nbsp;|\s+/gi, "").length === 0 ||
      content == null ||
      !content
    ) {
      message.error("Nội dung không được trống");
      return false;
    }
    if (
      content.trim().length < 6 ||
      content.trim().replace(/<p>|<\/p>|<br>|&nbsp;|\s+/gi, "").length < 6
    ) {
      message.error("Nội dung không được nhỏ hơn 6 kí tự");
      return false;
    }
    return true;
  };

  const handleModalOk = (data) => {
    if (data.isChoose === "draft") {
      if (!checkCommonConditions(data)) {
        return;
      }

      const descriptive = processText(content);
      const dataConvert = {
        title: data.title,
        hashtag: data.hashtags,
        content: content,
        descriptive: descriptive,
        idRegistrationPeriod: data.registrationPeriodId,
        previewImage: data.previewImage,
      };

      handleSave(dataConvert);
    }

    if (data.isChoose === "public") {
      if (!checkCommonConditions(data)) {
        return;
      }

      if (
        data.registrationPeriodId === undefined ||
        data.registrationPeriodId === "" ||
        data.registrationPeriodId === null
      ) {
        message.error("Đợt đăng kí không được bỏ trống");
        return;
      }
      if (data.hashtags.length === 0) {
        message.error("Hashtags không được trống");
        return;
      }
      if (data.hashtags.length > 5) {
        message.error("Hashtags không được lớn hơn 5");
        return;
      }

      const descriptive = processText(content);
      const dataConvert = {
        title: data.title,
        hashtag: data.hashtags,
        content: content,
        descriptive: descriptive,
        idRegistrationPeriod: data.registrationPeriodId,
        previewImage: data.previewImage,
      };

      handlePublish(dataConvert);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpenArticle(false);
  };

  const showModalArticle = () => {
    setIsModalOpenArticle(true);
  };

  return (
    <Card
      title="Tạo bài viết"
      extra={
        <>
          <Row>
            {/* Modal thêm từ file  */}
            <Modal
              title="Tải lên file"
              open={isModalOpen}
              cancelText="Đóng"
              okText="Tải lên"
              onOk={onFinish}
              onCancel={handleCancel}>
              <>
                <hr className="border-0 bg-gray-300 mt-3 mb-6" />

                <Dragger
                  multiple={false}
                  maxCount={1}
                  customRequest={checkFile}
                  fileList={fileList}
                  // showUploadList={false} // Ẩn danh sách tệp đã tải lên
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Nhấn hoặc kéo tệp vào khu vực này để tải lên
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải một file có đuôi .docx, nhỏ hơn 10MB. Xin cảm ơn!
                    😊😊😊
                  </p>
                </Dragger>
              </>
            </Modal>
            <Tooltip title="Tải lên bản docx">
              <button
                className="header_card_button mr-3"
                onClick={showModal}>
                <ImportOutlined /> Tải lên
              </button>
            </Tooltip>
            <Tooltip title="Đăng bài">
              <button
                className="header_card_button"
                onClick={showModalArticle}>
                <CloudUploadOutlined /> Đăng bài
              </button>
            </Tooltip>
          </Row>
        </>
      }>
      <hr
        className="bg-orange-400 border-0 h-5"
        style={{ padding: "1px", margin: 0 }}
      />
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={handleContentChange}
      />
      {isModalOpenArticle && (
        <ModalForm
          visible={isModalOpenArticle}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          data={modalData}
          isUpdatePage={false}
        />
      )}
    </Card>
  );
};

export default Texteditor;
