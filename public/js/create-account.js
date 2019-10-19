// FUNCTIONS FOR VALIDATING USER ACCOUNT CREATION IN THE FRONT END
const form = document.getElementById('createAccountForm')
const validationMessages = document.getElementsByClassName('validation-messages')[0]
const passwordInput = document.getElementsByClassName('your-password')[0]
const usernameInput = document.getElementsByClassName('your-username')[0]

const validations = {
    username: false,
    password: false
}

passwordInput.addEventListener('keyup', function() {
    validationMessages.textContent = ""
    if (passwordInput.value.length < 7) {
        validationMessages.textContent = "Password must be longer than 7 characters"
        validations.password = false
    } else {
        validations.password = true
    }
})

usernameInput.addEventListener('keyup', function() {
    validationMessages.textContent = ''
    if (usernameInput.value.length > 15 || usernameInput.value < 3) {
        validationMessages.textContent = 'Username must be a minimum of 3, and maximum of 15 characters'
        validations.username = false
    } else {
        validations.username = true
    }
})

usernameInput.addEventListener('blur', function() {
    validationMessages.textContent = ''
    const data = usernameInput.value
    $.ajax({
        url: '/check-username',
        method: 'POST',
        dataType: 'text',
        data: {username: data},
    }).done(function(serverData) {
        // back-end sends JSON back - parse it first
        returnedData = JSON.parse(serverData)
        validationMessages.textContent = returnedData.message
        }
    )
})

form.addEventListener('submit', function(event) {
    event.preventDefault()
    const isValidated = Object.keys(validations).every(i => validations[i])
    if (isValidated) {
        form.submit()
    } else {
        validationMessages.textContent = "Some of the details you provided do not meet requirements. Please double-check them and try again."
    }
})