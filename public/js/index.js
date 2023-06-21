let carritoId = localStorage.getItem("carrito-id");
const API_URL = "http://localhost:8080/api";
function putIntoCart(_id) {
  carritoId = localStorage.getItem("carrito-id");
  const url = API_URL + "/carts/" + carritoId + "/product/" + _id; 
  const data = {};

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then(() => {
      alert("agregado!!!")
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

if (!carritoId) {
  const url = API_URL + "/carts";

  const data = {};

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Response:", data);
      const carritoId = localStorage.setItem("carrito-id", data.payload._id);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
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
