function PixlImage(obj, psize, cvs) {
    this.width = obj.width;
    this.height = obj.height;
    this.palette = obj.palette;
    this.frames = [];
    this.current = {
        fid: null,
        offsetX: 0,
        offsetY: 0
    };
    this.psize = psize;

    this.cvs = cvs;
    this.ctx = cvs.getContext('2d');

    for (let fid in obj.frames) {
        var newFrame = new Uint8Array(this.width * this.height);
        newFrame.set(obj.frames[fid]);
        this.frames.push(newFrame);
    }

    this._clear = () => {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    }

    this._draw = (fid, ox, oy) => {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let index = x + this.width * y;
                let pixel = this.frames[fid][index];
                let color = this.palette[pixel];
                
                this.ctx.fillStyle = color;
                this.ctx.fillRect(
                    this.psize * (x + ox),
                    this.psize * (y + oy),
                    this.psize,
                    this.psize
                );
            }
        }
    }

    this.render = (fid, offsetX, offsetY) => {
        if (fid === this.current.fid
            && offsetX === this.current.offsetX
            && offsetY === this.current.offsetY) {
            return;
        }
        this._clear();
        if (fid === null) {
            this.current.fid = null;
            return;
        } else if (fid >= this.frames.length) {
            throw "frame id out of range"
        } else {
            this.current.fid = fid;
            this.current.offsetX = offsetX;
            this.current.offsetY = offsetY;
            this._draw(fid, offsetX, offsetY);
        }
    }
}


function PixlRenderer(elem, pwidth, pheight, psize) {
    this._elem = elem;
    this._images = {};
    this._highestID = 0;

    this.size = parseInt(psize);
    this.width = parseInt(pwidth);
    this.height = parseInt(pheight);

    this._elem = document.createElement('div');

    this._elem.style.position = 'relative';
    this._elem.style.overflow = 'hidden';
    this._elem.style.width = psize * pwidth + 'px';
    this._elem.style.height = psize * pheight + 'px';

    elem.appendChild(this._elem);

    this.addImage = (obj) => {
        var newCanvas = document.createElement('canvas');

        newCanvas.width = this.size * this.width;
        newCanvas.height = this.size * this.height;
        newCanvas.style.position = 'absolute';
        newCanvas.style.left = '50%';
        newCanvas.style.top = '50%';
        newCanvas.style.transform = 'translate(-50%, -50%)';

        this._elem.appendChild(newCanvas);

        var newID = this._highestID++;
        var newImage = new PixlImage(obj, this.size, newCanvas);
        
        this._images[newID] = {
            'canvas': newCanvas,
            'image': newImage
        };
        return newID;
    };

    this.addImageFrom = (url, callback) => {
        var xhr = new XMLHttpRequest();
        var capture = this.addImage;
        xhr.responseType = 'json';
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status == 200) {
                callback(capture(xhr.response));
            } else {
                console.log('addImageFrom Failed: ', xhr.statusText);
                callback(undefined);
            }
        }
        xhr.onerror = () => {
            callback(undefined);
        }
        xhr.send();
    }

    this.removeImage = (id) => {
        this._images[id].canvas.remove();
        delete this._images[id];
    };

    this.setBackground = (color) => {
        this._elem.style.backgroundColor = color;
    };

    this.render = (renderInfo) => {
        for (let i in renderInfo) {
            let fid = renderInfo[i].fid;
            let ox = renderInfo[i].offsetX;
            let oy = renderInfo[i].offsetY;
            this._images[i].image.render(fid, ox, oy);
        }
    };

    this.resize = (pwidth, pheight) => {
        this.width = pwidth;
        this.height = pheight;
        for (let i in this._images) {
            this._images[i].canvas.height = pheight * this.size;
            this._images[i].canvas.width = pwidth * this.size;
        }
    };

    return this;
}