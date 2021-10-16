/**
 * Source: github.com/sergioloc
 */

var spreadsheetId = "17aEd8CZmtnQhCfNlE_j08ZvIpv36nXSOiDQBx7JNJbs"
var players;
var range = 1;

function generateRound1() {
  getPlayers()
  if (players.length % 4 == 0) {
    Logger.log(players)
    round1 = getRound1()
  }
  else {
    printError("generateRound1()", "No se pueden cuadrar los partidos con " + players.length + " jugadores.")
    //SpreadsheetApp.getUi().alert('La operación no se puede realizar con un número de jugadores impares.');
  }
};

function getPlayers() {
  players = Array()
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Jugadores")
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var player = {
      code: rows[i][0],
      name: rows[i][1],
      level: rows[i][2],
      active: rows[i][3]
    }
    if (player.active != "")
      players.push(player)
  }
}

function getRound1() {
  var matches = Array()
  var couples = Array()
  var ignore = Array()

  // Get couples
  //Logger.log("\n\nPlayers ordered:")
  var orderPlayers = getOrderArray(players)
  //printPlayerList(orderPlayers)

  for (var i = 0; i < orderPlayers.length - 1; i++) {
    if (!ignore.includes(orderPlayers[i].code)) {
      printWarning("getRound1()", "Posible partners for: " + orderPlayers[i].name + " (Nivel " + orderPlayers[i].level + ")")
      var sameLevel = getPlayersWithSameLevel(orderPlayers[i], orderPlayers, ignore)
      var rangeLevel = getPlayersWithRangeLevel(orderPlayers[i], orderPlayers, ignore)

      var partner = getPartner(sameLevel, rangeLevel)

      ignore.push(orderPlayers[i].code)
      ignore.push(partner.code)

      var couple = {
        id: i,
        partner1: orderPlayers[i],
        partner2: partner,
        level: orderPlayers[i].level + partner.level
      }
      printInfo("getRound1()", "New couple [" + orderPlayers[i].name + ", " + partner.name + "]")
      couples.push(couple)
    }

  }
  printCoupleList(couples)

  // Get matches
  for (var i = 0; i < couples.length - 1; i++) {
    var match = {
      id: i,
      couple1: couples[i],
      couple2: couples[i + 1]
    }
    matches.push(match)
    i++
  }
  printMatchList(matches)
  var finalMatches = checkMacthes(matches)
  printMatchList(finalMatches)
  postRound1(finalMatches)
}

function getOrderArray(list) {
  list.sort((a, b) => (a.level > b.level) ? 1 : -1)
  return list;
}

function getPlayersWithSameLevel(me, list, ignore) {
  var posibles = Array()

  for (var i = 0; i < list.length; i++) {

    // Si no soy yo mismo
    if (me.code != list[i].code) {

      // Si tiene el mismo nivel
      if (me.level == list[i].level) {

        // Si no hay que ignorar
        if (!ignore.includes(list[i].code)) {
          printInfo("getPlayersWithSameLevel()", " +  " + list[i].name + " (Nivel " + list[i].level + ")")
          posibles.push(list[i])
        }
        else {
          printInfo("getPlayersWithSameLevel()", " -  " + list[i].name + " (Nivel " + list[i].level + ")")
        }
      }

    }
  }
  return posibles
}

function getPlayersWithRangeLevel(me, list, ignore) {
  var posibles = Array()

  for (var i = 0; i < list.length; i++) {

    // Si no soy yo mismo
    if (me.code != list[i].code) {

      // Si está en el rango de nivel
      if (me.level != list[i].level && me.level - range <= list[i].level && me.level + range >= list[i].level) {

        // Si no hay que ignorar
        if (!ignore.includes(list[i].code)) {
          printInfo("getPlayersWithRangeLevel()", " +  " + list[i].name + " (Nivel " + list[i].level + ")")
          posibles.push(list[i])
        }
        else {
          printInfo("getPlayersWithRangeLevel()", " -  " + list[i].name + " (Nivel " + list[i].level + ")")
        }
      }

    }
  }
  return posibles
}

function getPartner(sameLevel, rangeLevel) {
  if (sameLevel.length > 1) {
    // Obetener de forma aleatoria
    var min = 0
    var max = sameLevel.length - 1
    var random = Math.floor(Math.random() * (max - min + 1)) + min
    //printInfo("getPartner()", "Random [" + min + ", " + max + "] = " + random)
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
    //printInfo("getPartner()", "Random [" + min + ", " + max + "] = " + random)
    return rangeLevel[random]
  }
  else if (rangeLevel.length > 0) {
    // Obetener el único con el mismo nivel
    return rangeLevel[0]
  }
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
  return matches
}


// POST

function postRound1(matches) {

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Ronda 1")
  sheet.getRangeList([
    'A3:A50', 'B3:B50', 'C3:C50', 'D3:D50', 'E3:E50', 'F3:F50', 'G3:G50', 'H3:H50', 'I3:I50',
    'J3:J50', 'K3:K50', 'L3:L50', 'M3:M50', 'N3:N50']).clearContent()

  for (var i = 0; i < matches.length; i++) {
    var field = i + 1
    sheet.getRange(i + 3, 1).setValue("Pista " + field);
    sheet.getRange(i + 3, 2).setValue(matches[i].couple1.partner1.code);
    sheet.getRange(i + 3, 3).setValue(matches[i].couple1.partner1.level);
    sheet.getRange(i + 3, 4).setValue(matches[i].couple1.partner1.name);
    sheet.getRange(i + 3, 5).setValue(matches[i].couple1.partner2.code);
    sheet.getRange(i + 3, 6).setValue(matches[i].couple1.partner2.level);
    sheet.getRange(i + 3, 7).setValue(matches[i].couple1.partner2.name);
    sheet.getRange(i + 3, 8).setValue("vs");
    sheet.getRange(i + 3, 9).setValue(matches[i].couple2.partner1.code);
    sheet.getRange(i + 3, 10).setValue(matches[i].couple2.partner1.level);
    sheet.getRange(i + 3, 11).setValue(matches[i].couple2.partner1.name);
    sheet.getRange(i + 3, 12).setValue(matches[i].couple2.partner2.code);
    sheet.getRange(i + 3, 13).setValue(matches[i].couple2.partner2.level);
    sheet.getRange(i + 3, 14).setValue(matches[i].couple2.partner2.name);
  }
}
