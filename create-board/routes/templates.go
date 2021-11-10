package routes

import (
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
	return c.JSON(templates)
}
