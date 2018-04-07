var anchoJoc,
    altoJoc,
    diametroBola,
    velocidadX,
    velocidadY,
    numCols,
    bombas1D = [],
    bombas2D = [],
    numFilas;

function cambiarFondo() {
    if (document.body.className === '') {
        document.body.className = 'rojo';
    } else { document.body.className = ''; }
}
    
function test() {
    setInterval(cambiarFondo, 1000);
}

var estados = { preload: precarga, create: pantalla, update: adaptar },
    tiempo,
    tiempoTexto,
    nivelTexto,
    contadorBombas,
    nivel,
    maxNivel = 10,
    bola,
    objetivo,
    puntos,
    puntosTexto,
    maxTexto,
    barra,
    juego,
    xocultos,
    factorPuntos = 0.0,
    factorTexto,
    avisoTexto,
    tiempoEspera,
    esperaTexto,
    maxPuntos;

var factorDificultad,
    grupoBombas;

function iniciarJuego() {
    juego = new Phaser.Game(anchoJoc, altoJoc, Phaser.CANVAS, 'zonajuegos', estados);
    nivel = 0;
    puntos = 0;
    maxPuntos = 0;
    xocultos = -3 * diametroBola;
    tiempo = 605;
    tiempoEspera = 5;
    factorPuntos = 0.0;
    factorDificultad = 0;
    convertir2d();
}

function calcularFD() { factorDificultad = 300 + (nivel * 50); }

function precarga() {
    juego.stage.backgroundColor = '#b0b0b0';
    juego.load.image('bola', 'imagenes/bola.png');
    juego.load.image('objetivo', 'imagenes/objetivo.png');
    juego.load.image('bomba', 'imagenes/bomba.png');
    juego.load.image('barra', 'imagenes/barra.png');
}

function convertir2d() {
    var indice,
        icol;

//    for (indice = 0; indice < numCols; indice += 1) {
//        aux[indice] = false;
//    }
    for (indice = 0; indice < numFilas; indice += 1) {
        bombas2D[indice] = [];
    }
    for(indice = 0; indice < numFilas; indice += 1) {
        for (icol = 0; icol < numCols; icol += 1) { bombas2D[indice][icol] = false; }
    }
}

function pantalla() {
    var simple = diametroBola + 'px',
        doble = 2 * diametroBola + 'px';

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    bola = juego.add.sprite(0, altoJoc - diametroBola, 'bola');
    bola.width = diametroBola;
    bola.height = diametroBola;
    juego.physics.arcade.enable(bola);
    bola.body.collideWorldBounds = true;
    objetivo = juego.add.sprite((numCols - 1) * 2 * diametroBola, 2 * diametroBola * 0, 'objetivo');
    objetivo.width = 2 * diametroBola;
    objetivo.height = 2 * diametroBola;
    juego.physics.arcade.enable(objetivo);
    grupoBombas = juego.add.group();
    crearBombas();
    barra = juego.add.sprite(0, altoJoc - 2 * diametroBola, 'barra');
    barra.width = anchoJoc;
    barra.height = 5;
    juego.physics.arcade.enable(barra);
    bola.body.onWorldBounds = new Phaser.Signal();
    puntosTexto = juego.add.text(0, 0, 'P: ' + puntos, { fontSize: simple, fill: '#008000' });
    maxTexto = juego.add.text(0, diametroBola, 'R: ' + maxPuntos, { fontSize: simple, fill: '#008000' });
    nivelTexto = juego.add.text(anchoJoc - 4 * diametroBola, altoJoc - 2 * diametroBola, 'N: ' + nivel, { fontSize: simple, fill: '#008000' });
    tiempoTexto = juego.add.text(anchoJoc - 4 * diametroBola, altoJoc - diametroBola, 'T: ' + tiempo, { fontSize: simple, fill: '#008000' });
    factorTexto = juego.add.text(anchoJoc - 4 * diametroBola, altoJoc - 3 * diametroBola, 'Fp: ' + factorPuntos, { fontSize: simple, fill: '#008000' });
    avisoTexto = juego.add.text(0, altoJoc / 2 - diametroBola, 'Nueva Partida.', { fontSize: simple, fill: '#f00000' });
    esperaTexto = juego.add.text(0, altoJoc / 2 + diametroBola, ' ', { fontSize: simple, fill: '#f00000' });
    prepararTodo();
    setInterval(bajarTiempo, 1000);
}

function crearBombas() {
    var indice;
    
    for (indice = 0; indice < numFilas * numCols; indice += 1) {
        bombas1D[indice] = grupoBombas.create(xocultos, 0, 'bomba');
        bombas1D[indice].width = 2 * diametroBola;
        bombas1D[indice].height = 2 * diametroBola;
        juego.physics.arcade.enable(bombas1D[indice]);
    }
}

function prepararTodo() {
    contadorBombas = 0;
    preparar3x3();
    prepararBombas();
}

function preparar3x3() {
    var ifila,
        icol;

    for (ifila = 0; ifila < 3; ifila += 1) {
        for (icol = 0; icol < 3; icol += 1) {
            bombas2D[ifila][numCols - 1 - icol] = true;
        }
    }

    /* [0][numCols - 3];
    [2][numCols - 1]; Colocamos estas dos Bombas.*/

    bombas1D[contadorBombas].position.x = 2 * diametroBola * (numCols - 3);
    bombas1D[contadorBombas].position.y = 2 * diametroBola * 0;
    contadorBombas += 1;
    bombas1D[contadorBombas].position.x = 2 * diametroBola * (numCols - 1);
    bombas1D[contadorBombas].position.y = 2 * diametroBola * 2;
    contadorBombas += 1;
/*    bombas1D[contadorBombas] = juego.add.sprite(0, 0, 'bomba');
    bombas1D[contadorBombas].width = 2 * diametroBola;
    bombas1D[contadorBombas].height = 2 * diametroBola;
    juego.physics.arcade.enable(bombas1D[contadorBombas]);
    contadorBombas += 1;
    bombas2D[0][0] = true;*/
}

function prepararBombas() {
    var ifila,
        icol,
        porCien = 35, /* alrededor de este% de bombas como máximo en cada fila. */
        enEstaFila = [],
        maxEnFilas = 1 + Math.ceil(porCien * numCols  / 100 ),
        maxBombas = 2 + Math.floor(porCien * numCols * (numFilas - 2) * nivel / 100 / maxNivel),
        factorNivel = porCien * nivel; /* ayuda a situar las bombas aleatoriamente. */
    
    for (ifila = 0; ifila < numFilas; ifila += 1) { enEstaFila[ifila] = 0; }
    while (contadorBombas < maxBombas) {
        for (ifila = 1; ifila < numFilas - 1; ifila += 1) {
            if (contadorBombas >= maxBombas) { break; }
            for (icol = 0; icol < numCols; icol += 1) {
                if (enEstaFila[ifila] >= maxEnFilas) { break; }
                if (contadorBombas >= maxBombas) { break; }
                if (!bombas2D[ifila][icol]) { /* No está ocupada */
                    if (Math.floor(Math.random() * 100 * maxNivel) < factorNivel) {
                        bombas1D[contadorBombas].position.x = 2 * diametroBola * icol;
                        bombas1D[contadorBombas].position.y = 2 * diametroBola * ifila;
                        contadorBombas += 1;
                        bombas2D[ifila][icol] = true;
                        enEstaFila[ifila] += 1;
                    }
                }
            }
        }
    }
}

function bajarTiempo() {
    tiempo -= 1;
    tiempoTexto.text = 'T: ' + tiempo;
    if (tiempoEspera >= 0) {
        esperaTexto.text = 'Espera ' + tiempoEspera + 's.';
        barra.height = tiempoEspera;
        tiempoEspera -= 1;
        if (tiempoEspera < 0) { 
            esperaTexto.text = ' ';
            avisoTexto.text = ' '
            calcularFD();
        }
    }
    if (tiempo <= 0) {
        nuevaPartida();
    }
}

function nuevaPartida() {
    nivel = 0;
    puntos = 0;
    tiempo = 605;
    factorPuntos = 0.0;
    factorDificultad = 0;
    inicial();
    tiempoEspera = 5;
    destruirBombas();
    prepararTodo();
}

function adaptar() {
    bola.body.velocity.y = velocidadY * factorDificultad;
    bola.body.velocity.x = velocidadX * (-1 * factorDificultad);

    juego.physics.arcade.overlap(bola, objetivo, subirNivel, null, this);
    juego.physics.arcade.overlap(bola, grupoBombas, choque, null, this);
}

function subirNivel() {
    puntos += Math.ceil(tiempo * (1 + 2 * factorPuntos / maxNivel));
    factorPuntos = Math.min(maxNivel, factorPuntos + 1);
    factorTexto.text = 'Fp: ' + factorPuntos;
    puntosTexto.text = 'P: ' + puntos;
    tiempo += 5;
    tiempoEspera = 5;
    factorDificultad = 0;
    inicial();
    nivel = Math.min(maxNivel, nivel + 1);
    avisoTexto.text = '¡¡¡Bravo!!!'
    nivelTexto.text = 'N: ' + nivel;
    if (puntos > maxPuntos) {
        maxPuntos = puntos;
        maxTexto.text = 'R: ' + maxPuntos;
    }
    destruirBombas();
    prepararTodo();
}

function inicial() {
    bola.position.x = 0;
    bola.position.y = altoJoc - diametroBola;
    barra.height = 5;
}

function choque(bola, bomba) {
    puntos -= 200;
    factorDificultad = 0;
    inicial();
    tiempoEspera = 5;
    factorPuntos = Math.max(0, factorPuntos - 0.5);
    factorTexto.text = 'Fp: ' + factorPuntos;
    puntosTexto.text = 'P: ' + puntos;
    avisoTexto.text = 'Has Chocado.';
    bomba.position.x = xocultos;
}

function destruirBombas() {
    var indice,
        icol;

    for (indice = 0; indice < contadorBombas; indice += 1) {
        bombas1D[indice].position.x = xocultos;
    }
    for (indice = 0; indice < numFilas; indice += 1) {
        for (icol = 0; icol < numCols; icol += 1) {
            bombas2D[indice][icol] = false;
        }
    }
}
