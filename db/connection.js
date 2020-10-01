const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'oswaldo',
    database: 'employee_dirDB'
});

connection.connect(function (err) {
    if (err) throw err;
    runView();
});

function runView() {
    inquirer
        .prompt({
            name: "view",
            type: "list",
            message: "Select Database",
            choices: [
                "Department",
                "Role",
                "Employees"
            ]
        })
        .then(function (answer) {
            switch (answer.view) {
                case "Department":
                    depView();
                    break;

                case "Role":
                    roleView();
                    break;

                case "Employees":
                    empView();
                    break;
            }
        });
}

function depView() {
    connection.query('SELECT * FROM department', function (error, results) {
        if (error) throw error;
        console.table(results);
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Add new department or Exit",
            choices: [
                "Add Department",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Add Department":
                    addDep();
                    break;

                case "Exit":
                    runView();
                    break;
            }
        })
    })
    function addDep() {
        inquirer
            .prompt({
                name: "addDep",
                type: "input",
                message: "Name of new department"
            }).then(function (answer) {
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.addDep
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " product inserted!\n");
                        // Call updateProduct AFTER the INSERT completes
                        depView();
                    }
                )
            })
    }

}

module.export = connection