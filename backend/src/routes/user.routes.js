const{Router}=require("express");
const{body}=require("express-validator");
const{
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const{authenticate,authorize}=require("../middleware/auth.middleware");
const validate=require("../middleware/validate.middleware");
const router=Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post(
  "/",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  createUser
);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;