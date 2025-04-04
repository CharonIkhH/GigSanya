// ========================================================================
// СКРИПТ ДЛЯ УСИЛЕНИЯ ПРОДАЖНОСТИ
// Добавляет динамические элементы и повышает конверсионность страницы
// ========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Подключаем стили
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = 'assets/templates/css/enhanced-sales-design.css';
    document.head.appendChild(styleLink);
  
    // ========================================================================
    // ДОБАВЛЯЕМ ПРОДАЮЩИЕ ЭЛЕМЕНТЫ
    // ========================================================================
    
    // Добавляем счетчик обратного отсчета в CTA секцию (создает ощущение срочности)
    const ctaBox = document.querySelector('.cta-box');
    if (ctaBox) {
      const countdownEl = document.createElement('div');
      countdownEl.className = 'countdown-timer';
      countdownEl.innerHTML = `
        <p class="countdown-title">До конца акции осталось:</p>
        <div class="countdown-digits">
          <div class="countdown-digit">
            <span class="digit hours">24</span>
            <span class="label">часа</span>
          </div>
          <div class="countdown-digit">
            <span class="digit minutes">00</span>
            <span class="label">минут</span>
          </div>
          <div class="countdown-digit">
            <span class="digit seconds">00</span>
            <span class="label">секунд</span>
          </div>
        </div>
      `;
      
      // Вставляем таймер перед кнопками
      const ctaButtons = ctaBox.querySelector('.cta-buttons');
      if (ctaButtons) {
        ctaBox.insertBefore(countdownEl, ctaButtons);
      }
      
      // Запускаем таймер
      startCountdown();
    }
    
    // Добавляем бейджи к заголовкам секций
    const addBadgeToSection = (selector, text, colorClass = '') => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const badge = document.createElement('span');
        badge.className = `sales-badge ${colorClass}`;
        badge.textContent = text;
        el.parentNode.insertBefore(badge, el);
      });
    };
    
    // Добавляем продающие бейджи
    addBadgeToSection('.benefits-section .section-header h2', 'ГЛАВНЫЕ ПРЕИМУЩЕСТВА');
    
    const viewCounter = document.createElement('div');
    viewCounter.className = 'view-counter';
    viewCounter.style.position = 'fixed';
    viewCounter.style.bottom = '20px';
    viewCounter.style.left = '20px';
    viewCounter.style.zIndex = '9998'; // Высокий z-index, чуть ниже хедера
    viewCounter.innerHTML = `
      <div class="view-counter-inner">
        <i class="fa fa-eye"></i>
        <span class="counter-text">Сейчас просматривают: <strong>14</strong> пользователей</span>
      </div>
    `;
    document.body.appendChild(viewCounter);
    
    // Добавляем индикатор экономии к цене
    const pricelistBtn = document.querySelector('.pricelist .btn');
    if (pricelistBtn) {
      const savingsBadge = document.createElement('div');
      savingsBadge.className = 'savings-badge';
      savingsBadge.innerHTML = `
        <div class="savings-badge-inner">
          <span class="savings-amount">Экономия до 30%</span>
        </div>
      `;
      pricelistBtn.parentNode.insertBefore(savingsBadge, pricelistBtn);
    }
    
    // ========================================================================
    // УЛУЧШАЕМ ИНТЕРАКТИВНОСТЬ ЭЛЕМЕНТОВ
    // ========================================================================
    
    // Анимация появления элементов при скролле
    const elementsToAnimate = [
      '.benefit-card', 
      '.expertise-card', 
      '.extra-item',
      '.target-text h2',
      '.target-image',
      '.highlight-text',
      '.quality-badge',
      '.cta-box'
    ];
    
    // Определяем класс анимации для каждого элемента
    const animationMap = {
      '.benefit-card': 'fadeInUp',
      '.expertise-card': 'fadeInUp',
      '.extra-item': 'fadeInLeft',
      '.target-text h2': 'fadeInUp',
      '.target-image': 'fadeInRight',
      '.highlight-text': 'fadeInUp',
      '.quality-badge': 'zoomIn',
      '.cta-box': 'zoomIn'
    };
    
    // Добавляем класс анимации к элементам
    elementsToAnimate.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        el.classList.add('animate');
        el.classList.add(animationMap[selector] || 'fadeIn');
        el.style.animationDelay = `${index * 0.1}s`;
      });
    });
    
    // Добавляем функцию проверки видимости и запуска анимации
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top <= windowHeight * 0.85) {
          el.classList.add('animate-active');
        }
      });
    };
    
    // Запускаем начальную проверку и отслеживаем скролл
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    // ========================================================================
    // ФУНКЦИИ ДЛЯ ПОВЫШЕНИЯ КОНВЕРСИИ
    // ========================================================================
    
    // Функция для запуска таймера обратного отсчета
    function startCountdown() {
      const hoursEl = document.querySelector('.countdown-digit .hours');
      const minutesEl = document.querySelector('.countdown-digit .minutes');
      const secondsEl = document.querySelector('.countdown-digit .seconds');
      
      if (!hoursEl || !minutesEl || !secondsEl) return;
      
      let hours = 23;
      let minutes = 59;
      let seconds = 59;
      
      function updateCountdown() {
        if (seconds === 0) {
          seconds = 59;
          if (minutes === 0) {
            minutes = 59;
            if (hours === 0) {
              // Сбрасываем на 24 часа когда заканчивается
              hours = 23;
            } else {
              hours--;
            }
          } else {
            minutes--;
          }
        } else {
          seconds--;
        }
        
        // Обновляем отображение
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
      }
      
      // Обновляем каждую секунду
      setInterval(updateCountdown, 1000);
    }
    
    // Добавляем случайное количество просмотров для создания динамики
    function updateViewCounter() {
      const counterEl = document.querySelector('.view-counter strong');
      if (!counterEl) return;
      
      let count = parseInt(counterEl.textContent, 10);
      
      setInterval(() => {
        // Случайное изменение в пределах +/- 3
        const change = Math.floor(Math.random() * 7) - 3;
        count = Math.max(8, count + change); // Минимум 8 пользователей
        counterEl.textContent = count;
      }, 5000);
    }
    
    updateViewCounter();
    
    // Добавляем анимацию подсветки для кнопок CTA
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn-primary, .slider-tarifs .btn.popup-with-form, .pricelist .btn');
    ctaButtons.forEach(btn => {
      btn.classList.add('pulse-button');
    });
    
    // Прокрутка к форме при клике на кнопки
    document.querySelectorAll('.btn.popup-with-form').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            // Плавная прокрутка с небольшой анимацией
            targetElement.classList.add('highlight-form');
            setTimeout(() => targetElement.classList.remove('highlight-form'), 1500);
            
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      });
    });
    
    // Добавляем стиль для подсветки форм
    const highlightFormStyle = document.createElement('style');
    highlightFormStyle.textContent = `
      @keyframes highlightForm {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
        50% { box-shadow: 0 0 0 20px rgba(255, 107, 0, 0); }
      }
      .highlight-form {
        animation: highlightForm 1.5s ease-out;
      }
    `;
    document.head.appendChild(highlightFormStyle);
    
    // Добавляем стили для анимации
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
      .animate { opacity: 0; }
      .fadeIn.animate-active { animation: fadeIn 0.8s forwards; }
      .fadeInUp.animate-active { animation: fadeInUp 0.8s forwards; }
      .fadeInLeft.animate-active { animation: fadeInLeft 0.8s forwards; }
      .fadeInRight.animate-active { animation: fadeInRight 0.8s forwards; }
      .zoomIn.animate-active { animation: zoomIn 0.8s forwards; }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      
      .countdown-timer {
        margin: 1.5rem auto;
        text-align: center;
      }
      
      .countdown-title {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--color-dark-gray-alt);
        margin-bottom: 0.5rem;
      }
      
      .countdown-digits {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
      
      .countdown-digit {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .digit {
        background: var(--accent-color-bright);
        color: white;
        padding: 0.5rem 0.8rem;
        border-radius: 5px;
        font-size: 1.5rem;
        font-weight: 700;
        min-width: 3rem;
        text-align: center;
        box-shadow: 0 5px 15px rgba(255, 107, 0, 0.3);
      }
      
      .label {
        font-size: 0.8rem;
        color: var(--color-dark-gray-alt);
        margin-top: 0.3rem;
      }
      
      .view-counter {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
      }
      
      .view-counter-inner {
        background: white;
        color: var(--color-dark-gray);
        padding: 0.5rem 1rem;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
      }
      
      .view-counter i {
        color: var(--accent-color-bright);
      }
      
      .savings-badge {
        margin-bottom: 1rem;
      }
      
      .savings-badge-inner {
        display: inline-block;
        background: rgba(255, 107, 0, 0.1);
        color: var(--accent-color-bright);
        padding: 0.4rem 1rem;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.9rem;
        border: 1px dashed var(--accent-color-bright);
      }
      
      .pulse-button {
        animation: pulseButton 2s infinite;
      }
      
      @keyframes pulseButton {
        0% {
          box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(255, 107, 0, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(255, 107, 0, 0);
        }
      }
    `;
    document.head.appendChild(animationStyle);
  });