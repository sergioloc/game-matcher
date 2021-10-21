/**
 * Source: github.com/sergioloc
 */

function printInfo(fun, text) {
  if (isPrintInfoEnable())
    console.info(fun + " -> " + text)
}

function printWarning(fun, text) {
  if (isPrintWarningEnable())
    console.warn(fun + " -> " + text)
}

function printError(fun, text) {
  if (isPrintErrorEnable())
    console.error(fun + " -> " + text)
}

function printPlayerList(list) {
  if (isPrintPlayerEnable()) {
    for (var i = 0; i < list.length; i++) {
      printInfo("printPlayerList()", "[" + list[i].code + "] " + list[i].name + " (Nivel " + list[i].level + ")  [" + list[i].historic1 + "] [" + list.historic2 + "]")
    }
  }
}

function printCoupleList(list) {
  if (isPrintCouplesEnable()) {
    printWarning("printCoupleList()", "Couples:")
    for (var i = 0; i < list.length; i++) {
      var number = i + 1
      printInfo("printCoupleList()",
        number + ". "
        + list[i].partner1.name + " (Nivel " + list[i].partner1.level + ") & "
        + list[i].partner2.name + " (Nivel " + list[i].partner2.level + ")"
        + " [" + list[i].level + "]")
    }
  }
}

function printMatchList(list) {
  if (isPrintMatchesEnable()) {
    printWarning("printMatchList()", "Matches:")
    for (var i = 0; i < list.length; i++) {
      var number = i + 1
      printInfo("printMatchList()",
        number + ". "
        + list[i].couple1.partner1.name + " (Nivel " + list[i].couple1.partner1.level + ") & "
        + list[i].couple1.partner2.name + " (Nivel " + list[i].couple1.partner2.level + ") [" + list[i].couple1.level + "]  vs  "
        + list[i].couple2.partner1.name + " (Nivel " + list[i].couple2.partner1.level + ") & "
        + list[i].couple2.partner2.name + " (Nivel " + list[i].couple2.partner2.level + ") [" + list[i].couple2.level + "]"
      )
    }
  }
}