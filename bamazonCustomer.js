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
    allAvail();
});


//this is calling to mySQL database bamazon and getting the list of products
function allAvail(){
    // console.log("allAvail search");
    var query = "SELECT * FROM products";
    connection.query(query, function(err, resp){
        if(err) throw err;
        console.log("\n");
        //I want to create a table that will have a row of all of the products
        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Quantity'], colWidths: [5,25, 25, 15, 10 ]
        });
        console.log("\n");
        for(let i = 0; i < resp.length; i++){
            table.push([resp[i].id, resp[i].product_name, resp[i].department_name, resp[i].price.toFixed(2), resp[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("\n");
        wantToBuy();
    })
}

//this is a prompt that will ask the user what item they want to buy and how many of them they want
function wantToBuy(){
    inq.prompt([
        {
            type: "number",
            message: "Which item id would you like to buy?",
            name: "idToBuy"
        },
        {
            type: "number",
            message: "How many of that item would you like to buy?",
            name: "numberToBuy"
        }
    ]).then(function(answer){
        var query = "SELECT id, stock_quantity FROM products WHERE id=?";
        // console.log("id wanting to buy " + answer.idToBuy);
        console.log("\n");

        connection.query(query, [answer.idToBuy], function(error, response){
            if (error) {
                throw error;
            } else {
                if (answer.numberToBuy > response[0].stock_quantity){
                    connection.query(
                    "UPDATE products SET stock_quantity=? WHERE id=?",
                        [response[0].stock_quantity - parseInt(answer.numberToBuy), answer.idToBuy],
                        function(err) {
                            if (err) throw err;
                            console.log("There is insufficient quantity to complete your order");
                        })
                } else {
                // console.log(response[0].stock_quantity)
                
                    connection.query(
                        "UPDATE products SET stock_quantity=? WHERE id=?",
                        [response[0].stock_quantity - parseInt(answer.numberToBuy), answer.idToBuy],
                        function(err) {
                            if (err) throw err;
                            console.log("Thank you for your purchase");
                    }
                )
            }
        }
            console.log("\n");
            allAvail();
        })
    })
    // connection.end();
}