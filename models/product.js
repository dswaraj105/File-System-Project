// importing the core modules
const fs = require("fs");
const path = require("path");
const { title } = require("process");

// Importing the cart modal
const Cart = require("./cart");

// Creating path for product JSON file
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

// Fetching all products and 
// sending it to the call back function passes if there is no error
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

function binarySearch(arr, title) {
  let low = 0;
  let high = arr.length - 1;
  let mid;

  while(low <= high) {
    mid = Math.floor((low + high) / 2);

    if(arr[mid].title.toLowerCase() === title.toLowerCase()){
      return arr[mid];
    } 
    else if (arr[mid].title.toLowerCase() < title.toLowerCase()){
      low = mid + 1;
    }
    else {
      high = mid - 1;
    }
  }
  return null;
}

// Creating a class for product for various operations
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // Saving the product either the new one or the updated one
  save() {
    getProductsFromFile((products) => {
      // If the prodict is available we update it
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        // Sort the products
        updatedProducts.sort((a, b) => {
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });

      } else {

        // the product is not available so we create a new one
        this.id = Math.random().toString();
        products.push(this);

        // Sort the products
        products.sort((a, b) => {
          if (a.title.toLowerCase() > b.title.toLowerCase()) {
            return 1;
          } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  // Deleting the product
  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  // Fetching all the products
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // Finding a product by ID
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  // Finding the product by Name
  // Also implementing binary Search here
  static findByName(id, title, cb) {
    getProductsFromFile((products) => {
      console.log('Get Product by name', title, "--", id);
      // Sequencial Search
      // const product = products.find(p => p.title === title);

      // Implement Binary Search
      const product = binarySearch(products, title);

      cb(product);
    });
  }
};
