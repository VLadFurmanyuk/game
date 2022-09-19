document.addEventListener('DOMContentLoaded', () => {
    const field = document.querySelector('.field')
    const character = document.createElement('div')
    let characterLeftSpace = 50
    let startPoint = 150
    let characterBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimeId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function createCharacter(){
        field.appendChild(character)
        character.classList.add('character')
        characterLeftSpace = platforms[0].left
        character.style.left = characterLeftSpace + 'px'
        character.style.bottom = characterBottomSpace + 'px'
    }

    class Platform{
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform');
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            field.appendChild(visual)
        }
    }

    function createPlatforms(){
        for (let i=0; i < platformCount; i++){
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms(){
        if (characterBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimeId)
        isJumping = true
        upTimerId = setInterval(function (){
            characterBottomSpace += 20
            character.style.bottom = characterBottomSpace + 'px'
            if (characterBottomSpace > startPoint + 200){
                fall()
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimeId = setInterval(function (){
            characterBottomSpace -= 5
            character.style.bottom = characterBottomSpace + 'px'
            if (characterBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (characterBottomSpace >= platform.bottom) &&
                    (characterBottomSpace <= platform.bottom + 15) &&
                    ((characterLeftSpace + 60) >= platform.left) &&
                    (characterLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ){
                    console.log('landed')
                    startPoint = characterBottomSpace
                    jump()
                }
            });
        },30)
    }

    function gameOver(){
        console.log('game over')
        isGameOver = true
        while (field.firstChild){
            field.removeChild(field.firstChild)
        }
        field.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimeId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e){
        if (e.key === "ArrowLeft"){
            moveLeft()
        }else if (e.key === "ArrowRight"){
            moveRight()
        } else if (e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft(){
        if (isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function (){
            if (characterLeftSpace >= 0){
                characterLeftSpace -= 5
                character.style.left = characterLeftSpace + 'px'
            } else moveRight()
        },20)
    }

    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function (){
            if (characterLeftSpace <= 340){
                characterLeftSpace += 5
                character.style.left = characterLeftSpace + 'px'
            } else moveLeft()
        },20)
    }

    function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start(){
        if (!isGameOver){
            createPlatforms()
            createCharacter()
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})