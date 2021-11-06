package utils

import (
	"bytes"
	"image"
	"net/url"

	"github.com/fogleman/gg"
)

func DrawText(img image.Image, verse, content string) (*gg.Context, error) {
	size := img.Bounds().Size()
	X, Y := float64(size.X), float64(size.Y)

	dc := gg.NewContext(int(X), int(Y))
	dc.DrawImage(img, 0, 0)
	dc.SetRGB(1, 1, 1)

	if err := dc.LoadFontFace("./ariblk.ttf", X/33); err != nil {
		panic(err)
	}

	width := X * 2 / 3
	xBeg, yBeg := X/2, Y*2/5

	if len(content) > 300 {
		width = X * 6 / 7
		yBeg = Y * 1 / 3
	}

	dc.DrawStringWrapped(
		content,
		xBeg, yBeg,
		.5, .5,
		width,
		1.4,
		gg.AlignCenter,
	)

	xBeg, yBeg = X*2/3, Y*3/4
	if len(content) > 550 {
		yBeg = Y * 5 / 6
	}

	if len(verse) > 16 {
		xBeg = X * 1 / 2
	}
	dc.DrawString(verse, xBeg, yBeg)

	return dc, nil
}

func ParamExists(params url.Values, value string) bool {
	v, ok := params[value]
	if !ok || len(v) != 1 {
		return false
	}

	return true
}

func BinaryToImage(binData []byte) image.Image {
	img, _, err := image.Decode(bytes.NewReader(binData))

	if err != nil {
		panic(err)
	}

	return img
}
