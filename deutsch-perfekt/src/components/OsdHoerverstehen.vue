<template>
  <div class="hoeren-layout">
    
    <div class="audio-panel">
      <div class="panel-header">Audio Player - Aufgabe {{ currentAufgabe }}</div>
      <div class="audio-container">
        <audio controls class="custom-audio" preload="metadata" :key="audioSource" :src="audioSource">
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

        <div class="button-group" style="margin-top: 20px;">
          <button v-if="!isA1Checked" @click="checkA1" class="btn-check">Ellenőrzés</button>
          <button v-if="isA1Checked" @click="resetA1" class="btn-next">Újra</button>
        </div>
      </div>
    </div>

    <div v-if="currentAufgabe === 2" class="task-panel fade-in">
      <div class="panel-header">Aufgabe 2 (Lückentext / Tabelle)</div>
      <div class="content-box">
        <p class="instruction">Situation: Sie hören ein Gespräch zwischen zwei Personen. Ergänzen Sie die Informationen[cite: 61, 62].</p>
        
        <div class="table-scroll-wrapper">
          <table class="hv-table">
            <thead>
              <tr>
                <th>Bibliotheken [cite: 64]</th>
                <th>Universitätsbibliothek [cite: 65]</th>
                <th>ZB (Zentralbib.) [cite: 68]</th>
                <th>Literaturarchiv [cite: 66]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Schwerpunkt [cite: 71]</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.uni.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.schwerpunkt }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.zb.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.schwerpunkt }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2.lit.schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.schwerpunkt }}</div>
                </td>
              </tr>
              <tr>
                <td>Kosten Jahresausweis [cite: 81]</td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.uni.kosten" :disabled="isA2Checked" :class="isCorrect('uni', 'kosten', a2.uni.kosten)"> Franken
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.kosten }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.zb.kosten" :disabled="isA2Checked" :class="isCorrect('zb', 'kosten', a2.zb.kosten)"> Franken
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.kosten }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.lit.kosten" :disabled="isA2Checked" :class="isCorrect('lit', 'kosten', a2.lit.kosten)"> Franken
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.kosten }}</div>
                </td>
              </tr>
              <tr>
                <td>Ermäßigung Studierende [cite: 86, 92]</td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.uni.ermaessigung" :disabled="isA2Checked" :class="isCorrect('uni', 'ermaessigung', a2.uni.ermaessigung)"> %
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.ermaessigung }}%</div>
                </td>
                <td>
                  ca. <input type="text" class="sm-input" v-model="a2.zb.ermaessigung" :disabled="isA2Checked" :class="isCorrect('zb', 'ermaessigung', a2.zb.ermaessigung)"> %
                  <div v-if="isA2Checked" class="correct-label">ca. {{ correctAnswersA2.zb.ermaessigung }}%</div>
                </td>
                <td>
                  ca. <input type="text" class="sm-input" v-model="a2.lit.ermaessigung" :disabled="isA2Checked" :class="isCorrect('lit', 'ermaessigung', a2.lit.ermaessigung)"> %
                  <div v-if="isA2Checked" class="correct-label">ca. {{ correctAnswersA2.lit.ermaessigung }}%</div>
                </td>
              </tr>
              <tr>
                <td>Ausleihdauer [cite: 93]</td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.uni.dauer" :disabled="isA2Checked" :class="isCorrect('uni', 'dauer', a2.uni.dauer)"> Wochen
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.dauer }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.zb.dauer" :disabled="isA2Checked" :class="isCorrect('zb', 'dauer', a2.zb.dauer)"> Wochen
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.dauer }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.lit.dauer" :disabled="isA2Checked" :class="isCorrect('lit', 'dauer', a2.lit.dauer)"> Wochen
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.dauer }}</div>
                </td>
              </tr>
              <tr>
                <td>Buchausleihe (außer vor Ort) [cite: 103]</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.uni.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.buchausleihe }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.zb.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.buchausleihe }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2.lit.ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.buchausleihe }}</div>
                </td>
              </tr>
              <tr>
                <td>Bei Anmeldung nötig [cite: 107, 114]</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.anmeldung_amt" :disabled="isA2Checked"> amtlicher Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.uni.anmeldung_adr" :disabled="isA2Checked"> Adressnachweis</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.anmeldung }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.anmeldung_amt" :disabled="isA2Checked"> amtlicher Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.zb.anmeldung_adr" :disabled="isA2Checked"> Adressnachweis</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.anmeldung }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.anmeldung_amt" :disabled="isA2Checked"> amtlicher Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2.lit.anmeldung_adr" :disabled="isA2Checked"> Adressnachweis</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.anmeldung }}</div>
                </td>
              </tr>
              <tr>
                <td>Serviceleistungen [cite: 124]</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.service_les" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.uni.service_lou" :disabled="isA2Checked"> Leselounge</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.service }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.service_les" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.zb.service_caf" :disabled="isA2Checked"> Cafeteria</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.service }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.service_les" :disabled="isA2Checked"> Lesungen</label><br>
                  <label><input type="checkbox" v-model="a2.lit.service_lou" :disabled="isA2Checked"> Leselounge</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.service }}</div>
                </td>
              </tr>
              <tr>
                <td>Zusätzliches Angebot [cite: 135]</td>
                <td>
                  <label><input type="checkbox" v-model="a2.uni.extra_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.uni.extra_fuehr" :disabled="isA2Checked"> Führungen</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.extra }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.zb.extra_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.zb.extra_fuehr" :disabled="isA2Checked"> Führungen</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.extra }}</div>
                </td>
                <td>
                  <label><input type="checkbox" v-model="a2.lit.extra_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2.lit.extra_fuehr" :disabled="isA2Checked"> Führungen</label>
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.extra }}</div>
                </td>
              </tr>
              <tr>
                <td>Maximale Ausleihe [cite: 145]</td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.uni.max" :disabled="isA2Checked" :class="isCorrect('uni', 'max', a2.uni.max)"> Bücher
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.uni.max }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.zb.max" :disabled="isA2Checked" :class="isCorrect('zb', 'max', a2.zb.max)"> Bücher
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.zb.max }}</div>
                </td>
                <td>
                  <input type="text" class="sm-input" v-model="a2.lit.max" :disabled="isA2Checked" :class="isCorrect('lit', 'max', a2.lit.max)"> Bücher
                  <div v-if="isA2Checked" class="correct-label">{{ correctAnswersA2.lit.max }}</div>
                </td>
              </tr>
              <tr>
                <td>Öffnungszeiten [cite: 146]</td>
                <td>
                  von 8:00 bis <input type="text" class="sm-input time" v-model="a2.uni.bis" :disabled="isA2Checked" :class="isCorrect('uni', 'bis', a2.uni.bis)"> Uhr
                  <div v-if="isA2Checked" class="correct-label">bis {{ correctAnswersA2.uni.bis }}</div>
                </td>
                <td>
                  von 8:00 bis <input type="text" class="sm-input time" v-model="a2.zb.bis" :disabled="isA2Checked" :class="isCorrect('zb', 'bis', a2.zb.bis)"> Uhr
                  <div v-if="isA2Checked" class="correct-label">bis {{ correctAnswersA2.zb.bis }}</div>
                </td>
                <td>
                  von 10:00 bis <input type="text" class="sm-input time" v-model="a2.lit.bis" :disabled="isA2Checked" :class="isCorrect('lit', 'bis', a2.lit.bis)"> Uhr
                  <div v-if="isA2Checked" class="correct-label">bis {{ correctAnswersA2.lit.bis }}</div>
                </td>
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
      },
      // Helyes megoldások a PDF alapján 
      correctAnswersA2: {
        uni: {
          schwerpunkt: "allgemein & Fachliteratur",
          kosten: "27",
          ermaessigung: "50",
          dauer: "2",
          buchausleihe: "Fernleihe",
          anmeldung: "amtlicher Ausweis",
          service: "Lesungen",
          extra: "WLAN & Führungen",
          max: "40",
          bis: "20:00"
        },
        zb: {
          schwerpunkt: "allgemein & Fachliteratur",
          kosten: "35",
          ermaessigung: "35",
          dauer: "3",
          buchausleihe: "Postversand",
          anmeldung: "amtlicher Ausweis",
          service: "Lesungen",
          extra: "WLAN",
          max: "35",
          bis: "19:00"
        },
        lit: {
          schwerpunkt: "Fachliteratur",
          kosten: "42",
          ermaessigung: "10",
          dauer: "3",
          buchausleihe: "keine",
          anmeldung: "amtlicher Ausweis & Adressnachweis",
          service: "Lesungen & Leselounge",
          extra: "WLAN",
          max: "3",
          bis: "16:00"
        }
      }
    };
  },
  computed: {
    audioSource() {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const fileName = this.currentAufgabe === 1 ? 'audio/ZB2_MS_A1_270917.mp3' : 'audio/ZB2_MS_A2_270917.mp3';
      const version = '?v=' + Date.now();
      return isLocal ? '/' + fileName + version : '/perfekt-und-nomen/' + fileName + version;
    }
  },
  methods: {
    getEmptyCol() {
      return {
        schwerpunkt_allg: false, schwerpunkt_fach: false,
        kosten: "", ermaessigung: "", dauer: "",
        ausleihe_post: false, ausleihe_fern: false,
        anmeldung_amt: false, anmeldung_adr: false,
        service_les: false, service_caf: false, service_lou: false,
        extra_wlan: false, extra_fuehr: false,
        max: "", von: "", bis: ""
      };
    },
    
    // Ellenőrző metódus a színekhez
    isCorrect(category, subCategory, userValue) {
      if (!this.isA2Checked) return '';
      
      const correct = this.correctAnswersA2[category][subCategory];
      
      // Ha üres a bevitel
      if (!userValue || userValue.toString().trim() === '') {
        return 'wrong-input';
      }
      
      // Összehasonlítás (szóközök és kis/nagybetű nem számít)
      const isMatch = userValue.toString().toLowerCase().trim() === correct.toString().toLowerCase().trim();
      
      return isMatch ? 'correct-input' : 'wrong-input';
    },

    setA1(id, value) { if (!this.isA1Checked) this.answersA1[id] = value; },
    checkA1() { this.isA1Checked = true; },
    resetA1() { this.answersA1 = {}; this.isA1Checked = false; },
    
    checkA2() { this.isA2Checked = true; },
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
.sm-input { width: 60px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); color: white; padding: 5px; border-radius: 5px; text-align: center; }
.btn-check, .btn-next { background: #3498db; color: white; border: none; padding: 10px 25px; border-radius: 20px; cursor: pointer; font-weight: bold; }
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.correct-text {
  color: #2ecc71;
  font-size: 0.8rem;
  font-weight: bold;
  margin-top: 4px;
  display: block;
}

/* Opcionális: a disabled inputokat tegyük kicsit olvashatóbbá */
input:disabled {
  opacity: 0.7;
  color: #ecf0f1;
  background: rgba(255,255,255,0.05);
}

.correct-input {
  border: 2px solid #2ecc71 !important;
  background: rgba(46, 204, 113, 0.1) !important;
}

.wrong-input {
  border: 2px solid #e74c3c !important;
  background: rgba(231, 76, 60, 0.1) !important;
}

.correct-label {
  color: #2ecc71;
  font-size: 0.75rem;
  margin-top: 5px;
  font-weight: bold;
}
</style> 