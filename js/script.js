//Intro
let intro = document.getElementById("intro");
let intro_container = document.getElementById("intro__container");
let press_enter = document.getElementById("press-enter");

//Variables configuracion
let ajustes = document.getElementById("ajustes");
let configuracion = document.getElementById("configuracion");
let playButton = document.getElementById("playButton");
let maxAlimentoInput = document.getElementById("maxAlimentoInput");
let ajusteVelocidad = document.getElementById("ajuste_velocidad");
let ajusteElegir = document.getElementById("ajuste_elegir");
let increase_off = document.getElementById("increase_off");
let increase_on = document.getElementById("increase_on");
let backButton = document.getElementById("back_button");
let sound = null;
let increase = null;
let speed = null;
const audioComida = new Audio('../assets/sounds/sonidoAlimento.mp3');
const audioChoque = new Audio('../assets/sounds/golpe.mp3');

//Juego
let juego = document.getElementById("juego");
let tablero = document.getElementById("tablero");
let contTablero = document.getElementById("contTablero");
let puntuacion = document.getElementById("puntuacion");
let score = document.getElementById("score");
let alert = document.getElementById("alert");
let teclasPulsadas = ["ArrowRight"];
let teclaPulsada;
let timer;
let celulas = [];
let alimentos = [];
let numAlimentos;
let arrayEstilos = [];
let velocidadSnake;
let longitudSnake = 10;
let contadorVecesComida = 0;


let startColumn = 35;
let endColumn = startColumn - 1;
let startRow = 23;
let endRow = startRow + 1;

let play = false;

puntuacion.textContent = ("00" + contadorVecesComida);
score.textContent = "000";



//AQUI ESTAN LAS FUNCIONES

//Funcion para generar los efectos iniciales de ampliacion de la imagen y desvanecimiento
const efectosIniciales = () => {

    intro_container.classList.add("zoomInicial");
    setTimeout(() => { press_enter.classList.add("parpadeo") }, 2500)
    
}

const ocultarVentana = (event) => {
    if(event.key == "Enter"){   
        intro.style.opacity = "0";
        setTimeout(() => { intro.style.display = "none" }, 2000);
    }
}


//Funcion para controlar los ajustes seleccionados y dar el valor
//correspondiente a las variables de sonido, velocidad y numero de alimentos
const marcarOpcionAjustes = (event) => {

    //Si marcamos uno se quita el otro
    [...event.target.parentElement.children].forEach((hijo) => {
        if(hijo.classList.contains("active") && hijo != event.target){
            hijo.classList.remove("active");
        }
    });

    //Cada vez que pulsamos se activa y se desactiva
    if (event.target.nodeName == "BUTTON") {
        event.target.classList.toggle("active");
    }

    //El elemento marcado en "on" le guardamos en una variable ya que no siempre coincide
    //con el event
    let elementoSeleccionado;
    let contador = 0;
    [...event.target.parentElement.children].forEach((hijo) => {
        if (hijo.classList.contains("active")) {
            elementoSeleccionado = hijo;
            contador++;
        }

        if(contador == 0){
            if(event.target.id == "increase_on" || event.target.id == "increase_off"){
                increase = null;
            }
            if(event.target.id == "sound_on" || event.target.id == "sound_off"){
                sound = null;
            }
            if(event.target.id == "slow" || event.target.id == "medium" || event.target.id == "fast" || event.target.id == "super-fast"){
                speed = null;
            }

        }
    })

    //Evaluamos ese elemento seleccionado
    if (elementoSeleccionado) {
        switch (elementoSeleccionado.id) {
            case "sound_on":
                sound = true;
                break;
            case "sound_off":
                sound = false;
                break;
            case "increase_on":
                increase = true;
                break;
            case "increase_off":
                increase = false
                break;
            case "slow":
                speed = 140;
                break;
            case "medium":
                speed = 110;
                break;
            case "fast":
                speed = 80;
                break;
            case "super-fast":
                speed = 40;
                break;

        }
    }

    //Muestra u oculta la opcion de elegir la velocidad en funcion de
    //si se elige la opcion de no aumentar la velocidad
    if(increase_off.classList.contains("active")){
        ajusteElegir.style.display = "flex";
    }else {
        ajusteElegir.style.display = "none";
    }
}

//Funcion para dar un valor a la variable velocidadSnake en funcion de si
//se eligio la opcion "aumentar velocidad" o "no aumentar velocidad"
const velocidadesSerpiente = () => {

    if(increase){
        velocidadSnake = 130;
    }else if(!increase){
        velocidadSnake = speed;
    }
}


//Funcion para aumentar la velocidad de la serpiente cada vez que come.
//Solo se llama si la opcion seleccionada fue "aumentar velocidad"
const aumentarVelocidad = () => {

    //Cada multiplo de 2 bajaremos 3 puntos la velocidad
    if(contadorVecesComida % 2 == 0 && velocidadSnake > 40){
        velocidadSnake-=3;
    }
    clearInterval(timer);
    timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
}



//Funcion para crear la serpiente
const generarSerpiente = () => {

    //Valores iniciales
    startColumn = 35;
    endColumn = startColumn - 1;
    startRow = 23;
    endRow = startRow + 1;

    let fragment = document.createDocumentFragment();

    //Creamos la serpiente en funcion de la longitud que le damos
    for (let i = 0; i < longitudSnake; i++) {
        let snake = document.createElement("DIV");
        snake.style.gridArea = startRow + "/" + (startColumn - i) + "/" + (startRow + 1) + "/" + (startColumn - 1 - i);
        if (i == 0) {
            snake.classList.add("colorCabeza");
        } else {
            snake.classList.add("colorCuerpo");
        }
        fragment.appendChild(snake);
    }
    contTablero.appendChild(fragment);
}


//Funcion para borrar la serpiente
const borrarSerpiente = () => celulas.forEach(celula => {celula.remove() });

//Funcion para borrar los alimentos
const borrarAlimentos = () => alimentos.forEach(alimento => {alimento.remove() });


//Funcion para mover la serpiente
const mover = (teclaPulsada) => {

    //Creamos un array con cada uno de los cuadrados que forman el cuerpo de la serpiente
    celulas = [...contTablero.children].slice(numAlimentos);

    //Guardamos los estilos de cada uno de los cuadrados en un array para usarlos luego
    celulas.forEach(celula => {
        arrayEstilos.push(celula.style.gridArea);
    });

    //Segun la tecla pulsada cambiamos la posicion del primer cuadrado
    switch (teclaPulsada) {
        case "ArrowRight":
            startColumn += 1;
            endColumn += 1;
            break;
        case "ArrowLeft":
            startColumn -= 1;
            endColumn -= 1;
            break;
        case "ArrowUp":
            startRow -= 1;
            endRow -= 1;
            break;
        case "ArrowDown":
            startRow += 1;
            endRow += 1;
            break;
    }

    //Damos la nueva posicion a cada cuadrado con el array de estilos
    for (let i = 0; i < celulas.length; i++) {
        if (i == 0) {
            celulas[i].style.gridArea = startRow + "/" + (startColumn) + "/" + endRow + "/" + (endColumn);
        } else {
            celulas[i].style.gridArea = arrayEstilos[i - 1];
        }
    }

    //Evaluamos la situacion
    comprobarComida();
    comprobrarChoque();
    comprobarLimites();
    comprobarRecord();

    //Vaciamos el array
    arrayEstilos = [];
}


//Comprobar choque con bordes
const comprobarLimites = () => {

    if (celulas[0].style.gridRowEnd > 31 || celulas[0].style.gridColumnEnd > 60) {
        resetear();
    }
}

//Comprobar choque consigo misma
const comprobrarChoque = () => {

    for (let i = 1; i < arrayEstilos.length; i++) {
        if (arrayEstilos[i] == celulas[0].style.gridArea) {
            resetear();
        }
    }
}

//Comprobar si se ha superado el score
const comprobarRecord = () => {

    if (parseInt(score.textContent) < parseInt(puntuacion.textContent)) {
        score.textContent = puntuacion.textContent;
    }
}

//Comprobar si ha comido
const comprobarComida = () => {

    //Comprobamos que la cabeza de la serpiente esta en la misma posicion que el alimento
    alimentos.forEach((alimento) => {

        if (alimento.style.gridArea == celulas[0].style.gridArea) {

            contadorVecesComida++;
            if(sound){
                audioComida.play();
            }
            if(increase){
                aumentarVelocidad();
            }
            puntuacion.textContent = ("00" + contadorVecesComida).slice(-3);
            moverAlimento(alimento);
            aumentarSerpiente();
        }
    });
}

//Funcion para volver al punto inicial de la partida
const resetear = () => {

    clearInterval(timer);
    if (sound) {
        audioChoque.play();
    }
    contTablero.classList.add("choqueSerpiente");
    
    setTimeout(() => {
        
        cambiarAlerta();
        velocidadesSerpiente();
        borrarSerpiente();
        generarSerpiente();
        teclasPulsadas = ["ArrowRight"];
        longitudSnake = 10;
        contadorVecesComida = 0;
        puntuacion.textContent = ("00" + contadorVecesComida);
        contTablero.classList.remove("choqueSerpiente");
    }, 3000)
}


//Funcion para aumentar la serpiente una celula mas cuando come.
const aumentarSerpiente = () => {

    let celulaNueva = document.createElement("DIV");
    celulaNueva.classList.add("colorCuerpo");
    celulaNueva.style.gridArea = celulas[celulas.length - 1].style.gridArea;
    contTablero.appendChild(celulaNueva);
}


//Funcion para validar movimientos. Validamos que la flecha se puede pulsar
//Por ejemplo si estamos yendo a la derecha, no se puede ir hacia la
//izquierda directamente. Tendrias que ir arriba o abajo primero.
const validaMovimiento = (teclapulsada) => {

    if ((teclapulsada == "ArrowRight" || teclapulsada == "ArrowLeft") && (teclasPulsadas.slice(-1) == "ArrowUp" || teclasPulsadas.slice(-1) == "ArrowDown")) {
        teclasPulsadas.push(teclapulsada);

    } else if ((teclapulsada == "ArrowUp" || teclapulsada == "ArrowDown") && (teclasPulsadas.slice(-1) == "ArrowLeft" || teclasPulsadas.slice(-1) == "ArrowRight")) {
        teclasPulsadas.push(teclapulsada);
    }
}


//Funcion para dar una nueva posicion al alimento. 
const moverAlimento = (alimento) => {

    do {
        startAliRow = Math.floor(Math.random() * 30) + 1;
        startAliColumn = Math.floor(Math.random() * 60) + 2;
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + (startAliRow + 1) + "/" + (startAliColumn - 1);
    } while (celulas.some((celula) => alimento.style.gridArea == celula.style.gridArea))
}


//Tenemos que crear este que es igual que el de arriba pero cambia la condicion porque cuando se usa
// darPosicionAlimento aun no se ha creado el array de celulas
const darPosicionAlimento = (alimento) => {

    do {
        startAliRow = Math.floor(Math.random() * 30) + 1;
        startAliColumn = Math.floor(Math.random() * 60) + 2;
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + (startAliRow + 1) + "/" + (startAliColumn - 1);
    } while (alimento.style.startRow == 23)
}


//Para parar el juego manualmente
const cambiarAlertaManual = (event) => {

    if (event.keyCode == 32) {
        cambiarAlerta();
    }
}

//funcion para mostrar u ocultar  el mensaje de alerta
const cambiarAlerta = () => {

    if (play) {

        let tiene = alert.classList.toggle("desaparecer"); //Si esta en medio de la partida tiene=false, else tiene=true
        if (!tiene) {
            clearInterval(timer);
        } else {
            timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
        }
    }
}

const añadirMovimiento = (event) => {

    validaMovimiento(event.key);
}


//Funcion para crear los alimentos que hayamos indicado
const generarAlimentos = () => {

    numAlimentos = maxAlimentoInput.value;
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < numAlimentos; i++) {
        let alimento = document.createElement("DIV");
        alimento.classList.add("alimento");
        darPosicionAlimento(alimento);
        fragment.appendChild(alimento);
    }
    alimentos = [...fragment.children];
    contTablero.insertBefore(fragment, contTablero.firstElementChild);
}




//Funcion que comprueba si los ajustes necesarios para el juego se han seleccionado
//Si es asi, carga los datos de configuracion y prepara el juego para ser jugado.
const cargarConfiguracion = () => {

    if ((sound!=null) && ((increase==true) || ((increase==false) && (speed!=null)))) {

        generarSerpiente();
        generarAlimentos();
        velocidadesSerpiente();
        quitarBotonesPulsados();
        configuracion.style.opacity = "0";
        setTimeout(() => { configuracion.style.display = "none" }, 1000);
        play = true;
    }
}


//Funcion para que una vez cargados los ajustes los botones se queden sin marcar 
//por si volvemos a la pantalla de ajustes
const quitarBotonesPulsados = () => {
    
    [...ajustes.children].forEach((hijo, index) => {
        if(index < 2) {

            [...hijo.firstElementChild.nextElementSibling.children].forEach(boton => {
                if(boton.classList.contains("active")){
                    boton.classList.remove("active");
                }
            })
        }
    })
    ajusteElegir.style.display = "none";
}


//Funcion para parar el juego y poner las variables de los ajustes a null.
//Quita los botones marcados en los ajustes en la partida anterior.
const volverConfiguracion = () => {

    if(celulas.length!=0){borrarAlimentos()};
    borrarSerpiente();

    if(alert.classList.contains("desaparecer")){

        cambiarAlerta();
    }

    play = false;
    sound = null;
    increase = null;
    
    configuracion.style.display = "flex";
    configuracion.style.opacity = "1";
}






document.addEventListener("DOMContentLoaded", efectosIniciales);
document.addEventListener("keydown", ocultarVentana)
configuracion.addEventListener("mousedown", marcarOpcionAjustes);
playButton.addEventListener("mousedown", cargarConfiguracion);
document.addEventListener("keydown", añadirMovimiento);
backButton.addEventListener("mousedown", volverConfiguracion);
document.addEventListener("keydown", cambiarAlertaManual);




