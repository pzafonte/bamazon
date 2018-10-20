var mysql = require("mysql");
var inquirer = require("inquirer");
const {
  table
} = require('table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


function start() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    const managerMenu = [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]

    // once you have the products, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: "choice",
        type: "list",
        choices: managerMenu,
        message: "Select Operation:"
      }])

      .then(function (answer) {
        // get the information of the chosen item
        var chosenOperation = answer.choice;

        // determine if there is enough in stock
        switch (managerMenu.indexOf(chosenOperation)) {
          case 0:
            viewProductsForSale();
            break;
          case 1:
            viewLowInventory();
            break;
          case 2:
            addInventoryToItem();
            break;
          case 3:
            addProduct();
            break;
          default:
            start();
        }


      });
  });
}

function viewProductsForSale() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, results) {
    if (err) throw err;
    let data = [];
    data.push(Object.keys(results[0]));
    for (let i = 0; i < results.length; i++) {
        data.push(Object.values(results[i]));
    }
    output = table(data);
    console.log(output);
    start();
  });
}