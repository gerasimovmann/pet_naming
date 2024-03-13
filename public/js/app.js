const getForm = document.querySelector("form")
const responseBlock = document.querySelector(".response")
const responseTitle = document.querySelector(".response-title")
const containerResponse = document.querySelector(".container-response")
const containerMain = document.querySelector(".container-main")

const responseFromApi = [] // массив имен

let stateApp = "basic" // basic || loading || response

function removeChilds(parent) {
  parent.innerHTML = ""
}

const changeDOM = () => {
  removeChilds(responseBlock)

  if (stateApp !== "basic") {
    containerResponse.classList.add("container-response-open")
    containerMain.classList.remove("container-alone")
  }

  if (stateApp === "loading") {
    responseBlock.innerHTML = '<img class="loading" src="/public/img/loading.svg" alt="" />'
  }

  if (stateApp === "response") {
    const ulResponse = document.createElement("ul")
    responseBlock.append(ulResponse)
    responseFromApi.forEach((el, _id) => {
      ulResponse.insertAdjacentHTML("beforeend", `<li>${el}</li>`)
    })
  }
}

changeDOM()

function addData(resp) {
  // удалеяем все из массива
  responseFromApi.splice(0, responseFromApi.length)
  const newArray = resp.match(/[А-я]+/g)

  newArray.forEach((name) => {
    responseFromApi.push(name)
  })
  stateApp = "response"
  changeDOM()
}

const runApi = (text) => {
  stateApp = "loading"
  changeDOM()

  fetch("/animals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(text),
  })
    .then((response) => response.json())
    .then((data) => {
      addData(data)
      console.log(data)
    })
}

getForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = new FormData(getForm)
  const animal = formData.get("animal")
  getForm.reset()
  runApi(animal)
})
