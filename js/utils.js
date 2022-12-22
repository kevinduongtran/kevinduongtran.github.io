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
};
export default Utils;
