/**
 * ========================================================================
 * УЛУЧШЕННАЯ ШАПКА САЙТА - JAVASCRIPT
 * ========================================================================
 * Расширенный функционал шапки с улучшенным мобильным меню
 */

document.addEventListener('DOMContentLoaded', function() {
  // Выбираем элементы
  const header = document.getElementById('main-header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileDropdownToggles = document.querySelectorAll('.mobile-nav .has-dropdown > a');
  const servicesToggle = document.querySelector('.services-toggle');
  
  // Флаг состояния мобильного меню
  let mobileMenuIsOpen = false;
  
  // Функции для управления мобильным меню
  function openMobileMenu() {
    document.body.classList.add('mobile-menu-active');
    document.body.style.overflow = 'hidden';
    mobileMenuIsOpen = true;
  }
  
  function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-active');
    document.body.style.overflow = '';
    mobileMenuIsOpen = false;
  }
  
  function toggleMobileMenu() {
    if (mobileMenuIsOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  // Обработчики событий для мобильного меню
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  // Закрытие мобильного меню при нажатии на ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuIsOpen) {
      closeMobileMenu();
    }
  });
  
  // Обработчик для выпадающих меню в мобильной версии
  if (mobileDropdownToggles && mobileDropdownToggles.length > 0) {
    mobileDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        
        if (parent.classList.contains('open')) {
          parent.classList.remove('open');
        } else {
          // Закрываем другие открытые подменю
          const openItems = document.querySelectorAll('.mobile-nav .open');
          openItems.forEach(item => {
            if (item !== parent) {
              item.classList.remove('open');
            }
          });
          
          parent.classList.add('open');
        }
      });
    });
  }
  
  // Стики хедер и эффекты при скролле
  function handleScroll() {
    if (window.pageYOffset > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Дополнительно: усиливаем тень при скролле
    if (window.pageYOffset > 50) {
      header.style.boxShadow = '0 0.625rem 1.875rem rgba(0, 0, 0, 0.1)'; // 10px 30px
    } else {
      header.style.boxShadow = '0 0.3125rem 1.875rem rgba(0, 0, 0, 0.08)'; // 5px 30px
    }
  }
  
  // Обработчик скролла
  window.addEventListener('scroll', handleScroll);
  
  // Проверяем положение при загрузке
  handleScroll();
  
  // Дополнительные эффекты для мега-меню
  if (servicesToggle) {
    const megaMenu = document.querySelector('.mega-menu');
    
    // Создаем декоративные элементы для мега-меню
    if (megaMenu) {
      createMegaMenuParticles(megaMenu);
    }
  }
  
  // Функция создания декоративных элементов для мега-меню
  function createMegaMenuParticles(container) {
    // Создаем контейнер для частиц
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'mega-menu-particles';
    particlesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
    `;
    
    // Добавляем частицы
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'mega-menu-particle';
      
      // Рандомные размеры и позиции (используем rem)
      const sizeRem = (Math.random() * 6.25 + 3.125).toFixed(2); // 50-100px в rem при базовом размере 16px
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.05 + 0.02;
      
      particle.style.cssText = `
        position: absolute;
        width: ${sizeRem}rem;
        height: ${sizeRem}rem;
        top: ${posY}%;
        left: ${posX}%;
        background: ${i % 2 === 0 ? 'var(--color-orange-primary)' : 'var(--color-green)'};
        border-radius: 50%;
        opacity: ${opacity};
        filter: blur(${sizeRem / 10}rem);
      `;
      
      particlesContainer.appendChild(particle);
    }
    
    // Добавляем контейнер в мега-меню
    container.appendChild(particlesContainer);
    
    // Добавляем анимацию при наведении
    container.parentElement.addEventListener('mouseenter', function() {
      const particles = container.querySelectorAll('.mega-menu-particle');
      
      particles.forEach((particle, index) => {
        // Анимируем каждую частицу по-разному
        const direction = index % 2 === 0 ? '+' : '-';
        const amplitude = (Math.random() * 1.875 + 0.625).toFixed(2); // 10-30px в rem
        
        particle.style.transition = 'all 2s cubic-bezier(0.16, 1, 0.3, 1)';
        particle.style.transform = `translate(${direction}${amplitude}rem, ${direction}${amplitude}rem)`;
        particle.style.opacity = '0.08';
      });
    });
    
    // Возвращаем частицы в исходное положение
    container.parentElement.addEventListener('mouseleave', function() {
      const particles = container.querySelectorAll('.mega-menu-particle');
      
      particles.forEach(particle => {
        particle.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
        particle.style.transform = '';
        particle.style.opacity = '';
      });
    });
  }
  
  // Функция для анимации ссылок меню
  function animateMenuLinks() {
    const menuItems = document.querySelectorAll('.main-menu > li');
    
    menuItems.forEach((item, index) => {
      // Изначально скрыты
      item.style.opacity = '0';
      item.style.transform = 'translateY(1.25rem)'; // 20px в rem
      
      // Анимируем появление с задержкой
      setTimeout(() => {
        item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });
  }
  
  // Анимируем ссылки после загрузки страницы
  setTimeout(animateMenuLinks, 300);
  
  // Добавляем интерактивность для кнопок в хедере
  const headerButtons = document.querySelectorAll('.header-actions .btn');
  
  headerButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      
      const glowEffect = document.createElement('div');
      glowEffect.className = 'btn-glow';
      glowEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
        border-radius: inherit;
        opacity: 0;
        z-index: -1;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      
      this.style.position = 'relative';
      this.appendChild(glowEffect);
      
      setTimeout(() => {
        glowEffect.style.opacity = '1';
      }, 10);
    });
    
    button.addEventListener('mouseleave', function() {
      const glowEffect = this.querySelector('.btn-glow');
      if (glowEffect) {
        glowEffect.style.opacity = '0';
        
        setTimeout(() => {
          glowEffect.remove();
        }, 400);
      }
    });
    
    // Эффект нажатия
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-0.1875rem)'; // -3px в rem
    });
  });
  
  // Обработка клика вне меню для его закрытия
  document.addEventListener('click', function(e) {
    // Закрытие мобильного меню при клике вне его
    if (mobileMenuIsOpen) {
      const mobileMenu = document.querySelector('.mobile-menu');
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      
      if (mobileMenu && mobileMenuToggle) {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    }
  });
  
  // Инициализация кнопки закрытия мобильного меню, если её нет в HTML
  function initializeMobileCloseButton() {
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenu && !mobileMenuClose) {
      const closeButton = document.createElement('div');
      closeButton.className = 'mobile-menu-close';
      closeButton.setAttribute('aria-label', 'Закрыть меню');
      
      closeButton.addEventListener('click', closeMobileMenu);
      
      const mobileMenuContent = mobileMenu.querySelector('.mobile-menu-content');
      if (mobileMenuContent) {
        mobileMenuContent.insertBefore(closeButton, mobileMenuContent.firstChild);
      } else {
        mobileMenu.insertBefore(closeButton, mobileMenu.firstChild);
      }
    }
  }
  
  // Инициализация кнопки закрытия
  initializeMobileCloseButton();
  
  // Оптимизация для тачскринов
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Добавляем специальные стили для тачскринов
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
      .touch-device .main-menu > li > a {
        padding-top: 0.75rem; /* 12px */
        padding-bottom: 0.75rem; /* 12px */
      }
      
      .touch-device .mobile-menu-toggle {
        width: 3.125rem; /* 50px */
        height: 3.125rem; /* 50px */
      }
      
      .touch-device .mobile-submenu {
        padding-top: 0.9375rem; /* 15px */
        padding-bottom: 0.9375rem; /* 15px */
      }
      
      .touch-device .header-actions .btn {
        min-height: 3rem; /* Увеличенная высота для тачскринов */
      }
      
      /* Увеличиваем область касания для всех интерактивных элементов */
      .touch-device .mobile-nav a,
      .touch-device .mobile-menu-close,
      .touch-device .header-actions .btn {
        min-height: 2.75rem;
        position: relative;
      }
      
      /* Анимация при касании для мобильных устройств */
      .touch-device .header-actions .btn:active,
      .touch-device .mobile-menu-toggle:active {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }
    `;
    document.head.appendChild(touchStyle);
  }
});

/**
 * ========================================================================
 * HERO SECTION JAVASCRIPT
 * ========================================================================
 * Скрипты для инициализации частиц и всплывающих форм
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация particles.js
    if (document.getElementById('particles-js')) {
      particlesJS('particles-js', {
        "particles": {
          "number": {
            "value": 30,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  
    // Инициализация всплывающих форм через Magnific Popup
    if (typeof $.fn.magnificPopup !== 'undefined') {
      $('.popup-with-form').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',
        callbacks: {
          beforeOpen: function() {
            if ($(window).width() < 768) {
              this.st.focus = false;
            } else {
              this.st.focus = '#name';
            }
          },
          open: function() {
            // Запускаем валидацию формы при открытии
            if (typeof initFormValidation === 'function') {
              initFormValidation('#' + $(this.content).find('form').attr('id'));
            }
          }
        }
      });
    }
  
    // Плавная прокрутка к якорям
    $('a[href^="#"]:not(.popup-with-form)').on('click', function(e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 80 // Учитываем отступ для шапки
        }, 1000, 'easeInOutExpo');
      }
    });
    
    // Анимация элементов при прокрутке
    const animateElements = function() {
      const windowHeight = $(window).height();
      const windowScrollTop = $(window).scrollTop();
      
      $('.hero-section').each(function() {
        const element = $(this);
        const elementTop = element.offset().top;
        
        if (windowScrollTop + windowHeight > elementTop) {
          element.addClass('animated');
        }
      });
    };
    
    // Запускаем анимацию при загрузке и прокрутке
    animateElements();
    $(window).on('scroll', animateElements);
  });
  
  // Предзагрузка фонового изображения
  const preloadHeroBackground = function() {
    const heroImage = new Image();
    heroImage.src = '../img/hero-bg.jpg';
    heroImage.onload = function() {
      document.querySelector('.hero-section').classList.add('bg-loaded');
    };
  };
  
  preloadHeroBackground();

  /**
 * ========================================================================
 * МИНИМАЛИСТИЧНЫЕ КАТЕГОРИИ УСЛУГ JAVASCRIPT
 * ========================================================================
 * Упрощенный JS для категорий услуг
 */

document.addEventListener('DOMContentLoaded', function() {
  // Выбираем все элементы категорий
  const categoryItems = document.querySelectorAll('.category-item');
  
  // Добавляем класс для телефонов, если это сенсорное устройство
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Упрощенное взаимодействие для тачскринов
    categoryItems.forEach(item => {
      item.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      item.addEventListener('touchend', function() {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 300);
      });
    });
  }
  
  // Анимация при прокрутке
  function handleVisibility() {
    const section = document.querySelector('.services-categories-section');
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const isVisible = (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
    
    if (isVisible) {
      section.classList.add('in-view');
      window.removeEventListener('scroll', handleVisibility);
    }
  }
  
  // Обработчик прокрутки
  window.addEventListener('scroll', handleVisibility);
  
  // Проверяем позицию при загрузке
  handleVisibility();
  
  // Стили для сенсорных устройств
  const style = document.createElement('style');
  style.textContent = `
    .touch-device .category-item.touch-active {
      transform: scale(0.98);
      background-color: var(--color-orange-ultra-light);
    }
    
    .services-categories-section.in-view .categories-wrapper {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0.9;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

 /**
 * ========================================================================
 * МИНИМАЛИСТИЧНАЯ СЕКЦИЯ УСЛУГ JAVASCRIPT
 * ========================================================================
 * Упрощенные взаимодействия для современного минималистичного дизайна
 */

document.addEventListener('DOMContentLoaded', function() {
  // Выбираем основные элементы
  const servicesSection = document.querySelector('.services-section');
  const sectionHeader = document.querySelector('.section-header');
  const serviceCards = document.querySelectorAll('.service-card');
  const allServicesBtn = document.querySelector('.services-section .btn');
  
  // Анимация при прокрутке страницы
  const animateOnScroll = function() {
    if (!servicesSection) return;
    
    const sectionTop = servicesSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.75) {
      // Анимируем заголовок
      if (sectionHeader) {
        sectionHeader.classList.add('animate');
      }
      
      // Анимируем карточки с задержкой
      serviceCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate');
        }, 100 * index);
      });
      
      // Анимируем кнопку "Все услуги"
      if (allServicesBtn) {
        setTimeout(() => {
          allServicesBtn.classList.add('animate');
        }, 100 * serviceCards.length);
      }
      
      // Убираем обработчик после анимации
      window.removeEventListener('scroll', animateOnScroll);
    }
  };
  
  // Первоначальная проверка позиции
  animateOnScroll();
  
  // Добавляем обработчик прокрутки
  window.addEventListener('scroll', animateOnScroll);
  
  // Оптимизация для тачскринов
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Добавляем стили для тачскринов
    const touchStyles = document.createElement('style');
    touchStyles.textContent = `
      .touch-device .service-card:active {
        transform: scale(0.98);
      }
      
      .touch-device .service-card:active .service-icon {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(touchStyles);
  }
});

  /**
 * ========================================================================
 * СЕКЦИЯ ПРЕИМУЩЕСТВ С ВКЛАДКАМИ - JAVASCRIPT
 * ========================================================================
 * Продвинутая интерактивность с современными анимациями
 */

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем основные элементы
    const advantageSection = document.querySelector('.advantage-section');
    const advantageIntro = document.querySelector('.advantage-intro');
    const advantageHighlights = document.querySelector('.advantage-highlights');
    const highlightItems = document.querySelectorAll('.highlight-item');
    const tabsContainer = document.querySelector('.tabs-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Добавляем декоративные элементы фона
    createBackgroundElements();
    
    // Инициализация вкладок
    initTabs();
    
    // Анимация при прокрутке
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    // Добавляем интерактивные эффекты
    addInteractiveEffects();
    
    // Создание фоновых декоративных элементов
    function createBackgroundElements() {
      // Добавляем светящиеся точки на фон
      for (let i = 0; i < 15; i++) {
        const glowDot = document.createElement('div');
        glowDot.className = 'glow-dot';
        
        // Рандомные размеры и позиции
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        
        glowDot.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          top: ${posY}%;
          left: ${posX}%;
          background: radial-gradient(circle, 
            ${i % 2 === 0 ? 'rgba(253, 121, 33, 0.2)' : 'rgba(134, 188, 66, 0.2)'} 0%,
            transparent 70%);
          border-radius: 50%;
          filter: blur(5px);
          opacity: 0.2;
          z-index: 0;
          animation: glow ${duration}s ease-in-out ${delay}s infinite alternate;
        `;
        
        advantageSection.appendChild(glowDot);
      }
      
      // Добавляем стиль анимации для светящихся точек
      const style = document.createElement('style');
      style.textContent = `
        @keyframes glow {
          0% {
            transform: scale(0.8);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Инициализация вкладок
    function initTabs() {
      // Активируем первую вкладку при загрузке
      showTab('tab1');
      
      // Добавляем обработчики событий для кнопок вкладок
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          showTab(tabId);
        });
        
        // Добавляем эффект при наведении
        button.addEventListener('mouseover', function() {
          if (!this.classList.contains('active')) {
            const icon = this.querySelector('i');
            icon.style.animation = 'pulse 0.6s ease-in-out';
            
            setTimeout(() => {
              icon.style.animation = '';
            }, 600);
          }
        });
      });
      
      // Функция для отображения выбранной вкладки
      function showTab(tabId) {
        // Удаляем активный класс со всех кнопок и панелей
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Добавляем активный класс выбранной кнопке и панели
        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // Добавляем стиль анимации для переключения
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Анимация элементов при прокрутке
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      
      // Анимация вступительного текста
      if (advantageIntro && isElementInViewport(advantageIntro, 0.8)) {
        advantageIntro.classList.add('animate');
      }
      
      // Анимация блока с преимуществами
      if (advantageHighlights && isElementInViewport(advantageHighlights, 0.7)) {
        advantageHighlights.classList.add('animate');
        
        // Анимируем элементы с задержкой
        highlightItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animate');
          }, 200 * index);
        });
      }
      
      // Анимация контейнера вкладок
      if (tabsContainer && isElementInViewport(tabsContainer, 0.6)) {
        tabsContainer.classList.add('animate');
      }
      
      // Функция для проверки, находится ли элемент в области видимости
      function isElementInViewport(el, ratio = 1) {
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= windowHeight * ratio &&
          rect.bottom >= 0
        );
      }
    }
    
    // Добавление интерактивных эффектов
    function addInteractiveEffects() {
      // 3D эффект наклона для карточек преимуществ
      highlightItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Расчет координат относительно центра
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Расчет угла наклона (максимум 10 градусов)
          const tiltX = ((y - centerY) / centerY) * 5;
          const tiltY = ((x - centerX) / centerX) * -5;
          
          // Применяем трансформацию
          this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
          
          // Эффект подсветки иконки
          const icon = this.querySelector('.highlight-icon');
          if (icon) {
            const iconX = ((x - centerX) / centerX) * 10;
            const iconY = ((y - centerY) / centerY) * 10;
            icon.style.transform = `translate(${iconX}px, ${iconY}px) scale(1.1)`;
            
            // Добавляем градиентную подсветку
            const glarePosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
            icon.style.background = `radial-gradient(circle at ${glarePosition}, rgba(255, 255, 255, 0.8) 0%, var(--color-orange-ultra-light) 80%)`;
          }
        });
        
        // Возвращаем карточку в исходное положение
        item.addEventListener('mouseleave', function() {
          this.style.transform = '';
          
          const icon = this.querySelector('.highlight-icon');
          if (icon) {
            icon.style.transform = '';
            icon.style.background = '';
          }
        });
      });
      
      // Анимация вкладок при переключении
      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Эффект нажатия
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 200);
          
          // Вибрация иконки
          const icon = this.querySelector('i');
          icon.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            icon.style.animation = '';
          }, 500);
        });
      });
      
      // Добавляем стиль анимации для вибрации
      const shakeStyle = document.createElement('style');
      shakeStyle.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-5deg); }
          20%, 40%, 60%, 80% { transform: translateX(5px) rotate(5deg); }
        }
      `;
      document.head.appendChild(shakeStyle);
      
      // Интерактивный эффект для списка преимуществ
      const advantageItems = document.querySelectorAll('.advantage-list li');
      advantageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
          // Анимация при наведении
          const icon = this.querySelector('.advantage-icon i');
          if (icon) {
            icon.style.animation = 'pulse 0.8s infinite';
          }
        });
        
        item.addEventListener('mouseleave', function() {
          // Сброс анимации
          const icon = this.querySelector('.advantage-icon i');
          if (icon) {
            icon.style.animation = '';
          }
        });
      });
      
      // Эффект параллакса для изображений в вкладках
      window.addEventListener('mousemove', function(e) {
        const activePanel = document.querySelector('.tab-panel.active');
        if (activePanel) {
          const image = activePanel.querySelector('.tab-image img');
          if (image) {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            image.style.transform = `translate(${xPos}px, ${yPos}px) scale(1.05)`;
          }
        }
      });
      
      // Добавление анимации для заголовка при прокрутке
      const sectionTitle = document.querySelector('.section-title');
      if (sectionTitle) {
        window.addEventListener('scroll', function() {
          if (isInViewport(sectionTitle)) {
            sectionTitle.classList.add('animated');
          }
        });
        
        // Проверяем видимость при загрузке
        if (isInViewport(sectionTitle)) {
          sectionTitle.classList.add('animated');
        }
        
        // Функция для проверки видимости элемента
        function isInViewport(element) {
          const rect = element.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
        }
        
        // Добавляем стили для анимации заголовка
        const titleStyle = document.createElement('style');
        titleStyle.textContent = `
          .section-title.animated strong {
            position: relative;
            display: inline-block;
            animation: titleHighlight 1s forwards;
          }
          
          @keyframes titleHighlight {
            0% {
              color: var(--color-dark-gray);
              transform: scale(1);
            }
            50% {
              color: var(--color-orange-primary);
              transform: scale(1.1);
            }
            100% {
              color: var(--color-orange-primary);
              transform: scale(1);
            }
          }
        `;
        document.head.appendChild(titleStyle);
      }
    }
    
    // Оптимизация для тачскрина
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
      
      // Добавляем специальные стили для тачскрина
      const touchStyle = document.createElement('style');
      touchStyle.textContent = `
        .touch-device .tab-button {
          padding: var(--spacing-4) var(--spacing-5);
        }
        
        .touch-device .tab-button i {
          width: 50px;
          height: 50px;
          font-size: 24px;
        }
        
        .touch-device .highlight-item:active {
          transform: scale(0.98);
          background: rgba(253, 121, 33, 0.05);
          transition: all 0.3s ease;
        }
        
        .touch-device .advantage-list li:active .advantage-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, var(--color-orange-primary), var(--color-orange-secondary));
          color: var(--color-white);
        }
        
        .touch-device .advantage-list li:active .advantage-text h4 {
          color: var(--color-orange-primary);
        }
      `;
      document.head.appendChild(touchStyle);
    }
    
    // Анимация для прокрутки между вкладками
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', function(e) {
        const targetTab = this.getAttribute('data-tab');
        const targetElement = document.getElementById(targetTab);
        
        if (targetElement) {
          // Плавная прокрутка до контента вкладки на мобильных устройствах
          if (window.innerWidth < 768) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 100;
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // Создание эффекта следящего курсора
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      const cursor = document.createElement('div');
      cursor.className = 'tab-cursor';
      cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(253, 121, 33, 0.3);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
        mix-blend-mode: overlay;
        transition: width 0.3s, height 0.3s, opacity 0.3s;
      `;
      document.body.appendChild(cursor);
      
      // Анимируем курсор при движении мыши над секцией
      advantageSection.addEventListener('mousemove', function(e) {
        cursor.style.opacity = '1';
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
      
      // Увеличиваем курсор при наведении на интерактивные элементы
      const interactiveElements = document.querySelectorAll('.tab-button, .highlight-item, .advantage-list li, .tab-image');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
          cursor.style.width = '40px';
          cursor.style.height = '40px';
          cursor.style.background = 'rgba(253, 121, 33, 0.2)';
        });
        
        el.addEventListener('mouseleave', function() {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
          cursor.style.background = 'rgba(253, 121, 33, 0.3)';
        });
      });
      
      // Скрываем курсор при выходе из секции
      advantageSection.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
      });
    }
  });

  /**
 * ========================================================================
 * СЕКЦИЯ СТАТИСТИКИ КОМПАНИИ - JAVASCRIPT
 * ========================================================================
 * Продвинутая анимация счетчиков и интерактивные эффекты
 */

document.addEventListener('DOMContentLoaded', function() {
    // Значения для счетчиков
    const finalValues = {
      'num1': { value: 12, suffix: '+', duration: 2000 },
      'num2': { value: 35, suffix: '+', duration: 2500 },
      'num3': { value: 250, suffix: '+', duration: 3000 },
      'num4': { value: 1800, suffix: '+', duration: 3500 }
    };
    
    // Выбираем элементы
    const statisticsSection = document.getElementById('digits');
    const statCards = document.querySelectorAll('.stat-card');
    const counterElements = document.querySelectorAll('.stat-number');
    
    // Добавляем атрибуты для суффиксов
    counterElements.forEach(counter => {
      const id = counter.id;
      if (finalValues[id]) {
        counter.setAttribute('data-suffix', finalValues[id].suffix);
      }
    });
    
    // Добавляем декоративные плавающие элементы
    createFloatingParticles();
    
    // Инициализация анимации при прокрутке
    window.addEventListener('scroll', function() {
      const sectionPosition = statisticsSection.getBoundingClientRect();
      
      // Если секция в зоне видимости (с небольшим запасом)
      if (sectionPosition.top < window.innerHeight * 0.8 && sectionPosition.bottom > 0) {
        // Анимируем карточки с эффектом каскада
        statCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index);
        });
        
        // Запускаем счетчики с разной задержкой
        startCounters();
        
        // Удаляем обработчик после срабатывания
        window.removeEventListener('scroll', arguments.callee);
      }
    });
    
    // Проверяем положение секции при загрузке страницы
    setTimeout(() => {
      if (statisticsSection.getBoundingClientRect().top < window.innerHeight) {
        statCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index);
        });
        startCounters();
      }
    }, 300);
    
    // Функция создания плавающих частиц
    function createFloatingParticles() {
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        statisticsSection.appendChild(particle);
      }
    }
    
    // Функция запуска счетчиков
    function startCounters() {
      counterElements.forEach(counter => {
        const id = counter.id;
        
        if (finalValues[id]) {
          const endValue = finalValues[id].value;
          const duration = finalValues[id].duration;
          
          // Запускаем анимацию счетчика
          animateCounter(counter, 0, endValue, duration);
        }
      });
    }
    
    // Функция анимации счетчика с использованием requestAnimationFrame
    function animateCounter(element, start, end, duration) {
      const range = end - start;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime > duration) {
          element.textContent = end;
          // Добавляем эффект пульсации по окончании
          element.classList.add('pulse');
          
          // Убираем класс через некоторое время
          setTimeout(() => {
            element.classList.remove('pulse');
          }, 1500);
          return;
        }
        
        // Рассчитываем текущее значение с эффектом замедления в конце
        const progress = easeOutQuart(elapsedTime / duration);
        const currentValue = Math.floor(start + (range * progress));
        
        element.textContent = currentValue;
        
        requestAnimationFrame(update);
      }
      
      // Функция сглаживания для анимации (quartic ease-out)
      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }
      
      requestAnimationFrame(update);
    }
    
    // Добавляем интерактивность к статистическим карточкам
    statCards.forEach(card => {
      // Плавное наведение и эффект 3D-наклона
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Рассчитываем относительные координаты (от -1 до 1)
        const xPercent = ((x / rect.width) - 0.5) * 2;
        const yPercent = ((y / rect.height) - 0.5) * 2;
        
        // Применяем 3D-эффект наклона (не более 5 градусов)
        const tiltX = yPercent * -5; // Инвертируем ось Y
        const tiltY = xPercent * 5;
        
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.03)`;
        
        // Перемещаем иконку в направлении курсора (магнитный эффект)
        const icon = this.querySelector('.stat-icon');
        if (icon) {
          const magnetStrength = 10; // сила магнитного эффекта
          icon.style.transform = `translate(${xPercent * magnetStrength}px, ${yPercent * magnetStrength}px)`;
        }
        
        // Добавляем эффект светового блика
        const glare = this.querySelector('.glare') || document.createElement('div');
        if (!glare.classList.contains('glare')) {
          glare.className = 'glare';
          glare.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 0;
            border-radius: var(--radius-xl);
          `;
          this.appendChild(glare);
        }
        
        glare.style.opacity = '0.15';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.8) 0%, transparent 50%)`;
      });
      
      // Возвращаем карточку в исходное положение
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        
        const icon = this.querySelector('.stat-icon');
        if (icon) {
          icon.style.transform = '';
        }
        
        const glare = this.querySelector('.glare');
        if (glare) {
          glare.style.opacity = '0';
        }
      });
      
      // Эффект нажатия на карточку
      card.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      card.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-10px) scale(1.03)';
      });
      
      // Пересчет значений при нажатии на карточку
      card.addEventListener('click', function() {
        const counter = this.querySelector('.stat-number');
        if (counter && counter.id && finalValues[counter.id]) {
          // Добавляем эффект пульсации
          counter.classList.add('pulse');
          
          // Запускаем новую анимацию счетчика
          const endValue = finalValues[counter.id].value;
          const duration = finalValues[counter.id].duration / 2; // быстрее при клике
          
          // Начинаем с небольшого значения для эффекта
          animateCounter(counter, Math.floor(endValue * 0.7), endValue, duration);
          
          // Убираем класс пульсации через некоторое время
          setTimeout(() => {
            counter.classList.remove('pulse');
          }, 1500);
        }
        
        // Анимация иконки
        const icon = this.querySelector('.stat-icon');
        if (icon) {
          icon.style.animation = 'rotate 1s linear';
          setTimeout(() => {
            icon.style.animation = '';
          }, 1000);
        }
      });
    });
    
    // Создаем эффект плавающих цифр на фоне
    createFloatingNumbers();
    
    function createFloatingNumbers() {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      
      for (let i = 0; i < 20; i++) {
        const numberEl = document.createElement('div');
        const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        
        numberEl.className = 'floating-number';
        numberEl.textContent = randomNumber;
        
        const size = Math.random() * 30 + 10;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.1 + 0.02;
        const duration = Math.random() * 40 + 30;
        const delay = Math.random() * 10;
        
        numberEl.style.cssText = `
          position: absolute;
          font-size: ${size}px;
          color: var(--color-orange-primary);
          opacity: ${opacity};
          left: ${posX}%;
          top: ${posY}%;
          z-index: -1;
          pointer-events: none;
          font-family: var(--font-primary);
          font-weight: var(--font-weight-bold);
          animation: floatNumber ${duration}s linear ${delay}s infinite;
        `;
        
        statisticsSection.appendChild(numberEl);
      }
      
      // Добавляем стиль анимации
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatNumber {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(100px, 100px) rotate(90deg);
          }
          50% {
            transform: translate(0, 200px) rotate(180deg);
          }
          75% {
            transform: translate(-100px, 100px) rotate(270deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Создаем интерактивный эффект волны при клике на секцию
    statisticsSection.addEventListener('click', function(e) {
      if (e.target === this || e.target.classList.contains('container') || e.target.classList.contains('row')) {
        createRippleEffect(e);
      }
    });
    
    function createRippleEffect(e) {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      
      const rect = statisticsSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: rgba(253, 121, 33, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 1s linear forwards;
        pointer-events: none;
        z-index: 0;
      `;
      
      statisticsSection.appendChild(ripple);
      
      // Добавляем стиль анимации
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(50);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Удаляем элемент после анимации
      setTimeout(() => {
        ripple.remove();
        style.remove();
      }, 1000);
    }
  });

 /**
 * ========================================================================
 * СЕКЦИЯ КЛИЕНТОВ - JAVASCRIPT
 * ========================================================================
 * Инициализация карусели и интерактивные эффекты
 */

document.addEventListener('DOMContentLoaded', function() {
  // Выбираем элементы
  const clientsSection = document.querySelector('.clients-section');
  const clientsCarousel = document.querySelector('.clients-carousel');
  const clientLogos = document.querySelectorAll('.client-logo');
  const viewAllBtn = document.querySelector('.clients-section .btn');
  
  // Добавляем декоративные звездочки
  createStars();
  
  // Инициализация Owl Carousel
  if (clientsCarousel) {
    $(clientsCarousel).owlCarousel({
      loop: true,
      margin: 20,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      smartSpeed: 800,
      // Изменяем навигационные стрелки на более безопасные и стилизуемые
      navText: ['<span aria-label="Previous"></span>', '<span aria-label="Next"></span>'],
      responsive: {
        0: {
          items: 2,
          margin: 10,
          dots: true,
          nav: false
        },
        576: {
          items: 3,
          margin: 15
        },
        768: {
          items: 4
        },
        992: {
          items: 5
        }
      },
      onInitialized: carouselInitialized
    });
    
    // Callback после инициализации карусели
    function carouselInitialized() {
      // Анимация логотипов при инициализации
      setTimeout(() => {
        animateLogos();
      }, 500);
      
      // Добавляем кастомный эффект при смене слайдов
      $(clientsCarousel).on('changed.owl.carousel', function(event) {
        const currentItems = $(event.target).find('.owl-item.active').find('.client-logo');
        currentItems.addClass('item-changed');
        
        setTimeout(() => {
          currentItems.removeClass('item-changed');
        }, 1000);
      });
      
      // Добавляем стиль для эффекта смены
      const style = document.createElement('style');
      style.textContent = `
        .client-logo.item-changed {
          animation: logoChange 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        @keyframes logoChange {
          0% {
            transform: translateY(0.625rem);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Анимация при прокрутке страницы
  window.addEventListener('scroll', function() {
    const sectionPosition = clientsSection.getBoundingClientRect();
    
    // Если секция в зоне видимости
    if (sectionPosition.top < window.innerHeight * 0.8 && sectionPosition.bottom > 0) {
      // Анимируем логотипы
      animateLogos();
      
      // Анимируем кнопку
      if (viewAllBtn) {
        viewAllBtn.classList.add('animate');
      }
      
      // Удаляем обработчик после срабатывания
      window.removeEventListener('scroll', arguments.callee);
    }
  });
  
  // Функция анимации логотипов
  function animateLogos() {
    clientLogos.forEach((logo, index) => {
      setTimeout(() => {
        logo.classList.add('animate');
      }, 150 * index);
    });
  }
  
  // Проверяем положение секции при загрузке страницы
  setTimeout(() => {
    if (clientsSection.getBoundingClientRect().top < window.innerHeight) {
      animateLogos();
      if (viewAllBtn) {
        viewAllBtn.classList.add('animate');
      }
    }
  }, 300);
  
  // Создание декоративных звездочек
  function createStars() {
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Преобразуем пиксели в rem
      const size = Math.random() * 1.25 + 0.625; // 10px-30px в rem (при базовом размере 16px)
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      
      star.style.width = `${size}rem`;
      star.style.height = `${size}rem`;
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;
      
      clientsSection.appendChild(star);
    }
  }
  
  // Добавляем интерактивный эффект при наведении на логотипы
  clientLogos.forEach(logo => {
    logo.addEventListener('mouseenter', function() {
      // Применяем 3D-эффект при наведении
      this.style.transform = 'translateY(-0.625rem) rotateY(5deg)'; // -10px в rem
      
      // Анимируем другие логотипы
      clientLogos.forEach(otherLogo => {
        if (otherLogo !== this) {
          otherLogo.style.opacity = '0.5';
          otherLogo.style.filter = 'blur(0.125rem)'; // 2px в rem
        }
      });
    });
    
    logo.addEventListener('mouseleave', function() {
      // Возвращаем стандартный вид при уходе курсора
      this.style.transform = '';
      
      // Возвращаем стандартный вид для других логотипов
      clientLogos.forEach(otherLogo => {
        if (otherLogo !== this) {
          otherLogo.style.opacity = '';
          otherLogo.style.filter = '';
        }
      });
    });
    
    // Добавляем эффект клика
    logo.addEventListener('click', function() {
      // Эффект пульсации при клике
      this.style.animation = 'logoPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      
      setTimeout(() => {
        this.style.animation = '';
      }, 500);
      
      // Добавляем стиль анимации
      const style = document.createElement('style');
      style.textContent = `
        @keyframes logoPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    });
  });
  
  // Добавляем паузу при наведении на карусель
  if (clientsCarousel) {
    clientsCarousel.addEventListener('mouseenter', function() {
      $(this).trigger('stop.owl.autoplay');
    });
    
    clientsCarousel.addEventListener('mouseleave', function() {
      $(this).trigger('play.owl.autoplay');
    });
  }
  
  // Добавляем интерактивность кнопке "Все клиенты" если она есть
  if (viewAllBtn) {
    viewAllBtn.addEventListener('mouseenter', function() {
      // Создаем эффект свечения вокруг кнопки
      const glow = document.createElement('div');
      glow.className = 'button-glow';
      glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(253, 121, 33, 0.2) 0%, transparent 70%);
        border-radius: var(--radius-md);
        opacity: 0;
        transform: scale(1.5);
        z-index: -1;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      
      this.appendChild(glow);
      
      // Анимируем появление свечения
      setTimeout(() => {
        glow.style.opacity = '1';
        glow.style.transform = 'scale(1.8)';
      }, 10);
    });
    
    viewAllBtn.addEventListener('mouseleave', function() {
      const glow = this.querySelector('.button-glow');
      if (glow) {
        glow.style.opacity = '0';
        glow.style.transform = 'scale(1)';
        
        // Удаляем элемент после анимации
        setTimeout(() => {
          glow.remove();
        }, 500);
      }
    });
    
    // Эффект нажатия
    viewAllBtn.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    viewAllBtn.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
  }
  
  // Добавляем эффект "плавающего брендинга" при прокрутке
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Создаем эффект параллакса для фона с использованием rem
    clientsSection.style.backgroundPosition = `0 ${scrollTop * 0.00625}rem`; // 0.1px за каждый пиксель прокрутки
  });
  
  // Создаем легкий эффект параллакса для звезд при движении мыши
  clientsSection.addEventListener('mousemove', function(e) {
    const stars = document.querySelectorAll('.star');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
    
    stars.forEach(star => {
      // Разная скорость движения для разных звезд
      // Преобразуем px в rem для лучшей адаптивности
      const width = parseFloat(star.style.width);
      const speed = width / 30;
      star.style.transform = `translate(${moveX * speed * 0.0625}rem, ${moveY * speed * 0.0625}rem)`;
    });
  });
  
  // Эффект прилипания карусели для тачскринов
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
    
    // Добавляем стили для тачскринов
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
      .touch-device .client-logo {
        -webkit-tap-highlight-color: transparent;
      }
      
      .touch-device .client-logo:active {
        transform: scale(0.95);
      }
      
      .touch-device .owl-dots .owl-dot {
        padding: 0.5rem;
      }
    `;
    document.head.appendChild(touchStyle);
  }
});
  /**
 * ========================================================================
 * СЕКЦИЯ КАРТЫ - JAVASCRIPT
 * ========================================================================
 * Инициализация интерактивной карты и дополнительных элементов управления
 */

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем элементы
    const mapSection = document.querySelector('.map-section');
    const mapContainer = document.querySelector('.map-container');
    
    // Анимация элементов при прокрутке
    window.addEventListener('scroll', function() {
      const sectionPosition = mapSection.getBoundingClientRect();
      
      // Если секция в зоне видимости
      if (sectionPosition.top < window.innerHeight * 0.8 && sectionPosition.bottom > 0) {
        // Анимируем контейнер карты
        if (mapContainer) {
          mapContainer.classList.add('animate');
        }
        
        // Удаляем обработчик после срабатывания
        window.removeEventListener('scroll', arguments.callee);
      }
    });
    
    // Проверяем положение секции при загрузке страницы
    setTimeout(() => {
      if (mapSection.getBoundingClientRect().top < window.innerHeight) {
        if (mapContainer) {
          mapContainer.classList.add('animate');
        }
      }
    }, 300);
    
    // Инициализация карты (используем Yandex Maps, можно заменить на Google Maps)
    let myMap;
    
    // Функция инициализации карты
    function initMap() {
      // Координаты офиса (для Москвы, Ракетный бульвар, 15)
      const officeCoords = [55.845707, 37.637141]; // Примерные координаты, нужно уточнить
      
      // Создаем карту
      myMap = new ymaps.Map('map', {
        center: officeCoords,
        zoom: 16,
        controls: ['smallMapDefaultSet']
      }, {
        searchControlProvider: 'yandex#search'
      });
      
      // Отключаем скролл карты до взаимодействия с ней
      myMap.behaviors.disable('scrollZoom');
      
      // Включаем скролл при клике на карту
      myMap.events.add('click', function() {
        myMap.behaviors.enable('scrollZoom');
      });
      
      // Создаем кастомный маркер для офиса
      const markerLayout = ymaps.templateLayoutFactory.createClass(`
        <div class="custom-marker">
          <div class="marker-pin"></div>
          <div class="marker-pulse"></div>
        </div>
      `);
      
      // Создаем пресет для маркера
      const markerPreset = {
        iconLayout: markerLayout,
        iconShape: {
          type: 'Circle',
          coordinates: [0, 0],
          radius: 20
        }
      };
      
      // Создаем маркер
      const officeMarker = new ymaps.Placemark(officeCoords, {
        // Данные для балуна
        balloonContentHeader: 'ООО "Гигсис"',
        balloonContentBody: `
          <div class="location-popup">
            <h3>Наш центральный офис</h3>
            <p>г. Москва, Ракетный бульвар, д.15, оф.31</p>
            <div class="location-popup-footer">
              <div class="location-popup-contact">
                <a href="tel:88003501160"><i class="fa fa-phone"></i> 8 (800) 350-11-60</a>
              </div>
              <div class="location-popup-actions">
                <a href="https://yandex.ru/maps/?ll=${officeCoords[1]},${officeCoords[0]}&z=17&text=Ракетный%20бульвар%2015" target="_blank" title="Открыть в Яндекс.Картах"><i class="fa fa-external-link"></i></a>
                <a href="https://maps.google.com?q=${officeCoords[0]},${officeCoords[1]}" target="_blank" title="Открыть в Google Maps"><i class="fa fa-map"></i></a>
              </div>
            </div>
          </div>
        `,
        balloonContentFooter: '',
        hintContent: 'ООО "Гигсис" - IT-аутсорсинг'
      }, markerPreset);
      
      // Добавляем маркер на карту
      myMap.geoObjects.add(officeMarker);
      
      // Открываем балун при загрузке
      setTimeout(() => {
        officeMarker.balloon.open();
      }, 1000);
      
      // Добавляем кастомные элементы управления
      addCustomControls();
      
      // Добавляем эффект параллакса при движении мыши
      addParallaxEffect();
    }
    
    // Добавляем кастомные элементы управления на карту
    function addCustomControls() {
      // Создаем элемент управления масштабированием
      const zoomControlsHtml = `
        <div class="zoom-controls">
          <div class="zoom-button zoom-in" title="Приблизить"><i class="fa fa-plus"></i></div>
          <div class="zoom-button zoom-out" title="Отдалить"><i class="fa fa-minus"></i></div>
        </div>
      `;
      
      // Создаем кнопку для определения местоположения
      const myLocationHtml = `
        <div class="my-location-button" title="Мое местоположение"><i class="fa fa-location-arrow"></i></div>
      `;
      
      // Создаем декоративный компас
      const compassHtml = `
        <div class="map-compass" title="Компас"></div>
      `;
      
      // Добавляем элементы на страницу
      mapContainer.insertAdjacentHTML('beforeend', zoomControlsHtml);
      mapContainer.insertAdjacentHTML('beforeend', myLocationHtml);
      mapContainer.insertAdjacentHTML('beforeend', compassHtml);
      
      // Добавляем обработчики событий
      document.querySelector('.zoom-in').addEventListener('click', function() {
        myMap.setZoom(myMap.getZoom() + 1, {duration: 300});
      });
      
      document.querySelector('.zoom-out').addEventListener('click', function() {
        myMap.setZoom(myMap.getZoom() - 1, {duration: 300});
      });
      
      document.querySelector('.my-location-button').addEventListener('click', function() {
        this.classList.add('active');
        
        // Определяем местоположение пользователя
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            // Успешное определение
            (position) => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              
              // Создаем маркер пользователя
              const userMarker = new ymaps.Placemark(userCoords, {
                hintContent: 'Вы здесь'
              }, {
                preset: 'islands#blueCircleDotIcon'
              });
              
              // Добавляем маркер на карту
              myMap.geoObjects.add(userMarker);
              
              // Показываем маршрут от пользователя до офиса
              const multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: [
                  userCoords,
                  [55.845707, 37.637141] // Координаты офиса
                ],
                params: {
                  routingMode: 'auto'
                }
              }, {
                wayPointStartIconLayout: "default#image",
                wayPointStartIconImageHref: "",  // Пустая строка, чтобы скрыть стандартную иконку
                routeActiveStrokeWidth: 5,
                routeActiveStrokeColor: "#fd7921",
                routeActiveStrokeOpacity: 0.7
              });
              
              myMap.geoObjects.add(multiRoute);
              
              // Устанавливаем центр и масштаб для отображения всего маршрута
              myMap.setBounds(multiRoute.getBounds(), {
                checkZoomRange: true,
                duration: 500
              });
              
              // Убираем класс active после выполнения
              setTimeout(() => {
                this.classList.remove('active');
              }, 500);
            },
            // Ошибка определения
            (error) => {
              console.error('Ошибка определения местоположения:', error);
              this.classList.remove('active');
              
              // Сообщаем пользователю об ошибке
              alert('Не удалось определить ваше местоположение. Проверьте настройки браузера.');
            }
          );
        } else {
          alert('Ваш браузер не поддерживает определение местоположения.');
          this.classList.remove('active');
        }
      });
      
      // Анимация компаса
      document.querySelector('.map-compass').addEventListener('click', function() {
        // Поворачиваем компас
        this.querySelector('::before') && (this.querySelector('::before').style.transform = 'rotate(720deg)');
        
        // Возвращаем карту к исходным координатам и масштабу
        myMap.setCenter([55.845707, 37.637141], 16, {
          duration: 500
        });
      });
    }
    
    // Добавление эффекта параллакса при движении мыши
    function addParallaxEffect() {
      mapContainer.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x позиция внутри элемента
        const y = e.clientY - rect.top; // y позиция внутри элемента
        
        // Рассчитываем проценты от центра
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 50; // Делим на 50 для уменьшения эффекта
        const moveY = (y - centerY) / 50;
        
        
      });
    }
    
    // Загружаем Yandex Maps API
    if (document.getElementById('map')) {
      // Проверяем, загружен ли уже API
      if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
      } else {
        // Создаем скрипт для загрузки API
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ВАШ_API_КЛЮЧ&lang=ru_RU';
        script.async = true;
        script.onload = function() {
          ymaps.ready(initMap);
        };
        document.head.appendChild(script);
      }
    }
    
    // Анимируем секцию с картой при загрузке, если она видима
    if (mapContainer && mapContainer.getBoundingClientRect().top < window.innerHeight) {
      mapContainer.classList.add('animate');
    }
    
    // Добавляем плавное появление контента при прокрутке
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Наблюдаем за контейнером карты
    if (mapContainer) {
      observer.observe(mapContainer);
    }
    
    // Эффект параллакса для фона секции
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      mapSection.style.backgroundPosition = `0 ${scrollTop * 0.05}px`;
    });
  });

  /**
 * ========================================================================
 * СЕКЦИЯ КОНТАКТОВ - JAVASCRIPT
 * ========================================================================
 * Интерактивные эффекты, валидация и отправка формы
 */

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем элементы
    const contactSection = document.querySelector('.contact-section');
    const formContainer = document.querySelector('.contact-form-container');
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.form-field input, .form-field textarea');
    const phoneInput = document.querySelector('.tel-input');
    const submitButton = document.querySelector('.contact-form .btn');
    const recaptchaError = document.getElementById('recaptchaError');
    
    // Анимация элементов при прокрутке
    window.addEventListener('scroll', function() {
      const sectionPosition = contactSection.getBoundingClientRect();
      
      // Если секция в зоне видимости
      if (sectionPosition.top < window.innerHeight * 0.8 && sectionPosition.bottom > 0) {
        // Анимируем контейнер формы
        if (formContainer) {
          formContainer.classList.add('animate');
        }
        
        // Удаляем обработчик после срабатывания
        window.removeEventListener('scroll', arguments.callee);
      }
    });
    
    // Проверяем положение секции при загрузке страницы
    setTimeout(() => {
      if (contactSection.getBoundingClientRect().top < window.innerHeight) {
        if (formContainer) {
          formContainer.classList.add('animate');
        }
      }
    }, 300);
    
    // Маска для телефона
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        // Удаляем все нецифровые символы
        let value = this.value.replace(/\D/g, '');
        
        // Форматируем номер
        if (value.length > 0) {
          // Начинаем с +7
          if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
          }
          
          // Добавляем скобки и дефисы
          if (value.length > 0) {
            value = '+7 (' + value.substring(0, 3);
          }
          if (value.length > 4) {
            value += ') ' + value.substring(3, 6);
          }
          if (value.length > 8) {
            value += '-' + value.substring(6, 8);
          }
          if (value.length > 10) {
            value += '-' + value.substring(8, 10);
          }
        }
        
        this.value = value;
      });
      
      // Форматирование при фокусе
      phoneInput.addEventListener('focus', function() {
        if (!this.value) {
          this.value = '+7 (';
        }
      });
      
      // Проверка при потере фокуса
      phoneInput.addEventListener('blur', function() {
        if (this.value === '+7 (') {
          this.value = '';
        }
      });
    }
    
    // Добавляем интерактивные эффекты для инпутов
    formInputs.forEach(input => {
      // Анимация иконки при фокусе
      input.addEventListener('focus', function() {
        const icon = this.nextElementSibling;
        icon.classList.add('active');
        
        // Добавляем эффект свечения для контейнера
        formContainer.classList.add('glow');
      });
      
      input.addEventListener('blur', function() {
        const icon = this.nextElementSibling;
        icon.classList.remove('active');
        
        // Убираем эффект свечения
        formContainer.classList.remove('glow');
        
        // Проверяем валидность поля
        validateField(this);
      });
      
      // Анимация ввода
      input.addEventListener('input', function() {
        if (this.value.length > 0) {
          this.classList.add('has-text');
        } else {
          this.classList.remove('has-text');
        }
      });
    });
    
    // Добавляем стили для анимации икнок и свечения
    const style = document.createElement('style');
    style.textContent = `
      .form-field i.active {
        color: var(--color-orange-primary) !important;
        transform: translateY(-50%) scale(1.2) !important;
      }
      
      .form-field textarea + i.active {
        transform: scale(1.2) !important;
      }
      
      .contact-form-container.glow {
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.3),
          0 5px 15px rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(253, 121, 33, 0.2) inset;
      }
      
      .form-field input.invalid,
      .form-field textarea.invalid {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.2) !important;
      }
      
      .form-field input.invalid + i,
      .form-field textarea.invalid + i {
        color: var(--color-error) !important;
      }
      
      .form-field .error-message {
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: 5px;
        display: block;
        animation: errorAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      @keyframes errorAppear {
        0% {
          opacity: 0;
          transform: translateY(-10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Функция валидации поля
    function validateField(field) {
      // Удаляем предыдущее сообщение об ошибке
      const existingError = field.parentElement.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Сбрасываем стили ошибки
      field.classList.remove('invalid');
      
      // Проверяем обязательные поля
      if (field.required && field.value.trim() === '') {
        showFieldError(field, 'Это поле обязательно для заполнения');
        return false;
      }
      
      // Проверяем email
      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          showFieldError(field, 'Введите корректный e-mail адрес');
          return false;
        }
      }
      
      // Проверяем телефон
      if (field.classList.contains('tel-input') && field.value) {
        // Должно быть не менее 15 символов для формата +7 (XXX) XXX-XX-XX
        if (field.value.length < 15) {
          showFieldError(field, 'Введите полный номер телефона');
          return false;
        }
      }
      
      return true;
    }
    
    // Функция для отображения ошибки поля
    function showFieldError(field, message) {
      field.classList.add('invalid');
      
      const errorMessage = document.createElement('span');
      errorMessage.className = 'error-message';
      errorMessage.textContent = message;
      
      field.parentElement.appendChild(errorMessage);
    }
    
    // Обработка отправки формы
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидируем все поля
        let isValid = true;
        
        formInputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
          }
        });
        
        // Проверяем reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
          const recaptchaResponse = grecaptcha.getResponse();
          
          if (!recaptchaResponse.length) {
            recaptchaError.textContent = 'Пожалуйста, подтвердите, что вы не робот';
            recaptchaError.classList.add('show');
            isValid = false;
          } else {
            recaptchaError.textContent = '';
            recaptchaError.classList.remove('show');
          }
        }
        
        // Если форма валидна, отправляем
        if (isValid) {
          // Добавляем класс submitting для анимации
          contactForm.classList.add('submitting');
          
          // Заменяем иконку на кнопке отправки во время отправки
          const buttonIcon = submitButton.querySelector('i');
          buttonIcon.className = 'fa fa-spinner';
          
          // Отправляем форму через AJAX
          const formData = new FormData(contactForm);
          
          fetch(contactForm.getAttribute('action'), {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Ошибка сети');
            }
            return response.text();
          })
          .then(data => {
            // Анимируем успешную отправку
            contactForm.classList.remove('submitting');
            contactForm.classList.add('success-state');
            
            // Сбрасываем форму через некоторое время
            setTimeout(() => {
              contactForm.reset();
              contactForm.classList.remove('success-state');
              buttonIcon.className = 'fa fa-paper-plane';
              
              // Сбрасываем reCAPTCHA
              if (typeof grecaptcha !== 'undefined') {
                grecaptcha.reset();
              }
            }, 3000);
          })
          .catch(error => {
            console.error('Ошибка при отправке формы:', error);
            
            // Показываем ошибку
            contactForm.classList.remove('submitting');
            recaptchaError.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте снова.';
            recaptchaError.classList.add('show');
            
            // Возвращаем иконку
            buttonIcon.className = 'fa fa-paper-plane';
          });
        }
      });
    }
    
    // Эффект параллакса для фона
    contactSection.addEventListener('mousemove', function(e) {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
      
      contactSection.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });
    
    // Добавляем эффект волн
    createWaveEffect();
    
    function createWaveEffect() {
      const waves = document.createElement('div');
      waves.className = 'contact-waves';
      waves.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10%;
        z-index: 0;
        opacity: 0.5;
      `;
      
      // Создаем три волны
      for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = `wave wave-${i + 1}`;
        wave.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: ${80 + i * 20}%;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(253, 121, 33, ${0.05 - i * 0.01})" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
          background-repeat: repeat-x;
          background-position: 0 bottom;
          background-size: 50% auto;
          animation: wave-move ${10 + i * 5}s linear infinite;
          animation-delay: ${i * 2}s;
        `;
        waves.appendChild(wave);
      }
      
      contactSection.appendChild(waves);
      
      // Добавляем стиль для анимации
      const waveStyle = document.createElement('style');
      waveStyle.textContent = `
        @keyframes wave-move {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `;
      document.head.appendChild(waveStyle);
    }
    
    // Добавляем плавное появление при скролле
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Наблюдаем за контейнером формы
    if (formContainer) {
      observer.observe(formContainer);
    }
    
    // Анимированный фон с частицами
    createParticles();
    
    function createParticles() {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles-container';
      particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      `;
      
      // Создаем частицы
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('span');
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 30 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
          position: absolute;
          top: ${posY}%;
          left: ${posX}%;
          width: ${size}px;
          height: ${size}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
          border-radius: 50%;
          animation: float-particle ${duration}s linear ${delay}s infinite;
          box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.3);
        `;
        
        particlesContainer.appendChild(particle);
      }
      
      contactSection.appendChild(particlesContainer);
      
      // Добавляем стиль для анимации
      const particleStyle = document.createElement('style');
      particleStyle.textContent = `
        @keyframes float-particle {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 100 + 50}px, ${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 100 + 50}px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(particleStyle);
    }
  });

  /**
 * ========================================================================
 * ФУТЕР САЙТА - JAVASCRIPT
 * ========================================================================
 * Интерактивные эффекты и функциональность
 */

document.addEventListener('DOMContentLoaded', function() {
    // Выбираем элементы
    const siteFooter = document.querySelector('.site-footer');
    const footerWidgets = document.querySelectorAll('.footer-widget');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Создаем волны для верхней части футера
    createFooterWaves();
    
    // Добавляем эффект частиц
    createFooterParticles();
    
    // Анимация при прокрутке
    function handleScroll() {
      // Показываем/скрываем кнопку "Наверх"
      if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
      
      // Анимируем виджеты при достижении футера
      const footerPosition = siteFooter.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (footerPosition < windowHeight * 0.9) {
        footerWidgets.forEach(widget => {
          widget.classList.add('animate');
        });
      }
    }
    
    // Вызываем функцию при прокрутке
    window.addEventListener('scroll', handleScroll);
    
    // Проверяем положение при загрузке страницы
    setTimeout(handleScroll, 300);
    
    // Функция прокрутки наверх
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Плавная прокрутка вверх
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Создание волн для верхней части футера
    function createFooterWaves() {
      const footerWaves = document.createElement('div');
      footerWaves.className = 'footer-waves';
      
      // Создаем три волны с разными свойствами
      for (let i = 1; i <= 3; i++) {
        const wave = document.createElement('div');
        wave.className = `footer-wave footer-wave-${i}`;
        footerWaves.appendChild(wave);
      }
      
      // Добавляем волны в футер
      siteFooter.insertBefore(footerWaves, siteFooter.firstChild);
    }
    
    // Создание частиц для футера
    function createFooterParticles() {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'footer-particles';
      particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;
      `;
      
      // Добавляем частицы
      for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
      }
      
      siteFooter.appendChild(particlesContainer);
    }
    
    function createParticle(container) {
      const particle = document.createElement('span');
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      
      particle.style.cssText = `
        position: absolute;
        top: ${y}%;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${Math.random() > 0.5 ? 'rgba(253, 121, 33, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 50%;
        filter: blur(${size > 3 ? 2 : 1}px);
        animation: floatParticle ${duration}s ease-in-out ${delay}s infinite alternate;
      `;
      
      container.appendChild(particle);
    }
    
    // Добавляем стиль для анимации частиц
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
      @keyframes floatParticle {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 50 + 20}px, ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 50 + 20}px);
        }
      }
    `;
    document.head.appendChild(particleStyle);
    
    // Добавляем интерактивность для социальных иконок
    const socialLinks = document.querySelectorAll('.footer-social a');
    socialLinks.forEach(link => {
      // Эффект пульсации при наведении
      link.addEventListener('mouseenter', function() {
        this.style.animation = 'socialPulse 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.animation = '';
      });
      
      // Добавляем стиль для пульсации
      const socialPulseStyle = document.createElement('style');
      socialPulseStyle.textContent = `
        @keyframes socialPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `;
      document.head.appendChild(socialPulseStyle);
    });
    
    // Добавляем эффект наведения для логотипа
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
      footerLogo.addEventListener('mouseenter', function() {
        // Создаем эффект свечения
        const glowEffect = document.createElement('div');
        glowEffect.className = 'logo-glow';
        glowEffect.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(253, 121, 33, 0.3) 0%, transparent 70%);
          border-radius: var(--radius-full);
          filter: blur(10px);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        
        this.style.position = 'relative';
        this.appendChild(glowEffect);
        
        setTimeout(() => {
          glowEffect.style.opacity = '1';
        }, 10);
      });
      
      footerLogo.addEventListener('mouseleave', function() {
        const glowEffect = this.querySelector('.logo-glow');
        if (glowEffect) {
          glowEffect.style.opacity = '0';
          
          setTimeout(() => {
            glowEffect.remove();
          }, 400);
        }
      });
    }
    
    // Эффект при клике на контакты
    const contactLinks = document.querySelectorAll('.contact-list li a');
    contactLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Создаем эффект пульсации
        const pulseEffect = document.createElement('div');
        pulseEffect.className = 'contact-pulse';
        pulseEffect.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 5px;
          height: 5px;
          background: var(--color-orange-primary);
          border-radius: 50%;
          z-index: -1;
          animation: contactPulseEffect 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        `;
        
        this.style.position = 'relative';
        this.appendChild(pulseEffect);
        
        // Добавляем стиль для анимации
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
          @keyframes contactPulseEffect {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(20);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(pulseStyle);
        
        // Удаляем элемент после анимации
        setTimeout(() => {
          pulseEffect.remove();
          pulseStyle.remove();
        }, 600);
      });
    });
    
    // Добавляем эффект параллакса для фона футера
    siteFooter.addEventListener('mousemove', function(e) {
      // Вычисляем положение курсора относительно центра
      const rect = this.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Вычисляем смещение
      const moveX = (x - centerX) / 30;
      const moveY = (y - centerY) / 30;
      
      // Применяем эффект параллакса к фоновым элементам
      const footerBg = document.querySelectorAll('.footer-particles span');
      footerBg.forEach(particle => {
        // Разная скорость для разных частиц
        const speedFactor = parseFloat(particle.style.width) / 2;
        particle.style.transform = `translate(${moveX * speedFactor}px, ${moveY * speedFactor}px)`;
      });
    });
    
    // Инициализируем обработку тачскринов
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
      
      // Специальные стили для тачскринов
      const touchStyle = document.createElement('style');
      touchStyle.textContent = `
        .touch-device .footer-widget ul li {
          padding-left: var(--spacing-3);
        }
        
        .touch-device .back-to-top {
          width: 55px;
          height: 55px;
        }
      `;
      document.head.appendChild(touchStyle);
    }
  });
// Простой и надежный JavaScript для управления модальными окнами
document.addEventListener('DOMContentLoaded', function() {
  // Добавляем обработчики на кнопки, открывающие модальные окна
  var modalTriggers = document.querySelectorAll('.popup-with-form');
  modalTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
          e.preventDefault();
          var modalId = this.getAttribute('href');
          
          // Проверяем, есть ли новая версия модального окна
          if (modalId === '#callback') {
              openSimpleModal('simple-callback');
          } else if (modalId === '#price') {
              // Если нужно, можно добавить и другие модальные окна
              console.log('Модальное окно для цен еще не реализовано в упрощенной версии');
          }
      });
  });
  
  // Закрытие по клику на оверлей
  document.getElementById('simple-modal-overlay').addEventListener('click', function() {
      closeSimpleModal();
  });
  
  // Закрытие по нажатию Escape
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          closeSimpleModal();
      }
  });
  
  // Предотвращение закрытия при клике на контент
  var modalContents = document.querySelectorAll('.simple-modal-content');
  modalContents.forEach(function(content) {
      content.addEventListener('click', function(e) {
          e.stopPropagation();
      });
  });
  
  // Инициализация маски для телефона
  var phoneInputs = document.querySelectorAll('.simple-modal input[type="tel"]');
  phoneInputs.forEach(function(input) {
      input.addEventListener('input', function() {
          var cleaned = this.value.replace(/\D/g, '');
          var formatted = '';
          
          if (cleaned.length > 0) {
              if (cleaned.length <= 1) {
                  formatted = '+7 (';
                  if (cleaned.length === 1) {
                      formatted += cleaned;
                  }
              } else if (cleaned.length <= 4) {
                  formatted = '+7 (' + cleaned.substring(1, cleaned.length);
              } else if (cleaned.length <= 7) {
                  formatted = '+7 (' + cleaned.substring(1, 4) + ') ' + cleaned.substring(4, cleaned.length);
              } else if (cleaned.length <= 9) {
                  formatted = '+7 (' + cleaned.substring(1, 4) + ') ' + cleaned.substring(4, 7) + '-' + cleaned.substring(7, cleaned.length);
              } else {
                  formatted = '+7 (' + cleaned.substring(1, 4) + ') ' + cleaned.substring(4, 7) + '-' + cleaned.substring(7, 9) + '-' + cleaned.substring(9, Math.min(cleaned.length, 11));
              }
              
              this.value = formatted;
          }
      });
  });
});

// Функция для открытия модального окна
function openSimpleModal(modalId) {
  // Блокируем прокрутку
  document.body.style.overflow = 'hidden';
  
  // Показываем оверлей и модальное окно
  document.getElementById('simple-modal-overlay').classList.add('active');
  document.getElementById(modalId).classList.add('active');
  
  console.log('Открыто модальное окно с ID:', modalId);
  
  // Проверяем и логируем поля ввода (для отладки)
  var inputs = document.querySelectorAll('#' + modalId + ' input, #' + modalId + ' textarea');
  console.log('Количество полей ввода:', inputs.length);
  inputs.forEach(function(input, index) {
      console.log('Поле #' + (index + 1) + ':', input.placeholder, 'видимо:', getComputedStyle(input).display !== 'none');
  });
}

// Функция для закрытия модального окна
function closeSimpleModal() {
  // Разблокируем прокрутку
  document.body.style.overflow = '';
  
  // Скрываем все активные модальные окна и оверлей
  document.querySelectorAll('.simple-modal.active').forEach(function(modal) {
      modal.classList.remove('active');
  });
  
  document.getElementById('simple-modal-overlay').classList.remove('active');
  
  console.log('Модальные окна закрыты');
}

// Функция для отправки формы
function submitSimpleForm(form) {
  console.log('Отправка формы...');
  
  // Имитация отправки формы
  setTimeout(function() {
      // Закрываем текущее модальное окно
      closeSimpleModal();
      
      // Показываем модальное окно успеха
      openSimpleModal('simple-success');
      
      // Сбрасываем форму
      form.reset();
      
      console.log('Форма успешно отправлена!');
  }, 1000);
  
  // Здесь можно добавить реальную отправку данных через AJAX
  /*
  var formData = new FormData(form);
  
  fetch('your-endpoint-url', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
      closeSimpleModal();
      openSimpleModal('simple-success');
      form.reset();
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
  });
  */
}

// Функция для отладки полей ввода
function debugSimpleInputs() {
  var inputs = document.querySelectorAll('.simple-modal input, .simple-modal textarea');
  console.log('===== ОТЛАДКА ПОЛЕЙ ВВОДА =====');
  console.log('Всего полей:', inputs.length);
  
  inputs.forEach(function(input, index) {
      console.log('Поле #' + (index + 1) + ':', input.name);
      console.log('- Тип:', input.type);
      console.log('- Видимость:', getComputedStyle(input).visibility);
      console.log('- Отображение:', getComputedStyle(input).display);
      console.log('- Прозрачность:', getComputedStyle(input).opacity);
      console.log('- Z-index:', getComputedStyle(input).zIndex);
      console.log('- Ширина:', getComputedStyle(input).width);
      console.log('- Высота:', getComputedStyle(input).height);
      console.log('- Позиция:', getComputedStyle(input).position);
      console.log('-------');
  });
}

// Добавление модифицированного инициализатора попапов вместо стандартного
// (используется, если на сайте есть jQuery и Magnific Popup)
function initSimpleModals() {
  if (window.jQuery && jQuery.magnificPopup) {
      // Переопределяем поведение Magnific Popup для классов popup-with-form
      jQuery('.popup-with-form').magnificPopup({
          type: 'inline',
          preloader: false,
          focus: '#name',
          callbacks: {
              beforeOpen: function() {
                  // Вместо открытия стандартного попапа, открываем наш упрощенный
                  var modalId = this.st.el.attr('href').replace('#', '');
                  if (modalId === 'callback') {
                      openSimpleModal('simple-callback');
                  } else if (modalId === 'price') {
                      // Можно добавить открытие других модальных окон
                  }
                  
                  // Отменяем стандартное открытие
                  return false;
              }
          }
      });
      
      console.log('Инициализирован перехватчик Magnific Popup');
  } else {
      // Если jQuery и Magnific Popup не найдены, используем стандартные обработчики
      console.log('jQuery или Magnific Popup не найдены, используем стандартные обработчики');
  }
}

// Запускаем инициализацию после загрузки страницы
window.addEventListener('load', function() {
  console.log('Страница загружена, инициализация модальных окон...');
  
  // Вызываем инициализацию модальных окон
  initSimpleModals();
  
  // Добавляем отладочную кнопку (только для разработки)
  /*
  var debugButton = document.createElement('button');
  debugButton.textContent = 'Отладка полей ввода';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '20px';
  debugButton.style.right = '20px';
  debugButton.style.zIndex = '10000';
  debugButton.style.padding = '10px 15px';
  debugButton.style.backgroundColor = '#ff5722';
  debugButton.style.color = 'white';
  debugButton.style.border = 'none';
  debugButton.style.borderRadius = '4px';
  debugButton.style.cursor = 'pointer';
  
  debugButton.addEventListener('click', debugSimpleInputs);
  document.body.appendChild(debugButton);
  */
});

// Скрипт для анимации числовых счетчиков
document.addEventListener('DOMContentLoaded', function() {
  // Установка начальных значений для счетчиков
  const num1 = document.getElementById('num1');
  const num2 = document.getElementById('num2');
  const num3 = document.getElementById('num3');
  const num4 = document.getElementById('num4');
  
  if (num1) num1.innerHTML = '0';
  if (num2) num2.innerHTML = '0';
  if (num3) num3.innerHTML = '0';
  if (num4) num4.innerHTML = '0';
  
  // Целевые значения
  const targetNum1 = 10; // лет успешной работы
  const targetNum2 = 35; // опытных сотрудников в штате
  const targetNum3 = 150; // довольных клиентов
  const targetNum4 = 2500; // компьютеров на обслуживании
  
  // Функция для запуска анимации счетчика
  function animateCounter(element, target, duration, prefix = '', suffix = '') {
    if (!element) return;
    
    let start = 0;
    const increment = target / (duration / 16); // 16 ms = примерно 60fps
    
    const timer = setInterval(() => {
      start += increment;
      
      // Форматирование чисел для лучшего отображения
      const formattedValue = Math.floor(start).toLocaleString('ru-RU');
      element.innerHTML = prefix + formattedValue + suffix;
      
      if (start >= target) {
        element.innerHTML = prefix + target.toLocaleString('ru-RU') + suffix;
        clearInterval(timer);
      }
    }, 16);
  }
  
  // Функция для проверки видимости элемента
  function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Запуск анимации при прокрутке до элемента
  let animated = false;
  
  function checkScroll() {
    if (!animated && isElementInViewport(document.getElementById('digits'))) {
      animated = true;
      
      // Запускаем анимацию счетчиков с разной длительностью
      animateCounter(num1, targetNum1, 1500); // 1.5 секунды
      animateCounter(num2, targetNum2, 2000); 
      animateCounter(num3, targetNum3, 2500);
      animateCounter(num4, targetNum4, 3000);
    }
  }
  
  // Проверка при загрузке и при скролле
  checkScroll();
  window.addEventListener('scroll', checkScroll);
});

// Валидация формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form1');
  
  if (form) {
    // Маска для телефона
    const phoneInput = form.querySelector('input[name="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
          if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
          }
          
          let formattedValue = '+7';
          
          if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, 3);
          }
          
          if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, 6);
          }
          
          if (value.length > 6) {
            formattedValue += '-' + value.substring(6, 8);
          }
          
          if (value.length > 8) {
            formattedValue += '-' + value.substring(8, 10);
          }
          
          e.target.value = formattedValue;
        }
      });
    }
    
    // Валидация формы перед отправкой
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const name = form.querySelector('input[name="named"]');
      const email = form.querySelector('input[name="mail"]');
      const phone = form.querySelector('input[name="tel"]');
      const checkbox = form.querySelector('#checkbox-1');
      
      // Простая проверка email
      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          email.style.borderColor = 'red';
          isValid = false;
        } else {
          email.style.borderColor = '';
        }
      }
      
      // Проверка телефона
      if (phone && phone.value) {
        if (phone.value.replace(/\D/g, '').length < 11) {
          phone.style.borderColor = 'red';
          isValid = false;
        } else {
          phone.style.borderColor = '';
        }
      }
      
      // Проверка согласия
      if (checkbox && !checkbox.checked) {
        const label = document.querySelector('label[for="checkbox-1"]');
        if (label) label.style.color = 'red';
        isValid = false;
      } else {
        const label = document.querySelector('label[for="checkbox-1"]');
        if (label) label.style.color = '';
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
});

// Автоматическое определение внутренних страниц
document.addEventListener('DOMContentLoaded', function() {
  // Если страница не главная, добавляем класс inner-page
  if(window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    document.body.classList.add('inner-page');
  }
  
  // Обработка прокрутки с использованием requestAnimationFrame для оптимизации
  let ticking = false;
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.header-modern');
  const scrollThreshold = 50;
  
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    
    if(!ticking) {
      window.requestAnimationFrame(function() {
        if(lastScrollY > scrollThreshold) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      
      ticking = true;
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Проверка наличия хедера
  const header = document.querySelector('.header-modern');
  if (!header) return;
  
  // Установка высоты боди для предотвращения скачков контента
  const headerHeight = getComputedStyle(header).height;
  document.body.style.paddingTop = headerHeight;
  
  // Обработка прокрутки
  let scrolled = false;
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 50 && !scrolled) {
      header.classList.add('scrolled');
      scrolled = true;
    } else if (currentScroll <= 50 && scrolled) {
      header.classList.remove('scrolled');
      scrolled = false;
    }
  });
  
  // Обработка мобильного меню
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      document.body.classList.toggle('mobile-menu-active');
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Переключение категорий в мега-меню
  const menuCategories = document.querySelectorAll('.menu-category');
  const menuPanels = document.querySelectorAll('.menu-panel');
  
  menuCategories.forEach(category => {
    category.addEventListener('click', function() {
      const targetPanel = this.getAttribute('data-category');
      
      // Активация кнопки
      menuCategories.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Активация панели
      menuPanels.forEach(panel => {
        if (panel.getAttribute('data-panel') === targetPanel) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
  
  // Открытие/закрытие мега-меню
  const servicesToggle = document.querySelector('.services-toggle');
  const megaMenu = document.querySelector('.mega-menu');
  const megaMenuClose = document.querySelector('.mega-menu-close');
  
  servicesToggle.addEventListener('click', function(e) {
    e.preventDefault();
    megaMenu.classList.toggle('active');
    
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
  });
  
  megaMenuClose.addEventListener('click', function() {
    megaMenu.classList.remove('active');
    servicesToggle.setAttribute('aria-expanded', 'false');
  });
  
  // Закрытие меню при клике вне
  document.addEventListener('click', function(e) {
    const isClickInside = megaMenu.contains(e.target) || servicesToggle.contains(e.target);
    
    if (!isClickInside && megaMenu.classList.contains('active')) {
      megaMenu.classList.remove('active');
      servicesToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  /* Инициализация IntersectionObserver для анимаций при скролле */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        /* Анимация счетчиков при появлении в поле зрения */
        if (entry.target.classList.contains('metric-value')) {
          const id = entry.target.id;
          const finalValue = parseInt(entry.target.textContent);
          animateCounter(id, 0, finalValue, 2000);
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px'
  });
  
  /* Наблюдение за элементами для анимации */
  document.querySelectorAll('.metric-value').forEach(el => {
    observer.observe(el);
  });
  
  /* 3D-эффект для карточек услуг */
  document.querySelectorAll('.service-card, .metric-card').forEach(card => {
    /* Создаем элемент блика */
    const glare = document.createElement('div');
    glare.className = 'card-glare';
    card.appendChild(glare);
    
    /* Эффект наклона при движении мыши */
    card.addEventListener('mousemove', function(e) {
      const cardRect = this.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      /* Вычисляем позицию курсора относительно центра */
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      /* Максимальный угол наклона */
      const maxRotate = 10;
      
      /* Вычисляем углы наклона */
      const rotateY = (mouseX / (cardRect.width / 2)) * maxRotate;
      const rotateX = -((mouseY / (cardRect.height / 2)) * maxRotate);
      
      /* Применяем 3D-трансформацию */
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      
      /* Эффект блика */
      const glareX = (e.clientX - cardRect.left) / cardRect.width * 100;
      const glareY = (e.clientY - cardRect.top) / cardRect.height * 100;
      
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 70%)`;
      glare.style.opacity = '1';
    });
    
    /* Возвращаем карточку в исходное положение при уходе курсора */
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      glare.style.opacity = '0';
    });
  });
  
  /* Функция анимации счетчиков */
  function animateCounter(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    let startTime = null;
    
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime > duration) {
        element.textContent = end;
        return;
      }
      
      const progress = elapsedTime / duration;
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(start + (end - start) * easedProgress);
      
      element.textContent = currentValue;
      element.classList.add('animate-count');
      
      requestAnimationFrame(animation);
    }
    
    /* Функция плавного замедления для более естественной анимации */
    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }
    
    requestAnimationFrame(animation);
  }
});

/**
 * Улучшенные интерактивные эффекты для страницы "О компании"
 * Этот скрипт добавляет 3D-эффекты, анимации при прокрутке
 * и анимированные счетчики с оптимизацией производительности
 */

document.addEventListener('DOMContentLoaded', function() {
  // ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
  
  // Создаем наблюдатель пересечений для отслеживания элементов в поле зрения
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Добавляем класс для запуска CSS-анимаций
        entry.target.classList.add('visible');
        
        // Если это счетчик, запускаем анимацию чисел
        if (entry.target.classList.contains('metric-value')) {
          const id = entry.target.id;
          const finalValue = parseInt(entry.target.textContent);
          animateCounter(id, 0, finalValue, 2000);
        }
      }
    });
  }, {
    threshold: 0.15, // Элемент должен быть видимым минимум на 15%
    rootMargin: '-50px' // Срабатывает немного раньше, чем элемент полностью войдет в область видимости
  });
  
  // Добавляем все анимируемые элементы в наблюдатель
  const animatedElements = document.querySelectorAll(`
    .about-company h1, 
    .company-intro, 
    .mission-block, 
    .about-company h2,
    .service-card, 
    .principle-card,
    .section-title,
    .metric-card,
    .metric-value,
    .metric-label
  `);
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  
  // ===== 3D-ЭФФЕКТЫ ДЛЯ КАРТОЧЕК =====
  
  // Функция инициализации 3D-эффектов
  function init3DEffects() {
    // Проверяем, поддерживает ли устройство наведение (не мобильное)
    const hasHoverSupport = window.matchMedia('(hover: hover)').matches;
    
    // Проверяем, не предпочитает ли пользователь уменьшенное движение
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Если устройство не поддерживает наведение или пользователь предпочитает уменьшенное движение,
    // не добавляем 3D-эффекты
    if (!hasHoverSupport || prefersReducedMotion) return;
    
    // Все карточки, к которым применяем 3D-эффекты
    const cards = document.querySelectorAll('.service-card, .metric-card');
    
    cards.forEach(card => {
      // Создаем эффект блика для каждой карточки
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
      
      // Обработчик движения мыши над карточкой
      card.addEventListener('mousemove', function(e) {
        // Получаем размеры и положение карточки
        const cardRect = this.getBoundingClientRect();
        
        // Вычисляем координаты центра карточки
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        // Вычисляем положение курсора относительно центра карточки
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        // Вычисляем проценты смещения от центра (от -1 до 1)
        const percentX = mouseX / (cardRect.width / 2);
        const percentY = mouseY / (cardRect.height / 2);
        
        // Максимальный угол наклона (в градусах)
        const maxRotate = 8;
        
        // Вычисляем углы наклона с ограничением
        const rotateY = Math.min(Math.max(percentX * maxRotate, -maxRotate), maxRotate);
        const rotateX = Math.min(Math.max(-percentY * maxRotate, -maxRotate), maxRotate);
        
        // Применяем 3D-трансформацию с плавным переходом
        this.style.transform = `
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(10px)
          scale(1.02)
        `;
        
        // Эффект блика, следующий за курсором
        const glareX = (e.clientX - cardRect.left) / cardRect.width * 100;
        const glareY = (e.clientY - cardRect.top) / cardRect.height * 100;
        
        glare.style.background = `
          radial-gradient(
            circle at ${glareX}% ${glareY}%, 
            rgba(255, 255, 255, 0.25) 0%, 
            transparent 70%
          )
        `;
        glare.style.opacity = '1';
      });
      
      // Плавный возврат карточки в исходное положение при уходе курсора
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        glare.style.opacity = '0';
      });
    });
    
    // Дополнительный эффект наведения для блока миссии
    const missionBlock = document.querySelector('.mission-block');
    if (missionBlock) {
      missionBlock.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = `
          ${getComputedStyle(this).boxShadow},
          0 15px 35px rgba(var(--color-orange-primary-rgb), 0.15)
        `;
      });
      
      missionBlock.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    }
  }
  
  // ===== АНИМИРОВАННЫЕ СЧЕТЧИКИ =====
  
  // Функция анимации счетчика
  function animateCounter(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    let startTime = null;
    
    // Функция для пошаговой анимации
    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      
      // Если время анимации истекло, устанавливаем конечное значение
      if (elapsedTime > duration) {
        element.textContent = end;
        element.classList.add('animation-completed');
        return;
      }
      
      // Вычисляем прогресс и текущее значение с эффектом замедления
      const progress = elapsedTime / duration;
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(start + (end - start) * easedProgress);
      
      // Обновляем текст элемента
      element.textContent = currentValue;
      
      // Продолжаем анимацию
      requestAnimationFrame(animation);
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animation);
  }
  
  // Функция замедления для более естественной анимации
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  
  // ===== ФОНОВЫЕ ЭФФЕКТЫ =====
  
  // Создаем фоновые пузыри для секции метрик
  function createBubbles() {
    const metricsSection = document.querySelector('.company-metrics');
    if (!metricsSection) return;
    
    // Проверяем, не предпочитает ли пользователь уменьшенное движение
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Если пользователь предпочитает уменьшенное движение, не добавляем пузыри
    if (prefersReducedMotion) return;
    
    // Создаем пузыри
    for (let i = 0; i < 3; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Случайные размеры и положение
      const size = Math.floor(Math.random() * 70 + 80); // 80-150px
      const posX = Math.floor(Math.random() * 80 + 10); // 10-90%
      const posY = Math.floor(Math.random() * 60 + 20); // 20-80%
      
      // Применяем стили
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${posX}%`;
      bubble.style.top = `${posY}%`;
      
      // Добавляем случайную задержку для анимации
      bubble.style.animationDelay = `${i * 5}s`;
      
      // Добавляем в секцию
      metricsSection.appendChild(bubble);
    }
  }
  
  // ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
  
  // Определяем, нужно ли упростить анимации для устройств с низкой производительностью
  function shouldSimplifyAnimations() {
    // Проверяем, мобильное ли устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Проверяем, медленное ли соединение
    const isSlowConnection = navigator.connection && 
      (navigator.connection.saveData || 
       navigator.connection.effectiveType.includes('2g') ||
       navigator.connection.effectiveType.includes('slow'));
    
    // Проверяем, не предпочитает ли пользователь упрощенную анимацию
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return isMobile || isSlowConnection || prefersReducedMotion;
  }
  
  // Применяем упрощения для слабых устройств
  function applyPerformanceOptimizations() {
    if (shouldSimplifyAnimations()) {
      // Добавляем класс для упрощенных анимаций
      document.documentElement.classList.add('simplified-animations');
      
      // Отключаем сложные эффекты
      document.querySelectorAll('.about-company::before, .about-company::after, .company-metrics::after, .bubble').forEach(el => {
        if (el) el.style.display = 'none';
      });
    }
  }
  
  // ===== ИНИЦИАЛИЗАЦИЯ =====
  
  // Запускаем инициализацию с небольшой задержкой, чтобы не блокировать рендеринг страницы
  setTimeout(() => {
    // Применяем оптимизации производительности
    applyPerformanceOptimizations();
    
    // Инициализируем 3D-эффекты
    init3DEffects();
    
    // Создаем фоновые пузыри
    createBubbles();
  }, 100);
});

/**
 * Расширенные эффекты для страницы новостей
 */
document.addEventListener('DOMContentLoaded', function() {
  // Анимация появления элементов при прокрутке
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '-20px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Наблюдаем за элементами для анимации при прокрутке
  document.querySelectorAll('.news-item, .news-title').forEach(item => {
    observer.observe(item);
  });
  
  // 3D эффект для карточек новостей при наведении
  const hasHoverSupport = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (hasHoverSupport && !prefersReducedMotion) {
    document.querySelectorAll('.news-item').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        // Получаем размеры и положение карточки
        const rect = this.getBoundingClientRect();
        
        // Вычисляем положение курсора относительно центра карточки
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Вычисляем проценты смещения от центра
        const xPercent = (x / rect.width - 0.5) * 2; // От -1 до 1
        const yPercent = (y / rect.height - 0.5) * 2; // От -1 до 1
        
        // Применяем эффект наклона (максимум 5 градусов)
        const tiltX = -yPercent * 5;
        const tiltY = xPercent * 5;
        
        // Применяем 3D трансформацию
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px)`;
        
        // Эффект для изображения
        const image = this.querySelector('.news-thumbnail');
        if (image) {
          image.style.transform = `scale(1.05) translateX(${xPercent * 10}px) translateY(${yPercent * 10}px)`;
        }
      });
      
      // Возвращаем карточку в исходное положение при уходе курсора
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        
        const image = this.querySelector('.news-thumbnail');
        if (image) {
          image.style.transform = '';
        }
      });
    });
  }
  
  // Добавляем класс для карточек, если они уже видны при загрузке страницы
  document.querySelectorAll('.news-item').forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Добавляем класс с небольшой задержкой для каждой карточки
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 200);
    }
  });
  
  // Создаем интерактивный эффект для кнопок "Читать подробнее"
  document.querySelectorAll('.btn-read-more').forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Создаем эффект свечения
      const glow = document.createElement('div');
      glow.className = 'button-glow';
      glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%);
        opacity: 0;
        z-index: 1;
        pointer-events: none;
      `;
      this.appendChild(glow);
      
      // Анимируем появление свечения
      setTimeout(() => {
        glow.style.opacity = '0.4';
      }, 10);
    });
    
    button.addEventListener('mouseleave', function() {
      const glow = this.querySelector('.button-glow');
      if (glow) {
        glow.style.opacity = '0';
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
          glow.remove();
        }, 300);
      }
    });
  });
  
  // Функция для проверки, виден ли элемент в области просмотра
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Функция для обработки события прокрутки
  function handleScroll() {
    document.querySelectorAll('.news-item').forEach((item, index) => {
      if (isElementInViewport(item) && !item.classList.contains('visible')) {
        setTimeout(() => {
          item.classList.add('visible');
        }, index * 150);
      }
    });
  }
  
  // Обработчик события прокрутки
  window.addEventListener('scroll', handleScroll);
  
  // Проверяем при первой загрузке
  handleScroll();
});

