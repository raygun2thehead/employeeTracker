const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


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
        console.table("Departments", results);
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
                        depView();
                    }
                )
            })
    }
}

function roleView() {
    connection.query('SELECT role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id', function (error, results) {
        if (error) throw error;
        console.table("Roles", results);
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Add new role or Exit",
            choices: [
                "Add Role",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Add Role":
                    addRole();
                    break;

                case "Exit":
                    runView();
                    break;
            }
        })
    })
    function addRole() {
        var departArr = [];
        connection.query('SELECT id, name FROM department', function (error, results) {
            if (error) throw error;
            for (i = 0; i < results.length; i++) {
                departArr.push(results[i])
            }
        inquirer
            .prompt([{
                name: "addTitle",
                type: "input",
                message: "Name of new role"
            },
            {
                name: "salary",
                type: "input",
                message: "Salary of new role"
            },
            {
                name: "depart",
                type: "list",
                message: "Choose your department",
                choices: departArr
            }]).then(function (answer) {
                var departId;
                results.forEach(el => {
                    if (el.name === answer.depart) {
                        departId = el.id;
                    }
                })

                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.addTitle,
                        salary: answer.salary,
                        department_id: departId
                    },
                    function (err, res) {
                        if (err) throw err;
                        roleView();
                    }
                )
            })
        });

    }
}



