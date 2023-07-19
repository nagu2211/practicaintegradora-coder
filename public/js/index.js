async function getCurrentSession() {
  try {
    const response = await fetch('/api/sessions/current', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current session');
    }

    const sessionData = await response.json();
    const cartUser = sessionData?.user?.cart;

    return cartUser;
  } catch (error) {
    console.error('Error fetching current session:', error);
  }
}
async function main(productId) {
  try {
    const cartId = await getCurrentSession();
    
      const products = { products: { product: productId } };
      fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Product added to cart:', data);
        })
        .catch(error => {
          console.error('error when adding product to cart:', error);
        });
    
  } catch (error) {
    console.error('Error in main:', error);
  }
}





const socket = io();

const inputTitle = document.getElementById("form-title");
const inputThumb = document.getElementById("form-thumbnail");
const inputDesc = document.getElementById("form-description");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCat = document.getElementById("form-category");
const inputPrice = document.getElementById("form-price");

const ProdForm = document.getElementById("prodForm");

const inputId = document.getElementById("form-idProd");
const prodFormDel = document.getElementById("prodFormDel");

ProdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProd = {
    title: inputTitle.value,
    thumbnail: inputThumb.value,
    description: inputDesc.value,
    code: inputCode.value,
    stock: inputStock.value,
    category: inputCat.value,
    price: inputPrice.value,
  };
  socket.emit("new-product", newProd);
});

prodFormDel.addEventListener("submit", (e) => {
  e.preventDefault();
  const idProd = {
    idProd: inputId.value,
  };
  socket.emit("delete-product", idProd);
});

socket.on("products", (promiseProducts) => {
  if (Array.isArray(promiseProducts)) {
    const productsHtml = promiseProducts.reduce((acc, item) => {
      return (
        acc +
        `<div class="product">
        <img src=${item.thumbnail} alt="img-product">
        <div class="product-info">
            <h4 class="product-title">${item.title}</h4>
            <p><span>id <i class="fa-solid fa-arrow-down"></i></span><br>${item._id}</p>
            <p><span>description <i class="fa-solid fa-arrow-down"></i></span><br>${item.description}</p>
            <p><span>code <i class="fa-solid fa-arrow-down"></i></span><br>${item.code}</p>
            <p><span>stock <i class="fa-solid fa-arrow-down"></i></span><br>${item.stock}k</p>
            <p><span>category <i class="fa-solid fa-arrow-down"></i></span><br>${item.category}</p>
            <p><span>price <i class="fa-solid fa-arrow-down"></i></span><br>$ ${item.price}(ARS)/k</p>
            <p><span>status <i class="fa-solid fa-arrow-down"></i></span><br>${item.status}</p>
        </div>
    </div>`
      );
    }, "");
    document.getElementById("dinamicProd").innerHTML = productsHtml;
  }
});

// front ataja msg del back
socket.on("msg_back_front", (msg) => {
  console.log(msg);
});
