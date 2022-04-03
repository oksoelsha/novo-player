import { Game } from 'src/app/models/game';
import { EditRowModePipe } from './edit-row-mode.pipe';

describe('EditRowModePipe', () => {
  it('create an instance', () => {
    const pipe = new EditRowModePipe();
    expect(pipe).toBeTruthy();
  });
});

describe('EditRowModePipe', () => {
  it('transform function should return true if given game is marked for rename', () => {
    const pipe = new EditRowModePipe();
    const game1 = new Game('name', '12345', 4);
    const game2 = game1;
    expect(pipe.transform(game1, game2)).toBeTrue();
  });
});

describe('EditRowModePipe', () => {
  it('transform function should return false if given game is not marked for rename', () => {
    const pipe = new EditRowModePipe();
    const game1 = new Game('name', '12345', 4);
    const game2 = new Game('name', '23456', 4);
    expect(pipe.transform(game1, game2)).toBeFalse();
  });
});
