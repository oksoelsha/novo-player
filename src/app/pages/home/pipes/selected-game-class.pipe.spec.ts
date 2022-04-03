import { Game } from 'src/app/models/game';
import { SelectedGameClassPipe } from './selected-game-class.pipe';

describe('SelectedGameClassPipe', () => {
  it('create an instance', () => {
    const pipe = new SelectedGameClassPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('SelectedGameClassPipe', () => {
  it('transform function should return the proper CSS class if given game is the selected one', () => {
    const pipe = new SelectedGameClassPipe();
    const game1 = new Game('name', '12345', 4);
    const game2 = game1;
    expect(pipe.transform(game1, game2)).toEqual('selected-game');
  });
});

describe('SelectedGameClassPipe', () => {
  it('transform function should return empty string if given game is not the selected one', () => {
    const pipe = new SelectedGameClassPipe();
    const game1 = new Game('name', '12345', 4);
    const game2 = new Game('name', '23456', 4);
    expect(pipe.transform(game1, game2)).toEqual('');
  });
});
