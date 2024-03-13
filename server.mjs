import http from 'http'
import fs from 'fs'
import path from 'path'
import availbleUrl from './function/availbleUrl.mjs'
import querystring from 'querystring'
import runChat from './public/js/chat.mjs'

const EXTENDS = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  html: 'text/html',
}

const PORT = 5003
const server = http.createServer((req, res) => {
  const url = req.url
  const urlParse = path.parse(req.url)
  const urlDir = path.parse(req.url).dir
  const firstPath = req.url.split('/')[1]

  //public folder
  if (
    firstPath !== undefined &&
    firstPath === 'public' &&
    req.method === 'GET'
  ) {
    const acceptsUrl = new Set(availbleUrl(urlDir))

    if (acceptsUrl.has(urlParse.base)) {
      return fs.readFile(`.${url}`, (err, data) => {
        if (err) {
          console.log(err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'text/plain')
          res.end('Server error while loading public file')
        } else {
          res.statusCode = 200
          res.setHeader(
            'Content-Type',
            `${EXTENDS[urlParse.ext.replace('.', '')]}`
          )
          res.end(data)
        }
      })
    }
  }

  if (req.url === '/' && req.method === 'GET') {
    return fs.readFile('./public/html/main.html', (err, data) => {
      if (err) {
        res.status = 500
        res.setHeader('Content-Type', 'text/plain')
        res.end('Server error while loading HTML file')
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(data)
      }
    })
  }

  if (req.url === '/animals' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    return req.on('end', () => {
      try {
        runChat(body).then((data) => sendResponse(data))
        function sendResponse(data) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'aplication/json')
          res.end(JSON.stringify(data))
        }
      } catch (error) {
        res.statusCode = 400
        res.end('Invalid Form Data')
        console.log(error)
      }
    })
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  return res.end('<h1>Page is not found</h1>')
})

server.listen(PORT, () => {
  console.log(`Server is run on ${PORT} port`)
})
