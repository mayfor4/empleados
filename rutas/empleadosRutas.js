var ruta = require("express").Router();
var path = require("path");
var fs = require("fs");
var subirArchivo = require("../middlewares/middlewares").subirArchivo;
var {empleado, admin} =require("../middlewares/passwords");
var {mostrarEmpleados, nuevoEmpleado, buscarPorId, modificarEmpleado, borrarEmpleado, login,buscarNombre,} = require("../bd/empleadosBD");

function requireLogin(req, res, next) {
    if (req.session && req.session.empleado) {
        return next();
    } else {
        res.redirect("/login?returnTo=" + req.originalUrl);
    }
} 

// Middleware para verificar si el usuario ha iniciado sesión y tiene el puesto de admin
function requireLoginAndAdmin(req, res, next) {
    if (req.session && req.session.empleado && req.session.admin) {
        return next();
    } else if (req.session && req.session.empleado && !req.session.admin) {
        return res.send("Acceso denegado. No tienes permiso para acceder a esta página."); // O redirige a otra página existente con un mensaje similar
    } else {
        res.redirect("/login?returnTo=" + req.originalUrl);
    }
}


ruta.get("/login", (req, res) => {
    res.render("empleados/login");
});

/*ruta.post("/login", async (req, res) => {
    var employee = await login(req.body);
    if (employee == undefined) {
        res.redirect("/login");
    } 
    else {
        if (employee.admin) {
            //console.log("Admin");
            req.session.admin=req.body.empleado;
            res.redirect("/nuevoPro");
        } 
        else {
            //console.log("Empleado");
            req.session.empleado=req.body.empleado;
            res.redirect("/");
        }
    }
});*/
ruta.post("/login", async (req, res) => {
    var employee = await login(req.body);
    if (employee == undefined) {
        res.redirect("/login");
    } else {
        req.session.empleado = true;
        req.session.admin = employee.admin;
        res.redirect("/");
    }
});


ruta.get("/logout",(req, res)=>{
    req.session=null;
    res.redirect("/login");
})

ruta.get("/", requireLogin,async (req, res) => {
    var employees = await mostrarEmpleados();
    res.render("empleados/mostrar", {employees});
});

ruta.get("/nuevoEmpleado",async (req, res) => {
    res.render("empleados/nuevo");
});

ruta.post("/nuevoEmpleado", subirArchivo(), async (req, res) => {
    req.body.foto = req.file.originalname;
    var error = await nuevoEmpleado(req.body);
    res.redirect("/");
});

ruta.get("/editar/:id", requireLoginAndAdmin, async (req, res) => {
    var employee = await buscarPorId(req.params.id);
    if (req.session.admin) {
        res.render('empleados/modificar', { employee });
    } else {
        res.send("No tienes permiso para acceder a esta página");
    }
});

ruta.post("/editar", requireLoginAndAdmin, subirArchivo(), async (req, res) => {
    if (!req.session.admin) {
        return res.send("No tienes permiso para realizar esta acción");
    }

    if (req.file != undefined) {
        req.body.foto = req.file.originalname;
    } else {
        req.body.foto = req.body.fotoVieja;
    }
    var error = await modificarEmpleado(req.body);
    res.redirect("/");
});

ruta.get("/borrar/:id", requireLoginAndAdmin, async (req, res) => {
    try {
        if (!req.session.admin) {
            return res.send("No tienes permiso para realizar esta acción");
        }

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
/*ruta.get("/borrar/:id", async(req,res)=>{
    await borrarEmpleado(req.params.id);
    res.redirect("/");
});*/




////////////////////////////////////////////empleados buscar
ruta.get("/buscarEmpleado", requireLoginAndAdmin,async (req, res) => {
    try {
        const empleado= req.body.empleado;
        const searchResult = await buscarNombre(empleado);

        if (searchResult) {
            res.render("empleados/mostrar", { searchResult });
        } else {
            res.render("empleados/mostrar", { error: "Empleado no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar empleado:", error);
        res.status(500).send("Error interno del servidor");
    }
});

ruta.post("/buscarEmpleado", requireLoginAndAdmin,async (req, res) => {
    try {
        const empleado = req.body.empleado;  // Utiliza req.body en lugar de req.query
        const searchResult = await buscarNombre(empleado);

        if (searchResult) {
            // Renderiza la plantilla de usuarios encontrados
            res.render("empleados/empleadosEncontrados", { searchResult });
        } else {
            res.render("empleados/empleadosEncontrados", { error: "Empleado no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar Empleado:", error);
        res.status(500).send("Error interno del servidor");
    }
});



async function buscarNombre(empleadoBuscado) {
    try {
        const searchResult = await buscarNombre(empleadoBuscado);
        return searchResult;
    } catch (error) {
        console.error("Error al buscar empleado:", error);
        return null;
    }
}

module.exports = ruta;

