import { FilterFilled } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React from 'react';

const FormSearch = ({children}) => {
    return (
        <Card className="mb-2">
          <Row>
                <Col span={24}>
                    <h1 className="text-xl m-0" style={{color: '#393536'}}><FilterFilled className='mr-2' />Bộ lọc</h1>
                    <hr className="border-0 bg-gray-300 mt-3 mb-3" />
                </Col>
          </Row>
            {children}
        </Card>
    );
};

export default FormSearch;