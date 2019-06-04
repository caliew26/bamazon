var mysql = require("mysql");
var inq = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Potter!!13",
    database: "bamazon"
});
  
connection.connect(function(err) {
    if (err) throw err;  
    console.log("connected as id " + connection.threadId);
    // connection.end();
    allAvail();
});

function allAvail(){
    // console.log("allAvail search");
    var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function(err, resp){
        if(err) throw err;
        console.log("\n");
        for(let i = 0; i < resp.length; i++){
            console.log(`id: ${resp[i].id} product: ${resp[i].product_name} department: ${resp[i].department_name} price: ${resp[i].price} quantity: ${resp[i].stock_quantity}`);
        }
        console.log("\n");
        wantToBuy();
    })
}


function wantToBuy(){
    inq.prompt([
        {
            type: "input",
            message: "Which item id would you like to buy?",
            name: "idToBuy"
        },
        {
            type: "number",
            message: "How many of that item would you like to buy?",
            name: "numberToBuy"
        }
    ]).then(function(answer){
        var itemID = answer.idToBuy;
        var quantity = answer.numberToBuy;
        var query = "SELECT id, stock_quantity FROM products WHERE id = ? AND stock_quantity = ?";
        console.log("id wanting to buy " + itemID);

        connection.query(query, [answer.itemID, answer.quantity], function(error, response){
            if (error) throw error;
            console.log("\n");
            for(let j = 0; j < response.length; j++){
                console.log(`id: ${response[j].id} stock_quantity: ${response[j].stock_quantity}`);
                
                if(answer.quantity <= response[j].stock_quantity){

                    console.log("There is insufficient quantity to complete your order.")
                } else {
                connection.query(
                    "UPDATE products SET stock_quantity=? WHERE id=?",
                    [response.stock_quantity - quantity, itemID],
                    function(err) {
                        if (err) throw err;
                        console.log("Thank you for your purchase");
                    }
                )
            }}
            console.log("\n");
            connection.end();
        })
    })
}