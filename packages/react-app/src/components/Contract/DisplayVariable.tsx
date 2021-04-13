/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Row, Col, Divider } from 'antd';
import tryToDisplay from './utils';

const { useState, useEffect, useCallback } = React;

interface DisplayVariableProps {
  functionInfo: {
    name: string;
    [key: string]: any;
  };
  refreshRequired: boolean;
  contractFunction(): Promise<any>,
  triggerRefresh(arg: boolean): void;
}

const DisplayVariable = ({ contractFunction, functionInfo, refreshRequired, triggerRefresh }: DisplayVariableProps) => {
  const [variable, setVariable] = useState<string>('');

  const refresh = useCallback(async () => {
    try {
      const funcResponse = await contractFunction();
      setVariable(funcResponse);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setVariable, contractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, contractFunction]);

  return (
    <div>
      <Row>
        <Col
          span={8}
          style={{
            textAlign: 'right',
            opacity: 0.333,
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          {functionInfo.name}
        </Col>
        <Col span={14}>
          <h2>{tryToDisplay(variable)}</h2>
        </Col>
        <Col span={2}>
          <h2>
            <a href="#" onClick={refresh}>
              🔄
            </a>
          </h2>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default DisplayVariable;
