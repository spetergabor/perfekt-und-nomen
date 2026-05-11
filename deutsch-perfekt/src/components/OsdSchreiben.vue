<template>
  <div class="schreiben-layout">
    
    <div class="task-description">
      <div class="panel-header">{{ currentSchreibenTask.title }}</div>
      <div class="scroll-text">
        <p><strong>Szituáció:</strong> {{ currentSchreibenTask.situation }}</p>
        <p><strong>Hirdetés pontjai:</strong></p>
        <ul class="points-list">
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
      <div class="panel-header">Saját levél</div>
      <textarea v-model="userText" placeholder="Írja ide a panaszlevelet..." spellcheck="false"></textarea>
      
      <div class="word-count-bar">
        <div :class="['word-count-badge', wordCount >= 120 ? 'success' : 'warning']">
          Szavak száma: <strong>{{ wordCount }}</strong> / 120
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Csak a Schreiben adatokat importáljuk
import { schreibenTasks } from '../data/OsdSchreibenData.js';

export default {
  name: "OsdSchreiben",
  data() {
    return {
      schreibenTasks: schreibenTasks,
      showPhrases: false,
      userText: "",
    };
  },
  computed: {
    currentSchreibenTask() { 
      return this.schreibenTasks[0]; 
    },
    wordCount() {
      // Szavak számának kiszámítása (szóközök mentén darabol)
      return this.userText.trim() ? this.userText.trim().split(/\s+/).length : 0;
    }
  }
};
</script>

<style scoped>
/* LESEVERSTEHEN/LÜCKENTEXT-HEZ HASONLÓ ÜVEGHATÁSÚ DIZÁJN */
.schreiben-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
  margin-top: 20px;
  animation: fadeIn 0.4s ease;
}

@media (max-width: 800px) {
  .schreiben-layout {
    flex-direction: column;
  }
}

/* Panelek közös stílusa */
.task-description, .writing-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.panel-header {
  background: rgba(52, 152, 219, 0.2);
  padding: 12px 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #3498db;
  text-align: left;
}

/* Bal oldal: Feladatleírás */
.scroll-text {
  padding: 25px;
  overflow-y: auto;
  text-align: left;
  line-height: 1.6;
  color: #ecf0f1;
}

.points-list {
  margin-left: 20px;
  margin-bottom: 20px;
}

.points-list li {
  margin-bottom: 8px;
}

.instruction {
  color: #f1c40f;
  font-weight: bold;
  margin-bottom: 25px;
  padding: 15px;
  background: rgba(241, 196, 15, 0.1);
  border-left: 4px solid #f1c40f;
  border-radius: 4px;
}

/* Hasznos kifejezések lenyíló */
.btn-toggle-phrases {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-toggle-phrases:hover {
  background: rgba(255, 255, 255, 0.2);
}

.phrases-list {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px 15px 15px 35px;
  border-radius: 10px;
  margin-top: 10px;
  font-style: italic;
  color: #bdc3c7;
}

/* Jobb oldal: Szövegmező */
textarea {
  flex: 1;
  background: transparent;
  border: none;
  padding: 25px;
  color: #ffffff;
  font-size: 1.05rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.word-count-bar {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.word-count-badge {
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.warning {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.success {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  border: 1px solid #2ecc71;
}

/* Animációk */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  opacity: 1;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>