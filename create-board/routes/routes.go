package routes

import (
	"image"

	tmpl "github.com/milesq/verses-page/create-board/utils/templates"
)

var templates map[string]image.Image

func init() {
	templates = tmpl.LoadTemplates()
}
