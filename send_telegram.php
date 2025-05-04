<?php
// Файл: send_telegram.php
require_once 'advanced-logger.php';
$logger = new AdvancedLogger();
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization');
header('Content-Type: application/json');

// Включаем сессию для предотвращения дублирования
session_start();

// Проверка на дублирование запросов с минимальным интервалом
$currentTime = time();
$minSubmissionInterval = 5; // Минимальный интервал между отправками в секундах

if (isset($_SESSION['last_submission_time']) && 
    ($currentTime - $_SESSION['last_submission_time']) < $minSubmissionInterval) {
    echo json_encode([
        'success' => false,
        'error' => 'Слишком частые запросы. Пожалуйста, подождите несколько секунд перед повторной отправкой.',
        'code' => 'rate_limit'
    ]);
    exit;
}

$_SESSION['last_submission_time'] = $currentTime;

// Настройки Telegram бота
$botToken = '7813140158:AAHm1-JG4KDjHTb83zNieLAyqy8-MEu6FwY';
$chatId = '-1001940374630';

// Настройки AmoCRM
$amoConfig = [
    'access_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1YmUwZjgyOTRjYWMyMWU0OGU5ZTYxMWFkODgyOWUwNjhhNDZkNTdhNDBjOWEzNmY3MzhkZmVjZmM3ODExYTVhYmNiYjdmYmYyZDcxNDQxIn0.eyJhdWQiOiI1NjE3ODFhMS1jNDRjLTRkMzEtYTRkYy03NTI0NTE0MzM5NWQiLCJqdGkiOiI2NWJlMGY4Mjk0Y2FjMjFlNDhlOWU2MTFhZDg4MjllMDY4YTQ2ZDU3YTQwYzlhMzZmNzM4ZGZlY2ZjNzgxMWE1YWJjYmI3ZmJmMmQ3MTQ0MSIsImlhdCI6MTc0NjAwODk2NiwibmJmIjoxNzQ2MDA4OTY2LCJleHAiOjE4OTYwNDgwMDAsInN1YiI6Ijk5OTM0MDYiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzExNzk2ODIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJmMTI1OTUxOC00YzEzLTQ2ODgtYjBiOC05Y2EwZmI0NmIxMTEiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.nRc4jiGrsNZZOVXiGx5dm9l3j7-c0oHbAdl5ZRAaZrs53USlbr7-88lQF_P9q69I59EVLD0eH5Mad-OXX9lyLkBv7f4y0mPfmnolwiBBdH2yxbvuoq9-Q3EFdyu0-Aj5D08a1QRSlkyR7I6Ec6pzyNmwAZzQIGzJt5sCunbhrPFAU1WHh88NetvAdsmsQGhP9-eP1J0QG1_E-KhwTk-JdmM3sIw0fEoEc0I39t9Tdtr6_WIRPL_LCwNsC2xkJlvLcjLSQCVWDweW3REt11VWLzQ9c4ld62pD5NxIkJms6xwmue5Y_tK7Iehkbye8tXtmjknZTcyBf-dnPLLq7mBXNA',
    'refresh_token' => 'def502009bcc1f70a57e028d58332883dfd81e2458b73bbb21d6cb3d41dbee9266090ddc4a0e8a4033f8d6faa0ccefd056c18eacb8347c6f3dce79fdcb3f514dd333bf72b3c7b3f9863fa43efd051251b3dee20b26d2b0769148f64f57057a86f513232356d639d30563723e57a4d3045849d9babcefc87de703457caa0f7af62f7f6e49ff439bd7b8ceaac41713ea8277f7596fe84da25849e0b473291caf726c557b17ce2b7e14ea84f7a291bbf90cdb27d2f0dba3c42a25aaed24e60e5d071f688d10b6b663fb31352df529ce3034b69297677d112717d10601f5b4f2b55ec74c716ee91b35eef384605636920641e620ab5fecaad6561a218a12ded569140e0e9633c76d6d6d9bde7666253810cdb81ca63a94790ba8f8a8289c37d300548ec3565643267f647b4f945985c801cb4b4142f485bbdb3abfffe5e0c711d5da1b39a9cfb40b56acab6cc95b6277eb1da221067ae667f710b2ef921319e8ba7cb01a5185f24c124392cb8ad36535f7f1ca08da3330b58dd4e9d0c18177c65fa1c139ffa32dd7cd839acda58b93b7c85e2b3100aa2eaaa53f7f4e9204ca1b5df87dba7767a9b9a323ed4dde58594f85080f8396b71d120945f3a8e219ff9e8f90d822ac45a5a4f7ce7e14fc47bf48a349b5d1d83e78bb38d5d20066b0f112ebae316dd7870a22f34ea27f97563ea186ccc3c35b0d9bab7c6d7caf603b',
    'baseDomain' => 'gigsys.amocrm.ru',
    'field_email' => 1395693,
    'field_phone' => 1395691,
    'field_comment' => 1714411, // ID поля для комментария
    'pipeline_id' => 9545114,  // ID воронки "Звонки и Заявки с сайта"
    'status_id' => 76278370    // ID статуса "Первичный контакт"
];

// Функция для логирования
function logToFile($message, $data = null) {
    $logFile = __DIR__ . '/form_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}";
    
    if ($data !== null) {
        $logMessage .= "\n" . print_r($data, true);
    }
    
    file_put_contents($logFile, $logMessage . "\n\n", FILE_APPEND);
}

// Функция для очистки входных данных
function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Функция для отправки данных в AmoCRM
function sendToAmoCRM($name, $email, $phone, $message, $type = 'Заявка с сайта', $config) {
    logToFile("Отправка в AmoCRM", [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'type' => $type
    ]);
    
    // Создаем контакт
    $contactData = [
        [
            'name' => $name,
            'custom_fields_values' => [
                [
                    'field_id' => $config['field_email'],
                    'values' => [['value' => $email ?: '']]
                ],
                [
                    'field_id' => $config['field_phone'],
                    'values' => [['value' => $phone ?: '']]
                ]
            ]
        ]
    ];
    
    $ch = curl_init("https://{$config['baseDomain']}/api/v4/contacts");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "Authorization: Bearer {$config['access_token']}"
    ]);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contactData));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
    $result = curl_exec($ch);
    $info = curl_getinfo($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($info['http_code'] !== 200) {
        logToFile("Ошибка при создании контакта в AmoCRM", [
            'error' => $error,
            'result' => $result,
            'http_code' => $info['http_code']
        ]);
        return false;
    }
    
    $contactResponse = json_decode($result, true);
    if (!isset($contactResponse['_embedded']['contacts'][0]['id'])) {
        logToFile("Не удалось получить ID контакта из ответа AmoCRM", $contactResponse);
        return false;
    }
    
    $contactId = $contactResponse['_embedded']['contacts'][0]['id'];
    logToFile("Контакт создан успешно", ['contact_id' => $contactId]);
    
    // Создаем базовую структуру сделки
    $leadData = [
        [
            'name' => $type . " от " . $name,
            'pipeline_id' => $config['pipeline_id'],
            'status_id' => $config['status_id'],
            '_embedded' => [
                'contacts' => [
                    ['id' => $contactId]
                ]
            ]
        ]
    ];
    
    // Если есть комментарий, добавляем его как custom field
    if (!empty($message)) {
        $leadData[0]['custom_fields_values'] = [
            [
                'field_id' => $config['field_comment'],
                'values' => [['value' => $message]]
            ]
        ];
    }
    
    $ch = curl_init("https://{$config['baseDomain']}/api/v4/leads");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "Authorization: Bearer {$config['access_token']}"
    ]);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($leadData));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
    $result = curl_exec($ch);
    $info = curl_getinfo($ch);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($info['http_code'] !== 200) {
        logToFile("Ошибка при создании сделки в AmoCRM", [
            'error' => $error, 
            'result' => $result,
            'http_code' => $info['http_code']
        ]);
        return false;
    }
    
    $leadResponse = json_decode($result, true);
    if (!isset($leadResponse['_embedded']['leads'][0]['id'])) {
        logToFile("Не удалось получить ID сделки из ответа AmoCRM", $leadResponse);
        return false;
    }
    
    $leadId = $leadResponse['_embedded']['leads'][0]['id'];
    logToFile("Сделка создана успешно", ['lead_id' => $leadId]);
    
    // Добавляем примечание, если есть сообщение
    if (!empty($message)) {
        $noteData = [
            [
                'note_type' => 'common',
                'params' => [
                    'text' => $message
                ]
            ]
        ];
        
        // Логируем данные перед отправкой
        logToFile("Добавление примечания к сделке", [
            'lead_id' => $leadId,
            'note_data' => $noteData
        ]);
        
        $ch = curl_init("https://{$config['baseDomain']}/api/v4/leads/{$leadId}/notes");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'amoCRM-API-client/1.0');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            "Authorization: Bearer {$config['access_token']}"
        ]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($noteData));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        $result = curl_exec($ch);
        $info = curl_getinfo($ch);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($info['http_code'] !== 200) {
            logToFile("Ошибка при добавлении примечания в AmoCRM", [
                'error' => $error,
                'result' => $result,
                'http_code' => $info['http_code']
            ]);
        } else {
            logToFile("Примечание добавлено успешно");
        }
    }
    
    return [
        'contact_id' => $contactId,
        'lead_id' => $leadId
    ];
}

// Функция для отправки сообщения в Telegram с поддержкой форматирования и эмодзи
function sendToTelegram($botToken, $chatId, $message) {
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true
    ];
    
    $ch = curl_init("https://api.telegram.org/bot{$botToken}/sendMessage");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    return [
        'success' => ($httpCode == 200),
        'response' => json_decode($response, true),
        'http_code' => $httpCode,
        'curl_error' => $curlError
    ];
}

// Обработка предварительного запроса OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Проверка, является ли запрос AJAX-запросом
$isAjaxRequest = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
                 strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Получаем JSON данные из тела запроса
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Логирование входящих данных
logToFile("Получен запрос", [
    'method' => $_SERVER['REQUEST_METHOD'],
    'is_ajax' => $isAjaxRequest ? 'Да' : 'Нет',
    'input' => $input,
    'post' => $_POST,
    'headers' => getallheaders()
]);

// Если данные пришли в JSON формате, обрабатываем их
if ($input !== null) {
    $_POST = $input;
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Проверка на дублирование сообщений (предотвращение повторной отправки)
    $messageHash = md5(json_encode($_POST) . time());
    
    if (isset($_SESSION['last_message_hash']) && $_SESSION['last_message_hash'] === $messageHash) {
        logToFile("Обнаружено дублирование сообщения", $messageHash);
        echo json_encode([
            'success' => true,
            'message' => 'Сообщение уже было отправлено',
            'duplicate' => true
        ]);
        exit;
    }
    
    $_SESSION['last_message_hash'] = $messageHash;
    
    // Унифицированные имена полей
    $name = $_POST['name'] ?? $_POST['userName'] ?? $_POST['Имя'] ?? '';
    $email = $_POST['email'] ?? $_POST['userEmail'] ?? $_POST['Email'] ?? '';
    $phone = $_POST['phone'] ?? $_POST['userPhone'] ?? $_POST['Телефон'] ?? '';
    $message = $_POST['comment'] ?? $_POST['userMessage'] ?? $_POST['Комментарий'] ?? '';
    $source = $_POST['source'] ?? ($_SERVER['HTTP_REFERER'] ?? 'Прямой запрос');
    
    // Дополнительное логирование для отладки передачи комментария
    logToFile("Значение поля комментария", [
        'raw_comment' => $_POST['comment'] ?? 'не определено',
        'raw_userMessage' => $_POST['userMessage'] ?? 'не определено',
        'raw_Комментарий' => $_POST['Комментарий'] ?? 'не определено',
        'processed_message' => $message
    ]);
    
    // Определяем тип формы
    $formType = isset($_POST['form_subject']) ? sanitizeInput($_POST['form_subject']) : 'Форма обратной связи';
    $isCallbackForm = (strpos($formType, 'Заказать звонок') !== false) || isset($_POST['Имя']);
    
    // Формируем заголовок
    $formTitle = $isCallbackForm ? 'Заказ звонка с сайта' : 'Новая заявка с сайта';
    
    // Очищаем данные
    $name = sanitizeInput($name);
    $email = sanitizeInput($email);
    $phone = sanitizeInput($phone);
    $message = sanitizeInput($message);
    $source = sanitizeInput($source);
    
    // Валидация данных
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Имя обязательно для заполнения';
    }
    
    if (empty($phone)) {
        $errors[] = 'Телефон обязателен для заполнения';
    }
    
    // Если нет ошибок, отправляем сообщение
    if (empty($errors)) {
        // Формируем сообщение для Telegram
        $telegramMessage = "🔔 <b>{$formTitle}</b>\n\n" .
            "👤 <b>Имя:</b> {$name}\n" .
            "📧 <b>Email:</b> " . ($email ?: 'Не указан') . "\n" .
            "📱 <b>Телефон:</b> {$phone}\n" .
            "💬 <b>Сообщение:</b> " . ($message ?: 'Отсутствует') . "\n\n" .
            "🌐 <b>Источник:</b> {$source}\n" .
            "🕒 <b>Время:</b> " . date('d.m.Y, H:i:s');
        
        // Отправляем в Telegram через выделенную функцию
        $telegramResult = sendToTelegram($botToken, $chatId, $telegramMessage);
        $telegramSuccess = $telegramResult['success'];
        
        logToFile("Результат отправки в Telegram", $telegramResult);
        
        // Отправляем данные в AmoCRM
        $leadType = $isCallbackForm ? 'Заказ звонка' : 'Заявка с сайта';
        $amoResult = sendToAmoCRM($name, $email, $phone, $message, $leadType, $amoConfig);
        
        // Формируем ответ
        echo json_encode([
            'success' => true,
            'message' => 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
            'telegram' => $telegramSuccess,
            'amo' => $amoResult ? true : false,
            'data' => [
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'message' => $message,
                'source' => $source
            ]
        ]);
    } else {
        // Есть ошибки валидации
        logToFile("Ошибки валидации", $errors);
        echo json_encode([
            'success' => false,
            'error' => 'Проверьте правильность заполнения формы',
            'errors' => $errors
        ]);
    }
} else {
    // Неверный метод запроса
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка: неверный метод запроса'
    ]);
}
?>


