var express=require("express");
var cors=require("cors");
var path=require("path");
var session=require("cookie-session");
var rutasEmpleados=require("./rutas/empleadosRutas");
var rutasProductos=require("./rutas/productosRutas");
var rutasEmpleadosApis=require("./rutas/empleadosRutasApis");
var rutasProductosApis=require("./rutas/productosRutasApis");

var app=express();
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",express.static(path.join(__dirname,"/web")));
app.use("/", rutasEmpleados);
app.use("/",rutasProductos);
app.use("/",rutasEmpleadosApis);
app.use("/",rutasProductosApis);

var port=process.env.PORT || 3030;
app.listen(port, ()=>{
    console.log("Servidor en http://localhost:"+port);
});
