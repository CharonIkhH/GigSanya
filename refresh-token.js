// refresh-token.js
const axios = require('axios');
const fs = require('fs');

// Конфигурация
const config = {
  clientId: "561781a1-c44c-4d31-a4dc-75245143395d",
  clientSecret: "olYpwvYGdRMbJWQGHahVcAtoctWVbozdBUXoImAVKdOwovanbikBPE1HuMowk1BJ",
  redirectUri: "http://localhost:3000/api/amocrm/callback",
  baseDomain: "gigsys.amocrm.ru",
  refreshToken: "def50200bc6bc987c1a7efa57dcf7ba2790b69425817a69dcd556500896bd570d78fd04675009d102fc99198c01647870a1a726c01e0da176832d052e5c26fa4c7c357a4f875acbb8e0aeedc289b0799470ae64645ffcdbdc35a59938f25edbf5ae89c8e58952a64177daeb4ef2a54d839318d7cb947c7f81e18c54a1a45fa1e5c8918be8f0a319372ca65ac59e0d71f4d51c528882ac160c37b26fe7202b27d4546808ecf204236979f92e2e5086e5e80c83fa15c68bbfaaba523c20eb28065a8cdab66cd884b4a345b17446234cabd0d005c9b9a07c3e2fef4d485e1a994d03cc2858db3262464161bfcf068cfec61de1e0fb9f5cd3a3bdec28ad1d83d0236352f1a0ae250115ba3a6d5f6d23576940634743bbdfb1fa976b34170ab5bfd82d02ab65b630f4ad7768b79b54ab2ce3ca682f2e644d83631089881eddfb01a4836e684802fc7d6719583448d010f86dff0b5a66b92cb97ea8b900b74f06928b69ba2730a6c953e878f14c971de508fa27d83a41694cb8f104305e63280e615edead1755eec002900371de2b9337c6d8f26847b08c8e17fcafd90f2f02bdd10111cb4304ffa502117513a96f947e8edc250149c3a01a2ecf250b30e5a91868377e678057b39b4bdd76e3ec92e8accc81ce1ab79edf35a05a7beba1134beb5f66491b57b410dbd1e40800e4e2c193fd800b75a1fd002dba865f5"
};

// Функция обновления токена
async function refreshToken() {
  try {
    console.log('Обновление токена...');
    
    const response = await axios.post(`https://${config.baseDomain}/oauth2/access_token`, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: config.refreshToken,
      redirect_uri: config.redirectUri
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const newTokens = response.data;
    console.log('Токены успешно обновлены');
    
    // Сохраняем новые токены в файл
    const tokenData = `window.amocrmToken = {
  access_token: "${newTokens.access_token}",
  refresh_token: "${newTokens.refresh_token}",
  token_type: "${newTokens.token_type}",
  expires_in: ${newTokens.expires_in},
  baseDomain: "${config.baseDomain}",
  created_at: ${Math.floor(Date.now() / 1000)}
}`;
    
    fs.writeFileSync('amocrm_token.js', tokenData);
    console.log('Токены сохранены в файл amocrm_token.js');
    
    // Также сохраняем в файл с настройками для последующих запусков
    const updatedConfig = { ...config, refreshToken: newTokens.refresh_token };
    fs.writeFileSync('amocrm_config.json', JSON.stringify(updatedConfig, null, 2));
    console.log('Обновленная конфигурация сохранена в файл amocrm_config.json');
    
    return newTokens;
  } catch (error) {
    console.error('Ошибка обновления токена:', error.response?.data || error.message);
    throw error;
  }
}

// Выполняем обновление токена
refreshToken().catch(console.error);
