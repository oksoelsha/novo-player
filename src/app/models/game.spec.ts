import { Game } from './game';

describe('Game', () => {
  it('should create an instance', () => {
    expect(new Game("name", "sha1", 1024)).toBeTruthy();
  });
});
