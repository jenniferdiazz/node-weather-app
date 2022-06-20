const axios = require('axios').default;
require('dotenv').config()

const { leerInput,
    inquirerMenu,
    pausa,
    listarLugares
 } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() =>{
    const busquedas = new Busquedas();
    let opt = '';
    do{

         opt = await inquirerMenu();

         switch(opt){
             case 1:
                 // mostrar mensaje
                 const termino = await leerInput('Ciudad: ');
                 //buscar los lugares
                 const lugares = await busquedas.ciudad(termino);
                 
                 //seleccionar el lugar
                 const id = await listarLugares(lugares);
                 
                 //el continue solo sigue la siguiente operacion del ciclo
                 if (id === '0') continue;
                 const lugarSel = lugares.find( l => l.id === id );
                 //console.log(lugarSel);
                 //console.log({id})
                 //Guardar en DB
                  busquedas.agregarHistorial(lugarSel.nombre);
                 //clima
                 const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)
                 //console.log(clima)
                 //mostr resultados
                 console.log('\n Informacion de la ciudad \n'.green);
                 console.log('ciudad: ', lugarSel.nombre);
                 console.log('Lat: ', lugarSel.lat);
                 console.log('Lng: ', lugarSel.lng);
                 console.log('Temperatura: ', clima.temp);
                 console.log('Minima: ',clima.min);
                 console.log('Maxima: ', clima.max);
                 console.log('Como esta el clima: ', clima.desc);
                break;
             case 2: 
                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${ idx} ${lugar}`);
                })
                
                break;
            
         }

await pausa();
        
}while( opt !== 0);
}


main();