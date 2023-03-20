$(document).ready(function() {
    const host_conexion = "192.168.100.2";
    // const host_conexion = "localhost";
    // const host_conexion = "www.paqueteria.ia";
    if (JSON.parse(sessionStorage.getItem('user')).rol === "CUSTOMER") {
        window.location.href = `http://${host_conexion}:3000/`
    }
    async function getDataUser() {
        let data_user;
        const result = fetch(`http://${host_conexion}:3000/traerUsuarios`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(function (data) {
                data_user = data;
                data.forEach(record => {
                    $("#usersContent").append(`
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                              <h5 class="card-title text-center">${record.name }</h5>
                              <p class="card-text text-center">Usuario: ${ record.username }</p>
                            </div>
                            <ul class="list-group list-group-flush bg-dark">
                                <li class="list-group-item bg-dark text-light text-right">Password: ${ record.password }</li>
                                <li class="list-group-item bg-dark text-light text-right">Rol: ${ record.rol }</li>
                            </ul>
                            <div class="card-body d-flex justify-content-center align-center container-actions">
                                <div id="edit_user_${record.id}" class="text-info font-weight-bold edit_user">
                                    Editar
                                </div>
                            </div>
                        </div>
                    `);
                });
            }        
        );
    };
    getDataUser();
    
    $('#goToUser').click(function() {
        $(".is_disabled_user").removeAttr("disabled");
        $("#exampleModalCenterTitle").html("Creación de usuario");
        $("#modalBody").load('base/formUser.html');    
        $("#exampleModalCenter").modal('show');
        $("#createUser").show();
        $("#saveChangesUser").hide();
    });
    $("#bodyContent").on("click", "#createUser", function() {
        let errorsReport = ""
        const nameUser = $("#nameUser").val();
        const usernameUser = $("#usernameUser").val();
        const passwordUser = $("#passwordUser").val();
        const rolUser = $("#rolUser").val();
        $("#errorsReport").html("");
        $("#alertPackage").hide();
        if (nameUser === undefined || nameUser === "") {
            errorsReport += "El nombre no puede estar vacío.\n"
        }
        if (usernameUser === undefined || usernameUser === "") {
            errorsReport += "El usuario no puede estar vacío.\n"
        }
        if (passwordUser === undefined || passwordUser === "") {
            errorsReport += "La contraseña no puede estar vacío.\n"
        }
        if (rolUser === undefined || rolUser === "") {
            errorsReport += "El rol no puede estar vacío.\n"
        }
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/crearUsuario/",
                data: {name: nameUser, username:usernameUser, password: passwordUser, rol:rolUser},
                async : false,
                complete: function(response) {
                    console.log(response.responseJSON);
                    if (response.responseJSON === true) {
                        sessionStorage.setItem("notification", `Se ha creado el usuario ${nameUser} de forma exitosa.`)
                        window.location.reload();
                    }
                },
                error: function() {
                    console.error('Ha ocurrido un error');
                }
            });
        } else {
            $("#errorsReport").html(errorsReport);
            $("#alertPackage").show();
        }
    });
    $("#bodyContent").on("click", ".edit_user", function() {
        let value_id = $(this).attr("id");
        value_id = value_id.split("edit_user_")[1]
        let records = []
        $.ajax({
            type: "GET",
            url: `/traerUsuario/${value_id}`,
            async : false,
            complete: function(response) {
                console.log(response)
                $(".is_disabled_user").removeAttr("disabled");
                $("#exampleModalCenterTitle").html("Edición de paquete");
                $("#modalBody").load('base/formUserEdit.html', function() {
                    records = response.responseJSON;
                    $("#idUser").val(records.id);
                    $("#nameUser").val(records.name);
                    $("#usernameUser").val(records.username);
                    $("#passwordUser").val(records.password);
                    $("#lastRolUser").val(records.rol);
                    $("#rolUser").val(records.rol)
                });
                $("#exampleModalCenter").modal('show');
                $("#createUser").hide();
                $("#saveChangesUser").show();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $("#bodyContent").on("click", "#saveChangesUser", function() {
        let errorsReport = ""
        const idUser = $("#idUser").val();
        const lastRolUser = $("#lastRolUser").val();
        const rolUser = $("#rolUser").val();
        if (idUser === undefined || idUser === "") {
            errorsReport += "El ID del usuario no esta definido.\n"
        }
        if (rolUser === undefined || rolUser === "") {
            errorsReport += "El rol no esta definido.\n"
        }
        if (lastRolUser === rolUser) {
            errorsReport += "Debe elegir un rol diferente al actual.\n"
        }
        if (errorsReport.length === 0) {
            $.ajax({
                type: "PUT",
                url: "/cambiarRol",
                data: {rol: rolUser, id:idUser},
                complete: function(response) {
                    if (response.responseJSON !== false || response.responseJSON !== undefined) {
                        sessionStorage.setItem("notification", `Se ha actualizo el rol del usuario ${response.responseJSON.name}.`)
                        window.location.reload();
                    }
                },
                error: function() {
                    console.error('Ha ocurrido un error');
                }
            });
        } else {
            $("#errorsReport").html(errorsReport);
            $("#alertPackage").show();
        }
    });
});