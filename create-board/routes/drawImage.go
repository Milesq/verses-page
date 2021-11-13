package routes

import (
	"bytes"
	"fmt"
	"image/png"

	"github.com/gofiber/fiber/v2"
	"github.com/milesq/verses-page/create-board/utils"
)

func DrawImage(c *fiber.Ctx) error {
	sign := c.Query("title")
	verse := c.Query("verse")
	quality := c.Query("quality", "hd")
	typ := c.Params("type")

	if sign == "" || verse == "" {
		return c.SendString("You must pass both, title and verse")
	}

	if len(sign) > 100 || len(verse) > 2_000 {
		return c.SendString("The title or verse is too long")
	}

	template, templateExists := templates[typ]
	if !templateExists {
		return c.SendString("unknown template")
	}

	img, imgExists := template[quality]
	if !imgExists {
		return c.SendString("unknown quality")
	}

	dc, err := utils.DrawText(img, sign, verse)
	if err != nil {
		return c.SendString("Cannot draw text")
	}

	buff := new(bytes.Buffer)

	err = png.Encode(buff, dc.Image())
	if err != nil {
		fmt.Println("failed to create board buffer", err)
		return c.JSON(map[string]string{"error": "cannot convert image to PNG. Contact with administrator"})
	}

	return c.Send(buff.Bytes())
}
