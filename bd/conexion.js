var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});


var cuenta=admin.firestore();
var conexion=cuenta.collection("miejemploBD");


module.exports=conexion;

var cuenta=admin.firestore();
var conexionEmpleados=cuenta.collection("empleados");
var conexionProductos=cuenta.collection("productos");


module.exports={
    conexionEmpleados,
    conexionProductos
};