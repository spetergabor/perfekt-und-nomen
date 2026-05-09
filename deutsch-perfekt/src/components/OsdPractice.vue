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

      <div v-if="selectedPart === 'lueckentext'">
        <div v-if="!showStatistics" class="quiz-area">
          <div class="progress-container">
            <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div></div>
          </div>
          <div class="text-card">
            <span class="instruction">Olvasd el a szöveget és írd be a hiányzó szót!</span>
            <div class="cloze-text"><span v-html="formattedText"></span></div>
          </div>
          <div class="input-wrapper">
            <input type="text" v-model="userAnswer" placeholder="..." :disabled="isAnswered" @keyup.enter="handleEnter" ref="answerInput" :class="{ 'input-correct': isAnswered && isCorrect, 'input-wrong': isAnswered && !isCorrect }" />
          </div>
          <div class="button-group">
            <button v-if="!isAnswered" @click="checkAnswer" class="btn-check" :disabled="!userAnswer.trim()">Ellenőrzés</button>
            <button v-if="isAnswered" @click="nextQuestion" class="btn-next">Következő</button>
          </div>
          <div v-if="isAnswered" :class="['feedback-box', isCorrect ? 'fb-correct' : 'fb-wrong']">
            <p v-if="!isCorrect" class="wrong-highlight">Helyes: <span>{{ currentTask.correct }}</span></p>
            <p class="explanation">{{ currentTask.explanation }}</p>
          </div>
        </div>
      </div>

      <div v-if="selectedPart === 'leseverstehen'" class="lese-layout">
        <div v-if="!showStatistics" class="lese-wrapper">
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
// HIVATKOZÁSOK IMPORTÁLÁSA
import { examInfo, lueckenTasks, leseTasks, leseText, schreibenTasks } from './OsdData.js';

export default {
  name: "OsdPractice",
  data() {
    return {
      selectedPart: null,
      showInfoPopup: false,
      examDetails: examInfo,
      tasks: lueckenTasks,
      leseTasks: leseTasks,
      leseTextData: leseText,
      schreibenTasks: schreibenTasks,
      showPhrases: false,
      userText: "",
      currentIdx: 0,
      userAnswer: "",
      isAnswered: false,
      isCorrect: null,
      selectedOption: null,
      correctAnswers: 0,
      showStatistics: false
    };
  },
  computed: {
    currentTask() { return this.tasks[this.currentIdx]; },
    currentLeseTask() { return this.leseTasks[this.currentIdx]; },
    currentSchreibenTask() { return this.schreibenTasks[0]; },
    totalTasks() { 
      if (this.selectedPart === 'leseverstehen') return this.leseTasks.length;
      return this.tasks.length; 
    },
    progressPercentage() { return (this.currentIdx / this.totalTasks) * 100; },
    formattedText() {
      if (!this.currentTask) return "";
      return `${this.currentTask.textBefore} <span class="gap">_______</span> ${this.currentTask.textAfter}`;
    },
    wordCount() {
      return this.userText.trim() ? this.userText.trim().split(/\s+/).length : 0;
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
    checkAnswer() {
      this.isCorrect = this.userAnswer.trim().toLowerCase() === this.currentTask.correct.toLowerCase();
      this.isAnswered = true;
      if (this.isCorrect) this.correctAnswers++;
    },
    nextQuestion() {
      if (this.currentIdx < this.totalTasks - 1) {
        this.currentIdx++; 
        this.isAnswered = false; 
        this.userAnswer = "";
      } else { 
        this.showStatistics = true; 
      }
    },
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
    resetExam() {
      this.currentIdx = 0; 
      this.correctAnswers = 0; 
      this.isAnswered = false;
      this.userAnswer = ""; 
      this.selectedOption = null; 
      this.showStatistics = false;
      this.userText = "";
      this.showPhrases = false;
    },
    handleEnter() {
      if (this.selectedPart === 'lueckentext') {
        if (!this.isAnswered) {
          this.checkAnswer();
        } else {
          this.nextQuestion();
        }
      }
    }
  }
};
</script>

<style scoped src="./OsdStyles.css"></style>