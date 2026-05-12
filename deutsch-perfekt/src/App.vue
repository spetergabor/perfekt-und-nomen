<template>
  <div id="app">
    <div v-if="!currentMode" class="welcome-screen">
      <h1>Deutsch Übungen</h1>
      <p class="subtitle">Válassz egy gyakorlatot a kezdéshez!</p>
      
      <div class="menu-grid">
        <div class="menu-card" @click="currentMode = 'perfekt'">
          <div class="card-icon">🚀</div>
          <h2>Perfekt Gyakorló</h2>
          <p>ist / hat + Partizip II</p>
          <button class="select-btn">Indítás</button>
        </div>

        <div class="menu-card" @click="currentMode = 'nomen-verb'">
          <div class="card-icon">📚</div>
          <h2>Nomen-Verb-Verbindungen</h2>
          <p>Kifejezések és példamondatok</p>
          <button class="select-btn">Indítás</button>
        </div>

        <div class="menu-card" @click="currentMode = 'adjektiv'">
          <div class="card-icon">🎨</div>
          <h2>Adjektivdeklination</h2>
          <p>Névelő + Melléknév ragozás</p>
          <button class="select-btn">Indítás</button>
        </div>

        <div class="menu-card" @click="currentMode = 'osd'">
          <div class="card-icon">🇦🇹</div>
          <h2>ÖSD Gyakorló</h2>
          <p>Vizsga-specifikus feladatok</p>
          <button class="select-btn">Indítás</button>
        </div>
      </div>
    </div>

    <div v-else class="practice-container">
      <button class="back-button" @click="currentMode = null">
        ← Vissza a menübe
      </button>
      
      <VerbPractice v-if="currentMode === 'perfekt'" />
      <NomenVerbPractice v-if="currentMode === 'nomen-verb'" />
      <AdjektivPractice v-if="currentMode === 'adjektiv'" />
      <OsdPractice v-if="currentMode === 'osd'" />
    </div>
  </div>
</template>

<script>
import VerbPractice from "./components/VerbPractice.vue";
import NomenVerbPractice from "./components/NomenVerbPractice.vue";
import AdjektivPractice from "./components/AdjektivPractice.vue";
import OsdPractice from "./components/OsdPractice.vue"; // Új import

export default {
  name: "App",
  components: {
    VerbPractice,
    NomenVerbPractice,
    AdjektivPractice,
    OsdPractice, // Regisztrálás
  },
  data() {
    return {
      currentMode: null, // 'perfekt', 'nomen-verb', 'adjektiv' vagy 'osd'
    };
  },

};
</script>

<style>
/* 1. GLOBÁLIS ÉS ALAPSTÍLUSOK */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-image: linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000);
  background-attachment: fixed;
}

#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 2. KONTÉNER ÉS CÍMSOROK */
.practice-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
  max-width: 800px; /* Megemelve, hogy elférjen a 2 oszlop */
  position: relative;
}

h1 {
  color: #ffffff;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
}

.subtitle {
  color: #bdc3c7;
  margin-bottom: 30px;
  text-align: center;
}

/* 3. A RÁCS (GRID) RENDSZER */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Fix 2 oszlop */
  gap: 20px;
  width: 100%;
  max-width: 1000px; 
  justify-items: center;
}

/* 4. A KÁRTYÁK STÍLUSA */
.menu-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 100%;
  max-width: 280px; 
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-card:hover {
  transform: scale(1.05);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.menu-card h2 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 10px 0;
}

.menu-card p {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* 5. GOMBOK ÉS INTERAKCIÓK */
.select-btn {
  margin-top: 15px;
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: background 0.3s;
}

.select-btn:hover {
  background-color: #27ae60;
}

.back-button {
  position: absolute;
  top: 0px;
  left: 0;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #ffffff; 
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

.back-button:hover {
  opacity: 0.6;
}

/* 6. RESPONSIVE (MOBIL) NÉZET */
@media (max-width: 650px) {
  .menu-grid {
    grid-template-columns: 1fr; /* Mobilon 1 oszlop */
  }
  
  .practice-container {
    max-width: 100%;
  }
  
  .menu-card {
    max-width: 320px; /* Mobilon lehet kicsit szélesebb a kártya */
  }
}
</style>