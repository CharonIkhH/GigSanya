// amo-form.js - скрипт для отправки данных формы в amoCRM и Telegram
// Подключаем расширенное логирование
document.addEventListener('DOMContentLoaded', function() {
    // Проверка, загружен ли уже логгер
    if (!window.AmoLogger) {
        console.warn('AmoCRM Enhanced Logger не загружен!');
    } else {
        AmoLogger.info('amo-form.js загружен и готов к работе');
    }
});

// Переопределяем функцию создания контакта с расширенным логированием
function createAmoCRMContact(name, email, phone, message) {
    if (window.AmoLogger) {
        AmoLogger.info('Запуск создания контакта в AmoCRM', {
            name, email, phone, 
            message: message ? (message.length > 20 ? message.substring(0, 20) + '...' : message) : 'отсутствует'
        });
        
        // Логируем состояние токена перед запросом
        if (window.amocrmToken) {
            AmoLogger.tokenState(window.amocrmToken);
        } else {
            AmoLogger.warning('Токен AmoCRM отсутствует');
        }
    }
    
    // Оригинальный код функции с добавлением логирования
    
    // Отслеживаем время запроса
    const startTime = performance.now();
    
    // Логируем запрос
    const url = "/api/amocrm/create-contact";
    const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    };
    
    if (window.amocrmToken && window.amocrmToken.access_token) {
        headers['Authorization'] = `Bearer ${window.amocrmToken.access_token}`;
    }
    
    if (window.AmoLogger) {
        AmoLogger.apiRequest('POST', url, headers, contactData);
    }
    
    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify([contactData])
    })
    .then(response => {
        const requestTime = performance.now() - startTime;
        
        if (window.AmoLogger) {
            AmoLogger.apiResponse(
                url, 
                response.status,
                response.statusText, 
                Math.round(requestTime)
            );
        }
        
        if (!response.ok) {
            if (window.AmoLogger) {
                AmoLogger.error(`Ошибка создания контакта, статус: ${response.status}`, {
                    status: response.status,
                    statusText: response.statusText
                });
            }
            
            // В случае 401 автоматически пытаемся обновить токен
            if (response.status === 401 && window.refreshAmoCRMToken) {
                if (window.AmoLogger) {
                    AmoLogger.warning('Получена ошибка 401, пытаемся обновить токен...');
                }
                
                return refreshAmoCRMToken()
                    .then(newToken => {
                        if (window.AmoLogger) {
                            AmoLogger.info('Токен успешно обновлен, повторяем запрос');
                        }
                        
                        // Повторный запрос с новым токеном
                        return createAmoCRMContact(name, email, phone, message);
                    })
                    .catch(refreshError => {
                        if (window.AmoLogger) {
                            AmoLogger.critical('Не удалось обновить токен', {
                                error: refreshError.message
                            });
                        }
                        
                        throw new Error(`Ошибка обновления токена: ${refreshError.message}`);
                    });
            }
            
            // Пытаемся получить текст ошибки
            return response.text()
                .then(errorText => {
                    throw new Error(`Ошибка создания контакта: ${errorText || response.statusText}`);
                });
        }
        
        if (window.AmoLogger) {
            AmoLogger.debug('Успешный ответ при создании контакта');
        }
        
        return response.json();
    })
    
}

console.log('[INIT] Инициализация скрипта amo-form.js', new Date().toLocaleString());

document.addEventListener('DOMContentLoaded', function() {
    console.log('[EVENT] Событие DOMContentLoaded активировано');
    
    // Инициализация основной формы обратной связи
    console.log('[INIT] Инициализация основной формы обратной связи');
    initializeForm('telegramForm', 'userName', 'userEmail', 'userPhone', 'userMessage');
    
    // Инициализация формы заказа звонка
    console.log('[INIT] Инициализация формы заказа звонка');
    initializeCallbackForm('simple-callback-form');
    
    // Инициализация обработчиков для модальных окон
    console.log('[INIT] Инициализация обработчиков для модальных окон');
    initializeModalHandlers();
    
    console.log('[INIT] Завершена инициализация обработчиков DOM');
    
    // Функция инициализации стандартной формы обратной связи
    function initializeForm(formId, nameId, emailId, phoneId, messageId) {
        const form = document.getElementById(formId);
        
        if (form) {
            console.log(`Форма ${formId} найдена, установка обработчика отправки`);
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Получаем значения полей
                const name = document.getElementById(nameId)?.value || '';
                const email = document.getElementById(emailId)?.value || '';
                const phone = document.getElementById(phoneId)?.value || '';
                const message = document.getElementById(messageId)?.value || '';
                
                // Валидация
                if (!name || !phone) {
                    showCallbackNotification('Пожалуйста, заполните обязательные поля (имя и телефон)', 'error');
                    return;
                }
                
                // Создаем объект FormData
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('phone', phone);
                formData.append('message', message);
                
                // Отправляем данные на сервер
                try {
                    const response = await fetch('/send_telegram.php', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showCallbackNotification('Ваше сообщение успешно отправлено!', 'success');
                        form.reset();
                    } else {
                        showCallbackNotification(result.message || 'Произошла ошибка при отправке', 'error');
                    }
                } catch (error) {
                    showCallbackNotification('Произошла ошибка: ' + error.message, 'error');
                }
            });
        } else {
            console.warn(`Форма с ID "${formId}" не найдена`);
        }
    }
    
    // Функция инициализации формы заказа звонка
    function initializeCallbackForm(formId) {
        console.log(`[INIT] Инициализация функции initializeCallbackForm с ID: ${formId}`);
        
        const form = document.getElementById(formId);
        console.log(`[DOM] Поиск формы: #${formId}, найдена:`, !!form);
        
        if (form) {
            console.log(`[DOM] Форма #${formId} найдена`);
            
            // Удаляем встроенный обработчик onsubmit, если он есть
            if (form.hasAttribute('onsubmit')) {
                console.log(`[EVENT] Удаление атрибута onsubmit`);
                form.removeAttribute('onsubmit');
            }
            
            console.log(`[EVENT] Добавление обработчика события submit к форме #${formId}`);
            form.addEventListener('submit', function(e) {
                console.log(`[EVENT] Событие submit активировано для формы #${formId}`);
                
                e.preventDefault();
                console.log(`[EVENT] Стандартная отправка формы предотвращена`);
                
                console.log(`[VAR] Инициализация переменных для кнопки отправки`);
                let originalButtonText;
                const submitButton = form.querySelector('.simple-submit-button') || form.querySelector('button[type="submit"]');
                
                console.log(`[DOM] Поиск кнопки отправки, найдена:`, !!submitButton);
                if (submitButton) {
                    originalButtonText = submitButton.innerHTML;
                    console.log(`[DOM] Сохранен оригинальный текст кнопки:`, originalButtonText);
                    
                    console.log(`[DOM] Блокировка кнопки отправки`);
                    submitButton.disabled = true;
                    console.log(`[DOM] Установка индикатора загрузки на кнопку`);
                    submitButton.innerHTML = '<span>Отправка...</span><i class="fa fa-spinner fa-spin"></i>';
                } else {
                    console.warn(`[DOM] ВНИМАНИЕ: Кнопка отправки не найдена в форме`);
                }
                
                console.log(`[FORM] Получение значений полей формы`);
                // Получаем значения полей формы
                const nameField = form.querySelector('input[name="Имя"]');
                const emailField = form.querySelector('input[name="Email"]');
                const phoneField = form.querySelector('input[name="Телефон"]');
                const messageField = form.querySelector('textarea[name="Комментарий"]');
                
                console.log(`[DOM] Проверка наличия полей формы:`, {
                    nameField: !!nameField,
                    emailField: !!emailField,
                    phoneField: !!phoneField,
                    messageField: !!messageField
                });
                
                const name = nameField ? nameField.value.trim() : '';
                const email = emailField ? emailField.value.trim() : '';
                const phone = phoneField ? phoneField.value.trim() : '';
                const message = messageField ? messageField.value.trim() : '';
                
                console.log(`[FORM] Полученные значения полей:`, {
                    name,
                    email,
                    phone,
                    message: message.length > 30 ? message.substring(0, 30) + '...' : message
                });
                
                // Проверка заполнения обязательных полей
                console.log(`[VALIDATE] Проверка обязательных полей`);
                if (!name || !phone) {
                    console.warn(`[VALIDATE] Не заполнены обязательные поля:`, {
                        name: !!name,
                        phone: !!phone
                    });
                    
                    showCallbackNotification('Пожалуйста, заполните обязательные поля (имя и телефон)', 'error');
                    
                    console.log(`[DOM] Восстановление состояния кнопки отправки после ошибки валидации`);
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText || 'Отправить';
                    }
                    
                    console.log(`[VALIDATE] Отправка отменена из-за непрохождения валидации`);
                    return;
                }
                
                console.log(`[VALIDATE] Форма успешно прошла валидацию`);
                
                // Логирование для отладки
                console.log(`[DATA] Подготовка данных для отправки:`, { name, email, phone, comment: message });
                
                // Отправляем данные в Telegram
                console.log(`[CONFIG] Настройка параметров API`);
                const botToken = '7813140158:AAHm1-JG4KDjHTb83zNieLAyqy8-MEu6FwY';
                const chatId = '-1001940374630';
                
                console.log(`[CONFIG] Параметры API Telegram:`, {
                    botToken: `${botToken.substring(0, 5)}...${botToken.substring(botToken.length - 5)}`,
                    chatId
                });
                
                // Формируем текст сообщения для Telegram
                console.log(`[TELEGRAM] Формирование сообщения для Telegram`);
                const telegramMessage = `🔔 Заказ звонка с сайта!\n\n👤 Имя: ${name}\n📧 Email: ${email || 'Не указан'}\n📞 Телефон: ${phone}\n\n💬 Комментарий: ${message || 'Без комментария'}`;
                
                console.log(`[TELEGRAM] Сформированное сообщение:`, {
                    длина: telegramMessage.length,
                    текст: telegramMessage.length > 50 ? telegramMessage.substring(0, 50) + '...' : telegramMessage
                });
                
                console.log(`[TELEGRAM] Начало отправки запроса в Telegram`);
                
                // Отправляем данные в Telegram
                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMessage
                    })
                })
                .then(response => {
                    console.log(`[TELEGRAM] Получен ответ от API Telegram:`, {
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText
                    });
                    
                    if (!response.ok) {
                        console.error(`[TELEGRAM] Ошибка запроса:`, {
                            status: response.status,
                            statusText: response.statusText
                        });
                        throw new Error(`Ошибка отправки в Telegram: ${response.status}`);
                    }
                    
                    console.log(`[TELEGRAM] Преобразование ответа в JSON`);
                    return response.json();
                })
                .then(data => {
                    console.log(`[TELEGRAM] Сообщение успешно отправлено в Telegram:`, data);
                    
                    // После успешной отправки в Telegram, отправляем данные в amoCRM
                    console.log(`[AMOCRM] Проверка наличия токена amoCRM:`, !!window.amocrmToken);
                    
                    if (window.amocrmToken) {
                        console.log(`[AMOCRM] Токен amoCRM найден, начинаем отправку в CRM`);
                        return createAmoCRMContact(name, email, phone, message);
                    } else {
                        console.warn(`[AMOCRM] Токен amoCRM не найден, отправка в CRM пропущена`);
                        return Promise.resolve({success: true, message: 'Токен amoCRM не найден, отправка в CRM пропущена'});
                    }
                })
                .then((amoResult) => {
                    console.log(`[COMPLETE] Все операции завершены успешно:`, amoResult);
                    
                    // Скрываем форму
                    if (typeof closeSimpleModal === 'function') {
                        console.log(`[MODAL] Закрытие модального окна`);
                        closeSimpleModal();
                    } else {
                        console.warn(`[MODAL] Функция closeSimpleModal не найдена`);
                    }
                    
                    // Показываем модальное окно успеха
                    const successModal = document.getElementById('simple-success');
                    console.log(`[DOM] Поиск модального окна успеха, найдено:`, !!successModal);
                    
                    if (successModal) {
                        console.log(`[MODAL] Отображение модального окна успеха`);
                        successModal.style.display = 'block';
                        
                        // Также показываем оверлей, если он есть
                        const overlay = document.getElementById('simple-modal-overlay');
                        console.log(`[DOM] Поиск оверлея, найден:`, !!overlay);
                        
                        if (overlay) {
                            console.log(`[MODAL] Отображение оверлея`);
                            overlay.style.display = 'block';
                        } else {
                            console.warn(`[MODAL] Оверлей не найден`);
                        }
                    } else {
                        console.log(`[NOTIFY] Отображение уведомления об успешной отправке`);
                        showCallbackNotification('Звонок успешно заказан! Мы свяжемся с вами в ближайшее время.', 'success');
                    }
                    
                    // Сбрасываем форму
                    console.log(`[FORM] Сброс полей формы`);
                    form.reset();
                    
                    console.log(`[COMPLETE] Успешное завершение обработки отправки формы`);
                })
                .catch(error => {
                    console.error(`[ERROR] Ошибка при обработке отправки формы:`, error);
                    
                    showCallbackNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', 'error');
                })
                .finally(() => {
                    console.log(`[FINALLY] Выполнение финальных действий независимо от результата`);
                    
                    if (submitButton) {
                        console.log(`[DOM] Восстановление состояния кнопки отправки`);
                        
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText || 'Отправить';
                    } else {
                        console.warn(`[DOM] Кнопка отправки не найдена для восстановления`);
                    }
                    
                    console.log(`[FINALLY] Финальные действия завершены`);
                });
            });
            
            console.log(`[INIT] Обработчик отправки формы успешно настроен для #${formId}`);
        } else {
            console.error(`[ERROR] Форма с ID "${formId}" не найдена на странице`);
        }
    }

    // Функция создания контакта в amoCRM
    function createAmoCRMContact(name, email, phone, message) {
        console.log(`[AMOCRM] Запуск функции createAmoCRMContact с параметрами:`, {
            name,
            email,
            phone,
            message: message ? (message.length > 20 ? message.substring(0, 20) + '...' : message) : 'отсутствует'
        });
        
        // Определяем ID полей CRM
        console.log(`[AMOCRM] Настройка ID полей CRM`);
        const EMAIL_FIELD_ID = 1395693;
        const PHONE_FIELD_ID = 1395691;
        const COMMENT_FIELD_ID = 1714411;
        const PIPELINE_ID = 9545114;
        const STATUS_ID = 76278370;
        
        // Создаем объект контакта
        console.log(`[AMOCRM] Формирование данных контакта для отправки`);
        const contactData = {
            name: name,
            custom_fields_values: [
                {
                    field_id: EMAIL_FIELD_ID,
                    values: [{ value: email || '' }]
                },
                {
                    field_id: PHONE_FIELD_ID,
                    values: [{ value: phone || '' }]
                }
            ]
        };
        
        console.log(`[AMOCRM] Начало запроса на создание контакта`);
        
        // Отправляем запрос на наш сервер вместо прямого запроса к AmoCRM
        return fetch("/api/amocrm/create-contact", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify([contactData])
        })
        .then(response => {
            console.log(`[AMOCRM] Получен ответ на запрос создания контакта:`, {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText
            });
            
            if (!response.ok) {
                console.error(`[AMOCRM] Ошибка создания контакта, статус:`, response.status);
                
                // Пытаемся получить текст ошибки
                return response.text().then(errorText => {
                    console.error(`[AMOCRM] Текст ошибки:`, errorText);
                    throw new Error(`Ошибка создания контакта: ${errorText}`);
                });
            }
            
            console.log(`[AMOCRM] Парсинг ответа контакта как JSON`);
            return response.json();
        })
        .then(contactData => {
            // Проверяем структуру ответа
            console.log(`[AMOCRM] Получены данные о созданном контакте:`, contactData);
            
            if (!contactData._embedded || !contactData._embedded.contacts || !contactData._embedded.contacts[0]) {
                console.error(`[AMOCRM] Неожиданная структура ответа:`, contactData);
                throw new Error('Неожиданная структура ответа от amoCRM API');
            }
            
            // Получаем ID созданного контакта
            const contactId = contactData._embedded.contacts[0].id;
            console.log(`[AMOCRM] Контакт успешно создан, ID: ${contactId}`);
            
            // Формируем данные для создания сделки
            console.log(`[AMOCRM] Формирование данных сделки`);
            const leadData = {
                name: `Заявка с сайта от ${name}`,
                pipeline_id: PIPELINE_ID,
                status_id: STATUS_ID,
                _embedded: {
                    contacts: [
                        { id: contactId }
                    ]
                }
            };
            
            // Добавляем комментарий, если он есть
            if (message) {
                console.log(`[AMOCRM] Добавление комментария к сделке`);
                leadData.custom_fields_values = [
                    {
                        field_id: COMMENT_FIELD_ID,
                        values: [{ value: message }]
                    }
                ];
            }
            
            console.log(`[AMOCRM] Начало запроса на создание сделки`);
            
            // Отправляем запрос на наш сервер вместо прямого запроса к AmoCRM
            return fetch('/api/amocrm/create-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify([leadData])
            });
        })
        .then(response => {
            console.log(`[AMOCRM] Получен ответ на запрос создания сделки:`, {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText
            });
            
            if (!response.ok) {
                console.error(`[AMOCRM] Ошибка создания сделки, статус:`, response.status);
                
                // Пытаемся получить текст ошибки
                return response.text().then(errorText => {
                    console.error(`[AMOCRM] Текст ошибки:`, errorText);
                    throw new Error(`Ошибка создания сделки: ${errorText}`);
                });
            }
            
            console.log(`[AMOCRM] Парсинг ответа сделки как JSON`);
            return response.json();
        })
        .then(leadData => {
            console.log(`[AMOCRM] Получены данные о созданной сделке:`, leadData);
            
            if (!leadData._embedded || !leadData._embedded.leads || !leadData._embedded.leads[0]) {
                console.error(`[AMOCRM] Неожиданная структура ответа:`, leadData);
                throw new Error('Неожиданная структура ответа от amoCRM API');
            }
            
            const leadId = leadData._embedded.leads[0].id;
            console.log(`[AMOCRM] Сделка успешно создана, ID: ${leadId}`);
            
            // Если есть сообщение, добавляем его как примечание
            if (message) {
                console.log(`[AMOCRM] Добавление примечания к сделке`);
                
                return fetch(`/api/amocrm/add-note/${leadId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify([{
                        note_type: "common",
                        params: {
                            text: message
                        }
                    }])
                })
                .then(response => {
                    console.log(`[AMOCRM] Примечание добавлено к сделке`);
                    
                    return {
                        success: true,
                        contactId: leadData._embedded.leads[0]._embedded?.contacts[0]?.id,
                        leadId: leadId,
                        message: 'Контакт и сделка успешно созданы в amoCRM'
                    };
                })
                .catch(error => {
                    console.error(`[AMOCRM] Ошибка при добавлении примечания:`, error);
                    // Продолжаем выполнение несмотря на ошибку
                    return {
                        success: true,
                        contactId: leadData._embedded.leads[0]._embedded?.contacts[0]?.id,
                        leadId: leadId,
                        message: 'Контакт и сделка созданы, но примечание не добавлено'
                    };
                });
            }
            
            console.log(`[AMOCRM] Процесс создания контакта и сделки успешно завершен`);
            
            return {
                success: true,
                contactId: leadData._embedded.leads[0]._embedded?.contacts[0]?.id,
                leadId: leadId,
                message: 'Контакт и сделка успешно созданы в amoCRM'
            };
        })
        .catch(error => {
            console.error(`[AMOCRM] Произошла ошибка при работе с amoCRM API:`, error);
            // Продолжаем выполнение, чтобы не прерывать основной поток
            return {
                success: false,
                error: error.message || 'Неизвестная ошибка',
                description: 'Ошибка при работе с amoCRM API'
            };
        });
    }
});

// Функции модальных окон
function openSimpleModal(modalId) {
    console.log(`[MODAL] Открытие модального окна ${modalId}`);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`[MODAL] Модальное окно с ID "${modalId}" не найдено`);
        return;
    }
    
    modal.style.display = 'block';
    document.getElementById('simple-modal-overlay').style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeSimpleModal() {
    console.log(`[MODAL] Закрытие всех модальных окон`);
    const modals = document.querySelectorAll('.simple-modal');
    modals.forEach(modal => modal.style.display = 'none');
    
    const overlay = document.getElementById('simple-modal-overlay');
    if (overlay) overlay.style.display = 'none';
    
    document.body.classList.remove('modal-open');
}

// Алиас для совместимости со старым кодом
function closePriceModal() {
    console.log(`[MODAL] Вызов функции closePriceModal (алиас для closeSimpleModal)`);
    closeSimpleModal();
}

// Обработчик для закрытия модальных окон
function initializeModalHandlers() {
    console.log(`[MODAL] Инициализация обработчиков модальных окон`);
    
    // Закрытие по клику на оверлей
    const overlay = document.getElementById('simple-modal-overlay');
    if (overlay) {
        console.log(`[MODAL] Настройка закрытия по клику на оверлей`);
        overlay.addEventListener('click', closeSimpleModal);
    } else {
        console.warn(`[MODAL] Оверлей с ID "simple-modal-overlay" не найден`);
    }
    
    // Закрытие по клику на кнопки закрытия
    const closeButtons = document.querySelectorAll('.simple-modal-close');
    console.log(`[MODAL] Найдено ${closeButtons.length} кнопок закрытия`);
    closeButtons.forEach(button => {
        button.addEventListener('click', closeSimpleModal);
    });
    
    // Закрытие по Escape
    console.log(`[MODAL] Настройка закрытия по клавише Escape`);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log(`[MODAL] Обнаружено нажатие Escape, закрытие модальных окон`);
            closeSimpleModal();
        }
    });
}

// Вспомогательная функция для отображения уведомлений
function showCallbackNotification(message, type = 'success') {
    console.log(`[NOTIFY] Отображение уведомления: ${message} (тип: ${type})`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция для отправки формы (используется в атрибуте onsubmit)
function submitSimpleForm(form) {
    console.log(`[FORM] Вызов функции submitSimpleForm для формы`, form);
    
    // Получаем значения полей
    const name = form.querySelector('input[name="Имя"]')?.value || '';
    const phone = form.querySelector('input[name="Телефон"]')?.value || '';
    const email = form.querySelector('input[name="Email"]')?.value || '';
    const comment = form.querySelector('textarea[name="Комментарий"]')?.value || '';
    
    // Валидация
    if (!name || !phone) {
        showCallbackNotification('Пожалуйста, заполните обязательные поля (имя и телефон)', 'error');
        return;
    }
    
    // Отправляем данные в Telegram и AmoCRM
    fetch('/send_telegram.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'Имя': name,
            'Телефон': phone,
            'Email': email,
            'Комментарий': comment
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Скрываем форму
            closeSimpleModal();
            
            // Показываем модальное окно успеха
            const successModal = document.getElementById('simple-success');
            if (successModal) {
                successModal.style.display = 'block';
                document.getElementById('simple-modal-overlay').style.display = 'block';
            } else {
                showCallbackNotification('Заявка успешно отправлена!', 'success');
            }
            
            // Сбрасываем форму
            form.reset();
        } else {
            showCallbackNotification(data.message || 'Произошла ошибка при отправке', 'error');
        }
    })
    .catch(error => {
        showCallbackNotification('Произошла ошибка: ' + error.message, 'error');
    });
}
