// -------------------Initiate variables-------------------

let container = document.querySelector(".main-container"),
    canvas = document.querySelector("#editable"),
    cursor = document.querySelector("#cursor"),
    context = canvas.getContext("2d"),
    canvasWidth,
    canvasHeight,
    memoStream = JSON.parse(canvas.textContent.trim()),
    baseX = 64,
    stepX = 18,
    baseY = 40,
    stepY = 44,
    cursorPosX = 0,
    cursorPosY = 0,
    canvasFocus = true,
    check = document.querySelector("#check"),
    uncheck = document.querySelector("#uncheck")

// -------------------Utility Functions-------------------

let min = (x, y) => {
    if (x < y)
        return x
    else
        return y
}
let max = (x, y) => {
    if (x > y)
        return x
    else
        return y
}
let cursorPosXMax = (item = cursorPosY) => memoStream[item][0].length
let cursorPosYMax = () => memoStream.length - 1

// -------------------On Clicking outside Canvas-------------------

let deFocusCanvas = event => {
    if (canvasFocus) {
        cursor.style.display = "none"
        container.style.opacity = "0.7"
        canvasFocus = false
    }
}
window.addEventListener("click", deFocusCanvas)

// -------------------If click in Cell-------------------

let inCell = (x, y) => {
    if (x >= 64 && y >= 10) {
        if ((y - 10) % 44 < 30) {
            let xIndex = Math.round((x - baseX) / stepX),
                yIndex = Math.floor((y - 10) / 44)
            if (yIndex <= cursorPosYMax()) {
                xIndex = min(xIndex, cursorPosXMax(yIndex))
                return [xIndex, yIndex]
            }
        }
    }
    return -1
}

// -------------------If click in Checkbox-------------------

let inCheckbox = (x, y) => {
    if (x >= 16 && x < 64 && y >= 15) {
        if ((y - 15) % 44 < 32) {
            let changeCheckIndex = Math.floor((y - 15) / 44)
            if (changeCheckIndex <= cursorPosYMax())
                return changeCheckIndex
        }
    }
    return -1
}

// -------------------On Clicking in Canvas-------------------

let locateClick = event => {
    if (!canvasFocus) {
        cursor.style.display = "block"
        container.style.opacity = "1"
        $("#proxyInput").focus()
        canvasFocus = true
    }
    event.stopPropagation()

    let checkboxRegion = inCheckbox(event.layerX, event.layerY)
    if (checkboxRegion != -1) {
        memoStream[checkboxRegion][1] = !memoStream[checkboxRegion][1]
        reprintContent()
        return
    }
    let cellRegion = inCell(event.layerX, event.layerY)
    if (cellRegion != -1) {
        [cursorPosX, cursorPosY] = cellRegion
        moveCursor()
    }
}
canvas.addEventListener("click", locateClick)

// -------------------On Hover over checkbox---------------

let changeCursorToPointer = event => {
    let checkboxRegion = inCheckbox(event.layerX, event.layerY)
    if (canvasFocus) {
        if (checkboxRegion != -1) {
            canvas.style.cursor = "pointer"
            return
        }
        let cellRegion = inCell(event.layerX, event.layerY)
        if (cellRegion != -1) {
            canvas.style.cursor = "text"
            return
        }
    }
    canvas.style.cursor = "default"
}
canvas.addEventListener("mousemove", changeCursorToPointer)

// -------------------Calc Pixel Pos-------------------

let calculatePixelPos = (x, y, mode = 0) => {
    if (mode == 0) // For cursor Position
        return [stepX * x, stepY * y]
    else if (mode == 1) // For line postion
        return [baseX + stepX * x, baseY + stepY * y]
    else if (mode == -1) // For checkbox Position
        return [16, baseY - 25 + stepY * y]
}

// -------------------Line Print-------------------

let printLine = (text, x, y) => {
    context.font = "30px Courier"
    context.fillText(text, ...calculatePixelPos(x, y, 1))
}

// -------------------Box Print-------------------

let printBox = (checked, x, y) => {
    if (checked)
        context.drawImage(check, ...calculatePixelPos(x, y, -1), 32, 32)
    else
        context.drawImage(uncheck, ...calculatePixelPos(x, y, -1), 32, 32)
}

// -------------------Print Content-------------------

let reprintContent = () => {
    context.clearRect(16, 10, canvasWidth, canvasHeight)
    let y = 0
    memoStream.forEach(item => {
        printBox(item[1], 0, y)
        printLine(item[0], 0, y)
        y += 1
    })
}

// -------------------Move Cursor-------------------

let moveCursor = () => {
    let cursorPixelPos = calculatePixelPos(cursorPosX, cursorPosY, 0)
    cursor.style.transform = `translateX(${cursorPixelPos[0]}px) translateY(${cursorPixelPos[1]}px)`
}

// -------------------Key Press-------------------

let keyPress = event => {
    if (!canvasFocus)
        return
    let altered = false,
        navigated = true

    if (event.keyCode == 37) { // LEFT KEY PRESSED
        if (cursorPosX) { // If not in begining of line
            cursorPosX -= 1
        } else if (cursorPosY) { // If in begining of line and not in first line
            cursorPosY -= 1 // Previous Line
            cursorPosX = cursorPosXMax() // End of previous line
        } else
            navigated = false
    } else if (event.keyCode == 39) { // RIGHT KEY PRESSED
        if (cursorPosX != cursorPosXMax()) // If not in end of line
            cursorPosX += 1
        else if (cursorPosY != cursorPosYMax()) { // If in end of line and not in last line
            cursorPosY += 1 // Next line
            cursorPosX = 0 // Begining of the next line
        } else
            navigated = false
    } else if (event.keyCode == 38) { // UP KEY PRESSED
        if (cursorPosY) { // If not in first line
            cursorPosY -= 1 // Previous line
            cursorPosX = min(cursorPosXMax(), cursorPosX) // If line is shorter then move to end of line
        } else if (cursorPosX) { // If in first line and not in begining
            cursorPosX = 0 // Move to begining
        } else
            navigated = false
    } else if (event.keyCode == 40) { // DOWN KEY PRESSED
        if (cursorPosY != cursorPosYMax()) { // If not in last line
            cursorPosY += 1 // Next line
            cursorPosX = min(cursorPosXMax(), cursorPosX) // If line is shorter then move to end of line
        } else if (cursorPosX != cursorPosXMax()) { // If in last line and not in end
            cursorPosX = cursorPosXMax() // If in beginning of the line
        } else
            navigated = false
    } else {
        navigated = false
        altered = true
        if (event.keyCode == 13) { // ENTER KEY PRESSED
            memoStream.splice(cursorPosY, 1, [memoStream[cursorPosY][0].slice(0, cursorPosX), memoStream[cursorPosY][1]], [memoStream[cursorPosY][0].slice(cursorPosX), false])
            cursorPosX = 0
            cursorPosY += 1
        } else if (event.keyCode == 8) { // BACKSPACE KEY PRESSED
            if (cursorPosX) { // If not in begining of line
                let currentItem = memoStream[cursorPosY][0]
                memoStream[cursorPosY][0] = `${currentItem.slice(0,cursorPosX-1)}${currentItem.slice(cursorPosX)}`
                cursorPosX -= 1
            } else if (cursorPosY) { // If in begining of line and not in first line
                let previousItem = memoStream[cursorPosY - 1][0],
                    currentItem = memoStream[cursorPosY][0],
                    previousItemState = memoStream[cursorPosY - 1][1]
                memoStream.splice(cursorPosY - 1, 2, [`${previousItem}${currentItem}`, previousItemState])
                cursorPosY -= 1
                cursorPosX = previousItem.length
            } else
                altered = false
        } else if (event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 111) || (event.keyCode >= 186 && event.keyCode <= 222)) {
            let currentItem = memoStream[cursorPosY][0]
            memoStream[cursorPosY][0] = `${currentItem.slice(0,cursorPosX)}${event.key}${currentItem.slice(cursorPosX)}`
            cursorPosX += 1
        } else
            altered = false
    }

    if (navigated) {
        event.preventDefault()
        moveCursor()
    } else if (altered) {
        event.preventDefault()
        moveCursor()
        reprintContent()
    }
}
window.addEventListener("keydown", keyPress)

// -------------------Set Canvas Size-------------------

let resizeCanvas = (width = 0, height = 0) => {
    if (width && height) {
        canvas.width = width
        canvas.height = height
    } else {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
    }
}

// -------------------Canvas Size Calculator-------------------

let calculateCanvasSize = () => {
    let widthContainer = container.clientWidth,
        heightWindow = window.innerHeight
    canvasWidth = `${widthContainer - 64}`
    canvasHeight = heightWindow - 64
}

// -------------------On Resize-------------------

let onWindowResize = () => {
    calculateCanvasSize()
    resizeCanvas()
    reprintContent()
}
window.addEventListener('resize', onWindowResize)

window.onload = () => {
    onWindowResize()
    onWindowResize()
}

/*
FEATURES - 
    -   Key bindings for arrow keys to navigate
    -   Enter for new line and Backspace to clear line allowed
    -   Resize canvas on long lines
*/