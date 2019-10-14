// MODIFY CSS CLASS OF CURRENT PAGE
$(document).ready(function() {
    $("nav [href]").each(function() {
        if (window.location.href == this.href) {
            $(this.parentNode).addClass('current-page')
        }
    })
})

$('#resourceSearch').submit(function(event) {
    event.preventDefault()
    const value = $('#resourceGroup').val()
    window.location.href = `${window.location.href}resources/${value}`
})

// AJAX CALL TO ADD RESOURCE TO USER FAVOURITES
function addToFavourites(event, data) {
    const newData = data.toString()
    $.ajax({
        // define the route to send request to, and request method
        url: '/add-to-my-resources',
        method: 'POST',
        dataType: 'text',
        // define the data to pass to the route
        data: {resourceId: newData},
        // when the AJAX call has finished, execute below
    }).done(function(data) {
        if (!$(event.target).parent().hasClass('saved-resource')) {
            $(event.target).parent().addClass('saved-resource')           
        }
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

// AJAX CALL TO ADD VOTE TO RESOURCE
function addVote(event, data) {
    const newData = data.toString()
    $.ajax({
        url: '/add-vote',
        method: 'POST',
        dataType: 'text',
        data: {resourceId: newData},
    }).done(function(serverData) {
        // back-end sends JSON back - parse it first
        returnedData = JSON.parse(serverData)
        // if the returned data has a "resource" key, then we know the call
        // worked as intended
        if (returnedData.hasOwnProperty('resource')) {
            // add a class to the parent property for CSS styling to indicate
            // to the user that their vote was passed to the server successfully
            $(event.target).parent().addClass("voted-resource")
            // amend the "votes" content on front-end to reflect updated data
            $(event.target).next('span').html(returnedData.resource.votes)
        }                
        // get response from the server and append a div containing the response
        // informing the user of the succes/failure of their request
        $('body').append(`<div id='ajaxMessage'>${returnedData.message}</div>`)
        // setTimeout to destroy the div after 2 seconds
        setTimeout(function() {
            $('#ajaxMessage').remove()
        }, 2000)
        console.log(returnedData)                
        }         
    )
}

function sortByVotes() {
    // get the resource cards and initiate sort function
    $(".resource-card").sort(function(a, b) {
        // get the number of votes as an int
        a = parseInt($(".votes span", a).text())
        // get the number of votes as an int
        b = parseInt($(".votes span", b).text())
        return b - a;
        // modify HTML to reflect sorted resourced cards
      }).appendTo(".newest-resources");
}

function sortByDate() {
    // get the resource cards and initiate sort function
    $(".resource-card").sort(function(a, b) {
        // convert the date string to a Javascript Date object
        a = new Date($(".submitted-date", a).text())
        b = new Date($(".submitted-date", b).text())
        return b - a
        // modify HTML to reflect sorted resourced cards
    }).appendTo(".newest-resources")
}