// AJAX CALL FOR ADDING A RESOURCE TO USER'S SAVEDRESOURCES ARRAY
function sendSomeData(data, url) {
    const newData = data.toString()
    $.ajax({
        // define the route to send request to, and request method
        url: url,
        method: 'POST',
        dataType: 'text',
        // define the data to pass to the route
        data: {resourceId: newData},
        // when the AJAX call has finished, execute below
    }).done(function(data) {
        // get response from the server and append a div containing the response
        // informing the user of the succes/failure of their request
        $('body').append(`<div id='ajaxMessage'>${data}</div>`)
        // setTimeout to destroy the div after 2 seconds
        setTimeout(function() {
            $('#ajaxMessage').remove()
        }, 2000)
        console.log(data)
    })
}

// function resourceRedirect() {
//     const actionUrl = $('#resourceInput').val()
//     const actionForm = $('#resourceForm').val()
//     const baseUrl = window.location.href
//     const redirectUrl = `${baseUrl}resources/${actionUrl}`
//     alert(redirectUrl)
//     actionForm.method = "POST"
//     actionForm.action = redirectUrl
// }