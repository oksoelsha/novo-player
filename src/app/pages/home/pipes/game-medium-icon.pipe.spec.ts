import { Game } from 'src/app/models/game';
import { GameMediumIconPipe } from './game-medium-icon.pipe';

describe('GameMediumIconPipe', () => {
  it('create an instance', () => {
    const pipe = new GameMediumIconPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('GameMediumIconPipe', () => {
  it('transform function should return ROM icon if the main file is ROM', () => {
    const pipe = new GameMediumIconPipe();
    const game = new Game('name', '12345', 4);
    game.setRomA('rom');
    expect(pipe.transform(game)).toEqual('assets/images/media/rom.png');
  });
});

describe('GameMediumIconPipe', () => {
  it('transform function should return disk icon if the main file is disk', () => {
    const pipe = new GameMediumIconPipe();
    const game = new Game('name', '12345', 4);
    game.setDiskA('disk');
    expect(pipe.transform(game)).toEqual('assets/images/media/disk.png');
  });
});

describe('GameMediumIconPipe', () => {
  it('transform function should return tape icon if the main file is tape', () => {
    const pipe = new GameMediumIconPipe();
    const game = new Game('name', '12345', 4);
    game.setTape('tape');
    expect(pipe.transform(game)).toEqual('assets/images/media/tape.png');
  });
});

describe('GameMediumIconPipe', () => {
  it('transform function should return harddisk icon if the main file is harddisk', () => {
    const pipe = new GameMediumIconPipe();
    const game = new Game('name', '12345', 4);
    game.setHarddisk('harddisk');
    expect(pipe.transform(game)).toEqual('assets/images/media/harddisk.png');
  });
});

describe('GameMediumIconPipe', () => {
  it('transform function should return laserdisc icon if the main file is laserdisc', () => {
    const pipe = new GameMediumIconPipe();
    const game = new Game('name', '12345', 4);
    game.setLaserdisc('laserdisc');
    expect(pipe.transform(game)).toEqual('assets/images/media/laserdisc.png');
  });
});
