const { Router } = require("express");
const { body } = require("express-validator");
const { login, me } = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const { authenticate } = require("../middleware/auth.middleware");

const router = Router();

// El software es privado: el registro público está deshabilitado.
// La creación de usuarios se gestiona exclusivamente por administradores en /api/users

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Correo no válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  validate,
  login
);

router.get("/me", authenticate, me);

module.exports = router;