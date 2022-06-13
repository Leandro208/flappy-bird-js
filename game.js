console.log('[Leandro208] Flappy Bird');

let frames = 0;
const hit = new Audio();
hit.src = './efeitos/hit.wav';

const pulo = new Audio();
pulo.src = './efeitos/pulo.wav';

const ponto = new Audio();
ponto.src = './efeitos/ponto.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let recordeUsuario = 0;

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        ctx.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoChao = 1;
            const repete = chao.largura / 2;
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repete;
        },
        desenha() {
            ctx.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            ctx.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };

    return chao;
}


function fazColisao(flappyBird, chao) {
    const flappBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappBirdY >= chaoY) {
        return true;
    }
    return false;
}

function criaflappy() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            pulo.play();
            flappyBird.velocidade = -flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                if (recordeUsuario < globais.placar.pontuacao) {
                    recordeUsuario = globais.placar.pontuacao;
                }
                hit.play();

                mudaTela(Telas.GAME_OVER);
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio

        ],
        frameAtual: 0,
        atualizarframeAtual() {
            const intervaloFrame = 10;
            const passouOIntervalo = frames % intervaloFrame === 0;
            if (passouOIntervalo) {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }

        },
        desenha() {
            flappyBird.atualizarframeAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            ctx.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}



const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        ctx.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
}
//menasgem game over
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        ctx.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h
        );
    }
}

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {

            canos.pares.forEach(function (par) {
                const yRamdom = par.y;
                const canosEspacamento = 90;
                //cano do ceu
                const canoCeuX = par.x;
                const canoCeuY = yRamdom;

                ctx.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )

                //cano chao
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + canosEspacamento + yRamdom;
                ctx.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })

        },
        temColisaoflappy(par) {
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                if (cabecaFlappy <= par.canoCeu.y) {
                    return true;
                }
                if (peFlappy >= par.canoChao.y) {
                    return true;
                }
                ponto.play();



            }

            return false;
        },
        pares: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }
            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoflappy(par)) {
                    if (recordeUsuario < globais.placar.pontuacao) {
                        recordeUsuario = globais.placar.pontuacao;
                    }
                    hit.play();
                    mudaTela(Telas.GAME_OVER)
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });
        }
    }
    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            ctx.font = '35px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
            placar.pontuacao
        },
        atualiza() {
            const intervaloFrame = 20;
            const passouOIntervalo = frames % intervaloFrame === 0;
            if (passouOIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }

        }
    }
    return placar;
}

function criaRecord() {
    const record = {
        desenha() {
            ctx.font = '35px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.fillText(`${recordeUsuario}`, canvas.width - 10, 60);
            recordeUsuario
        }
    }
    return record;
}

//telas
const globais = {};
let telaAtiva = {

};
function mudaTela(novaTela) {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa()) {
        inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaflappy();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.flappyBird.desenha();

            globais.chao.desenha();
            mensagemGetReady.desenha();
        },
        click() {
            mudaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    inicializa() {
        globais.placar = criaPlacar();
        globais.record = criaRecord();
    },
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
        globais.record.desenha();
    },
    click() {

        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();
    }
};

Telas.GAME_OVER = {
    inicializa() {

    },
    desenha() {
        mensagemGameOver.desenha();
    },
    atualiza() {

    },
    click() {
        mudaTela(Telas.INICIO);
    }
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaTela(Telas.INICIO);
loop();