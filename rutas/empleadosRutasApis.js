var ruta = require("express").Router();
var { mostrarEmpleados, nuevoEmpleado, buscarPorId, modificarEmpleado, borrarEmpleado } = require("../bd/empleadosBD");
const Empleado = require("../modelos/Empleado");

ruta.get("/api/", async (req, res) => {
    var empleados = await mostrarEmpleados();
    if (empleados.length > 0) {
        res.status(200).json(empleados);
    } else {
        res.status(400).json("Empleados no encontrados");
    }
});

ruta.get("/nuevoEmpleado", (req, res) => {
    res.render("empleados/nuevo");
});

ruta.post("/api/nuevoEmpleado", async (req, res) => {
    var error = await nuevoEmpleado(req.body);
    if (error == 0) {
        res.status(200).json("Empleado registrado correctamente");
    } else {
        res.status(400).json("Error al registrar al empleado");
    }
});

ruta.get("/api/buscarEmpleadoPorId/:id", async (req, res) => {
    var employee = await buscarPorId(req.params.id);
    if (employee != undefined) {
        res.status(200).json(employee);
    } else {
        res.status(400).json("Empleado no encontrado");
    }
});

ruta.post("/api/editarEmpleado", async (req, res) => {
    var error = await modificarEmpleado(req.body);
    if (error == 0) {
        res.status(200).json("Empleado actualizado correctamente");
    } else {
        res.status(400).json("Error al actualizar al empleado");
    }
});

ruta.get("/api/borrarEmpleado/:id", async (req, res) => {
    var error = await borrarEmpleado(req.params.id);
    if (error == 0) {
        res.status(200).json("Empleado borrado");
    } else {
        res.status(400).json("Error al borrar al empleado");
    }
});

module.exports = ruta;