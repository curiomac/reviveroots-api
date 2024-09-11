const getRandomColor = () => {
  const getChannelValue = () => Math.floor(Math.random() * (200 - 100) + 100);
  const r = getChannelValue().toString(16).padStart(2, "0");
  const g = getChannelValue().toString(16).padStart(2, "0");
  const b = getChannelValue().toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
};

module.exports = { getRandomColor };
