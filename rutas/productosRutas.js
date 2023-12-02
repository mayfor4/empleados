var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
const path = require("path");
var {borrarProducto,buscarPorId,modificarProducto,mostrarPro,nuevoPro, buscarProducto}=require("../bd/productosBD");

// Middleware para verificar si el usuario ha iniciado sesión
function requireLogin(req, res, next) {
    if (req.session && (req.session.admin || req.session.empleado)) {
        // Si el usuario ha iniciado sesión, permite el acceso a la siguiente ruta
        return next();
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión
        res.redirect("/login");
    }
}

// Middleware para verificar si el usuario ha iniciado sesión o se ha registrado
function requireLoginOrRegister(req, res, next) {
    if (req.session && (req.session.admin || req.session.empleado)) {
        // Si el usuario ha iniciado sesión, permite el acceso a la siguiente ruta
        return next();
    } else {
        // Si el usuario no ha iniciado sesión, redirige a la página de registro
        res.redirect("/registro"); // Asegúrate de tener una ruta de registro definida en tu aplicación
    }
}

ruta.get("/mostrarPro",requireLogin,async(req,res)=>{ // /////////////////
    var products = await mostrarPro(); 
   // console.log(users);
   // res.end(); 
    res.render("productos/mostrarPro",{products})
}); 

ruta.get("/nuevoPro",requireLogin,(req,res)=>{
    res.render("productos/nuevoPro");
}); 


ruta.post("/nuevoPro",requireLogin,subirArchivo(),async(req,res)=>{
    req.body.foto=req.file.originalname;
   var error = await nuevoPro(req.body);
   res.redirect("/mostrarPro");
   return error;
})

ruta.get("/editarProducto/:id", async(req,res)=>{
    var products = await buscarPorId(req.params.id);
    //res.end();
    res.render("productos/modificarPro",{products});
})

ruta.post("/editarProducto", subirArchivo(), async (req, res) => {
    if (req.file != undefined) {
        req.body.foto = req.file.originalname;
    } 
    else {
        req.body.foto = req.body.fotoVieja;
    }
    var error = await modificarProducto(req.body);
    res.redirect("/");
});



ruta.get("/borrarProducto/:id",async(req,res)=>{
    //await borrarProducto(req.params.id);
    //res.redirect("/mostrarProductos");
    try{
        var producto = await buscarPorId(req.params.id);
        if(producto){
            var rutaImagen = path.join(__dirname,"..","web","images",producto.foto);
            if(fs.existsSync(rutaImagen)){
                fs.unlinkSync(rutaImagen);
            }
            await borrarProducto(req.params.id);
        }
        res.redirect("/");
    }catch(error){
        console.log("Error al borrar producto: "+error);
    }
});


///buscar
ruta.get("/buscarProducto", async (req, res) => {
    try {
        const nombre= req.body.nombre;
        const searchResult = await buscarProducto(nombre);

        if (searchResult) {
            res.render("productos/mostrarPro", { searchResult });
        } else {
            res.render("productos/mostrarPro", { error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});

ruta.post("/buscarProducto", async (req, res) => {
    try {
        const nombre = req.body.nombre;  // Utiliza req.body en lugar de req.query
        const searchResult = await buscarProducto(nombre);

        if (searchResult) {
            // Renderiza la plantilla de usuarios encontrados
            res.render("productos/productosEncontrados", { searchResult });
        } else {
            res.render("productos/productosEncontrados", { error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al buscar Producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});



async function buscarProducto(nombreBuscado) {
    try {
        const searchResult = await buscarProducto(nombreBuscado);
        return searchResult;
    } catch (error) {
        console.error("Error al buscar producto:", error);
        return null;
    }
}

module.exports=ruta;