// Объект с сохраненными ответами 
const answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Движение вперёд
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click", function(){
        const thisCard = this.closest("[data-card]");
        const thisCardNumber = parseInt(thisCard.dataset.card)


        if(thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard)
            updateProgressBar("next", thisCardNumber);
        } else {

            // При движении вперёд и если нужно валидация - сохраняем данные в объект 
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            // Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("Сделайте ответ, прежде чем проходить далее.")
            }

        }

    });
});

// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click", function(){       
        const thisCard = this.closest("[data-card]");
        const thisCardNumber = parseInt(thisCard.dataset.card)

        navigate("prev", thisCard);
        updateProgressBar("prev", thisCardNumber);
    })
})

// Функиця для навигации вперед и назад 
function navigate(derection, thisCard) {

    const thisCardNumber = parseInt(thisCard.dataset.card);
    
    let nextCard;

    if (derection == "next") {
        nextCard = thisCardNumber + 1;
    } else {
        nextCard = thisCardNumber - 1;
    }
    
    thisCard.classList.add("hidden")
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Функция сбора заполненных данных  с карточки 
function gatherCardData(number) {
    /*
        question: "Ваши любимые блюда",
        answer:
                [
                    {name: "pirogi", value: "Пироги"},
                    {name: "salati", value: "Салаты"},
                ]
    */

    let question;
    const result = []

    // Находим карточку по номеру и data атрибуту
    const currentCard = document.querySelector(`[data-card="${number}"]`)

    // Находим гланый вопрос карточки 
    question = currentCard.querySelector("[data-question]").innerText;

    // 1. Находим все заполненные значения из радио кнопок 
    const radioValues = currentCard.querySelectorAll('[type="radio"]');

    radioValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // 2. Находим все заполненные значения из чекбоксов 
    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]')
    checkBoxValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // 3. Находим все заполненные значения из инпутов
    const inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item) {
        itemValue = item.value
        if ( itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    console.log(result)

    const data = {
        question: question,
        answer: result
    }

    return data
}

// Ф-я записи ответа в объект с ответами 
function saveAnswer(number, data) {
    answers[number] = data
}

// Ф-я проверки н азаполнитель 
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Ф-я для проверки email 
function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненость required чекбоксов и инпутов с email 
function checkOnRequired(number) {
    const currentCard = document.querySelector(`[data-card="${number}"]`);
    const requiredFields = currentCard.querySelectorAll("[required]");

    const isValidArray = [];

    requiredFields.forEach(function(item){
        if (item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if ( validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false
    }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function(item) {
    item.addEventListener("click", function(e){
        // Проверяем где произошёл клик - внутри тега label или нет
        const label = e.target.closest("label");
        if (label) {
            // Отменяем актиный класс у всех тегов label
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item) {
                item.classList.remove("radio-block--active");
            })
            // Добавляем активный класс к label по которому был клил
            label.classList.add("radio-block--active");
        }
    })
})

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener('change', function(){
        // Если чекбокс проставлен то 
        if (item.checked) {
            // добавляем активный класс к тегу label в котором он лежит 
            item.closest("label").classList.add("checkbox-block--active")
        } else {
            // в ином случае убираем активный класс
            item.closest("label").classList.remove("checkbox-block--active")
        }
    })
})

// Отображение прогресс бара
function updateProgressBar(direction, cardNumber){

    // Расчёт всего кол-ва карточек // 10
    let cardsTotalNumber = document.querySelectorAll("[data-card]").length;


    // Текущая карточка
    // Проверка направления перемещения 
    if (direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }

    // Расчёт % прохождения
    let progress = (cardNumber * 100) / cardsTotalNumber;
    progress = progress.toFixed()
    
    // Находим и обновляем прогресс бар
    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if (progressBar) {
        // обновить число прогресс бара
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
        // обновить полоску прогресс бара
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }

}

