window.onload = init;

function init() {
    if (localStorage.getItem("token")) {
        window.location.href = "main.html";
    } else {
        document.querySelector(".login-btn").addEventListener('click', login);
    }
}

function login(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    var email = document.getElementById('email-input').value;
    var password = document.getElementById('pass-input').value;

    console.log(email, password);

    axios({
        method: 'post',
        url: "http://40.87.49.253:3001/user/login",
        data: {
            email: email,
            password: password
        }
    }).then(function (res) {
        if (res.data.code === 200) {
            localStorage.setItem("token", res.data.token);
            window.location.href = "main.html";
        } else if (res.data.code === 401) {
            alert("Contraseña y/o correo incorrectos!");
        } else if (res.data.message === "Exist blank spaces!") {
            alert("Existen campos en blanco!");
        }
    }).catch(function (err) {
        console.log(err);
    });
}
