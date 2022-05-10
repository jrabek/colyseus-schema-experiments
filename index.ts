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
  console.log("updateClientStates", userId);
  clients.forEach(client => {
    if (!userId || userId === client.player.userId) {
      client.updateState(stateUpdate);
    }
  });
}

console.log("----------------- setting initial client state -----------------");
updateClientStates(server.initialState());

server.arrayTest();
// server.filterTest();
// server.mapTest();

const updateMap = server.stateUpdate();

console.log("----------------- updating client state -----------------");

updateMap.forEach((stateUpdate, userId) => {
  updateClientStates(stateUpdate, userId);
});
