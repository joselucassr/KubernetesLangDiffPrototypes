import axios from 'axios';
import fs from 'fs';
import path from 'path';

const brSha = '2fe9c317a5d459667ee9f9d64e4595dcb9740dca';
const enSha = '9d70cb8f0c888702852d4dbcf76628c047bf1a6f';

interface treeObj {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

async function getRepoTree(): Promise<void> {
  console.time();

  let enTree = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, './Get_EN_Docs_Kubernetes-1648687488644.json'),
      'utf-8',
    ),
  );

  let brTree: treeObj[] = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, './Get_PT-BR_Docs_Kubernetes-1648687521088.json'),
      'utf-8',
    ),
  );

  let matchingObjs: treeObj[] = [];

  brTree.forEach((brObj: treeObj) => {
    matchingObjs.push(
      enTree.find((enObj: treeObj) => enObj.path === brObj.path),
    );
  });

  console.log('matchingObjs.length', matchingObjs.length);
  console.log('brTree.length', brTree.length);

  // console.log(res);
  console.timeEnd();
}

getRepoTree();
