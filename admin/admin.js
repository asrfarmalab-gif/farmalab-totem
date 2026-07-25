/* ==========================================================
   FARMALAB DISPLAY
   admin/admin.js
   PARTE 5A
========================================================== */

// ===============================
// VARIABLES
// ===============================

const calendario = document.getElementById("calendario");
const selector = document.getElementById("farmaciaSelect");
const fechaSeleccionada = document.getElementById("fechaSeleccionada");

let fechaActual = new Date();

let diaSeleccionado = null;

let farmacias = [];

let guardias = {};


// ===============================
// CARGAR FARMACIAS
// ===============================

async function cargarFarmacias(){

    try{

        const respuesta =
            await fetch("../data/farmacias.json");

        farmacias = await respuesta.json();

        selector.innerHTML =
        "<option value=''>Seleccione una farmacia</option>";

        farmacias.forEach(f=>{

            let opcion = document.createElement("option");

            opcion.value = f.id;

            opcion.textContent = f.nombre;

            selector.appendChild(opcion);

        });

    }

    catch(e){

        console.error("No se pudieron cargar las farmacias");

    }

}


// ===============================
// CARGAR GUARDIAS
// ===============================

async function cargarGuardias(){

    try{

        const respuesta =
            await fetch("../data/guardias.json");

        guardias = await respuesta.json();

    }

    catch(e){

        guardias = {};

    }

}



// ===============================
// GENERAR CALENDARIO
// ===============================

function generarCalendario(){

    // Elimina todos los días viejos

    while(calendario.children.length>7){

        calendario.removeChild(calendario.lastChild);

    }

    const año = fechaActual.getFullYear();

    const mes = fechaActual.getMonth();

    const primerDia = new Date(año,mes,1);

    const ultimoDia = new Date(año,mes+1,0);

    document.getElementById("mes").innerHTML=

        primerDia.toLocaleDateString("es-AR",{

            month:"long",

            year:"numeric"

        });


    let inicio = primerDia.getDay();

    if(inicio===0) inicio=7;

    inicio--;


    // Espacios vacíos

    for(let i=0;i<inicio;i++){

        const vacio=document.createElement("div");

        calendario.appendChild(vacio);

    }


    // Días del mes

    for(let dia=1;dia<=ultimoDia.getDate();dia++){

        const tarjeta=document.createElement("div");

        tarjeta.className="dia";

        const numero=document.createElement("div");

        numero.className="numero";

        numero.innerHTML=dia;

        tarjeta.appendChild(numero);


        const texto=document.createElement("div");

        texto.className="guardia";


        let fecha=

            año+"-"

            +String(mes+1).padStart(2,"0")

            +"-"

            +String(dia).padStart(2,"0");


        if(guardias[fecha]){

            let farmacia=farmacias.find(

                x=>x.id==guardias[fecha]

            );

            if(farmacia){

                texto.innerHTML=farmacia.nombre;

            }

        }

        tarjeta.appendChild(texto);

        tarjeta.onclick=function(){

            seleccionarDia(fecha,dia);

        };

        calendario.appendChild(tarjeta);

    }

}



// ===============================
// SELECCIONAR DÍA
// ===============================

function seleccionarDia(fecha,dia){

    diaSeleccionado=fecha;

    fechaSeleccionada.innerHTML=

    "Día seleccionado:<br><b>"+fecha+"</b>";

    if(guardias[fecha]){

        selector.value=guardias[fecha];

    }

    else{

        selector.value="";

    }

}



// ===============================
// INICIAR
// ===============================

async function iniciar(){

    await cargarFarmacias();

    await cargarGuardias();

    generarCalendario();

}

iniciar();
/* ==========================================================
   FARMALAB DISPLAY
   admin/admin.js
   PARTE 5B
========================================================== */


// ===============================
// GUARDAR GUARDIA
// ===============================

const botonGuardar = document.getElementById("guardar");


botonGuardar.addEventListener("click",()=>{


    if(!diaSeleccionado){

        alert("Primero seleccioná un día del calendario");

        return;

    }


    if(!selector.value){

        alert("Seleccioná una farmacia");

        return;

    }


    // Guardar farmacia asignada al día

    guardias[diaSeleccionado] = Number(selector.value);


    // Actualizar calendario

    generarCalendario();


    alert(
        "Guardia guardada correctamente para el día "
        + diaSeleccionado
    );


});



// ===============================
// CAMBIAR MES
// ===============================

// Creamos botones si todavía no existen

function crearControlesMes(){


    const titulo =
        document.getElementById("mes");


    const anterior =
        document.createElement("button");


    anterior.innerHTML="◀";


    const siguiente =
        document.createElement("button");


    siguiente.innerHTML="▶";


    anterior.style.marginRight="15px";

    anterior.onclick=function(){

        fechaActual.setMonth(
            fechaActual.getMonth()-1
        );

        generarCalendario();

    };


    siguiente.onclick=function(){

        fechaActual.setMonth(
            fechaActual.getMonth()+1
        );

        generarCalendario();

    };


    titulo.prepend(anterior);

    titulo.appendChild(siguiente);

}


crearControlesMes();



// ===============================
// GUARDAR EN MEMORIA LOCAL
// ===============================

function guardarLocal(){

    localStorage.setItem(
        "guardiasFarmalab",
        JSON.stringify(guardias)
    );

}



// Sobrescribimos el guardado anterior

botonGuardar.addEventListener("click",()=>{

    guardarLocal();

});



// ===============================
// CARGAR DATOS GUARDADOS
// ===============================

function cargarLocal(){

    let datos =
        localStorage.getItem(
            "guardiasFarmalab"
        );


    if(datos){

        guardias = JSON.parse(datos);

    }

}


cargarLocal();

generarCalendario();

/* ==========================================================
   FARMALAB DISPLAY
   admin/admin.js
   PARTE 5C
========================================================== */


// ===============================
// EXPORTAR GUARDIAS
// ===============================

const botonExportar =
document.getElementById("exportar");


botonExportar.addEventListener("click",()=>{


    const archivo = new Blob(

        [
            JSON.stringify(
                guardias,
                null,
                2
            )
        ],

        {
            type:"application/json"
        }

    );


    const enlace =
    document.createElement("a");


    enlace.href =
    URL.createObjectURL(archivo);


    enlace.download =
    "guardias_farmalab.json";


    enlace.click();


});



// ===============================
// IMPORTAR GUARDIAS
// ===============================


const botonImportar =
document.getElementById("btnImportar");


const selectorArchivo =
document.getElementById("importarArchivo");



botonImportar.addEventListener("click",()=>{

    selectorArchivo.click();

});



selectorArchivo.addEventListener("change",
function(e){


    const archivo =
    e.target.files[0];


    if(!archivo){

        return;

    }


    const lector =
    new FileReader();



    lector.onload=function(){

        try{


            guardias =
            JSON.parse(
                lector.result
            );


            guardarLocal();


            generarCalendario();


            alert(
                "Calendario importado correctamente"
            );


        }

        catch(error){


            alert(
                "El archivo no es válido"
            );


        }

    };


    lector.readAsText(archivo);


});

/* ===============================
   BUSCADOR DE FARMACIAS
================================ */


const buscador =
document.getElementById("buscarFarmacia");


buscador.addEventListener("input",()=>{


    let texto =
    buscador.value.toLowerCase();


    selector.innerHTML =
    "<option value=''>Seleccione una farmacia</option>";


    farmacias

    .filter(f=>

        f.nombre
        .toLowerCase()
        .includes(texto)

    )

    .forEach(f=>{


        let opcion =
        document.createElement("option");


        opcion.value=f.id;


        opcion.textContent=
        f.nombre;


        selector.appendChild(opcion);


    });


});

/* ==========================================================
   FARMALAB DISPLAY
   admin/admin.js
   PARTE 5E
========================================================== */


// ===============================
// PREVISUALIZAR FARMACIA
// ===============================


const preview =
document.getElementById("previewFarmacia");


selector.addEventListener("change",()=>{


    let farmacia =
    farmacias.find(
        f=>f.id==selector.value
    );


    if(!farmacia){

        preview.style.display="none";

        return;

    }


    preview.style.display="block";


    preview.innerHTML=`

    <b>${farmacia.nombre}</b>
    <br><br>

    📍 ${farmacia.direccion}

    <br>

    ☎ ${farmacia.telefono}

    <br>

    📱 ${farmacia.whatsapp}

    `;


});



// ===============================
// ELIMINAR GUARDIA
// ===============================


const botonBorrar =
document.getElementById("borrar");



botonBorrar.addEventListener("click",()=>{


    const clave =
    document.getElementById("claveAdmin").value;


    if(clave !== "farmalab2026"){


        alert("Clave incorrecta");

        return;

    }


    if(!diaSeleccionado){


        alert(
        "Seleccione primero un día"
        );


        return;

    }


    delete guardias[diaSeleccionado];


    guardarLocal();


    generarCalendario();


    alert(
    "Guardia eliminada"
    );


});



// ===============================
// SEGURIDAD SIMPLE
// ===============================


window.addEventListener("beforeunload",()=>{


    guardarLocal();


});