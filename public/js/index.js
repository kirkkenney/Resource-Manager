// MODIFY CSS CLASS OF CURRENT PAGE
$(document).ready(function() {
    $("nav [href]").each(function() {
        if (window.location.href == this.href) {
            $(this.parentNode).addClass('current-page')
        } else {
            console.log(`${this.href} is not active`)
        }
    })
})

$('#resourceSearch').submit(function(event) {
    event.preventDefault()
    const value = $('#resourceGroup').val()
    window.location.href = `${window.location.href}resources/${value}`
})

// AJAX CALL TO POST DATA TO SERVER
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