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
        <div v-if="(currentAufgabe === 1 && isA1Checked) || (currentAufgabe === 2 && isA2Checked)" class="result-display fade-in">
  <div class="score-card">
    <span class="score-label">Elért pontszám ebben a feladatban:</span>
    <span class="score-value">{{ currentAufgabe === 1 ? scoreA1 : scoreA2 }} / 10</span>
  </div>
  
  <div v-if="isA1Checked && isA2Checked" class="final-summary">
    <h3>Összesített eredmény: {{ totalScore }} / 20</h3>
    <p :class="totalScore >= 10 ? 'pass' : 'fail'">
      {{ totalScore >= 10 ? 'Sikeres vizsga! 🎉' : 'Sajnos ez most nem érte el a 10 pontos ponthatárt. ❌' }} [cite: 195, 196]
    </p>
  </div>
</div>
      </div>
    </div>

    <div v-if="currentAufgabe === 2" class="task-panel fade-in">
      <div class="panel-header">Aufgabe 2 (Lückentext / Tabelle)</div>
      <div class="content-box">
        <p class="instruction">Situation: Sie hören ein Gespräch zwischen zwei Personen. Ergänzen Sie die Informationen.</p>
        
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
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <label><input type="checkbox" v-model="a2[lib].schwerpunkt_allg" :disabled="isA2Checked"> allgemein</label><br>
                  <label><input type="checkbox" v-model="a2[lib].schwerpunkt_fach" :disabled="isA2Checked"> Fachliteratur</label>
                  <div v-if="isA2Checked" class="error-label">{{ correctAnswersA2[lib].schwerpunkt }}</div>
                </td>
              </tr>
              <tr v-for="row in [['Kosten Jahresausweis', 'kosten', ' Franken'], ['Ermäßigung Studierende', 'ermaessigung', ' %'], ['Ausleihdauer', 'dauer', ' Wochen']]" :key="row[1]">
                <td>{{ row[0] }}</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <input type="text" class="sm-input" v-model="a2[lib][row[1]]" :disabled="isA2Checked" :class="isCorrect(lib, row[1], a2[lib][row[1]])"> {{ row[2] }}
                  <div v-if="isA2Checked && isCorrect(lib, row[1], a2[lib][row[1]]) === 'wrong-input'" class="error-label">Helyes: {{ correctAnswersA2[lib][row[1]] }}</div>
                </td>
              </tr>
              <tr>
                <td>Buchausleihe</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <label><input type="checkbox" v-model="a2[lib].ausleihe_post" :disabled="isA2Checked"> Postversand</label><br>
                  <label><input type="checkbox" v-model="a2[lib].ausleihe_fern" :disabled="isA2Checked"> Fernleihe</label>
                  <div v-if="isA2Checked" class="error-label">{{ correctAnswersA2[lib].buchausleihe }}</div>
                </td>
              </tr>
              <tr>
                <td>Anmeldung</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <label><input type="checkbox" v-model="a2[lib].anmeldung_amt" :disabled="isA2Checked"> amtlicher Ausweis</label><br>
                  <label><input type="checkbox" v-model="a2[lib].anmeldung_adr" :disabled="isA2Checked"> Adressnachweis</label>
                  <div v-if="isA2Checked" class="error-label">{{ correctAnswersA2[lib].anmeldung }}</div>
                </td>
              </tr>
              <tr>
                <td>Serviceleistungen</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <label><input type="checkbox" v-model="a2[lib].service_les" :disabled="isA2Checked"> Lesungen</label><br>
                  <label v-if="lib === 'zb'"><input type="checkbox" v-model="a2[lib].service_caf" :disabled="isA2Checked"> Cafeteria</label>
                  <label v-else><input type="checkbox" v-model="a2[lib].service_lou" :disabled="isA2Checked"> Leselounge</label>
                  <div v-if="isA2Checked" class="error-label">{{ correctAnswersA2[lib].service }}</div>
                </td>
              </tr>
              <tr>
                <td>Zusätzliches Angebot</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <label><input type="checkbox" v-model="a2[lib].extra_wlan" :disabled="isA2Checked"> WLAN</label><br>
                  <label><input type="checkbox" v-model="a2[lib].extra_fuehr" :disabled="isA2Checked"> Führungen</label>
                  <div v-if="isA2Checked" class="error-label">{{ correctAnswersA2[lib].extra }}</div>
                </td>
              </tr>
              <tr>
                <td>Maximale Ausleihe</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  <input type="text" class="sm-input" v-model="a2[lib].max" :disabled="isA2Checked" :class="isCorrect(lib, 'max', a2[lib].max)"> Bücher
                  <div v-if="isA2Checked && isCorrect(lib, 'max', a2[lib].max) === 'wrong-input'" class="error-label">Helyes: {{ correctAnswersA2[lib].max }}</div>
                </td>
              </tr>
              <tr>
                <td>Öffnungszeiten</td>
                <td v-for="lib in ['uni', 'zb', 'lit']" :key="lib">
                  bis <input type="text" class="sm-input time" v-model="a2[lib].bis" :disabled="isA2Checked" :class="isCorrect(lib, 'bis', a2[lib].bis)"> Uhr
                  <div v-if="isA2Checked && isCorrect(lib, 'bis', a2[lib].bis) === 'wrong-input'" class="error-label">Helyes: bis {{ correctAnswersA2[lib].bis }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="button-group" style="margin-top:20px;">
          <button v-if="!isA2Checked" @click="checkA2" class="btn-check">Ellenőrzés</button>
          <button v-if="isA2Checked" @click="resetA2" class="btn-next">Újra</button>
        </div>
        <div v-if="(currentAufgabe === 1 && isA1Checked) || (currentAufgabe === 2 && isA2Checked)" class="result-display fade-in">
  <div class="score-card">
    <span class="score-label">Elért pontszám ebben a feladatban:</span>
    <span class="score-value">{{ currentAufgabe === 1 ? scoreA1 : scoreA2 }} / 10</span>
  </div>
  
  <div v-if="isA1Checked && isA2Checked" class="final-summary">
    <h3>Összesített eredmény: {{ totalScore }} / 20</h3>
    <p :class="totalScore >= 10 ? 'pass' : 'fail'">
      {{ totalScore >= 10 ? 'Sikeres vizsga! 🎉' : 'Sajnos ez most nem érte el a 10 pontos ponthatárt. ❌' }} [cite: 195, 196]
    </p>
  </div>
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
      a2: { uni: this.getEmptyCol(), zb: this.getEmptyCol(), lit: this.getEmptyCol() },
      correctAnswersA2: {
        uni: { schwerpunkt: "allgemein & Fachliteratur", kosten: "27", ermaessigung: "50", dauer: "2", buchausleihe: "Fernleihe", anmeldung: "amtlicher Ausweis", service: "Lesungen", extra: "WLAN & Führungen", max: "40", bis: "20:00" },
        zb: { schwerpunkt: "allgemein & Fachliteratur", kosten: "35", ermaessigung: "35", dauer: "3", buchausleihe: "Postversand", anmeldung: "amtlicher Ausweis", service: "Lesungen", extra: "WLAN", max: "35", bis: "19:00" },
        lit: { schwerpunkt: "Fachliteratur", kosten: "42", ermaessigung: "10", dauer: "3", buchausleihe: "keine", anmeldung: "amtlicher Ausweis & Adressnachweis", service: "Lesungen & Leselounge", extra: "WLAN", max: "3", bis: "16:00" }
      }
    };
  },
  computed: {
    audioSource() {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const fileName = this.currentAufgabe === 1 ? 'audio/ZB2_MS_A1_270917.mp3' : 'audio/ZB2_MS_A2_270917.mp3';
      return (isLocal ? '/' : '/perfekt-und-nomen/') + fileName + '?v=' + Date.now();
    },

    // AUFGABE 1 PONTSZÁMÍTÁS (PDF 3. oldal alapján)
    scoreA1() {
      let correctCount = 0;
      this.aufgabe1.forEach(task => {
        if (this.answersA1[task.id] === task.correct) {
          correctCount++;
        }
      });
      // Ponttáblázat [cite: 165]
      const tableA1 = { 10: 10, 9: 8, 8: 9, 7: 7, 6: 6, 5: 4, 4: 5, 3: 3, 2: 2, 1: 1, 0: 0 };
      return tableA1[correctCount] || 0;
    },

    // AUFGABE 2 PONTSZÁMÍTÁS (PDF 4. oldal alapján)
    scoreA2() {
      let messpunkte = 0;
      
      // Szöveges Messpunkte számítása (ahol egyezik, ott +1 pont) [cite: 189]
      const fields = ['kosten', 'ermaessigung', 'dauer', 'max', 'bis'];
      ['uni', 'zb', 'lit'].forEach(lib => {
        fields.forEach(field => {
          if (this.a2[lib][field].trim().toLowerCase() === this.correctAnswersA2[lib][field].toLowerCase()) {
            messpunkte += 1; // Minden helyes bejegyzés 1 Messpunkt [cite: 189, 171]
          }
        });
      });

      // Messpunkte -> Ergebnispunkte átváltás (PDF 4. oldal táblázata alapján) [cite: 194]
      if (messpunkte >= 43) return 10;
      if (messpunkte >= 40) return 9;
      if (messpunkte >= 37) return 8;
      if (messpunkte >= 33) return 7;
      if (messpunkte >= 29) return 6;
      if (messpunkte >= 24) return 5;
      if (messpunkte >= 19) return 4;
      if (messpunkte >= 14) return 3;
      if (messpunkte >= 9) return 2;
      if (messpunkte >= 4) return 1;
      return 0;
    },

    totalScore() {
      return this.scoreA1 + this.scoreA2; // Összesen max 20 pont [cite: 195]
    }
  },
  methods: {
    getEmptyCol() {
      return { schwerpunkt_allg: false, schwerpunkt_fach: false, kosten: "", ermaessigung: "", dauer: "", ausleihe_post: false, ausleihe_fern: false, anmeldung_amt: false, anmeldung_adr: false, service_les: false, service_caf: false, service_lou: false, extra_wlan: false, extra_fuehr: false, max: "", bis: "" };
    },
    isCorrect(lib, field, val) {
      if (!this.isA2Checked) return '';
      if (!val || val.trim() === '') return 'wrong-input';
      return val.trim().toLowerCase() === this.correctAnswersA2[lib][field].toLowerCase() ? 'correct-input' : 'wrong-input';
    },
    setA1(id, val) { if (!this.isA1Checked) this.answersA1[id] = val; },
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
/* KONSTRUKCIÓ */
.hoeren-layout { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 900px; margin: 0 auto; color: white; }
.hoeren-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 10px; }
.tab-btn { background: rgba(255,255,255,0.1); border: none; color: #bdc3c7; padding: 12px 30px; border-radius: 30px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.tab-btn.active { background: #3498db; color: white; }

/* PANELEK */
.audio-panel, .task-panel { background: rgba(255, 255, 255, 0.05); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; backdrop-filter: blur(10px); }
.panel-header { background: rgba(52, 152, 219, 0.2); padding: 12px 20px; font-weight: bold; color: #3498db; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-transform: uppercase; }
.audio-container, .content-box { padding: 25px; }
.custom-audio { width: 100%; border-radius: 50px; }

/* TÁBLÁZAT */
.table-scroll-wrapper { overflow-x: auto; border-radius: 10px; }
.hv-table { width: 100%; border-collapse: collapse; min-width: 800px; }
.hv-table th, .hv-table td { border: 1px solid rgba(255,255,255,0.1); padding: 15px; text-align: left; background: rgba(0,0,0,0.2); }
.hv-table th { background: rgba(52, 152, 219, 0.2); color: #3498db; }

/* INPUTOK JAVÍTÁSA */
.sm-input { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 8px; width: 60px; border-radius: 8px; text-align: center; outline: none; }
.correct-input { border: 2px solid #2ecc71 !important; background: rgba(46, 204, 113, 0.1) !important; }
.wrong-input { border: 2px solid #e74c3c !important; background: rgba(231, 76, 60, 0.1) !important; }
.error-label { color: #e74c3c; font-size: 0.75rem; margin-top: 5px; font-weight: bold; }

/* GOMBOK */
.btn-check, .btn-next { background: #3498db; color: white; border: none; padding: 12px 25px; border-radius: 25px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.btn-check:hover { background: #2980b9; }

/* AUFGABE 1 STÍLUSOK */
.tf-list { display: flex; flex-direction: column; gap: 15px; }
.tf-item { display: flex; align-items: center; background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 12px; }
.tf-num { width: 30px; font-weight: bold; color: #3498db; }
.tf-text { flex: 1; text-align: left; padding-right: 15px; }
.tf-btns { display: flex; gap: 10px; }
.tf-btn { width: 40px; height: 40px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-weight: bold; }
.tf-btn.active { background: #3498db; }
.tf-btn.correct { background: #2ecc71 !important; }
.tf-btn.wrong { background: #e74c3c !important; }
.correction-badge { color: #e74c3c; font-weight: bold; margin-left: 10px; }
.result-display {
  margin-top: 30px;
  padding: 20px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 15px;
  border: 1px solid #3498db;
  text-align: center;
}

.score-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  margin-left: 10px;
}

.final-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255,255,255,0.2);
}

.pass { color: #2ecc71; font-weight: bold; font-size: 1.2rem; }
.fail { color: #e74c3c; font-weight: bold; font-size: 1.2rem; }
</style>