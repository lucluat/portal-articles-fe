import { CloseCircleOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row, Tooltip, Typography } from "antd";
import JoditEditor from "jodit-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ArticleFirst = () => {
    const navigate = useNavigate();
    const content = "<h2>Xin chào tất cả các bạn, Module Quản lý bài viết giúp cho giảng viên có thể dễ dàng đăng bài, trao đổi kiến thức với nhau. Sinh viên cũng có thể dễ dàng xem những bài viết đã được phê duyệt của các giảng viên.</h2><p>Đầu tiên, nếu bạn là một Giảng viên. </p><ul><li>Bạn có thể viết bài tại mục tạo bài viết trên menu<br>Sau đó có thể gửi yêu cầu phê duyệt bài viết đến cho người phê duyệt hoặc có thể lưu thành bản nháp để có thể chỉnh sửa hoặc đăng bài sau.</li><li>Tại màn Bài viết của tôi, bạn có thể xem được thống kê số bài viết của mình, đợt đang tham gia hiện tại và top 5 bài viết của bạn được người khác yêu thích nhất. Có thể xem được các bài viết của mình theo từng trạng thái trong tab danh sách bài viết. Ngoài ra bạn còn có thể đăng lên ảnh đại diện, ảnh bìa và cập nhật tiểu sử để có thể thể hiện ra cá tính của mình.</li><li>Ở màn danh sách bài viết, bạn có thể xem được bài viết của các giảng viên khác, có thể like, hoặc thêm bài viết mà bạn yêu thích vào album.</li><li>Màn bài viết yêu thích và màn Lịch sử sẽ lưu trữ lại tất cả những bài viết mà bạn yêu thích và đã từng truy cập vào xem. Đương nhiên, bạn có thể xoá những bài viết đó khỏi danh sách yêu thích hoặc lịch sử truy cập bất cứ lúc nào.</li><li>Tại màn Album, bạn có thể tạo những album của riêng mình để có thể phân chia những bài viết theo thể loại và cách phân chia của riêng bạn.</li></ul><p>Thứ hai, nếu bạn là Người phê duyệt</p><ul><li>Màn Quản lý thể loại giúp bạn có thể quản lý được tất cả các thể loại mà bạn có thể gắn vào bài viết do giảng viên gửi yêu cầu phê duyệt</li><li>Tại màn Thống kê, bạn có thể xem được thống kê số bài viết của tất cả các giảng viên thuộc tất cả các thể loại</li><li>Ở màn Phê duyệt bài viết, bạn có thể xem được tất cả các bài viết mà giảng viên gửi yêu cầu tới để chờ phê duyệt. Tại đây, bạn có thể phê duyệt hoặc từ chối các bài viết đó.</li><li>Màn Danh sách giảng viên sẽ hiển thị danh sách tất cả các giảng viên tại cơ sở, giúp bạn có thể quản lý và giao việc viết bài cho các giảng viên.</li><li>Màn quản lý đợt đăng ký sẽ giúp bạn tạo những đợt viết bài, phân công số lượng bài viết của những giảng viên.</li><li>Tại màn Quản lý form gửi đào tạo, tại đây sẽ lưu trữ những form mà bạn dùng để gửi bài viết lên cho Phòng Đào tạo.</li><li>Màn Kho lưu trữ sẽ giúp bạn chuyển trạng thái của bài viết, gửi bài viết lên cho Phòng Đào tạo, tại đây bạn cũng có thể tải những bài viết đó về máy hoặc xem những bài viết đó trên driver</li><li>Ở màn Lịch sử phê duyệt, bạn có thể xem lại những bài viết bạn đã phê duyệt với timeline hiển thị tất cả lịch sử thay đổi của bài viết đó.</li></ul><p>Cuối cùng, nếu bạn là một Sinh viên vào đây để tiếp thu những kiến thức từ những bài viết do Giảng viên đăng thì xin chúc mừng bạn đã là một sinh viên của một trong những ngồi trường công nghệ hàng đầu Việt Nam. Nơi đây sẽ đào tạo bạn trở thành những sinh viên ưu tú, những người giúp cho đất nước ngày càng phát triển và phồn vinh</p><p><span>Trên đây là toàn bộ chi tiết về các màn với các quyền khác nhau tại Module Quản lý bài viết.&nbsp;</span></p><p><h3>Xin chân thành cám ơn và chúc các bạn có những giây phút sử dụng trang web thật vui vẻ.</h3></p><p><h3>Thân ái!!</h3></p></p>"

return(
        <div
      className="justify-items-center"
      style={{
        paddingTop: "130px",
        paddingLeft: "150px",
        paddingRight: "150px",
        paddingBottom: "150px",
      }}
    >
      <Card id="iconDetailArticl" className=" bg-white rounded-lg pt-5">
        <Row>
          <Col span={23}>
            <div className="flex ">
              <Typography className="category1" variant="subtitle1">
                Hướng dẫn sử dụng
              </Typography>
              <Typography
                variant="subtitle1"
                className="category2"
                style={{ marginLeft: "10px" }}
              >
                Article Project
              </Typography>
            </div>
          </Col>
          <Col span={1}>
            <div
              style={{
                float: "right",
              }}
            >
                <Tooltip title={"Quay lại"}>
                  <CloseCircleOutlined style={{ fontSize: "20px" }} 
                  onClick={() => navigate(`/home`)}
                  />
                </Tooltip>
            </div>
          </Col>
        </Row>
        <div>
          {/* Tiêu đề bài viết */}
          <h3
            className="text-5xl text-slate-900 font-bold not-italic"
            style={{ overflowWrap: "break-word" }}
          >
            HƯỚNG DẪN SỬ DỤNG MODULE QUẢN LÝ BÀI VIẾT
          </h3>
        </div>
        <div className="flex justify-between ">
          <div className="flex">
            <Avatar 
            src={"https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/3d/3a/6a/3d3a6ae4-96f8-1cf3-f506-0ebd233c41e2/source/512x512bb.jpg"}
             style={{ width: "60px", height: "60px" }} />
            <div className="ml-3">
              <div className="flex">
                <Typography variant="subtitle1" className="name1">
                  Fpt Polytechnic
                </Typography>
              </div>
              <span>{moment(new Date()).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <JoditEditor
            value={content}
            tabIndex={-1}
            config={{
              readonly: true,
              toolbar: false,
              showCharsCounter: false,
              showWordsCounter: false,
              showStatusbar: true,
              showPoweredBy: false,
              className: "view_editor_jodit",
              style: {
                backgroundColor: "#ffffff",
                border: "none",
              },
            }}
          />
        </div>
      </Card>
    </div>
    );
}

export default ArticleFirst;