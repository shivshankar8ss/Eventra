const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/postgress");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./auth.service");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

const result = await pool.query(
  "SELECT id, email, password_hash, role FROM users WHERE email=$1",
  [email]
);

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decoded = jwt.decode(refreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, to_timestamp($3))`,
    [user.id, refreshToken, decoded.exp]
  );

  res.json({ accessToken, refreshToken });
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token required" });
  }

  const stored = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1",
    [refreshToken]
  );

  if (stored.rows.length === 0) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = generateAccessToken({ id: decoded.id });
    res.json({ accessToken });

  } catch {
    res.status(403).json({ message: "Expired refresh token" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await pool.query(
    "DELETE FROM refresh_tokens WHERE token=$1",
    [refreshToken]
  );

  res.json({ message: "Logged out successfully" });
};
