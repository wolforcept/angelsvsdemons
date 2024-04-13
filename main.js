var font;
let imgRing, imgSquare, imgAngel, imgDemon;
let imgRuneA, imgRuneB, imgRuneC, imgRuneD, imgRuneE, imgRuneF, imgRuneG, imgRuneH;
const objs = [];
var square1, square2, square3, square4, square5;
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
var selected;

const formulas = [
    createFormula(2),
    createFormula(2),
    createFormula(2),
    createFormula(3),
    createFormula(3),
    createFormula(3),
    createFormula(3),
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

    drawingContext.imageSmoothingEnabled = false;

    objs.push(createDemon());

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
        objs.unshift(createRune(500 + Math.random() * 700, Math.random() * 350, randomLetter()));

}


function draw() {
    textFont(font);
    fill(color(22, 22, 23, 255));
    rect(0, 0, width, height);
    fill(color(11, 11, 12, 255));
    rect(0, 440, width, height);

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

}

let angelTimer = 50;
let timePassed = 0;
// let formulaTimer = 50;
function gameStep() {
    angelTimer--;
    if (angelTimer <= 0) {
        timePassed++;
        angelTimer = 1000 + Math.random() * 500 - timePassed * 10;
        objs.push(createAngel());
    }
    // formulaTimer--;
    // if (formulaTimer <= 0) {
    //     formulaTimer = 200 + Math.random() * 200;
    //     formulas.push(createFormula());
    // }
}

function createDemon() {
    const obj = {};
    obj.type = "demon";
    // obj.hp = hp ? hp : 2 + Math.floor(Math.random() * 3);
    obj.hp = 4;
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
                if (o.hp <= 0)
                    o.remove = true;
            }
            return;
        }

    };
    obj.render = () => {
        image(imgDemon, obj.x, obj.y, obj.w, obj.h);
        fill(color(255, 55, 55));
        textSize(100);
        text(obj.hp + "/" + 4, obj.x + 30, obj.y);
    }
    return obj;
}

function createAngel() {
    const obj = {};
    obj.type = "angel";
    obj.hp = 1 + Math.floor(Math.random() * 4);
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
        text(obj.hp + "/" + 4, obj.x + 30, obj.y);
    }
    return obj;
}

function createSquare(x, y) {
    const obj = {};
    obj.random = Math.random();
    obj.type = "square";
    obj.x = x;
    obj.y = y;
    obj.w = 64;
    obj.h = 64;
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
    obj.letter = randomLetter();
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
    obj.render = () => image(getLetterImage(obj.letter), obj.x, obj.y, obj.w, obj.h);
    return obj;
}

function getFormula(..._runes) {
    for (let i = 0; i < formulas.length; i++) {
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
        reqs.push(randomLetter());
    return {
        reqs,
        runFormula: () => objs.unshift(createDemon()),
        render: (i) => {
            reqs.forEach((r, j) => {
                image(getLetterImage(r), i * 100, 440 + j * 64, 64, 64);
            })
        }
    }
}

function getLetterImage(letter) {
    if (letter === "A") return imgRuneA;
    if (letter === "B") return imgRuneB;
    if (letter === "C") return imgRuneC;
    if (letter === "D") return imgRuneD;
    if (letter === "E") return imgRuneE;
    if (letter === "F") return imgRuneF;
    if (letter === "G") return imgRuneG;
    if (letter === "H") return imgRuneH;
}

function randomLetter() {
    return letters[Math.floor(Math.random() * letters.length)];
}

// EVENTS

function mousePressed(e) {
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
    }
}

function mouseReleased() {
    if (selected) {
        if (selected.onRelease) selected.onRelease();
        selected = undefined;
    }
}