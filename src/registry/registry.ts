import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };
let nodeRegistry: Node[] = []; 

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
  privateKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  //implement the status route
  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  _registry.post("/registerNode",(req,res) =>{
    const {nodeId,pubKey} = req.body;
    const newNode: Node = {
      nodeId,
      pubKey,
    };
    nodeRegistry.push(newNode);
    res.status(200).send("Node registered successfully");

  });
  
  _registry.get("/getNodeRegistry", (req, res) => {
    const responseBody: GetNodeRegistryBody = {
      nodes: nodeRegistry,
    };

    res.status(200).json(responseBody);
  });

  

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}
