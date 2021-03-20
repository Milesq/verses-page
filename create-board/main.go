package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"image"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/fogleman/gg"
)

var templateImages map[string]image.Image

//go:embed template-raw.png
var rawTemplate []byte

//go:embed template-sd.png
var sdTemplate []byte

//go:embed template-hd.png
var hdTemplate []byte

//go:embed template-fullhd.png
var fullhdTemplate []byte

func paramExists(params url.Values, value string) bool {
	v, ok := params[value]
	if !ok || len(v) != 1 {
		return false
	}

	return true
}

func handler(w http.ResponseWriter, r *http.Request) {
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

	templateName := "hd"

	if paramExists(params, "quality") {
		quality := params["quality"]
		templateName = quality[0]
	}

	template, templateExists := templateImages[templateName]

	if !templateExists {
		fmt.Fprint(w, "unknown quality")
		return
	}

	dc, err := drawText(template, title, verse)
	if err != nil {
		fmt.Fprint(w, "Cannot draw text")
		return
	}

	dc.EncodePNG(w)
}

func toImage(binData []byte) image.Image {
	img, _, err := image.Decode(bytes.NewReader(binData))

	if err != nil {
		panic(err)
	}

	return img
}

func main() {
	templateImages = map[string]image.Image{
		"raw":    toImage(rawTemplate),
		"sd":     toImage(sdTemplate),
		"hd":     toImage(hdTemplate),
		"fullhd": toImage(fullhdTemplate),
	}

	port := "80"

	if content, err := os.ReadFile("port"); err == nil {
		port = strings.Trim(string(content), "\t\n ")
	}

	addr := fmt.Sprintf("0.0.0.0:%v", port)

	fmt.Println("Listening at ", addr)

	http.HandleFunc("/", handler)
	http.ListenAndServe(addr, nil)
}

func drawText(img image.Image, verse, content string) (*gg.Context, error) {
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
