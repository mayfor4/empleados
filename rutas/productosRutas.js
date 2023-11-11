var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
const path = require("path");
var {borrarProducto,buscarPorId,modificarProducto,mostrarPro,nuevoPro}=require("../bd/productosBD");

ruta.get("/mostrarPro",async(req,res)=>{ // /////////////////
    var products = await mostrarPro(); 
   // console.log(users);
   // res.end(); 
    res.render("productos/mostrarPro",{products})
}); 

ruta.get("/nuevoPro",(req,res)=>{
    res.render("productos/nuevoPro");
}); 

 
ruta.post("/nuevoPro",subirArchivo(),async(req,res)=>{
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

ruta.post("/editarProducto", async (req,res)=>{
   // var error = await modificarProducto(req.body);
    //res.redirect("/mostrarProductos");

    try {
        var rutaImagen = path.join(__dirname, "..", "web", "images",req.body.foto);
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
            req.body.foto= req.file.originalname;
            var error=await modificarProducto(req.body);
        }
        res.redirect("/");
    } catch (error) {
        console.error("Error al editar producto:", error);
    }

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


module.exports=ruta;