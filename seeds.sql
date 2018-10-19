use bamazon;

INSERT INTO departments 
(department_name, over_head_costs)
VALUES 
("Electronics", 10000), ("Clothing", 60000);

INSERT INTO products 
(product_name, department_name, price, stock_quantity, product_sales)
VALUES 
("Smart Phone","Electronics", 600, 7, 5000), 
("Tablet","Electronics", 800, 12, 7000), 
("Dumb Phone","Electronics", 100, 2, 5), 
("4K TV","Electronics", 5000, 15, 2000), 
("Printer","Electronics", 200, 4, 3000), 
("Shirt","Clothing", 50, 20, 1000),
("Pants","Clothing", 100, 12, 1000),
("Shoes","Clothing", 80, 4, 3000),
("Belt","Clothing", 10, 7, 500),
("Socks","Clothing", 20, 5, 700);