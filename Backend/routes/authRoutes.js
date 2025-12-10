const express = require("express");
const router = express.Router();
const { createRole, signup, login, deleteRole, logout, deleteUser, getUsers, getUserById, updateUser, updateRole, getAllRoles, getRoleById  } = require("../controllers/authController");

router.post("/role", createRole);
router.delete("/role/:id", deleteRole);
router.put("/role/:id", updateRole);
router.get("/roles", getAllRoles);
router.get("/role/:id", getRoleById);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;
