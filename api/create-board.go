package main

import (
	"fmt"
	"image"
	"io"
	"net/http"
	"net/url"
	"os"

	"github.com/fogleman/gg"
)

func paramExists(params url.Values, value string) bool {
	v, ok := params[value]
	if !ok || len(v) != 1 {
		return false
	}

	return true
}

// Handler .
func Handler(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	if !paramExists(params, "title") || !paramExists(params, "verse") {
		fmt.Fprint(w, "You must pass both, title and verse")
		return
	}

	title, verse := params["title"][0], params["verse"][0]

	if len(title) > 100 || len(verse) > 2_000 {
		fmt.Fprint(w, "The title or verse is too long")
		return
	}

	downloadFileIfNotExist("http://localhost/public/template.png", "template.png")
	downloadFileIfNotExist("http://localhost/public/ariblk.ttf", "ariblk.ttf")

	img, err := gg.LoadImage("template.png")
	if err != nil {
		panic(err)
	}

	dc, err := drawText(img, title, verse)
	if err != nil {
		panic(err)
	}

	dc.EncodePNG(w)
}

func exists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

func downloadFile(url, filename string) error {
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	out, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	return err
}

func downloadFileIfNotExist(url, filename string) error {
	if exists(filename) {
		fmt.Println("using cache")
		return nil
	}

	return downloadFile(url, filename)
}

func drawText(img image.Image, verse, content string) (*gg.Context, error) {
	size := img.Bounds().Size()
	X, Y := float64(size.X), float64(size.Y)

	dc := gg.NewContext(int(X), int(Y))
	dc.DrawImage(img, 0, 0)
	dc.SetRGB(1, 1, 1)

	if err := dc.LoadFontFace("./ariblk.ttf", 122); err != nil {
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
		xBeg, yBeg = X*2/3, Y*5/6
	}
	dc.DrawString(verse, xBeg, yBeg)

	return dc, nil
}
