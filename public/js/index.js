const socket = io();

const inputTitle = document.getElementById("form-title");
const inputThumb = document.getElementById("form-thumbnail")
const inputDesc = document.getElementById("form-description");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputCat = document.getElementById("form-category");
const inputPrice = document.getElementById("form-price");

const ProdForm = document.getElementById("prodForm")

const inputId = document.getElementById("form-idProd");
const prodFormDel = document.getElementById("prodFormDel");


ProdForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const newProd = {
        title: inputTitle.value,
        thumbnail: inputThumb.value,
        description: inputDesc.value,
        code: inputCode.value,
        stock: inputStock.value,
        category: inputCat.value,
        price: inputPrice.value
    }
    socket.emit("new-product", newProd)
})

prodFormDel.addEventListener("submit", (e)=>{
    e.preventDefault();
    const idProd = inputId.value
    socket.emit("delete-product", idProd)
})

socket.on("products", (promiseProducts) => {
    if (Array.isArray(promiseProducts)) {
    const productsHtml = promiseProducts.reduce((acc, item) => {
        return acc + `<div class="product">
        <img src=${item.thumbnail} alt="img-product">
        <div class="product-info">
            <h4 class="product-title">${item.title}</h4>
            <p><span>id <i class="fa-solid fa-arrow-down"></i></span><br>${item.id}</p>
            <p><span>description <i class="fa-solid fa-arrow-down"></i></span><br>${item.description}</p>
            <p><span>code <i class="fa-solid fa-arrow-down"></i></span><br>${item.code}</p>
            <p><span>stock <i class="fa-solid fa-arrow-down"></i></span><br>${item.stock}k</p>
            <p><span>category <i class="fa-solid fa-arrow-down"></i></span><br>${item.category}</p>
            <p><span>price <i class="fa-solid fa-arrow-down"></i></span><br>$ ${item.price}(ARS)/k</p>
            <p><span>status <i class="fa-solid fa-arrow-down"></i></span><br>${item.status}</p>
        </div>
    </div>`
    }, "");
    document.getElementById("dinamicProd").innerHTML = productsHtml;
    }
});


// front ataja msg del back
socket.on('msg_back_front', (msg)=>{
    console.log(msg)
})