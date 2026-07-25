/* ==========================================
   FARMALAB DISPLAY
   app.js
========================================== */

// =========================
// RELOJ
// =========================

function actualizarFechaHora() {

    const ahora = new Date();

    const opcionesFecha = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    document.getElementById("hora").innerHTML =
        ahora.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("fecha").innerHTML =
        ahora.toLocaleDateString("es-AR", opcionesFecha);

}

setInterval(actualizarFechaHora,1000);

actualizarFechaHora();


// =========================
// CARRUSEL
// =========================

const contenido = [

    {
        tipo:"imagen",
        archivo:"media/promo1.jpg",
        tiempo:8000
    },

    {
        tipo:"imagen",
        archivo:"media/promo2.jpg",
        tiempo:8000
    },

    {
        tipo:"video",
        archivo:"media/video1.mp4"
    }

];

let indice = 0;

const imagen = document.getElementById("imagenActual");
const video = document.getElementById("videoActual");

function mostrarContenido(){

    imagen.style.display="none";
    video.style.display="none";

    imagen.classList.remove("fade");
    video.classList.remove("fade");

    let actual = contenido[indice];

    if(actual.tipo==="imagen"){

        imagen.src = actual.archivo;

        imagen.style.display="block";

        imagen.classList.add("fade");

        setTimeout(siguienteContenido,actual.tiempo);

    }else{

        video.src = actual.archivo;

        video.style.display="block";

        video.classList.add("fade");

        video.load();

        video.play();

        video.onended = siguienteContenido;

    }

}

function siguienteContenido(){

    indice++;

    if(indice>=contenido.length){

        indice=0;

    }

    mostrarContenido();

}

mostrarContenido();


// =====================================
// FARMACIA DE GUARDIA AUTOMÁTICA
// =====================================


async function cargarGuardia(){


    try{


        const farmacias =
        await fetch("data/farmacias.json")
        .then(res=>res.json());


        const guardias =
        await fetch("data/guardias.json")
        .then(res=>res.json());



        function obtenerFecha(){


            let hoy = new Date();


            let año = hoy.getFullYear();


            let mes = String(
                hoy.getMonth()+1
            ).padStart(2,"0");


            let dia = String(
                hoy.getDate()
            ).padStart(2,"0");


            return `${año}-${mes}-${dia}`;

        }



        let fechaHoy =
        obtenerFecha();



        let idFarmacia =
        guardias[fechaHoy];



        if(!idFarmacia){


            document.getElementById(
                "nombreFarmacia"
            ).innerHTML =
            "No hay guardia cargada";


            return;

        }



        let farmacia =
        farmacias.find(
            f=>f.id==idFarmacia
        );



        if(!farmacia){


            document.getElementById(
                "nombreFarmacia"
            ).innerHTML =
            "Farmacia no encontrada";


            return;

        }



        document.getElementById(
            "nombreFarmacia"
        ).innerHTML =
        farmacia.nombre;



        document.getElementById(
            "direccionFarmacia"
        ).innerHTML =
        "📍 "+farmacia.direccion;



        document.getElementById(
            "telefonoFarmacia"
        ).innerHTML =
        "☎ "+farmacia.telefono;



    }

    catch(error){


        console.error(
            "Error cargando guardia:",
            error
        );


    }


}


// Cargar al iniciar

cargarGuardia();


// Actualizar todos los días

setInterval(()=>{

    cargarGuardia();

},3600000);
cargarGuardia();


// =========================
// TICKER
// =========================

const mensajes = [

"💚 Bienvenido a Farmalab",

"💊 Consultá nuestras promociones",

"🧴 Dermocosmética",

"🚚 Envíos a domicilio",

"💳 Todas las tarjetas",

"👩‍⚕️ Atención farmacéutica",

"📱 Seguinos en Instagram"

];

document.getElementById("textoTicker").innerHTML =
mensajes.join(" &nbsp;&nbsp;&nbsp;&nbsp; ● &nbsp;&nbsp;&nbsp;&nbsp; ");