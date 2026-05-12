module.exports = {
  // A GitHub Pages-hez használt fix útvonal helyett relatív útvonalat használunk
  publicPath: './',
  
  // Opcionális: kikapcsolhatod a hash-elt fájlneveket, ha fix neveket akarsz, 
  // de a korábban írt PHP glob() függvényünk a hash-elt nevekkel is elboldogul.
  filenameHashing: true 
}