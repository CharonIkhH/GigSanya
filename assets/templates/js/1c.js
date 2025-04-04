/* Добавляем функционал для кнопки "Вверх" */
document.addEventListener('DOMContentLoaded', function() {
    // Создаем и добавляем кнопку "Вверх"
    const backToTopButton = document.createElement('a');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.href = '#';
    document.body.appendChild(backToTopButton);
    
    // Обработчик для кнопки
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Показываем/скрываем кнопку в зависимости от прокрутки
    function toggleBackToTopButton() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
    
    window.addEventListener('scroll', toggleBackToTopButton);
    toggleBackToTopButton(); // Проверяем при загрузке страницы
  });

  /* Простой JavaScript для анимации при скролле */
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем класс fade-in ко всем элементам, которые нужно анимировать
    const elementsToAnimate = document.querySelectorAll('h1, h2, h3, p, .img-responsive, .article_list');
    elementsToAnimate.forEach(element => {
      if (!element.classList.contains('fade-in')) {
        element.classList.add('fade-in');
      }
    });
    
    // Функция для проверки, находится ли элемент в области видимости
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
      );
    }
    
    // Функция для обработки анимаций при скролле
    function handleScroll() {
      const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
      fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
          element.classList.add('visible');
        }
      });
    }
    
    // Обработчики событий
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('load', handleScroll);
    
    // Запускаем обработку при загрузке страницы
    handleScroll();
  });