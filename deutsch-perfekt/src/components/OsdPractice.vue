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

      <OsdLueckentext v-if="selectedPart === 'lueckentext'" />
      <OsdLeseverstehen v-if="selectedPart === 'leseverstehen'" />
      <OsdSchreiben v-if="selectedPart === 'schreiben'" />
      <OsdHoerverstehen v-if="selectedPart === 'hoereverstehen'" />

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
// GYEREKKOMPONENSEK IMPORTÁLÁSA
import OsdLueckentext from './OsdLueckentext.vue';
import OsdLeseverstehen from './OsdLeseverstehen.vue';
import OsdSchreiben from './OsdSchreiben.vue';
import OsdHoerverstehen from './OsdHoerverstehen.vue'; // AZ ÚJ HÖRVERSTEHEN IMPORTÁLÁSA

// MÁR CSAK AZ INFO POPUP ADATAI KELLENEK
import { examInfo } from '../data/OsdExamInfo.js';

export default {
  name: "OsdPractice",
  components: {
    OsdLueckentext,
    OsdLeseverstehen,
    OsdSchreiben,
    OsdHoerverstehen // AZ ÚJ KOMPONENS REGISZTRÁLÁSA
  },
  data() {
    return {
      selectedPart: null,
      showInfoPopup: false,
      examDetails: examInfo,
    };
  },
  methods: {
    selectPart(part) { 
      this.selectedPart = part; 
    },
    getPartName(part) {
      const names = { 
        lueckentext: 'Lückentext', 
        leseverstehen: 'Leseverstehen', 
        hoereverstehen: 'Hörverstehen', 
        schreiben: 'Schreiben' 
      };
      return names[part];
    }
  }
};
</script>

<style scoped src="./OsdStyles.css"></style>