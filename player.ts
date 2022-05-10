import { Schema, type } from "@colyseus/schema";

export enum PlayerType {
  Active = "active",
  Passive = "passive"
}

export class Player extends Schema {
  @type("string")
  playerType?: PlayerType = PlayerType.Active;

  @type("string")
  userId: string;

  @type("boolean")
  isVip = false;

  constructor(userId: string, playerType?: PlayerType) {
    super();
    this.playerType = playerType;
    this.userId = userId;
  }
}