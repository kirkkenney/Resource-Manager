function sendSomeData(data) {
    const newData = data.toString()
    $.ajax({
        url: '/add-to-my-resources',
        method: 'POST',
        dataType: 'text',
        data: {resourceId: newData},
    }).done(function(data) {
        console.log(data)
    })
}