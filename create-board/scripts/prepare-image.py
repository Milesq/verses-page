from os import path
import sys

import cv2

tmpl_dir = path.join(path.dirname(__file__), '../templates/')

_, tmpl_name = sys.argv


def prepareImage(img):
    resolutions = [
        (1920, 1080),
        (1280, 720),
        (720, 405),
    ]

    names = ['fullhd', 'hd', 'sd']

    for resolution, name in zip(resolutions, names):
        img = cv2.resize(img, resolution)
        yield img, name


original_img_path = path.join(tmpl_dir, tmpl_name, 'raw.png')

if not path.exists(original_img_path):
    print("Template doesn't exists")
    sys.exit(1)

img = cv2.imread(original_img_path)

for res, name in prepareImage(img):
    cv2.imwrite(path.join(tmpl_dir, tmpl_name, f'{name}.png'), res)
