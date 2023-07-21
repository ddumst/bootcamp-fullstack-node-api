import * as WebSocket from 'ws';

let wss: WebSocket.Server;
let client: WebSocket;

export const init = (server: any) => {
  wss = new WebSocket.Server({ server });
  return wss;
}

export const getWS = () => {
  if (!wss) {
    throw new Error('WebSocket not initialized');
  }

  return wss;
}

export const handleConnection = (socket: WebSocket) => {
  if (!socket) {
    throw new Error('WebSocket not initialized');
  }

  client = socket;
}

export const getClient = () => {
  if (!wss) {
    throw new Error('WebSocket not initialized');
  }

  return client;
}