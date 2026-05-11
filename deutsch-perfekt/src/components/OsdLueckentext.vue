<template>
  <div class="luecken-layout">
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
</template>

<script>
// Csak azt importáljuk, ami ide kell!
import { lueckenTextFull } from '../data/OsdLueckentextData.js';

export default {
  name: "OsdLueckentext",
  data() {
    return {
      lueckenData: lueckenTextFull,
      answersLuecken: {},
      isLueckenChecked: false,
    };
  },
  methods: {
    checkLuecken() {
      this.isLueckenChecked = true;
    },
    isLueckenCorrect(id) {
      const correct = this.lueckenData.parts.find(p => p.id === id).correct;
      const answer = (this.answersLuecken[id] || "").trim().toLowerCase().replace(/[^a-zäöüß-]/g, '');
      const correctClean = correct.toLowerCase().replace(/[^a-zäöüß-]/g, '');
      
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
    }
  }
};
</script>

<style scoped>
/* IDE CSAK A LÜCKENTEXT SPECIÁLIS STÍLUSAI KERÜLNEK */
.luecken-layout {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.luecken-card {
  background: rgba(255, 255, 255, 0.05) !important; 
  backdrop-filter: blur(10px) !important; 
  border-radius: 20px !important;
  padding: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  text-align: left;
  margin-top: 15px !important;
  margin-bottom: 25px !important;
}



.divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 20px 0;
}

.luecken-paragraph {
  font-size: 1.15rem;
  line-height: 2.3;
  color: #ecf0f1;
  text-align: left;
}

.input-wrapper-inline {
  display: inline-block;
  white-space: nowrap;
}

/* Szuper-specifikus szelektor az agresszív globális formázások ellen */
div.luecken-full-text input.luecken-input[type="text"] {
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  background-color: transparent !important;
  background: none !important;
  border: none !important;
  border-bottom: 2px solid #3498db !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  width: 45px !important;
  min-width: 45px !important;
  max-width: 45px !important;
  height: 25px !important;
  min-height: 25px !important;
  max-height: 25px !important;
  padding: 0 !important;
  margin: 0 4px 0 0 !important;
  color: #f1c40f !important;
  font-size: 1.15rem !important;
  font-weight: bold !important;
  text-align: center !important;
  outline: none !important;
  line-height: 1 !important;
}

div.luecken-full-text input.luecken-input[type="text"]:focus {
  border-bottom-color: #f1c40f !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.gap-number {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-left: 2px;
  user-select: none;
}

.luecken-correct {
  border-bottom-color: #2ecc71 !important;
  color: #2ecc71 !important;
}

.luecken-wrong {
  border-bottom-color: #e74c3c !important;
  color: #e74c3c !important;
  text-decoration: line-through;
}

.luecken-correction {
  color: #e74c3c;
  font-weight: bold;
  margin-left: 5px;
  font-size: 1rem;
}

@media (max-width: 600px) {
  .luecken-card {
    padding: 15px !important;
    margin-top: 15px !important;
    margin-bottom: 20px !important;
  }
  .luecken-full-text {
    padding: 15px !important;
    margin-top: 20px !important;
  }
  .luecken-paragraph {
    font-size: 1.05rem; 
    line-height: 1.9; 
  }
  div.luecken-full-text input.luecken-input[type="text"] {
    width: 35px !important;
    min-width: 35px !important;
    max-width: 35px !important;
  }
}

/* --- GOMBOK FORMÁZÁSA --- */
.button-group {
  display: flex;
  justify-content: flex-end; /* Jobbra igazítja a gombot */
  margin-top: 5px;
  margin-bottom: 20px;
}

.btn-check, .btn-next {
  background: #3498db;
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  border-radius: 30px; /* Kapszula forma */
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3); /* Finom kék ragyogás */
}

.btn-check:hover, .btn-next:hover {
  background: #2980b9;
  transform: translateY(-2px); /* Picit felemelkedik, ha fölé viszed az egeret */
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5);
}

.btn-check:active, .btn-next:active {
  transform: translateY(1px); /* Kattintáskor picit lenyomódik */
  box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
}
</style>