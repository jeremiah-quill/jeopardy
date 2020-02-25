// 18425 total categories

// Pick a random number between 1 and n
const getRandomNum = (max,min=0) => {
    return Math.floor(Math.random() * max) + min
}

// Fetch category given a specific ID
const fetchCategory = async (id) => {
    const response = await axios.get('http://jservice.io/api/category', {
        params: {
            id: id
        }
    })
    return response.data
}


// Choose 
const selectValue = (category, findValue) => {
    let selected = category[getRandomNum(category.length)]
    do {
        selected = category[getRandomNum(category.length)]
    } 
    while (selected.value !== findValue)
    return selected
}

// Pick 5 random questions that all contain 200, 400, 600, 800, 1000
const pickRandomQuestions = (categories, val1, val2, val3, val4, val5) => {
    categories.forEach(category => {
        let selectedClues = [];
        selectedClues.push(selectValue(category.clues, val1))
        selectedClues.push(selectValue(category.clues, val2))
        selectedClues.push(selectValue(category.clues, val3))
        selectedClues.push(selectValue(category.clues, val4))
        selectedClues.push(selectValue(category.clues, val5))
        selectedClues.sort((a, b) => a.value - b.value)
        category.selectedClues = selectedClues;
})
    return categories
}


// Pick 6 random categories that all contain 200, 400, 600, 800, 1000
const pickRandomCategories = async (val1, val2, val3, val4, val5) => {
    const categories = [];
    while(categories.length < 6) {
        let data = await fetchCategory(getRandomNum(18425, 1))
        let values = []
        data.clues.forEach(clue => {
            values.push(clue.value)
        })
        if(values.indexOf(val1) !== -1 && values.indexOf(val2) !== -1 && values.indexOf(val3) !== -1 && values.indexOf(val4) !== -1 && values.indexOf(val5) !== -1 ) {
            categories.push(data)
        }
    }
    return categories
} 

const categoryTemplate = (categories) => {
    return `
        <div class='category-1 category'><h4 class='capitalize'>${categories[0].title}</h4></div>
        <div class='category-2 category'><h4 class='capitalize'>${categories[1].title}</h4></div>
        <div class='category-3 category'><h4 class='capitalize'>${categories[2].title}</h4></div>
        <div class='category-4 category'><h4 class='capitalize'>${categories[3].title}</h4></div>
        <div class='category-5 category'><h4 class='capitalize'>${categories[4].title}</h4></div>
        <div class='category-6 category'><h4 class='capitalize'>${categories[5].title}</h4></div>
    `
}  

// return `
// <div>
//     <p>This app was built using the "jservice.io" Jeopardy API.  Endpoints include 18,000 categories, of which a random 6 are chosen when starting a game.  As not all categories contain the same values of clues (single jeopardy, double jeopardy, final jeopardy), a filter was put into place to only select categories that contained 200, 400, 600, 800, and 1,000</p>
// </div>
// `




// let aboutBtn = document.querySelector('.aboutBtn');
// aboutBtn.addEventListener('click', () => {
//     return 
// })

// Sets up modal with question and answer

let modal = document.querySelector('#myModal');
let modalContent = document.querySelector('.modal-content')
let counter = 0;
const onClueSelect = (clue) => {
    console.log(counter)
    modalContent.innerHTML = `
    <h3>${clue.question}</h3>
    <div class='revealDiv'>
    <p class='answerReveal'>Reveal Answer</p>
    </div>
`
    modalContent.addEventListener('click', (e) => {
        if(e.target.classList.contains('answerReveal')) {
            if(counter === 29) {
 
                modalContent.innerHTML = `
                <h3 class='answer'>${clue.answer}</h3>
                <div class='restartJeopardyBtn' onClick="location.reload(); return false;">Refresh to Play Again<div>
                `;
                window.onclick = function(event) {
                    if (event.target == modal && modalContent.firstElementChild.classList.contains('answer')) {
                    return
                    }
                  }
            } else {
            modalContent.innerHTML = `
            <h3 class='answer'>${clue.answer}</h3>
            `
            // document.querySelector('.close').onclick = function() {
            //     modal.style.display = "none";
            //   }
              window.onclick = function(event) {
                if (event.target == modal && modalContent.firstElementChild.classList.contains('answer')) {
                  modal.style.display = "none";
                  counter += 1;
                }
              }

            }
        }
    })
} 




const gameTemplate = (category, categoryDiv) => {
    category.selectedClues.forEach(selectedClue => {
        const clue = document.createElement('div');
        clue.classList.add('clue')
        clue.innerHTML = `$${selectedClue.value}`;
        categoryDiv.appendChild(clue)


        clue.addEventListener('click', () => {
            if(clue.innerHTML !== '') {
                selectedClue.value = 0;
                clue.innerHTML = '';
                onClueSelect(selectedClue)
                modal.style.display = "block";
            } 
        })
    })
}


const gameBoard = document.querySelector('.gameBoard')
// Render game
const renderGame = (categories) => {
    // DOM template goes here which will be set to some container's innerHTML **********
    let heroImage = document.querySelector('.heroImage');
    heroImage.style.display = 'none';
    let gameBoard = document.createElement('div');
    gameBoard.classList.add('gameBoard');
    let body = document.querySelector('body')
    body.appendChild(gameBoard);
    gameBoard.innerHTML = categoryTemplate(categories)
    gameTemplate(categories[0], document.querySelector('.category-1'))
    gameTemplate(categories[1], document.querySelector('.category-2'))
    gameTemplate(categories[2], document.querySelector('.category-3'))
    gameTemplate(categories[3], document.querySelector('.category-4'))
    gameTemplate(categories[4], document.querySelector('.category-5'))
    gameTemplate(categories[5], document.querySelector('.category-6'))
}


// on button click this will run
const startGame = async (val1, val2, val3, val4, val5) => {
    const randomCategories = await pickRandomCategories(val1, val2, val3, val4, val5)
    const selectedQuestions = pickRandomQuestions(randomCategories, val1, val2, val3, val4, val5)
    renderGame(selectedQuestions)
}

// On button click do this ***********
// startGame();

const singleJeopardyBtn = document.querySelector('.singleJeopardyBtn')
// const doubleJeopardyBtn = document.querySelector('.doubleJeopardyBtn')


singleJeopardyBtn.addEventListener('click', () => {
    startGame(200, 400, 600, 800, 1000)
});



// doubleJeopardyBtn.addEventListener('click', () => {
//     startGame(400, 800, 1200, 1600, 2000)
// })

