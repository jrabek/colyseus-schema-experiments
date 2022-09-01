import { ArraySchema, filter, MapSchema, type } from "@colyseus/schema";
import { Schema } from "@colyseus/schema";
import { Player } from "./player";

export class GameState extends Schema {
  @type("string")
  currentPlayerUserId?: string;

  @type({ map: Player })
  players = new MapSchema<Player>();

  @type(["string"])
  words = new ArraySchema<string>();

  @filter(function (player: Player, client: any, state: GameState) {
    return state.currentPlayerUserId === player.userId;
  })
  @type("string")
  secret?: string;

  @type("string")
  title?: string;
}
