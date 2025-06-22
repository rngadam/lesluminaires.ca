document.addEventListener('DOMContentLoaded', () => {
    const langFrButton = document.getElementById('lang-fr');
    const langEnButton = document.getElementById('lang-en');
    let currentLang = 'fr'; // Default language

    const elementsToTranslate = document.querySelectorAll('[data-lang-fr], [data-lang-en]');

    function translatePage(lang) {
        currentLang = lang;
        elementsToTranslate.forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text) {
                // For elements like <strong> inside a translatable element,
                // we need to preserve their HTML structure.
                if (el.children.length > 0 && el.getAttribute(`data-lang-${lang}-html`)) {
                     el.innerHTML = el.getAttribute(`data-lang-${lang}-html`);
                } else if (el.children.length > 0 && el.querySelector('strong')) {
                    // Attempt to preserve simple strong tags if no specific HTML is provided
                    const strongTextFr = el.querySelector('strong')?.textContent;
                    const strongTextEn = el.querySelector('strong')?.textContent; // This might need better handling for actual translation of strong content

                    if(strongTextFr && strongTextEn) {
                        if (lang === 'fr') {
                            el.innerHTML = el.getAttribute('data-lang-fr').replace(strongTextFr, `<strong>${strongTextFr}</strong>`);
                        } else {
                             el.innerHTML = el.getAttribute('data-lang-en').replace(strongTextEn, `<strong>${strongTextEn}</strong>`);
                        }
                    } else {
                        el.textContent = text;
                    }
                }
                else {
                    el.textContent = text;
                }
            }
        });
        document.documentElement.lang = lang; // Update the lang attribute of the <html> tag

        // Update button active states (optional)
        if (lang === 'fr') {
            langFrButton.classList.add('active');
            langEnButton.classList.remove('active');
        } else {
            langEnButton.classList.add('active');
            langFrButton.classList.remove('active');
        }
    }

    langFrButton.addEventListener('click', () => translatePage('fr'));
    langEnButton.addEventListener('click', () => translatePage('en'));

    // Prepare HTML content for elements that contain other HTML tags like <strong>
    // This is a workaround to properly set innerHTML for these cases.
    elementsToTranslate.forEach(el => {
        if (el.children.length > 0 && (el.getAttribute('data-lang-fr').includes('<strong>') || el.getAttribute('data-lang-en').includes('<strong>'))) {
            el.setAttribute('data-lang-fr-html', el.getAttribute('data-lang-fr'));
            el.setAttribute('data-lang-en-html', el.getAttribute('data-lang-en'));
        }
    });


    // Initialize with the default language
    translatePage(currentLang);
});
