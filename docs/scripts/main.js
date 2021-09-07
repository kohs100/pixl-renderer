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
        data: null,
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
            offsetX: aquaX - i * 16,
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
        gstate.fid = (gstate.fid + 1) % frames;
    }

    window.requestAnimationFrame(step);
}

window.onload = function () {
    var container = document.getElementById('canvasContainer');
    var psize = 10;

    pixlr = new PixlRenderer(
        container,
        Math.ceil(container.offsetWidth / psize),
        Math.ceil(container.offsetHeight / psize),
        psize
    );
    pixlr.setBackground('#18314D');

    pixlr.addImageFrom('contents/nyan.json', (id) => {
        gobjects.aqua.id = id;
    })

    require('contents/rainbow.json', (data) => {
        gobjects.rbws.data = data;
        let rbwsnum = Math.ceil(pixlr.width / (gobjects.rbws.width * 2));
        for (let i = 0; i < rbwsnum; i++) {
            gobjects.rbws.id.push(pixlr.addImage(data));
        }
        window.requestAnimationFrame(step);
    });

    window.onresize = debounce(() => {
        pixlr.resize(
            Math.ceil(container.offsetWidth / psize),
            Math.ceil(container.offsetHeight / psize)
        );
        let rbwsnum = Math.ceil(pixlr.width / (gobjects.rbws.width * 2));
        let rbwsinc = rbwsnum - gobjects.rbws.id.length;

        if (rbwsinc > 0) {
            for (let i=0; i < rbwsinc; i++) {
                gobjects.rbws.id.push(pixlr.addImage(gobjects.rbws.data));
            }
        }
    }, 100)
}