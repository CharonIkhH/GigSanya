// app.js - основной файл сервера
const express = require('express');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Конфигурация AmoCRM с правильным clientId
const amoCRMConfig = {
  // Учетные данные OAuth 2.0
  clientId: "561781a1-c44c-4d31-a4dc-75245143395d",
  clientSecret: "olYpwvYGdRMbJWQGHahVcAtoctWVbozdBUXoImAVKdOwovanbikBPE1HuMowk1BJ",
  redirectUri: "http://localhost:3000/api/amocrm/callback",
  
  // Информация о вашем аккаунте amoCRM
  subdomain: "gigsys",
  baseDomain: "gigsys.amocrm.ru",
  
  // Токены
  longToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY1YmUwZjgyOTRjYWMyMWU0OGU5ZTYxMWFkODgyOWUwNjhhNDZkNTdhNDBjOWEzNmY3MzhkZmVjZmM3ODExYTVhYmNiYjdmYmYyZDcxNDQxIn0.eyJhdWQiOiI1NjE3ODFhMS1jNDRjLTRkMzEtYTRkYy03NTI0NTE0MzM5NWQiLCJqdGkiOiI2NWJlMGY4Mjk0Y2FjMjFlNDhlOWU2MTFhZDg4MjllMDY4YTQ2ZDU3YTQwYzlhMzZmNzM4ZGZlY2ZjNzgxMWE1YWJjYmI3ZmJmMmQ3MTQ0MSIsImlhdCI6MTc0NjAwODk2NiwibmJmIjoxNzQ2MDA4OTY2LCJleHAiOjE4OTYwNDgwMDAsInN1YiI6Ijk5OTM0MDYiLCJncmFudF90eXBlIjoiIiwiYWNjb3VudF9pZCI6MzExNzk2ODIsImJhc2VfZG9tYWluIjoiYW1vY3JtLnJ1IiwidmVyc2lvbiI6Miwic2NvcGVzIjpbImNybSIsImZpbGVzIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyIsInB1c2hfbm90aWZpY2F0aW9ucyJdLCJoYXNoX3V1aWQiOiJmMTI1OTUxOC00YzEzLTQ2ODgtYjBiOC05Y2EwZmI0NmIxMTEiLCJhcGlfZG9tYWluIjoiYXBpLWIuYW1vY3JtLnJ1In0.nRc4jiGrsNZZOVXiGx5dm9l3j7-c0oHbAdl5ZRAaZrs53USlbr7-88lQF_P9q69I59EVLD0eH5Mad-OXX9lyLkBv7f4y0mPfmnolwiBBdH2yxbvuoq9-Q3EFdyu0-Aj5D08a1QRSlkyR7I6Ec6pzyNmwAZzQIGzJt5sCunbhrPFAU1WHh88NetvAdsmsQGhP9-eP1J0QG1_E-KhwTk-JdmM3sIw0fEoEc0I39t9Tdtr6_WIRPL_LCwNsC2xkJlvLcjLSQCVWDweW3REt11VWLzQ9c4ld62pD5NxIkJms6xwmue5Y_tK7Iehkbye8tXtmjknZTcyBf-dnPLLq7mBXNA",
  refreshToken: "def5020055bd3f0b6060f9c28f60e6b75318a53ec3e8547b128f17df2e7fdd87dff9d790ff8a1f95d4b51e051e66382eb6be9d2821404dda26eb3df8ac73d6a998b2b771ba9ea5e91e61026eec69bd973c8f1b82f15c5da604f99d66edea621dd23b9a45551b85698ecbdf79c5d4fee817b3cd102153af65154ebf9600a6558123353f2d500e1be5578625d8952931681ae9813b3f6c56c4fa438faccb05a5008db6320baf6a3cc9237e13acbedcd7492cbb25e7e1fd0a0d1c4d5879859dc981da4ca405c8ddf915db9707ec8b69fc7ad78ca47b37548ac7fc5012e12834a0cbd2965a9da08ec8a10943e0bd46653964ada926b4bf134bb768243bb610167a39df9327d8a48464fdb72f0a3edc08f63e7501bb1be433d7ed075adca9fceffa0753fc962b8f0def11a768f79e5cdb0792f095f80844f457b44fe7930f8c0bfbf44ea0a2c6092c71a65d00aacdae94ea22b7c1de2e3d2662c0d27d3bdd60c939fcac2e239fc5628c80d7a6272413c3706587f9e91334f6cbca64a3179b6b5972aaab565514fd60ca7bd132d57c6ba43008fff92942946e0e431484ef4de03eb084236a73ee28982ff0b2f91348763e5b2d10dcb72b974ca0eae7083c3776165b4e398430044957eb0ec1d5e1301c5fcc2982ddd59f592f59531bfc8fac579209c35254f154e93cfa6f17b5a3a38e65ce3bddd0c013a060b6f524",
  
  // ID полей и статусов
  fields: {
    email: 1046294,
    phone: 1046292,
    comment: 1714411
  },
  pipeline: {
    id: 7159446,
    statuses: {
      new: 58928146,
      primary: 58928150
    }
  }
};

// Настройка Telegram
const telegramConfig = {
  botToken: '7813140158:AAHm1-JG4KDjHTb83zNieLAyqy8-MEu6FwY',
  chatId: '-1001940374630'
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Статические файлы
app.use(express.static(path.join(__dirname)));

// Базовые маршруты
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.htm'));
});

// Функция отправки сообщения в Telegram
async function sendToTelegram(message) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
      {
        chat_id: telegramConfig.chatId,
        text: message,
        parse_mode: 'HTML'
      }
    );
    console.log('Сообщение успешно отправлено в Telegram');
    return response.data;
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error.response?.data || error.message);
    throw error;
  }
}

// Функция обновления токена AmoCRM (улучшенная)
async function refreshAmoCRMToken() {
  try {
    console.log('[AMOCRM] Попытка обновления токена');
    
    // Читаем токен из файла, если он существует
    let clientRefreshToken = amoCRMConfig.refreshToken;
    try {
      if (fs.existsSync('amocrm_token.js')) {
        const tokenFile = fs.readFileSync('amocrm_token.js', 'utf8');
        const tokenMatch = tokenFile.match(/refresh_token: "([^"]+)"/);
        if (tokenMatch && tokenMatch[1]) {
          clientRefreshToken = tokenMatch[1];
          console.log('[AMOCRM] Использую refresh_token из файла');
        }
      }
    } catch (readError) {
      console.warn('[AMOCRM] Не удалось прочитать токен из файла:', readError.message);
    }
    
    const response = await axios.post(`https://${amoCRMConfig.baseDomain}/oauth2/access_token`, {
      client_id: amoCRMConfig.clientId,
      client_secret: amoCRMConfig.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: clientRefreshToken,
      redirect_uri: amoCRMConfig.redirectUri
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Обновляем токены в конфигурации
    amoCRMConfig.longToken = response.data.access_token;
    amoCRMConfig.refreshToken = response.data.refresh_token; // Важно сохранить новый refresh_token
    
    // Сохраняем токены в файл
    const tokenData = `window.amocrmToken = {
  access_token: "${response.data.access_token}",
  refresh_token: "${response.data.refresh_token}",
  token_type: "${response.data.token_type}",
  expires_in: ${response.data.expires_in},
  baseDomain: "${amoCRMConfig.baseDomain}",
  client_id: "${amoCRMConfig.clientId}",
  client_secret: "${amoCRMConfig.clientSecret}",
  redirect_uri: "${amoCRMConfig.redirectUri}",
  created_at: ${Math.floor(Date.now() / 1000)}
}`;
    
    fs.writeFileSync('amocrm_token.js', tokenData);
    console.log('[AMOCRM] Токен успешно обновлен и сохранен в файл');
    
    return true;
  } catch (error) {
    console.error('[AMOCRM] Ошибка обновления токена:', error.response?.data || error.message);
    return false;
  }
}

// Функция проверки токена AmoCRM
async function checkAmoCRMToken() {
  try {
    await axios.get(`https://${amoCRMConfig.baseDomain}/api/v4/account`, {
      headers: {
        'Authorization': `Bearer ${amoCRMConfig.longToken}`
      }
    });
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      return await refreshAmoCRMToken();
    }
    return false;
  }
}

// Маршрут для проверки статуса подключения к AmoCRM
app.get('/api/amocrm/status', async (req, res) => {
  try {
    const response = await axios.get(`https://${amoCRMConfig.baseDomain}/api/v4/account`, {
      headers: {
        'Authorization': `Bearer ${amoCRMConfig.longToken}`
      }
    });
    
    res.json({
      status: 'success',
      message: 'Подключение к AmoCRM работает корректно',
      account_info: {
        id: response.data.id,
        name: response.data.name,
        subdomain: amoCRMConfig.subdomain
      }
    });
  } catch (error) {
    // Проверяем, истек ли токен
    if (error.response?.status === 401) {
      const refreshed = await refreshAmoCRMToken();
      if (refreshed) {
        try {
          // Повторяем запрос с новым токеном
          const response = await axios.get(`https://${amoCRMConfig.baseDomain}/api/v4/account`, {
            headers: {
              'Authorization': `Bearer ${amoCRMConfig.longToken}`
            }
          });
          
          return res.json({
            status: 'success',
            message: 'Подключение к AmoCRM восстановлено после обновления токена',
            account_info: {
              id: response.data.id,
              name: response.data.name,
              subdomain: amoCRMConfig.subdomain
            }
          });
        } catch (retryError) {
          return res.status(500).json({
            status: 'error',
            message: 'Ошибка после обновления токена',
            details: retryError.message
          });
        }
      }
    }
    
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка подключения к AmoCRM',
      details: error.message,
      responseData: error.response?.data
    });
  }
});

// Маршрут для проверки и обновления токена
app.get('/api/amocrm/check-token', async (req, res) => {
  try {
    const isValid = await checkAmoCRMToken();
    res.json({ success: true, valid: isValid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Маршрут для клиентского обновления токена
app.post('/api/amocrm/client-refresh-token', async (req, res) => {
  try {
    console.log('[API] Запрос на клиентское обновление токена');
    
    // Если в теле запроса есть refresh_token, используем его
    const refreshToken = req.body.refresh_token;
    
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Не указан refresh_token'
      });
    }
    
    const response = await axios.post(`https://${amoCRMConfig.baseDomain}/oauth2/access_token`, {
      client_id: amoCRMConfig.clientId,
      client_secret: amoCRMConfig.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      redirect_uri: amoCRMConfig.redirectUri
    });
    
    // Обновляем токены в конфигурации
    amoCRMConfig.longToken = response.data.access_token;
    amoCRMConfig.refreshToken = response.data.refresh_token;
    
    // Полная информация для клиента
    const tokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
      baseDomain: amoCRMConfig.baseDomain,
      client_id: amoCRMConfig.clientId,
      client_secret: amoCRMConfig.clientSecret,
      redirect_uri: amoCRMConfig.redirectUri,
      created_at: Math.floor(Date.now() / 1000)
    };
    
    // Сохраняем в файл
    fs.writeFileSync('amocrm_token.js', `window.amocrmToken = ${JSON.stringify(tokenData, null, 2)}`);
    
    res.json({
      status: 'success',
      ...tokenData
    });
  } catch (error) {
    console.error('[API] Ошибка при обновлении токена:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при обновлении токена',
      details: error.response?.data || error.message
    });
  }
});

// Маршрут для авторизации в AmoCRM
app.get('/api/amocrm/auth', (req, res) => {
  const authUrl = `https://${amoCRMConfig.baseDomain}/oauth2/authorize?client_id=${amoCRMConfig.clientId}&mode=post_message&redirect_uri=${encodeURIComponent(amoCRMConfig.redirectUri)}`;
  res.redirect(authUrl);
});

// Маршрут для обработки callback при OAuth авторизации
app.get('/api/amocrm/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({
      status: 'error',
      message: 'Код авторизации не получен'
    });
  }
  
  try {
    const response = await axios.post(`https://${amoCRMConfig.baseDomain}/oauth2/access_token`, {
      client_id: amoCRMConfig.clientId,
      client_secret: amoCRMConfig.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: amoCRMConfig.redirectUri
    });
    
    // Обновляем токены в конфигурации
    amoCRMConfig.longToken = response.data.access_token;
    amoCRMConfig.refreshToken = response.data.refresh_token;
    
    // Сохраняем токены в файл с дополнительной информацией
    const tokenData = `window.amocrmToken = {
  access_token: "${response.data.access_token}",
  refresh_token: "${response.data.refresh_token}",
  token_type: "${response.data.token_type}",
  expires_in: ${response.data.expires_in},
  baseDomain: "${amoCRMConfig.baseDomain}",
  client_id: "${amoCRMConfig.clientId}",
  client_secret: "${amoCRMConfig.clientSecret}",
  redirect_uri: "${amoCRMConfig.redirectUri}",
  created_at: ${Math.floor(Date.now() / 1000)}
}`;
    
    fs.writeFileSync('amocrm_token.js', tokenData);
    
    res.json({
      status: 'success',
      message: 'Авторизация успешна, токены получены',
      tokens: {
        access_token: response.data.access_token.substring(0, 10) + '...',
        expires_in: response.data.expires_in
      }
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при получении токена доступа',
      details: error.message,
      responseData: error.response?.data
    });
  }
});

// Маршрут для обновления токена
app.get('/api/amocrm/refresh-token', async (req, res) => {
  try {
    const result = await refreshAmoCRMToken();
    
    if (result) {
      res.json({
        status: 'success',
        message: 'Токен успешно обновлен',
        tokens: {
          access_token: amoCRMConfig.longToken.substring(0, 10) + '...',
          expires_in: 86400 // Стандартное время жизни токена AmoCRM
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Не удалось обновить токен'
      });
    }
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при обновлении токена',
      details: error.message,
      responseData: error.response?.data
    });
  }
});

// Маршрут для создания контакта в AmoCRM с улучшенной обработкой ошибок
app.all('/api/amocrm/create-contact', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Метод не поддерживается. Используйте POST запрос для создания контактов.'
    });
  }
  
  try {
    console.log('[API] Запрос на создание контакта в AmoCRM:', req.body);
    
    let response;
    try {
      response = await axios.post(
        `https://${amoCRMConfig.baseDomain}/api/v4/contacts`, 
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${amoCRMConfig.longToken}`
          }
        }
      );
    } catch (initialError) {
      // Если ошибка авторизации, пробуем обновить токен и повторить запрос
      if (initialError.response?.status === 401) {
        console.log('[API] Получена ошибка 401, обновляем токен и повторяем запрос');
        const refreshed = await refreshAmoCRMToken();
        
        if (!refreshed) {
          return res.status(401).json({
            status: 'error',
            message: 'Не удалось обновить токен доступа',
            details: initialError.response?.data
          });
        }
        
        // Повторяем запрос с новым токеном
        response = await axios.post(
          `https://${amoCRMConfig.baseDomain}/api/v4/contacts`, 
          req.body,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${amoCRMConfig.longToken}`
            }
          }
        );
      } else {
        // Если другая ошибка, просто пробрасываем её дальше
        throw initialError;
      }
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('[API] Ошибка при создании контакта:', error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при создании контакта',
      details: error.response?.data || error.message
    });
  }
});

// Маршрут для создания сделки в AmoCRM с улучшенной обработкой ошибок
app.all('/api/amocrm/create-lead', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Метод не поддерживается. Используйте POST запрос для создания сделок.'
    });
  }
  
  try {
    console.log('[API] Запрос на создание сделки в AmoCRM:', req.body);
    
    let response;
    try {
      response = await axios.post(
        `https://${amoCRMConfig.baseDomain}/api/v4/leads`, 
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${amoCRMConfig.longToken}`
          }
        }
      );
    } catch (initialError) {
      // Если ошибка авторизации, пробуем обновить токен и повторить запрос
      if (initialError.response?.status === 401) {
        console.log('[API] Получена ошибка 401, обновляем токен и повторяем запрос');
        const refreshed = await refreshAmoCRMToken();
        
        if (!refreshed) {
          return res.status(401).json({
            status: 'error',
            message: 'Не удалось обновить токен доступа',
            details: initialError.response?.data
          });
        }
        
        // Повторяем запрос с новым токеном
        response = await axios.post(
          `https://${amoCRMConfig.baseDomain}/api/v4/leads`, 
          req.body,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${amoCRMConfig.longToken}`
            }
          }
        );
      } else {
        // Если другая ошибка, просто пробрасываем её дальше
        throw initialError;
      }
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('[API] Ошибка при создании сделки:', error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при создании сделки',
      details: error.response?.data || error.message
    });
  }
});

// Добавление примечания к сделке
app.post('/api/amocrm/add-note/:leadId', async (req, res) => {
  try {
    const leadId = req.params.leadId;
    console.log(`[API] Запрос на добавление примечания к сделке ${leadId}:`, req.body);
    
    let response;
    try {
      response = await axios.post(
        `https://${amoCRMConfig.baseDomain}/api/v4/leads/${leadId}/notes`, 
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${amoCRMConfig.longToken}`
          }
        }
      );
    } catch (initialError) {
      // Если ошибка авторизации, пробуем обновить токен и повторить запрос
      if (initialError.response?.status === 401) {
        console.log('[API] Получена ошибка 401, обновляем токен и повторяем запрос');
        const refreshed = await refreshAmoCRMToken();
        
        if (!refreshed) {
          return res.status(401).json({
            status: 'error',
            message: 'Не удалось обновить токен доступа',
            details: initialError.response?.data
          });
        }
        
        // Повторяем запрос с новым токеном
        response = await axios.post(
          `https://${amoCRMConfig.baseDomain}/api/v4/leads/${leadId}/notes`, 
          req.body,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${amoCRMConfig.longToken}`
            }
          }
        );
      } else {
        // Если другая ошибка, просто пробрасываем её дальше
        throw initialError;
      }
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('[API] Ошибка при добавлении примечания:', error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Ошибка при добавлении примечания',
      details: error.response?.data || error.message
    });
  }
});

// Обработчик формы для отправки в Telegram и AmoCRM
app.post('/send_telegram.php', upload.none(), async (req, res) => {
  try {
    console.log('Получен запрос на отправку формы:', req.body);
    
    // Нормализация данных из формы
    const name = req.body.name || req.body.userName || req.body.Имя || '';
    const phone = req.body.phone || req.body.userPhone || req.body.Телефон || '';
    const email = req.body.email || req.body.userEmail || req.body.Email || '';
    const comment = req.body.comment || req.body.userMessage || req.body.Комментарий || '';
    
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Имя и телефон являются обязательными полями'
      });
    }
    
    // Быстрый ответ клиенту
    res.json({
      success: true,
      message: 'Данные успешно получены и обрабатываются'
    });
    
    // Формируем сообщение для Telegram
    const telegramMessage = 
      `🔔 <b>Новая заявка с сайта!</b>\n\n` +
      `👤 <b>Имя:</b> ${name}\n` +
      `📞 <b>Телефон:</b> ${phone}\n` +
      `${email ? `📧 <b>Email:</b> ${email}\n` : ''}` +
      `${comment ? `\n💬 <b>Комментарий:</b>\n${comment}` : ''}`;
    
    // Отправляем сообщение в Telegram
    await sendToTelegram(telegramMessage);
    console.log('Сообщение отправлено в Telegram');
    
    // Проверяем наличие AmoCRM токена и создаем контакт
    if (amoCRMConfig.longToken) {
      try {
        // Создаем контакт в AmoCRM
        const contactData = {
          name: name,
          custom_fields_values: []
        };
        
        if (phone) {
          contactData.custom_fields_values.push({
            field_id: amoCRMConfig.fields.phone,
            values: [{ value: phone }]
          });
        }
        
        if (email) {
          contactData.custom_fields_values.push({
            field_id: amoCRMConfig.fields.email,
            values: [{ value: email }]
          });
        }
        
        // Пробуем отправить запрос, в случае ошибки 401 обновляем токен
        let contactResponse;
        try {
          contactResponse = await axios.post(
            `https://${amoCRMConfig.baseDomain}/api/v4/contacts`,
            [contactData],
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${amoCRMConfig.longToken}`
              }
            }
          );
        } catch (initialError) {
          if (initialError.response?.status === 401) {
            // Обновляем токен
            await refreshAmoCRMToken();
            
            // Повторяем запрос с новым токеном
            contactResponse = await axios.post(
              `https://${amoCRMConfig.baseDomain}/api/v4/contacts`,
              [contactData],
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${amoCRMConfig.longToken}`
                }
              }
            );
          } else {
            throw initialError;
          }
        }
        
        if (!contactResponse.data._embedded || !contactResponse.data._embedded.contacts) {
          throw new Error('Неожиданная структура ответа при создании контакта');
        }
        
        // Получаем ID созданного или обновленного контакта
        const contactId = contactResponse.data._embedded.contacts[0].id;
        console.log(`Контакт создан/обновлен в AmoCRM с ID: ${contactId}`);
        
        // Создаем сделку и связываем её с контактом
        const leadData = {
          name: `Заявка с сайта от ${name}`,
          status_id: amoCRMConfig.pipeline.statuses.new,
          pipeline_id: amoCRMConfig.pipeline.id,
          _embedded: {
            contacts: [
              {
                id: contactId
              }
            ]
          }
        };
        
        // Пробуем создать сделку, в случае ошибки 401 обновляем токен
        let leadResponse;
        try {
          leadResponse = await axios.post(
            `https://${amoCRMConfig.baseDomain}/api/v4/leads`,
            [leadData],
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${amoCRMConfig.longToken}`
              }
            }
          );
        } catch (initialError) {
          if (initialError.response?.status === 401) {
            // Обновляем токен
            await refreshAmoCRMToken();
            
            // Повторяем запрос с новым токеном
            leadResponse = await axios.post(
              `https://${amoCRMConfig.baseDomain}/api/v4/leads`,
              [leadData],
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${amoCRMConfig.longToken}`
                }
              }
            );
          } else {
            throw initialError;
          }
        }
        
        if (!leadResponse.data._embedded || !leadResponse.data._embedded.leads) {
          throw new Error('Неожиданная структура ответа при создании сделки');
        }
        
        // Получаем ID созданной сделки
        const leadId = leadResponse.data._embedded.leads[0].id;
        console.log(`Сделка создана в AmoCRM с ID: ${leadId}`);
        
        // Если есть комментарий, добавляем его как примечание к сделке
        if (comment) {
          const noteData = {
            entity_id: leadId,
            note_type: 'common',
            params: {
              text: comment
            }
          };
          
          try {
            await axios.post(
              `https://${amoCRMConfig.baseDomain}/api/v4/leads/notes`,
              [noteData],
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${amoCRMConfig.longToken}`
                }
              }
            );
            console.log('Комментарий добавлен к сделке в AmoCRM');
          } catch (noteError) {
            console.error('Ошибка при добавлении комментария к сделке:', noteError.message);
            // Не выбрасываем ошибку, так как отсутствие комментария не критично
          }
        }
        
        console.log('Данные успешно добавлены в AmoCRM');
      } catch (error) {
        console.error('Ошибка при работе с AmoCRM:', error.message);
        // Отправляем уведомление об ошибке в Telegram
        try {
          await sendToTelegram(`⚠️ <b>Ошибка при добавлении в AmoCRM</b>\n\nДанные клиента:\n👤 ${name}\n📞 ${phone}\n\n<b>Ошибка:</b> ${error.message}`);
        } catch (telegramError) {
          console.error('Ошибка при отправке уведомления о сбое в Telegram:', telegramError.message);
        }
      }
    } else {
      console.warn('Токен AmoCRM не найден, данные отправлены только в Telegram');
    }
  } catch (error) {
    console.error('Общая ошибка обработки формы:', error);
    // Если ответ клиенту еще не отправлен, отправляем ошибку
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обработке данных',
        error: error.message
      });
    }
  }
});

// Обработка 404 ошибок
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Запрашиваемый ресурс не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Серверная ошибка:', err);
  res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
    details: err.message
  });
});

// Проверяем токен AmoCRM при запуске сервера
checkAmoCRMToken()
  .then(valid => {
    console.log(`[AMOCRM] Токен ${valid ? 'действителен' : 'недействителен, требуется обновление'}`);
    if (!valid) {
      return refreshAmoCRMToken();
    }
    return valid;
  })
  .catch(error => {
    console.error('[AMOCRM] Ошибка при проверке токена:', error.message);
  });

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
  console.log(`Доступен по адресу: http://localhost:${port}`);
});

// Клиентский JavaScript для модального окна и обработки формы
const clientJS = `
// Функция для открытия модального окна
function openSimpleModal(modalId = 'simple-callback') {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('simple-modal-overlay');
  if (modal && overlay) {
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  }
}

// Функция для закрытия модального окна
function closeSimpleModal() {
  const modals = document.querySelectorAll('.simple-modal');
  const overlay = document.getElementById('simple-modal-overlay');
  
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
  
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  document.body.style.overflow = ''; // Возвращаем прокрутку страницы
}

// Функция обновления токена AmoCRM (для клиентской стороны)
function refreshAmoCRMToken() {
  console.log('[AMOCRM] Начало процесса обновления токена');
  
  // Получаем текущий токен
  const currentToken = window.amocrmToken;
  
  if (!currentToken || !currentToken.refresh_token) {
    console.error('[AMOCRM] Ошибка: отсутствует refresh_token для обновления');
    return Promise.reject('Отсутствует refresh_token');
  }
  
  // Подготавливаем данные для запроса
  const refreshData = {
    refresh_token: currentToken.refresh_token
  };
  
  // Отправляем запрос на обновление токена
  return fetch('/api/amocrm/client-refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(refreshData)
  })
  .then(response => {
    console.log('[AMOCRM] Получен ответ на запрос обновления токена: ' + response.status);
    return response.json();
  })
  .then(data => {
    if (data.status === 'success' && data.access_token) {
      // Обновляем токен в памяти
      window.amocrmToken = data;
      console.log('[AMOCRM] Токен успешно обновлен');
      return window.amocrmToken;
    } else {
      console.error('[AMOCRM] Ошибка обновления токена:', data);
      return Promise.reject('Ошибка обновления токена');
    }
  });
}

// Обработка отправки формы
function submitSimpleForm(form) {
  console.log('[EVENT] Событие submit активировано для формы #' + form.id);
  console.log('[EVENT] Стандартная отправка формы предотвращена');
  
  let submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>Отправка...</span><i class="fa fa-spinner fa-spin"></i>';
  
  // Создаем объект FormData и добавляем все поля формы
  const formData = new FormData(form);
  
  fetch('/send_telegram.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Закрываем модальное окно с формой
    closeSimpleModal();
    
    // Показываем модальное окно с сообщением об успехе
    const successModal = document.getElementById('simple-success');
    if (successModal) {
      successModal.style.display = 'flex';
      
      const overlay = document.getElementById('simple-modal-overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
    }
    
    // Сбрасываем форму
    form.reset();
  })
  .catch(error => {
    console.error('[ERROR] Произошла ошибка при отправке данных:', error);
    alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.');
  })
  .finally(() => {
    // Восстанавливаем кнопку в исходное состояние
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  });
}

// Проверка токена AmoCRM при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Если есть токен amoCRM, проверяем его актуальность
  if (window.amocrmToken) {
    const now = Math.floor(Date.now() / 1000);
    const tokenCreationTime = window.amocrmToken.created_at || 0;
    const tokenLifetime = window.amocrmToken.expires_in || 86400;
    
    // Если токен истекает в ближайшие 10 минут, обновляем его
    if (now > tokenCreationTime + tokenLifetime - 600) {
      refreshAmoCRMToken()
        .catch(err => console.error('[AMOCRM] Ошибка обновления токена:', err));
    }
  }
  
  // Обработчики закрытия модального окна
  const overlay = document.getElementById('simple-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSimpleModal);
  }
  
  const closeButtons = document.querySelectorAll('.simple-modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeSimpleModal);
  });
  
  // Остановка всплытия события клика внутри модального окна
  const modalContents = document.querySelectorAll('.simple-modal-content');
  modalContents.forEach(content => {
    content.addEventListener('click', event => {
      event.stopPropagation();
    });
  });
});
`;

// Запись клиентского JavaScript в файл
fs.writeFileSync('modal.js', clientJS);
