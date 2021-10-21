/**
 * Source: github.com/sergioloc
 */

var spreadsheetId = "17aEd8CZmtnQhCfNlE_j08ZvIpv36nXSOiDQBx7JNJbs"

function generateRound2() {
  cleanHistoric2()
  cleanHistoric3()
  getRound2(getPlayers())
}

function getRound2(players) {
  orderArray(players)
  var couples = getCouples2(players)
  printCoupleList(2, couples)

  var matches = getMatches2(couples)
  printMatchList(2, matches)
  postRound("Ronda 2", matches)
}


////////// GET COUPLES //////////

function getCouples2(players) {
  var couples = Array()
  var ignore = Array()
  for (var i = 0; i < players.length - 1; i++) {
    if (!ignore.includes(players[i].code)) {
      printWarning("getRound2()", "Posible partners for: " + players[i].name + " (Nivel " + players[i].level + ")")
      var sameLevel = getPlayersWithSameLevel(2, players[i], players, ignore)
      var rangeLevel = getPlayersWithRangeLevel(2, players[i], players, ignore)

      var partner
      if (sameLevel.length == 0 && rangeLevel.length == 0)
        partner = getRepeatedPartner(players[i], players, ignore);
      else
        partner = getPartner(sameLevel, rangeLevel)

      ignore.push(players[i].code)
      ignore.push(partner.code)

      var couple = {
        code: i,
        partner1: players[i],
        partner2: partner,
        level: players[i].level + partner.level
      }
      printInfo("getRound2()", "New couple [" + players[i].name + ", " + partner.name + "]")
      couples.push(couple)
    }
  }
  return couples
}

function getCouplesWithSameLevel(position, couples, ignore) {
  var posibles = Array()
  var myCouple = couples[position]

  for (var i = 0; i < couples.length; i++) {

    // Si no soy yo mismo
    if (myCouple.code != couples[i].code) {

      // Si tiene el mismo nivel
      if (myCouple.level == couples[i].level) {

        // Si no hay que ignorar
        if (!ignore.includes(couples[i].code) && !hasPlayedWithCouple(myCouple, couples[i])) {
          printInfo("getCouplesWithSameLevel()", " +++  "
            + couples[i].partner1.name + " (Nivel " + couples[i].partner1.level + ") & "
            + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") [" + couples[i].level + "]")
          posibles.push(couples[i])
        }
        else {
          printInfo("getCouplesWithSameLevel()", " ---  "
            + couples[i].partner1.name + " (Nivel " + couples[i].partner1.level + ") & "
            + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") [" + couples[i].level + "]")
        }
      }

    }
  }
  return posibles
}

function getCouplesWithRangeLevel(position, couples, ignore) {
  var posibles = Array()
  var myCouple = couples[position]

  for (var i = 0; i < couples.length; i++) {

    // Si no soy yo mismo
    if (myCouple.code != couples[i].code) {

      // Si está en el rango de nivel
      if (myCouple.level != couples[i].level && myCouple.level - range <= couples[i].level && myCouple.level + range >= couples[i].level) {

        // Si no hay que ignorar
        if (!ignore.includes(couples[i].code) && !hasPlayedWithCouple(myCouple, couples[i])) {
          printInfo("getCouplesWithRangeLevel()", " +++  "
            + couples[i].partner1.name + " (Nivel " + couples[i].partner2.level + ") & "
            + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") [" + couples[i].level + "]")
          posibles.push(couples[i])
        }
        else {
          printInfo("getCouplesWithRangeLevel()", " ---  "
            + couples[i].partner1.name + " (Nivel " + couples[i].partner2.level + ") & "
            + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") [" + couples[i].level + "]")
        }
      }

    }
  }
  if (posibles.length == 0) {
    printError("getCouplesWithRangeLevel()", "Es necesario que repitan parejas")
    posibles.push(couples[position + 1])
  }

  return posibles
}

function getRival(sameCoupleLevel, rangeCoupleLevel) {
  if (sameCoupleLevel.length > 1) {
    // Obetener de forma aleatoria
    var min = 0
    var max = sameCoupleLevel.length - 1
    var random = Math.floor(Math.random() * (max - min + 1)) + min
    return sameCoupleLevel[random]
  }
  else if (sameCoupleLevel.length > 0) {
    // Obtener el único con el mismo nivel
    return sameCoupleLevel[0]
  }
  else if (rangeCoupleLevel.length > 1) {
    // Obetener de forma aleatoria
    var min = 0
    var max = rangeCoupleLevel.length - 1
    var random = Math.floor(Math.random() * (max - min + 1)) + min
    return rangeCoupleLevel[random]
  }
  else if (rangeCoupleLevel.length > 0) {
    // Obetener el único con el mismo nivel
    return rangeCoupleLevel[0]
  }
}



////////// GET MATCHES //////////

function getMatches2(couples) {
  var ignoreCouples = Array()
  var matches = Array()
  for (var i = 0; i < couples.length - 1; i++) {
    if (!ignoreCouples.includes(couples[i].code)) {
      printWarning("getRound2()", "Posible rivals for: "
        + couples[i].partner1.name + " (Nivel " + couples[i].partner1.level + ") & "
        + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") [" + couples[i].level + "]")

      var sameCoupleLevel = getCouplesWithSameLevel(i, couples, ignoreCouples)
      var rangeCoupleLevel = getCouplesWithRangeLevel(i, couples, ignoreCouples)

      var rival = getRival(sameCoupleLevel, rangeCoupleLevel)

      ignoreCouples.push(couples[i].code)
      ignoreCouples.push(rival.code)

      var match = {
        code: i,
        couple1: couples[i],
        couple2: rival
      }
      matches.push(match)

      printInfo("getRound2()", "New match ["
        + couples[i].partner1.name + " (Nivel " + couples[i].partner1.level + ") & "
        + couples[i].partner2.name + " (Nivel " + couples[i].partner2.level + ") vs "
        + rival.partner1.name + " (Nivel " + rival.partner2.level + ") & "
        + rival.partner2.name + " (Nivel " + rival.partner2.level + ")]")
    }
  }
  return matches
}