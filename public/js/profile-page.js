const filter = document.getElementById('filterResources')
const resourceCard = document.getElementsByClassName('resource-card')


filter.addEventListener('keyup', filterResources)


function filterResources() {
    const value = filter.value.toLowerCase()
    for (let i = 0; i < resourceCard.length; i++) {
        if (resourceCard[i].textContent.toLowerCase().includes(value)) {
            resourceCard[i].style.display = "block"
        } else {
            resourceCard[i].style.display = "none"
        }
    }
}