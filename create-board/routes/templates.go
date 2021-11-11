package routes

import (
	"bytes"
	"fmt"
	"image/png"
	"reflect"

	"github.com/gofiber/fiber/v2"
	"github.com/thoas/go-funk"
)

func reflectValueToString(v reflect.Value) string {
	return v.String()
}

func ListTemplates(c *fiber.Ctx) error {
	result := map[string][]string{}

	for k, v := range templates {
		values := reflect.ValueOf(v).MapKeys()
		result[k] = funk.Map(values, reflectValueToString).([]string)
	}

	return c.JSON(result)
}

func ShowTemplate(c *fiber.Ctx) error {
	name := c.Params("name")
	template, ok := templates[name]

	if !ok {
		return c.Status(404).SendString("Template not found")
	}

	img := template["sd"]
	buff := new(bytes.Buffer)

	err := png.Encode(buff, img)
	if err != nil {
		fmt.Println("failed to create buffer", err)
		return c.JSON(map[string]string{"error": "cannot convert image to PNG. Contact with administrator"})
	}

	return c.Send(buff.Bytes())
}
