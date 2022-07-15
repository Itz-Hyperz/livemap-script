let postals = {};
let _nearestD = null;
let og_frequency = null;
let street = null;
let crossstreet = null;
let _code = null;
let go = true;

setTick(async () => {
  while (go == true) {
    postals = LoadResourceFile(
      GetCurrentResourceName(),
      '/config/postals.json'
    );
    postals = JSON.parse(postals);
    for (let [i, postal] of Object.entries(postals)) {
      postals[i] = {
        vec: (postal.x, postal.y),
        code: postal.code,
      };
    }
    let _total = postals.length;
    let coords = GetEntityCoords(PlayerPedId());
    let _nearestIndex,
      _nearestD = null;
    coords = (coords[1], coords[2]);

    for (let i = 1; i < _total; i++) {
      let D = (coords - postals[i][1]).length;
      if (!_nearestD || D < _nearestD) {
        _nearestIndex = i;
        _nearestD = D;
      }
    }
    _code = postals[_nearestIndex].code;
    const ped = GetPlayerPed(source);
    const [playerX, playerY, playerZ] = GetEntityCoords(ped);

    const [streetName, crossingRoad] = GetStreetNameAtCoord(
      playerX,
      playerY,
      playerZ
    );
    street = GetStreetNameFromHashKey(streetName);
    crossstreet = GetStreetNameFromHashKey(crossingRoad);
    go = false;
    Send();
  }
});

RegisterNetEvent('HD:SendConfig');
on('HD:SendConfig', (update_frequency) => {
  og_frequency = update_frequency;
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Send() {
  await sleep(og_frequency * 1000);
  emitNet('HD:SendPostal', street, crossstreet, _code);
  go = true;
}
