const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Criar conta — agora só admins
router.post("/users", verifyToken, verifyAdmin, controller.createUser);

// Rotas para manager/cliente — só verifyToken
router.get("/users/clients", verifyToken, controller.getClients);
router.get("/users/me", verifyToken, controller.getMe);

// Login — mantém-se público
router.post("/users/login", controller.loginUser);

router.get("/users", verifyToken, verifyAdmin, controller.getUsers);
router.put("/users/:id", verifyToken, verifyAdmin, controller.updateUser);
router.delete("/users/:id", verifyToken, verifyAdmin, controller.deleteUser);
router.put("/users/:id/password", verifyToken, controller.changePassword);

module.exports = router;