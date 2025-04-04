// Простые анимации для страницы "О компании"
document.addEventListener('DOMContentLoaded', function() {
    // Функция для простой анимации чисел
    function animateNumbers() {
      const metrics = document.querySelectorAll('.metric-value');
      
      metrics.forEach(metric => {
        const finalValue = parseInt(metric.textContent);
        let currentValue = 0;
        const duration = 2000; // 2 секунды на анимацию
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        const increment = finalValue / totalFrames;
        
        // Устанавливаем начальное значение
        metric.textContent = '0';
        
        // Запускаем анимацию при видимости элемента
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startAnimation();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(metric);
        
        // Функция запуска анимации
        function startAnimation() {
          let frame = 0;
          
          const counter = setInterval(() => {
            frame++;
            currentValue += increment;
            
            if (frame >= totalFrames) {
              clearInterval(counter);
              metric.textContent = finalValue;
            } else {
              metric.textContent = Math.floor(currentValue);
            }
          }, 1000 / framesPerSecond);
        }
      });
    }
    
    // Запускаем анимацию чисел
    animateNumbers();
    
    // Добавляем простую анимацию для карточек услуг
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      // Добавляем эффект появления с задержкой
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // Задержка для каждой карточки
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + (index * 100));
    });
    
    // Добавляем анимацию для принципов работы
    const principleCards = document.querySelectorAll('.principle-card');
    principleCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      // Наблюдатель для появления элементов при скролле
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateX(0)';
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(card);
    });
  });