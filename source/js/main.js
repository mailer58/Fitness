'use strict';
(function () {
    const accountsSection = document.querySelector('.accounts');
    const trainersSection = document.querySelector('.trainers');
    const accountsWrapper = document.querySelector('.accounts__slider');
    const trainersWrapper = document.querySelector('.trainers__slider');

    const DIRECTION = {
        NEXT: 'next',
        PREV: 'prev'
    }

    const SIZES = {
        MIN: 320,
        MID: 768,
        MAX: 1200
    }

    const SIZES_RANGES = {
        MIN: 'min',
        MID: 'mid',
        MAX: 'max'
    }


    /* Markup */

    const RenderPosition = {
        AFTERBEGIN: 'afterbegin',
        BEFOREEND: 'beforeend',
        AFTER: 'after',
        APPEND: 'append',
        BEFORE: 'before'
    };

    const smoothScrollTo = () => {
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

    const render = (container, component, place) => {
        switch (place) {
            case RenderPosition.APPEND:
                container.append(component);
                break;
            case RenderPosition.AFTER:
                container.after(component);
                break;
            case RenderPosition.BEFORE:
                container.before(component);
                break;
        }
    };

    const createElement = (template) => {
        const newElement = document.createElement(`div`);
        newElement.innerHTML = template;
        return newElement.firstChild;
    };

    const remove = (component) => {
        component.getElement().remove();
        component.removeElement();
    };

    // шаблон для блока тренеров:

    const trainersNames = ['Александр Пашков', 'Мария Кетова', 'Алексей Лавров', 'Анна Павлова', 'Иван Иванов', 'Ксения Петрова', 'Андрей Сидоров', 'Анастасия Васильева'];

    const trainer = {
        name: null,
        discipline: 'CrossFit',
        certificate: 'Certified Level 3 Trainer',
        achievements: 'Победитель чемпионата России по CrossFit',
        experience: 'Опыт — 6 лет'
    }

    const trainers = [];

    trainersNames.forEach((name) => {
        let newTrainer = Object.assign({}, trainer);
        newTrainer.name = name;
        trainers.push(newTrainer);
    });

    const doubleBlocks = [0, 1];

    const createTrainersTemplate = () => {
        return `<div class="trainers__slider">
                <button class="trainers__prev-arrow-btn arrow-templet" type="button">
                    <svg class="trainers__prev-arrow-mobile" width="12" height="21">
                        <use xlink:href="#icon-arrowLeftMobile" fill="none"></use>
                    </svg>
                    <svg class="trainers__prev-arrow-tablet" width="18" height="34">
                        <use xlink:href="#icon-arrowLeftTablet" fill="none"></use>
                    </svg>
                </button>
                <div class="trainers__slider-window">
                   ${doubleBlocks.map((block) => {
                    const visibility = block ? 'visible' : 'hidden';
                    return `<div class="trainers__sequence trainers__sequence--${visibility}">
                    ${trainers.map((trainer, index) => {
                    let i = index + 1;
                        return `<div class="trainers__trainer trainers__trainer--${i}">
                            <div class="trainers__info-wrapper">
                                <h2 class="trainers__name">${trainer.name}</h2>
                                <h3 class="trainers__discipline">${trainer.discipline}</h3>
                                <ul class="trainers__info-list">
                                    <li class="trainers__info-item">
                                        ${trainer.certificate}</li>
                                    <li class="trainers__info-item">
                                        ${trainer.achievements}</li>
                                    <li class="trainers__info-item">
                                        ${trainer.experience}</li>
                                </ul>                               
                            </div>
                        </div>`}).join(`\n`)}                     
                </div>`}).join(`\n`)}
            </div>
            <button class="trainers__next-arrow-btn arrow-templet" type="button">
                    <svg class="trainers__next-arrow-mobile" width="12" height="21">
                        <use xlink:href="#icon-arrowRightMobile" fill="none"></use>
                    </svg>
                    <svg class="trainers__next-arrow-tablet" width="18" height="34">
                        <use xlink:href="#icon-arrowRightTablet" fill="none"></use>
                    </svg>
                </button>
                </div>`
    }

    // объект с параметрами для слайдера секции тренеров:
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

    const accountsMocks = [{
            name: 'Анна Орлова',
            account: '«Хожу в SuperClub уже больше года. Нравится, что в клубе всегда чисто, тренажеры обновляют, персонал дружелюбный. Зал просторный, даже в вечернее время нет очередей»'
        },
        {
            name: 'Дарья Соколова',
            account: '«Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima repellat illo necessitatibus explicabo provident at qui iste hic. Atque, laboriosam!»'
        }
    ];

    const createAccountsTemplate = () => {
        return `<div class="accounts__slider">
    <button class="accounts__prev-arrow-btn arrow-templet" type="button">
        <svg class="accounts__prev-arrow-mobile" width="12" height="21">
            <use xlink:href="#icon-arrowLeftMobile" fill="none"></use>
        </svg>
        <svg class="accounts__prev-arrow-tablet" width="18" height="34">
            <use xlink:href="#icon-arrowLeftTablet" fill="none"></use>
        </svg>
    </button>
    <div class="accounts__slider-window">
    ${doubleBlocks.map((block) => {
        const visibility = block ? 'visible' : 'hidden';
        return `<div class="accounts__sequence accounts__sequence--${visibility}">
        ${accountsMocks.map((account) => {
           return `<div class="accounts__card">
                <h3 class="accounts__user-name">${account.name}</h3>
                <p class="accounts__account">${account.account}
                </p>
            </div>`
        }).join(`\n`)}
        </div>`}).join(`\n`)}
    </div>
    <button class="accounts__next-arrow-btn arrow-templet" type="button">
        <svg class="accounts__next-arrow-mobile" width="12" height="21">
            <use xlink:href="#icon-arrowRightMobile" fill="none"></use>
        </svg>
        <svg class="accounts__next-arrow-tablet" width="18" height="34">
            <use xlink:href="#icon-arrowRightTablet" fill="none"></use>
        </svg>
    </button>
</div>`;
    }

    class SlidersController {
        constructor(sliderSection, sliderComponent, sliderFeatures, windowWidth) {
            this._name = sliderFeatures.NAME;
            this._sliderSection = sliderSection;
            this._sliderComponent = sliderComponent;
            this._slideIndex = 1;
            this._moveSlides = this.moveSlides.bind(this);
            this._onResolutionChange = this.onResolutionChange.bind(this);
            this.sliderVisible = null;
            this._windowWidth = windowWidth;
            this._firstRender = false;
            this._isSwipe = false;
            this._swipeDirection = null;

            // параметры слайдера:
            this.PHOTOS_NUMBER = sliderFeatures.PHOTOS_NUMBER;

            // мобильная версия:
            this.MOBILE_PHOTO_WIDTH = sliderFeatures.MOBILE_PHOTO_WIDTH;
            this.MOBILE_VISIBLE_WIDTH = sliderFeatures.MOBILE_VISIBLE_WIDTH;
            this.MOBILE_VISIBLE_PHOTOS = sliderFeatures.MOBILE_VISIBLE_PHOTOS;
            this.MOBILE_GAP = sliderFeatures.MOBILE_GAP;
            this.MOBILE_SLIDER_WIDTH = this.getSliderWidth(this.MOBILE_PHOTO_WIDTH, this.PHOTOS_NUMBER, this.MOBILE_GAP);
            this.MOBILE_SLIDES_NUMBER = this.getSlidesNumber(this.PHOTOS_NUMBER, this.MOBILE_VISIBLE_PHOTOS);
            this.MOBILE_ANIMATION_DURATION = sliderFeatures.MOBILE_ANIMATION_DURATION;

            // планшетная версия
            this.TABLET_PHOTO_WIDTH = sliderFeatures.TABLET_PHOTO_WIDTH;
            this.TABLET_VISIBLE_WIDTH = sliderFeatures.TABLET_VISIBLE_WIDTH;
            this.TABLET_VISIBLE_PHOTOS = sliderFeatures.TABLET_VISIBLE_PHOTOS;
            this.TABLET_GAP = sliderFeatures.TABLET_GAP;
            this.TABLET_SLIDER_WIDTH = this.getSliderWidth(this.TABLET_PHOTO_WIDTH, this.PHOTOS_NUMBER, this.TABLET_GAP);
            this.TABLET_SLIDES_NUMBER = this.getSlidesNumber(this.PHOTOS_NUMBER, this.TABLET_VISIBLE_PHOTOS);
            this.TABLET_ANIMATION_DURATION = sliderFeatures.TABLET_ANIMATION_DURATION;

            // десктопная версия:
            this.DESKTOP_PHOTO_WIDTH = sliderFeatures.DESKTOP_PHOTO_WIDTH;
            this.DESKTOP_VISIBLE_WIDTH = sliderFeatures.DESKTOP_VISIBLE_WIDTH;
            this.DESKTOP_VISIBLE_PHOTOS = sliderFeatures.DESKTOP_VISIBLE_PHOTOS;
            this.DESKTOP_GAP = sliderFeatures.DESKTOP_GAP;
            this.DESKTOP_SLIDER_WIDTH = this.getSliderWidth(this.DESKTOP_PHOTO_WIDTH, this.PHOTOS_NUMBER, this.DESKTOP_GAP);
            this.DESKTOP_SLIDES_NUMBER = this.getSlidesNumber(this.PHOTOS_NUMBER, this.DESKTOP_VISIBLE_PHOTOS);
            this.DESKTOP_ANIMATION_DURATION = sliderFeatures.DESKTOP_ANIMATION_DURATION;
        }

        getSlidesNumber(photosNumber, visiblePhotosNumber) {
            return Math.ceil(photosNumber / visiblePhotosNumber);
        }

        getSliderWidth(photoWidth, photosNumber, gap) {
            return photoWidth * photosNumber + gap * photosNumber - gap;
        }

        onResolutionChange() {
            window.addEventListener('resize', () => {
                if (window.matchMedia('(min-width: 320px)').matches &&
                    (window.matchMedia('(max-width: 767px)').matches)) {
                    const windowWidth = SIZES_RANGES.MIN;
                    if (windowWidth !== this._windowWidth) {
                        this._windowWidth = windowWidth;
                        this._slideIndex = 1;
                        this.render();
                    }
                }
                if (window.matchMedia('(min-width: 768px)').matches &&
                    (window.matchMedia('(max-width: 1199px)').matches)) {
                    const windowWidth = SIZES_RANGES.MID;
                    if (windowWidth !== this._windowWidth) {
                        this._windowWidth = windowWidth;
                        this._slideIndex = 1;
                        this.render();
                    }
                }
                if (window.matchMedia('(min-width: 1200px)').matches) {
                    const windowWidth = SIZES_RANGES.MAX;
                    if (windowWidth !== this._windowWidth) {
                        this._windowWidth = windowWidth;
                        this._slideIndex = 1;
                        this.render();
                    }
                }
            });

        }

        moveSlides(evt) {
            const blocks = this._sliderComponent.getElement().querySelectorAll('div');

            let sliderVisible;
            let sliderHidden;
            for (let block of blocks) {
                let className = block.className;
                if (className.indexOf('visible') > -1) {
                    sliderVisible = block;
                }
                if (className.indexOf('hidden') > -1) {
                    sliderHidden = block;
                }
            }

            let width;
            let sliderWidth;
            let slidesNumber;
            let slideGap;
            let animationDuration;
            let direction;
            if (!this._isSwipe) {
            direction = evt.currentTarget;
            direction = direction.className;
            direction = direction.indexOf(DIRECTION.NEXT) > -1 ? DIRECTION.NEXT : DIRECTION.PREV;
            } else if (this._isSwipe) {
                direction = this._swipeDirection;
            }

            const windowWidth = document.body.clientWidth;
            if (windowWidth >= SIZES.MIN && windowWidth < SIZES.MID) {

                width = this.MOBILE_VISIBLE_WIDTH;
                sliderWidth = this.MOBILE_SLIDER_WIDTH;
                slidesNumber = this.MOBILE_SLIDES_NUMBER;
                slideGap = this.MOBILE_GAP;
                animationDuration = this.MOBILE_ANIMATION_DURATION;
            }

            if (windowWidth >= SIZES.MID && windowWidth < SIZES.MAX) {

                width = this.TABLET_VISIBLE_WIDTH;
                sliderWidth = this.TABLET_SLIDER_WIDTH;
                slidesNumber = this.TABLET_SLIDES_NUMBER;
                slideGap = this.TABLET_GAP;
                animationDuration = this.TABLET_ANIMATION_DURATION;
            }

            if (windowWidth >= SIZES.MAX) {

                width = this.DESKTOP_VISIBLE_WIDTH;
                sliderWidth = this.DESKTOP_SLIDER_WIDTH;
                slidesNumber = this.DESKTOP_SLIDES_NUMBER;
                slideGap = this.DESKTOP_GAP;
                animationDuration = this.DESKTOP_ANIMATION_DURATION;

            }

            const steps = width * this._slideIndex;
            const gaps = this._slideIndex * slideGap;
            let shift;

            // установка скрытого слайдера слева:
            if (this._slideIndex === 1) {
                sliderHidden.style.transitionDuration = '0s';

                shift = sliderWidth + gaps;
                sliderHidden.style.left = '-' + shift + 'px';
                sliderHidden.offsetWidth;
            }

            // изменение индекса:
            direction === DIRECTION.NEXT ? this._slideIndex++ : this._slideIndex--;

            // параметры скрытого слайдера:
            sliderHidden.style.opacity = '1';

            // установка скрытого слайдера справа:
            if (this._slideIndex === slidesNumber) {
                shift = width + slideGap;
                sliderHidden.style.left = shift + 'px';
            }

            // когда слайды "заканчиваются":
            if (this._slideIndex > slidesNumber || this._slideIndex < 1) {
                sliderHidden.style.transitionDuration = animationDuration / 1000 + 's'; // ms -> s
                if (this._slideIndex > slidesNumber) {

                    // завершающая анимация
                    // "отъезжающего" влево слайдера:
                    shift = sliderWidth + slideGap;
                    sliderVisible.style.left = '-' + shift + 'px';

                    // анимация появления скрытого слайдера
                    // в направлении справа-налево:
                    sliderHidden.style.left = '0';

                    // установка индекса в начало:
                    this._slideIndex = 1;
                }

                if (this._slideIndex < 1) {
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
                    this._slideIndex = slidesNumber;
                }

                // смена имен классов слайдеров после
                // исчезновения одного из них из видимой области:

                let hidden = this._name + '__sequence--hidden';
                let visible = this._name + '__sequence--visible';
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
                shift = ((this._slideIndex - 1) * width) + ((this._slideIndex - 1) * slideGap);
                sliderVisible.style.left = '-' + shift + 'px';
            }
        }

        onSwipe() {
            const slider = this._sliderComponent.getElement();
            let sliderWindow;
            for (const element of slider.childNodes) {
                if (element.className) {
                if (element.className.indexOf('slider-window') > -1) {
                    sliderWindow = element;
                }
            }
            }
            let startX,
                dist,
                threshold = 50,
                allowedTime = 500,
                elapsedTime,
                startTime;

            const handleSwipe = (isCorrectSwipe) => {
                if (isCorrectSwipe) {
                    this._moveSlides();
                    return;
                }
                return;
            }

            sliderWindow.addEventListener('touchstart', (evt) => {
                this._isSwipe = true;
                const touchObj = evt.changedTouches[0];
                dist = 0;
                startX = touchObj.pageX;
                startTime = new Date().getTime() // время контакта с поверхностью сенсора
                evt.preventDefault();
            });

            sliderWindow.addEventListener('touchmove', (evt)=>{
                evt.preventDefault();
            });
          
            sliderWindow.addEventListener('touchend', (evt) => {
                let touchObj = evt.changedTouches[0];
                dist = touchObj.pageX - startX;
                this._swipeDirection = dist > 0 ? DIRECTION.PREV : DIRECTION.NEXT;
                elapsedTime = new Date().getTime() - startTime;
                let swipeCorrectBol = (elapsedTime <= allowedTime && Math.abs(dist) >= threshold);
                handleSwipe(swipeCorrectBol);
                this._isSwipe = false;
                evt.preventDefault();
            });
        }

        recoveryListeners() {
            const buttons = this._sliderComponent.getElement().querySelectorAll('button');
            const prevBtn = buttons[0];
            const nextBtn = buttons[1];

            prevBtn.addEventListener('click', this._moveSlides);
            nextBtn.addEventListener('click', this._moveSlides);

            this.onSwipe();
        }

        render() {
            if (!this._firstRender) {
                this._onResolutionChange(); // срабатывает однократно
            }

            if (this._firstRender) {
                remove(this._sliderComponent); // не удаляется при первом рендере
            }

            this._firstRender = this._firstRender ? this._firstRender : true;

            render(this._sliderSection, this._sliderComponent.getElement(), RenderPosition.APPEND);

            this.recoveryListeners();
        }
    }

    class AbstractComponent {
        constructor() {
            if (new.target === AbstractComponent) {
                throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
            }

            this._element = null;
        }

        getTemplate() {
            throw new Error(`Abstract method not implemented: getTemplate`);
        }

        getElement() {
            if (!this._element) {
                this._element = createElement(this.getTemplate());
            }

            return this._element;
        }

        removeElement() {
            this._element = null;
        }

        recoveryListeners() {
            throw new Error(`Abstract method not implemented: recoveryListeners`);
        }

        rerender() {
            const oldElement = this.getElement();
            const parent = oldElement.parentElement;

            this.removeElement();

            const newElement = this.getElement();

            parent.replaceChild(newElement, oldElement);

            this.recoveryListeners();
        }
    }

    class TrainersComponent extends AbstractComponent {
        constructor() {
            super();
        }

        getTemplate() {
            return createTrainersTemplate();
        }
    }

    class AccountsComponent extends AbstractComponent {
        constructor() {
            super();
        }

        getTemplate() {
            return createAccountsTemplate();
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

    const changeSubscription = (evt) => {
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

    // удаление разметки слайдеров для IE:
    trainersWrapper.remove();
    accountsWrapper.remove();

    // обработка кликов по табам:
    subscriptionsList.addEventListener('click', changeSubscription);

    // нахождение ширины окна браузера:
    let windowWidth;

    if (window.matchMedia('(min-width: 320px)').matches &&
        (window.matchMedia('(max-width: 767px)').matches)) {
        windowWidth = SIZES_RANGES.MIN;
    }

    if (window.matchMedia('(min-width: 768px)').matches &&
        (window.matchMedia('(max-width: 1199px)').matches)) {
        windowWidth = SIZES_RANGES.MID;
    }

    if (window.matchMedia('(min-width: 1200px)').matches) {
        windowWidth = SIZES_RANGES.MAX;
    }


    // инициализация и рендер слайдеров:
    const trainersComponent = new TrainersComponent();
    const accountsComponent = new AccountsComponent();

    const trainersController = new SlidersController(trainersSection, trainersComponent, trainersFeatures, windowWidth);
    const accountsController = new SlidersController(accountsSection, accountsComponent, accountsFeatures, windowWidth);

    trainersController.render();
    accountsController.render();


    // прокрутка вниз:

    const subscriptionsSection = document.querySelector('.subscriptions');
    const subscriptionsPosition = subscriptionsSection.getBoundingClientRect().top;

    const smoothScrollToForm = smoothScrollTo().bind(null, subscriptionsPosition, 700);

    const subscriptionBtn = document.querySelector('.page-header__subscription');
    subscriptionBtn.addEventListener('click', smoothScrollToForm);
})();