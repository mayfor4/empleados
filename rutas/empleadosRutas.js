var ruta = require("express").Router();
var path = require("path");
var fs = require("fs");
var subirArchivo = require("../middlewares/middlewares").subirArchivo;
var {mostrarEmpleados, nuevoEmpleado, buscarPorId, modificarEmpleado, borrarEmpleado, login} = require("../bd/empleadosBD");

ruta.get("/login", (req, res) => {
    res.render("empleados/login");
});

ruta.post("/login", async (req, res) => {
    var employee = await login(req.body);
    if (employee == undefined) {
        res.redirect("/login");
    } else {
        if (employee.admin) {
            console.log("Admin");
            res.redirect("/nuevoProducto");
        } else {
            console.log("Empleado");
            res.redirect("/");
        }
    }
});

ruta.get("/", async (req, res) => {
    var employees = await mostrarEmpleados();
    res.render("empleados/mostrar", {employees});
});

ruta.get("/nuevoEmpleado", (req, res) => {
    res.render("empleados/nuevo");
});

ruta.post("/nuevoEmpleado", subirArchivo(), async (req, res) => {
    req.body.foto = req.file.originalname;
    var error = await nuevoEmpleado(req.body);
    res.redirect("/");
});

ruta.get("/editarEmpleado/:id", async (req, res) => {
    const employee = await buscarPorId(req.params.id);
    res.render('empleados/modificar', {employee});
});

ruta.post("/editarEmpleado", subirArchivo(), async (req, res) => {
    if (req.file != undefined) {
        req.body.foto = req.file.originalname;
    } else {
        req.body.foto = req.body.fotoVieja;
    }
    var error = await modificarEmpleado(req.body);
    res.redirect("/");
});

ruta.get("/borrarEmpleado/:id", async (req, res) => {
    try {
        var employee = await buscarPorId(req.params.id);
        if (employee) {
            var rutaImagen = path.join(__dirname, "..", "web", "images", employee.foto);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            }
            await borrarEmpleado(req.params.id);
        }
        res.redirect("/");
    } catch (error) {
        console.error("Error al borrar empleado:", error);
    }
});

module.exports = ruta;

