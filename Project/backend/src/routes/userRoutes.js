const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
 
// Criar conta
router.post("/users", controller.createUser);
 
// Login
router.post("/users/login", controller.loginUser);
 
// Atualizar utilizador
router.put("/users/:id", controller.updateUser);
 
// Listar utilizadores
router.get("/users", controller.getUsers);

//Deletar utilizador
router.delete("/users/:id", controller.deleteUser);

//Alterar password
router.put("/users/:id/password", controller.changePassword);
 
module.exports = router;
