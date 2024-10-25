
//Variables configuracion
let configuracion = document.getElementById("configuracion");
let playButton = document.getElementById("playButton");
let ajusteVelocidad = document.getElementById("ajuste_velocidad");
let ajusteElegir = document.getElementById("ajuste_elegir");
let increase_off = document.getElementById("increase_off");
let increase_on = document.getElementById("increase_on");
let maxAlimentoInput = document.getElementById("maxAlimentoInput");



const cargarConfiguracion = () => {
    if ((localStorage.getItem("sound")!=null) && (localStorage.getItem("increase")!=null) && (localStorage.getItem("speed")!=null)) {
        localStorage.setItem("numAlimentos", maxAlimentoInput.value);
        configuracion.style.opacity = "0";
        setTimeout(() => { configuracion.style.display = "none" }, 2000);
        setTimeout(() => { location.href = "../pages/juego.html" }, 2000);
        
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
    (event.target.nodeName == "BUTTON") && event.target.classList.toggle("active"); //If

    //El elemento marcado en on le guardamos en una variable ya que no siempre es el event y lo evaluamos
    let elementoSeleccionado;
    [...event.target.parentElement.children].forEach((hijo) => {
        hijo.classList.contains("active") && (elementoSeleccionado = hijo); //If
    })

    if (elementoSeleccionado) {
        switch (elementoSeleccionado.id) {
            case "sound_on":
                localStorage.setItem("sound", true);
                break;
            case "sound_off":
                localStorage.setItem("sound", false);
                break;
            case "increase_on":
                localStorage.setItem("increase", true);
                break;
            case "increase_off":
                localStorage.setItem("increase", false);
                break;
            case "slow":
                localStorage.setItem("speed", 140);
                break;
            case "medium":
                localStorage.setItem("speed", 110);
                break;
            case "fast":
                localStorage.setItem("speed", 80);
                break;
            case "super-fast":
                localStorage.setItem("speed", 40);
                break;

        }
    }

    increase_off.classList.contains("active") ? ajusteElegir.style.display = "flex" : ajusteElegir.style.display = "none";
}


configuracion.addEventListener("mousedown", marcarOpcionAjustes);
playButton.addEventListener("mousedown", cargarConfiguracion);