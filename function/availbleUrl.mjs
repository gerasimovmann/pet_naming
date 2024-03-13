import fs from "fs"

const availbleUrl = (path) => {
  const files = []
  fs.readdirSync(`.${path}`).forEach((filename, id) => {
    files.push(filename)
  })

  return files
}

export default availbleUrl
