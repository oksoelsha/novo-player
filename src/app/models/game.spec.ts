import { Game } from './game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(new Game("name", "company", 0, 0, "rom")).toBeTruthy();
  });
});
