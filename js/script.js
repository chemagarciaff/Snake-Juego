//Intro
let intro = document.getElementById("intro");
let img_principal = document.getElementById("img_principal");

const efectosIniciales = () => {
    img_principal.style.transform = "scale(17)";  // En tres segundos desde el dom la imagen aumenta
    setTimeout(() => { intro.style.opacity = "0" }, 1500); // En 4,5 segundos desde el dom la imagen se empieza a desvaneces
    setTimeout(() => { intro.style.display = "none" }, 3500);
    setTimeout(() => { location.href = "./pages/configuracion.html"}, 3500);
}

document.addEventListener("DOMContentLoaded", efectosIniciales);
