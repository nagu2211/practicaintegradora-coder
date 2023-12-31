async function removeProductFromCart(cartId,productId) {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The product has been removed from your cart',
        });
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error trying to delete product from cart',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function emptyCart(cartId) {
  fetch(`/api/carts/${cartId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your cart has been emptied',
        });
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error trying to empty cart',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function checkout(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Cart does not exist/not found',
        });
      } else if (response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Products not found',
        });
      } else if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your purchase has been completed successfully(an email was sent with your purchase details)',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error trying to finish the purchase',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function changeRole(userId) {
  fetch(`/api/users/premium/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User not found',
        });
      } else if (response.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User not finished your documentation',
        });
      } else if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'user role was successfully changed',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error when trying to change the role',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function deleteUser(userId) {
  fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User not found',
        });
      } else if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User deleted',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while deleting the user.',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function deleteProduct(productId) {
  fetch(`/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Product not found',
        });
      } else if (response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'unauthorized user',
        });
      } else if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'product deleted',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while deleting the product.',
        });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
async function modal() {
  const { value: formValues } = await Swal.fire({
    title: 'Create new product',
    html: `
    <div class='container mt-3 mb-1'>
    <form class='row g-3' id='productForm' method='post' action="/api/products/">
    <div class='col-md-12'>
      <input type="text" name="title" class='form-control' placeholder="Product title" required />
    </div>
    <div class='col-md-12'>
      <textarea type="text" class='form-control' placeholder="Product Description. Max (80) caracteres" name="description" maxlength="80" required></textarea>
    </div>
    <div class='col-md-6'>
      <input class='form-control' type="text" name="code" placeholder="Code" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required/>
    </div>
    <div class='col-md-6'>
      <input class='form-control' type="text" name="price" placeholder="Price" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required/>
    </div>
    <div class='col-md-6'>
    <input class='form-control' type="text" name="stock" placeholder="Stock" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required/>
    </div>
    <div class='col-md-6'>
      <input class='form-control' type="text" placeholder="Category" name="category" required />
    </div>
    <div class='col-md-12'>
      <input class='form-control' type="text" placeholder="URL image" name="thumbnail" required />
    </div>
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
    },
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
        Swal.fire('SUCCESS', 'Product added successfully', 'success');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'failed to add product',
          footer: 'you must be an admin to add a product',
        });
      }
    } catch (error) {
      Swal.fire('Error occurred while adding product');
      console.error(error);
    }
  }
}

window.addEventListener('beforeunload', function (event) {
  const form = document.getElementById('formResetPassword');
  if (form.checkValidity && !form.checkValidity()) {
    event.preventDefault();
    event.returnValue = '';
  }
});

async function validateForm(event) {
  try {
    event.preventDefault();
    let newPass = document.getElementById('newPass').value;
    let confirmPass = document.getElementById('confirmPass').value;

    if (newPass !== confirmPass) {
      alert('Passwords do not match. Please try again.');
    } else {
      document.getElementById('formResetPassword').action = '/api/users/reset-password';
      document.getElementById('formResetPassword').submit();
    }
  } catch (e) {
    console.log(e);
  }
}

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
    const cartUser = sessionData?.payload?.cart;
    return cartUser;
  } catch (error) {
    console.log(error);
  }
}
async function main(productId) {
  try {
    const button = event.target;
    const currentPage = button.getAttribute("data-page");
    
    const cartId = await getCurrentSession();
    let products = {}
    if (currentPage === "catalog") {
      products = { products: { product: productId, quantity: 1 } };
    }else if(currentPage === "details"){
      const quantityInput = document.getElementById("quantityProdForCart");

      products = { products: { product: productId, quantity: quantityInput.value } };
    }
    fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(products),
    })
      .then((response) => {
        if (response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'you cannot add your product to your cart',
          });
        } else if (response.ok) {
          Toastify({
            text: 'Product added to cart',
            duration: 1500,
            destination: `/api/carts/${cartId}`,
            newWindow: true,
            gravity: 'top',
            position: 'center',
            stopOnFocus: true,
            style: {
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
            onClick: function () {},
          }).showToast();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while adding the product.',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } catch (error) {
    console.log('Error in main: ' + error);
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
