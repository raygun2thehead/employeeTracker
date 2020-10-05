const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
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
        .then(answer => {
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
    connection.query('SELECT id AS ID, name AS Name FROM department', function (error, results) {
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
        }).then(answer => {
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
}
function roleView() {
    connection.query('SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id', function (error, results) {
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
        }).then(answer => {
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
}
function empView() {
    connection.query('SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.salary AS Salary, role.title AS Position, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', function (error, results) {
        if (error) throw error;
        console.table("All Employees", results);
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Make a selection",
            choices: [
                "View by Department",
                "View by Position",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "View by Department":
                    empDepView();
                    break;
                case "View by Position":
                    empRoleView();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Update Employee Role":
                    upEmpRole();
                    break;
                case "Exit":
                    runView();
                    break;
            }
        })
    })
}
function empDepView() {
    connection.query('SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.salary AS Salary, role.title AS Position, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department_id', function (error, results) {
        if (error) throw error;
        console.table("Employees by Department", results);
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Make a selection",
            choices: [
                "View All Employees",
                "View by Position",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "View All Employees":
                    empView();
                    break;
                case "View by Position":
                    empRoleView();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Update Employee Role":
                    upEmpRole();
                    break;
                case "Exit":
                    runView();
                    break;
            }
        })
    })
}
function empRoleView() {
    connection.query('SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.salary AS Salary, role.title AS Position, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY role_id', function (error, results) {
        if (error) throw error;
        console.table("Employees by Position", results);
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Make a selection",
            choices: [
                "View All Employees",
                "View by Department",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        }).then(answer => {
            switch (answer.action) {
                case "View All Employees":
                    empView();
                    break;
                case "View by Department":
                    empDepView();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Update Employee Role":
                    upEmpRole();
                    break;
                case "Exit":
                    runView();
                    break;
            }
        })
    })
}
function addDep() {
    inquirer
        .prompt({
            name: "addDep",
            type: "input",
            message: "Name of new department"
        }).then(answer => {
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
function addRole() {
    var departArr = [];
    connection.query('SELECT id, name FROM department', function (error, results) {
        if (error) throw error;
        for (i = 0; i < results.length; i++) {
            departArr.push(results[i])
        }
        departArr.push("Add Department");
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
            },
            ]).then(async function (answer) {
                var departId;
                if (answer.depart === "Add Department") {
                    await addDep();
                    // addRole();
                } else {
                    results.forEach(el => {
                        if (el.name === answer.depart) {
                            departId = el.id;
                        }
                    })
                    // }
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
                }
            })
    });
}
function addEmp() {
    var roleArr = [];
    connection.query('SELECT id, title AS name FROM role', function (error, results) {
        if (error) throw error;
        for (i = 0; i < results.length; i++) {
            roleArr.push(results[i])
        }
        roleArr.push("Add Role");
        inquirer
            .prompt([{
                name: "firstName",
                type: "input",
                message: "First Name"
            },
            {
                name: "lastName",
                type: "input",
                message: "Last Name"
            },
            {
                name: "role",
                type: "list",
                message: "Choose Position",
                choices: roleArr
            }
            ]).then(async answer => {
                if (answer.role === "Add Role") {
                    await addRole()
                } else {
                    var roleId;
                    results.forEach(el => {
                        if (el.name === answer.role) {
                            roleId = el.id;
                        }
                    })
                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: roleId
                        },
                        function (err, res) {
                            if (err) throw err;
                            empView();
                        }
                    )
                }
            })
    });
}
function upEmpRole() {
    connection.query("SELECT id, CONCAT(e.first_name, ' ', e.last_name) AS Employee FROM employee AS e", function (error, result) {
        if (error) throw error;
        var employeeList = [];
        for (var i = 0; i < result.length; i++) {
            employeeList.push(result[i].Employee);
        }
        inquirer.prompt(
            [{
                name: "empUpdate",
                type: "list",
                message: "Which employee are you updating?",
                choices: employeeList
            }]
        ).then(answer => {
            var employeeID;
            result.forEach(el => {
                if (el.Employee === answer.empUpdate) {
                    employeeID = el.id;
                }
            });
            connection.query("SELECT title, id FROM role", function (error, result) {
                if (error) throw error;
                var roleList = [];
                for (var i = 0; i < result.length; i++) {
                    roleList.push(result[i].title);
                }
                inquirer.prompt(
                    [{
                        name: "roleToUpdate",
                        type: "list",
                        message: "What is their new role?",
                        choices: roleList
                    }]
                ).then(function (answer) {
                    var roleID = 0;
                    result.forEach(el => {
                        if (el.title === answer.roleToUpdate) {
                            roleID = el.id;
                        }
                    })
                    connection.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID], function (error, result) {
                        if (error) throw error;
                        console.log();
                        empView();
                    })
                })
            })
        })
    })
}



