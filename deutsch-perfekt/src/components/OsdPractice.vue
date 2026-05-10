<template>
  <div class="osd-practice">
    <div class="exam-header">
      <h1>ÖSD B2 Gyakorló</h1>
      <p class="exam-info">{{ selectedPart ? getPartName(selectedPart) : 'Válaszd ki a vizsgarészt!' }}</p>
      <button @click="showInfoPopup = true" class="info-icon-btn" title="Vizsgainformáció">ℹ️</button>
    </div>

    <div v-if="!selectedPart" class="case-selector">
      <div class="case-grid">
        <button @click="selectPart('lueckentext')" class="btn-case">
          <span class="part-icon">📝</span> Lückentext
        </button>
        <button @click="selectPart('leseverstehen')" class="btn-case">
          <span class="part-icon">📖</span> Leseverstehen
        </button>
        <button @click="selectPart('hoereverstehen')" class="btn-case">
          <span class="part-icon">🎧</span> Hörverstehen
        </button>
        <button @click="selectPart('schreiben')" class="btn-case">
          <span class="part-icon">✍️</span> Schreiben
        </button>
      </div>
    </div>

    <div v-else class="content-area">
      <button @click="selectedPart = null" class="back-to-sub">← Vissza az ÖSD menübe</button>

      <div v-if="selectedPart === 'lueckentext'" class="luecken-layout">
        <div class="panel-header">Aufgabe 3 - Lückentext</div>
        <div class="luecken-card">
          <p class="instruction">Olvasd el a szöveget, és egészítsd ki a hiányzó szórészleteket a vonalakra kattintva! (Max. 3 betű)</p>
          <hr class="divider"/>
          
          <div class="luecken-full-text">
            <h3>{{ lueckenData.title }}</h3>
            <p class="luecken-paragraph">
              <template v-for="part in lueckenData.parts" :key="part.id">
                <span class="text-part">{{ part.text }}</span>
                <span class="input-wrapper-inline">
                  <input 
                    type="text" 
                    v-model="answersLuecken[part.id]" 
                    :disabled="isLueckenChecked"
                    :class="['luecken-input', getLueckenClass(part.id)]"
                    maxlength="6"
                  />
                  <span class="gap-number">({{ part.id }})</span>
                  <span v-if="isLueckenChecked && !isLueckenCorrect(part.id)" class="luecken-correction">
                    {{ part.correct }}
                  </span>
                </span>
              </template>
              <span class="text-part">{{ lueckenData.ending }}</span>
            </p>
          </div>

        </div>
        <div class="button-group">
          <button v-if="!isLueckenChecked" @click="checkLuecken" class="btn-check">Ellenőrzés</button>
          <button v-if="isLueckenChecked" @click="resetLuecken" class="btn-next">Újra</button>
        </div>
      </div>

      <div v-if="selectedPart === 'leseverstehen'" class="lese-layout">
        
        <div class="lese-tabs">
          <button @click="currentLeseAufgabe = 1" :class="['tab-btn', { active: currentLeseAufgabe === 1 }]">Aufgabe 1</button>
          <button @click="currentLeseAufgabe = 2" :class="['tab-btn', { active: currentLeseAufgabe === 2 }]">Aufgabe 2</button>
        </div>

        <div v-if="currentLeseAufgabe === 1 && !showStatistics" class="lese-wrapper">
          <div class="lese-text-panel">
            <div class="panel-header">Test 1 - Aufgabe 1</div>
            <div class="scroll-text">
              <h3>{{ leseTextData.title }}</h3>
              <p class="sub-title">{{ leseTextData.subtitle }}</p>
              <div v-html="leseTextData.content"></div>
            </div>
          </div>
          <div class="lese-quiz-panel">
            <div class="progress-bar small"><div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div></div>
            <div class="lese-card" v-if="currentLeseTask">
              <p class="lese-question"><strong>{{ currentIdx + 1 }}.</strong> {{ currentLeseTask.question }}</p>
              <div class="lese-options">
                <button v-for="opt in currentLeseTask.options" :key="opt.id" @click="checkLeseAnswer(opt.id)" :disabled="isAnswered" :class="['opt-btn', getLeseBtnClass(opt.id)]">
                  <span class="opt-label">{{ opt.id }}</span> {{ opt.text }}
                </button>
              </div>
            </div>
            <div class="button-group" v-if="isAnswered">
              <button @click="nextLeseQuestion" class="btn-next">Következő</button>
            </div>
          </div>
        </div>

        <div v-if="currentLeseAufgabe === 2" class="lese-aufgabe2-wrapper">
          <div class="headings-panel">
            <div class="panel-header">Überschriften (A-K)</div>
            <div class="headings-list">
              <div v-for="heading in leseAufgabe2Headings" :key="heading.id" class="heading-item">
                <strong>{{ heading.id }}</strong>: {{ heading.text }}
              </div>
            </div>
          </div>

          <div class="texts-panel">
            <div v-for="textObj in leseAufgabe2Texts" :key="textObj.id" class="text-match-card">
              <div class="text-match-header">
                <span class="text-number">Text {{ textObj.id }}</span>
                <select v-model="answersA2[textObj.id]" :disabled="isA2Checked" :class="['a2-select', getA2SelectClass(textObj.id)]">
                  <option value="" disabled>Válassz...</option>
                  <option v-for="heading in leseAufgabe2Headings" :key="heading.id" :value="heading.id">
                    {{ heading.id }}
                  </option>
                </select>
                <span v-if="isA2Checked && answersA2[textObj.id] !== textObj.correct" class="a2-correction">
                  Helyes: {{ textObj.correct }}
                </span>
              </div>
              <p class="match-text">{{ textObj.text }}</p>
            </div>
            
            <div class="button-group">
              <button v-if="!isA2Checked" @click="checkAufgabe2" class="btn-check" :disabled="!allA2Answered">Ellenőrzés</button>
              <button v-if="isA2Checked" @click="resetA2" class="btn-next">Újra</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedPart === 'schreiben'" class="schreiben-layout">
        <div class="task-description">
          <div class="panel-header">{{ currentSchreibenTask.title }}</div>
          <div class="scroll-text">
            <p><strong>Szituáció:</strong> {{ currentSchreibenTask.situation }}</p>
            <p><strong>Hirdetés pontjai:</strong></p>
            <ul>
              <li v-for="(point, pIdx) in currentSchreibenTask.adPoints" :key="pIdx">{{ point }}</li>
            </ul>
            <p class="instruction">{{ currentSchreibenTask.instructions }}</p>
            
            <div class="phrases-container">
              <button @click="showPhrases = !showPhrases" class="btn-toggle-phrases">
                {{ showPhrases ? '💡 Kifejezések elrejtése' : '💡 Hasznos kifejezések megjelenítése' }}
              </button>
              <transition name="slide">
                <ul v-if="showPhrases" class="phrases-list">
                  <li v-for="(phrase, phIdx) in currentSchreibenTask.usefulPhrases" :key="phIdx">
                    {{ phrase }}
                  </li>
                </ul>
              </transition>
            </div>
          </div>
        </div>
        <div class="writing-area">
          <textarea v-model="userText" placeholder="Írja ide a levelet..." spellcheck="false"></textarea>
          <div :class="['word-count', wordCount >= 120 ? 'success' : 'warning']">
            Szavak száma: <strong>{{ wordCount }}</strong> / 120
          </div>
        </div>
      </div>

      <div v-if="selectedPart === 'hoereverstehen'" class="quiz-area">
        <div class="text-card" style="text-align: center; padding: 50px 20px;">
          <div style="font-size: 3rem; margin-bottom: 20px;">🎧</div>
          <h2>Hamarosan...</h2>
          <p>A Hörverstehen (hallás utáni értés) modul fejlesztés alatt áll.</p>
        </div>
      </div>

    </div>

    <div v-if="showStatistics" class="popup-overlay">
      <div class="popup-content">
        <h2>Vizsga vége</h2>
        <p>Eredmény: <span class="correct-text">{{ correctAnswers }} / {{ totalTasks }}</span></p>
        <button @click="resetExam" class="btn-popup-action">Újrakezdés</button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showInfoPopup" class="modal-overlay" @click.self="showInfoPopup = false">
        <div class="modal-content info-modal">
          <button class="close-modal" @click="showInfoPopup = false">×</button>
          <h2>{{ examDetails.title }}</h2>
          <div class="info-scroll-area">
            <div v-for="(section, index) in examDetails.sections" :key="index">
              <h3>{{ section.icon }} {{ section.name }}</h3>
              <p class="intro-text">{{ section.desc }}</p>
              <ul>
                <li v-for="(detail, dIndex) in section.details" :key="dIndex">{{ detail }}</li>
              </ul>
            </div>
          </div>
          <button @click="showInfoPopup = false" class="btn-popup-action">Értem</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// Import kiegészítve
import { examInfo, lueckenTextFull, leseTasks, leseTexts, schreibenTasks, leseAufgabe2Headings, leseAufgabe2Texts } from './OsdData.js';

export default {
  name: "OsdPractice",
  data() {
    return {
      selectedPart: null,
      showInfoPopup: false,
      examDetails: examInfo,
      
      // LESEVERSTEHEN AUFGABE 1 & SCHREIBEN VÁLTOZÓK
      leseTasks: leseTasks,
      leseTextData: leseTexts.universitaetLaufsteg, 
      schreibenTasks: schreibenTasks,

      // LÜCKENTEXT VÁLTOZÓK (ÚJ STRUKTÚRA)
      lueckenData: lueckenTextFull,
      answersLuecken: {},
      isLueckenChecked: false,
      
      // LESEVERSTEHEN AUFGABE 2 VÁLTOZÓK
      leseAufgabe2Headings: leseAufgabe2Headings,
      leseAufgabe2Texts: leseAufgabe2Texts,
      currentLeseAufgabe: 1, 
      answersA2: { 1: '', 2: '', 3: '', 4: '', 5: '' },
      isA2Checked: false,

      // KÖZÖS VÁLTOZÓK
      showPhrases: false,
      userText: "",
      currentIdx: 0,
      isAnswered: false,
      isCorrect: null,
      selectedOption: null,
      correctAnswers: 0,
      showStatistics: false
    };
  },
  computed: {
    currentLeseTask() { return this.leseTasks[this.currentIdx]; },
    currentSchreibenTask() { return this.schreibenTasks[0]; },
    totalTasks() { 
      if (this.selectedPart === 'leseverstehen' && this.currentLeseAufgabe === 1) return this.leseTasks.length;
      if (this.selectedPart === 'leseverstehen' && this.currentLeseAufgabe === 2) return this.leseAufgabe2Texts.length;
      return 0; 
    },
    progressPercentage() { 
      if (this.totalTasks === 0) return 0;
      return (this.currentIdx / this.totalTasks) * 100; 
    },
    wordCount() {
      return this.userText.trim() ? this.userText.trim().split(/\s+/).length : 0;
    },
    // LESEVERSTEHEN AUFGABE 2 COMPUTED
    allA2Answered() {
      return Object.values(this.answersA2).every(val => val !== '');
    }
  },
  methods: {
    selectPart(part) { 
      this.selectedPart = part; 
      this.resetExam(); 
    },
    getPartName(part) {
      const names = { 
        lueckentext: 'Lückentext', 
        leseverstehen: 'Leseverstehen', 
        hoereverstehen: 'Hörverstehen', 
        schreiben: 'Schreiben' 
      };
      return names[part];
    },

    // --- LESEVERSTEHEN AUFGABE 1 METÓDUSOK ---
    checkLeseAnswer(optId) {
      if (this.isAnswered) return;
      this.selectedOption = optId;
      this.isCorrect = optId === this.currentLeseTask.correct;
      this.isAnswered = true;
      if (this.isCorrect) this.correctAnswers++;
    },
    getLeseBtnClass(optId) {
      if (!this.isAnswered) return '';
      if (optId === this.currentLeseTask.correct) return 'opt-correct';
      if (this.selectedOption === optId && !this.isCorrect) return 'opt-wrong';
      return 'opt-disabled';
    },
    nextLeseQuestion() {
      if (this.currentIdx < this.totalTasks - 1) {
        this.currentIdx++; 
        this.isAnswered = false; 
        this.selectedOption = null;
      } else { 
        this.showStatistics = true; 
      }
    },

    // --- LÜCKENTEXT METÓDUSOK (ÚJ) ---
    checkLuecken() {
      this.isLueckenChecked = true;
    },
    isLueckenCorrect(id) {
      const correct = this.lueckenData.parts.find(p => p.id === id).correct;
      // Levágjuk a szóközöket, kisbetűsítjük, és kivesszük az oda nem illő írásjeleket a vizsgázó válaszából
      const answer = (this.answersLuecken[id] || "").trim().toLowerCase().replace(/[^a-zäöüß-]/g, '');
      const correctClean = correct.toLowerCase().replace(/[^a-zäöüß-]/g, '');
      
      // Különleges kivétel: a vizsgán a 7-es válasznál a "der" és a "dieser" is helyes
      if (id === 7 && (answer === "der" || answer === "dieser")) return true;
      
      return answer === correctClean;
    },
    getLueckenClass(id) {
      if (!this.isLueckenChecked) return '';
      return this.isLueckenCorrect(id) ? 'luecken-correct' : 'luecken-wrong';
    },
    resetLuecken() {
      this.answersLuecken = {};
      this.isLueckenChecked = false;
    },

    // --- LESEVERSTEHEN AUFGABE 2 METÓDUSOK ---
    checkAufgabe2() {
      this.isA2Checked = true;
    },
    getA2SelectClass(textId) {
      if (!this.isA2Checked) return '';
      const correct = this.leseAufgabe2Texts.find(t => t.id === textId).correct;
      return this.answersA2[textId] === correct ? 'select-correct' : 'select-wrong';
    },
    resetA2() {
      this.answersA2 = { 1: '', 2: '', 3: '', 4: '', 5: '' };
      this.isA2Checked = false;
    },

    // --- KÖZÖS RESET METÓDUS ---
    resetExam() {
      this.currentIdx = 0; 
      this.correctAnswers = 0; 
      this.isAnswered = false;
      this.selectedOption = null; 
      this.showStatistics = false;
      this.userText = "";
      this.showPhrases = false;
      this.currentLeseAufgabe = 1; 
      this.resetA2(); 
      this.resetLuecken(); 
    }
  }
};
</script>

<style scoped src="./OsdStyles.css"></style>