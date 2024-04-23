import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
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

const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;

const BuGames = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const { setViewport } = useReactFlow();
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

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'Added node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      onInit={setRfInstance}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      onNodeDoubleClick={onNodeDoubleClick}
      nodeTypes={nodeTypes}
      fitView
    >
      <Panel position="top-left">
          <button onClick={onSave}>save</button>
          <button onClick={onRestore}>restore</button>
          <button onClick={onAdd}>add node</button>
      </Panel>
      <MiniMap />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <BuGames />
  </ReactFlowProvider>
);
