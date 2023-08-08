import { nanoid } from "nanoid";
class ProductModel {
    constructor(){
        this.products = [];
    }
    getAllProducts() {
        return this.products;
      }
    findByCode(code) {
        let getAll = this.getAllProducts()
        let filter = getAll.some((prod)=> prod.code == code)
        return filter
      }
     createProduct({title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail}) {
            let products = this.getAllProducts();
            let addedProduct = {
              id: nanoid(),
              title,
              description,
              code,
              price,
              status: true,
              stock,
              category,
              thumbnail,
            };
            this.products = [...products, addedProduct];
      }
      async create(newProd){
        let products = this.getAllProducts();
            let addedProduct = {
              id: nanoid(),
              status: true,
              newProd
            };
            this.products = [...products, addedProduct];
      }
      async findOneProduct(_id) {
        let getAll = this.getAllProducts()
        let filter = getAll.filter((prod)=> prod.id == _id)
        return filter
      }
      async findOneProductView(pid) {
        let getAll = this.getAllProducts()
        let filter = getAll.filter((prod)=> prod.id == pid)
        return filter
      }
      async update(_id,updaProd){
        let getAll = this.getAllProducts()
  
        const indice = getAll.findIndex(ind => ind.id === _id);
      
        if (indice === -1) {
          return null; // Elemento no encontrado
        }
      
        // Crear una copia del elemento encontrado
        const elementoActualizado = { ...getAll[indice] };
      
        // Actualizar solo las propiedades especificadas
        Object.assign(elementoActualizado, updaProd);
      
        getAll[indice] = elementoActualizado;
      
      
        return elementoActualizado;
      }
      async delete(_id){
        let getAll = this.getAllProducts()
        let productFilter = getAll.filter((products) => products.id != _id);
        this.products = productFilter
        return `the product with the id: ${_id} has been removed`;
      }
}


export const productModel = new ProductModel();
