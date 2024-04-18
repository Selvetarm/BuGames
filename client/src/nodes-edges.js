import jsonData from './data.json'

const nodesElements = jsonData.$Model.$application.elements;
const s1Elements = nodesElements.S1.elements;
const s2Elements = nodesElements.S2.elements;
console.log(nodesElements);


export const initialNodes = [
    { id: 's1', type: 'infoNode', position: { x: 0, y: 0 },   data: { label:'S1', elements: s1Elements}},
    { id: 's2', type: 'infoNode', position: { x: 400, y: 0 }, data: { label:'S2', elements: s2Elements}},
];

  export const initialEdges = [
    {
      id: 'e1-2',
      source: 's1',
      target: 's2',
    },
  ];

  export default { initialNodes, initialEdges };
  