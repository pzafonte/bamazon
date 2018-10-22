var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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
        var chosenOperation = answer.choice;

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

function viewLowInventory() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
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

function addInventoryToItem() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    // once you have the products, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{

          name: "choice",
          type: "list",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "Select an item that you would like add inventory to."
        },
        {
          name: "quantity",
          type: "input",
          validate: function (value) {
            let isValid = !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
            return isValid || "You need to enter a whole number!"
          }
        }
      ])

      .then(function (answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        connection.query(
          "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
          [answer.quantity, chosenItem.item_id],
          function (error) {
            if (error) throw err;
            start();
          }
        );

        start();

      });
  });


}

function addProduct() {

  inquirer.prompt([
      {
          "type"   : "list",
          "name"   : "department_name",
          "message": "Select the department name:",
          "choices": Object.keys(departments)
      },
      {
          "type"    : "input",
          "name"    : "product_name",
          "message" : "Enter the product name:",
          "validate": function(value) {
            return (value !== "");}
      }
      {
          "type": "input",
          "name": "price",
          "message": "Enter the price of the product:",
          "validate": function(value) {
            const value_num = parseFloat(value);
            return (value !== "" && !isNaN(value) && value_num >= 0);}
      },
      {
          "type"    : "input",
          "name"    : "stock_quantity",
          "message" : "Enter the stock quantity:",
          validate: function (value) {
            let isValid = !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
            return isValid || "You need to enter a whole number!"
          }      
        }

  ]).then( function (response){
      const department_id = departments[response.department_name];
      const product_name = response.product_name;
      const price = Math.round(100 * response.price) / 100;

      const sql_command =
          `INSERT INTO products (department_id, product_name, price, stock_quantity)
           VALUES (${department_id}, "${product_name}", ${price}, ${response.stock_quantity});
           SELECT item_id FROM products ORDER BY item_id DESC LIMIT 1;`;

      connection.query(sql_command, function (error, results) {
  
              if (error) {throw `Error: Adding ${product_name} failed.\n`;}

              items[product_name] = results[1][0].item_id;
          });

  });
}