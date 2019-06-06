DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT primary key,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(25) NOT NULL,
  price DECIMAL(10,2) NULL default 0,
  stock_quantity INTEGER (4)
);