const bcrypt = require("bcrypt");
const client = require("../congifs/database");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password, name } = res.body;
  try {
    const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [
      email,
    ]);
    const arr = data.rows;
    if (arr.length != 0) {
      return res.status(400).json({
        error: "Email already in use.",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(err).json({
            error: "Server error",
          });
          const user = {
            email,
            password: hash,
            name,
          };
          var flag = 1;

          client.query(
            `INSERT INTO users (email, password, name) VALUES ($1,$2,$3);`,
            [user.email, user.password, user.name],
            (err) => {
              if (err) {
                flag = 0;
                console.error(err);
                return res.status(500).json({
                  error: "Database error",
                });
              } else {
                flag = 1;
                res
                  .status(200)
                  .send({ message: "User added to database, not verified" });
              }
            }
          );
          if (flag) {
            const token = jwt.sign(
              {
                email: user.email,
              },
              process.env.SECRETE_KEY
            );
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while registering user!",
    });
  }
};
