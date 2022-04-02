import { Injectable } from '@angular/core';
import { Game } from '../models/game';

export enum ChangeHistoryType {DELETE, UPDATE}

export class ChangeHistory {
  oldGame: Game;
  newGame: Game;
  type: ChangeHistoryType;

  constructor(oldGame: Game, newGame: Game) {
    this.oldGame = oldGame;
    this.newGame = newGame;
    this.type = newGame ? ChangeHistoryType.UPDATE : ChangeHistoryType.DELETE;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UndoService {

  private changeHistory: ChangeHistory[] = [];

  constructor() { }

  addToHistory(oldGame: Game, newGame: Game = null) {
    this.changeHistory.push(new ChangeHistory(oldGame, newGame));
  }

  getGameToRestore(): ChangeHistory {
    if (this.changeHistory.length > 0) {
      return this.changeHistory.pop();
    } else {
      return null;
    }
  }
}
