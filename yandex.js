// Функция для добавления маркера к существующей карте
function enhanceYandexMap() {
    // Получаем iframe
    const mapIframe = document.getElementById('yandex-map-iframe');
    
    // Проверяем существование iframe
    if (!mapIframe) return;

    // Функция для инициализации карты
    function initMap() {
        // Получаем contentWindow iframe
        const iframeWindow = mapIframe.contentWindow;
        
        // Проверяем, есть ли доступ к YMaps в iframe
        if (iframeWindow.ymaps && iframeWindow.ymaps.ready) {
            iframeWindow.ymaps.ready(() => {
                // Создаем метку
                const map = iframeWindow.document.querySelector('.ymaps-2-1-79-map');
                
                if (map) {
                    // Создаем элемент метки
                    const markerElement = document.createElement('div');
                    markerElement.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" 
                             viewBox="0 0 24 24" 
                             style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; z-index: 1000;">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                                  fill="#fd7921"/>
                        </svg>
                    `;
                    
                    markerElement.style.position = 'absolute';
                    markerElement.style.top = '50%';
                    markerElement.style.left = '50%';
                    markerElement.style.transform = 'translate(-50%, -50%)';
                    markerElement.style.zIndex = '1000';
                    markerElement.style.pointerEvents = 'none';
                    
                    // Добавляем метку
                    map.appendChild(markerElement);
                }
            });
        } else {
            // Если YMaps не загружен, пробуем снова через некоторое время
            setTimeout(initMap, 1000);
        }
    }

    // Пытаемся инициализировать карту
    initMap();
}

// Загружаем карту при загрузке страницы
document.addEventListener('DOMContentLoaded', enhanceYandexMap);