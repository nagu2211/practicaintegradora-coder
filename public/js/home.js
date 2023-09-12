document.addEventListener("DOMContentLoaded", function () {
  Swal.fire({
    imageUrl: "../images/Fresh.png",
    html: `
    <h3>WELCOME TO <h3 class="animate__animated animate__bounce">ALWAYS FRESH!!</h3></h3>
    <p>Please login to continue</p>
    <a href="/login">
    <button class="btn btn-outline-dark w-50 my-1 align-items-center">
    <div class="row align-items-center">
    <div class="col-2 d-none d-md-block">
    <i class="fa-solid fa-user"></i>
    </div>
    <div class="col-12 col-md-10 text-center">
    Login with email
    </div>
    </div>
    </button> 
    </a>
    <a href="/api/sessions/github">
    <button class="btn btn-outline-dark w-50 my-1 align-items-center">
    <div class="row align-items-center">
    <div class="col-2 d-none d-md-block">
    <i class="fa-brands fa-github"></i>
    </div>
    <div class="col-12 col-md-10 text-center">
    Login with Github
    </div>
    </div>
    </button>
    </a>
    `,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Logo",
    footer: 'I dont have an account <a href="/register">Register</a>',
    showCancelButton: false,
    allowOutsideClick: false,
    showConfirmButton: false,
  });
});
