const config = require('./config/config.js');
const axios = require('axios');
axios.defaults.timeout = 30000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

RegisterNetEvent('HD:SendPostal');
on('HD:SendPostal', async (street, crossstreet, postal) => {
  const ids = ExtractIdentifiers(source);
  const steam = ids.steam.replace(/steam:/gi, '');
  let body = {
    community: config.api.community_ID,
    apisecret: config.api.api_secret,
    steamhex: steam,
    street: street,
    crossstreet: crossstreet,
    postal: postal,
  };
  let checkres = await axios.post(config.api.api_URL, body);
  if (checkres.statusCode == 404) {
    console.log('[ERROR] The API responded with status code 404');
  }
});

on('playerJoining', async (source) => {
  emitNet('HD:SendConfig', source, config.api.update_frequency);
});

on('onServerResourceStart', (resourceName) => {
  if (GetCurrentResourceName() != resourceName) {
    return;
  }
  emitNet('HD:SendConfig', -1, config.api.update_frequency);
});

function ExtractIdentifiers(src) {
  const identifiers = {
    steam: '',
  };

  for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    const id = GetPlayerIdentifier(src, i);
    if (id.includes('steam')) {
      identifiers.steam = id;
    }
  }
  return identifiers;
}
