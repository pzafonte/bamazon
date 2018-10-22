var mysql = require("mysql");
var inquirer = require("inquirer");

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
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


function start() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the products, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {

          name: "choice",
          type: "list",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What product would you like to buy?"
        },

        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?",
          //Checks to make sure it's a whole number
          validate: function (value) {
            let isValid = !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
            return isValid || "You need to enter a whole number!"
          }
        }
      ])

      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if there is enough in stock
        if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
          // there was enough stock, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
            [answer.quantity, chosenItem.item_id],
            function(error) {
              if (error) throw err;
              console.log("Order successful!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("There's not enough in stock for that quantity!");
          start();
        }
      });
  });
}
