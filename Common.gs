/**
 * Source: github.com/sergioloc
 */

var repeating1 = "#f6b26b"
var repeating2 = "#e69138"
var repeating3 = "#b45f06"

// OPERATIONS

function orderArray(list) {
  list.sort((a, b) => (a.level > b.level) ? 1 : -1)
}

function getPlayersWithSameLevel(me, list, ignore) {
  var posibles = Array()

  for (var i = 0; i < list.length; i++) {

    // Si no soy yo mismo
    if (me.code != list[i].code) {

      // Si tiene el mismo nivel
      if (me.level == list[i].level) {

        // Si no hay que ignorar
        if (!ignore.includes(list[i].code) && !hasPlayed(list[i].code, me.historic1)) {
          //printInfo("getPlayersWithSameLevel()", " +  [" + list[i].code + "] " + list[i].name + " (Nivel " + list[i].level + ")")
          posibles.push(list[i])
        }
        else {
          //printInfo("getPlayersWithSameLevel()", " -  [" + list[i].code + "] " + list[i].name + " (Nivel " + list[i].level + ")")
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
        if (!ignore.includes(list[i].code) && !hasPlayed(list[i].code, me.historic1)) {
          printInfo("getPlayersWithRangeLevel()", " +  [" + list[i].code + "] " + list[i].name + " (Nivel " + list[i].level + ")")
          posibles.push(list[i])
        }
        else {
          printInfo("getPlayersWithRangeLevel()", " -  [" + list[i].code + "] " + list[i].name + " (Nivel " + list[i].level + ")")
        }
      }

    }
  }
  return posibles
}

function getRepeatedPartner(me, list, ignore) {
  var posibles = Array()

  for (var i = 0; i < list.length; i++) {

    // Si no soy yo mismo
    if (me.code != list[i].code) {

      // Si está en el rango de nivel
      if (!ignore.includes(list[i].code) && !wasPartner(list[i].code, me.historic1) && me.level - range <= list[i].level && me.level + range >= list[i].level)
        posibles.push(list[i])
    }
  }
  var min = 0
  var max = posibles.length - 1
  var random = Math.floor(Math.random() * (max - min + 1)) + min
  printError("getRepeatedPartner()", me.name + " está repitiendo con " + posibles[random].name)
  return posibles[random]
}

function hasPlayed(targetCode, historic1) {
  var h1 = historic1.split("-")

  if (h1[0] == targetCode || h1[1] == targetCode || h1[2] == targetCode)
    return true
  else
    return false
}

function wasPartner(targetCode, historic1) {
  var h1 = historic1.split("-")

  if (h1[0] == targetCode)
    return true
  else
    return false
}

function hasPlayedWithCouple(myCouple, targetCouple) {
  var targetCode1 = targetCouple.partner1.code
  var targetCode2 = targetCouple.partner2.code
  var h1 = myCouple.partner1.historic1.split("-")
  var h2 = myCouple.partner2.historic1.split("-")

  if (h1[0] != targetCode1 && h1[1] != targetCode1 && h1[2] != targetCode1 && h1[0] != targetCode1 && h1[1] != targetCode1 && h1[2] != targetCode1 &&
    h1[0] != targetCode2 && h1[1] != targetCode2 && h1[2] != targetCode2 && h1[0] != targetCode2 && h1[1] != targetCode2 && h1[2] != targetCode2 &&
    h2[0] != targetCode1 && h2[1] != targetCode1 && h2[2] != targetCode1 && h2[0] != targetCode1 && h2[1] != targetCode1 && h2[2] != targetCode1 &&
    h2[0] != targetCode2 && h2[1] != targetCode2 && h2[2] != targetCode2 && h2[0] != targetCode2 && h2[1] != targetCode2 && h2[2] != targetCode2)
    return false
  else
    return true
}

// GET VALUES FROM SHEET

// Get all active players
function getPlayers() {
  var players = Array()
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Jugadores")
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var player = {
      code: rows[i][0],
      name: rows[i][1],
      level: rows[i][2],
      active: rows[i][3],
      historic1: rows[i][4],
      historic2: rows[i][5],
      position: i + 1,
      isRepating1: 0,
      isRepating2: 0
    }
    if (player.active != "")
      players.push(player)
  }
  return players
}

// Get couple 1 of match
function getCouple1(sheet, rows, i) {
  var repeating1 = false
  if (sheet.getRange(i, 4).getBackground() == red)
    repeating1 = true

  var partner1 = {
    code: rows[i][1],
    level: rows[i][2],
    name: rows[i][3],
    active: "x",
    isRepating: repeating1
  }

  var repeating2 = false
  if (sheet.getRange(i, 7).getBackground() == red)
    repeating2 = true

  var partner2 = {
    code: rows[i][4],
    level: rows[i][5],
    name: rows[i][6],
    active: "x",
    isRepating: repeating2
  }

  var couple = {
    id: i,
    partner1: partner1,
    partner2: partner2,
    level: partner1.level + partner2.level
  }
  return couple
}

// Get couple 2 from match
function getCouple2(rows, i) {
  var repeating1 = false
  if (sheet.getRange(i, 11).getBackground() == red)
    repeating1 = true

  var partner1 = {
    code: rows[i][8],
    level: rows[i][9],
    name: rows[i][10],
    active: "x",
    isRepating: repeating1
  }

  var repeating2 = false
  if (sheet.getRange(i, 14).getBackground() == red)
    repeating2 = true

  var partner2 = {
    code: rows[i][11],
    level: rows[i][12],
    name: rows[i][13],
    active: "x",
    isRepating: repeating2
  }

  var couple = {
    id: i,
    partner1: partner1,
    partner2: partner2,
    level: partner1.level + partner2.level
  }
  return couple
}

// POST VALUES IN SHEETS

function postRound(sheetName, matches) {

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName)
  var sheetPlayers = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Jugadores")

  cleanRound(sheet)

  var column
  if (sheetName == "Ronda 1")
    column = 5
  else if (sheetName == "Ronda 2")
    column = 6

  for (var i = 0; i < matches.length; i++) {
    // Save values in match sheet
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

    // Save historic in players sheet
    sheetPlayers.getRange(matches[i].couple1.partner1.position, column).setValue(
      matches[i].couple1.partner2.code + "-" +
      matches[i].couple2.partner1.code + "-" +
      matches[i].couple2.partner2.code)

    sheetPlayers.getRange(matches[i].couple1.partner2.position, column).setValue(
      matches[i].couple1.partner1.code + "-" +
      matches[i].couple2.partner1.code + "-" +
      matches[i].couple2.partner2.code)

    sheetPlayers.getRange(matches[i].couple2.partner1.position, column).setValue(
      matches[i].couple2.partner2.code + "-" +
      matches[i].couple1.partner1.code + "-" +
      matches[i].couple1.partner2.code)

    sheetPlayers.getRange(matches[i].couple2.partner2.position, column).setValue(
      matches[i].couple2.partner1.code + "-" +
      matches[i].couple1.partner1.code + "-" +
      matches[i].couple1.partner2.code)

    // Print repeated
    checkRepeated1(matches[i])

    if (matches[i].couple1.partner1.isRepating1 == 1)
      sheet.getRange(i + 3, 4).setBackground(repeating1)
    else if (matches[i].couple1.partner1.isRepating1 == 2)
      sheet.getRange(i + 3, 4).setBackground(repeating2)
    else if (matches[i].couple1.partner1.isRepating1 == 3)
      sheet.getRange(i + 3, 4).setBackground(repeating3)

    if (matches[i].couple1.partner2.isRepating1 == 1)
      sheet.getRange(i + 3, 7).setBackground(repeating1)
    else if (matches[i].couple1.partner2.isRepating1 == 2)
      sheet.getRange(i + 3, 7).setBackground(repeating2)
    else if (matches[i].couple1.partner2.isRepating1 == 3)
      sheet.getRange(i + 3, 7).setBackground(repeating3)

    if (matches[i].couple2.partner1.isRepating1 == 1)
      sheet.getRange(i + 3, 11).setBackground(repeating1)
    else if (matches[i].couple2.partner1.isRepating1 == 2)
      sheet.getRange(i + 3, 11).setBackground(repeating2)
    else if (matches[i].couple2.partner1.isRepating1 == 3)
      sheet.getRange(i + 3, 11).setBackground(repeating3)

    if (matches[i].couple2.partner2.isRepating1 == 1)
      sheet.getRange(i + 3, 14).setBackground(repeating1)
    else if (matches[i].couple2.partner2.isRepating1 == 2)
      sheet.getRange(i + 3, 14).setBackground(repeating2)
    else if (matches[i].couple2.partner2.isRepating1 == 3)
      sheet.getRange(i + 3, 14).setBackground(repeating3)
  }
}

function checkRepeated1(match) {
  var codeC1P1 = match.couple1.partner1.code
  var codeC1P2 = match.couple1.partner2.code
  var codeC2P1 = match.couple2.partner1.code
  var codeC2P2 = match.couple2.partner2.code
  var historicC1P1 = match.couple1.partner1.historic1.split("-")
  var historicC1P2 = match.couple1.partner2.historic1.split("-")
  var historicC2P1 = match.couple2.partner1.historic1.split("-")
  var historicC2P2 = match.couple2.partner2.historic1.split("-")
  //printWarning(historicC1P1)
  //printWarning(historicC1P2)
  //printWarning(historicC2P1)
  //printWarning(historicC2P2)

  // Partner 1 from couple 1
  for (var i = 0; i < historicC1P1.length; i++) {
    if (historicC1P1[i] == codeC1P2 || historicC1P1[i] == codeC2P1 || historicC1P1[i] == codeC2P2) {
      var count = 0
      if (historicC1P1[i] == codeC1P2)
        count++
      if (historicC1P1[i] == codeC2P1)
        count++
      if (historicC1P1[i] == codeC2P2)
        count++
      match.couple1.partner1.isRepating1 = count
    }
  }

  // Partner 2 from couple 1
  for (var i = 0; i < historicC1P2.length; i++) {
    if (historicC1P2[i] == codeC1P1 || historicC1P2[i] == codeC2P1 || historicC1P2[i] == codeC2P2) {
      var count = 0
      if (historicC1P2[i] == codeC1P1)
        count++
      if (historicC1P2[i] == codeC2P1)
        count++
      if (historicC1P2[i] == codeC2P2)
        count++
      match.couple1.partner2.isRepating1 = count
    }
  }

  // Partner 1 from couple 2
  for (var i = 0; i < historicC2P1.length; i++) {
    if (historicC2P1[i] == codeC1P1 || historicC2P1[i] == codeC1P2 || historicC2P1[i] == codeC2P2) {
      var count = 0
      if (historicC2P1[i] == codeC1P1)
        count++
      if (historicC2P1[i] == codeC1P2)
        count++
      if (historicC2P1[i] == codeC2P2)
        count++
      match.couple2.partner1.isRepating1 = count
    }
  }

  // Partner 2 from couple 2
  for (var i = 0; i < historicC2P2.length; i++) {
    if (historicC2P2[i] == codeC1P1 || historicC2P2[i] == codeC1P2 || historicC2P2[i] == codeC2P1) {
      var count = 0
      if (historicC2P2[i] == codeC1P1)
        count++
      if (historicC2P2[i] == codeC1P2)
        count++
      if (historicC2P2[i] == codeC2P1)
        count++
      match.couple2.partner2.isRepating1 = count
    }
  }

}