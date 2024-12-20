const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//This function To create new user :
const register = async (req, res) => {
  console.log(req.body);

  const { first_name, last_name, country, email, password, role_id } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const normalizedEmail = email.toLowerCase();
  const encryptedPassword = await bcrypt.hash(password, 5);

  const query = `INSERT INTO users (first_name, last_name, country, email, password, role_id) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  const values = [
    first_name,
    last_name,
    country,
    normalizedEmail,
    encryptedPassword,
    role_id,
  ];

  db.query(query, values)
    .then((result) => {
      console.log("result", result.rows[0].user_id);
      db.query(`INSERT INTO reservations (user_id) VALUES ($1)`, [
        result.rows[0].user_id,
      ])
        .then((result) => {
          res.status(201).json({
            success: true,
            message: "Reservations created successfully",
            user: result.rows[0],
          });
        })
        .catch((err) => {
          console.log(err);
        });
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: result.rows[0],
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(409).json({
        success: false,
        message: "The email already exists",
        err: err,
      });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];

  try {
    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "An error occurred while logging in",
      });
    }

    const payload = {
      userId: user.user_id,
      role: user.role_id,
    };

    const options = {
      expiresIn: "60m",
    };

    const token = jwt.sign(payload, process.env.SECRET, options);
    // console.log("test")
    res.status(201).json({
      success: true,
      message: "Login successful",
      token: token,
      userId: user.user_id,
      role: user.role_id,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: "Valid Loin Credentials",
      err: err.message,
    });
  }
};
const getUserInfoById = (req, res) => {
  const id = req.params.id;
  // console.log(req.params.id);
  db.query(`SELECT * FROM users WHERE user_id='${id}' AND users.is_deleted=0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `User ${id}`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const getAllUsers = (req, res) => {
  db.query(`SELECT * FROM users WHERE users.is_deleted=0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All The Users`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
module.exports = { register, login, getUserInfoById,getAllUsers };
