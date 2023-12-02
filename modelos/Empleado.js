class Empleado{
    constructor(id, data){
        this.bandera = 0;
        this.id=id;

        this.empleado = data.empleado;
        this.puesto = data.puesto;
        this.password=data.password;
        this.salt=data.salt;
        this.admin=data.admin; 
        this.foto=data.foto;
    }
    set id(id){
        if(id!=null){
            id.length > 0? this._id = id:this.bandera = 1;
        }
    }

    set empleado(empleado){
        empleado.length>0?this._empleado=empleado:this.bandera=1;
    }
    set puesto(puesto){
        puesto.length>0?this._puesto=puesto:this.bandera=1;
    }
    set password(password){
        password.length>0?this._password=password:this.bandera=1;       
    }
    set salt(salt){
        salt.length>0?this._salt=salt:this.bandera=1;
    }

    
    set foto(foto){
        foto.length > 0 ? this._foto = foto:this.bandera = 1; 
    }
    
    set admin(admin){
        this._admin=admin;
     }

 
    get id(){
        return this._id;
    }

    get empleado(){
        return this._empleado;
    }

    get puesto(){
        return this._puesto;
    }
    get password(){
        return this._password;
    }
    get salt(){
        return this._salt;
    }
   
    get foto(){
        return this._foto;
    }
    get admin(){
        return this._admin;
    }

    get obtenerEmpleado(){
        if(this._id!=null){
            return{
                id : this.id, 

                empleado : this.empleado,
                puesto : this.puesto,
                password : this.password,
                salt : this.salt,
                foto : this.foto,
                admin:this.admin
            }
        }
        else{
            return{
        
                empleado : this.empleado,
                puesto : this.puesto,
                password : this.password,
                salt : this.salt,
                foto : this.foto,
                admin:this.admin
            }
        }
    }
}

module.exports = Empleado;