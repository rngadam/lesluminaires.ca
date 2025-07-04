document.addEventListener('DOMContentLoaded', () => {
    const langFrButton = document.getElementById('lang-fr');
    const langEnButton = document.getElementById('lang-en');
    const elementsToTranslate = document.querySelectorAll('[data-lang-fr][data-lang-en]');

    function setLanguage(lang) {
        elementsToTranslate.forEach(el => {
            // If the element is a link within the #nearby-places or #attractions list, preserve its href and target
            let preserveLink = false;
            let href, target;
            if (el.tagName === 'A' && (el.closest('#nearby-places ul') || el.closest('#attractions ul'))) {
                preserveLink = true;
                href = el.getAttribute('href');
                target = el.getAttribute('target');
            }

            const translation = el.getAttribute(`data-lang-${lang}`);
            if (translation) {
                if (el.tagName === 'IMG') {
                    el.alt = translation;
                } else {
                    el.innerHTML = translation; // Use innerHTML to render potential <strong> tags from attributes
                }
            }

            if (preserveLink && href && target) {
                el.setAttribute('href', href);
                el.setAttribute('target', target);
            }
        });

        document.documentElement.lang = lang;
        langFrButton.classList.toggle('active', lang === 'fr');
        langEnButton.classList.toggle('active', lang === 'en');

        // Special handling for list items that contain <strong> tags in their data attributes
        // This is because innerHTML will strip the <li> of its own data-lang attributes if we're not careful
        const listItems = document.querySelectorAll('#technical li, #toponymy ul li');
        listItems.forEach(li => {
            const translation = li.getAttribute(`data-lang-${lang}`);
            if (translation && translation.includes('<strong>')) {
                 // Check if the direct child is a strong tag or if the translation itself needs to be set
                if (li.children.length === 1 && li.children[0].tagName === 'STRONG') {
                    // This case might be complex if the strong tag itself needs translation,
                    // but for now, we assume the data-lang attribute on the <li> is the full translated string.
                    li.innerHTML = translation;
                } else if (!li.querySelector('strong')) { // only set if no strong tag is currently rendered
                    li.innerHTML = translation;
                }
            } else if (translation) {
                li.innerHTML = translation;
            }
        });
    }

    langFrButton.addEventListener('click', () => setLanguage('fr'));
    langEnButton.addEventListener('click', () => setLanguage('en'));

    // Initialize with the default language
    setLanguage('fr');

    // Slideshow logic
    let slideIndex = 1;
    // showDivs is called after DOM is ready and buttons are available

    function plusDivs(n) {
      showDivs(slideIndex += n);
    }

    // Removed currentDiv function as it's not used

    function showDivs(n) {
      let i;
      const x = document.getElementsByClassName("mySlides");
      // const dots = document.getElementsByClassName("demo"); // If using dots for navigation
      if (n > x.length) {slideIndex = 1}
      if (n < 1) {slideIndex = x.length}
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      // for (i = 0; i < dots.length; i++) { // If using dots for navigation
      //   dots[i].className = dots[i].className.replace(" w3-white", "");
      // }
      if (x.length > 0) { // Check if slides exist
          x[slideIndex-1].style.display = "block";
        // if (dots.length > 0) { // If using dots for navigation
        //  dots[slideIndex-1].className += " w3-white";
        // }
      }
    }

    // Event Listeners for slideshow buttons
    const prevButton = document.getElementById('slideshow-prev');
    const nextButton = document.getElementById('slideshow-next');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => plusDivs(-1));
        nextButton.addEventListener('click', () => plusDivs(1));
    }

    // Always attempt to show the first slide if slides exist
    // This ensures that if there are slides, the first one is displayed,
    // regardless of whether the control buttons were found.
    const slides = document.getElementsByClassName("mySlides");
    if (slides.length > 0) {
        showDivs(slideIndex);
    }
    // Removed global assignments for plusDivs and currentDiv
});
