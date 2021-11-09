package main

import (
	"fmt"
	"image"
	"io/fs"
	"io/ioutil"

	"github.com/thoas/go-funk"
)

var templates map[string]image.Image

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

func loadTemplates() {
	fmt.Println(searchTemplates("./templates"))
}
