var conexion = require("./conexion").conexionEmpleados;
var Empleado = require("../modelos/Empleado");
var {generarPassword, validarPassword}=require("../middlewares/passwords");

async function mostrarEmpleados(){
    var employees = [];
    try {
        var empleados = await conexion.get();
        empleados.forEach(empleado => {
            var empleado1 = new Empleado(empleado.id, empleado.data());
            if(empleado1.bandera == 0){
                employees.push(empleado1.obtenerEmpleado);
            }
        });
    } catch(err) {
        console.log("Error al mostrar empleados " + err);
        employees = [];
    }
    return employees;
}

async function buscarPorId(id) {
    var employee;
    try {
        var empleadoBD = await conexion.doc(id).get();
        var empleadoObjeto = new Empleado(empleadoBD.id, empleadoBD.data());
        if (empleadoObjeto.bandera == 0) {
            employee = empleadoObjeto.obtenerEmpleado;
        }
    } catch (err) {
        console.log("Error al mostrar id" + err);
    }
    return employee;
}

async function nuevoEmpleado(datos){
    var {salt,hash}=generarPassword(datos.password);
    datos.salt=salt;
    datos.password=hash;
    datos.admin=false;
    var error=1;
    try {
        var empleado1 = new Empleado(null, datos); 
        if(empleado1.bandera == 0){
            await conexion.doc().set(empleado1.obtenerEmpleado); 
            error=0;
        } else {
            console.log("Datos incorrectos del formulario");
        }
    } catch(err) {
        console.log("Error al crear un nuevo empleado " + err);
    }
    return error;
}

async function login(datos) {
    var employee = undefined;
    var empleadoObjeto;

    try {
        var empleados = await conexion.where('usuario', '==', datos.usuario).get();

        if (empleados.docs.length === 0) {
            console.log("No existe el empleado");
            return undefined;
        }

        empleados.docs.filter((doc) => {
            var validar = validarPassword(datos.password, doc.data().salt, doc.data().password);
            if (validar) {
                empleadoObjeto = new Empleado(doc.id, doc.data());
                if (empleadoObjeto.bandera == 0) {
                    employee = empleadoObjeto.obtenerEmpleado;
                }
            } else {
                console.log("Contraseña incorrecta");
                return undefined;
            }
        });
    } catch (err) {
        console.log("Error al iniciar sesión del empleado: " + err);
    }
    return employee;
}

async function modificarEmpleado(datos) {
    var error = 1;
    var employee = await buscarPorId(datos.id);
    if (employee != undefined) {
        datos.admin = false;
        if (datos.password === "") {
            datos.password = datos.passwordAnterior;
        } else {
            var {salt, hash} = generarPassword(datos.password);
            datos.salt = salt;
            datos.password = hash;
        }
        var empleado = new Empleado(datos.id, datos);
        if (empleado.bandera == 0) {
            try {
                await conexion.doc(empleado.id).set(empleado.obtenerEmpleado);
                console.log("Registro actualizado");
                error = 0;
            } catch (err) {
                console.log("Error al modificar al empleado" + err);
            }
        }
    } else {
        console.log("Error, los datos no son válidos");
    }
    return error;
}

async function borrarEmpleado(id) {
    var error = 1;
    var employee = await buscarPorId(id);
    if (employee != undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error = 0;
        } catch (err) {
            console.log("Error al borrar al empleado" + err);
        }
    }
    return error;
}

module.exports = {
    mostrarEmpleados,
    buscarPorId,
    nuevoEmpleado,
    modificarEmpleado,
    borrarEmpleado,
    login
};
