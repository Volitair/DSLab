'use strict';

const canvas = document.getElementById('c1');
const ctx = canvas.getContext('2d');
ctx.font = '20px Georgia';

const A = [
  [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
  [0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0]
];

const
  width = 1000,
  height = 1000,
  n = 12,
  multiplier = 0.8,
  radius = 40,
  kEvasion = 1.4,
  kLoop = 1.1,
  radiusLoop = 20,
  directedGraph = false,
  dAngle = Math.PI / 18;

const edges = new Map();
const loops = new Map();
const Vertices = new Map();
const arrowHeads = [];

const centerCalculate = (width, height) => {
  const x = width / 2;
  const y = height / 2;
  return { x, y };
};

const center = centerCalculate(width, height);

const coordinateVertex = (n, center) => {
  const xCenter = center.x;
  const yCenter = center.y;
  const dAngle = 2 * Math.PI / n;
  const radius = multiplier * Math.min(width, height) / 2;
  const vertexCoords = new Map();
  const angle = -1 * dAngle;
  //console.log(radius);
  for (let i = 1; i <= n; i++) {
    const dx = radius * Math.sin(angle + dAngle * i);
    const dy = radius * Math.cos(angle + dAngle * i);
    const x = xCenter + Math.floor(dx);
    const y = yCenter - Math.floor(dy);

    console.log({ i, dx, dy });
    console.log({ x, y });

    vertexCoords.set(i, { i, x, y });
  }
  return vertexCoords;
};

const vertexCoords = coordinateVertex(n, center);
//for (let i = 1; i <= n; i++) {
//  console.log(a.get(i))
//}
console.log(vertexCoords);

//function drawCircles(n, coords) {
//  for (let i = 1; i <= n; i++) {
//    const x = coords.get(i).x;
//    const y = coords.get(i).y;
//    ctx.fillStyle = 'black';
//    ctx.beginPath();
//    ctx.arc(x, y, radius, 0, 2 * Math.PI);
//    ctx.stroke();
//    // Fill text
//    ctx.fillStyle = 'black';
//    ctx.textAlign = 'center';
//    ctx.textBaseline = 'middle';
//    ctx.fillText(i, x, y);
//  }
//}
//
//drawCircles(n, a);

function TransMatrix(A) {
  const m = A.length, n = A[0].length, AT = [];
  for (let i = 0; i < n; i++) {
    AT[i] = [];
    for (let j = 0; j < m; j++) AT[i][j] = A[j][i];
  }
  return AT;
}

const AT = TransMatrix(A);

function SumMatrix(A, B) {
  const
    m = A.length,
    n = A[0].length,
    C = [];
  for (let i = 0; i < m; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++)
      if (A[i][j] === 1 || B[i][j] === 1) {
        C[i][j] = 1;
      } else {
        C[i][j] = A[i][j] + B[i][j];
      }
  }
  return C;
}

const symmetricA = SumMatrix(A, AT);
//console.log(A);
//console.log(AT);
//console.log(symmetricA);







//const mwdiam = new VERTEX({ x: 100, y: 200, i: 10 });
//mwdiam.draw();

//function distance(x1, y1, x2, y2) {
//  const res = Math.sqrt(Math.pow(x1 - x2 , 2) + Math.pow(y1 - y2, 2));
//  //console.log(res);
//  return res;
//};


class VERTEX {
  constructor(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.i = obj.i;
  }
  //get i() {
  //  return this.i;
  //}
  //get x() {
  //  return this.x;
  //}
  //get y() {
  //  return this.y;
  //}

  draw() {
    //console.log(this.i, this.x, this.y);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.stroke();
    // Fill text
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.i, this.x, this.y);
  }
}

class ArrowHead {
  constructor(vertexStart, vertexEnd, start, end) {
    this.start = start;
    this.end = end;
    this.startX = start.x;
    this.startY = start.y;
    this.endX = end.x;
    this.endY = end.y;
    //this.startI = vertexStart.i
    //this.endI = vertexEnd.i;
  }

  draw() {
    const lateralSide = 15;
    const arrowAngle = Math.PI / 8;
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x0 = this.endX;
    const y0 = this.endY;
    const x1 = x0 - lateralSide * Math.cos(angle + arrowAngle);
    const y1 = y0 - lateralSide * Math.sin(angle + arrowAngle);
    const x2 = x0 - lateralSide * Math.cos(angle - arrowAngle);
    const y2 = y0 - lateralSide * Math.sin(angle - arrowAngle);


    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
    ctx.stroke();
    //console.log('testarrow')
  }
}


class EDGE {
  constructor(objStart, objEnd) {
    this.vertexStart = objStart;
    this.vertexEnd = objEnd;
    this.startX = objStart.x;
    this.startY = objStart.y;
    this.endX = objEnd.x;
    this.endY = objEnd.y;
    this.startI = objStart.i;
    this.endI = objEnd.i;
    //this.dx = this.startX - this.endX;
    //this.dy = this.startY - this.endY;
    //this.angle = Math.atan2(this.dy,this.dx);
    //this.x1 = this.startX + radius * Math.sin(this.angle);
    //this.y1 = this.startY - radius * Math.cos(this.angle);
    //this.x2 = this.endX - radius * Math.sin(this.angle);
    //this.y2 = this.endY + radius * Math.cos(this.angle);

    // AX+By+C=0
    this.A = this.endY - this.startY;
    this.B = this.startX - this.endX;
    this.C = this.endX * this.startY - this.startX * this.endY;
  }

  draw() {
    //console.log({this.vertexStart,,
    //this.vertexEnd,
    //this.startX,
    //this.startY,
    //this.endX,
    //this.endY,
    //this.startI,
    //this.endI,});
    //const aaa = Math.PI / 16;
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx) + Math.PI;
    const x1 = this.startX + radius * Math.cos(angle);
    const y1 = this.startY + radius * Math.sin(angle);
    const x2 = this.endX - radius * Math.cos(angle);
    const y2 = this.endY - radius * Math.sin(angle);

    //console.log(dx, dy, angle, x1, y1, x2, y2);

    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

class DirectedEdge extends EDGE {
  draw() {
    //console.log({this.vertexStart,,
    //this.vertexEnd,
    //this.startX,
    //this.startY,
    //this.endX,
    //this.endY,
    //this.startI,
    //this.endI,});
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x1 = this.startX + radius * Math.cos(angle);
    const y1 = this.startY + radius * Math.sin(angle);
    const x2 = this.endX - radius * Math.cos(angle);
    const y2 = this.endY - radius * Math.sin(angle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };


    //console.log(dx, dy, angle, x1, y1, x2, y2);

    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
    }
  }
}

class ParallelDirectedEdge {
  constructor(objStart, objEnd, dAngle) {
    this.vertexStart = objStart;
    this.vertexEnd = objEnd;
    this.startX = objStart.x;
    this.startY = objStart.y;
    this.endX = objEnd.x;
    this.endY = objEnd.y;
    this.startI = objStart.i;
    this.endI = objEnd.i;
    this.dAngle = dAngle;
    this.A = this.endY - this.startY;
    this.B = this.startX - this.endX;
    this.C = this.endX * this.startY - this.startX * this.endY;
  }

  draw() {
    const dx = this.endX - this.startX;
    const dy = this.endY - this.startY;
    const angle = Math.atan2(dy, dx);
    const x1 = this.startX + radius * Math.cos(angle + this.dAngle);
    const y1 = this.startY + radius * Math.sin(angle + this.dAngle);
    const x2 = this.endX - radius * Math.cos(angle - this.dAngle);
    const y2 = this.endY - radius * Math.sin(angle - this.dAngle);
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };

    //console.log(dx, dy, angle, x1, y1, x2, y2);

    const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd);

    if (check === false) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
    }
  }
}

class EVASION_EDGE extends EDGE {
  draw() {
    //console.log({this.vertexStart,,
    //this.vertexEnd,
    //this.startX,
    //this.startY,
    //this.endX,
    //this.endY,
    //this.startI,
    //this.endI,});

    //const check = checkForTouch(this.A, this.B, this.C, this.vertexStart, this.vertexEnd)

    //if (check === false)


    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
    if (Vertices.has(this.vertexEnd.i)) {
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      const angle = Math.atan2(dy, dx);
      const x2 = this.endX - radius * Math.cos(angle);
      const y2 = this.endY - radius * Math.sin(angle);
      const startPoint = { x: this.startX, y: this.startY };
      const endPoint = { x: x2, y: y2 };
      //console.log(startPoint,endPoint)
      if (directedGraph === true) {
        arrowHeads.push(new ArrowHead(this.vertexStart, this.vertexEnd, startPoint, endPoint));
      }
    }
  }
}

class LOOP {
  constructor(obj) {
    this.vertex = obj;
    this.x = obj.x;
    this.y = obj.y;
  }

  draw() {
    const dx = center.x - this.x;
    const dy = center.y - this.y;
    const angle = Math.atan2(dy, dx);
    const xLoop = this.x - radius * kLoop * Math.cos(angle);
    const yLoop = this.y - radius * kLoop * Math.sin(angle);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(xLoop, yLoop, radiusLoop, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function checkForTouch(A, B, C, edgeStart, edgeEnd) {
  //console.log(A, B, C);
  for (const array of Vertices) {
    const vertex = array[1];
    const i = vertex.i;
    if (vertex === edgeStart || vertex === edgeEnd) continue;
    //console.log(vertex);
    const distance = Math.abs((A * vertex.x + B * vertex.y + C) / (Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2))));
    if (distance <= radius) {
      console.log('true');
      console.log(A, B, C, edgeStart, edgeEnd);
      console.log({ distance, i });
      evasionPoint(A, B, C, edgeStart, edgeEnd, vertex);
      return true;
    }
  }
  return false;
}

function evasionPoint(A, B, C, edgeStart, edgeEnd, vertex) {
  //const evasionPointX = (Math.pow(B,2) * vertex.x - B * A * vertex.y - A * C) / (Math.pow(A,2) + (Math.pow(B,2)));
  //const evasionPointY = (-1 * A * evasionPointX - C) / (B);
  //
  const edgeStartI = edgeStart.i;
  const edgeEndI = edgeEnd.i;
  const normalVectorLength = Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
  const directionCosX = A / normalVectorLength;
  const directionCosY = B / normalVectorLength;
  console.log(vertex.x, vertex.y);
  console.log({ directionCosX, directionCosY });
  const evasionPointX = vertex.x + (directionCosX * radius * kEvasion);
  const evasionPointY = vertex.y + (directionCosY * radius * kEvasion);
  const evasionPointObj = { x: evasionPointX, y: evasionPointY };
  console.log({ evasionPointX, evasionPointY });
  const evasionEdgeStart = new EVASION_EDGE(edgeStart, evasionPointObj);
  const evasionEdgeEnd = new EVASION_EDGE(evasionPointObj, edgeEnd);
  //const test = new VERTEX ({x:evasionPointX, y:evasionPointY, i:'test'}).draw();
  console.log({ evasionEdgeStart, evasionEdgeEnd });

  if (edges.has({ edgeStartI, edgeEndI })) {
    edges.get({ edgeStartI, edgeEndI }).push(evasionEdgeStart, evasionEdgeEnd);
  } else {
    edges.set({ edgeStartI, edgeEndI }, [evasionEdgeStart, evasionEdgeEnd]);
  }
  //console.log({evasionPointX,evasionPointY});

}


/////////////////////////////////////////


//const testobj = { x: 630, y: 400, i: radius };
//const testVertex = new VERTEX(testobj);
//const testobj2 = { x: 670, y: 500, i: radius };
//const testVertex2 = new VERTEX(testobj2);
//
//console.log(testVertex);
//Vertices.set(10000, testVertex).set(100002,testVertex2);

/////////////////////////////////////////


//const obj1 = Vertices.get(1);
//const obj5 = Vertices.get(5)
//
//const edge15 = new EDGE(obj1, obj5);
//console.log(edge15);
//edge15.draw();
//
//const edge111 = new EDGE(Vertices.get(1), Vertices.get(11));
//console.log(edge111);
//edge111.draw();

console.log(A);

for (const obj of vertexCoords) {
  const vertex = new VERTEX(obj[1]);
  Vertices.set(vertex.i, vertex);
  console.log(obj);
  console.log(vertex);
}


const createDirectedGraphElements = () => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] === 1) {
        if (i === j) {
          const v = Vertices.get(i + 1);
          const loop = new LOOP(v);
          loops.set(v, loop);
        } else if (A[i][j] === A[j][i]) {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          const parallelDirectedEdge = new ParallelDirectedEdge(vi, vj, dAngle);
          edges.set({ i, j }, parallelDirectedEdge);
        } else {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          //console.log(vi, vj);
          const directedEdge = new DirectedEdge(vi, vj);
          edges.set({ i, j }, directedEdge);
        }
      }
    }
  }
};

const createGraphElements = () => {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      if (symmetricA[i][j] === 1) {
        if (i === j) {
          const v = Vertices.get(i + 1);
          const loop = new LOOP(v);
          loops.set(v, loop);
        } else {
          const elementI = i + 1;
          const elementJ = j + 1;
          const vi = Vertices.get(elementI);
          const vj = Vertices.get(elementJ);
          //console.log(vi, vj);
          const edge = new EDGE(vi, vj);
          edges.set({ i, j }, edge);
        }
      }
    }
  }
};

if (directedGraph === true) {
  createDirectedGraphElements();
} else {
  createGraphElements();
}




console.log(edges);

for (const item of edges) {
  if (item[1] instanceof Array) {
    for (const i of item[1]) i.draw();
  } else item[1].draw();
}

console.log(loops);

for (const loop of loops) {
  const obj = loop[1];
  //console.log({i,obj})
  obj.draw();
}

console.log(arrowHeads);

for (const arrowHead of arrowHeads) {
  arrowHead.draw();
}

console.log(Vertices);

for (const vertex of Vertices) {
  const obj = vertex[1];
  //console.log({i,obj})
  //const obj = vertex[1];
  obj.draw();
}


