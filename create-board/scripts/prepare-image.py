from os import mkdir, path
import sys

from PIL import Image, ImageEnhance, ImageFilter

CONFIG = {
    'blur': 7,
    'darker': 30,
}


def blurImg(img, blur):
    return img.filter(ImageFilter.GaussianBlur(blur))


def darker(img, scale):
    enhancer = ImageEnhance.Brightness(img)
    return enhancer.enhance((100 - scale) / 100)


def darkImage(name):
    dir_path = path.join(path.dirname(__file__), f'../templates/{name}')
    img = Image.open(f'{name}.png')

    mkdir(dir_path)

    img = blurImg(img, CONFIG['blur'])
    img = darker(img, CONFIG['darker'])

    img.save(path.join(dir_path, 'raw.png'))

_, filename = sys.argv

darkImage(filename)
