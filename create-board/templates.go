package main

import (
	"fmt"
	"image"
	"io/fs"
	"io/ioutil"
	"path"

	"github.com/milesq/verses-page/create-board/utils"
	"github.com/thoas/go-funk"
)

func searchTemplates(dir string) []string {
	return funk.FlattenDeep(insideSearchTemplates(dir)).([]string)
}

func insideSearchTemplates(dir string) interface{} {
	files, err := ioutil.ReadDir(dir)

	if err != nil {
		panic(err)
	}

	return funk.Map(files, func(file fs.FileInfo) []string {
		name := file.Name()

		if file.IsDir() {
			fullDirPath := fmt.Sprintf("%s/%s", dir, name)

			return searchTemplates(fullDirPath)
		}

		return []string{dir + "/" + name}
	}).([][]string)
}

func loadTemplates() map[string]image.Image {
	result := map[string]image.Image{}
	templates := searchTemplates("./templates")

	for _, template := range templates {
		name := utils.PureName(path.Base(template))
		image, err := utils.LoadImage(template)

		if err != nil {
			panic(err)
		}

		result[name] = image
	}

	return result
}
