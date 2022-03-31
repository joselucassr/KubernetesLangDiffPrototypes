// import axios from 'axios';
const fs = require('fs');
const path = require('path');

const brSha = '2fe9c317a5d459667ee9f9d64e4595dcb9740dca';
const enSha = '9d70cb8f0c888702852d4dbcf76628c047bf1a6f';

async function getRepoTree() {
  console.time();

  // let enTree: treeObj[] = JSON.parse(
  //   fs.readFileSync(
  //     path.join(__dirname, './Get_EN_Docs_Kubernetes-1648687488644.json'),
  //     'utf-8',
  //   ),
  // );

  // let parsedEnTree: parsedTreeObj[] = [];

  // enTree.forEach((enObj: treeObj) => {
  //   parsedEnTree.push({
  //     name: enObj.path.match(/[^/]*$/)[0],
  //     type: enObj.type === 'tree' ? 'dir' : 'file',
  //   });
  // });

  let brTree = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, './Get_PT-BR_Docs_Kubernetes-1648687521088.json'),
      'utf-8',
    ),
  );

  let parsedBrTree = [];

  let parentIndexHeap = [];
  let lastDepthLvl = 0;

  for (let i = 0; i < brTree.length; i += 1) {
    brObj = brTree[i];

    let parsedBrObj = {
      name: brObj.path.match(/[^/]*$/)[0],
      type: brObj.type === 'tree' ? 'dir' : 'file',
      children: [],
    };

    let currentDepthLvl = [...brObj.path.matchAll(/\//g)].length;

    if (currentDepthLvl > lastDepthLvl) {
      parentIndexHeap.push(parsedBrTree.length - 1);

      parsedBrTree[parsedBrTree.length - 1].children.push(parsedBrObj);

      lastDepthLvl = currentDepthLvl;
    } else if (currentDepthLvl !== 0 && currentDepthLvl === lastDepthLvl) {
      parsedBrTree[parentIndexHeap[parentIndexHeap.length - 1]].children.push(
        parsedBrObj,
      );
    } else if (currentDepthLvl !== 0 && currentDepthLvl < lastDepthLvl) {
      parentIndexHeap.pop();
      parsedBrTree[parentIndexHeap[parentIndexHeap.length - 1]].children.push(
        parsedBrObj,
      );

      lastDepthLvl = currentDepthLvl;
    } else if (currentDepthLvl === 0) {
      parsedBrTree.push(parsedBrObj);
      parentIndexHeap = [];
      lastDepthLvl = 0;
    }
  }

  fs.writeFileSync(
    path.join(__dirname, './parsedBrTree.json'),
    JSON.stringify(parsedBrTree, null, 2),
  );

  // let matchingObjs: treeObj[] = [];

  // brTree.forEach((brObj: treeObj) => {
  //   matchingObjs.push(
  //     enTree.find((enObj: treeObj) => enObj.path === brObj.path),
  //   );
  // });

  // console.log('matchingObjs.length', matchingObjs.length);
  // console.log('brTree.length', brTree.length);

  console.timeEnd();
}

getRepoTree();
