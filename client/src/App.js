import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Panel,
} from 'reactflow';

import { initialNodes, initialEdges } from './nodes-edges';
import ContextMenu from './ContextMenu';

import InfoNode from './InfoNode';

import 'reactflow/dist/style.css';
import './style.css';

const nodeTypes = {
  infoNode: InfoNode,
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const yPos = useRef(0);

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [setEdges],
  );
  
  const onNodeDoubleClick = useCallback((event, node) => {
    yPos.current += 50;
    setNodes((nds) => nds.concat({
      id: `${Math.random()}`,
      type: 'infoNode',
      position: { x: 100, y: yPos.current },
      data: {testProp: node.data.testProp, testProp2: node.data.testProp2},
    }));
    console.log('dblClick', node);
  }, [setNodes]);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        testProp: node.testProp,
        testProp2: node.testProp2,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu],
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      onNodeDoubleClick={onNodeDoubleClick}
      nodeTypes={nodeTypes}
      fitView
    >
      <Panel position="topleft">
          <h3>Node Toolbar position:</h3>
      </Panel>
      <MiniMap />
      <Background />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  );
};

export default Flow;
