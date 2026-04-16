<template>
  <div class="verb-practice">
    <h1>Nomen-Verb-Verbindungen</h1>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (currentRoundQuestionIndex * 10) + '%' }"></div>
      </div>
      <p class="progress-text">Kérdés: <strong>{{ currentRoundQuestionIndex }}</strong> / 10</p>
    </div>

    <div v-if="currentQuestion && !showStatistics" class="quiz-area">
      <div class="question-card">
        <h2 class="nomen-display">{{ currentQuestion.nomen }} ...</h2>
        <p class="meaning">({{ currentQuestion.meaning }})</p>
      </div>

      <div class="input-wrapper">
        <input
          type="text"
          v-model="userAnswer"
          placeholder="Írd be az igét..."
          :disabled="isAnswered"
          @keyup.enter="handleEnter"
          ref="answerInput"
          :class="{ 'input-correct': isAnswered && isCorrect, 'input-wrong': isAnswered && isCorrect === false }"
        />
        <span v-if="isAnswered && isCorrect" class="input-icon correct-icon">✓</span>
        <span v-if="isAnswered && isCorrect === false" class="input-icon wrong-icon">✗</span>
      </div>
      
      <div class="button-group">
        <button v-if="!isAnswered" @click="checkAnswer" class="btn-check" :disabled="!userAnswer.trim()">Ellenőrzés</button>
        <button v-if="isAnswered" @click="nextQuestion" class="btn-next">Következő</button>
      </div>

      <transition name="fade">
        <div v-if="feedback" :class="['feedback-box', isCorrect ? 'fb-correct' : 'fb-wrong']">
          <p v-if="!isCorrect" class="wrong-highlight">Helyes válasz: <span>{{ currentQuestion.verb }}</span></p>
          <p class="feedback-text">{{ feedback }}</p>
          
          <div class="example-box">
            <div class="german-example">
              <strong>Beispiel:</strong>
              <p>{{ currentQuestion.example }}</p>
            </div>
            <div class="hungarian-translation">
              <strong>Magyarul:</strong>
              <p>{{ currentQuestion.translation }}</p>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div v-if="showStatistics" class="popup-overlay">
      <div class="popup-content">
        <h2>Kör vége</h2>
        <div class="stats-summary">
          <p>Helyes: <span class="correct-text">{{ correctAnswersInRound }}</span> | Helytelen: <span class="wrong-text">{{ incorrectAnswersInRound }}</span></p>
        </div>
        <p v-if="incorrectAnswersInRound === 0" class="success-msg">🌟 Hibátlan! Jöhet a következő 10!</p>
        <p v-else class="fail-msg">❌ Volt benne hiba. Ismételjük meg ezt a kört!</p>
        
        <div class="solved-list">
          <div v-for="(item, i) in roundHistory" :key="i" :class="['history-item', item.isCorrect ? 'h-correct' : 'h-wrong']">
            <strong>{{ item.nomen }}</strong> {{ item.isCorrect ? '✓' : '✗' }} ({{ item.correctAnswer }})
          </div>
        </div>
        <button @click="startNextAction" class="btn-popup-action">Indítás</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NomenVerbPractice",
  data() {
    return {
      allVerbs: [
        { nomen: "einen Vertrag", verb: "abschließen", meaning: "einen Vertrag unterschreiben", example: "Gestern habe ich einen Vertrag mit einem neuen Kunden abgeschlossen.", translation: "Tegnap szerződést kötöttem egy új ügyféllel." },
        { nomen: "ein Thema", verb: "anschneiden", meaning: "beginnen, über etwas zu sprechen", example: "Ich würde gerne noch ein Thema anschneiden, das mir sehr wichtig ist.", translation: "Szeretnék még egy témát felvetni, ami nagyon fontos nekem." },
        { nomen: "die Hoffnung", verb: "aufgeben", meaning: "aufhören, zu hoffen", example: "Als Petra die Hoffnung fast aufgegeben hatte, hat sie Peter kennengelernt.", translation: "Amikor Petra már majdnem feladta a reményt, megismerte Petert." },
        { nomen: "Kontakt", verb: "aufnehmen", meaning: "jemanden kontaktieren", example: "Haben Sie schon mit Frau Müller Kontakt aufgenommen?", translation: "Felvette már a kapcsolatot Müller asszonnyal?" },
        { nomen: "einen Beruf", verb: "ausüben", meaning: "in einem Beruf arbeiten", example: "Menschen, die einen Beruf ausüben, der ihnen Spaß macht, sind oft glücklich.", translation: "Azok az emberek, akik olyan szakmát gyakorolnak, amit élveznek, gyakran boldogok." },
        { nomen: "eine Enttäuschung", verb: "bereiten", meaning: "jemanden enttäuschen", example: "Es hat mir eine große Enttäuschung bereitet, dass meine Freunde nicht kamen.", translation: "Nagy csalódást okozott nekem, hogy a barátaim nem jöttek el." },
        { nomen: "Freude", verb: "bereiten", meaning: "jemanden freuen", example: "Frische Blumen in meiner Wohnung bereiten mir große Freude.", translation: "A friss virágok a lakásomban nagy örömet okoznak nekem." },
        { nomen: "in Bewegung", verb: "bringen", meaning: "etwas bewegen / den Prozess starten", example: "Eine Sammelaktion hat viel in Bewegung gebracht.", translation: "Egy gyűjtési akció sok mindent mozgásba hozott." },
        { nomen: "eine Auswahl", verb: "treffen", meaning: "auswählen", example: "Wir können nicht alles kaufen, wir müssen eine Auswahl treffen!", translation: "Nem tudunk mindent megvenni, választanunk kell!" },
        { nomen: "Vorbereitungen", verb: "treffen", meaning: "etwas vorbereiten", example: "Wir müssen für unsere Hochzeitsfeier noch einige Vorbereitungen treffen.", translation: "Az esküvői ünnepségünkre még néhány előkészületet meg kell tennünk." },
        { nomen: "in Kraft", verb: "treten", meaning: "gültig werden", example: "Das neue Gesetz tritt zum 1. Januar in Kraft.", translation: "Az új törvény január 1-jén lép hatályba." },
        { nomen: "Kritik", verb: "üben", meaning: "kritisieren", example: "Die Opposition übt heftige Kritik an der Regierung.", translation: "Az ellenzék heves kritikát gyakorol a kormányra." }
      ],
      currentRoundVerbs: [],
      unansweredInRound: [],
      roundHistory: [],
      currentQuestion: null,
      userAnswer: "",
      feedback: "",
      isAnswered: false,
      isCorrect: null,
      showStatistics: false,
      correctAnswersInRound: 0,
      incorrectAnswersInRound: 0,
      currentRoundQuestionIndex: 0
    };
  },
  created() { this.pickNewSet(); },
  methods: {
    shuffle(array) { return [...array].sort(() => Math.random() - 0.5); },
    pickNewSet() { this.currentRoundVerbs = this.shuffle(this.allVerbs).slice(0, 10); this.startRound(); },
    startRound() {
      this.unansweredInRound = this.shuffle(this.currentRoundVerbs);
      this.roundHistory = [];
      this.correctAnswersInRound = 0;
      this.incorrectAnswersInRound = 0;
      this.currentRoundQuestionIndex = 0;
      this.showStatistics = false;
      this.setNextQuestion();
    },
    setNextQuestion() {
      if (this.unansweredInRound.length > 0) {
        this.currentQuestion = this.unansweredInRound.pop();
        this.currentRoundQuestionIndex++;
      } else { this.showStatistics = true; }
    },
    handleEnter() { if (!this.isAnswered) { if (this.userAnswer.trim()) this.checkAnswer(); } else { this.nextQuestion(); } },
    checkAnswer() {
      if (this.isAnswered) return;
      this.isAnswered = true;
      const userVal = this.userAnswer.trim().toLowerCase();
      const correctVal = this.currentQuestion.verb.toLowerCase();
      this.isCorrect = userVal === correctVal;
      if (this.isCorrect) { this.correctAnswersInRound++; this.feedback = "Richtig! ✓"; } 
      else { this.incorrectAnswersInRound++; this.feedback = "Falsch! ✗"; }
      this.roundHistory.push({ nomen: this.currentQuestion.nomen, userAnswer: this.userAnswer, correctAnswer: this.currentQuestion.verb, isCorrect: this.isCorrect });
    },
    nextQuestion() { this.userAnswer = ""; this.feedback = ""; this.isAnswered = false; this.isCorrect = null; this.setNextQuestion(); },
    startNextAction() { if (this.incorrectAnswersInRound === 0) { this.pickNewSet(); } else { this.startRound(); } }
  }
};
</script>

<style scoped>
/* Alap konténer - kártya nélkül, középre igazítva */
.verb-practice {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
  background: transparent;
}

h1 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

/* Haladási sáv - Pontosan 400px, mint a mezők */
.progress-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 30px auto;
  box-sizing: border-box;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(224, 230, 237, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #2ecc71;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
}

/* Kérdés kártya - Átlátszó */
.question-card {
  padding: 10px;
  margin-bottom: 25px;
}

.nomen-display {
  font-size: 2.2rem;
  color: #ffffff;
  margin: 0;
  font-weight: bold;
}

.meaning {
  font-style: italic;
  color: #bdc3c7;
  margin-top: 5px;
}

/* Beviteli mező és gombok egységes szélessége */
.input-wrapper, 
.button-group {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
}

input {
  width: 100%;
  padding: 15px 20px;
  border-radius: 50px;
  border: 2px solid rgba(223, 230, 233, 0.3);
  background: white;
  font-size: 18px;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  margin-bottom: 15px;
  display: block;
}

input:focus {
  border-color: #3498db;
}

/* Helyes/Helytelen állapotok */
.input-correct {
  border-color: #2ecc71 !important;
  background-color: #eafaf1;
}
.input-wrong {
  border-color: #e74c3c !important;
  background-color: #fdf2f2;
}

.input-icon {
  position: absolute;
  right: 20px;
  top: 15px; /* Az input közepéhez igazítva */
  font-size: 20px;
  font-weight: bold;
}
.correct-icon { color: #2ecc71; }
.wrong-icon { color: #e74c3c; }

/* Gombok stílusa */
button {
  width: 100%;
  padding: 15px 35px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
  color: white;
  box-sizing: border-box;
  margin-bottom: 10px;
  display: block;
}

.btn-check {
  background: #2ecc71;
}
.btn-check:hover:not(:disabled) {
  background: #27ae60;
}

.btn-next {
  background: #3498db;
}
.btn-next:hover {
  background: #2980b9;
}

/* Visszajelző doboz és magyar fordítás */
.feedback-box {
  width: 100%;
  max-width: 400px;
  margin: 25px auto 0 auto;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
  box-sizing: border-box;
}

.fb-correct {
  background-color: rgba(46, 204, 113, 0.2);
  border: 1px solid #2ecc71;
  color: #ffffff;
}
.fb-wrong {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #e74c3c;
  color: #ffffff;
}

.wrong-highlight {
  background: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-weight: bold;
}

.hungarian-translation {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dotted rgba(255,255,255,0.3);
  color: #bdc3c7;
  font-style: italic;
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.popup-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 400px;
  text-align: center;
  color: #2c3e50;
}
.btn-popup-action {
  background: #2c3e50;
  width: 100%;
  margin-top: 20px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>