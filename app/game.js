/*
 * Create a list that holds all of your cards
 */
const cardArray = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor",
    "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

// Get <ul> element that will hold the list of cards
const mainCard = document.querySelector(".deck");
// Get <ul> element that contains list of stars
const ratingContainer = document.querySelector(".stars")
// Get <span> element for moves
const movesContainer = document.querySelector(".moves");
// Get restart
const restartbtn = document.querySelector(".restart");
// Get timer
const timer = document.querySelector(".timer");
// Get modal
let modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// Modal displayed
const modalText = document.querySelector(".modalText");

let secs = 0, mins = 0;
let interval;
let moves = 0;
let cardFlipped = [];
let cardIds = [];
let name = "";

// initialize cards
function init() {
    shuffle(cardArray);
    for (let i = 0; i < cardArray.length; i++) {
        const cardList = document.createElement("li");
        cardList.classList.add("card");
        cardList.innerHTML = `<i class="${cardArray[i]}"></>`;
        mainCard.appendChild(cardList);

        //Add eventListener to the cards
        click(cardList);
    }
}

/*
 * click event
 */
function click(cardList) {
    //create an eventListener for cards
    cardList.addEventListener("click", function () {

        // Entering of name to start the game
        name = document.getElementById("nameReg").value;
        if (name == "") {
            alert("Enter your name");
        } else {

            // we have an existing opened card
            if (cardFlipped.length === 1) {

                const currentCard = this;
                const previousCard = cardFlipped[0];

                cardList.classList.add("open", "show", "disable");
                cardFlipped.push(this);

                // when compare the 2 cards
                compare(currentCard, previousCard);

            } else {
                // There is no opened cards
                cardList.classList.add("open", "show", "disable");
                cardFlipped.push(this);
            }
        }
    });
}

/*
 * compare the 2 cards
 */
function compare(currentCard, previousCard) {
    if (currentCard.innerHTML === previousCard.innerHTML) {
        //When Matched
        currentCard.classList.add("match");
        previousCard.classList.add("match");

        cardIds.push(currentCard, previousCard);

        //clear Array
        cardFlipped = [];

        //call this when the game is over
        gameOver();

    } else {
        //Not Matched
        //with 500ms, do this!
        setTimeout(function () {
            currentCard.classList.remove("open", "show", "disable");
            previousCard.classList.remove("open", "show", "disable");

            //clear Array
            cardFlipped = [];
        }, 500);
    }

    // call Add moves
    addMoves();
}

/*
 * When game  is over, do this!
 */
function gameOver() {
    if (cardIds.length === cardArray.length) {
        clearInterval(interval);
        modalDisplayed();
    }
}

/*
 * Rating
 */
function rating() {
    switch (moves) {
        case 15:
            ratingContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>`;
            break;
        case 25:
            ratingContainer.innerHTML = `<li><i class="fa fa-star"></i></li>`;
            break;
    }
}

/*
 * Moves
 */
function addMoves() {
    moves++;
    if (moves === 1) {
        startTimer();
    }
    movesContainer.innerHTML = `${moves} Moves`;
    //call rating
    rating();
}
movesContainer.textContent = "Moves"

/*
 * Restart button
 */
restartbtn.addEventListener("click", function () {
    //Delete all cards
    mainCard.innerHTML = "";
    //call init to create new cards
    init();
    //Restart all matched cards
    cardIds = [];
    //Reset moves
    moves = 0;
    movesContainer.innerHTML = `${moves} Moves`;
    //Reset rating back to 3 stars
    ratingContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`
    //Reset timer
    clearInterval(interval);
    timer.innerHTML = `Time: 0mins 0secs`;
});

/////start the first game!
init();

/*
 * Timer
 */
function startTimer() {
    secs = 0;
    mins = 0;
    hour = 0;
    interval = setInterval(function () {
        secs++;
        if (secs == 60) {
            mins++;
            secs = 0;
        }
        if (mins == 60) {
            hour++;
            mins = 0;
        }
        timer.innerHTML = `Time: ${mins}mins ${secs}secs`;
    }, 1000);
}
timer.textContent = "Time: 0mins 0secs";


// When the user clicks on <span> (x), close the modal and restart 
span.addEventListener("click", function () {
    modal.style.display = "none";
    //Delete all cards
    mainCard.innerHTML = "";
    //call init to create new cards
    init();
    //Restart all matched cards
    cardIds = [];
    //Reset moves
    moves = 0;
    movesContainer.innerHTML = `${moves} Moves`;
    //Reset rating back to 3 stars
    ratingContainer.innerHTML = `<li><i class="fa fa-star"></i></li>
     <li><i class="fa fa-star"></i></li>
     <li><i class="fa fa-star"></i></li>`
    //Reset timer
    clearInterval(interval);
    timer.innerHTML = `Time: 0mins 0secs`;

     document.getElementById("nameReg").value = "";

});

/*
* Congratulations Popup
*/
function modalDisplayed() {
    name = document.getElementById("nameReg").value;
    modal.style.display = "block";
    modalText.innerHTML = `<p><h2>Congratulations ${name}<h2>You Won!  ${timer.innerHTML},  Star Rate:${ratingContainer.innerHTML}</p>`
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

