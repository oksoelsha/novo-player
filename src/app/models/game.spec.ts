import { Game } from './game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(new Game("name", "company", "sha1Code", 12)).toBeTruthy();
  });
});
