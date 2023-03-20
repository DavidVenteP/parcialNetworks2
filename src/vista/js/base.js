$(document).ready(function() {
    let data_user;
    const host_conexion = "localhost";
    async function getDataUser() {
        const result = fetch(`http://${host_conexion}:3000/getDataUser`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(function (data) {
                data_user = data;
                window.sessionStorage.setItem("user", JSON.stringify(data));
            })
            .then(function () {
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    if (Object.keys(data_user).length > 0) {
                        $("#dataUserNav").html(
                            `${data_user.name} - ${data_user.rol}`
                        );
                        if (data_user.rol === "ADMIN") {
                            $("#ulNav").append(`
                                <li class="nav-item nav-li-contained px-3">
                                    <a class="nav-link" href="/usuarios">Usuarios</a>
                                </li>`);
                        }
                    } else if (!(window.location.href).includes('loginUser')) {
                        window.location.href = `http://${host_conexion}:3000/loginUser`

                    }
                } else if (!(window.location.href).includes('loginUser')) {
                    window.location.href = `http://${host_conexion}:3000/loginUser`
                }
        });
    };
    getDataUser();
    async function removeItem () {
        fetch(`http://${host_conexion}:3000/usuarios/logout`, {method:'GET'})
    }
    $("#bodyContent").on("click", "#btnLogoutNav", function() {
        removeItem().then( function () {
            sessionStorage.removeItem("user");
        }).then( function () {
            window.location.href = `http://${host_conexion}:3000/loginUser`
        })
    })
});