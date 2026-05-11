<template>
  <div class="lese-layout">
    <div class="lese-tabs">
      <button @click="switchAufgabe(1)" :class="['tab-btn', { active: currentLeseAufgabe === 1 }]">Aufgabe 1</button>
      <button @click="switchAufgabe(2)" :class="['tab-btn', { active: currentLeseAufgabe === 2 }]">Aufgabe 2</button>
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

    <div v-if="currentLeseAufgabe === 2 && !showStatistics" class="lese-aufgabe2-wrapper">
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

    <div v-if="showStatistics" class="popup-overlay">
      <div class="popup-content">
        <h2>Aufgabe {{ currentLeseAufgabe }} vége</h2>
        <p v-if="currentLeseAufgabe === 1">Eredmény: <span class="correct-text">{{ correctAnswers }} / {{ totalTasks }}</span></p>
        <button @click="resetCurrentAufgabe" class="btn-popup-action">Újrakezdés</button>
      </div>
    </div>

  </div>
</template>

<script>
// Csak azt importáljuk az OsdData-ból, amire az olvasásnak szüksége van
import { leseTasks, leseTexts, leseAufgabe2Headings, leseAufgabe2Texts } from '../data/OsdLeseverstehenData.js';

export default {
  name: "OsdLeseverstehen",
  data() {
    return {
      // Adatok importálása
      leseTasks: leseTasks,
      leseTextData: leseTexts.universitaetLaufsteg,
      leseAufgabe2Headings: leseAufgabe2Headings,
      leseAufgabe2Texts: leseAufgabe2Texts,
      
      // Állapotváltozók
      currentLeseAufgabe: 1, 
      currentIdx: 0,
      isAnswered: false,
      isCorrect: null,
      selectedOption: null,
      correctAnswers: 0,
      showStatistics: false,

      // Aufgabe 2 specifikus
      answersA2: { 1: '', 2: '', 3: '', 4: '', 5: '' },
      isA2Checked: false,
    };
  },
  computed: {
    currentLeseTask() { 
      return this.leseTasks[this.currentIdx]; 
    },
    totalTasks() { 
      return this.currentLeseAufgabe === 1 ? this.leseTasks.length : this.leseAufgabe2Texts.length;
    },
    progressPercentage() { 
      if (this.totalTasks === 0) return 0;
      return (this.currentIdx / this.totalTasks) * 100; 
    },
    allA2Answered() {
      return Object.values(this.answersA2).every(val => val !== '');
    }
  },
  methods: {
    switchAufgabe(num) {
      this.currentLeseAufgabe = num;
      this.showStatistics = false;
    },
    // --- AUFGABE 1 METÓDUSOK ---
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
    // --- AUFGABE 2 METÓDUSOK ---
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
    resetCurrentAufgabe() {
      if (this.currentLeseAufgabe === 1) {
        this.currentIdx = 0;
        this.correctAnswers = 0;
        this.isAnswered = false;
        this.selectedOption = null;
      } else {
        this.resetA2();
      }
      this.showStatistics = false;
    }
  }
};
</script>

<style scoped>
/* IDE CSAK A LESEVERSTEHEN SPECIÁLIS STÍLUSAI KERÜLNEK */
.lese-layout {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  animation: fadeIn 0.4s ease;
}

/* --- ALMENÜ (FÜLEK) --- */
.lese-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lese-tabs .tab-btn {
  background: transparent !important;
  border: none !important;
  color: #bdc3c7 !important;
  padding: 12px 35px !important;
  border-radius: 30px !important;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

.lese-tabs .tab-btn:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.lese-tabs .tab-btn.active {
  background: #3498db !important;
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4) !important;
}

/* --- AUFGABE 1 --- */
.lese-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
}

.lese-text-panel {
  width: 100% !important;
  max-height: 500px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.lese-quiz-panel {
  width: 100% !important;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lese-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 20px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
}

/* --- AUFGABE 2 --- */
.lese-aufgabe2-wrapper {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
}

.headings-panel {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.headings-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 20px;
  font-size: 0.9rem;
  color: #ecf0f1;
}

.heading-item strong {
  color: #3498db;
  margin-right: 5px;
}

.texts-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.text-match-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.text-match-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.text-number {
  font-weight: bold;
  color: #3498db;
  font-size: 1.1rem;
}

.a2-select {
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  font-weight: bold;
  cursor: pointer;
}

.select-correct { background: #2ecc71 !important; color: white !important; }
.select-wrong { background: #e74c3c !important; color: white !important; }
.a2-correction { color: #e74c3c; font-weight: bold; margin-left: 10px; }

.match-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .headings-list { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .lese-text-panel { max-height: 400px; }
  .lese-card { padding: 20px; }
}

/* --- HIÁNYZÓ STÍLUSOK PÓTLÁSA --- */

/* Kék fejléc visszaállítása */
.panel-header {
  background: rgba(52, 152, 219, 0.2);
  padding: 12px 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #3498db;
}

/* Szövegdoboz görgethetősége és belső margója */
.scroll-text {
  padding: 30px;
  overflow-y: auto;
  text-align: left;
  line-height: 1.7;
  color: #ecf0f1;
  flex: 1; /* Kitölti a maradék helyet a fejléc alatt */
}

/* Egyedi, vékonyabb görgetősáv */
.scroll-text::-webkit-scrollbar { width: 6px; }
.scroll-text::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }

/* Kvíz válaszlehetőségek gombjai (A, B, C) */
.lese-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.opt-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 15px 20px;
  border-radius: 15px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.opt-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.opt-label {
  font-weight: bold;
  color: #3498db;
  font-size: 1.2rem;
}

/* Helyes és helytelen válaszok színei */
.opt-correct { background: rgba(46, 204, 113, 0.2) !important; border-color: #2ecc71 !important; }
.opt-wrong { background: rgba(231, 76, 60, 0.2) !important; border-color: #e74c3c !important; }
.opt-disabled { opacity: 0.6; cursor: not-allowed; }

/* Tovább gomb formázása */
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.btn-next, .btn-check {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next:hover, .btn-check:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

</style>