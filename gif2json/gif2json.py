import argparse
import json

from PIL import Image


def rgb2hex(rgb):
    return '#%02x%02x%02x' % tuple(rgb)


def parse_palette(palette):
    if len(palette) % 3 != 0:
        print('invalid palette')
        exit()

    pal = []
    for i in range(len(palette)):
        if i % 3 == 0:
            pal.append(rgb2hex(palette[i:i + 3]))

    return pal


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Process animated GIF image to renderable json file.')
    parser.add_argument('img', help='Path to GIF file')

    args = parser.parse_args()

    img = Image.open(args.img)
    prevpalette = img.getpalette()

    animjson = {
        'palette': parse_palette(img.getpalette()),
        'width': img.size[0],
        'height': img.size[1],
        'frames': []
    }

    for i in range(img.n_frames):
        img.seek(i)

        palette = img.getpalette()
        if prevpalette != palette:
            print('palette not global')
            exit()

        pixels = []

        for y in range(img.size[1]):
            for x in range(img.size[0]):
                pixels.append(img.getpixel((x, y)))

        animjson['frames'].append(pixels)

    print('palette global')

    output = '.'.join(args.img.split('.')[:-1] + ['json'])

    with open(output, 'w') as fp:
        json.dump(animjson, fp)

    print('conversion complete.')
