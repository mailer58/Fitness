const setSlider = (sliders, dir, prev, next) => {

    let slideIndex = 1;
    const items = document.querySelectorAll(sliders);
    const prevBtn = document.querySelector(prev);
    const nextBtn = document.querySelector(next);

    const showSlides = (n) => {
        if (n > items.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = items.length;
        }

        items.forEach((item) => {
            item.classList.add("animated");
            item.style.display = "none";
        });

        items[slideIndex].style.display = "block";
    }

    showSlides(slideIndex);

    const plusSlides = (n) => {
        showSlides(slideIndex += n);
    }

    prevBtn.addEventListener('click', () => {
        plusSlides(-1);
        items[slideIndex-1].classList.remove('slideInLeft');
        items[slideIndex-1].classList.add('slideInRight');
    });

    nextBtn.addEventListener('click', () => {
        plusSlides(1);
        items[slideIndex-1].classList.remove('slideInRight');
        items[slideIndex-1].classList.add('slideInLeft');
    });
}