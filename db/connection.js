const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'oswaldo',
    database : 'employee_dirDB'
  });

  connection.connect(function (err) {
    if (err) throw err;
    runView();
});

function runView() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Select Database",
            choices: [
                "Department",
                "Role",
                "Employees"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
            case "Department":
              depView();
              break;
      
            case "Role":
              roleView();
              break;
      
            case "Employees":
              empView();
              break;
      
            // case "exit":
            //   connection.end();
            //   break;
            }
          });
      }
    
  
  module.export = connection