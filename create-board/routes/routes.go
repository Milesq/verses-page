package routes

import tmpl "github.com/milesq/verses-page/create-board/utils/templates"

var templates tmpl.Templates

func init() {
	templates = tmpl.LoadTemplates()
}
