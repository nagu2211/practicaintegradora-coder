async function modal() {
  const {value : formValues } = await Swal.fire({
    title: "Create new product",
    html:`
    <div class="containerForm" >
    <form id="productForm" method="post" action="/api/products/" >
        <input type="text" placeholder="Product title" name="title" required>
        <input type="text" placeholder="Product description" name="description" required>
        <input type="text" placeholder="Product code" name="code" required oninput="this.value = this.value.replace(/[^0-9]/g, '')">
        <input type="text" placeholder="Product price" name="price" required oninput="this.value = this.value.replace(/[^0-9]/g, '')">
        <input type="text" placeholder="Product stock" name="stock" required oninput="this.value = this.value.replace(/[^0-9]/g, '')">
        <input type="text" placeholder="Product category" name="category" required>
        <input type="text" placeholder="Product image" name="thumbnail" required>
    </form>
    </div>
    `,
    showDenyButton: true,
    confirmButtonText: 'Add Product',
    denyButtonText: `Cancel`,
    preConfirm: () => {
      const title = document.querySelector("#productForm input[name='title']").value;
      const thumbnail = document.querySelector("#productForm input[name='thumbnail']").value;
      const description = document.querySelector("#productForm input[name='description']").value;
      const code = document.querySelector("#productForm input[name='code']").value;
      const stock = document.querySelector("#productForm input[name='stock']").value;
      const category = document.querySelector("#productForm input[name='category']").value;
      const price = document.querySelector("#productForm input[name='price']").value;

      return { title, thumbnail, description, code, stock, category, price };
    }
  });
  if (formValues) {
    try {
      const response = await fetch('/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        Swal.fire(
          'SUCCESS',
          'Product added successfully',
          'success'
        )
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'failed to add product',
          footer: 'you must be an admin to add a product'
        })
      }
    } catch (error) {
      Swal.fire("Error occurred while adding product");
      console.error(error);
    }
  }
}

window.addEventListener("beforeunload", function (event) {
  const form = document.getElementById("formResetPassword");
  if (form.checkValidity && !form.checkValidity()) {
      event.preventDefault();
      event.returnValue = ""; 
  }
});

async function validateForm(event){
  try{
    event.preventDefault();
    let newPass = document.getElementById("newPass").value;
    let confirmPass = document.getElementById("confirmPass").value;

    if (newPass !== confirmPass) {
        alert("Passwords do not match. Please try again.");
    } else { 
      document.getElementById("formResetPassword").action = "/reset-password";
      document.getElementById("formResetPassword").submit();
    }
  } catch(e) {
    console.log(e)
  }
}

async function getCurrentSession() {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current session");
    }

    const sessionData = await response.json();
    const cartUser = sessionData?.payload?.cart;
    return cartUser;
  } catch (error) {
    console.log(error);
  }
}
async function main(productId) {
  try {
    const cartId = await getCurrentSession();
    const products = { products: { product: productId } };
    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added to cart: " + data);
      })
      .catch((error) => {
        console.log("error when adding product to cart: ", error);
      });
  } catch (error) {
    console.log("Error in main: " + error);
  }
}

/*




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
 */
