class GastoCombustible{
    constructor (tipoVehiculo, fecha, kilometros){
        this.vehicleType =  tipoVehiculo;
        this.date =  fecha;
        this.kilometers = kilometros;
        this.precioViaje = 0;
    }


    // Función que devuelve el objeto en un string con formato JSON
    convertToJSON(){

        // String con formato JSON
        var gastoJsonStr = JSON.stringify(this);

        return gastoJsonStr;
    }
}

export default GastoCombustible;

