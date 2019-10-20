const form = document.getElementById('createResourceForm')
const validationMessages = document.getElementsByClassName('validation-messages')[0]
const titleInput = document.getElementsByClassName('resource-title')[0]
const descriptionInput = document.getElementsByClassName('resource-description')[0]

titleInput.addEventListener('keyup', checkTitleInput)
titleInput.addEventListener('blur', checkTitleInput)
descriptionInput.addEventListener('keyup', checkDescriptionInput)
descriptionInput.addEventListener('blur', checkDescriptionInput)

const validations = {
    title: false,
    description: false
}

function checkTitleInput() {
    validationMessages.style.display = "none"
    const inputLength = titleInput.value.length
    if (inputLength < 5) {
        validations.title = false
        validationMessages.style.display = "block"
        validationMessages.textContent = `Title must be at least 5 characters long. At least ${5-inputLength} more characters needed`
    } else if (inputLength > 60) {
        validations.title = false
        validationMessages.style.display = "block"
        validationMessages.textContent = `Title cannot be more than 60 characters long. ${inputLength-60} too many characters.`
    } else {
        validations.title = true
    }
}

function checkDescriptionInput() {
    validationMessages.style.display = "none"
    const inputLength = descriptionInput.value.length
    if (inputLength < 10) {
        validations.description = false
        validationMessages.style.display = "block" 
        validationMessages.textContent = `Description must be at least 10 characters long. At least ${10-inputLength} more characters needed`
    } else if (inputLength > 250) {
        validations.description = false 
        validationMessages.style.display = "block"
        validationMessages.textContent = `Description cannot be more than 250 characters long. ${inputLength-250} too many characters`
    } else {
        validations.description = true
    }
}

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const isValidated = Object.keys(validations).every(i => validations[i])
    if (isValidated) {
        form.submit()
    } else {
        validationMessages.style.display = "block"
        validationMessages.textContent = "Some of the details you provided do not meet requirements. Please double-check them and try again."
    }
})