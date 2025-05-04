<?php
class AdvancedLogger {
    private $logPath;
    private $logLevel;
    private $logPrefix;
    private $requestId;
    
    // Уровни логирования
    const LEVEL_DEBUG = 10;
    const LEVEL_INFO = 20;
    const LEVEL_WARNING = 30;
    const LEVEL_ERROR = 40;
    const LEVEL_CRITICAL = 50;
    
    public function __construct($logPath = null, $logLevel = self::LEVEL_DEBUG) {
        $this->logPath = $logPath ?: __DIR__ . '/logs/amocrm_integration.log';
        $this->logLevel = $logLevel;
        $this->requestId = $this->generateRequestId();
        $this->logPrefix = "[" . date('Y-m-d H:i:s') . "][REQ:{$this->requestId}] ";
        
        // Создаем директорию для логов, если не существует
        $dir = dirname($this->logPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        // Регистрируем обработчик ошибок
        set_error_handler([$this, 'errorHandler']);
        
        // Логируем начало запроса и информацию о системе
        $this->logSystemInfo();
    }
    
    private function generateRequestId() {
        return substr(md5(uniqid() . mt_rand()), 0, 8);
    }
    
    private function logSystemInfo() {
        $serverInfo = [
            'time' => date('Y-m-d H:i:s'),
            'request_id' => $this->requestId,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
            'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
            'php_version' => PHP_VERSION,
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time')
        ];
        
        $this->debug("=== НОВЫЙ ЗАПРОС ===", $serverInfo);
    }
    
    public function errorHandler($errno, $errstr, $errfile, $errline) {
        $errorType = match($errno) {
            E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR => 'FATAL ERROR',
            E_WARNING, E_CORE_WARNING, E_COMPILE_WARNING, E_USER_WARNING => 'WARNING',
            E_NOTICE, E_USER_NOTICE => 'NOTICE',
            E_DEPRECATED, E_USER_DEPRECATED => 'DEPRECATED',
            default => 'UNKNOWN'
        };
        
        $this->error("PHP {$errorType}: {$errstr}", [
            'file' => $errfile,
            'line' => $errline,
            'trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS)
        ]);
        
        return false; // Продолжить стандартную обработку ошибок
    }
    
    public function debug($message, $context = []) {
        $this->log(self::LEVEL_DEBUG, $message, $context);
    }
    
    public function info($message, $context = []) {
        $this->log(self::LEVEL_INFO, $message, $context);
    }
    
    public function warning($message, $context = []) {
        $this->log(self::LEVEL_WARNING, $message, $context);
    }
    
    public function error($message, $context = []) {
        $this->log(self::LEVEL_ERROR, $message, $context);
    }
    
    public function critical($message, $context = []) {
        $this->log(self::LEVEL_CRITICAL, $message, $context);
    }
    
    public function logApiRequest($method, $url, $headers, $data = null) {
        // Маскируем чувствительные данные в заголовках
        $safeHeaders = $this->sanitizeHeaders($headers);
        
        $this->debug("AmoCRM API REQUEST", [
            'method' => $method,
            'url' => $url,
            'headers' => $safeHeaders,
            'data' => $data ? json_encode($data, JSON_UNESCAPED_UNICODE) : null
        ]);
    }
    
    public function logApiResponse($url, $status, $headers, $body, $time) {
        $this->debug("AmoCRM API RESPONSE", [
            'url' => $url,
            'status' => $status,
            'time' => $time . 'ms',
            'headers' => $headers,
            'body' => is_string($body) ? $body : json_encode($body, JSON_UNESCAPED_UNICODE)
        ]);
    }
    
    public function logTokenState($token) {
        // Безопасное логирование токена
        $safeToken = [
            'access_token' => $this->maskString($token['access_token'] ?? ''),
            'refresh_token' => $this->maskString($token['refresh_token'] ?? ''),
            'expires_in' => $token['expires_in'] ?? 'unknown',
            'created_at' => $token['created_at'] ?? 'unknown',
            'expiration_time' => isset($token['created_at']) && isset($token['expires_in']) 
                ? date('Y-m-d H:i:s', $token['created_at'] + $token['expires_in']) 
                : 'unknown',
            'remaining_time' => isset($token['created_at']) && isset($token['expires_in'])
                ? ($token['created_at'] + $token['expires_in'] - time()) . ' seconds'
                : 'unknown',
            'is_expired' => isset($token['created_at']) && isset($token['expires_in'])
                ? ($token['created_at'] + $token['expires_in'] < time() ? 'YES' : 'NO')
                : 'unknown'
        ];
        
        $this->debug("AmoCRM TOKEN STATE", $safeToken);
    }
    
    private function sanitizeHeaders($headers) {
        $safeHeaders = [];
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                // Маскируем токен в заголовке авторизации
                if (preg_match('/Bearer\s+(.+)$/i', $value, $matches)) {
                    $safeHeaders[$key] = 'Bearer ' . $this->maskString($matches[1]);
                } else {
                    $safeHeaders[$key] = $this->maskString($value);
                }
            } else {
                $safeHeaders[$key] = $value;
            }
        }
        return $safeHeaders;
    }
    
    private function maskString($string) {
        if (strlen($string) <= 8) return '********';
        return substr($string, 0, 4) . '...' . substr($string, -4);
    }
    
    private function log($level, $message, $context = []) {
        if ($level < $this->logLevel) return;
        
        $levelName = match($level) {
            self::LEVEL_DEBUG => 'DEBUG',
            self::LEVEL_INFO => 'INFO',
            self::LEVEL_WARNING => 'WARNING',
            self::LEVEL_ERROR => 'ERROR',
            self::LEVEL_CRITICAL => 'CRITICAL',
            default => 'UNKNOWN'
        };
        
        $formattedContext = empty($context) ? '' : PHP_EOL . json_encode(
            $context,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        
        $logMessage = $this->logPrefix . "[{$levelName}] {$message}{$formattedContext}" . PHP_EOL;
        
        file_put_contents($this->logPath, $logMessage, FILE_APPEND);
    }
}
