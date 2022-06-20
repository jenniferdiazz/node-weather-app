const fs = require('fs');
const axios = require("axios");


class Busquedas{
    historial = [];
    dbPath = './db/database.json';
    constructor(){
        //TODO:leer db si existe
        this.leerDB();
    } 
    get historialCapitalizado(){
        //capitalizar cada palabra

        return this.historial.map(lugar => {
            //el split genera un arreglo
            let palabras = lugar.split(" ");
            palabras = palabras.map(p=> 
               //charAt(0) = [0]
                p = p.charAt(0).toUpperCase() + p.slice(1)
                )

            return palabras.join(' ')
        })
    }
    get paramsMapBox(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'languaje' : 'es',
            'limit': 5

        }
    }
    async ciudad(lugar = ''){
        try{
        const intance = axios.create({
            baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params:this.paramsMapBox    
        })
        //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/MADRID.json?access_token=pk.eyJ1IjoiamRpYXp6IiwiYSI6ImNsMzBvYnhhOTAxMHczY3FzcjBnb2k0OHMifQ.ph5vjPzPGKutVb7ot407IQ&languaje=es&limit=5');
        const resp = await intance.get();
        return resp.data.features.map(lugar =>({
            id:lugar.id,
            nombre: lugar.place_name,
            lng : lugar.center[0],
            lat : lugar.center[1],
        }))
        }catch(error){
            return[];
        }
    }

    get paramsopenweather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'lang' : 'es',
            'units': 'metric'

        }
    }

    async climaLugar( lat, lon){
        try{
            //https://api.openweathermap.org/data/2.5/weather?lat=48.173152&lon=16.344074&appid=256a08fdbaa054ce279d2fdf5af54ba9&units=metric&lang=es
            //instance axios.create()
            const intance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.paramsopenweather, lat, lon}
            })

            const resp = await intance.get();
            //console.log(resp.data)
        


            return{
                desc:resp.data.weather[0].description,
                min:resp.data.main.temp_min,
                max:resp.data.main.temp_max,
                temp:resp.data.main.temp
            }

        }catch(error){
            console.log(error)
        }
    }

    agregarHistorial( lugar = ''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        //TODO: prevenir duplicados
        this.historial.unshift(lugar.toLocaleLowerCase());
        //grabar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial:this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        //dEBE DE EXISTIR...
        if(! fs.existsSync(this.dbPath)){
            return;
        }
        //encoding para que no retorne los bits
        const info = fs.readFileSync(this.dbPath, {encoding : 'utf-8'});
        const data = JSON.parse(info)
        console.log('LEER BD');
        console.log(data.historial);
        this.historial = data.historial;


    

    }

}
module.exports = Busquedas;