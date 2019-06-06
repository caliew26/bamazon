//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table");

//establishing mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Potter!!13",
    database: "bamazon"
});

//Connection established with server and calling the function allAvail to see all of the items available in the db
connection.connect(function(err) {
    if (err) throw err;  
    console.log("connected as id " + connection.threadId);
    managerSearch();
});

//will be an inquirer.prompt that will ask the manager what they would like to do
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
    //switch case that will call the function based on what choice the user makes
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
        }
    });
}

//function created that will dispay all of the items within the db
function allProcucts(){
    // console.log("allAvail search");
    var query = "SELECT * FROM products";
    connection.query(query, function(err, resp){
        if(err) throw err;
        //create a table that will have a row of all of the products
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

//function to view all inventory that has less than 5 stock_quantity
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
    inquirer.prompt([
        {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
        "update a price",
        "update the quantity"
        ]
    }])
    //switch case that will call the function based on what choice the user makes
    .then(function(answer) {
        switch (answer.action) {
        case "update a price":
        priceUpdate();
        break;

        case "update the quantity":
        qtyUpdate();
        break;
        }
    });
}

function priceUpdate(){
    inquirer.prompt([
        {
            type: "number",
            message: "Which product id do you want to update?",
            name: "prodID"
        },
        {
            type: "input",
            message: "What is the new price?",
            name: "priceToUpdate"
        }
    ]).then(function(answer){
    var query = "SELECT id, price FROM products Where id=? ";
    connection.query(query, [answer.prodID], function(err, resp){
        if(err) throw err;

        connection.query(
            "UPDATE products SET price=? WHERE id=?", [answer.priceUpdate, answer.prodID], function(err,resp) {
                if(err) throw err;
                console.log("your price change has been completed");
           
            //create a table that will have a row of all of the products
            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
            });
            for(let i = 0; i < resp.length; i++){
                table.push([resp[i].id, resp[i].product_name, resp[i].department_name, resp[i].price.toFixed(2), resp[i].stock_quantity]);
            }
            console.log(table.toString());
            console.log("\n");
        })
    })
        
    })
}

function qtyUpdate(){
    inquirer.prompt([
        {
            type: "number",
            message: "Which product id do you want to update?",
            name: "prodID"
        },
        {
            type: "input",
            message: "What is the new quantity?",
            name: "qtyToUpdate"
        }
    ]).then(function(answer){
    var query = "SELECT id, stock_quantity FROM products Where id=? ";
    connection.query(query, [answer.prodID], function(err, resp){
        if(err) throw err;

        connection.query(
            "UPDATE products SET stock_quantity=? WHERE id=?", [answer.qtyToUpdate, answer.prodID], function(err,resp) {
                if(err) throw err;
                console.log("your quantity has been updated");
            

            //create a table that will have a row of all of the products
            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
            });
            for(let i = 0; i < resp.length; i++){
                table.push([resp[i].id, resp[i].product_name, resp[i].department_name, resp[i].price.toFixed(2), resp[i].stock_quantity]);
            }
            console.log(table.toString());
            console.log("\n");
        })
    })
})
}

//function to add inventory to the db
function addNewProduct(){
    inquirer.prompt([
        {
            type: "input",
            message: "What product would you like to add to the inventory?",
            name: "prodAdd"
        },
        {
            type: "input",
            message: "What department does that product belong in?",
            name: "deptName"
        },
        {
            type: "number",
            message: "What does this product cost per unit?",
            name: "priceCost"
        },
        {
            type: "number",
            message: "How many of those are you adding to the inventory?",
            name: "qtyAdd"
        }
    ]).then(function(mgrProductAdd){
        console.log(mgrProductAdd);
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: mgrProductAdd.prodAdd,
                department_name: mgrProductAdd.deptName,
                price: mgrProductAdd.priceCost, 
                stock_quantity: mgrProductAdd.qtyAdd
            }
        )
        console.log("The product has been added");
    }).catch (function(err){
        if (err) throw error;
        })
}