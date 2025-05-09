const defaultCount = 20;
const ufosCount = 10;
let shootCount = defaultCount;
let translateX = 0;
let translateY = 0;
let maxMove = window.screen.width / 2 - 200;

let containerX = 10;
let containerY = 0;
let destroyed = 0;

let moving;

function handleKeyPress(event) {
    event.preventDefault();
    let img = document.getElementById("ship");
    let key = event.key;

    if (key === "ArrowLeft") {
        if (translateX > -maxMove) {
            translateX -= 10;
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else if (key === "ArrowRight") {
        if (translateX < maxMove) {
            translateX += 10;
        }
        img.style.transform = `translate(${translateX}px, ${translateY}px)`;
    } else if (event.code === "Space") {
        if (shootCount > 0) {
            shootCount--;
            shot();
        } else {
            alert("You are out of shoots");
        }
    }
}

function startGame() {
    let button = document.getElementById("startButton");
    button.style.display = "none";

    let img = document.getElementById("ship");
    translateY += 350;
    img.style.transform = "translateY(" + translateY + "px)";

    const imageNames = [
        "https://png.pngtree.com/png-clipart/20240306/original/pngtree-ufo-spaceship-free-png-download-png-image_14526284.png",
        "https://png.pngtree.com/png-vector/20240607/ourmid/pngtree-whimsical-alien-spaceships-and-ufo-clipart-png-image_12643904.png",
        "https://png.pngtree.com/png-vector/20240308/ourmid/pngtree-flying-saucer-aliens-ufo-png-image_11913121.png"
    ];

    const imageContainer = document.getElementById("imageContainer");
    let imageId = 0;
    for (let i = 0; i < ufosCount; i++) {
        const image = document.createElement("img");
        const imageName = imageNames[imageId];
        image.src = imageName;
        image.className = "ufo";
        imageContainer.appendChild(image);

        imageId++;
        if (imageId === imageNames.length) {
            imageId = 0;
        }
    }

    moving = setInterval(function () {
        containerY += 5;
        containerX *= -1;
        imageContainer.style.transform = `translate(${containerX}px, ${containerY}px)`;

        const divRect = imageContainer.getBoundingClientRect();
        const shipRect = document.getElementById("ship").getBoundingClientRect();

        if (divRect.bottom > shipRect.top) {
            resetGame("The game is over!");
        }
    }, 1000 / 4);

    window.addEventListener("keydown", handleKeyPress);
}

function shot() {
    let splashContainer = document.getElementById("splashContainer");
    let ship = document.getElementById("ship");

    const shipRect = ship.getBoundingClientRect();
    const shipCenterX = shipRect.left + shipRect.width / 2;

    let splash = document.createElement("div");
    splash.className = "splash";
    splash.style.position = "absolute";
    splash.style.left = shipCenterX + "px";
    splash.style.top = shipRect.top + "px";
    splashContainer.appendChild(splash);

    const movingInterval = setInterval(function () {
        for (let i = 0; i < imageContainer.children.length; i++) {
            const childElement = imageContainer.children[i];
            if (childElement.style.visibility === "hidden") {
                continue;
            }

            const divRect = childElement.getBoundingClientRect();
            const splashRect = splash.getBoundingClientRect();

            if (
                divRect.right >= splashRect.right &&
                divRect.left <= splashRect.left &&
                splashRect.top < divRect.bottom
            ) {
                clearInterval(movingInterval);
                splashContainer.removeChild(splash);
                childElement.style.visibility = "hidden";
                destroyed++;

                if (destroyed === ufosCount) {
                    resetGame("You are the winner!");
                }

                return;
            }
        }

        const splashPositionY = parseFloat(splash.style.top);
        const step = 10;

        if (splashPositionY <= 0) {
            clearInterval(movingInterval);
            splash.remove();
        } else {
            splash.style.top = splashPositionY - step + "px";
        }
    }, 1000 / 60);
}

function resetGame(message) {
    alert(message);

    clearInterval(moving);

    let button = document.getElementById("startButton");
    button.style.display = "block";

    let ship = document.getElementById("ship");
    let imageContainer = document.getElementById("imageContainer");

    translateX = 0;
    translateY = 0;
    containerX = 10;
    containerY = 0;
    destroyed = 0;
    shootCount = defaultCount;

    ship.style.transform = "translate(0px, 0px)";
    imageContainer.style.transform = "translate(0px, 0px)";
    imageContainer.innerHTML = "";
}
