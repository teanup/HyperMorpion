const { createCanvas } = require('canvas');
const {
    borderWidth, squareSize, resizeCoeff,
    grey, blue, red, black, white, green
} = require('./image-config.json');
const fs = require('fs');

const gridSize = 3 * (squareSize + borderWidth) + borderWidth;
const boardSize = 3 * gridSize + 2;

const brd = borderWidth;
const sq = squareSize;
const rs = resizeCoeff;
const gd = gridSize;
const bd = boardSize;


// draw a line
function drawLine(context, x1, y1, x2, y2, color, width) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
};

function makeGrid() {
    const canvas = createCanvas(gd-2*brd, gd-2*brd);
    const ctx = canvas.getContext("2d");

    // fill with grey
    ctx.fillStyle = grey;
    ctx.fillRect(0, 0, gd-2*brd, gd-2*brd);

    // draw black lines
    drawLine(ctx, sq, 0, sq, gd-1, black, 1);
    drawLine(ctx, 2*sq+brd, 0, 2*sq+brd, gd-1, black, 1);
    drawLine(ctx, 0, sq, gd-1, sq, black, 1);
    drawLine(ctx, 0, 2*sq+brd, gd-1, 2*sq+brd, black, 1);

    return canvas;
};

function makeBoard() {
    const canvas = createCanvas(bd, bd);
    const ctx = canvas.getContext("2d");

    // fill with white
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, bd, bd);

    // draw grids
    const gridCanvas = makeGrid();
    for (i=0;i<3;i++) {
        for (j=0;j<3;j++) {
            let x = 2*brd + i*gd;
            let y = 2*brd + j*gd;
            ctx.drawImage(gridCanvas, x, y);
        };
    };

    return canvas;
};

function makeXSq() {
    const canvas = createCanvas(sq, sq);
    const ctx = canvas.getContext("2d");

    // fill with grey
    ctx.fillStyle = grey;
    ctx.fillRect(0, 0, sq, sq)

    // draw lines
    drawLine(ctx, 1, 1, sq-2, sq-2, blue, 1);
    drawLine(ctx, 1, sq-2, sq-2, 1, blue, 1);

    return canvas
};

function makeOSq() {
    const canvas = createCanvas(sq, sq);
    const ctx = canvas.getContext("2d");

    // fill with grey
    ctx.fillStyle = grey;
    ctx.fillRect(0, 0, sq, sq)

    // draw lines
    drawLine(ctx, 2, 1, sq-3, 1, red, 1);
    drawLine(ctx, 2, sq-2, sq-3, sq-2, red, 1);
    drawLine(ctx, 1, 2, 1, sq-3, red, 1);
    drawLine(ctx, sq-2, 2, sq-2, sq-3, red, 1);

    return canvas
};

function makeXGd() {
    const canvas = makeGrid();
    const ctx = canvas.getContext("2d");

    // draw lines
    drawLine(ctx, 4, 4, sq-5, sq-5, blue, 3);
    drawLine(ctx, 4, sq-5, sq-5, 4, blue, 3);

    return canvas
};

function makeOGd() {
    const canvas = makeGrid();
    const ctx = canvas.getContext("2d");

    // fill with grey
    ctx.fillStyle = grey;

    // draw lines
    drawLine(ctx, 2, 1, sq-3, 1, red, 1);
    drawLine(ctx, 2, sq-2, sq-3, sq-2, red, 1);
    drawLine(ctx, 1, 2, 1, sq-3, red, 1);
    drawLine(ctx, sq-2, 2, sq-2, sq-3, red, 1);

    return canvas
};

function makeHgltd() {
    const canvas = createCanvas(gd, gd);
    const ctx = canvas.getContext("2d");

    // fill with green
    ctx.fillStyle = green;
    ctx.fillRect(0, 0, gd, gd)

    // clear center
    ctx.clearRect(brd, brd, gd-2*brd, gd-2*brd);

    return canvas
};



const board = makeBoard().toBuffer('image/png');
fs.writeFileSync(__dirname+'/cache/board.png', board);

const xsq = makeXSq().toBuffer('image/png');
fs.writeFileSync(__dirname+'/cache/cross-sq.png', xsq);

const osq = makeOSq().toBuffer('image/png');
fs.writeFileSync(__dirname+'/cache/round-sq.png', osq);

const xgd = makeXGd().toBuffer('image/png');
fs.writeFileSync(__dirname+'/cache/cross-gd.png', xgd);

// const ogd = makeOGd().toBuffer('image/png');
// fs.writeFileSync(__dirname+'/cache/round-gd.png', ogd);

const hgltd = makeHgltd().toBuffer('image/png');
fs.writeFileSync(__dirname+'/cache/highlighted.png', hgltd);
