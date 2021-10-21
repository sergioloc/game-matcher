/**
 * Source: github.com/sergioloc
 */

var spreadsheetId = "17aEd8CZmtnQhCfNlE_j08ZvIpv36nXSOiDQBx7JNJbs"
var sheetPlayers = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Jugadores")
var sheetRound1 = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Ronda 1")
var sheetRound2 = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Ronda 2")
var sheetRound3 = SpreadsheetApp.openById(spreadsheetId).getSheetByName("Ronda 3")

var blue1 = "#c9daf8"
var blue2 = "#a4c2f4"
var red1 = "#f4cccc"
var red2= "#ea9999"

function cleanHistoric1() {
  sheetPlayers.getRangeList(['E2:E150']).clearContent()
}

function cleanHistoric2() {
  sheetPlayers.getRangeList(['F2:F150']).clearContent()
}

function cleanHistoric3() {
  sheetPlayers.getRangeList(['G2:G150']).clearContent()
}

function cleanRound(sheet) {
  sheet.getRangeList([
    'A3:A50', 'B3:B50', 'C3:C50', 'D3:D50', 'E3:E50', 'F3:F50', 'G3:G50', 'H3:H50', 'I3:I50',
    'J3:J50', 'K3:K50', 'L3:L50', 'M3:M50', 'N3:N50']).clearContent()

    sheet.getRangeList(['B3:B50', 'C3:C50', 'D3:D50']).setBackground(blue1)
    sheet.getRangeList(['E3:E50', 'F3:F50', 'G3:G50']).setBackground(blue2)
    sheet.getRangeList(['I3:I50', 'J3:J50', 'K3:K50']).setBackground(red1)
    sheet.getRangeList(['L3:L50', 'M3:M50', 'N3:N50']).setBackground(red2)
}

function cleanRounds() {
  cleanRound(sheetRound1)
  cleanRound(sheetRound2)
  cleanRound(sheetRound3)
}

function cleanHistorial() {
  cleanHistoric1()
  cleanHistoric2()
  cleanHistoric3()
}
