
var app = {
    inicio: function () {
        anchoJoc = document.documentElement.clientWidth;
        altoJoc = document.documentElement.clientHeight;
        altoJoc -= 20;
        app.calcularEscala();
        app.activarDispositivo();
        app.ajustarZona();
        iniciarJuego();
        test();
    },
    
    calcularEscala: function () {
        var minimo = Math.min(anchoJoc, altoJoc),
            minDiam = 25,
            maxDiam = 50;
        
        diametroBola = Math.round(minimo / 20);
        if (diametroBola < minDiam) {
            diametroBola = minDiam;
        } else {
            if (diametroBola > maxDiam) {
                diametroBola = maxDiam;
            }
        }
    },

    activarDispositivo: function () {
        navigator.accelerometer.watchAcceleration(app.siCorrecto, app.siError, { frequency: 10 });
    },

    siError: function () {
        alert('Error en el dispositivo.');
    },

    siCorrecto: function (datosAcc) {
        app.detectarAgitar(datosAcc);
        app.calcularDirec(datosAcc);
    },

    detectarAgitar: function (datosAcc) {
        var minAg = 10,
            agitaX = (Math.abs(datosAcc.x) > minAg),
            agitaY = (Math.abs(datosAcc.y) > minAg);

        if (agitaX || agitaY) {
            document.body.className = 'agitado';
            nuevaPartida();
        }
    },
    
    calcularDirec: function (datosAcc) {
        velocidadX = datosAcc.x;
        velocidadY = datosAcc.y;
    },
 
    ajustarZona: function () {
        var altoFila = 2 * diametroBola,
            anchoCol = altoFila;
        
        numCols = Math.floor(anchoJoc / anchoCol);
        anchoJoc = numCols * anchoCol;
        numFilas = Math.floor(altoJoc / altoFila);
        altoJoc = numFilas * altoFila;
    }
};


//app.inicio();

if (document.hasOwnProperty('addEventListener')) {
    document.addEventListener('deviceready', app.inicio, false);
}
