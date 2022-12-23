const Utils = {
  slugify: (text) => text.toLowerCase().replaceAll(' ', '_'),
  uuidv4: () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)),
  FillTemplate: (classId, containerClassId, replacements) => {
    const container = document.querySelector(`.${containerClassId}`);
    const template = document.querySelector(`.${classId}`);

    let textTemplate = template.innerHTML;

    Object.keys(replacements).forEach((key) => {
      template.innerHTML = template.innerHTML.replaceAll(`{{${key}}}`, replacements[key]);
    });
    let clone = template.content.cloneNode(true);
    container.appendChild(clone);

    template.innerHTML = textTemplate;
  },
  distance: (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  },
  error: (msg) => {
    console.trace();
    console.error(typeof msg === 'object' ? JSON.stringify(msg) : msg);
  },
};
export default Utils;
