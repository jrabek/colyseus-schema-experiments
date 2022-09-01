import _ from 'lodash';
import { Client } from "./client";
import { Player } from './player';
import { Server } from './server';

const server = new Server();
const state = server.state;

const userIds = ["player1", "player2"];
const players = userIds.map(userId => new Player(userId));
const clients = players.map(player => new Client(player));

players.forEach(player => state.players.set(player.userId, player));

function updateClientStates(stateUpdate: number[], userId?: string) {
  clients.forEach(client => {
    if (!userId || userId === client.player.userId) {
      client.updateState(stateUpdate);
    }
  });
}

function updateClientsStates() {
  const updateMap = server.stateUpdate();

  console.log("--- Updating client state ---");

  updateMap.forEach((stateUpdate, userId) => {
    updateClientStates(stateUpdate, userId);
  });
}

console.log("--- setting initial client state ---");
updateClientStates(server.initialState());

console.log("--- starting tests ---");

server.arrayTest();
updateClientsStates();
server.filterTest();
updateClientsStates();
server.mapTest();
updateClientsStates();

console.log("--- repeating update (should be empty)---");
updateClientsStates();

console.log("--- minor update ---");
server.smallUpdateTest();
updateClientsStates();
