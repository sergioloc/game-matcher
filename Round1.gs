/**
 * Source: github.com/sergioloc
 */

var spreadsheetId = "17aEd8CZmtnQhCfNlE_j08ZvIpv36nXSOiDQBx7JNJbs"
var range = 1;


function generateRound1() {
  var players = getPlayers()
  if (players.length % 4 == 0)
    getRound1(players)
  else {
    printError("generateRound1()", "No se pueden cuadrar los partidos con " + players.length + " jugadores.")
    //SpreadsheetApp.getUi().alert('La operación no se puede realizar con un número de jugadores impares.');
  }
};


function getRound1(players) {
  orderArray(players)

  // Get couples
  var couples = getCouples1(players)
  printCoupleList(couples)

  // Get matches
  var matches = getMatches1(couples)
  printMatchList(matches)

  // Save matches
  postRound("Ronda 1", matches)
}




////////// GET COUPLES //////////

function getCouples1(players) {
  var couples = Array()
  var ignore = Array()
  for (var i = 0; i < players.length - 1; i++) {
    if (!ignore.includes(players[i].code)) {
      printWarning("getRound1()", "Posible partners for: " + players[i].name + " (Nivel " + players[i].level + ")")
      var sameLevel = getPlayersWithSameLevel(players[i], players, ignore)
      var rangeLevel = getPlayersWithRangeLevel(players[i], players, ignore)

      var partner = getPartner(sameLevel, rangeLevel)

      ignore.push(players[i].code)
      ignore.push(partner.code)

      var couple = {
        code: i,
        partner1: players[i],
        partner2: partner,
        level: players[i].level + partner.level
      }
      printInfo("getRound1()", "New couple [" + players[i].name + ", " + partner.name + "]")
      couples.push(couple)
    }
  }
  return couples
}


function getPartner(sameLevel, rangeLevel) {
  if (sameLevel.length > 1) {
    // Obetener de forma aleatoria
    var min = 0
    var max = sameLevel.length - 1
    var random = Math.floor(Math.random() * (max - min + 1)) + min
    return sameLevel[random]
  }
  else if (sameLevel.length > 0) {
    // Obtener el único con el mismo nivel
    return sameLevel[0]
  }
  else if (rangeLevel.length > 1) {
    // Obetener de forma aleatoria
    var min = 0
    var max = rangeLevel.length - 1
    var random = Math.floor(Math.random() * (max - min + 1)) + min
    return rangeLevel[random]
  }
  else if (rangeLevel.length > 0) {
    // Obetener el único con el mismo nivel
    return rangeLevel[0]
  }
}



////////// GET MATCHES //////////

function getMatches1(couples) {
  var matches = Array()
  for (var i = 0; i < couples.length - 1; i++) {
    var match = {
      code: i,
      couple1: couples[i],
      couple2: couples[i + 1]
    }
    matches.push(match)
    i++
  }
  checkMacthes(matches)
  return matches
}


function checkMacthes(matches) {
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].couple1.level - matches[i].couple2.level > range || matches[i].couple1.level - matches[i].couple2.level < -range) {
      // Se modifican las parejas para balancear los partidos
      var position = i + 1
      printInfo("checkMatches()", "El partido " + position + " está descompensado (" + matches[i].couple1.level + " VS " + matches[i].couple2.level + ")")

      // Couple 1
      var high1
      var low1
      if (matches[i].couple1.partner1.level > matches[i].couple1.partner2.level) {
        high1 = matches[i].couple1.partner1
        low1 = matches[i].couple1.partner2
      }
      else {
        high1 = matches[i].couple1.partner1
        low1 = matches[i].couple1.partner2
      }

      // Couple 2
      var high2
      var low2
      if (matches[i].couple2.partner1.level > matches[i].couple2.partner2.level) {
        high2 = matches[i].couple2.partner1
        low2 = matches[i].couple2.partner2
      }
      else {
        high2 = matches[i].couple2.partner1
        low2 = matches[i].couple2.partner2
      }

      matches[i].couple1.partner1 = high1
      matches[i].couple1.partner2 = low2
      matches[i].couple1.level = high1.level + low2.level
      matches[i].couple2.partner1 = high2
      matches[i].couple2.partner2 = low1
      matches[i].couple2.level = high2.level + low1.level
    }
  }
}
