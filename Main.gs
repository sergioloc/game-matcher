/**
 * Source: github.com/sergioloc
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Partidos')
    .addItem('Generar ronda 1', 'generateRound1')
    .addItem('Generar ronda 2', 'generateRound2')
    .addItem('Generar ronda 3', 'generateRound3')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Configuración')
      .addItem('Borrar partidos', 'mySecondFunction')
      .addItem('Descargar partidos', 'myThirdFunction'))
    .addToUi();
};