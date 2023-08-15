export const generateProductErrorInfo = (product) => {
  return `One or more properties are incomplete or invalid!

  List of required properties:
    * Title: Must be a string. Received: "${product.title}"
    * Description: Must be a string. Received: "${product.description}"
    * Code: Must be a number. Received: "${product.code}"
    * Price: Must be a number. Received: "${product.price}"
    * Stock: Must be a number. Received: "${product.stock}"
    * Category: Must be a string. Received: "${product.category}"
    * Thumbnail: Must be a string. Received: "${product.thumbnail}"`;
};

