const randomstring = require('randomstring')

const secretCodeGenerator = () => {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
};

module.exports = secretCodeGenerator;