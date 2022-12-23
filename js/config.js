var AppOptions = {
  geoLocationOptions: {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  },
  tickRateMS: 10000,
  updateMeters: 3,
  iconsMap: {
    'team-member': `<i class="bi bi-circle-fill marker blue"></i>`,
    'squad-leader': `<i class="bi bi-{{squadNumber}}-circle-fill marker blue"></i>`,
    'squad-member': `<i class="bi bi-circle-fill marker green"></i>`,
    'they-squad-leader': `<i class="bi bi-{{squadNumber}}-circle-fill marker green"></i>`,
    'me-squad-leader': `<i class="bi bi-{{squadNumber}}-circle-fill marker yellow"></i>`,
    me: `<i class="bi bi-circle-fill marker yellow"></i>`,
  },
};
export default AppOptions;
