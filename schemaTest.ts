import _ from 'lodash';
import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';

class Player extends Schema {
  @type("string")
  userId = "missing";
}

class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type(["string"])
  things = new ArraySchema<string>();
}

let state = new State();

// NOTE: Setting this to true will attempt to decode from an encodedState in saveLoadState
const doDecode = true;

function saveLoadState() {
  // state.discardAllChanges();
  let encodedState = state.encodeAll();
  console.log('encodedState', encodedState.length);

  // Simulate a serialization to a database
  if (doDecode) {
    state = new State();
    state.decode(encodedState);
    state = state.clone();
  }

  console.log('state', state.toJSON());
}

function arrayTest() {
  state.things.push("hey");
  saveLoadState();
  state.things.push("there");
  saveLoadState();
}

function mapTest() {
  const player1 = new Player();
  player1.userId = "player1";
  state.players.set(player1.userId, player1);

  saveLoadState();

  const player2 = new Player();
  player2.userId = "player2";
  state.players.set(player2.userId, player2);

  saveLoadState();
}

arrayTest();
// Results:
/*
encodedState 14
state { players: {}, things: [ 'hey' ] }
encodedState 16
state { players: {}, things: [ 'there' ] }
*/

mapTest();
// Results:
/*
encodedState 30
state { players: { player1: { userId: 'player1' } }, things: [] }
encodedState 30
/Users/jrabek/projects/observe-schema/node_modules/@colyseus/schema/src/changes/ChangeTree.ts:253
            const parentType = definition.schema[ definition.fieldsByIndex[this.parentIndex] ];
                                          ^
TypeError: Cannot read property 'schema' of undefined
    at ChangeTree.getType (/Users/jrabek/projects/observe-schema/node_modules/@colyseus/schema/src/changes/ChangeTree.ts:253:43)
    at State.Schema.decode (/Users/jrabek/projects/observe-schema/node_modules/@colyseus/schema/src/Schema.ts:255:30)
    at saveLoadState (/Users/jrabek/projects/observe-schema/src/index.ts:26:9)
    at mapTest (/Users/jrabek/projects/observe-schema/src/index.ts:48:3)
    at Object.<anonymous> (/Users/jrabek/projects/observe-schema/src/index.ts:53:1)
*/
