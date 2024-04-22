import React, { memo } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import {
  Handle,
  Position,
} from 'reactflow';

const Card = styled.div`
  border: 1px solid #000000;
`
const Panel = styled.div`
  width: 300px;
  text-align: left;
`

const PanelHeading = styled.div`
  background-color: #000000;
  color: #ffffff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const ToggleButtonWrapper = styled.div`
  transform: ${props => props.isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'}
`

const PanelContent = styled.div`
  border: 1px solid #000000;
  border-top: none;
  padding: 0 20px;
  color: #000000;
  overflow: hidden;
  height: ${props => props.isCollapsed ? 0 : 'auto'};
`

const PanelContentInner = styled.div`
  padding: 20px 0;
`

export default memo((node) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true)

  const togglePanel = () => {
    setIsCollapsed(prevState => !prevState)
  }

  console.log(node.data.elements);

  return (
    <Card>
    <div>{node.data.label}</div>

    <Panel>
      <PanelHeading onClick={togglePanel}>
        <span>Дополнительно</span>
        <ToggleButtonWrapper isCollapsed={isCollapsed}>
          <FontAwesomeIcon icon={faChevronCircleDown} />
        </ToggleButtonWrapper>
      </PanelHeading>
      <PanelContent isCollapsed={isCollapsed}>
        <PanelContentInner>
        {/*{Object.entries(node.data.elements).map(([key, subject], i) => (
          <li className="travelcompany-input" key={i}>
              <span className="input-label">key: {i} Name: {subject.name}</span>
          </li>
        ))}*/}
        </PanelContentInner>
      </PanelContent>
    </Panel>

    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#555' }}
      onConnect={(params) => console.log('handle onConnect', params)}

    />
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={{ background: '#555'}}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bh1"
      style={{ left: 10, background: '#555'}}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bh2"
      style={{left: 60, background: '#555'}}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bh3"
      style={{left: 110, background: '#555'}}
    />
  </Card>
  );
});