export function doStuff(playerElement) {

    const interval = setInterval(function () {
        let deg = Math.floor(Math.random() * 360);
        playerElement.style.transform = "rotate(" + deg + "deg)";
    }, 1000);
}