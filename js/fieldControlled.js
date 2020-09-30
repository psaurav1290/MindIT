// -------------------Initiate variables-------------------

var object = [
        [true, 'Robert Downey Jr Robert Downey Jr Robert Downey Jr Robert Downey Jr'],
        [true, 'BenedictCumberbatchBenedictCumberbatchBenedictCumberbatchBenedictCumberbatchBenedictCumberbatchBenedictCumberbatchBenedictCumberbatchBenedictCumberbatch'],
        [true, 'Leonardo de Caprio Leonardo de Caprio Leonardo de Caprio Leonardo de Caprio', false]
    ],
    resizeOptions = {
        extraSpace: 0,
        limit: 5000
    },
    shiftPressed = 0

setSelectionRange = (input, selectionStart, selectionEnd) => {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

setCaretToPos = (input, pos) => {
    setSelectionRange(input, pos, pos);
}

// -------------------On Clicking Checkbox-------------------

toggleState = event => {
    event.target.classList.toggle("checked")
}

// -------------------Key Press-------------------

mergeCells = (currentTextArea) => {
    let currentCell = currentTextArea.parentElement.parentElement
    let previousCell = currentCell.previousElementSibling
    console.log(previousCell)
    if (previousCell.classList != "line")
        return
    let previousTextArea = previousCell.querySelectorAll("textarea")[1]
    $(currentTextArea).val($(previousTextArea).val() + $(currentTextArea).val())
    setCaretToPos(currentTextArea, $(previousTextArea).val().length)
    $(previousCell).detach()
    $(currentTextArea).prev().detach()
    $(currentTextArea).autoResize(resizeOptions)
}

addNewCell = (currentTextArea) => {
    let currentCell = currentTextArea.parentElement.parentElement
    $(currentTextArea).prev().detach()
    $(currentTextArea).removeAttr("style")
    $(currentCell).before($(currentCell).clone().addClass("newAdded"))
    $(".newAdded textarea").val($(currentTextArea).val().slice(0, currentTextArea.selectionStart))
    $(currentTextArea).val($(currentTextArea).val().slice(currentTextArea.selectionStart))
    setCaretToPos(currentTextArea, 0)
    currentCell.querySelector(".box").classList = "box"
    $(".newAdded .box").click(toggleState)
    $('.newAdded textarea').on("keydown", keyPress)
    $(".newAdded textarea").autoResize2(resizeOptions)
    $(".newAdded").removeClass("newAdded")
    $(currentTextArea).autoResize(resizeOptions)
}

appendNewCell = (boxVal, lineVal) => {
    $("#notepad").append(`<div class="cell newAdded"><div class="columnBox"><div class="box"></div></div><div class="columnLine"><textarea class="line">${lineVal}</textarea></div></div>`)
    if (boxVal)
        $('.newAdded .box').addClass("checked")
    $('.newAdded .box').click(toggleState)
    $('.newAdded textarea').on("keydown", keyPress)
    $('.newAdded textarea').autoResize2(resizeOptions);
    $('.newAdded').removeClass("newAdded");
}

logger = (event) => {
    if (event.keyCode == 16)
        shiftPressed = event.type == 'keydown';
}
$(window).on("keydown", logger)
$(window).on("keyup", logger)


let keyPress = event => {
    let preventDefault = false

    if (event.keyCode == 37) { // LEFT KEY PRESSED
    } else if (event.keyCode == 39) { // RIGHT KEY PRESSED
    } else if (event.keyCode == 38) { // UP KEY PRESSED
    } else if (event.keyCode == 40) { // DOWN KEY PRESSED
    } else if (event.keyCode == 13) { // ENTER KEY PRESSED
        if (!shiftPressed) {
            addNewCell(event.target)
            preventDefault = true
        }
    } else if (event.keyCode == 8) { // BACKSPACE KEY PRESSED
        if (!event.target.selectionStart && !event.target.selectionEnd) { //Prevents the case of merging in case of backspacing the whole field: When nothing is slected the both selstart and selend are 0
            mergeCells(event.target)
            preventDefault = true
        }
    } else if (event.keyCode == 46) { // DELETE KEY PRESSED
    }

    if (preventDefault)
        event.preventDefault()
}

loadContent = () => {
    object.forEach(line => appendNewCell(line[0], line[1]))
}

$(window).resize(event => {
    $(".line").prev().detach()
    $(".line").removeAttr("style")
    $(".line").autoResize2(resizeOptions)
})

setTime = () => {
    now = new Date()
    console.log(now.toDateString() + ", " + now.toLocaleTimeString())
    $("#title-container-time").text("Last modified: " + now.toDateString() + ", " + now.toLocaleTimeString())
}

determineTheme = () => {
    if ($('body').classList == "day")
        $('#notepad').css("background-image", 'url(".. / img / rules - day.svg")')
}

window.onload = () => {
    $("textarea").autoResize2(resizeOptions)
    loadContent()
    determineTheme()
    setTime()
}

/*
FEATURES - 
    -   Key bindings for arrow keys to navigate
    -   Enter for new line and Backspace to clear line allowed
    -   Resize canvas on long lines
*/

/**
 * Canvas had a problem with mobile devices. Keyboard was not visible in android.
 * Using multiple textareas slows down the webpage
 */