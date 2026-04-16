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
          <h2>Nomen-Verb</h2>
          <p>Kifejezések és példamondatok</p>
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
    </div>
  </div>
</template>

<script>
import VerbPractice from "./components/VerbPractice.vue";
import NomenVerbPractice from "./components/NomenVerbPractice.vue";

export default {
  name: "App",
  components: {
    VerbPractice,
    NomenVerbPractice,
  },
  data() {
    return {
      currentMode: null,
    };
  },
};
</script>

<style>
/* 1. Alapbeállítások a háttérnek */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-image: linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000);
  background-attachment: fixed;
}

/* 2. Ez a blokk felel a tökéletes középre igazításért */
#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Függőleges közép */
  align-items: center;     /* Vízszintes közép */
  padding: 20px;
  box-sizing: border-box;
}

/* 3. Gyakorló konténer */
.practice-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
  max-width: 600px;
  position: relative; /* Szükséges az abszolút pozícionált gombhoz */
}

/* 4. APPLE STÍLUSÚ VISSZA GOMB */
.back-button {
  position: absolute;
  top: -50px; /* A kártya felett helyezkedik el */
  left: 0;    /* A kártya bal széléhez igazítva */
  
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  
  /* iOS kék szín */
  color: #ffffff; 
  font-size: 18px;
  font-weight: 400;
  
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

/* iOS-szerű nyíl ikon hozzáadása */
.back-button::before {
  font-size: 32px;
  line-height: 0;
  margin-right: 4px;
  margin-top: -4px;
}

.back-button:hover {
  opacity: 0.6;
  background: none;
}

/* 5. Kezdőoldal elemei */
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

.menu-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.menu-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  width: 220px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.menu-card:hover {
  transform: scale(1.05);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

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
</style>