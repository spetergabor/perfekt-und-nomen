<template>
  <div class="hoeren-layout">
    
    <div class="audio-panel">
      <div class="panel-header">Audio Player - Aufgabe {{ currentAufgabe }}</div>
      <div class="audio-container">
        <audio controls class="custom-audio" preload="metadata" :key="currentAufgabe" :src="audioSource">
          A böngésződ nem támogatja az audio elemet.
        </audio>
        <p class="audio-info" v-if="currentAufgabe === 1">
          Hallgasd meg a felvételt és oldd meg az 1. feladatot. (A vizsgán ezt 2x hallhatod).
        </p>
        <p class="audio-info" v-else>
          Hallgasd meg a felvételt és oldd meg a 2. feladatot. (A vizsgán ezt 1x hallhatod).
        </p>
      </div>
    </div>

    <div class="hoeren-tabs">
      <button @click="currentAufgabe = 1" :class="['tab-btn', { active: currentAufgabe === 1 }]">Aufgabe 1</button>
      <button @click="currentAufgabe = 2" :class="['tab-btn', { active: currentAufgabe === 2 }]">Aufgabe 2</button>
    </div>

    <div v-if="currentAufgabe === 1" class="task-panel fade-in">
      <div class="panel-header">Aufgabe 1 (Richtig / Falsch)</div>
      <div class="content-box">
        <p class="instruction">Situation: Sie hören jetzt eine Radiosendung. Lesen Sie die folgenden Aussagen und kreuzen Sie jeweils die richtige Lösung an.</p>
        
        <div class="tf-list">
          <div v-for="task in aufgabe1" :key="task.id" class="tf-item">
            <span class="tf-num">{{ task.id }}.</span>
            <span class="tf-text">{{ task.text }}</span>
            <div class="tf-btns">
              <button 
                @click="setA1(task.id, 'R')" 
                :disabled="isA1Checked"
                :class="['tf-btn', { active: answersA1[task.id] === 'R', correct: isA1Checked && task.correct === 'R' && answersA1[task.id] === 'R', wrong: isA1Checked && answersA1[task.id] === 'R' && task.correct !== 'R' }]"
              >R</button>
              <button 
                @click="setA1(task.id, 'F')" 
                :disabled="isA1Checked"
                :class="['tf-btn', { active: answersA1[task.id] === 'F', correct: isA1Checked && task.correct === 'F' && answersA1[task.id] === 'F', wrong: isA1Checked && answersA1[task.id] === 'F' && task.correct !== 'F' }]"
              >F</button>
            </div>
            <span v-if="isA1Checked && answersA1[task.id] !== task.correct" class="correction-badge">
              Helyes: {{ task.correct }}
            </span>
          </div>
        </div>

        <div class="button-group">
          <button v-if="!isA1Checked" @click="checkA1" class="btn-check">Ellenőrzés</button>
          <button v-if="isA1Checked" @click="resetA1" class="btn-next">Újra</button>
        </div>
      </div>
    </div>

    <div v-if="currentAufgabe === 2" class="task-panel fade-in">
      <div class="panel-header">Aufgabe 2 (Lückentext / Tabelle)</div>
      <div class="content-box">
        <p class="instruction">Situation: Sie hören ein Gespräch. Ergänzen Sie die fehlenden Informationen (Kreuzchen oder Text/Zahlen).</p>
        
        <div class="table-scroll-wrapper">
          <table class="hv-table">
            <thead>
              <tr>
                <th>Bibliotheken</th>
                <th>Universitätsbibliothek</th>
                <th>ZB (Zentralbib.)</th>
                <th>Literaturarchiv</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Schwerpunkt</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.uni.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.zb.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.lit.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                </td>
              </tr>
              <tr>
                <td>Kosten Jahresausweis</td>
                <td><input type="text" class="sm-input" v-model="a2.uni.kosten" :disabled="isA2Checked"> Franken</td>
                <td><input type="text" class="sm-input" v-model="a2.zb.kosten" :disabled="isA2Checked"> Franken</td>
                <td><input type="text" class="sm-input" v-model="a2.lit.kosten" :disabled="isA2Checked"> Franken</td>
              </tr>
              <tr>
                <td>Ermäßigung Studierende</td>
                <td><input type="text" class="sm-input" v-model="a2.uni.ermaessigung" :disabled="isA2Checked"> %</td>
                <td>ca. <input type="text" class="sm-input" v-model="a2.zb.ermaessigung" :disabled="isA2Checked"> %</td>
                <td>ca. <input type="text" class="sm-input" v-model="a2.lit.ermaessigung" :disabled="isA2Checked"> %</td>
              </tr>
              <tr>
                <td>Ausleihdauer</td>
                <td><input type="text" class="sm-input" v-model="a2.uni.dauer" :disabled="isA2Checked"> Wochen</td>
                <td><input type="text" class="sm-input" v-model="a2.zb.dauer" :disabled="isA2Checked"> Wochen</td>
                <td><input type="text" class="sm-input" v-model="a2.lit.dauer" :disabled="isA2Checked"> Wochen</td>
              </tr>
              <tr>
                <td>Buchausleihe (außer vor Ort)</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.uni.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.zb.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.lit.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                </td>
              </tr>
              <tr>
                <td>Bei Anmeldung nötig</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.anmeldung_amt" :disabled="isA2Checked"> amtl. Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.uni.anmeldung_adresse" :disabled="isA2Checked"> Adressnachweis</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.anmeldung_amt" :disabled="isA2Checked"> amtl. Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.zb.anmeldung_adresse" :disabled="isA2Checked"> Adressnachweis</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.anmeldung_amt" :disabled="isA2Checked"> amtl. Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.lit.anmeldung_adresse" :disabled="isA2Checked"> Adressnachweis</label>
                </td>
              </tr>
              <tr>
                <td>Serviceleistungen</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.service_lesung" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.uni.service_cafe" :disabled="isA2Checked"> Cafeteria</label><br>
                  <label><input type="checkbox" v-model="a2.uni.service_lounge" :disabled="isA2Checked"> Leselounge</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.service_lesung" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.zb.service_cafe" :disabled="isA2Checked"> Cafeteria</label><br>
                  <label><input type="checkbox" v-model="a2.zb.service_lounge" :disabled="isA2Checked"> Leselounge</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.service_lesung" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.lit.service_cafe" :disabled="isA2Checked"> Cafeteria</label><br>
                  <label><input type="checkbox" v-model="a2.lit.service_lounge" :disabled="isA2Checked"> Leselounge</label>
                </td>
              </tr>
              <tr>
                <td>Zusätzliches Angebot</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.zusatz_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.uni.zusatz_fuehrung" :disabled="isA2Checked"> Führungen</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.zusatz_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.zb.zusatz_fuehrung" :disabled="isA2Checked"> Führungen</label>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.zusatz_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.lit.zusatz_fuehrung" :disabled="isA2Checked"> Führungen</label>
                </td>
              </tr>
              <tr>
                <td>Maximale Ausleihe</td>
                <td><input type="text" class="sm-input" v-model="a2.uni.max_buch" :disabled="isA2Checked"> Bücher</td>
                <td><input type="text" class="sm-input" v-model="a2.zb.max_buch" :disabled="isA2Checked"> Bücher</td>
                <td><input type="text" class="sm-input" v-model="a2.lit.max_buch" :disabled="isA2Checked"> Bücher</td>
              </tr>
              <tr>
                <td>Öffnungszeiten</td>
                <td>von <input type="text" class="sm-input time" v-model="a2.uni.zeit_von" :disabled="isA2Checked"> bis <input type="text" class="sm-input time" v-model="a2.uni.zeit_bis" :disabled="isA2Checked"> Uhr</td>
                <td>von <input type="text" class="sm-input time" v-model="a2.zb.zeit_von" :disabled="isA2Checked"> bis <input type="text" class="sm-input time" v-model="a2.zb.zeit_bis" :disabled="isA2Checked"> Uhr</td>
                <td>von <input type="text" class="sm-input time" v-model="a2.lit.zeit_von" :disabled="isA2Checked"> bis <input type="text" class="sm-input time" v-model="a2.lit.zeit_bis" :disabled="isA2Checked"> Uhr</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="button-group" style="margin-top:20px;">
          <button v-if="!isA2Checked" @click="checkA2" class="btn-check">Ellenőrzés</button>
          <button v-if="isA2Checked" @click="resetA2" class="btn-next">Újra</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hoerenAufgabe1 } from '../data/OsdHoerverstehenData.js';

export default {
  name: "OsdHoerverstehen",
  data() {
    return {
      currentAufgabe: 1,
      aufgabe1: hoerenAufgabe1,
      answersA1: {},
      isA1Checked: false,
      
      isA2Checked: false,
      a2: {
        uni: this.getEmptyCol(),
        zb: this.getEmptyCol(),
        lit: this.getEmptyCol()
      }
    };
  },
computed: {
    audioSource() {
      // Ezek a "raw" (nyers) linkek, amiket a böngésző közvetlenül le tud játszani
      const audio1 = 'https://raw.githubusercontent.com/spetergabor/perfekt-und-nomen/main/deutsch-perfekt/public/audio/ZB2_MS_A1_270917.mp3';
      const audio2 = 'https://raw.githubusercontent.com/spetergabor/perfekt-und-nomen/main/deutsch-perfekt/public/audio/ZB2_MS_A2_270917.mp3';
      
      return this.currentAufgabe === 1 ? audio1 : audio2;
    }
  },
  methods: {
    setA1(id, value) {
      if (!this.isA1Checked) {
        this.answersA1[id] = value;
      }
    },
    checkA1() {
      this.isA1Checked = true;
    },
    resetA1() {
      this.answersA1 = {};
      this.isA1Checked = false;
    },
    getEmptyCol() {
      return {
        schwerpunkt_allg: false, schwerpunkt_fach: false, kosten: "", ermaessigung: "", dauer: "",
        ausleihe_post: false, ausleihe_fern: false, anmeldung_amt: false, anmeldung_adresse: false,
        service_lesung: false, service_cafe: false, service_lounge: false, zusatz_wlan: false, zusatz_fuehrung: false,
        max_buch: "", zeit_von: "", zeit_bis: ""
      };
    },
    checkA2() {
      this.isA2Checked = true;
    },
    resetA2() {
      this.a2 = { uni: this.getEmptyCol(), zb: this.getEmptyCol(), lit: this.getEmptyCol() };
      this.isA2Checked = false;
    }
  }
};
</script>

<style scoped>
.hoeren-layout { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 900px; margin: 0 auto; }
.hoeren-tabs { display: flex; justify-content: center; gap: 10px; padding: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 40px; width: fit-content; margin: 0 auto; }
.tab-btn { background: transparent; border: none; color: #bdc3c7; padding: 12px 35px; border-radius: 30px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; }
.tab-btn.active { background: #3498db; color: white; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4); }
.audio-panel, .task-panel { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
.panel-header { background: rgba(52, 152, 219, 0.2); padding: 12px 20px; font-weight: bold; color: #3498db; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: left; }
.audio-container { padding: 20px; text-align: center; }
.custom-audio { width: 100%; height: 45px; border-radius: 25px; outline: none; }
.audio-info { margin-top: 15px; font-size: 0.9rem; color: #bdc3c7; }
.content-box { padding: 25px; }
.instruction { color: #f1c40f; background: rgba(241, 196, 15, 0.1); padding: 15px; border-left: 4px solid #f1c40f; margin-bottom: 25px; text-align: left; }
.tf-list { display: flex; flex-direction: column; gap: 15px; }
.tf-item { display: flex; align-items: center; background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 12px; border: 1px inset rgba(255, 255, 255, 0.05); }
.tf-num { font-weight: bold; color: #3498db; width: 30px; font-size: 1.1rem; }
.tf-text { flex: 1; text-align: left; color: #ecf0f1; padding-right: 20px; line-height: 1.4; }
.tf-btns { display: flex; gap: 8px; }
.tf-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; width: 40px; height: 40px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; }
.tf-btn.active { background: #3498db; border-color: #3498db; }
.tf-btn.correct { background: #2ecc71 !important; border-color: #2ecc71 !important; }
.tf-btn.wrong { background: #e74c3c !important; border-color: #e74c3c !important; }
.correction-badge { margin-left: 15px; color: #e74c3c; font-weight: bold; }
.table-scroll-wrapper { overflow-x: auto; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); }
.hv-table { width: 100%; min-width: 800px; border-collapse: collapse; text-align: left; color: #ecf0f1; }
.hv-table th, .hv-table td { padding: 15px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.2); }
.hv-table th { background: rgba(52, 152, 219, 0.2); color: #3498db; font-weight: bold; }
.hv-table td { vertical-align: top; font-size: 0.95rem; }
.hv-table label { cursor: pointer; display: inline-block; margin-bottom: 5px; }
.hv-table input[type="checkbox"] { accent-color: #3498db; transform: scale(1.2); margin-right: 8px; }
.sm-input { width: 50px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 5px; border-radius: 5px; text-align: center; }
.sm-input.time { width: 60px; }
.sm-input:focus { outline: none; border-color: #f1c40f; background: rgba(255, 255, 255, 0.2); }
.button-group { display: flex; justify-content: flex-end; }
.btn-check, .btn-next { background: #3498db; color: white; border: none; padding: 12px 30px; border-radius: 30px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>