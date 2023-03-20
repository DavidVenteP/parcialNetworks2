$(document).ready(function() {
    let data_package;
    const host_conexion = "192.168.100.2";
    // const host_conexion = "localhost";
    // const host_conexion = "www.paqueteria.ia";
    async function getDataPackage() {
        const result = fetch(`http://${host_conexion}:3000/traerPaquetes`, {
                method: 'GET',
                //headers: {'Content-Type': 'application/json'},
            })
            .then(response => response.json())
            .then(function (data) {
                data_package = data;
                data.forEach(record => {
                    let contentAction = "";
                    if (JSON.parse(sessionStorage.getItem('user')).rol === "CUSTOMER") {
                        contentAction = `
                        <div id="view_package_${record.id}" class="text-info font-weight-bold view_package">Ver</div>`;
                    } else {
                        contentAction = `
                        <div id="edit_package_${record.id}" class="text-info font-weight-bold edit_package">Editar</div>`;
                    }
                    $("#packagesContent").append(`
                        <div class="card" style="width: 18rem;">
                            <div class="card-body">
                              <h5 class="card-title text-center">${record.description }</h5>
                              <p class="card-text">Usuario Dueño: ${ record.user_name }</p>
                            </div>
                            <ul class="list-group list-group-flush bg-dark">
                                <li class="list-group-item bg-dark text-light text-right">Estado: ${ record.status_name }</li>
                                <li class="list-group-item bg-dark text-light text-right"># Notificaciones: ${ record.notifications }</li>
                            </ul>
                            <div class="card-body d-flex justify-content-center align-center container-actions">${contentAction}</div>
                        </div>
                    `);
                });
            }        
        );
    };
    getDataPackage();

    $('#goToPackage').click(function() {
        $(".is_disabled_package").removeAttr("disabled");
        $("#exampleModalCenterTitle").html("Creación de paquete");
        $("#modalBody").load('base/formPackage.html');    
        $("#exampleModalCenter").modal('show');
        $("#createPackage").show();
        $("#saveChangesPackage").hide();
    });
    $("#bodyContent").on("click", "#createPackage", function() {
        let errorsReport = ""
        const descriptionPackage = $("#descriptionPackage").val();
        $("#errorsReport").html("");
        $("#alertPackage").hide();
        if (descriptionPackage === undefined || descriptionPackage === "") {
            errorsReport += "El nombre no puede estar vacío.\n"
        }
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/ingresarPaquete/",
                data: {description: descriptionPackage},
                async : false,
                complete: function(response) {
                    console.log(response.responseJSON);
                    if (response.responseJSON === true) {
                        sessionStorage.setItem("notification", `Se ha creado el paquete ${descriptionPackage} con el estado CREADO de forma exitosa.`)
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
    $("#bodyContent").on("click", ".view_package", function() {
        let value_id = $(this).attr("id");
        value_id = value_id.split("view_package_")[1]
        let records = []
        $.ajax({
            type: "GET",
            url: `/traerPaquete/${value_id}`,
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Edición de paquete");
                $("#modalBody").load('base/formPackageEdit.html', function() {
                    records = response.responseJSON;
                    $("#statusCurrentPackage").prop("disabled","disabled");
                    $("#descriptionPackage").val(records.package.description);
                    $("#idPackage").val(records.package.id);
                    $("#userPackage").val(records.package.user_name);
                    $("#lastStatusCurrentPackage").val(records.package.status_id);
                    records.notifications.forEach(record => {
                        $("#packageTbody").append(`
                            <tr>
                                <th scope="row">${record.id}</th>
                                <td>${record.status_name}</td>
                                <td>${record.datetime}</td>
                            </tr>
                        `)
                    });
                    records.status_list.forEach(record => {
                        if (record.id === records.package.status_id) {
                            $("#statusCurrentPackage").append(`
                                <option value="${record.id}" selected>${record.name}</option>
                            `);
                        } else {
                            $("#statusCurrentPackage").append(`
                                <option value="${record.id}">${record.name}</option>
                            `);
                        }
                    });
                })
                $("#exampleModalCenter").modal('show');
                $("#createPackage").hide();
                $("#saveChangesPackage").hide();
                console.log(response.responseJSON.notifications)
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        }).then(function() {
            
        })
        
    });
    $("#bodyContent").on("click", ".edit_package", function() {
        let value_id = $(this).attr("id");
        value_id = value_id.split("edit_package_")[1]
        let records = []
        $.ajax({
            type: "GET",
            url: `/traerPaquete/${value_id}`,
            async : false,
            complete: function(response) {
                console.log(response)
                $(".is_disabled_package").removeAttr("disabled");
                $("#exampleModalCenterTitle").html("Edición de paquete");
                $("#modalBody").load('base/formPackageEdit.html', function() {
                    records = response.responseJSON;
                    $("#descriptionPackage").val(records.package.description);
                    $("#idPackage").val(records.package.id);
                    $("#userPackage").val(records.package.user_name);
                    $("#lastStatusCurrentPackage").val(records.package.status_id);
                    records.notifications.forEach(record => {
                        $("#packageTbody").append(`
                            <tr>
                                <th scope="row">${record.id}</th>
                                <td>${record.status_name}</td>
                                <td>${record.datetime}</td>
                            </tr>
                        `)
                    });
                    records.status_list.forEach(record => {
                        if (record.id === records.package.status_id) {
                            $("#statusCurrentPackage").append(`
                                <option value="${record.id}" selected>${record.name}</option>
                            `);
                        } else {
                            $("#statusCurrentPackage").append(`
                                <option value="${record.id}">${record.name}</option>
                            `);
                        }
                    });
                })
                $("#exampleModalCenter").modal('show');
                $("#createPackage").hide();
                $("#saveChangesPackage").show();
                console.log(response.responseJSON.notifications)
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        }).then(function() {
            
        })
        
    });
    $("#bodyContent").on("click", "#saveChangesPackage", function() {
        let errorsReport = ""
        const idPackage = $("#idPackage").val();
        const descriptionPackage = $("#descriptionPackage").val();
        const statusCurrentPackage = $("#statusCurrentPackage").val();
        const lastStatusCurrentPackage = $("#lastStatusCurrentPackage").val();
        if (idPackage === undefined || idPackage === "") {
            errorsReport += "El ID no esta definido, vuelve a seleccionar el packageo.\n"
        }
        if (statusCurrentPackage === undefined || statusCurrentPackage === "") {
            errorsReport += "El estado no esta definido.\n"
        }
        if (statusCurrentPackage === lastStatusCurrentPackage) {
            errorsReport += "Debe elegir un estado diferente al actual.\n"
        }
        if (errorsReport.length === 0) {
            jQuery.ajax({
                type: "PUT",
                url: "/cambiarEstado",
                data: {id: idPackage, status_id: statusCurrentPackage},
                complete: function(response) {
                    console.log(response.responseJSON);
                    if (response.responseJSON !== false || response.responseJSON !== undefined) {
                        sessionStorage.setItem("notification", `Se ha actualizo el estado del paquete ${descriptionPackage} a ${response.responseJSON.name}.`)
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