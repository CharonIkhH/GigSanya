/**
 * Универсальная система модальных окон для всего сайта
 * Решает проблемы с разными ID и работает на всех страницах
 */
document.addEventListener('DOMContentLoaded', function() {
  // Функция закрытия модального окна
  function closeSimpleModal() {
    // Скрываем все модальные окна
    document.querySelectorAll('.simple-modal').forEach(modal => {
      modal.style.display = 'none';
    });
    // Скрываем оверлей
    const overlay = document.getElementById('simple-modal-overlay');
    if (overlay) overlay.style.display = 'none';
    
    // Разблокируем прокрутку страницы
    document.body.style.overflow = '';
  }

  // Функция открытия модального окна с поддержкой разных ID
  function openSimpleModal(targetId) {
    // Маппинг ID - соответствие между href в кнопках и реальными ID модалок
    const idMapping = {
      'callback': 'simple-callback',
      'success': 'simple-success'
      // Можно добавить другие соответствия по мере необходимости
    };
    
    // Получаем правильный ID или используем переданный, если маппинга нет
    const modalId = idMapping[targetId] || targetId;
    
    // Получаем модальное окно и оверлей
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('simple-modal-overlay');
    
    if (!modal) {
      console.error('Модальное окно не найдено:', modalId);
      return;
    }
    
    if (!overlay) {
      console.error('Оверлей модального окна не найден');
      return;
    }
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
    
    // Показываем оверлей и модальное окно
    overlay.style.display = 'block';
    modal.style.display = 'block';
  }

  // Инициализация всех кнопок открытия модальных окон
  function initModalButtons() {
    const modalButtons = document.querySelectorAll('.popup-with-form');
    modalButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        // Получаем ID из href (убираем #)
        const targetId = this.getAttribute('href').substring(1);
        openSimpleModal(targetId);
      });
    });
  }

  // Инициализация кнопок закрытия модальных окон
  function initCloseButtons() {
    // Обработчик закрытия по клику на крестик
    document.querySelectorAll('.simple-modal-close').forEach(button => {
      button.removeAttribute('onclick'); // Удаляем inline-обработчики
      button.addEventListener('click', closeSimpleModal);
    });
    
    // Закрытие по клику на оверлей
    const overlay = document.getElementById('simple-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeSimpleModal);
    }
    
    // Закрытие по нажатию Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeSimpleModal();
    });
  }

  // Обработка отправки формы
  function submitSimpleForm(form) {
    if (!form) return;
    
    // Базовая проверка валидности
    const isValid = form.checkValidity();
    if (!isValid) {
      form.reportValidity();
      return;
    }
    
    // Здесь будет код отправки формы
    // ...
    
    // Закрываем текущее модальное окно
    closeSimpleModal();
    
    // Показываем модальное окно успеха через небольшую задержку
    setTimeout(function() {
      openSimpleModal('success');
    }, 300);
  }

  // Инициализируем все модальные окна
  initModalButtons();
  initCloseButtons();
  
  // Делаем функции доступными глобально
  window.openSimpleModal = openSimpleModal;
  window.closeSimpleModal = closeSimpleModal;
  window.submitSimpleForm = submitSimpleForm;
});
