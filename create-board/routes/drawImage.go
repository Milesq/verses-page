package routes

import "github.com/gofiber/fiber/v2"

func DrawImage(c *fiber.Ctx) error {
	return nil
	// params := r.URL.Query()
	// if !utils.ParamExists(params, "title") || !utils.ParamExists(params, "verse") {
	// 	fmt.Fprint(w, "You must pass both, title and verse")
	// 	return
	// }

	// title, verse := params["title"][0], params["verse"][0]

	// if len(title) > 100 || len(verse) > 2_000 {
	// 	fmt.Fprint(w, "The title or verse is too long")
	// 	return
	// }

	// templateName := "hd"

	// if utils.ParamExists(params, "quality") {
	// 	quality := params["quality"]
	// 	templateName = quality[0]
	// }

	// template, templateExists := templates[templateName]

	// if !templateExists {
	// 	fmt.Fprint(w, "unknown quality")
	// 	return
	// }

	// dc, err := utils.DrawText(template, title, verse)
	// if err != nil {
	// 	fmt.Fprint(w, "Cannot draw text")
	// 	return
	// }

	// dc.EncodePNG(w)
}
