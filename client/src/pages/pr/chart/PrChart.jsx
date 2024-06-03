import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Input,
    Pagination,
    Radio,
    Row,
    Select,
    Statistic,
    Table,
    Tooltip,
} from "antd";
import {
    CheckCircleOutlined,
    StarOutlined
} from "@ant-design/icons";
import * as ChartAPI from "./ChartAPI.js"


const PrChart = () => {
    const [registrationPeriod, setRegistrationPeriod] = useState([]);
    const [series, setSeries] = useState({
        daPheDuyet: 0,
        daGanSao: 0
    });

    const data = {
        series: [series.daPheDuyet, series.daGanSao],
        // series: [series.daPheDuyet - series.daGanSao, series.daGanSao],
        options: {
            labels: ['Số bài được chủ nhiệm bộ môn phê duyệt', 'Số bài được PR gắn sao']
        }
    };
    useEffect(() => {
        getAllRegistrationPeriod();
    }, []);

    const handleRegistrationPeriodChange = (registrationPeriod) => {
        if (registrationPeriod.value !== "") {
            ChartAPI.getDataChartByidRegistrationPeriod(registrationPeriod.value).then((response) => {
                setSeries(response.data.data);
            }).catch((er) => {
                console.log(er);
            });
        } else {
            setSeries({
                daPheDuyet: 0,
                daGanSao: 0
            });
        }
    };
    const getAllRegistrationPeriod = () => {
        ChartAPI.getAll().then((response) => {
            setRegistrationPeriod(response.data.data);
        });
    };
    return <>
        <div >
            <Row gutter={24}>
                <Col
                    xl={12}
                    lg={12}
                    sm={12}
                    md={24}
                    className="mb-6">
                    <Card bordered={false}>
                        <Statistic
                            title={<span>Bài viết được chủ nhiệm bộ môn phê duyệt</span>}
                            value={series.daPheDuyet?series.daPheDuyet:0}
                            valueStyle={{
                                color: "#3f8600",
                            }}
                            prefix={<CheckCircleOutlined />}
                            suffix="Bài"
                        />
                    </Card>
                </Col>
                <Col
                    xl={12}
                    lg={12}
                    sm={12}
                    md={24}
                    className="mb-6">
                    <Card bordered={false}>
                        <Statistic
                            title={<span>Số bài được PR gắn sao</span>}
                            value={series.daGanSao?series.daGanSao:0}
                            valueStyle={{
                                color: "#ffc82c",
                            }}
                            prefix={<StarOutlined />}
                            suffix="Bài"
                        />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Select
                        labelInValue
                        defaultValue={{
                            value: '',
                            label: 'Chọn đợt viết bài',
                        }}
                        style={{
                            width: "220px",
                        }}
                        onChange={handleRegistrationPeriodChange}
                        options={registrationPeriod?registrationPeriod.map((item) => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }):null}
                    />
                </Col>
                <Col xl={12}
                    lg={12}
                    sm={12}
                    md={24}
                    span={12} offset={6}
                    className="mb-6">
                    <div className="mixed-chart">
                        <ReactApexChart
                            options={data.options}
                            series={data.series}
                            type="pie"
                        // width="50%"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    </>
}
export default PrChart;