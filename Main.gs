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
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Limpiar')
      .addItem('Partidos', 'cleanRounds')
      .addItem('Historial', 'cleanHistorial'))
    .addToUi();
};
