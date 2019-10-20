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
        data = JSON.parse(data)
        if (!$(event.target).parent().hasClass('saved-resource')) {
            $(event.target).parent().addClass('saved-resource')           
        }
        // get response from the server and append a div containing the response
        // informing the user of the succes/failure of their request
        $('body').append(`<div id='ajaxMessage'>${data.message}</div>`)
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

// SORT RESOURCES BY MOST POPULAR
function sortByVotes() {
    // this file and functionality is accessible from home page
    // and user profile pages. The resources container are wrapped
    // in different divs on both pages, so below if/else checks
    // which page (and therefore resoure container) is being used
    let resourcesDiv
    if ($('.all-resources').length) {
        resourcesDiv = '.all-resources'
    } else if ($('.user-resources').length) {
        resourcesDiv = '.user-resources'
    }
    // get the resource cards and initiate sort function
    $(".resource-card").sort(function(a, b) {
        // get the number of votes as an int
        a = parseInt($(".votes span", a).text())
        // get the number of votes as an int
        b = parseInt($(".votes span", b).text())
        return b - a;
        // modify HTML to reflect sorted resourced cards
      }).appendTo(resourcesDiv)
}

// SORT RESOURCES BY NEWEST
function sortByDate() {
    // this file and functionality is accessible from home page
    // and user profile pages. The resources container are wrapped
    // in different divs on both pages, so below if/else checks
    // which page (and therefore resoure container) is being used
    let resourcesDiv
    if ($('.all-resources').length) {
        resourcesDiv = '.all-resources'
    } else if ($('.user-resources').length) {
        resourcesDiv = '.user-resources'
    }
    // get the resource cards and initiate sort function
    $(".resource-card").sort(function(a, b) {
        // convert the date string to a Javascript Date object
        a = new Date($(".submitted-date", a).text())
        b = new Date($(".submitted-date", b).text())
        return b - a
        // modify HTML to reflect sorted resourced cards
    }).appendTo(resourcesDiv)
}