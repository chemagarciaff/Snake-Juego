

//Intro
let intro = document.getElementById("intro");
let img_principal = document.getElementById("img_principal");


//Configuration
let configuracion = document.getElementById("configuracion");
let playButton = document.getElementById("playButton");
let maxAlimentoInput = document.getElementById("maxAlimentoInput");
let ajusteVelocidad = document.getElementById("ajuste_velocidad");
let ajusteElegir = document.getElementById("ajuste_elegir");
let increase_off = document.getElementById("increase_off");
let increase_on = document.getElementById("increase_on");
//Variables configuracion
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


//Variables
let startColumn = 35;
let endColumn = startColumn - 1;
let startRow = 23;
let endRow = startRow + 1;


let longitudSnake = 10;
let contadorVecesComida = 0;

let teclasPulsadas = ["ArrowRight"];
let teclaPulsada;
let timer;
let celulas;
let alimentos;
let numAlimentos;
let arrayEstilos = [];
let velocidadSnake;



let play = false;
let primeraJugada = false;


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
        snake.style.gridArea = startRow + "/" + (startColumn - i) + "/" + endRow + "/" + (endColumn - i);
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
    celulas = [...contTablero.children].slice(numAlimentos);

    //Guardamos los estilos de cada uno de los cuadrados en un array para usarlos luego
    celulas.forEach(celula => {
        arrayEstilos.push(celula.style.gridArea);
    });


    //corregirErrorSolapamiento();

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
    if (celulas[0].style.gridRowEnd > 31 || celulas[0].style.gridColumnEnd > 60) {
        resetear();
    }
}


//Comprobar si se ha superado el score
const comprobarRecord = () => {
    if (parseInt(score.textContent) < parseInt(puntuacion.textContent)) {
        score.textContent = puntuacion.textContent;
    }
}


//Comprobar si la serpiente se come a si misma
const comprobrarChoque = () => {
    for (let i = 1; i < arrayEstilos.length; i++) {
        if (arrayEstilos[i] == celulas[0].style.gridArea) {
            resetear();
        }

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
            if(sound == true){
                audioComida.play();
            }
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
    if(increase == true){
        //Cada multiplo de 3 bajaremos 6 puntos la velocidad
        if(contadorVecesComida % 2 == 0 && velocidadSnake > 40){
            velocidadSnake-=4;
        }
    }
    clearInterval(timer);
    velocidadSnake--;
    timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
}


const aumentarSerpiente = () => {
    let celulaNueva = document.createElement("DIV");
    celulaNueva.classList.add("colorCuerpo");
    celulaNueva.style.gridArea = celulas[celulas.length - 1].style.gridArea;
    contTablero.appendChild(celulaNueva);
}


//Funcion para validar movimientos
const validaMovimiento = (teclapulsada) => {


    //Validamos que la flecha se puede pulsar
    //Por ejemplo si estamos yendo a la derecha, no se puede ir hacia la
    //izquierda directamente. Tendrias que ir arriba o abajo primero.
    if (teclapulsada == "ArrowRight" && (teclasPulsadas.slice(-1) == "ArrowUp" || teclasPulsadas.slice(-1) == "ArrowDown")) {
        teclasPulsadas.push(teclapulsada);

    } else if (teclapulsada == "ArrowLeft" && (teclasPulsadas.slice(-1) == "ArrowUp" || teclasPulsadas.slice(-1) == "ArrowDown")) {
        teclasPulsadas.push(teclapulsada);

    } else if (teclapulsada == "ArrowUp" && (teclasPulsadas.slice(-1) == "ArrowLeft" || teclasPulsadas.slice(-1) == "ArrowRight")) {
        teclasPulsadas.push(teclapulsada);

    } else if (teclapulsada == "ArrowDown" && (teclasPulsadas.slice(-1) == "ArrowLeft" || teclasPulsadas.slice(-1) == "ArrowRight")) {
        teclasPulsadas.push(teclapulsada);
    }


}


//Metodo que inicia el juego al pulsar cualquier tecla
const jugar = (event) => {

    if (play) {
        validaMovimiento(event.key);
        if (primeraJugada) {
            //El intervalo comienza con la primera pulsación y cada vez que se refresque se actualiza con la ultima tecla tocada
            timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), velocidadSnake);
            primeraJugada = false;
        }
    }

}


const moverAlimento = (alimento) => {
    do {
        startAliRow = Math.floor(Math.random() * 31);
        endAliRow = startAliRow + 1;
        startAliColumn = Math.floor(Math.random() * 60);
        endAliColumn = startAliColumn - 1;
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + endAliRow + "/" + endAliColumn;

    } while (celulas.some((celula) => alimento.style.gridArea == celula.style.gridArea) || alimento.style.gridArea == 0 / 0 / 0 / 0)
}


const darPosicionAlimento = (alimento) => {
    do {
        startAliRow = Math.floor(Math.random() * 31);
        endAliRow = startAliRow + 1;
        startAliColumn = Math.floor(Math.random() * 60);
        endAliColumn = startAliColumn - 1;
        alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + endAliRow + "/" + endAliColumn;
    } while (alimento.style.gridArea == 0 / 0 / 0 / 0)

}


const cambiarAlertaManual = (event) => {
    if (event.keyCode == 32) {
        cambiarAlerta();
    }
}


const cambiarAlerta = () => {
    let tiene = alert.classList.toggle("desaparecer");
    if (!tiene) {
        clearInterval(timer);
        primeraJugada = false;
    } else {
        primeraJugada = true;
    }

}


const efectosIniciales = () => {
    img_principal.style.transform = "scale(17)";  // En tres segundos desde el dom la imagen aumenta
    setTimeout(() => { intro.style.opacity = "0" }, 1500); // En 4,5 segundos desde el dom la imagen se empieza a desvaneces
    setTimeout(() => { intro.style.display = "none" }, 3500);
    ajusteElegir.style.display = "none";
}

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


const velocidadesSerpiente = () => {
    if(increase){
        velocidadSnake = 130;
    }else if(!increase){
        velocidadSnake = speed;
    }
}

const cargarConfiguracion = () => {
    generarAlimentos();
    velocidadesSerpiente();
}

const mostrarPantallaJuego = () => {
  
    if ((sound!=null) && (increase!=null) && (speed!=null)) {
        console.log(speed)
        cargarConfiguracion();
        configuracion.style.opacity = "0";
        setTimeout(() => { configuracion.style.display = "none" }, 2000);
        play = true;
    }
}

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

    //El elemento marcado el guardamos en una variable ya
    //que no siempre es el event y lo evaluamos
    let elementoSeleccionado;
    [...event.target.parentElement.children].forEach((hijo) => {
        if (hijo.classList.contains("active")) {
            elementoSeleccionado = hijo;
        }
    })
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
}

const mostrarVelocidades = (event) => {
    if(!increase_off.classList.contains("active")){
        ajusteElegir.style.display = "flex";
    }else {
        ajusteElegir.style.display = "none";
    }
}


document.addEventListener("DOMContentLoaded", efectosIniciales);
document.addEventListener("DOMContentLoaded", crearSerpiente);
document.addEventListener("keydown", cambiarAlertaManual);
document.addEventListener("keydown", jugar);
configuracion.addEventListener("mousedown", marcarOpcionAjustes);
ajusteVelocidad.addEventListener("mousedown", mostrarVelocidades);
playButton.addEventListener("mousedown", mostrarPantallaJuego);