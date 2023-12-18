const AuthError = require("../exceptions/AuthError");

/**
 * Middleware che controlla il ruolo dell'utente
 * @param {string[]} allowedRoles - Array di ruoli consentiti
 * @returns {function} Middleware
 */
module.exports = function (allowedRoles) {
  return function (req, res, next) {
    // Verifica se il ruolo dell'utente è presente tra quelli consentiti
    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthError("Non hai i permessi per accedere a questa risorsa");
    }

    next();
  };
};
