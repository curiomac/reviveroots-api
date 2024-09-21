const { ROLES } = require("./appConstants");

const checkIsAdmin = (role) => {
  const adminRoles = [
    ROLES.SUPERVISOR,
    ROLES.MANAGER,
    ROLES.ADMIN,
    ROLES.SUPREME_ADMIN,
  ];
  const isAdmin = adminRoles?.includes(role);
  return isAdmin;
};

module.exports = { checkIsAdmin };
