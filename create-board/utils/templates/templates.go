package templates

import (
	"fmt"
	"io/fs"
	"io/ioutil"
	"path"

	"github.com/milesq/verses-page/create-board/utils"
	"github.com/thoas/go-funk"
)

func SearchTemplates(dir string) []string {
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

			return SearchTemplates(fullDirPath)
		}

		return []string{dir + "/" + name}
	}).([][]string)
}

func LoadTemplates() Templates {
	result := make(Templates)
	templates := SearchTemplates("./templates")

	for _, template := range templates {
		name := utils.PureName(path.Base(template))
		typ := utils.DirName(template)

		image, err := utils.LoadImage(template)

		if err != nil {
			panic(err)
		}

		_, alreadyExists := result[typ]

		if !alreadyExists {
			result[typ] = make(Template)
		}

		result[typ][name] = image
	}

	return result
}
