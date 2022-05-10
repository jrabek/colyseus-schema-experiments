import { hasFilter, Schema } from '@colyseus/schema';
import { Player } from './player';

export class BaseSerializer<T extends Schema> {
  private state: T;
  private useFilters: boolean = false;

  constructor(state: T) {
    this.state = state;
    this.useFilters = hasFilter(state.constructor as typeof Schema);
  }

  public getFullState(player?: Player): number[] {
    const fullEncodedState = this.state.encodeAll(this.useFilters);

    if (player && this.useFilters) {
      return this.state.applyFilters(player, true);

    } else {
      return fullEncodedState;
    }
  }

  public applyPatches(players: Player[]): Map<string, number[]> {
    const hasChanges = this.state['$changes'].changes.size > 0;

    const patchMap = new Map<string, number[]>();

    if (hasChanges) {
      let numPlayers = players.length;

      // get patch bytes
      const patches = this.state.encode(false, [], this.useFilters);

      if (!this.useFilters) {
        // encode changes once, for all clients
        while (numPlayers--) {
          const client = players[numPlayers];
          patchMap.set(client.userId, patches);
        }
      } else {
        // encode state multiple times, for each client
        while (numPlayers--) {
          const player = players[numPlayers];
          const filteredPatches = this.state.applyFilters(player);
          patchMap.set(player.userId, filteredPatches);
        }

        this.state.discardAllChanges();
      }
    }

    return patchMap;
  }
}
