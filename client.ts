import { GameState } from "./gameState";
import { Player } from "./player";

export class Client {
  constructor(player: Player) {
    this.player = player;
  }

  player: Player;
  private state: GameState = new GameState();

  updateState(update: number[]) {
    console.log(`Client updateState (length:${update.length}) before (${this.player.userId})`, this.state.toJSON());
    this.state.decode(update);
    console.log(`Client updateState (length:${update.length}) after (${this.player.userId})`, this.state.toJSON());
  }
}
