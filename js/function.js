showMenu = () => {
    $("#menu").css("transform", "translateY(0)")
    // $(".header-link").css("transform", "translateY(100%)")
    $("#header-bar-list").css("transform", "translateY(100%)")
    $("#header-bar-list .header-link").removeClass("header-link-up")
    $("#header-bar-list .header-link").addClass("header-link-down")
    $("#menu-open").hide()
    $("#menu-close").show()
}
$("#menu-open").click(showMenu)

hideMenu = () => {
    $("#menu").css("transform", "translateY(-100%)")
    // $(".header-link").css("transform", "translateY(0)")
    $("#header-bar-list").css("transform", "translateY(0)")
    $("#header-bar-list .header-link").removeClass("header-link-down")
    $("#header-bar-list .header-link").addClass("header-link-up")
    $("#menu-open").show()
    $("#menu-close").hide()
}
$("#menu-close").click(hideMenu)

// setTime = () => {
//     now = new Date()
//     console.log(now.toDateString() + ", " + now.toLocaleTimeString())
//     $("#title-container-time").text(now.toDateString() + ", " + now.toLocaleTimeString())
// }

// determineTheme = () => {
//     if ($('body').classList == "day")
//         $('#notepad').css("background-image", 'url(".. / img / rules - day.svg")')
// }

// window.onload = () => {
//     setTime()
//     determineTheme()
// }