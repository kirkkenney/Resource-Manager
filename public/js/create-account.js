// FUNCTIONS FOR VALIDATING USER ACCOUNT CREATION IN THE FRONT END
const form = document.getElementById('createAccountForm')
const validationMessages = document.getElementsByClassName('validation-messages')[0]
const passwordInput = document.getElementsByClassName('your-password')[0]
const usernameInput = document.getElementsByClassName('your-username')[0]

passwordInput.addEventListener('keyup', checkPasswordInput)
passwordInput.addEventListener('blur', checkPasswordInput)
usernameInput.addEventListener('keyup', checkUsernameInput)
usernameInput.addEventListener('blur', checkUsernameFree)

const validations = {
    username: false,
    password: false
}

function checkPasswordInput() {
    validationMessages.style.display = "none"
    const inputLength = passwordInput.value.length
    if (inputLength < 7) {
        validationMessages.style.display = "block"
        validationMessages.textContent = `Password must be longer than 7 characters. ${7-inputLength} more characters required`
        validations.password = false
    } else {
        validations.password = true
    }    
}

function checkUsernameInput() {
    validationMessages.style.display = "none"
    const inputLength = usernameInput.value.length
    if (inputLength > 15) {
        validationMessages.style.display = "block"
        validationMessages.textContent = `Username must be less than 15 characters. ${inputLength-15} characters too many`
        validations.username = false
    } else if (inputLength < 3) {
        validationMessages.style.display = "block"
        validationMessages.textContent = `Username must be at least 3 characters. At least ${3-inputLength} more characters needed`
        validations.username = false
    } else {
        validations.username = true
    }
}

function checkUsernameFree() {
    validationMessages.style.display = "none"
    const data = usernameInput.value
    $.ajax({
        url: '/check-username',
        method: 'POST',
        dataType: 'text',
        data: {username: data},
    }).done(function(serverData) {
        // back-end sends JSON back - parse it first
        returnedData = JSON.parse(serverData)
        validationMessages.style.display = "block"
        validationMessages.textContent = returnedData.message
        }
    )    
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