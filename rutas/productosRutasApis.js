var ruta=require("express").Router();
var {borrarProducto,buscarPorId,modificarProducto,mostrarPro,nuevoPro}=require("../bd/productosBD");

ruta.get("/api/mostrarProductos",async(req,res)=>{ // /////////////////
   var productos = await mostrarPro();
   if(productos.length>0){
     res.status(200).json(productos);
   }else{
     res.status(400).json("Productos no encontrados");
   }
}); 

 
ruta.post("/api/nuevoProducto",async(req,res)=>{
   var error = await nuevoPro(req.body);
   if(error==0){
    res.status(200).json("Producto registrado correctamente");
   }else{
    res.status(400).json("Error al crear producto");
   }
})

ruta.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var producto = await buscarPorId(req.params.id);
    if(producto!=undefined){
        res.status(200).json(producto);
    }else{
        res.status(400).json("Producto no fue encontrado");
    }
})


ruta.post("/api/editarProducto/", async (req,res)=>{
    var error = await modificarProducto(req.body);
    
    if(error == 0){
        res.status(200).json("Cambios realizados correctamente");
    }else{
        res.status(400).json("Error al actualizar");
    }
});

ruta.get("/api/borrarProducto/:id",async(req,res)=>{
    var error = await borrarProducto(req.params.id);
    if(error==0){
        res.status(200).json("Producto borrado correctamente");
    }else{
        res.status(200).json("Error al borrar producto");
    }
});
 

module.exports=ruta;