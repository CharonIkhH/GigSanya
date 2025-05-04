/**
 * Main JavaScript for index.html
 * This script handles all interactive elements and animations for the IT outsourcing company website.
 * It rebuilds the page content based on existing CSS classes and structure.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core components
  initAnimations();
  initStatisticsCounters();
  initClientCarousel();
  initMap();
  initContactForm();
  initTabsNavigation();
  initBackToTop();
  
  // Add decorative elements
  addDecorativeElements();
});

/**
* Initializes scroll-based animations for various elements
* Detects when elements enter the viewport and adds animation classes
*/
function initAnimations() {
  // Elements with their corresponding animation class
  const animatedElements = {
      '.section-header': 'animate',
      '.advantage-intro': 'animate',
      '.advantage-highlights': 'animate',
      '.highlight-item': 'animate',
      '.tabs-container': 'animate',
      '.stat-card': 'animate',
      '.client-logo': 'animate',
      '.map-container': 'animate',
      '.contact-form-container': 'animate',
      '.about-widget': 'animate',
      '.footer-widget': 'animate'
  };

  // Use Intersection Observer API for better performance
  if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  // Find which selector this element matches
                  const matchedSelector = Object.keys(animatedElements).find(selector => 
                      entry.target.matches(selector)
                  );
                  
                  if (matchedSelector) {
                      entry.target.classList.add(animatedElements[matchedSelector]);
                      // Stop observing once animation is triggered
                      observer.unobserve(entry.target);
                  }
              }
          });
      }, { threshold: 0.1 });

      // Observe all elements
      for (const selector in animatedElements) {
          document.querySelectorAll(selector).forEach(element => {
              observer.observe(element);
          });
      }
  } else {
      // Fallback for browsers that don't support IntersectionObserver
      for (const selector in animatedElements) {
          document.querySelectorAll(selector).forEach(element => {
              element.classList.add(animatedElements[selector]);
          });
      }
  }
}

/**
* Initializes the statistics counters with smooth animation
* Counts up from zero to the target value when the element comes into view
*/
function initStatisticsCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;
  
  // Function to animate counter with easing
  const animateCounter = (counter, finalValue, duration = 2500) => {
      let startValue = 0;
      let startTime = null;
      
      // Use easeOutQuad for smoother animation
      const easeOutQuad = t => t * (2 - t);
      
      const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = easeOutQuad(progress);
          const value = Math.floor(easedProgress * (finalValue - startValue) + startValue);
          counter.textContent = value.toLocaleString();
          
          if (progress < 1) {
              requestAnimationFrame(updateCounter);
          } else {
              counter.textContent = finalValue.toLocaleString();
              counter.classList.add('pulse');
              
              // Add data-suffix after the number if present
              const suffix = counter.getAttribute('data-suffix');
              if (suffix) {
                  counter.setAttribute('data-suffix-visible', 'true');
              }
          }
      };
      
      requestAnimationFrame(updateCounter);
  };
  
  // Use Intersection Observer for triggering the counters
  if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const counter = entry.target;
                  const finalValue = parseInt(counter.getAttribute('data-value'), 10);
                  animateCounter(counter, finalValue);
                  observer.unobserve(counter);
              }
          });
      }, { threshold: 0.3 });
      
      // Observe all counter elements
      counters.forEach(counter => {
          observer.observe(counter);
      });
  } else {
      // Fallback for browsers without IntersectionObserver
      counters.forEach(counter => {
          const finalValue = parseInt(counter.getAttribute('data-value'), 10);
          animateCounter(counter, finalValue);
      });
  }
}

/**
 * Инициализирует карусель логотипов клиентов с помощью MutationObserver
 * для гарантированного отображения логотипов
 */
function initClientCarousel() {
  console.log('Запуск инициализации карусели клиентов...');
  
  // 1. Принудительно применяем стили для видимости
  applyForcedStyles();
  
  // 2. Настройка MutationObserver для наблюдения за загрузкой DOM
  const observer = new MutationObserver((mutations, obs) => {
      const carousel = document.querySelector('.clients-carousel');
      if (carousel) {
          console.log('Найден элемент карусели, инициализирую...');
          obs.disconnect(); // Прекращаем наблюдение после нахождения
          setupClientCarousel(carousel);
      }
  });
  
  // Начинаем наблюдение за изменениями в DOM
  observer.observe(document.body, {
      childList: true,
      subtree: true
  });
  
  // Если элемент уже существует, инициализируем сразу
  const carousel = document.querySelector('.clients-carousel');
  if (carousel) {
      console.log('Элемент карусели уже существует, инициализирую...');
      observer.disconnect();
      setupClientCarousel(carousel);
  }
}

/**
* Применяет принудительные стили для отображения логотипов
*/
function applyForcedStyles() {
  const forcedStyles = document.createElement('style');
  forcedStyles.id = 'forced-client-logo-styles';
  forcedStyles.innerHTML = `
      /* Принудительные стили для карусели и логотипов */
      .clients-carousel {
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          overflow: visible !important;
          min-height: 120px !important;
      }
      
      .client-logo {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
          display: flex !important;
          min-height: 100px !important;
          margin: 10px !important;
          padding: 15px !important;
          background-color: #fff !important;
          border-radius: 8px !important;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
          align-items: center !important;
          justify-content: center !important;
      }
      
      .client-logo img {
          max-width: 85% !important;
          max-height: 85% !important;
          display: block !important;
          opacity: 0.7 !important;
          filter: grayscale(100%) brightness(1.05) !important;
          transition: all 0.3s ease !important;
      }
      
      .client-logo:hover img {
          filter: grayscale(0%) brightness(1) !important;
          opacity: 1 !important;
          transform: scale(1.05) !important;
      }
      
      /* Стили для Owl Carousel */
      .owl-carousel {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
      }
      
      .owl-carousel .owl-stage-outer {
          overflow: visible !important;
      }
      
      .owl-carousel .owl-stage {
          display: flex !important;
          align-items: center !important;
      }
      
      .owl-carousel .owl-item {
          display: flex !important;
          justify-content: center !important;
          min-height: 100px !important;
      }
      
      /* Стили для резервной сетки */
      .clients-container {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
          gap: 20px !important;
          margin: 30px auto !important;
          opacity: 1 !important;
          max-width: 1200px !important;
          padding: 0 15px !important;
      }
  `;
  
  // Удаляем предыдущие стили, если они были
  const oldStyles = document.getElementById('forced-client-logo-styles');
  if (oldStyles) {
      oldStyles.remove();
  }
  
  // Добавляем стили в начало HEAD для максимального приоритета
  const head = document.head || document.getElementsByTagName('head')[0];
  head.insertBefore(forcedStyles, head.firstChild);
  
  console.log('Принудительные стили для логотипов применены');
}

/**
* Настраивает карусель клиентов после обнаружения элемента
* @param {HTMLElement} carousel - элемент карусели
*/
function setupClientCarousel(carousel) {
  // Проверяем, есть ли логотипы в карусели
  let clientLogos = carousel.querySelectorAll('.client-logo');
  
  // Если логотипов нет, создаем их
  if (clientLogos.length === 0) {
      console.warn('Логотипы не найдены, создаю демо-логотипы');
      createDemoLogos(carousel);
      clientLogos = carousel.querySelectorAll('.client-logo');
  } else {
      console.log(`Найдено ${clientLogos.length} логотипов`);
      
      // Добавляем класс animate ко всем логотипам для анимации
      clientLogos.forEach(logo => {
          logo.classList.add('animate');
      });
  }
  
  // Пытаемся инициализировать Owl Carousel
  let owlInitialized = false;
  
  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.owlCarousel === 'function') {
      try {
          // Проверяем, что jQuery действительно видит нашу карусель
          const $carousel = jQuery('.clients-carousel');
          
          if ($carousel.length > 0 && !$carousel.hasClass('owl-loaded')) {
              console.log('Инициализация Owl Carousel...');
              
              $carousel.owlCarousel({
                  loop: true,
                  margin: 30,
                  nav: true,
                  dots: true,
                  autoplay: true,
                  autoplayTimeout: 5000,
                  autoplayHoverPause: true,
                  responsive: {
                      0: { items: 1 },
                      480: { items: 2 },
                      576: { items: 3 },
                      768: { items: 4 },
                      992: { items: 5 },
                      1200: { items: 6 }
                  },
                  navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                  onInitialized: function() {
                      console.log('Owl Carousel успешно инициализирован');
                      owlInitialized = true;
                      
                      // Добавляем наблюдатель для элементов карусели после инициализации
                      observeCarouselItems();
                  }
              });
              
              // Добавляем декоративные звезды
              addStarsToCarousel();
          } else {
              if ($carousel.hasClass('owl-loaded')) {
                  console.log('Owl Carousel уже инициализирован');
                  owlInitialized = true;
              } else {
                  console.warn('jQuery не может найти .clients-carousel');
                  owlInitialized = false;
              }
          }
      } catch (error) {
          console.error('Ошибка при инициализации Owl Carousel:', error);
          owlInitialized = false;
      }
  } else {
      console.warn('Owl Carousel не доступен');
      owlInitialized = false;
  }
  
  // Если Owl Carousel не инициализирован, создаем резервную сетку
  if (!owlInitialized) {
      console.log('Создание резервной сетки логотипов...');
      createFallbackGrid(carousel, clientLogos);
  }
}

/**
* Наблюдает за изменениями элементов карусели
*/
function observeCarouselItems() {
  const carouselItems = document.querySelectorAll('.owl-item');
  
  carouselItems.forEach(item => {
      // Убедимся, что логотипы внутри элементов карусели видимы
      const logos = item.querySelectorAll('.client-logo');
      logos.forEach(logo => {
          logo.classList.add('animate');
          logo.style.opacity = '1';
          logo.style.transform = 'translateY(0)';
          
          const img = logo.querySelector('img');
          if (img) {
              img.style.display = 'block';
              
              // Обработка ошибок загрузки
              img.onerror = function() {
                  this.style.display = 'none';
                  logo.innerHTML = `<div style="font-size: 16px; color: #666; font-weight: bold;">${img.alt || 'Клиент'}</div>`;
              };
          }
      });
  });
  
  // Наблюдаем за изменениями в DOM карусели
  const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // Обрабатываем новые элементы
              mutation.addedNodes.forEach(node => {
                  if (node.nodeType === 1) { // Проверяем, что это элемент
                      const logos = node.querySelectorAll('.client-logo');
                      logos.forEach(logo => {
                          logo.classList.add('animate');
                          logo.style.opacity = '1';
                          logo.style.transform = 'translateY(0)';
                      });
                  }
              });
          }
      });
  });
  
  // Начинаем наблюдение за карусельными элементами
  const carouselContainer = document.querySelector('.owl-carousel');
  if (carouselContainer) {
      observer.observe(carouselContainer, {
          childList: true,
          subtree: true
      });
  }
}

/**
* Создает демо-логотипы клиентов, если их нет на странице
* @param {HTMLElement} container - контейнер для логотипов
*/
function createDemoLogos(container) {
  // Массив с путями к логотипам и названиями компаний
  const companies = [
      { path: 'logos/Alfa-Logistic%20LOGO%2075DPI.png', name: 'Альфа Логистик' },
      { path: 'logos/Etalon.png', name: 'Эталон' },
      { path: 'logos/Hotline.png', name: 'Хотлайн' },
      { path: 'logos/Novogorsk-2.png', name: 'Новогорск' },
      { path: 'logos/VintHim.png', name: 'ВинтХим' },
      { path: 'logos/%D0%B0%D0%BC%D0%B0%D1%82%D0%B5%D0%BA.png', name: 'Аматек' },
      { path: 'logos/%D0%BA%D0%BB%D0%B8%D0%BA%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81.png', name: 'Клик Ресурс' },
      { path: 'logos/%D0%B1%D0%B5%D1%80%D0%B5%D0%B7%D1%8B.png', name: 'Березы' }
  ];
  
  // Очищаем контейнер перед добавлением логотипов
  container.innerHTML = '';
  
  // Создаем и добавляем логотипы
  companies.forEach(company => {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'client-logo animate'; // Сразу добавляем класс animate
      
      const img = document.createElement('img');
      img.src = company.path;
      img.alt = company.name;
      img.width = 200;
      img.height = 100;
      img.loading = 'lazy';
      
      // Резервный текст, если изображение не загрузится
      img.onerror = function() {
          this.style.display = 'none';
          logoDiv.innerHTML = `<div style="font-size: 16px; color: #666; font-weight: bold;">${company.name}</div>`;
      };
      
      logoDiv.appendChild(img);
      container.appendChild(logoDiv);
  });
  
  console.log('Демо-логотипы созданы');
}

/**
* Создает резервную сетку логотипов, если карусель не удалось инициализировать
* @param {HTMLElement} carousel - элемент карусели
* @param {NodeList} clientLogos - список логотипов клиентов
*/
function createFallbackGrid(carousel, clientLogos) {
  // Создаем контейнер для сетки логотипов
  const clientsContainer = document.createElement('div');
  clientsContainer.className = 'clients-container';
  
  // Копируем все логотипы в новый контейнер
  clientLogos.forEach(logo => {
      const clonedLogo = logo.cloneNode(true);
      clonedLogo.classList.add('animate');
      clonedLogo.style.opacity = '1';
      clonedLogo.style.transform = 'translateY(0)';
      clientsContainer.appendChild(clonedLogo);
  });
  
  // Заменяем карусель на контейнер сетки
  if (carousel.parentNode) {
      carousel.parentNode.replaceChild(clientsContainer, carousel);
      console.log('Карусель заменена на сетку логотипов');
  } else {
      console.error('Не могу заменить карусель - родительский элемент не найден');
  }
}

/**
* Добавляет декоративные звезды в секцию клиентов
*/
function addStarsToCarousel() {
  // Находим секцию клиентов
  const clientsSection = document.querySelector('.clients-section');
  if (!clientsSection) return;
  
  // Удаляем существующие звезды, если они есть
  clientsSection.querySelectorAll('.star').forEach(star => star.remove());
  
  // Создаем и добавляем звезды
  for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Генерируем случайные положения
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 10 + 5}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      clientsSection.appendChild(star);
  }
  
  console.log('Декоративные звезды добавлены');
}

// Вызываем функцию инициализации карусели при загрузке страницы
document.addEventListener('DOMContentLoaded', initClientCarousel);
// А также запускаем её после полной загрузки страницы для надежности
window.addEventListener('load', initClientCarousel);

function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // Координаты для офиса (Москва, Ракетный бульвар, 15)
  const officeLocation = [55.819090, 37.653694];

  // Создание карты Яндекс
  const map = new ymaps.Map(mapContainer, {
    center: officeLocation,
    zoom: 16,
    controls: ['zoomControl', 'geolocationControl']
  });

  // Добавление маркера на карту
  const marker = new ymaps.Placemark(officeLocation, {
    balloonContent: `
      <div class="popup">
        <h3>GigSys IT-solutions</h3>
        <p>г. Москва, Ракетный бульвар, д.15, оф.31</p>
        <div class="popup-footer">
          <a href="tel:88003501160"><i class="fa fa-phone-alt"></i> 8 (800) 350-11-60</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=55.819090,37.653694" target="_blank" rel="noopener" aria-label="Построить маршрут">
            <i class="fa fa-directions"></i>
          </a>
        </div>
      </div>
    `
  }, {
    iconLayout: 'default#image',
    iconImageHref: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fd7921" opacity="0"/></svg>'),
    iconImageSize: [40, 40],
    iconImageOffset: [-20, -20]
  });

  // Добавление маркера на карту
  map.geoObjects.add(marker);

  // Открытие балуна сразу при загрузке карты
  marker.balloon.open();

  // Добавление кнопки для определения местоположения пользователя
  const locationButton = document.createElement('div');
  locationButton.className = 'my-location-button';
  locationButton.innerHTML = '<i class="fa fa-location-arrow"></i>';
  locationButton.title = 'Моё местоположение';
  map.controls.add(locationButton, { float: 'right' });

  locationButton.addEventListener('click', function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        map.setCenter(userLocation);
        map.setZoom(15);
      }, function () {
        alert('Не удалось определить ваше местоположение');
      });
    } else {
      alert('Ваш браузер не поддерживает геолокацию');
    }
  });

  // Добавление элементов управления для зума
  const zoomControls = document.createElement('div');
  zoomControls.className = 'zoom-controls';

  const zoomInButton = document.createElement('div');
  zoomInButton.className = 'zoom-button';
  zoomInButton.innerHTML = '<i class="fa fa-plus"></i>';
  zoomInButton.title = 'Приблизить';
  zoomInButton.addEventListener('click', function () {
    map.setZoom(map.getZoom() + 1);
  });

  const zoomOutButton = document.createElement('div');
  zoomOutButton.className = 'zoom-button';
  zoomOutButton.innerHTML = '<i class="fa fa-minus"></i>';
  zoomOutButton.title = 'Отдалить';
  zoomOutButton.addEventListener('click', function () {
    map.setZoom(map.getZoom() - 1);
  });

  zoomControls.appendChild(zoomInButton);
  zoomControls.appendChild(zoomOutButton);
  map.controls.add(zoomControls, { float: 'right' });
}

// Загрузка карты Яндекс через API
ymaps.ready(initMap);

/**
* Initializes the contact form with validation and submission handling
* Manages form state during submission and displays success/error messages
*/
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  // Инициализация масок для телефона
  const phoneInput = contactForm.querySelector('input[name="tel"]');
  if (phoneInput) {
      if (typeof IMask === 'function') {
          IMask(phoneInput, {
              mask: '+{7} (000) 000-00-00'
          });
      } else {
          phoneInput.pattern = '\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}';
          phoneInput.placeholder = '+7 (___) ___-__-__';
      }
  }

  // Обработчик отправки формы (исправленная версия)
  contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;

      // Валидация полей
      requiredFields.forEach(field => {
          if (!field.value.trim()) {
              field.classList.add('is-invalid');
              isValid = false;
          } else {
              field.classList.remove('is-invalid');
          }
      });

      if (!isValid) return;

      // Проверка reCAPTCHA
      if (typeof grecaptcha !== 'undefined') {
          const recaptchaResponse = grecaptcha.getResponse();
          const recaptchaError = document.getElementById('recaptchaError');

          if (!recaptchaResponse && recaptchaError) {
              recaptchaError.textContent = 'Пожалуйста, подтвердите, что вы не робот';
              recaptchaError.classList.add('show');
              return;
          }

          if (recaptchaError) {
              recaptchaError.textContent = '';
              recaptchaError.classList.remove('show');
          }
      }

      // Отправка формы
      const formData = new FormData(contactForm);
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonContent = submitButton.innerHTML;

      contactForm.classList.add('submitting');
      submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

      fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          }
      })
      .then(response => response.json())
      .then(data => {
          contactForm.classList.remove('submitting');
          submitButton.innerHTML = originalButtonContent;

          if (data.success) {
              contactForm.classList.add('success-state');
              contactForm.reset();
              if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
              
              setTimeout(() => {
                  contactForm.classList.remove('success-state');
              }, 5000);
          } else {
              showError(data.message || 'Ошибка отправки формы');
          }
      })
      .catch(error => {
          contactForm.classList.remove('submitting');
          submitButton.innerHTML = originalButtonContent;
          showError('Ошибка сети. Попробуйте позже.');
          console.error('Error:', error);
      });
  });
}

// Вспомогательная функция для отображения ошибок
function showError(message) {
  const errorElement = document.getElementById('recaptchaError') || 
                      document.createElement('div');
  if (!document.getElementById('recaptchaError')) {
      errorElement.id = 'form-error';
      document.body.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.classList.add('show');
  setTimeout(() => errorElement.classList.remove('show'), 5000);
}

// Инициализация формы при загрузке
document.addEventListener('DOMContentLoaded', initContactForm);

/**
 * Main JavaScript for index.html
 * This script handles all interactive elements and animations for the IT outsourcing company website.
 * It rebuilds the page content based on existing CSS classes and structure.
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, запуск инициализации...');
  
  // Инициализируем глобальные функции
  initAnimations();
  initStatisticsCounters();
  
  // Гарантированно инициализируем карусель и карту после загрузки необходимых библиотек
  initClientsCarouselForSure();
  initGoogleMapForSure();
  
  // Остальные компоненты
  initContactForm();
  initTabsNavigation();
  initBackToTop();
  
  // Добавить декоративные элементы
  addDecorativeElements();
});

/**
* Загружает библиотеку jQuery, если она еще не загружена
* @returns {Promise} Промис, который разрешается, когда jQuery загружена
*/
function loadjQuery() {
  return new Promise((resolve, reject) => {
      if (window.jQuery) {
          console.log('jQuery уже загружена');
          resolve(window.jQuery);
          return;
      }
      
      console.log('Загрузка jQuery...');
      const script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      script.onload = function() {
          console.log('jQuery успешно загружена');
          resolve(window.jQuery);
      };
      script.onerror = function() {
          console.error('Не удалось загрузить jQuery');
          reject(new Error('Failed to load jQuery'));
      };
      document.head.appendChild(script);
  });
}

/**
* Загружает библиотеку Owl Carousel, если она еще не загружена
* @returns {Promise} Промис, который разрешается, когда Owl Carousel загружена
*/
function loadOwlCarousel() {
  return new Promise((resolve, reject) => {
      if (window.jQuery && window.jQuery.fn.owlCarousel) {
          console.log('Owl Carousel уже загружена');
          resolve();
          return;
      }
      
      // Сначала загружаем jQuery, если её нет
      loadjQuery()
          .then(() => {
              console.log('Загрузка Owl Carousel CSS...');
              
              // Загружаем CSS для Owl Carousel
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css';
              document.head.appendChild(link);
              
              console.log('Загрузка Owl Carousel JS...');
              
              // Загружаем JS для Owl Carousel
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js';
              script.onload = function() {
                  console.log('Owl Carousel успешно загружена');
                  resolve();
              };
              script.onerror = function() {
                  console.error('Не удалось загрузить Owl Carousel');
                  reject(new Error('Failed to load Owl Carousel'));
              };
              document.head.appendChild(script);
          })
          .catch(reject);
  });
}

/**
* Инициализирует анимации на основе скролла для различных элементов
* Определяет, когда элементы входят в область видимости, и добавляет классы анимации
*/
function initAnimations() {
  console.log('Инициализация анимаций...');
  
  // Элементы с соответствующими классами анимации
  const animatedElements = {
      '.section-header': 'animate',
      '.advantage-intro': 'animate',
      '.advantage-highlights': 'animate',
      '.highlight-item': 'animate',
      '.tabs-container': 'animate',
      '.stat-card': 'animate',
      '.client-logo': 'animate',
      '.map-container': 'animate',
      '.contact-form-container': 'animate',
      '.about-widget': 'animate',
      '.footer-widget': 'animate'
  };

  // Используем Intersection Observer API для лучшей производительности
  if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  // Находим, какому селектору соответствует этот элемент
                  const matchedSelector = Object.keys(animatedElements).find(selector => 
                      entry.target.matches(selector)
                  );
                  
                  if (matchedSelector) {
                      entry.target.classList.add(animatedElements[matchedSelector]);
                      // Прекращаем наблюдение после добавления анимации
                      observer.unobserve(entry.target);
                  }
              }
          });
      }, { threshold: 0.1 });

      // Начинаем наблюдение за всеми элементами
      for (const selector in animatedElements) {
          document.querySelectorAll(selector).forEach(element => {
              observer.observe(element);
          });
      }
  } else {
      // Фоллбэк для браузеров без поддержки IntersectionObserver
      for (const selector in animatedElements) {
          document.querySelectorAll(selector).forEach(element => {
              element.classList.add(animatedElements[selector]);
          });
      }
  }
}

/**
* Инициализирует счетчики статистики с плавной анимацией
* Отсчитывает от нуля до целевого значения при появлении элемента в области видимости
*/
function initStatisticsCounters() {
  console.log('Инициализация счетчиков статистики...');
  
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) {
      console.warn('Счетчики статистики не найдены на странице');
      return;
  }
  
  // Функция для анимации счетчика с плавностью
  const animateCounter = (counter, finalValue, duration = 2500) => {
      let startValue = 0;
      let startTime = null;
      
      // Используем easeOutQuad для более плавной анимации
      const easeOutQuad = t => t * (2 - t);
      
      const updateCounter = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = easeOutQuad(progress);
          const value = Math.floor(easedProgress * (finalValue - startValue) + startValue);
          counter.textContent = value.toLocaleString();
          
          if (progress < 1) {
              requestAnimationFrame(updateCounter);
          } else {
              counter.textContent = finalValue.toLocaleString();
              counter.classList.add('pulse');
              
              // Добавляем суффикс данных после числа, если он есть
              const suffix = counter.getAttribute('data-suffix');
              if (suffix) {
                  counter.setAttribute('data-suffix-visible', 'true');
              }
          }
      };
      
      requestAnimationFrame(updateCounter);
  };
  
  // Используем Intersection Observer для запуска счетчиков
  if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const counter = entry.target;
                  const finalValue = parseInt(counter.getAttribute('data-value'), 10);
                  animateCounter(counter, finalValue);
                  observer.unobserve(counter);
              }
          });
      }, { threshold: 0.3 });
      
      // Наблюдаем за всеми элементами счетчиков
      counters.forEach(counter => {
          observer.observe(counter);
      });
  } else {
      // Фоллбэк для браузеров без IntersectionObserver
      counters.forEach(counter => {
          const finalValue = parseInt(counter.getAttribute('data-value'), 10);
          animateCounter(counter, finalValue);
      });
  }
}

/**
* Гарантированная инициализация карусели клиентов
* Обеспечивает загрузку всех зависимостей перед инициализацией карусели
*/
function initClientsCarouselForSure() {
  console.log('Подготовка к инициализации карусели клиентов...');
  
  const carousel = document.querySelector('.clients-carousel');
  if (!carousel) {
      console.warn('Элемент карусели клиентов не найден на странице');
      return;
  }
  
  // Загружаем Owl Carousel и затем инициализируем карусель
  loadOwlCarousel()
      .then(() => {
          console.log('Зависимости загружены, инициализирую карусель клиентов...');
          
          // Перед инициализацией карусели убедимся, что она не пуста
          if (carousel.children.length === 0) {
              console.warn('Карусель пуста, создаю демо-логотипы...');
              // Если элементы карусели отсутствуют, создаем заглушки
              createDemoLogos(carousel);
          }
          
          // Убедимся, что элемент не был уже инициализирован как карусель
          if (!carousel.className.includes('owl-loaded')) {
              console.log('Инициализация Owl Carousel...');
              
              try {
                  // Инициализация с Owl Carousel
                  $(carousel).owlCarousel({
                      loop: true,
                      margin: 30,
                      nav: true,
                      dots: true,
                      autoplay: true,
                      autoplayTimeout: 5000,
                      autoplayHoverPause: true,
                      responsive: {
                          0: { items: 2 },
                          576: { items: 3 },
                          768: { items: 4 },
                          992: { items: 5 },
                          1200: { items: 6 }
                      },
                      navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
                  });
                  
                  console.log('Карусель клиентов успешно инициализирована');
                  
                  // Добавляем декоративные звезды
                  addStarsToCarousel();
              } catch (error) {
                  console.error('Ошибка при инициализации карусели:', error);
                  // Создаем резервный вариант отображения
                  createFallbackClientGrid(carousel);
              }
          } else {
              console.log('Карусель уже инициализирована');
          }
      })
      .catch(error => {
          console.error('Ошибка загрузки зависимостей для карусели:', error);
          // Создаем резервный вариант отображения в случае ошибки
          createFallbackClientGrid(carousel);
      });
}

/**
* Создает демо-логотипы клиентов, если их нет в разметке
* @param {HTMLElement} container Контейнер, в который нужно добавить логотипы
*/
function createDemoLogos(container) {
  const logoUrls = [
      'logos/Alfa-Logistic%20LOGO%2075DPI.png',
      'logos/Etalon.png',
      'logos/Hotline.png',
      'logos/Novogorsk-2.png',
      'logos/VintHim.png',
      'logos/%D0%B0%D0%BC%D0%B0%D1%82%D0%B5%D0%BA.png',
      'logos/%D0%BA%D0%BB%D0%B8%D0%BA%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81.png',
      'logos/%D0%B1%D0%B5%D1%80%D0%B5%D0%B7%D1%8B.png',
      'logos/максидент.png',
      'logos/отель весна.png',
      'logos/ремэкспо.png',
      'logos/спорт макс.png',
      'logos/стандарты аудита.png',
      'logos/сэс.png',
      'logos/тенис first.png',
      'logos/тхц.png'
  ];
  
  const companyNames = [
      'Альфа Логистик',
      'Эталон',
      'Хотлайн',
      'Новогорск',
      'ВинтХим',
      'Аматек',
      'Клик Ресурс',
      'Березы',
      'Максидент',
      'Отель Весна',
      'Ремэкспо',
      'Спорт Макс',
      'Стандарты Аудита',
      'СЭС',
      'Тенис First',
      'ТХЦ'
  ];
  
  // Создаем элементы для каждого логотипа
  logoUrls.forEach((url, index) => {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'client-logo';
      
      const img = document.createElement('img');
      img.src = url;
      img.alt = companyNames[index] || 'Логотип компании';
      img.width = 200;
      img.height = 100;
      img.loading = 'lazy';
      
      logoDiv.appendChild(img);
      container.appendChild(logoDiv);
  });
}

/**
* Создает резервное отображение логотипов клиентов, если карусель не удалось инициализировать
* @param {HTMLElement} carousel Элемент карусели, который нужно заменить на сетку
*/
function createFallbackClientGrid(carousel) {
  console.log('Создание резервного отображения логотипов клиентов...');
  
  if (!carousel || carousel.parentNode === null) return;
  
  // Копируем все логотипы из карусели
  const clientLogos = Array.from(carousel.querySelectorAll('.client-logo'));
  
  // Если логотипов нет, создаем их
  if (clientLogos.length === 0) {
      createDemoLogos(carousel);
      clientLogos.push(...Array.from(carousel.querySelectorAll('.client-logo')));
  }
  
  // Создаем новый контейнер для сетки
  const clientsContainer = document.createElement('div');
  clientsContainer.className = 'clients-container';
  
  // Добавляем логотипы в новый контейнер
  clientLogos.forEach(logo => {
      clientsContainer.appendChild(logo.cloneNode(true));
  });
  
  // Заменяем карусель на контейнер
  carousel.parentNode.replaceChild(clientsContainer, carousel);
  
  // Добавляем стили для сетки, если они еще не добавлены
  if (!document.getElementById('fallback-client-styles')) {
      const styles = document.createElement('style');
      styles.id = 'fallback-client-styles';
      styles.textContent = `
          .clients-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 30px;
              justify-content: center;
              padding: 20px 0;
          }
          
          .clients-container .client-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
              border: 1px solid rgba(0, 0, 0, 0.05);
              padding: 15px;
              transition: all 0.3s ease;
              
          }
          
          .clients-container .client-logo:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              
          }
          
          .clients-container .client-logo img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
          }
          
          @media (max-width: 768px) {
              .clients-container {
                  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
              }
          }
      `;
      
      document.head.appendChild(styles);
  }
  
  // Добавляем эффект плавного появления
  setTimeout(() => {
      clientsContainer.style.opacity = '1';
  }, 100);
  
  console.log('Резервное отображение логотипов клиентов создано');
}

/**
* Добавляет декоративные элементы звезд в секцию карусели клиентов
*/
function addStarsToCarousel() {
  console.log('Добавление декоративных звезд в секцию клиентов...');
  
  const clientsSection = document.querySelector('.clients-section');
  if (!clientsSection) return;
  
  // Удаляем существующие звезды, если они есть
  clientsSection.querySelectorAll('.star').forEach(star => star.remove());
  
  // Создаем и добавляем новые звезды
  for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Случайные параметры для звезд
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 10 + 5}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      clientsSection.appendChild(star);
  }
  
  // Добавляем стили для звезд, если их нет
  if (!document.getElementById('star-styles')) {
      const styles = document.createElement('style');
      styles.id = 'star-styles';
      styles.textContent = `
          .star {
              position: absolute;
              background-color: rgba(253, 121, 33, 0.2);
              border-radius: 50%;
              pointer-events: none;
              z-index: -1;
              animation: starFloat 15s infinite ease-in-out;
          }
          
          @keyframes starFloat {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-24px) translateX(8px); }
              50% { transform: translateY(8px) translateX(16px); }
              75% { transform: translateY(16px) translateX(-8px); }
          }
      `;
      
      document.head.appendChild(styles);
  }
  
  console.log('Декоративные звезды добавлены');
}

/**
* Загружает Google Maps API, если он еще не загружен
* @returns {Promise} Промис, который разрешается, когда API Google Maps загружен
*/
function loadGoogleMapsAPI() {
  return new Promise((resolve, reject) => {
      // Проверяем, загружен ли уже Google Maps API
      if (window.google && window.google.maps) {
          console.log('Google Maps API уже загружен');
          resolve(window.google.maps);
          return;
      }
      
      // Создаем глобальную функцию обратного вызова для Google Maps
      window.initGoogleMapsCallback = function() {
          console.log('Google Maps API успешно загружен');
          resolve(window.google.maps);
          // Удаляем функцию обратного вызова
          delete window.initGoogleMapsCallback;
      };
      
      console.log('Загрузка Google Maps API...');
      
      // Загружаем Google Maps API
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s&callback=initGoogleMapsCallback';
      script.async = true;
      script.defer = true;
      
      script.onerror = function() {
          console.error('Не удалось загрузить Google Maps API');
          reject(new Error('Failed to load Google Maps API'));
      };
      
      document.head.appendChild(script);
  });
}

/**
* Гарантированная инициализация Google Maps
* Обеспечивает загрузку API перед инициализацией карты
*/
function initGoogleMapForSure() {
  console.log('Подготовка к инициализации карты...');
  
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
      console.warn('Элемент карты не найден на странице');
      return;
  }
  
  // Загружаем API Google Maps и затем инициализируем карту
  loadGoogleMapsAPI()
      .then(maps => {
          console.log('Инициализация карты Google Maps...');
          
          // Координаты офиса (Москва, Ракетный бульвар)
          const officeLocation = { lat: 55.816324, lng: 37.619361 };
          
          // Создаем карту
          const map = new maps.Map(mapContainer, {
              center: officeLocation,
              zoom: 16,
              styles: [
                  {
                      "featureType": "all",
                      "elementType": "labels.text.fill",
                      "stylers": [{"color": "#7c93a3"}, {"lightness": "-10"}]
                  },
                  {
                      "featureType": "landscape",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#f1f1f1"}]
                  },
                  {
                      "featureType": "poi",
                      "elementType": "all",
                      "stylers": [{"visibility": "off"}]
                  },
                  {
                      "featureType": "road",
                      "elementType": "all",
                      "stylers": [{"saturation": -100}, {"lightness": 45}]
                  },
                  {
                      "featureType": "water",
                      "elementType": "geometry.fill",
                      "stylers": [{"color": "#c8d7d4"}]
                  }
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true
          });
          
          // Создаем маркер офиса
          const marker = new maps.Marker({
              position: officeLocation,
              map: map,
              title: 'GigSys IT-solutions',
              animation: maps.Animation.DROP,
              icon: {
                  path: maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#fd7921',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
              }
          });
          
          // Создаем информационное окно
          const infoWindow = new maps.InfoWindow({
              content: `
                  <div style="padding: 10px; max-width: 250px;">
                      <h3 style="margin-top: 0; color: #333; font-weight: bold;">GigSys IT-solutions</h3>
                      <p style="margin-bottom: 10px;">г. Москва, Ракетный бульвар, д.15, оф.31</p>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                          <a href="tel:88003501160" style="color: #fd7921; text-decoration: none;">
                              <i class="fas fa-phone-alt"></i> 8 (800) 350-11-60
                          </a>
                          <a href="https://www.google.com/maps/dir//55.816324,37.619361" target="_blank" 
                             style="background: #fd7921; color: white; padding: 5px 10px; border-radius: 3px; text-decoration: none;">
                              <i class="fas fa-directions"></i> Маршрут
                          </a>
                      </div>
                  </div>
              `
          });
          
          // Открываем информационное окно при клике на маркер
          marker.addListener('click', () => {
              infoWindow.open(map, marker);
          });
          
          // Добавляем элементы управления картой
          addCustomMapControls(map, maps);
          
          // Для наглядности сразу открываем информационное окно
          infoWindow.open(map, marker);
          
          console.log('Карта успешно инициализирована');
      })
      .catch(error => {
          console.error('Ошибка при инициализации Google Maps:', error);
          
          // Создаем статическую карту как запасной вариант
          createStaticMap(mapContainer);
      });
}

/**
* Добавляет пользовательские элементы управления на карту Google Maps
* @param {Object} map Объект карты Google Maps
* @param {Object} maps API Google Maps
*/
function addCustomMapControls(map, maps) {
  console.log('Добавление элементов управления картой...');
  
  // Кнопка для определения местоположения пользователя
  const locationControlDiv = document.createElement('div');
  locationControlDiv.className = 'custom-map-control location-control';
  locationControlDiv.title = 'Показать моё местоположение';
  locationControlDiv.innerHTML = '<span><i class="fas fa-location-arrow"></i></span>';
  
  locationControlDiv.addEventListener('click', () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const userLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  };
                  
                  // Центрируем карту на местоположении пользователя
                  map.setCenter(userLocation);
                  map.setZoom(15);
                  
                  // Добавляем маркер местоположения пользователя
                  new maps.Marker({
                      position: userLocation,
                      map: map,
                      title: 'Вы здесь',
                      icon: {
                          path: maps.SymbolPath.CIRCLE,
                          scale: 8,
                          fillColor: '#4285F4',
                          fillOpacity: 1,
                          strokeColor: '#ffffff',
                          strokeWeight: 2
                      }
                  });
              },
              () => {
                  alert('Не удалось определить ваше местоположение');
              }
          );
      } else {
          alert('Ваш браузер не поддерживает геолокацию');
      }
  });
  
  // Добавляем стили для элементов управления
  if (!document.getElementById('map-controls-styles')) {
      const styles = document.createElement('style');
      styles.id = 'map-controls-styles';
      styles.textContent = `
          .custom-map-control {
              background-color: #fff;
              border-radius: 2px;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
              cursor: pointer;
              margin: 10px;
              text-align: center;
              height: 40px;
              width: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.3s ease;
          }
          
          .custom-map-control:hover {
              background-color: #f1f1f1;
          }
          
          .custom-map-control span {
              display: inline-block;
              font-size: 18px;
              color: #666;
          }
          
          .location-control span {
              color: #4285F4;
          }
      `;
      
      document.head.appendChild(styles);
  }
  
  // Добавляем элементы управления на карту
  map.controls[maps.ControlPosition.RIGHT_BOTTOM].push(locationControlDiv);
  
  console.log('Элементы управления картой добавлены');
}

/**
* Создает статическую карту в качестве запасного варианта, если не удалось загрузить Google Maps API
* @param {HTMLElement} container Контейнер для карты
*/
function createStaticMap(container) {
  console.log('Создание статической карты...');
  
  // Координаты офиса
  const lat = 55.816324;
  const lng = 37.619361;
  
  // Создаем статическую карту
  container.innerHTML = `
      <img src="https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=800x400&markers=color:orange%7C${lat},${lng}&key=AIzaSyBVWaKrjvy3MaE7SQ74_uJiULgl1JY0H2s" 
          alt="Карта офиса" style="width: 100%; height: 100%; object-fit: cover;">
      <div class="static-map-overlay">
          <div class="static-map-content">
              <h3>GigSys IT-solutions</h3>
              <p>г. Москва, Ракетный бульвар, д.15, оф.31</p>
              <div class="static-map-actions">
                  <a href="tel:88003501160" class="static-map-btn">
                      <i class="fa fa-phone"></i> 8 (800) 350-11-60
                  </a>
                  <a href="https://www.google.com/maps/dir//55.816324,37.619361" target="_blank" class="static-map-btn primary">
                      <i class="fa fa-directions"></i> Построить маршрут
                  </a>
              </div>
          </div>
      </div>
  `;
  
  // Добавляем стили для статической карты
  if (!document.getElementById('static-map-styles')) {
      const styles = document.createElement('style');
      styles.id = 'static-map-styles';
      styles.textContent = `
          .static-map-overlay {
              position: absolute;
              bottom: 20px;
              left: 20px;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 8px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              padding: 15px;
              max-width: 300px;
          }
          
          .static-map-content h3 {
              margin-top: 0;
              color: #333;
              font-weight: bold;
          }
          
          .static-map-content p {
              margin-bottom: 15px;
              color: #666;
          }
          
          .static-map-actions {
              display: flex;
              flex-direction: column;
              gap: 10px;
          }
          
          .static-map-btn {
              display: inline-block;
              padding: 8px 12px;
              border-radius: 4px;
              text-decoration: none;
              color: #666;
              background: #f1f1f1;
              transition: all 0.3s ease;
          }
          
          .static-map-btn.primary {
              background: #fd7921;
              color: white;
          }
          
          .static-map-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          }
      `;
      
      document.head.appendChild(styles);
  }
  
  console.log('Статическая карта создана');
}

/**
* Инициализирует контактную форму с валидацией и обработкой отправки
* Управляет состоянием формы при отправке и отображает сообщения об успехе/ошибке
*/
function initContactForm() {
  console.log('Инициализация контактной формы...');
  
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) {
      console.warn('Контактная форма не найдена на странице');
      return;
  }
  
  // Маска для телефона
  const phoneInput = contactForm.querySelector('input[name="tel"]');
  if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
          let x = e.target.value.replace(/\D/g, '')
              .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
          
          if (!x[1] && x[2]) {
              e.target.value = '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '');
          } else {
              e.target.value = '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
          }
      });
  }
  
  // Обработчик отправки формы
  contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Базовая валидация формы
      const requiredFields = contactForm.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
          if (!field.value.trim()) {
              field.classList.add('is-invalid');
              isValid = false;
          } else {
              field.classList.remove('is-invalid');
          }
      });
      
      if (!isValid) return;
      
      // Валидация галочки согласия
      const checkbox = contactForm.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.checked) {
          alert('Пожалуйста, подтвердите согласие на обработку персональных данных');
          return;
      }
      
      // Показываем состояние загрузки
      contactForm.classList.add('submitting');
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonContent = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
      
      // Эмулируем отправку формы (для демонстрации)
      setTimeout(() => {
          contactForm.classList.remove('submitting');
          submitButton.innerHTML = originalButtonContent;
          
          // Показываем сообщение об успехе
          contactForm.classList.add('success-state');
          
          // Сбрасываем форму
          contactForm.reset();
          
          // Через некоторое время убираем состояние успеха
          setTimeout(() => {
              contactForm.classList.remove('success-state');
          }, 5000);
          
          console.log('Форма успешно "отправлена"');
      }, 2000);
  });
  
  console.log('Контактная форма инициализирована');
}

/**
* Инициализирует навигацию по вкладкам в секции преимуществ
* Обрабатывает переключение вкладок и отображение содержимого с плавными переходами
*/
function initTabsNavigation() {
  console.log('Инициализация навигации по вкладкам...');
  
  const tabButtons = document.querySelectorAll('.tab-button');
  if (!tabButtons.length) {
      console.warn('Кнопки вкладок не найдены на странице');
      return;
  }
  
  // Функция для переключения активной вкладки
  const switchTab = (tabId) => {
      // Убираем класс active у всех кнопок вкладок и панелей
      document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
      });
      
      document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
      });
      
      // Добавляем класс active выбранной кнопке вкладки и панели
      const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
      const selectedPanel = document.getElementById(tabId);
      
      if (selectedButton && selectedPanel) {
          selectedButton.classList.add('active');
          selectedPanel.classList.add('active');
      }
  };
  
  // Добавляем обработчики событий клика для кнопок вкладок
  tabButtons.forEach(button => {
      button.addEventListener('click', () => {
          const tabId = button.getAttribute('data-tab');
          if (tabId) {
              switchTab(tabId);
          }
      });
  });
  
  // Убеждаемся, что первая вкладка активна по умолчанию, если ни одна не активна
  if (!document.querySelector('.tab-button.active')) {
      const firstTabId = tabButtons[0]?.getAttribute('data-tab');
      if (firstTabId) {
          switchTab(firstTabId);
      }
  }
  
  console.log('Навигация по вкладкам инициализирована');
}

/**
* Инициализирует кнопку "Наверх"
* Показывает/скрывает кнопку в зависимости от положения прокрутки и обрабатывает плавную прокрутку
*/
function initBackToTop() {
  console.log('Инициализация кнопки "Наверх"...');
  
  // Создаем кнопку "Наверх", если ее нет
  let backToTopButton = document.querySelector('.back-to-top');
  
  if (!backToTopButton) {
      backToTopButton = document.createElement('a');
      backToTopButton.className = 'back-to-top';
      backToTopButton.innerHTML = '<i class="fa fa-arrow-up"></i>';
      backToTopButton.href = '#';
      backToTopButton.setAttribute('aria-label', 'Наверх');
      document.body.appendChild(backToTopButton);
      
      // Добавляем стили для кнопки
      if (!document.getElementById('back-to-top-styles')) {
          const styles = document.createElement('style');
          styles.id = 'back-to-top-styles';
          styles.textContent = `
              .back-to-top {
                  position: fixed;
                  right: 30px;
                  bottom: 30px;
                  width: 50px;
                  height: 50px;
                  background: linear-gradient(135deg, #fd7921, #e4550f);
                  color: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 24px;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                  opacity: 0;
                  visibility: hidden;
                  z-index: 999;
                  transform: translateY(30px);
                  transition: all 0.3s ease;
                  text-decoration: none;
              }
              
              .back-to-top.visible {
                  opacity: 1;
                  visibility: visible;
                  transform: translateY(0);
              }
              
              .back-to-top:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
              }
          `;
          
          document.head.appendChild(styles);
      }
  }
  
  // Функция для переключения видимости кнопки
  const toggleBackToTopButton = () => {
      if (window.pageYOffset > 300) {
          backToTopButton.classList.add('visible');
      } else {
          backToTopButton.classList.remove('visible');
      }
  };
  
  // Добавляем обработчик события прокрутки
  window.addEventListener('scroll', toggleBackToTopButton);
  
  // Инициализируем состояние кнопки
  toggleBackToTopButton();
  
  // Добавляем обработчик события клика
  backToTopButton.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Плавная прокрутка наверх
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
  
  console.log('Кнопка "Наверх" инициализирована');
}

/**
* Добавляет различные декоративные элементы на страницу
* Создает фоновые частицы, волны и другие визуальные улучшения
*/
function addDecorativeElements() {
  console.log('Добавление декоративных элементов...');
  
  // Добавляем волны в футер
  addFooterWaves();
  
  // Добавляем плавающие частицы в секцию статистики
  addStatisticsParticles();
  
  // Добавляем фоновые элементы в секцию контактов
  addContactBackground();
  
  console.log('Декоративные элементы добавлены');
}

/**
* Добавляет декоративные элементы волн в футер
*/
function addFooterWaves() {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  
  if (!footer.querySelector('.footer-waves')) {
      const footerWaves = document.createElement('div');
      footerWaves.className = 'footer-waves';
      
      for (let i = 1; i <= 3; i++) {
          const wave = document.createElement('div');
          wave.className = `footer-wave footer-wave-${i}`;
          footerWaves.appendChild(wave);
      }
      
      footer.insertBefore(footerWaves, footer.firstChild);
  }
}

/**
* Добавляет плавающие элементы частиц в секцию статистики
*/
function addStatisticsParticles() {
  const statisticsSection = document.querySelector('.statistics-section');
  if (!statisticsSection) return;
  
  if (!statisticsSection.querySelector('.floating-particle')) {
      for (let i = 0; i < 5; i++) {
          const particle = document.createElement('div');
          particle.className = 'floating-particle';
          
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.width = `${Math.random() * 200 + 100}px`;
          particle.style.height = particle.style.width;
          
          statisticsSection.appendChild(particle);
      }
  }
}

/**
* Добавляет фоновые элементы в секцию контактов
*/
function addContactBackground() {
  const contactSection = document.querySelector('.contact-section');
  if (!contactSection) return;
  
  if (!contactSection.querySelector('.contact-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'contact-overlay';
      contactSection.appendChild(overlay);
  }
}

// Инициализируем загрузчик страницы при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  createPageLoader();
});

/**
* Создает анимированный загрузчик страницы
*/
function createPageLoader() {
  if (document.querySelector('.page-loader')) return;
  
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
      <div class="loader-container">
          <div class="loader-logo">
              <img src="assets/templates/img/logo.png" alt="GigSys" width="180" height="50">
          </div>
          <div class="loader-spinner">
              <div class="spinner-circle"></div>
          </div>
          <div class="loader-text">Загрузка...</div>
      </div>
  `;
  
  document.body.appendChild(loader);
  
  // Добавляем стили для загрузчика
  const styles = document.createElement('style');
  styles.textContent = `
      .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #252525;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease, visibility 0.5s ease;
      }
      .loader-container {
          text-align: center;
      }
      .loader-logo {
          margin-bottom: 30px;
      }
      .loader-logo img {
          filter: brightness(0) invert(1);
          max-width: 180px;
      }
      .loader-spinner {
          display: inline-block;
          position: relative;
          width: 60px;
          height: 60px;
      }
      .spinner-circle {
          width: 100%;
          height: 100%;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #fd7921;
          animation: spin 1s linear infinite;
      }
      .loader-text {
          margin-top: 20px;
          color: white;
          font-size: 16px;
          letter-spacing: 2px;
      }
      @keyframes spin {
          to { transform: rotate(360deg); }
      }
  `;
  
  document.head.appendChild(styles);
  
  // Скрываем загрузчик после полной загрузки страницы
  window.addEventListener('load', () => {
      setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
          
          setTimeout(() => {
              if (document.body.contains(loader)) {
                  document.body.removeChild(loader);
              }
          }, 500);
      }, 500);
  });
}

