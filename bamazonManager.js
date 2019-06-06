const mysql = require("mysql");
const inquirer = require("inquirer");
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
    managerSearch();
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

function allProcucts(){
    // console.log("allAvail search");
    var query = "SELECT * FROM products";
    connection.query(query, function(err, resp){
        if(err) throw err;
        //I want to create a table that will have a row of all of the products
        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
        });
        for(let i = 0; i < resp.length; i++){
            table.push([resp[i].id, resp[i].product_name, resp[i].department_name, resp[i].price.toFixed(2), resp[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("\n");
    })
}
// allProcucts();

function lowInventory(){
    var query = "SELECT * FROM products";

    connection.query(query, function(error, resp){
        if (error) throw error;

        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
        });
        if (resp[0].stock_quantity < 5){

        for(let i = 0; i < resp.length; i++){
            table.push([resp[i].id, resp[i].product_name, resp[i].department_name, resp[i].price.toFixed(2), resp[i].stock_quantity]);
        }
         
        console.log(table.toString());
        console.log("\n");
        } else {
            console.log("There are no products in low inventory status at this time.")
        }
    })
};
// lowInventory();

function addToInvetory(){
    var query = "SELECT * FROM products";

    connection.query(query, function(error, resp){
        if (error) throw error;

        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
        });
    })
}