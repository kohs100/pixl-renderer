var objects = [];

function draw(pixlr) {
    var renderInfo = {}

    for (let i of objects) {
        renderInfo[i] = {
            fid: 0,
            offsetX: 2 + 18 * i,
            offsetY: 2 + i
        }
    }

    pixlr.render(renderInfo);
}

window.addEventListener('load', () => {
    const container = document.getElementById('rainbow');
    const width = 56;
    const height = 20;

    const pixlr = new PixlRenderer(
        container,  // Target div
        width,      // Rendering width (number of pixels)
        height,     // Rendering height (number of pixels)
        10,         // Size of pixels (px)
    );

    pixlr.setBackground('#18314D'); // Set background color (optional)

    require('contents/simple_rainbow.json', (data) => {
        for (let i = 0; i < 2; i++) {
            let objectID = pixlr.addImage(data);
            objects.push(objectID);
        }
        pixlr.addImageFrom('contents/simple_rainbow.json', (id) => {
            objects.push(id);
            draw(pixlr);
        })
    });
})