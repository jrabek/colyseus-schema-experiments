import { BaseSerializer } from "./baseSerializer";
import { GameState } from "./gameState";
import { Player } from "./player";

class Serializer extends BaseSerializer<GameState> { };

export class Server {
  state: GameState;
  private serializer: Serializer;
  private doDecode = true;

  constructor() {
    this.state = new GameState();
    this.serializer = new Serializer(this.state);
  }

  saveLoadState() {
    // state.discardAllChanges();
    let encodedState = this.serializer.getFullState();
    console.log('==== saveLoadState ====', encodedState.length);

    // Simulate a serialization to a database
    if (this.doDecode) {
      this.state = new GameState();
      this.state.decode(encodedState);
      this.state = this.state.clone();
      this.serializer = new Serializer(this.state);
    }

    console.log('Server state', this.state.toJSON());
  }

  initialState(player?: Player): number[] {
    return this.serializer.getFullState(player);
  }

  stateUpdate(): Map<string, number[]> {
    const playerArray: Player[] = Array.from(this.state.players.values());
    console.log("Getting updates for ", playerArray.map(player => player.userId));
    return this.serializer.applyPatches(playerArray);
  }

  arrayTest(): void {
    console.log("============= arrayTest =============");
    this.state.words.push("hey");
    this.saveLoadState();
    this.state.words.push("there");
    this.saveLoadState();
  }

  mapTest() {
    console.log("============= mapTest =============");
    const player3 = new Player("player3");
    this.state.players.set(player3.userId, player3);
    const player4 = new Player("player4");
    this.state.players.set(player4.userId, player4);

    this.saveLoadState();

    const player5 = new Player("player5");
    this.state.players.set(player5.userId, player5);
    this.saveLoadState();
  }

  filterTest() {
    console.log("============= filterTest =============");
    this.state.secret = "secretWord for player 1";
    this.state.currentPlayerUserId = "player1";
    this.saveLoadState();
    this.state.secret = "secretWord for player 2";
    this.state.currentPlayerUserId = "player2";
    this.saveLoadState();
  }

  smallUpdateTest() {
    console.log("============= smallUpdateTest =============");
    this.state.title = "a";
    this.saveLoadState();
  }
}
