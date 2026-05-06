<template>
  <div class="adjektiv-practice">
    <h1>Adjektivdeklination</h1>

    <div v-if="!selectedCase" class="case-selector">
      <p class="subtitle">Válaszd ki, melyik esetet szeretnéd gyakorolni:</p>
      <div class="case-grid">
        <button @click="selectCase('Nominativ')" class="btn-case">Nominativ</button>
        <button @click="selectCase('Akkusativ')" class="btn-case">Akkusativ</button>
        <button @click="selectCase('Dativ')" class="btn-case">Dativ</button>
        <button @click="selectCase('Genitiv')" class="btn-case">Genitiv</button>
        <button @click="selectCase('Mixed')" class="btn-case btn-mixed">Vegyes gyakorlat</button>
      </div>
    </div>

    <div v-else-if="currentQuestion && !showStatistics" class="quiz-area">
      <div class="case-indicator">Mód: <strong>{{ selectedCase }}</strong></div>
      
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="progress-text">Kérdés: {{ displayIndex }} / {{ totalQuestionsInRound }}</p>
      </div>

      <div class="question-card">
        <p class="meaning">{{ currentQuestion.context }} ...</p>
        <h2 class="adjektiv-display">
          ({{ currentQuestion.elements.article }} / {{ currentQuestion.elements.adj }} / {{ currentQuestion.elements.noun }})
        </h2>
      </div>

      <div class="input-wrapper" style="position: relative;">
        <input
          type="text"
          v-model="userAnswer"
          placeholder="Névelő + Melléknév + Főnév"
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
        <div v-if="isAnswered" :class="['feedback-box', isCorrect ? 'fb-correct' : 'fb-wrong']">
          <p v-if="!isCorrect" class="wrong-highlight">Helyes: <span>{{ currentQuestion.correct }}</span></p>
          <div class="rule-details">
            <p><strong>Szabály:</strong> {{ currentQuestion.rule }}</p>
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
        <button @click="resetToSelector" class="btn-popup-action">Másik eset választása</button>
        <button @click="startRound" class="btn-popup-action secondary">Új kör ugyanezzel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdjektivPractice",
  data() {
    return {
      selectedCase: null,
allQuestions: [
  // --- NOMINATIV (Alanyeset) ---
  { context: "Das ist", elements: { article: "der", adj: "alt", noun: "Schlüssel" }, correct: "der alte Schlüssel", case: "Nominativ", rule: "Határozott (Hímnem)" },
  { context: "Hier ist", elements: { article: "ein", adj: "bequem", noun: "Sessel" }, correct: "ein bequemer Sessel", case: "Nominativ", rule: "Határozatlan (Hímnem)" },
  { context: "Dort steht", elements: { article: "-", adj: "kalt", noun: "Kaffee" }, correct: "kalter Kaffee", case: "Nominativ", rule: "Névelő nélkül (Hímnem)" },
  { context: "Das ist", elements: { article: "die", adj: "teuer", noun: "Uhr" }, correct: "die teure Uhr", case: "Nominativ", rule: "Határozott (Nőnem)" },
  { context: "Hier ist", elements: { article: "eine", adj: "hell", noun: "Wohnung" }, correct: "eine helle Wohnung", case: "Nominativ", rule: "Határozatlan (Nőnem)" },
  { context: "Es ist", elements: { article: "-", adj: "frisch", noun: "Milch" }, correct: "frische Milch", case: "Nominativ", rule: "Névelő nélkül (Nőnem)" },
  { context: "Das ist", elements: { article: "das", adj: "klein", noun: "Kind" }, correct: "das kleine Kind", case: "Nominativ", rule: "Határozott (Semleges)" },
  { context: "Hier ist", elements: { article: "ein", adj: "gut", noun: "Buch" }, correct: "ein gutes Buch", case: "Nominativ", rule: "Határozatlan (Semleges)" },
  { context: "Dort liegt", elements: { article: "-", adj: "dunkel", noun: "Brot" }, correct: "dunkles Brot", case: "Nominativ", rule: "Névelő nélkül (Semleges)" },
  { context: "Das sind", elements: { article: "die", adj: "fleißig", noun: "Studenten" }, correct: "die fleißigen Studenten", case: "Nominativ", rule: "Határozott (Többes)" },
  { context: "Dort sind", elements: { article: "-", adj: "bunt", noun: "Blumen" }, correct: "bunte Blumen", case: "Nominativ", rule: "Névelő nélkül (Többes)" },
  { context: "Hier sind", elements: { article: "keine", adj: "einfach", noun: "Fragen" }, correct: "keine einfachen Fragen", case: "Nominativ", rule: "Tagadó (Többes)" },

  // --- AKKUSATIV (Tárgyeset) ---
  { context: "Ich brauche", elements: { article: "der", adj: "neu", noun: "Computer" }, correct: "den neuen Computer", case: "Akkusativ", rule: "Határozott (Hímnem)" },
  { context: "Er kauft", elements: { article: "ein", adj: "modern", noun: "Fernseher" }, correct: "einen modernen Fernseher", case: "Akkusativ", rule: "Határozatlan (Hímnem)" },
  { context: "Ich trinke", elements: { article: "-", adj: "schwarz", noun: "Tee" }, correct: "schwarzen Tee", case: "Akkusativ", rule: "Névelő nélkül (Hímnem)" },
  { context: "Wir suchen", elements: { article: "die", adj: "groß", noun: "Tasche" }, correct: "die große Tasche", case: "Akkusativ", rule: "Határozott (Nőnem)" },
  { context: "Ich esse", elements: { article: "eine", adj: "scharf", noun: "Pizza" }, correct: "eine scharfe Pizza", case: "Akkusativ", rule: "Határozatlan (Nőnem)" },
  { context: "Er liest", elements: { article: "-", adj: "interessant", noun: "Literatur" }, correct: "interessante Literatur", case: "Akkusativ", rule: "Névelő nélkül (Nőnem)" },
  { context: "Ich habe", elements: { article: "das", adj: "blau", noun: "Auto" }, correct: "das blaue Auto", case: "Akkusativ", rule: "Határozott (Semleges)" },
  { context: "Wir mieten", elements: { article: "ein", adj: "hell", noun: "Zimmer" }, correct: "ein helles Zimmer", case: "Akkusativ", rule: "Határozatlan (Semleges)" },
  { context: "Ich trinke", elements: { article: "-", adj: "kalt", noun: "Wasser" }, correct: "kaltes Wasser", case: "Akkusativ", rule: "Névelő nélkül (Semleges)" },
  { context: "Er liebt", elements: { article: "die", adj: "schön", noun: "Berge" }, correct: "die schönen Berge", case: "Akkusativ", rule: "Határozott (Többes)" },
  { context: "Wir kaufen", elements: { article: "-", adj: "süß", noun: "Äpfel" }, correct: "süße Äpfel", case: "Akkusativ", rule: "Névelő nélkül (Többes)" },
  { context: "Sie hat", elements: { article: "keine", adj: "falsch", noun: "Informationen" }, correct: "keine falschen Informationen", case: "Akkusativ", rule: "Tagadó (Többes)" },

  // --- DATIV (Részes eset) ---
  { context: "Ich helfe", elements: { article: "der", adj: "krank", noun: "Mann" }, correct: "dem kranken Mann", case: "Dativ", rule: "Határozott (Hímnem)" },
  { context: "Er spricht mit", elements: { article: "ein", adj: "nett", noun: "Kollege" }, correct: "einem netten Kollegen", case: "Dativ", rule: "Határozatlan (Hímnem)" },
  { context: "Wir gratulieren", elements: { article: "-", adj: "gut", noun: "Freunden" }, correct: "guten Freunden", case: "Dativ", rule: "Névelő nélkül (Többes)" },
  { context: "Ich antworte", elements: { article: "die", adj: "freundlich", noun: "Dame" }, correct: "der freundlichen Dame", case: "Dativ", rule: "Határozott (Nőnem)" },
  { context: "Er wohnt in", elements: { article: "eine", adj: "ruhig", noun: "Straße" }, correct: "einer ruhigen Straße", case: "Dativ", rule: "Határozatlan (Nőnem)" },
  { context: "Ich arbeite bei", elements: { article: "-", adj: "stark", noun: "Hitze" }, correct: "starker Hitze", case: "Dativ", rule: "Névelő nélkül (Nőnem)" },
  { context: "Ich spiele mit", elements: { article: "das", adj: "klein", noun: "Kind" }, correct: "dem kleinen Kind", case: "Dativ", rule: "Határozott (Semleges)" },
  { context: "Er kommt mit", elements: { article: "ein", adj: "schnell", noun: "Fahrrad" }, correct: "einem schnellen Fahrrad", case: "Dativ", rule: "Határozatlan (Semleges)" },
  { context: "Ich trinke aus", elements: { article: "-", adj: "sauber", noun: "Glas" }, correct: "sauberem Glas", case: "Dativ", rule: "Névelő nélkül (Semleges)" },
  { context: "Wir helfen", elements: { article: "die", adj: "arm", noun: "Leute" }, correct: "den armen Leuten", case: "Dativ", rule: "Határozott (Többes)" },
  { context: "Ich reise mit", elements: { article: "-", adj: "teuer", noun: "Kameras" }, correct: "teuren Kameras", case: "Dativ", rule: "Névelő nélkül (Többes)" },

  // --- GENITIV (Birtokos eset) ---
  { context: "Trotz", elements: { article: "der", adj: "groß", noun: "Fehler" }, correct: "des großen Fehlers", case: "Genitiv", rule: "Határozott (Hímnem)" },
  { context: "Wegen", elements: { article: "ein", adj: "lang", noun: "Weg" }, correct: "eines langen Weges", case: "Genitiv", rule: "Határozatlan (Hímnem)" },
  { context: "Statt", elements: { article: "-", adj: "stark", noun: "Kaffee" }, correct: "starken Kaffees", case: "Genitiv", rule: "Névelő nélkül (Hímnem)" },
  { context: "Während", elements: { article: "die", adj: "kalt", noun: "Nacht" }, correct: "der kalten Nacht", case: "Genitiv", rule: "Határozott (Nőnem)" },
  { context: "Aufgrund", elements: { article: "eine", adj: "schwer", noun: "Krankheit" }, correct: "einer schweren Krankheit", case: "Genitiv", rule: "Határozatlan (Nőnem)" },
  { context: "Trotz", elements: { article: "-", adj: "groß", noun: "Angst" }, correct: "großer Angst", case: "Genitiv", rule: "Névelő nélkül (Nőnem)" },
  { context: "Wegen", elements: { article: "das", adj: "neu", noun: "Gesetz" }, correct: "des neuen Gesetzes", case: "Genitiv", rule: "Határozott (Semleges)" },
  { context: "Statt", elements: { article: "ein", adj: "alt", noun: "Haus" }, correct: "eines alten Hauses", case: "Genitiv", rule: "Határozatlan (Semleges)" },
  { context: "Während", elements: { article: "-", adj: "schlecht", noun: "Wetter" }, correct: "schlechten Wetters", case: "Genitiv", rule: "Névelő nélkül (Semleges)" },
  { context: "Trotz", elements: { article: "die", adj: "hoch", noun: "Preise" }, correct: "der hohen Preise", case: "Genitiv", rule: "Határozott (Többes)" },
  { context: "Wegen", elements: { article: "-", adj: "technisch", noun: "Probleme" }, correct: "technischer Probleme", case: "Genitiv", rule: "Névelő nélkül (Többes)" },

  // --- ADJEKTIV + PRÄPOSITIONEN (Gyakori kombinációk) ---
  { context: "Ich bin zufrieden mit", elements: { article: "der", adj: "neu", noun: "Job" }, correct: "dem neuen Job", case: "Dativ", rule: "Präp + Dativ" },
  { context: "Er ist stolz auf", elements: { article: "sein", adj: "groß", noun: "Sohn" }, correct: "seinen großen Sohn", case: "Akkusativ", rule: "Präp + Akkusativ" },
  { context: "Wir warten auf", elements: { article: "das", adj: "nächst", noun: "Zug" }, correct: "den nächsten Zug", case: "Akkusativ", rule: "Präp + Akkusativ" },
  { context: "Sie träumt von", elements: { article: "ein", adj: "schön", noun: "Urlaub" }, correct: "einem schönen Urlaub", case: "Dativ", rule: "Präp + Dativ" },
  { context: "Ich habe Angst vor", elements: { article: "der", adj: "dunkel", noun: "Wald" }, correct: "dem dunklen Wald", case: "Dativ", rule: "Präp + Dativ" },

  // --- SZÍNEK ÉS RUHÁK (Klasszikus példák) ---
  { context: "Ich trage", elements: { article: "ein", adj: "weiß", noun: "Hemd" }, correct: "ein weißes Hemd", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Sie kauft", elements: { article: "die", adj: "rot", noun: "Bluse" }, correct: "die rote Bluse", case: "Akkusativ", rule: "Nőnem" },
  { context: "Er hat", elements: { article: "der", adj: "schwarz", noun: "Anzug" }, correct: "den schwarzen Anzug", case: "Akkusativ", rule: "Hímnem" },
  { context: "Dort sind", elements: { article: "-", adj: "grün", noun: "Schuhe" }, correct: "grüne Schuhe", case: "Nominativ", rule: "Többes szám" },

  // --- TOVÁBBI 40 VEGYES FELADAT ---
  { context: "Ich mag", elements: { article: "-", adj: "italienisch", noun: "Küche" }, correct: "italienische Küche", case: "Akkusativ", rule: "Nőnem" },
  { context: "Er sucht", elements: { article: "das", adj: "verloren", noun: "Geld" }, correct: "das verlorene Geld", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Wir brauchen", elements: { article: "ein", adj: "billig", noun: "Hotel" }, correct: "ein billiges Hotel", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Dort wartet", elements: { article: "der", adj: "jung", noun: "Fahrer" }, correct: "der junge Fahrer", case: "Nominativ", rule: "Hímnem" },
  { context: "Ich sehe", elements: { article: "-", adj: "klein", noun: "Vögel" }, correct: "kleine Vögel", case: "Akkusativ", rule: "Többes szám" },
  { context: "Es ist", elements: { article: "ein", adj: "kalt", noun: "Winter" }, correct: "ein kalter Winter", case: "Nominativ", rule: "Hímnem" },
  { context: "Wir gehen durch", elements: { article: "der", adj: "dicht", noun: "Wald" }, correct: "den dichten Wald", case: "Akkusativ", rule: "Hímnem" },
  { context: "Er gibt mir", elements: { article: "die", adj: "warm", noun: "Hand" }, correct: "die warme Hand", case: "Akkusativ", rule: "Nőnem" },
  { context: "Das ist", elements: { article: "-", adj: "bitter", noun: "Schokolade" }, correct: "bittere Schokolade", case: "Nominativ", rule: "Nőnem" },
  { context: "Sie spricht mit", elements: { article: "ein", adj: "fremd", noun: "Mann" }, correct: "einem fremden Mann", case: "Dativ", rule: "Hímnem" },
  { context: "Ich fahre mit", elements: { article: "das", adj: "alt", noun: "Auto" }, correct: "dem alten Auto", case: "Dativ", rule: "Semlegesnem" },
  { context: "Wir wohnen auf", elements: { article: "das", adj: "hoch", noun: "Land" }, correct: "dem hohen Land", case: "Dativ", rule: "Semlegesnem" },
  { context: "Wegen", elements: { article: "die", adj: "stark", noun: "Sonne" }, correct: "der starken Sonne", case: "Genitiv", rule: "Nőnem" },
  { context: "Trotz", elements: { article: "das", adj: "gering", noun: "Einkommen" }, correct: "des geringen Einkommens", case: "Genitiv", rule: "Semlegesnem" },
  { context: "Sie hat", elements: { article: "-", adj: "lang", noun: "Haare" }, correct: "lange Haare", case: "Akkusativ", rule: "Többes szám" },
  { context: "Das ist", elements: { article: "ein", adj: "lustig", noun: "Film" }, correct: "ein lustiger Film", case: "Nominativ", rule: "Hímnem" },
  { context: "Er kauft", elements: { article: "die", adj: "frisch", noun: "Eier" }, correct: "die frischen Eier", case: "Akkusativ", rule: "Többes szám" },
  { context: "Ich helfe", elements: { article: "die", adj: "alt", noun: "Leute" }, correct: "den armen Leuten", case: "Dativ", rule: "Többes szám" },
  { context: "Dank", elements: { article: "die", adj: "schnell", noun: "Hilfe" }, correct: "der schnellen Hilfe", case: "Genitiv", rule: "Nőnem" },
  { context: "Es ist", elements: { article: "ein", adj: "herrlich", noun: "Tag" }, correct: "ein herrlicher Tag", case: "Nominativ", rule: "Hímnem" },
  { context: "Ich esse", elements: { article: "-", adj: "süß", noun: "Obst" }, correct: "süßes Obst", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Sie trägt", elements: { article: "ein", adj: "kurz", noun: "Rock" }, correct: "einen kurzen Rock", case: "Akkusativ", rule: "Hímnem" },
  { context: "Wir sitzen in", elements: { article: "der", adj: "bequem", noun: "Garten" }, correct: "dem bequemen Garten", case: "Dativ", rule: "Hímnem" },
  { context: "Das ist", elements: { article: "ein", adj: "schwer", noun: "Koffer" }, correct: "ein schwerer Koffer", case: "Nominativ", rule: "Hímnem" },
  { context: "Ich trinke", elements: { article: "-", adj: "heiß", noun: "Suppe" }, correct: "heiße Suppe", case: "Akkusativ", rule: "Nőnem" },
  { context: "Er hat", elements: { article: "eine", adj: "stark", noun: "Stimme" }, correct: "eine starke Stimme", case: "Nominativ", rule: "Nőnem" },
  { context: "Ich sehe", elements: { article: "das", adj: "hell", noun: "Licht" }, correct: "das helle Licht", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Wir hören", elements: { article: "-", adj: "laut", noun: "Musik" }, correct: "laute Musik", case: "Akkusativ", rule: "Nőnem" },
  { context: "Sie gibt", elements: { article: "ein", adj: "klar", noun: "Antwort" }, correct: "eine klare Antwort", case: "Akkusativ", rule: "Nőnem" },
  { context: "Trotz", elements: { article: "der", adj: "klein", noun: "Unterschied" }, correct: "des kleinen Unterschieds", case: "Genitiv", rule: "Hímnem" },
  { context: "Wegen", elements: { article: "die", adj: "neu", noun: "Regel" }, correct: "der neuen Regel", case: "Genitiv", rule: "Nőnem" },
  { context: "Ich brauche", elements: { article: "ein", adj: "scharf", noun: "Messer" }, correct: "ein scharfes Messer", case: "Akkusativ", rule: "Semlegesnem" },
  { context: "Dort sind", elements: { article: "-", adj: "groß", noun: "Städte" }, correct: "große Städte", case: "Nominativ", rule: "Többes szám" },
  { context: "Er arbeitet für", elements: { article: "ein", adj: "reich", noun: "Mann" }, correct: "einen reichen Mann", case: "Akkusativ", rule: "Hímnem" },
  { context: "Wir wohnen hinter", elements: { article: "der", adj: "dunkel", noun: "Park" }, correct: "dem dunklen Park", case: "Dativ", rule: "Hímnem" },
  { context: "Es liegt an", elements: { article: "das", adj: "schlecht", noun: "System" }, correct: "dem schlechten System", case: "Dativ", rule: "Semlegesnem" },
  { context: "Ich gratuliere", elements: { article: "die", adj: "jung", noun: "Mutter" }, correct: "der jungen Mutter", case: "Dativ", rule: "Nőnem" },
  { context: "Sie hat", elements: { article: "-", adj: "blau", noun: "Augen" }, correct: "blaue Augen", case: "Nominativ", rule: "Többes szám" },
  { context: "Wir brauchen", elements: { article: "kein", adj: "neu", noun: "Plan" }, correct: "keinen neuen Plan", case: "Akkusativ", rule: "Hímnem" },
  { context: "Das ist", elements: { article: "das", adj: "schönst", noun: "Haus" }, correct: "das schönste Haus", case: "Nominativ", rule: "Superlativ" }
],
      filteredDeck: [],
      roundHistory: [],
      currentQuestion: null,
      userAnswer: "",
      isAnswered: false,
      isCorrect: null,
      showStatistics: false,
      correctAnswersInRound: 0,
      incorrectAnswersInRound: 0,
      totalQuestionsInRound: 5 // Rövidebb körök az intenzív gyakorláshoz
    };
  },
  computed: {
    progressPercentage() {
      return (this.roundHistory.length / this.totalQuestionsInRound) * 100;
    },
    displayIndex() {
      return Math.min(this.roundHistory.length + 1, this.totalQuestionsInRound);
    }
  },
  methods: {
    selectCase(c) {
      this.selectedCase = c;
      this.startRound();
    },
    shuffle(array) {
      return [...array].sort(() => Math.random() - 0.5);
    },
    startRound() {
      this.roundHistory = [];
      this.correctAnswersInRound = 0;
      this.incorrectAnswersInRound = 0;
      this.showStatistics = false;

      let pool = this.selectedCase === 'Mixed' 
        ? [...this.allQuestions] 
        : this.allQuestions.filter(q => q.case === this.selectedCase);

      this.filteredDeck = this.shuffle(pool);
      this.setNextQuestion();
    },
    setNextQuestion() {
      if (this.roundHistory.length === this.totalQuestionsInRound || this.filteredDeck.length === 0) {
        this.showStatistics = true;
        this.currentQuestion = null;
        return;
      }
      this.currentQuestion = this.filteredDeck.pop();
      this.isAnswered = false;
      this.userAnswer = "";
      this.isCorrect = null;
      this.$nextTick(() => { if (this.$refs.answerInput) this.$refs.answerInput.focus(); });
    },
    checkAnswer() {
      if (this.isAnswered || !this.userAnswer.trim()) return;
      const userVal = this.userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
      const correctVal = this.currentQuestion.correct.toLowerCase();
      this.isCorrect = userVal === correctVal;
      this.isAnswered = true;
      if (this.isCorrect) this.correctAnswersInRound++;
      else this.incorrectAnswersInRound++;
      this.roundHistory.push({ isCorrect: this.isCorrect });
    },
    handleEnter() {
      if (!this.isAnswered) this.checkAnswer();
      else this.nextQuestion();
    },
    nextQuestion() {
      this.setNextQuestion();
    },
    resetToSelector() {
      this.selectedCase = null;
      this.showStatistics = false;
    }
  }
};
</script>

<style scoped>
/* ALAP KONTÉNER */
.adjektiv-practice {
  width: 100%;
  max-width: 600px;
  padding: 40px 25px;
  text-align: center;
  box-sizing: border-box;
}

h1 { color: #ffffff; font-size: 1.8rem; margin-bottom: 25px; }

/* ESETVÁLASZTÓ */
.case-selector { animation: fadeIn 0.5s ease; }
.subtitle { color: #bdc3c7; margin-bottom: 30px; }
.case-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}
.btn-case {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 15px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-case:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
.btn-mixed { grid-column: span 2; background: #3498db; border: none; }
.case-indicator { color: #3498db; margin-bottom: 10px; text-transform: uppercase; font-size: 0.8rem; font-weight: bold; }

/* PROGRESS BAR */
.progress-container { max-width: 400px; margin: 0 auto 30px auto; }
.progress-bar {
  width: 100%; height: 8px;
  background: rgba(224, 230, 237, 0.2);
  border-radius: 4px; overflow: hidden; margin-bottom: 8px;
}
.progress-fill { height: 100%; background: #2ecc71; transition: width 0.3s ease; }
.progress-text { font-size: 0.9rem; color: #ffffff; margin: 0; }

/* QUESTION CARD */
.question-card { padding: 10px; margin-bottom: 25px; }
.adjektiv-display { font-size: 2.2rem; color: #ffffff; margin: 0; font-weight: bold; }
.meaning { font-style: italic; color: #bdc3c7; margin-bottom: 10px; font-size: 1.2rem; }

/* INPUT & BUTTONS */
.input-wrapper, .button-group { max-width: 400px; margin: 0 auto; }
input {
  width: 100%; padding: 15px 20px; border-radius: 50px;
  border: 2px solid rgba(223, 230, 233, 0.3); background: white;
  font-size: 18px; outline: none; transition: all 0.2s ease;
  box-sizing: border-box; margin-bottom: 15px;
}
input:focus { border-color: #3498db; }
.input-correct { border-color: #2ecc71 !important; background-color: #eafaf1; }
.input-wrong { border-color: #e74c3c !important; background-color: #fdf2f2; }
.input-icon { position: absolute; right: 20px; top: 25px; font-size: 20px; font-weight: bold; }
.correct-icon { color: #2ecc71; }
.wrong-icon { color: #e74c3c; }

button {
  width: 100%; padding: 15px 35px; border-radius: 50px; border: none;
  font-size: 16px; font-weight: bold; cursor: pointer;
  transition: background 0.2s ease; color: white; margin-bottom: 10px;
}
.btn-check { background: #2ecc71; }
.btn-next { background: #3498db; }

/* FEEDBACK */
.feedback-box { max-width: 400px; margin: 25px auto 0 auto; padding: 20px; border-radius: 15px; backdrop-filter: blur(5px); }
.fb-correct { background-color: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; color: #ffffff; }
.fb-wrong { background-color: rgba(255, 255, 255, 0.1); border: 2px solid #e74c3c; color: #ffffff; }
.wrong-highlight { background: #e74c3c; color: white; padding: 10px; border-radius: 10px; margin-bottom: 15px; font-weight: bold; font-size: 1.1rem; }
.wrong-highlight span { text-decoration: underline; font-size: 1.2rem; }
.rule-details { text-align: left; font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; }

/* POPUP */
.popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.popup-content { background: white; padding: 40px; border-radius: 20px; width: 400px; text-align: center; color: #2c3e50; }
.btn-popup-action { background: #2c3e50; margin-top: 20px; }
.secondary { background: #7f8c8d !important; margin-top: 10px !important; }
.correct-text { color: #2ecc71; font-weight: bold; }
.wrong-text { color: #e74c3c; font-weight: bold; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>