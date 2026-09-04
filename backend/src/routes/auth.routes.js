const{Router}=require("express");
const {body}=require("express-validator");
const{register,login,me}=require("../controllers/auth.controller");
const validate=require("../middleware/validate.middleware");
const{authenticate}=require("../middleware/auth.middleware");
const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Correo no válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  validate,
  register
);

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