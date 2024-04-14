var font;
let imgFullscreen;
let imgRing, imgSquare, imgAngel, imgDemon;
let imgRuneA, imgRuneB, imgRuneC, imgRuneD, imgRuneE, imgRuneF, imgRuneG, imgRuneH;
const objs = [];
var square1, square2, square3, square4, square5;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
var selected;
let isFullscreen = false;
let nextLetters = shuffle([...letters]);
let imgLetterA, imgLetterB, imgLetterC, imgLetterD, imgLetterE, imgLetterF, imgLetterG, imgLetterH;
let score = 0;

const formulas = [
    createFormula(2),
    createFormula(2),
    createFormula(2),
    createFormula(3),
    createFormula(3),
    createFormula(3),
    createFormula(4),
    createFormula(4),
    createFormula(4),
    createFormula(5),
    createFormula(5),
    createFormula(5),
    createFormula(5),
]

removeFormula = false;

function setup() {
    font = loadFont('assets/cloude.ttf');

    createCanvas(1324, 762);
    imgFullscreen = loadImage('assets/fullscreen.png');
    imgRing = loadImage('assets/ring.png');
    imgSquare = loadImage('assets/square.png');
    imgAngel = loadImage('assets/angel.png');
    imgDemon = loadImage('assets/demon.png');

    imgRuneA = loadImage('assets/runeA.png');
    imgRuneB = loadImage('assets/runeB.png');
    imgRuneC = loadImage('assets/runeC.png');
    imgRuneD = loadImage('assets/runeD.png');
    imgRuneE = loadImage('assets/runeE.png');
    imgRuneF = loadImage('assets/runeF.png');
    imgRuneG = loadImage('assets/runeG.png');
    imgRuneH = loadImage('assets/runeH.png');

    imgLetterA = loadImage('assets/letterA.png');
    imgLetterB = loadImage('assets/letterB.png');
    imgLetterC = loadImage('assets/letterC.png');
    imgLetterD = loadImage('assets/letterD.png');
    imgLetterE = loadImage('assets/letterE.png');
    imgLetterF = loadImage('assets/letterF.png');
    imgLetterG = loadImage('assets/letterG.png');
    imgLetterH = loadImage('assets/letterH.png');

    drawingContext.imageSmoothingEnabled = false;

    objs.push(createDemon(3));

    square1 = createSquare(56, 0);
    square2 = createSquare(312, 0);
    square3 = createSquare(0, 240);
    square4 = createSquare(376, 240);
    square5 = createSquare(184, 376);
    objs.push(square1);
    objs.push(square2);
    objs.push(square3);
    objs.push(square4);
    objs.push(square5);

    for (let i = 0; i < 14; i++)
        objs.unshift(createRune(500 + Math.random() * 700, Math.random() * 350, randomLetter(0)));

}


function draw() {
    textFont(font);
    fill(color(22, 22, 23, 255));
    rect(0, 0, width, height);

    fill(color(122, 22, 23, 255));
    const text2 = "SCORE: " + score;
    if (formulas.length === 0) {
        textSize(500);
        const text1 = "YOU LOSE";
        text(text1, width / 2 - textWidth(text1) / 2, height / 3);
        textSize(300);
        text(text2, width / 2 - textWidth(text2) / 2, height / 2);
        return;
    }

    textSize(100);
    text(text2, width - textWidth(text2) - 20, 50);

    image(imgRing, 0, 0, 440, 440);

    gameStep();

    for (let i = objs.length - 1; i >= 0; i--) {
        const o = objs[i];
        if (o.step) o.step();
        if (o.render) o.render();
        if (o.remove) objs.splice(i, 1);
    }

    if (removeFormula) {
        removeFormula = false;
        formulas.splice(0, 1);
    }
    for (let i = formulas.length - 1; i >= 0; i--) {
        const o = formulas[i];
        o.render(i);
    }

    image(imgFullscreen, width - 32, height - 32, 32, 32);
}

let angelTimer = 50;
let angelsSpawned = 0;
function gameStep() {
    angelTimer--;
    if (angelTimer <= 0) {
        angelsSpawned++;
        angelTimer = 800 + Math.random() * 500 - Math.min(1200, angelsSpawned * 10);
        if (angelsSpawned < 5)
            objs.push(createAngel(1));
        else if (angelsSpawned < 10)
            objs.push(createAngel(1 + Math.floor(Math.random() * 2)));
        else if (angelsSpawned < 25)
            objs.push(createAngel(1 + Math.floor(Math.random() * 3)));
        else if (angelsSpawned < 50)
            objs.push(createAngel(1 + Math.floor(Math.random() * 4)));
        else
            objs.push(createAngel(2 + Math.floor(Math.random() * 6)));
    }
}

function createDemon(hp) {
    const obj = {};
    obj.type = "demon";
    obj.hp = hp;
    obj.x = 156;
    obj.y = 100;
    obj.w = 128;
    obj.h = 128;
    obj.step = () => {

        for (let i = 0; i < objs.length; i++) {
            const o = objs[i];

            if (o.type !== "angel") continue;
            if (obj.x > o.x)
                obj.x--;
            if (obj.y > o.y)
                obj.y--;
            if (obj.x < o.x)
                obj.x++;
            if (obj.y < o.y)
                obj.y++;
            if (Math.abs(obj.x - o.x) < 2 && Math.abs(obj.y - o.y) < 2) {
                const n = Math.floor(Math.random() * 7)
                for (let i = 0; i < n; i++) {
                    const dx = Math.random() * obj.w;
                    const dy = Math.random() * obj.h;
                    objs.push(createRune(o.x + dx, o.y + dy));
                }
                const dmg = obj.hp;
                obj.hp -= o.hp;
                o.hp -= dmg;
                if (obj.hp <= 0)
                    obj.remove = true;
                if (o.hp <= 0) {
                    score += o.maxHp;
                    o.remove = true;
                }
            }
            return;
        }

    };
    obj.render = () => {
        image(imgDemon, obj.x, obj.y, obj.w, obj.h);
        fill(color(255, 55, 55));
        textSize(100);
        text(obj.hp + "/" + hp, obj.x + 30, obj.y);
    }
    return obj;
}

function createAngel(hp) {
    const obj = {};
    obj.type = "angel";
    obj.hp = hp;
    obj.maxHp = hp;
    obj.x = width;
    obj.w = 128;
    obj.h = 128;
    obj.y = Math.random() * (440 - obj.h);
    obj.step = () => {
        obj.x--;
        if (obj.x < 0) {
            removeFormula = true;
            obj.remove = true;
        }
    };
    obj.render = () => {
        image(imgAngel, obj.x, obj.y, obj.w, obj.h);
        fill(color(155, 155, 255));
        textSize(100);
        text(obj.hp + "/" + hp, obj.x + 30, obj.y);
    }
    return obj;
}

function createSquare(x, y) {
    const obj = {};
    obj.random = Math.random();
    obj.type = "square";
    obj.x = x;
    obj.y = y;
    obj.w = 72;
    obj.h = 72;
    obj.onDrop = (o) => {
        obj.rune = { ...o };
        o.remove = true;

        const formula = getFormula(square1.rune?.letter, square2.rune?.letter, square3.rune?.letter, square4.rune?.letter, square5.rune?.letter);
        if (formula) {
            formula.runFormula();
            square1.rune = undefined;
            square2.rune = undefined;
            square3.rune = undefined;
            square4.rune = undefined;
            square5.rune = undefined;
        }
    }
    obj.step = () => {
    };
    obj.render = () => {
        image(imgSquare, obj.x, obj.y, obj.w, obj.h);
        if (obj.rune)
            obj.rune.render();
    }
    return obj;
}

function createRune(x, y) {
    const obj = {};
    obj.type = "rune";
    obj.letter = randomLetter(0.1);
    obj.x = x;
    obj.y = y;
    obj.w = 64;
    obj.h = 64;
    obj.selectable = true;
    obj.step = () => {
        x++;
    };
    obj.onRelease = () => {

        for (let i = 0; i < objs.length; i++) {
            const o = objs[i];

            if (!o.onDrop) continue;
            if (mouseX > o.x && mouseY > o.y && mouseX < o.x + o.w && mouseY < o.y + o.h) {
                obj.x = o.x;
                obj.y = o.y;
                o.onDrop(obj);
                return;
            }
        };
    };
    obj.render = () => image(getRuneImage(obj.letter), obj.x, obj.y, obj.w, obj.h);
    return obj;
}

function getFormula(..._runes) {
    for (let i = formulas.length - 1; i >= 0; i--) {
        const formula = formulas[i];
        const reqs = [...formula.reqs];
        let fail = false;
        const runes = [..._runes];
        reqs.forEach(r => {
            const f = runes.findIndex(x => x == r);
            if (f >= 0)
                runes[f] = undefined;
            else
                fail = true;
        });
        if (!fail)
            return formula;
    }
}

function createFormula(n) {
    const reqs = [];
    for (let i = 0; i < n; i++)
        reqs.push(randomLetter(0.05));
    return {
        reqs,
        runFormula: () => objs.unshift(createDemon(reqs.length)),
        render: (i) => {
            fill(color(200, 0, 0, 255));
            rect(9 + i * 103, 440, 66, height)
            fill(color(0, 0, 0, 255));
            rect(10 + i * 103, 441, 64, height)
            reqs.forEach((r, j) => {
                image(getLetterImage(r), 10 + i * 103, 441 + j * 64, 64, 64);
            })
        }
    }
}

function getRuneImage(letter) {
    if (letter === "A") return imgRuneA;
    if (letter === "B") return imgRuneB;
    if (letter === "C") return imgRuneC;
    if (letter === "D") return imgRuneD;
    if (letter === "E") return imgRuneE;
    if (letter === "F") return imgRuneF;
    if (letter === "G") return imgRuneG;
    if (letter === "H") return imgRuneH;
}

function getLetterImage(letter) {
    if (letter === "A") return imgLetterA;
    if (letter === "B") return imgLetterB;
    if (letter === "C") return imgLetterC;
    if (letter === "D") return imgLetterD;
    if (letter === "E") return imgLetterE;
    if (letter === "F") return imgLetterF;
    if (letter === "G") return imgLetterG;
    if (letter === "H") return imgLetterH;
}

function randomLetter(doRandom) {
    if (Math.random() < doRandom)
        return letters[Math.floor(Math.random() * letters.length)];
    if (nextLetters.length === 0)
        nextLetters = shuffle([...letters]);
    return nextLetters.splice(0, 1)[0];
}

// EVENTS

function mousePressed() {
    objs.forEach(o => {
        if (!o.selectable || selected) return;
        if (mouseX > o.x && mouseY > o.y && mouseX < o.x + o.w && mouseY < o.y + o.h) {
            selected = o;
        }
    });
}

function mouseDragged() {
    if (selected) {
        selected.x = mouseX - selected.w / 2;
        selected.y = mouseY - selected.h / 2;
        selected.y = Math.min(400, selected.y);
    }
}

function mouseReleased() {
    if (selected) {
        if (selected.onRelease) selected.onRelease();
        selected = undefined;
    }

    if (mouseX > width - 32 && mouseY > height - 32) {
        onFullscreen();
    }
}

function touchStarted() {
    mousePressed();
}

function touchMoved() {
    mouseDragged();
    if (touches.length == 1)
        return false;
}

function touchEnded() {
    mouseReleased();
}

function onFullscreen() {
    isFullscreen = !isFullscreen;
    fullscreen(isFullscreen);
    $("canvas").css("width", isFullscreen ? "100vw" : "");
    $("canvas").css("height", isFullscreen ? "100vh" : "");
}

// UTILS

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}