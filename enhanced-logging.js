// enhanced-logging.js
(function() {
    // Настройка уровней логирования
    const LOG_LEVELS = {
        DEBUG: 10,
        INFO: 20,
        WARNING: 30, 
        ERROR: 40,
        CRITICAL: 50
    };
    
    // Настройки логгера
    const config = {
        minLevel: LOG_LEVELS.DEBUG,
        storeLogsInLocalStorage: true,
        maxLogEntries: 1000,
        sendLogsToServer: true,
        logEndpoint: '/api/logs',
        includeTimestamps: true,
        coloredOutput: true,
        prefix: '💎 AmoCRM',
        showStackTraces: true
    };
    
    // Генерация UUID для сессии
    const sessionId = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    // Хранилище логов
    let logStorage = [];
    let consoleOriginals = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    };
    
    // Функция форматирования времени
    function formatTime() {
        const now = new Date();
        return now.toISOString();
    }
    
    // Функция для получения стека вызовов
    function getStack() {
        const stack = new Error().stack;
        if (!stack) return '';
        
        // Форматируем стек для удобства чтения
        return stack.split('\n')
            .slice(3) // Пропускаем первые строки, которые относятся к самому логгеру
            .map(line => line.trim())
            .join('\n');
    }
    
    // Сохранение логов в localStorage
    function persistLogs() {
        if (!config.storeLogsInLocalStorage) return;
        
        try {
            // Обрезаем лог до максимального размера
            if (logStorage.length > config.maxLogEntries) {
                logStorage = logStorage.slice(-config.maxLogEntries);
            }
            localStorage.setItem('amocrm_integration_logs', JSON.stringify(logStorage));
        } catch (e) {
            // В случае ошибки (например, переполнения localStorage) очищаем его
            localStorage.removeItem('amocrm_integration_logs');
            logStorage = [createLogEntry(
                LOG_LEVELS.WARNING, 
                'Хранилище логов было очищено из-за ошибки', 
                {error: e.message}
            )];
        }
    }
    
    // Отправка логов на сервер
    function sendLogsToServer(entry) {
        if (!config.sendLogsToServer) return;
        
        try {
            fetch(config.logEndpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    logs: [entry],
                    session_id: sessionId,
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }),
                // Используем keepalive для гарантированной отправки даже при закрытии страницы
                keepalive: true
            }).catch(() => {}); // Игнорируем ошибки при отправке логов
        } catch (e) {
            // Игнорируем ошибки при отправке логов
        }
    }
    
    // Создание объекта записи лога
    function createLogEntry(level, message, context = {}, stack = '') {
        const entry = {
            timestamp: config.includeTimestamps ? formatTime() : undefined,
            level,
            levelName: Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level) || 'UNKNOWN',
            message,
            context,
            url: window.location.href,
            session_id: sessionId
        };
        
        if (config.showStackTraces && stack) {
            entry.stack = stack;
        }
        
        return entry;
    }
    
    // Основная функция логирования
    function log(level, message, context = {}) {
        if (level < config.minLevel) return;
        
        const stack = config.showStackTraces ? getStack() : '';
        const entry = createLogEntry(level, message, context, stack);
        
        // Добавляем в хранилище
        logStorage.push(entry);
        
        // Сохраняем в localStorage
        persistLogs();
        
        // Отправляем на сервер
        sendLogsToServer(entry);
        
        // Формируем вывод для консоли
        const levelStr = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level) || 'LOG';
        let prefix = `[${config.prefix}][${levelStr}]`;
        
        // Добавляем цвета для консоли
        if (config.coloredOutput) {
            const colors = {
                DEBUG: 'color: #6c757d',
                INFO: 'color: #17a2b8',
                WARNING: 'color: #ffc107',
                ERROR: 'color: #dc3545',
                CRITICAL: 'color: #fff; background-color: #dc3545'
            };
            
            const color = colors[levelStr] || 'color: inherit';
            prefix = `%c${prefix}`;
            
            switch (level) {
                case LOG_LEVELS.DEBUG:
                    consoleOriginals.log(prefix, color, message, context);
                    break;
                case LOG_LEVELS.INFO:
                    consoleOriginals.info(prefix, color, message, context);
                    break;
                case LOG_LEVELS.WARNING:
                    consoleOriginals.warn(prefix, color, message, context);
                    break;
                case LOG_LEVELS.ERROR:
                case LOG_LEVELS.CRITICAL:
                    consoleOriginals.error(prefix, color, message, context);
                    if (stack) consoleOriginals.error('%cStack Trace:', 'color: #dc3545', stack);
                    break;
            }
        } else {
            switch (level) {
                case LOG_LEVELS.DEBUG:
                    consoleOriginals.log(prefix, message, context);
                    break;
                case LOG_LEVELS.INFO:
                    consoleOriginals.info(prefix, message, context);
                    break;
                case LOG_LEVELS.WARNING:
                    consoleOriginals.warn(prefix, message, context);
                    break;
                case LOG_LEVELS.ERROR:
                case LOG_LEVELS.CRITICAL:
                    consoleOriginals.error(prefix, message, context);
                    if (stack) consoleOriginals.error('Stack Trace:', stack);
                    break;
            }
        }
        
        return entry;
    }
    
    // Специальные функции для AmoCRM интеграции
    function logApiRequest(method, url, headers, data) {
        const sanitizedHeaders = {...headers};
        
        // Скрываем токены в заголовках
        if (sanitizedHeaders.Authorization) {
            if (typeof sanitizedHeaders.Authorization === 'string') {
                sanitizedHeaders.Authorization = sanitizedHeaders.Authorization.replace(
                    /(Bearer\s+)([a-zA-Z0-9\-_\.]+)/, 
                    '$1[HIDDEN_TOKEN]'
                );
            }
        }
        
        return log(LOG_LEVELS.DEBUG, `AmoCRM API Request: ${method} ${url}`, {
            method,
            url,
            headers: sanitizedHeaders,
            data: data ? JSON.stringify(data).substring(0, 500) : null
        });
    }
    
    function logApiResponse(url, status, response, time) {
        const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG;
        
        return log(level, `AmoCRM API Response: ${status} from ${url}`, {
            url,
            status,
            time: `${time}ms`,
            response: typeof response === 'object' ? 
                JSON.stringify(response).substring(0, 500) : 
                String(response).substring(0, 500)
        });
    }
    
    function logTokenState(token) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = token.created_at + token.expires_in;
        const remainingSeconds = expiresAt - now;
        const isExpired = remainingSeconds <= 0;
        
        // Маскируем токены для безопасности
        const maskedToken = {
            access_token: token.access_token ? 
                `${token.access_token.substring(0, 5)}...${token.access_token.substring(token.access_token.length - 5)}` : 
                null,
            refresh_token: token.refresh_token ? 
                `${token.refresh_token.substring(0, 5)}...${token.refresh_token.substring(token.refresh_token.length - 5)}` : 
                null,
            created_at: token.created_at,
            created_time: token.created_at ? new Date(token.created_at * 1000).toISOString() : null,
            expires_in: token.expires_in,
            expires_at: expiresAt,
            expires_time: expiresAt ? new Date(expiresAt * 1000).toISOString() : null,
            remaining_seconds: remainingSeconds,
            is_expired: isExpired,
            token_type: token.token_type
        };
        
        const level = isExpired ? LOG_LEVELS.WARNING : LOG_LEVELS.INFO;
        const message = isExpired ? 
            'AmoCRM токен устарел и требует обновления' : 
            `AmoCRM токен действителен (осталось ${Math.floor(remainingSeconds / 60)} минут)`;
        
        return log(level, message, maskedToken);
    }
    
    // Экспортируем API логгера
    window.AmoLogger = {
        debug: (message, context) => log(LOG_LEVELS.DEBUG, message, context),
        info: (message, context) => log(LOG_LEVELS.INFO, message, context),
        warning: (message, context) => log(LOG_LEVELS.WARNING, message, context),
        error: (message, context) => log(LOG_LEVELS.ERROR, message, context),
        critical: (message, context) => log(LOG_LEVELS.CRITICAL, message, context),
        apiRequest: logApiRequest,
        apiResponse: logApiResponse,
        tokenState: logTokenState,
        getLogs: () => [...logStorage],
        clearLogs: () => {
            logStorage = [];
            if (config.storeLogsInLocalStorage) {
                localStorage.removeItem('amocrm_integration_logs');
            }
        },
        setLevel: (level) => {
            config.minLevel = level;
        }
    };
    
    // Загружаем сохраненные логи при инициализации
    try {
        const savedLogs = localStorage.getItem('amocrm_integration_logs');
        if (savedLogs) {
            logStorage = JSON.parse(savedLogs);
        }
    } catch (e) {
        // Игнорируем ошибки при чтении логов
    }
    
    // Логируем инициализацию
    log(LOG_LEVELS.INFO, 'AmoCRM Enhanced Logger инициализирован', {
        session_id: sessionId,
        config
    });
    
    // Добавляем глобальный обработчик ошибок
    window.addEventListener('error', function(event) {
        log(LOG_LEVELS.ERROR, 'Непойманная ошибка JavaScript', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error ? event.error.toString() : null,
            stack: event.error && event.error.stack ? event.error.stack : null
        });
    });
    
    // Добавляем обработчик непойманных отклоненных Promise
    window.addEventListener('unhandledrejection', function(event) {
        log(LOG_LEVELS.ERROR, 'Непойманная ошибка Promise', {
            reason: event.reason ? event.reason.toString() : null,
            stack: event.reason && event.reason.stack ? event.reason.stack : null
        });
    });
})();
