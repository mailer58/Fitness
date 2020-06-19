'use strict'
// js для IE 11

let internetExplorer = false;

const trainersSliderWindow = document.querySelector('.trainers__slider-window');
const trainersPrevBtn = document.querySelector('.trainers__prev-arrow-btn');
const trainersNextBtn = document.querySelector('.trainers__next-arrow-btn');
const trainersSequence = document.querySelector('.trainers__sequence');

const accountsSliderWindow = document.querySelector('.accounts__slider-window');
const accountsSequence = document.querySelector('.accounts__sequence');
const accountsNextBtn = document.querySelector('.accounts__next-arrow-btn');
const accountsPrevBtn = document.querySelector('.accounts__prev-arrow-btn');

const headerCaption = document.querySelector('.page-header__caption');
headerCaption.style.width = "220px";

const DIRECTION = {
    NEXT: 'next',
    PREV: 'prev'
}

const SIZES = {
    MIN: 320,
    MID: 768,
    MAX: 1200
}

const trainersFeatures = {
    NAME: 'trainers',
    PHOTOS_NUMBER: 8,

    MOBILE_PHOTO_WIDTH: 226,
    MOBILE_VISIBLE_WIDTH: 226,
    MOBILE_VISIBLE_PHOTOS: 1,
    MOBILE_SLIDES_NUMBER: 8,
    MOBILE_GAP: 0,
    MOBILE_ANIMATION_DURATION: 200,

    TABLET_PHOTO_WIDTH: 268,
    TABLET_VISIBLE_WIDTH: 566,
    TABLET_VISIBLE_PHOTOS: 2,
    TABLET_GAP: 30,
    TABLET_ANIMATION_DURATION: 400,

    DESKTOP_PHOTO_WIDTH: 260,
    DESKTOP_VISIBLE_WIDTH: 1160,
    DESKTOP_VISIBLE_PHOTOS: 4,
    DESKTOP_GAP: 40,
    DESKTOP_ANIMATION_DURATION: 500,
}

const accountsFeatures = {
    NAME: 'accounts',
    PHOTOS_NUMBER: 2,

    MOBILE_PHOTO_WIDTH: 226,
    MOBILE_VISIBLE_WIDTH: 226,
    MOBILE_VISIBLE_PHOTOS: 1,
    MOBILE_GAP: 0,
    MOBILE_ANIMATION_DURATION: 200,

    TABLET_PHOTO_WIDTH: 566,
    TABLET_VISIBLE_WIDTH: 566,
    TABLET_VISIBLE_PHOTOS: 1,
    TABLET_GAP: 0,
    TABLET_ANIMATION_DURATION: 200,

    DESKTOP_PHOTO_WIDTH: 566,
    DESKTOP_VISIBLE_WIDTH: 566,
    DESKTOP_VISIBLE_PHOTOS: 1,
    DESKTOP_GAP: 0,
    DESKTOP_ANIMATION_DURATION: 200,
}

let trainersSlideIndex = 1;
let accountsSlideIndex = 1;

const smoothScrollTo = function () {
    let timer;
    let start;
    let factor;

    return function (target, duration) {
        const offset = window.pageYOffset;
        const delta = target - window.pageYOffset;
        start = Date.now();
        factor = 0;

        if (timer) {
            clearInterval(timer);
        }

        function step() {
            let y;
            factor = (Date.now() - start) / duration;
            if (factor >= 1) {
                clearInterval(timer);
                factor = 1;
            }
            y = factor * delta + offset;
            window.scrollBy(0, y - window.pageYOffset);
        }

        timer = setInterval(step, 10);
        return timer;
    };
};

function getSlidesNumber(photosNumber, visiblePhotosNumber) {
    return Math.ceil(photosNumber / visiblePhotosNumber);
}

function getSliderWidth(photoWidth, photosNumber, gap) {
    return photoWidth * photosNumber + gap * photosNumber - gap;
}

function moveSlides(slideIndexExt) {
    let slideIndex = slideIndexExt;
    return function (sliderFeatures, sequence, evt) {
        const blocks = document.getElementsByClassName(sequence);
        let sliderVisible;
        let sliderHidden;
        for (let i = 0; i < blocks.length; i++) {
            let className = blocks[i].className;
            if (className.indexOf('visible') > -1) {
                sliderVisible = blocks[i];
            }
            if (className.indexOf('hidden') > -1) {
                sliderHidden = blocks[i];
            }
        }

        let width;
        let sliderWidth;
        let slidesNumber;
        let slideGap;
        let animationDuration;
        let direction = evt.currentTarget;
        direction = direction.className;
        direction = direction.indexOf(DIRECTION.NEXT) > -1 ? DIRECTION.NEXT : DIRECTION.PREV;
        const windowWidth = document.body.clientWidth;
        if (windowWidth >= SIZES.MIN && windowWidth < SIZES.MID) {

            width = sliderFeatures.MOBILE_VISIBLE_WIDTH;
            sliderWidth = getSliderWidth(sliderFeatures.MOBILE_PHOTO_WIDTH, sliderFeatures.PHOTOS_NUMBER, sliderFeatures.MOBILE_GAP);
            slidesNumber = getSlidesNumber(sliderFeatures.PHOTOS_NUMBER, sliderFeatures.MOBILE_VISIBLE_PHOTOS);
            slideGap = sliderFeatures.MOBILE_GAP;
            animationDuration = sliderFeatures.MOBILE_ANIMATION_DURATION;
        }

        if (windowWidth >= SIZES.MID && windowWidth < SIZES.MAX) {

            width = sliderFeatures.TABLET_VISIBLE_WIDTH;
            sliderWidth = getSliderWidth(sliderFeatures.TABLET_PHOTO_WIDTH, sliderFeatures.PHOTOS_NUMBER, sliderFeatures.TABLET_GAP);
            slidesNumber = getSlidesNumber(sliderFeatures.PHOTOS_NUMBER, sliderFeatures.TABLET_VISIBLE_PHOTOS);
            slideGap = sliderFeatures.TABLET_GAP;
            animationDuration = sliderFeatures.TABLET_ANIMATION_DURATION;
        }

        if (windowWidth >= SIZES.MAX) {

            width = sliderFeatures.DESKTOP_VISIBLE_WIDTH;
            sliderWidth = getSliderWidth(sliderFeatures.DESKTOP_PHOTO_WIDTH, sliderFeatures.PHOTOS_NUMBER, sliderFeatures.DESKTOP_GAP);
            slidesNumber = getSlidesNumber(sliderFeatures.PHOTOS_NUMBER, sliderFeatures.DESKTOP_VISIBLE_PHOTOS);
            slideGap = sliderFeatures.DESKTOP_GAP;
            animationDuration = sliderFeatures.DESKTOP_ANIMATION_DURATION;

        }

        const steps = width * slideIndex;
        const gaps = slideIndex * slideGap;
        let shift;

        // установка скрытого слайдера слева:
        if (slideIndex === 1) {
            sliderHidden.style.transitionDuration = '0s';

            shift = sliderWidth + gaps;
            sliderHidden.style.left = '-' + shift + 'px';
            sliderHidden.offsetWidth;
        }

        // изменение индекса:
        direction === DIRECTION.NEXT ? slideIndex++ : slideIndex--;

        // параметры скрытого слайдера:
        sliderHidden.style.opacity = '1';

        // установка скрытого слайдера справа:
        if (slideIndex === slidesNumber) {
            shift = width + slideGap;
            sliderHidden.style.left = shift + 'px';
        }

        // когда слайды "заканчиваются":
        if (slideIndex > slidesNumber || slideIndex < 1) {
            sliderHidden.style.transitionDuration = animationDuration / 1000 + 's'; // ms -> s
            if (slideIndex > slidesNumber) {
                // завершающая анимация
                // "отъезжающего" влево слайдера:
                shift = sliderWidth + slideGap;
                sliderVisible.style.left = '-' + shift + 'px';

                // анимация появления скрытого слайдера
                // в направлении справа-налево:
                sliderHidden.style.left = '0';

                // установка индекса в начало:
                slideIndex = 1;
            }

            if (slideIndex < 1) {
                // параметры скрытого слайдера:
                shift = sliderWidth + gaps;
                sliderHidden.style.left = '-' + shift + 'px';

                // анимация "отъезжающего" вправо
                // исходного слайдера:
                sliderVisible.style.left = width + gaps + 'px';
                // анимация появления нового слайдера
                // в направлении слева-направо:
                shift = sliderWidth - width;
                sliderHidden.style.left = '-' + shift + 'px';

                // установка индекса в конец:
                slideIndex = slidesNumber;
            }

            // смена имен классов слайдеров после
            // исчезновения одного из них из видимой области:

            let hidden = sliderFeatures.NAME + '__sequence--hidden';
            let visible = sliderFeatures.NAME + '__sequence--visible';
            sliderVisible.classList.add(hidden);
            sliderVisible.classList.remove(visible);
            sliderHidden.classList.remove(hidden);
            sliderHidden.classList.add(visible);

            return;
        }

        if (direction === DIRECTION.NEXT) {
            sliderVisible.offsetWidth;
            // анимация слайдера влево:
            shift = steps + gaps;
            sliderVisible.style.left = '-' + shift + 'px';
        }

        if (direction === DIRECTION.PREV) {
            // анимация слайдера вправо:
            shift = ((slideIndex - 1) * width) + ((slideIndex - 1) * slideGap);
            sliderVisible.style.left = '-' + shift + 'px';
        }
    }
}

/* Табы */
const subscriptionsList = document.querySelector('.subscriptions__months-list');
const coachCard = document.querySelector('.subscriptions__card--coach');
const coachPrice = coachCard.querySelector('.subscriptions__price');

const dayCard = document.querySelector('.subscriptions__card--day');
const dayPrice = dayCard.querySelector('.subscriptions__price');

const fullDayCard = document.querySelector('.subscriptions__card--full-day');
const fullDayPrice = fullDayCard.querySelector('.subscriptions__price');

const lessons = document.querySelector('.subscriptions__duration--coach');

const MONTHS = {
    ONE: 1,
    SIX: 6,
    TWELVE: 12
}

const COACH_PRICES = {
    MONTHS1: 5000,
    MONTHS6: 25000,
    MONTHS12: 55000
}

const DAY_PRICES = {
    MONTHS1: 1700,
    MONTHS6: 8500,
    MONTHS12: 18700
}

const FULL_DAY_PRICES = {
    MONTHS1: 2700,
    MONTHS6: 13500,
    MONTHS12: 29700
}

const LESSONS_MONTHS = {
    ONE: 12,
    SIX: 72,
    TWELVE: 144
}

function changeSubscription (evt) {
    evt.preventDefault();
    const target = evt.target;
    const isSelected = target.classList.contains('subscriptions__month-item--selected');

    let months = target.dataset.months;
    if (!isSelected && months) {
        months = Number(months);
        switch (months) {
            case MONTHS.ONE:
                coachPrice.innerHTML = COACH_PRICES.MONTHS1 + '<span class="subscriptions__ruble"> ₽</span>';

                dayPrice.innerHTML = DAY_PRICES.MONTHS1 + '<span class="subscriptions__ruble"> ₽</span>';

                fullDayPrice.innerHTML = FULL_DAY_PRICES.MONTHS1 + '<span class="subscriptions__ruble"> ₽</span>';
                
                lessons.innerHTML = '<span class="subscriptions__lessons-number">' + LESSONS_MONTHS.ONE + '</span> занятий';

                coachCard.classList.remove('subscriptions__card--coach-6');
                coachCard.classList.remove('subscriptions__card--coach-12');

                dayCard.classList.remove('subscriptions__card--day-6');
                dayCard.classList.remove('subscriptions__card--day-12');

                fullDayCard.classList.remove('subscriptions__card--full-day-6');
                fullDayCard.classList.remove('subscriptions__card--full-day-12');

                break;

            case MONTHS.SIX:
                coachPrice.innerHTML = COACH_PRICES.MONTHS6 + '<span class="subscriptions__ruble"> ₽</span>';                    
                
                dayPrice.innerHTML = DAY_PRICES.MONTHS6 + '<span class="subscriptions__ruble"> ₽</span>';  
                
                fullDayPrice.innerHTML = FULL_DAY_PRICES.MONTHS6 + '<span class="subscriptions__ruble"> ₽</span>';
                
                lessons.innerHTML = '<span class="subscriptions__lessons-number">' + LESSONS_MONTHS.SIX + '</span> занятия';

                coachCard.classList.add('subscriptions__card--coach-6');
                coachCard.classList.remove('subscriptions__card--coach-12');

                dayCard.classList.add('subscriptions__card--day-6');
                dayCard.classList.remove('subscriptions__card--day-12');

                fullDayCard.classList.add('subscriptions__card--full-day-6');
                fullDayCard.classList.remove('subscriptions__card--full-day-12');
                break;

            case MONTHS.TWELVE:
                coachPrice.innerHTML = COACH_PRICES.MONTHS12 + '<span class="subscriptions__ruble"> ₽</span>';

                dayPrice.innerHTML = DAY_PRICES.MONTHS12 + '<span class="subscriptions__ruble"> ₽</span>';

                fullDayPrice.innerHTML = FULL_DAY_PRICES.MONTHS12 + '<span class="subscriptions__ruble"> ₽</span>';

                lessons.innerHTML = '<span class="subscriptions__lessons-number">' + LESSONS_MONTHS.TWELVE + '</span> занятия';

                coachCard.classList.add('subscriptions__card--coach-12');

                dayCard.classList.add('subscriptions__card--day-12');

                fullDayCard.classList.add('subscriptions__card--full-day-12');

                break;
        }
        const prevSubscription = document.querySelector('.subscriptions__month-item--selected');
        prevSubscription.classList.remove('subscriptions__month-item--selected');

        target.classList.add('subscriptions__month-item--selected');
    }
}

var userAgent = navigator.userAgent.toLowerCase();
if ((/mozilla/.test(userAgent) && !/firefox/.test(userAgent) && !/chrome/.test(userAgent) && !/safari/.test(userAgent) && !/opera/.test(userAgent)) || /msie/.test(userAgent))
    internetExplorer = true;

if (internetExplorer) {
    // дублирование блока с тренерами:
    let trainersSequenceClone = trainersSequence.cloneNode(true);
    trainersSliderWindow.appendChild(trainersSequenceClone);

    trainersSequenceClone = document.getElementsByClassName('trainers__sequence')[1];
    trainersSequenceClone.classList.remove('trainers__sequence--visible');
    trainersSequenceClone.classList.add('trainers__sequence--hidden');

    const moveTrainersWrap = moveSlides(trainersSlideIndex);
    const moveTrainersSlides = moveTrainersWrap.bind(null, trainersFeatures, 'trainers__sequence');

    trainersPrevBtn.addEventListener('click', moveTrainersSlides);
    trainersNextBtn.addEventListener('click', moveTrainersSlides);

    // дублирование блока с отзывами:
    let accountsSequenceClone = accountsSequence.cloneNode(true);
    accountsSliderWindow.appendChild(accountsSequenceClone);

    accountsSequenceClone = document.getElementsByClassName('accounts__sequence')[1];
    accountsSequenceClone.classList.remove('accounts__sequence--visible');
    accountsSequenceClone.classList.add('accounts__sequence--hidden');

    const moveAccountsWrap = moveSlides(accountsSlideIndex);
    const moveAccountsSlides = moveAccountsWrap.bind(null, accountsFeatures, 'accounts__sequence');

    accountsPrevBtn.addEventListener('click', moveAccountsSlides);
    accountsNextBtn.addEventListener('click', moveAccountsSlides);

    // обработка кликов по табам:
    subscriptionsList.addEventListener('click', changeSubscription);

    // прокрутка вниз:

    const subscriptionsSection = document.querySelector('.subscriptions');
    const subscriptionsPosition = subscriptionsSection.getBoundingClientRect().top;

    const smoothScrollToForm = smoothScrollTo().bind(null, subscriptionsPosition, 700);

    const subscriptionBtn = document.querySelector('.page-header__subscription');
    subscriptionBtn.addEventListener('click', smoothScrollToForm);
}