let intro = document.getElementById("intro");
let configuracion = document.getElementById("configuracion");
let juego = document.getElementById("juego");

//container1
let img_principal = document.getElementById("img_principal");
let playButton = document.getElementById("playButton");

//container2
let tablero = document.getElementById("tablero");
let contTablero = document.getElementById("contTablero");
let puntuacion = document.getElementById("puntuacion");
let score = document.getElementById("score");
let alert = document.getElementById("alert");

let maxAlimentoInput = document.getElementById("maxAlimentoInput");

//Variables
let startColumn = 35;
let endColumn = startColumn-1;
let startRow = 23;
let endRow = startRow+1;


let longitudSnake = 10;
let contadorPulsaciones = 0;
let contadorVecesComida = 0;

let teclasPulsadas = ["ArrowRight"];
let teclaPulsada;
let timer;
let celulas;
let alimentos;
let numAlimentos;
let arrayEstilos = [];

let play = false;
let primeraJugada = false;


puntuacion.textContent = ("00" + contadorVecesComida);
score.textContent = "000";
//Funciones

//Funcion para crear la serpiente
const crearSerpiente = () => {
    startColumn = 35;
    endColumn = startColumn-1;
    startRow = 23;
    endRow = startRow+1;

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < longitudSnake; i++) {
        let snake = document.createElement("DIV");
        snake.style.gridArea = startRow + "/" + (startColumn-i) + "/" + endRow + "/" + (endColumn-i);
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
    celulas.forEach(celula => {celula.remove()});
}



//Funcion para mover la serpiente
const mover = (teclaPulsada) => {



    //Creamos un array con cada uno de los cuadrados que forman el cuerpo de la serpiente
    celulas = [...contTablero.children].slice(numAlimentos);
    console.log(celulas);

    //Guardamos los estilos de cada uno de los cuadrados en un array para usarlos luego
    celulas.forEach(celula => {
        arrayEstilos.push(celula.style.gridArea);
    });


    //corregirErrorSolapamiento();

    //Segun la tecla pulsada cambiamos la posicion del primer cuadrado
    switch(teclaPulsada){
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
        if(i == 0){
            celulas[i].style.gridArea = startRow + "/" + (startColumn) + "/" + endRow + "/" + (endColumn);
        }else{
            celulas[i].style.gridArea = arrayEstilos[i-1];
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
const comprobarLimites= () => {
    if(celulas[0].style.gridRowEnd > 31 || celulas[0].style.gridColumnEnd > 60){
        resetear();
    }
}

//Comprobar si se ha superado el score
const comprobarRecord = () => {
    if(parseInt(score.textContent)<parseInt(puntuacion.textContent)){
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
    cambiarAlerta();
    borrarSerpiente();
    teclasPulsadas = ["ArrowRight"];
    longitudSnake = 10;
    contadorPulsaciones=0;
    contadorVecesComida = 0;
    puntuacion.textContent = ("00" + contadorVecesComida);
    crearSerpiente();
   }

//funcion para comprobar si he comido
const comprobarComida = () => {
    //Comprobamos que la cabeza de la serpiente esta en la misma posicion que el alimento
    alimentos.forEach((alimento) => {
        
        if (alimento.style.gridArea == celulas[0].style.gridArea) {
            contadorVecesComida++;
            puntuacion.textContent = ("00"+contadorVecesComida).slice(-3);
            moverAlimento(alimento);
            aumentarSerpiente();
        }
    });
}


const aumentarSerpiente = () => {
    let celulaNueva = document.createElement("DIV");
    celulaNueva.classList.add("colorCuerpo");
    celulaNueva.style.gridArea = celulas[celulas.length-1].style.gridArea;
    contTablero.appendChild(celulaNueva);
}

//Funcion para validar movimientos
const validaMovimiento = (teclapulsada) => {


    //Validamos que la flecha se puede pulsar
    //Por ejemplo si estamos yendo a la derecha, no se puede ir hacia la
    //izquierda directamente. Tendrias que ir arriba o abajo primero.
    if(teclapulsada == "ArrowRight" && (teclasPulsadas.slice(-1) == "ArrowUp" || teclasPulsadas.slice(-1) == "ArrowDown")){
        teclasPulsadas.push(teclapulsada);

    }else if (teclapulsada == "ArrowLeft" && (teclasPulsadas.slice(-1) == "ArrowUp" || teclasPulsadas.slice(-1) == "ArrowDown")) {
        teclasPulsadas.push(teclapulsada);

    }else if (teclapulsada == "ArrowUp" && (teclasPulsadas.slice(-1) == "ArrowLeft" || teclasPulsadas.slice(-1) == "ArrowRight")) {
        teclasPulsadas.push(teclapulsada);

    }else if (teclapulsada == "ArrowDown" && (teclasPulsadas.slice(-1) == "ArrowLeft" || teclasPulsadas.slice(-1) == "ArrowRight")) {
        teclasPulsadas.push(teclapulsada);
    }


}


//Metodo que inicia el juego al pulsar cualquier tecla
const jugar = (event) => {

    if(play){
        validaMovimiento(event.key);
        if(primeraJugada){


            //El intervalo comienza con la primera pulsación y cada vez que se refresque se actualiza con la ultima tecla tocada
            timer = setInterval(() => mover(teclasPulsadas[teclasPulsadas.length - 1]), 100);
            primeraJugada = false;
        }
    }

}



const moverAlimento = (alimento) => {
        
        do{
            startAliRow = Math.floor(Math.random()*31);
            endAliRow = startAliRow + 1;
            startAliColumn = Math.floor(Math.random()*60);
            endAliColumn = startAliColumn - 1;
            alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + endAliRow + "/" + endAliColumn;
            
        }while(celulas.some((celula) => alimento.style.gridArea == celula.style.gridArea))
    }



const darPosicionAlimento = (alimento) => {
    startAliRow = Math.floor(Math.random()*31);
    endAliRow = startAliRow + 1;
    startAliColumn = Math.floor(Math.random()*60);
    endAliColumn = startAliColumn - 1;
    alimento.style.gridArea = startAliRow + "/" + startAliColumn + "/" + endAliRow + "/" + endAliColumn;
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
        }else{
            primeraJugada = true;
        }

}


const efectosIniciales = () => {
    img_principal.style.transform = "scale(17)";  // En tres segundos desde el dom la imagen aumenta
    setTimeout(() => {intro.style.opacity = "0"}, 4500); // En 4,5 segundos desde el dom la imagen se empieza a desvaneces
    setTimeout(() => {intro.style.display = "none"}, 6500);
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

const cargarConfiguracion = () => {
    generarAlimentos();
}

const mostrarPantallaJuego = () => {
    cargarConfiguracion();
    configuracion.style.opacity = "0";
    setTimeout(() => {configuracion.style.display = "none"}, 2000);
    play = true;
}


document.addEventListener("DOMContentLoaded", efectosIniciales);
document.addEventListener("DOMContentLoaded", crearSerpiente);
playButton.addEventListener("click", mostrarPantallaJuego);
document.addEventListener("keydown", cambiarAlertaManual);
document.addEventListener("keydown", jugar);
