const mysql = require("mysql");
const inq = require("inquirer");
const Table = require("cli-table");

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Potter!!13",
    database: "bamazon"
});

//Connection established with server
connection.connect(function(err) {
    if (err) throw err;  
    console.log("connected as id " + connection.threadId);
});

function managerSearch(){
inquirer.prompt([
    {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add a New Product",
      "exit"
    ]
  }])
  .then(function(answer) {
    switch (answer.action) {
    case "View all Products for Sale":
      allProcucts();
      break;

    case "View Low Inventory":
      lowInventory();
      break;

    case "Add to Inventory":
      addToInvetory();
      break;

    case "Add a New Product":
      addNewProduct();
      break;
        
    case "exit":
      dbExit();
      break;
    }
  });
}
