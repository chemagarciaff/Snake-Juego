//Juego
let juego = document.getElementById("juego");
let tablero = document.getElementById("tablero");
let contTablero = document.getElementById("contTablero");
let backButton = document.getElementById("back_button");
let puntuacion = document.getElementById("puntuacion");
let score = document.getElementById("score");
let alert = document.getElementById("alert");
let teclasPulsadas = ["ArrowRight"];

let teclaPulsada;
let timer;
let celulas;
let alimentos;
let arrayEstilos = [];
let velocidadSnake;
let longitudSnake = 10;
let contadorVecesComida = 0;

let startColumn = 35;
let endColumn = startColumn - 1;
let startRow = 23;
let endRow = startRow + 1;

let numeroAlimentos = localStorage.getItem("numAlimentos");
let speed = localStorage.getItem("speed");
let sound = localStorage.getItem("sound");
let increase = localStorage.getItem("increase");
const audioComida = new Audio('../assets/sounds/sonidoAlimento.mp3');
const audioChoque = new Audio('../assets/sounds/golpe.mp3');

puntuacion.textContent = ("00" + contadorVecesComida);
score.textContent = "000";

//Funciones
//Funcion para crear la serpiente
const crearSerpiente = () => {
    startColumn = 35;
    endColumn = startColumn - 1;
    startRow = 23;
    endRow = startRow + 1;

    let fragment = document.createDocumentFragment();

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
const borrarSerpiente = () => {
    celulas.forEach(celula => { celula.remove() });
}

//Funcion para mover la serpiente
const mover = (teclaPulsada) => {

    //Creamos un array con cada uno de los cuadrados que forman el cuerpo de la serpiente
    celulas = [...contTablero.children].slice(numeroAlimentos);

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

    comprobarComida();
    comprobrarChoque();
    comprobarLimites();
    comprobarRecord();

    //Vaciamos el array
    arrayEstilos = [];
}

//Comprobar choque con bordes
const comprobarLimites = () => {
    (celulas[0].style.gridRowEnd > 31 || celulas[0].style.gridColumnEnd > 60) && resetear(); //If
}

//Comprobar si se ha superado el score
const comprobarRecord = () => {
    (parseInt(score.textContent) < parseInt(puntuacion.textContent)) && (score.textContent = puntuacion.textContent)
}

//Comprobar si la serpiente se come a si misma
const comprobrarChoque = () => {
    for (let i = 1; i < arrayEstilos.length; i++) {
        (arrayEstilos[i] == celulas[0].style.gridArea) && resetear(); //If
    }
}

const resetear = () => {
    audioChoque.play();
    cambiarAlerta();
    borrarSerpiente();
    teclasPulsadas = ["ArrowRight"];
    longitudSnake = 10;
    contadorVecesComida = 0;
    velocidadesSerpiente();
    puntuacion.textContent = ("00" + contadorVecesComida);
    crearSerpiente();
}

//funcion para comprobar si he comido
const comprobarComida = () => {
    //Comprobamos que la cabeza de la serpiente esta en la misma posicion que el alimento
    alimentos.forEach((alimento) => {
        if (alimento.style.gridArea == celulas[0].style.gridArea) {
            (sound == true) && audioComida.play(); //If
            contadorVecesComida++;
            aumentarVelocidad();
            puntuacion.textContent = ("00" + contadorVecesComida).slice(-3);
            moverAlimento(alimento);
            aumentarSerpiente();
        }
    });
}

const aumentarVelocidad = () => {
    //Si el incrementador esta activado
    if(increase == "true"){
        //Cada multiplo de 3 bajaremos 6 puntos la velocidad
        if (contadorVecesComida % 2 == 0 && velocidadSnake > 40){
            velocidadSnake-=4;
        }
    }
    clearInterval(timer);
    timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
}

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

const moverAlimento = (alimento) => {
    do {
        startAliRow = Math.floor(Math.random() * 31);
        startAliColumn = Math.floor(Math.random() * 60);
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + (startAliRow + 1) + "/" + (startAliColumn - 1);
    } while (celulas.some((celula) => alimento.style.gridArea == celula.style.gridArea))
}

//Tenemos que crear este que es igual que el de arriba pero cambia la condicion porque cuando se usa
// darPosicionAlimento aun no se ha creado el array de celulas
const darPosicionAlimento = (alimento) => {
    do {
        startAliRow = Math.floor(Math.random() * 31);
        startAliColumn = Math.floor(Math.random() * 60);
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + (startAliRow + 1) + "/" + (startAliColumn - 1);
    } while (startAliColumn == 23)
}

const cambiarAlertaManual = (event) => {
    if (event.keyCode == 32) {
        cambiarAlerta();
    }
}

const   cambiarAlerta = () => {
        let tiene = alert.classList.toggle("desaparecer");
        if (!tiene) {
            clearInterval(timer);
        } else {
            timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
        }
}

const añadirMovimiento = (event) => {
    validaMovimiento(event.key);
}

const generarAlimentos = () => {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < numeroAlimentos  ; i++) {
        let alimento = document.createElement("DIV");
        alimento.classList.add("alimento");
        darPosicionAlimento(alimento);
        fragment.appendChild(alimento);
    }
    alimentos = [...fragment.children];
    contTablero.insertBefore(fragment, contTablero.firstElementChild);
}

const eliminarAlimentos = () => {
    alimentos.forEach((alimento) => {
        alimento.remove();
    });
}

const mostrarConfiguracion = () => {
    // eliminarAlimentos();
    // alert.classList.contains("desaparecer") && cambiarAlerta(); //If
    
    location.href ="./configuracion.html";
}

const velocidadesSerpiente = () => {
    increase == "true" ? velocidadSnake = 130 : velocidadSnake = speed; //If
}


const cargaInicial = () => {
    crearSerpiente();
    generarAlimentos();
    velocidadesSerpiente();
}


document.addEventListener("DOMContentLoaded", cargaInicial);
document.addEventListener("keydown", añadirMovimiento);
document.addEventListener("keydown", cambiarAlertaManual);
backButton.addEventListener("mousedown", mostrarConfiguracion);

