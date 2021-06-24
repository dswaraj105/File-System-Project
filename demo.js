const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

function binarySearch(arr, title) {
  let low = 0;
  let high = arr.length - 1;
  let mid;

  while(low <= high) {
    mid = Math.floor((low + high) / 2);
    console.log('[while] ', title, arr[mid].title);

    if(arr[mid].title.toLowerCase() === title.toLowerCase()){
      console.log("Found");
      return arr[mid];
    } 
    else if (arr[mid].title.toLowerCase() < title.toLowerCase()){
      console.log("[while] up");
      low = mid + 1;
    }
    else {
      console.log("[while] down");
      high = mid - 1;
    }
  }
  return " Not Found ";
}

fs.readFile(p, (err, content) => {
  if (!err) {
    products = JSON.parse(content);
    products.sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else {
        return 0;
      }
    });
    // console.log(products);

    const result = binarySearch(products, 'Speaker');
    console.log(result);
  }
});

