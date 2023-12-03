class Producto {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.nombre = data.nombre;
        this.marca = data.marca;
        this.modelo = data.modelo;
        this.anio = data.anio;
        this.precio = data.precio;
        this.categoria = data.categoria;
        this.foto = data.foto;
    }

    set id(id) {
        if (id != null) {
            id.length > 0 ? this._id = id : (this.bandera = 1);
        }
    }

    set nombre(nombre) {
        nombre.length > 0 ? this._nombre = nombre : (this.bandera = 1);
    }

    set marca(marca) {
        marca.length > 0 ? this._marca = marca : (this.bandera = 1);
    }

    set modelo(modelo) {
        modelo.length > 0 ? this._modelo = modelo : (this.bandera = 1);
    }

    set anio(anio) {
        anio.length > 0 ? this._anio = anio : (this.bandera = 1);
    }

    set precio(precio) {
        precio.length > 0 ? this._precio = precio : (this.bandera = 1);
    }

    set categoria(categoria) {
        categoria.length > 0 ? this._categoria = categoria : (this.bandera = 1);
    }

    set foto(foto) {
        foto.length > 0 ? (this._foto = foto) : (this.bandera = 1);
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    get marca() {
        return this._marca;
    }

    get modelo() {
        return this._modelo;
    }

    get anio() {
        return this._anio;
    }

    get precio() {
        return this._precio;
    }

    get categoria() {
        return this._categoria;
    }

    get foto() {
        return this._foto;
    }

    get obtenerProducto() {
        if (this._id != null) {
            return {
                id: this.id,
                nombre: this.nombre,
                marca: this.marca,
                modelo: this.modelo,
                anio: this.anio,
                precio: this.precio,
                categoria: this.categoria,
                foto: this.foto
            };
        } else {
            return {
                nombre: this.nombre,
                marca: this.marca,
                modelo: this.modelo,
                anio: this.anio,
                precio: this.precio,
                categoria: this.categoria,
                foto: this.foto
            };
        }
    }
}

module.exports = Producto;
