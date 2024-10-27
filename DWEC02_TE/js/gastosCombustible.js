class GastoCombustible {
    constructor(vehiculo, fecha, km, precio) {
        this.vehiculo = vehiculo,
            this.fecha = fecha,
            this.km = km,
            this.precio = precio
    }

    convertToJSON() {
        return JSON.stringify({
            vehicleType: this.vehiculo,
            date: this.fecha,
            kilometers: this.km,
            precioViaje: this.precio
        });
    }

}

export default GastoCombustible;