import { Settings } from './settings';

describe('Settings', () => {
  it('should create an instance', () => {
    expect(new Settings('openmsxPath', 'screenshotsPath', 'defaultListing', 'webmsxPath')).toBeTruthy();
  });
});
