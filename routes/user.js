var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "simpleangular",
});

router.post("/register", async function (req, res, next) {
  try {
    let { username, password, name, email, age, cinfo, gender } = req.body;
    //const hashed_password = md5(password.toString());
    const checkUsername = `Select username FROM employee WHERE username = ?`;
    con.query(checkUsername, [username], (err, result, fields) => {
      if (!result.length) {
        const sql = `Insert Into employee (username, name, email, password, age, cinfo, gender) VALUES ( ?, ?, ?, ?, ?, ?, ? )`;
        con.query(
          sql,
          [username, name, email, password, age, cinfo, gender],
          (err, result, fields) => {
            if (err) {
              res.send({ status: 0, data: err });
            } else {
              let token = jwt.sign({ data: result }, "secret");
              res.send({ status: 1, data: result, token: token });
            }
          }
        );
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    //const hashed_password = md5(password.toString());
    const sql = `SELECT * FROM employee WHERE username = ? AND password = ?`;
    con.query(sql, [username, password], function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        if (result.length > 0) {
          let token = jwt.sign({ data: result }, "secret");
          res.send({ status: 1, data: result, token: token });
        }else{
          res.send({ status: 0, data: err });
        }
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.get("/empData", async function (req, res, next) {
  try {
    const sql = `SELECT username,name,email,password,age,gender,cinfo FROM employee where isAdmin is Null`;
    con.query(sql, function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        if (result.length > 0) {
          res.send({ status: 1, data: result });
        }
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
router.get("/vaccineData", async function (req, res, next) {
  try {
    const sql = `SELECT username,name,is_first_doze_take,vaccine_name,first_doze_date,is_second_doze_take,second_doze_date,is_fully_vaccinated FROM employee where isAdmin is Null`;
    con.query(sql, function (err, result, fields) {
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        if (result.length > 0) {
          res.send({ status: 1, data: result });
        }
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
router.post("/empVaccineData", async function (req, res, next) {
  try {
    let {
      firstDose,
      firstDoseDate,
      secondDose,
      secondDoseDate,
      username,
      vaccine,
      fullyVaccinated,
    } = req.body;
    const sql = `UPDATE employee SET is_first_doze_take = ?, vaccine_name = ?, first_doze_date = ?,is_second_doze_take = ?,second_doze_date = ?, is_fully_vaccinated = ? WHERE username = ?`;
    con.query(
      sql,
      [
        firstDose,
        vaccine,
        firstDoseDate,
        secondDose,
        secondDoseDate,
        fullyVaccinated,
        username,
      ],
      function (err, result, fields) {
        if (err) {
          res.send({ status: 0, data: err });
        } else {
          if (result) {
            res.send({ status: 1, data: result });
          }
        }
      }
    );
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
router.post("/deleteVaccineData", async function (req, res, next) {
    try {
      let {
        username
      } = req.body;
    const sql = 'UPDATE employee SET is_first_doze_take = null, vaccine_name = null, first_doze_date = null,is_second_doze_take = null,second_doze_date = null, is_fully_vaccinated = null WHERE username = '+username+';';
    con.query(sql, function (err, result, fields) {
      console.log(result);
      if (err) {
        res.send({ status: 0, data: err });
      } else {
        if (result.affectedRows) {
          res.send({ status: 1, data: result });
        }
      }
    });
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
module.exports = router;
