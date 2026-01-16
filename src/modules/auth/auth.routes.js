const express = require("express");
const { register, login,refresh,logout } = require("./auth.controller");
const authMiddleware = require("./auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const router = express.Router();

router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

router.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
