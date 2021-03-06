DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) UNSIGNED NOT NULL,
  stock_quantity INT UNSIGNED default 0,
  product_sales DECIMAL(8, 2) UNSIGNED NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(8, 2) UNSIGNED NOT NULL,
  PRIMARY KEY (department_id)
);



