<template>
  <div class="verb-practice">
    <h1>Perfekt Gyakorló</h1>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: (currentRoundQuestionIndex * 10) + '%' }"></div>
      </div>
      <p class="progress-text">Kérdés: <strong>{{ currentRoundQuestionIndex }}</strong> / 10</p>
    </div>

    <div v-if="currentQuestion && !showStatistics" class="quiz-area">
      <div class="question-card">
        <h2 class="verb-display">{{ currentQuestion.verb }}</h2>
        <p class="meaning">({{ currentQuestion.meaning }})</p>
      </div>

      <div class="input-wrapper">
        <input
          type="text"
          v-model="userAnswer"
          placeholder="pl. hat geholfen"
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
          <p v-if="!isCorrect" class="wrong-highlight">Helyes válasz: <span>{{ currentQuestion.auxiliary }} {{ currentQuestion.pastParticiple }}</span></p>
          <p class="feedback-text">{{ feedback }}</p>
        </div>
      </transition>
    </div>

    <div v-if="showStatistics" class="popup-overlay">
      <div class="popup-content">
        <h2>Kör vége</h2>
        <div class="stats-summary">
          <p>Eredmény: <span :class="incorrectAnswersInRound === 0 ? 'correct-text' : 'wrong-text'">{{ 10 - incorrectAnswersInRound }} / 10</span></p>
        </div>
        <p v-if="incorrectAnswersInRound === 0" class="success-msg">🌟 Tökéletes! Jöhet az újabb 10 ige.</p>
        <p v-else class="fail-msg">❌ Volt benne hiba. Gyakoroljuk újra ezt a 10 igét!</p>
        
        <button @click="startNextAction" class="btn-popup-action">Indítás</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerbPractice",
  data() {
    return {
      allVerbs: [
        { verb: "backen", auxiliary: "hat", pastParticiple: "gebacken", meaning: "süt" },
        { verb: "befehlen", auxiliary: "hat", pastParticiple: "befohlen", meaning: "parancsol" },
        { verb: "beginnen", auxiliary: "hat", pastParticiple: "begonnen", meaning: "elkezd" },
        { verb: "beißen", auxiliary: "hat", pastParticiple: "gebissen", meaning: "harap" },
        { verb: "besitzen", auxiliary: "hat", pastParticiple: "besessen", meaning: "birtokol" },
        { verb: "betrügen", auxiliary: "hat", pastParticiple: "betrogen", meaning: "becsap" },
        { verb: "biegen", auxiliary: "hat", pastParticiple: "gebogen", meaning: "hajlít" },
        { verb: "bieten", auxiliary: "hat", pastParticiple: "geboten", meaning: "kínál" },
        { verb: "binden", auxiliary: "hat", pastParticiple: "gebunden", meaning: "köt" },
        { verb: "bitten", auxiliary: "hat", pastParticiple: "gebeten", meaning: "kér" },
        { verb: "bleiben", auxiliary: "ist", pastParticiple: "geblieben", meaning: "marad" },
        { verb: "braten", auxiliary: "hat", pastParticiple: "gebraten", meaning: "süt (húst)" },
        { verb: "brechen", auxiliary: "hat", pastParticiple: "gebrochen", meaning: "tör" },
        { verb: "brennen", auxiliary: "hat", pastParticiple: "gebrannt", meaning: "ég" },
        { verb: "bringen", auxiliary: "hat", pastParticiple: "gebracht", meaning: "hoz" },
        { verb: "denken", auxiliary: "hat", pastParticiple: "gedacht", meaning: "gondol" },
        { verb: "dürfen", auxiliary: "hat", pastParticiple: "gedurft", meaning: "szabad" },
        { verb: "empfehlen", auxiliary: "hat", pastParticiple: "empfohlen", meaning: "ajánl" },
        { verb: "erschrecken", auxiliary: "ist", pastParticiple: "erschrocken", meaning: "megijed" },
        { verb: "essen", auxiliary: "hat", pastParticiple: "gegessen", meaning: "eszik" },
        { verb: "fahren", auxiliary: "ist", pastParticiple: "gefahren", meaning: "utazik" },
        { verb: "fallen", auxiliary: "ist", pastParticiple: "gefallen", meaning: "esik" },
        { verb: "fangen", auxiliary: "hat", pastParticiple: "gefangen", meaning: "fog" },
        { verb: "finden", auxiliary: "hat", pastParticiple: "gefunden", meaning: "talál" },
        { verb: "fliegen", auxiliary: "ist", pastParticiple: "geflogen", meaning: "repül" },
        { verb: "fliehen", auxiliary: "ist", pastParticiple: "geflohen", meaning: "menekül" },
        { verb: "fließen", auxiliary: "ist", pastParticiple: "geflossen", meaning: "folyik" },
        { verb: "fressen", auxiliary: "hat", pastParticiple: "gefressen", meaning: "eszik (állat)" },
        { verb: "frieren", auxiliary: "hat", pastParticiple: "gefroren", meaning: "fagy" },
        { verb: "geben", auxiliary: "hat", pastParticiple: "gegeben", meaning: "ad" },
        { verb: "gehen", auxiliary: "ist", pastParticiple: "gegangen", meaning: "megy" },
        { verb: "gelingen", auxiliary: "ist", pastParticiple: "gelungen", meaning: "sikerül" },
        { verb: "gelten", auxiliary: "hat", pastParticiple: "gegolten", meaning: "érvényes" },
        { verb: "genießen", auxiliary: "hat", pastParticiple: "genossen", meaning: "élvez" },
        { verb: "geschehen", auxiliary: "ist", pastParticiple: "geschehen", meaning: "történik" },
        { verb: "gewinnen", auxiliary: "hat", pastParticiple: "gewonnen", meaning: "nyer" },
        { verb: "gießen", auxiliary: "hat", pastParticiple: "gegossen", meaning: "öntöz" },
        { verb: "gleichen", auxiliary: "hat", pastParticiple: "geglichen", meaning: "hasonlít" },
        { verb: "graben", auxiliary: "hat", pastParticiple: "gegraben", meaning: "ás" },
        { verb: "greifen", auxiliary: "hat", pastParticiple: "gegriffen", meaning: "megfog" },
        { verb: "haben", auxiliary: "hat", pastParticiple: "gehabt", meaning: "birtokol" },
        { verb: "halten", auxiliary: "hat", pastParticiple: "gehalten", meaning: "tart" },
        { verb: "hängen", auxiliary: "hat", pastParticiple: "gehangen", meaning: "függ" },
        { verb: "heben", auxiliary: "hat", pastParticiple: "gehoben", meaning: "emel" },
        { verb: "heißen", auxiliary: "hat", pastParticiple: "geheißen", meaning: "hívják" },
        { verb: "helfen", auxiliary: "hat", pastParticiple: "geholfen", meaning: "segít" },
        { verb: "kennen", auxiliary: "hat", pastParticiple: "gekannt", meaning: "ismer" },
        { verb: "klingen", auxiliary: "hat", pastParticiple: "geklungen", meaning: "cseng" },
        { verb: "kommen", auxiliary: "ist", pastParticiple: "gekommen", meaning: "jön" },
        { verb: "können", auxiliary: "hat", pastParticiple: "gekonnt", meaning: "tud (-hat)" },
        { verb: "laden", auxiliary: "hat", pastParticiple: "geladen", meaning: "rak" },
        { verb: "lassen", auxiliary: "hat", pastParticiple: "gelassen", meaning: "hagy" },
        { verb: "laufen", auxiliary: "ist", pastParticiple: "gelaufen", meaning: "fut" },
        { verb: "leiden", auxiliary: "hat", pastParticiple: "gelitten", meaning: "szenved" },
        { verb: "leihen", auxiliary: "hat", pastParticiple: "geliehen", meaning: "kölcsönöz" },
        { verb: "lesen", auxiliary: "hat", pastParticiple: "gelesen", meaning: "olvas" },
        { verb: "liegen", auxiliary: "hat", pastParticiple: "gelegen", meaning: "fekszik" },
        { verb: "lügen", auxiliary: "hat", pastParticiple: "gelogen", meaning: "hazudik" },
        { verb: "messen", auxiliary: "hat", pastParticiple: "gemessen", meaning: "mér" },
        { verb: "mögen", auxiliary: "hat", pastParticiple: "gemocht", meaning: "szeret, kedvel" },
        { verb: "müssen", auxiliary: "hat", pastParticiple: "gemusst", meaning: "kell, muszáj" },
        { verb: "nehmen", auxiliary: "hat", pastParticiple: "genommen", meaning: "vesz, elvisz" },
        { verb: "nennen", auxiliary: "hat", pastParticiple: "genannt", meaning: "nevez" },
        { verb: "pfeifen", auxiliary: "hat", pastParticiple: "gepfiffen", meaning: "fütyül" },
        { verb: "raten", auxiliary: "hat", pastParticiple: "geraten", meaning: "tanácsol" },
        { verb: "reiben", auxiliary: "hat", pastParticiple: "gerieben", meaning: "dörzsöl" },
        { verb: "reißen", auxiliary: "hat", pastParticiple: "gerissen", meaning: "szakít" },
        { verb: "reiten", auxiliary: "ist", pastParticiple: "geritten", meaning: "lovagol" },
        { verb: "rennen", auxiliary: "ist", pastParticiple: "gerannt", meaning: "rohan" },
        { verb: "riechen", auxiliary: "hat", pastParticiple: "gerochen", meaning: "szagol" },
        { verb: "rufen", auxiliary: "hat", pastParticiple: "gerufen", meaning: "hív" },
        { verb: "scheinen", auxiliary: "hat", pastParticiple: "geschienen", meaning: "tűnik, fénylik" },
        { verb: "schieben", auxiliary: "hat", pastParticiple: "geschoben", meaning: "tol" },
        { verb: "schlafen", auxiliary: "hat", pastParticiple: "geschlafen", meaning: "alszik" },
        { verb: "schlagen", auxiliary: "hat", pastParticiple: "geschlagen", meaning: "üt" },
        { verb: "schließen", auxiliary: "hat", pastParticiple: "geschlossen", meaning: "zár" },
        { verb: "schneiden", auxiliary: "hat", pastParticiple: "geschnitten", meaning: "vág" },
        { verb: "schreiben", auxiliary: "hat", pastParticiple: "geschrieben", meaning: "ír" },
        { verb: "schreien", auxiliary: "hat", pastParticiple: "geschrien", meaning: "kiabál" },
        { verb: "schweigen", auxiliary: "hat", pastParticiple: "geschwiegen", meaning: "hallgat" },
        { verb: "schwimmen", auxiliary: "ist", pastParticiple: "geschwommen", meaning: "úszik" },
        { verb: "sehen", auxiliary: "hat", pastParticiple: "gesehen", meaning: "lát" },
        { verb: "sein", auxiliary: "ist", pastParticiple: "gewesen", meaning: "van (létige)" },
        { verb: "singen", auxiliary: "hat", pastParticiple: "gesungen", meaning: "énekel" },
        { verb: "sinken", auxiliary: "ist", pastParticiple: "gesunken", meaning: "süllyed" },
        { verb: "sitzen", auxiliary: "hat", pastParticiple: "gesessen", meaning: "ül" },
        { verb: "sollen", auxiliary: "hat", pastParticiple: "gesollt", meaning: "kell (erkölcsi)" },
        { verb: "sprechen", auxiliary: "hat", pastParticiple: "gesprochen", meaning: "beszél" },
        { verb: "springen", auxiliary: "ist", pastParticiple: "gesprungen", meaning: "ugrik" },
        { verb: "stehen", auxiliary: "hat", pastParticiple: "gestanden", meaning: "áll" },
        { verb: "stehlen", auxiliary: "hat", pastParticiple: "gestohlen", meaning: "lop" },
        { verb: "steigen", auxiliary: "ist", pastParticiple: "gestiegen", meaning: "emelkedik" },
        { verb: "sterben", auxiliary: "ist", pastParticiple: "gestorben", meaning: "meghal" },
        { verb: "streiten", auxiliary: "hat", pastParticiple: "gestritten", meaning: "veszekszik" },
        { verb: "tragen", auxiliary: "hat", pastParticiple: "getragen", meaning: "hord, visel" },
        { verb: "treffen", auxiliary: "hat", pastParticiple: "getroffen", meaning: "találkozik" },
        { verb: "trinken", auxiliary: "hat", pastParticiple: "getrunken", meaning: "iszik" },
        { verb: "tun", auxiliary: "hat", pastParticiple: "getan", meaning: "tesz" },
        { verb: "vergessen", auxiliary: "hat", pastParticiple: "vergessen", meaning: "elfelejt" },
        { verb: "verlieren", auxiliary: "hat", pastParticiple: "verloren", meaning: "elveszít" },
        { verb: "verstehen", auxiliary: "hat", pastParticiple: "verstanden", meaning: "ért" },
        { verb: "waschen", auxiliary: "hat", pastParticiple: "gewaschen", meaning: "mos" },
        { verb: "werden", auxiliary: "ist", pastParticiple: "geworden", meaning: "válik valamivé" },
        { verb: "werfen", auxiliary: "hat", pastParticiple: "geworfen", meaning: "dob" },
        { verb: "wissen", auxiliary: "hat", pastParticiple: "gewusst", meaning: "tud (tényt)" },
        { verb: "wollen", auxiliary: "hat", pastParticiple: "gewollt", meaning: "akar" },
        { verb: "ziehen", auxiliary: "hat", pastParticiple: "gezogen", meaning: "húz" }
      ],
      currentRoundVerbs: [],
      unansweredInRound: [],
      currentQuestion: null,
      userAnswer: "",
      isAnswered: false,
      isCorrect: null,
      feedback: "",
      showStatistics: false,
      incorrectAnswersInRound: 0,
      currentRoundQuestionIndex: 0
    };
  },
  created() { this.pickNewSet(); },
  methods: {
    shuffle(array) { return [...array].sort(() => Math.random() - 0.5); },
    pickNewSet() {
      this.currentRoundVerbs = this.shuffle(this.allVerbs).slice(0, 10);
      this.startRound();
    },
    startRound() {
      this.unansweredInRound = this.shuffle(this.currentRoundVerbs);
      this.incorrectAnswersInRound = 0;
      this.currentRoundQuestionIndex = 0;
      this.showStatistics = false;
      this.setNextQuestion();
    },
    setNextQuestion() {
      if (this.unansweredInRound.length > 0) {
        this.currentQuestion = this.unansweredInRound.pop();
        this.currentRoundQuestionIndex++;
        this.userAnswer = "";
        this.isAnswered = false;
        this.isCorrect = null;
        this.feedback = "";
      } else {
        this.showStatistics = true;
      }
    },
    handleEnter() {
      if (!this.isAnswered) { if (this.userAnswer.trim()) this.checkAnswer(); }
      else { this.nextQuestion(); }
    },
    checkAnswer() {
      if (this.isAnswered) return;
      this.isAnswered = true;
      const userVal = this.userAnswer.trim().toLowerCase();
      const correctVal = `${this.currentQuestion.auxiliary} ${this.currentQuestion.pastParticiple}`.toLowerCase();

      this.isCorrect = userVal === correctVal;
      if (this.isCorrect) {
        this.feedback = "Richtig! ✓";
      } else {
        this.incorrectAnswersInRound++;
        this.feedback = "Falsch! ✗";
      }
    },
    nextQuestion() { this.setNextQuestion(); },
    startNextAction() {
      if (this.incorrectAnswersInRound === 0) this.pickNewSet();
      else this.startRound();
    }
  }
};
</script>

<style scoped>
/* Alap konténer */
.verb-practice {
  width: 100%; /* Engedjük, hogy az App.vue flexboxa szabályozza */
  max-width: 600px;
  padding: 40px 25px;
  border-radius: 20px;
  text-align: center;
  box-sizing: border-box;
  background: transparent; /* Nincs kártya háttér, csak a body gradiens */
}

h1 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

/* Haladási sáv (Progress Bar) - Igazítva a mezőkhöz */
.progress-container {
  max-width: 400px; /* Pontosan akkora, mint az input és a gombok */
  margin: 0 auto 30px auto;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(224, 230, 237, 0.2); /* Picit áttetsző a sötét háttéren */
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

/* Kérdés kártya */
.question-card {
  padding: 10px;
  margin-bottom: 25px;
}

.verb-display {
  font-size: 2.5rem;
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
  max-width: 400px;
  margin: 0 auto;
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
}

input:focus {
  border-color: #3498db;
}

/* Helyes/Helytelen input állapotok */
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
  top: 50%;
  transform: translateY(-80%); /* Az ikon középre igazítása az inputban */
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

/* Visszajelző doboz és kiemelés */
.feedback-box {
  max-width: 400px;
  margin: 25px auto 0 auto;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
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
  font-size: 1.2rem;
}
.wrong-highlight span { text-decoration: underline; font-size: 1.4rem; }

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
.correct-text { color: #2ecc71; font-weight: bold; }
.wrong-text { color: #e74c3c; font-weight: bold; }
.btn-popup-action {
  background: #2c3e50;
  width: 100%;
  margin-top: 20px;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>