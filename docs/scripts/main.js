const interval = 70;
const frames = 12;

const gstate = {
    prev: undefined,
    fid: 0
};

var pixlr;

const gobjects = {
    aqua: {
        width: 44,
        height: 39,
        freq: 12,
        id: null,
    },
    rbws: {
        width: 16,
        height: 14,
        freq: 4,
        id: []
    }
}

function draw(curr) {
    renderInfo = {};

    aquaX = Math.round((pixlr.width - gobjects.aqua.width) / 2);
    aquaY = Math.round((pixlr.height - gobjects.aqua.height) / 2);

    renderInfo[gobjects.aqua.id] = {
        fid: curr,
        offsetX: aquaX,
        offsetY: aquaY
    };

    for (let i of gobjects.rbws.id) {
        renderInfo[i] = {
            fid: curr % gobjects.rbws.freq,
            offsetX: aquaX - i*16,
            offsetY: aquaY + 25
        }
    }
    pixlr.render(renderInfo);
}

function step(timestamp) {
    if (gstate.prev === undefined) {
        gstate.prev = timestamp;
    }

    const elapsed = timestamp - gstate.prev;

    if (elapsed > interval) {
        gstate.prev = timestamp;
        draw(gstate.fid);
        gstate.fid = (gstate.fid+1) % frames;
    }
    
    window.requestAnimationFrame(step);
}

window.onload = function () {
    var container = document.getElementById('canvasContainer');
    var psize = 5;

    pixlr = new PixlRenderer(
        container,
        Math.ceil(container.offsetWidth / psize),
        Math.ceil(container.offsetHeight / psize),
        psize
    );
    pixlr.setBackground('#18314D');

    require('contents/nyan.json', (data) => {
        gobjects.aqua.id = pixlr.addImage(data);
        require('contents/rainbow.json', (data) => {
            for(let i=0; i<10; i++) {
                gobjects.rbws.id.push(pixlr.addImage(data));
            }
            window.requestAnimationFrame(step);
        });
    });

    window.onresize = debounce(() => {
        pixlr.resize(
            Math.ceil(container.offsetWidth / psize),
            Math.ceil(container.offsetHeight / psize)
        )
    }, 100)
}