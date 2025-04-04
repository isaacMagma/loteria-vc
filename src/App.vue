<template>
  <div class="loteria-container w-full flex flex-col gap-20 items-center pl-30">
    <!-- Controls section -->
    <!-- <div class="mt-2 flex gap-3">
      <button @click="drawCard"
        class="px-8 pt-[12px] pb-[14px] bg-[#ff6842] text-[#ffffff] text-primary-foreground rounded-md hover:bg-[#ff6842]/90 disabled:opacity-50 disabled:cursor-not-allowed text-2xl"
        :disabled="remainingCards === 0 || isDrawing">
        Draw Card
      </button>

      <button @click="resetDeck"
        class="px-8 pt-[12px] pb-[14px] bg-[#ffb300] text-secondary-foreground rounded-md hover:bg-[#ffb300]/90 text-2xl"
        :disabled="isDrawing">
        Reset Deck
      </button>
    </div> -->

    <div class="flex flex-col md:flex-row gap-8 w-full">
      <!-- Deck section -->
      <div class="deck-section">
        <div v-if="remainingCards > 0" @click="drawCard" class="deck" :class="{ 'empty': remainingCards === 0 }" :style="{ '--remaining-cards': remainingCards }">
          <div class="card card-back">
            <div v-if="isDrawing" class="card card-back card-drawing"></div>
          </div>
        </div>
      </div>

      <!-- Drawn cards section -->
      <div class="drawn-cards-section">
        <div v-if="drawnCards.length !== 0" class="drawn-cards" @click="resetDeck">
          <transition-group name="card-fall">
            <div v-for="(card, index) in drawnCards" :key="card.id" class="card card-front" :style="{
              top: `${index * 3}px`,
              left: `${index * 1}px`,
              zIndex: drawnCards.length - index,
              '--fall-x-offset': `${card.animOffsetX}px`,
              '--fall-y-offset': `${card.animOffsetY}px`,
              '--fall-rotation': `${card.animRotation}deg`
            }">
              <img :src="card.image" :alt="card.name" class="card-image" />
              <div class="card-name">{{ card.name }}</div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Create the lotería cards
const createDeck = () => {
  const cards = [
    { id: 1, name: "mvp", image: "/cards/01-mvp.png" },
    { id: 2, name: "pivot", image: "/cards/02-pivot.png" },
    { id: 3, name: "burnrate", image: "/cards/03-burnrate.png" },
    { id: 4, name: "angel-r", image: "/cards/04-angel-r.png" },
    { id: 5, name: "seed-round", image: "/cards/05-seed-round.png" },
    { id: 6, name: "pitch", image: "/cards/06-pitch.png" },
    { id: 7, name: "unicorn", image: "/cards/07-unicorn.png" },
    { id: 8, name: "founder", image: "/cards/08-founder.png" },
    { id: 9, name: "due-diligence", image: "/cards/09-due-diligence.png" },
    { id: 10, name: "valuation", image: "/cards/10-valuation.png" },
    { id: 11, name: "exit", image: "/cards/11-exit.png" },
    { id: 12, name: "pitch-deck", image: "/cards/12-pitch-deck.png" },
    { id: 13, name: "venture-partner", image: "/cards/13-venture-partner.png" },
    { id: 14, name: "accelerator", image: "/cards/14-accelerator.png" },
    { id: 15, name: "bootstrapped", image: "/cards/15-bootstrapped.png" },
    { id: 16, name: "elevator-pitch", image: "/cards/16-elevator-pitch.png" },
    { id: 17, name: "network", image: "/cards/17-network.png" },
    { id: 18, name: "ipo", image: "/cards/18-ipo.png" },
    { id: 19, name: "cto", image: "/cards/19-cto.png" },
    { id: 20, name: "ceo", image: "/cards/20-ceo.png" },
    { id: 21, name: "cfo", image: "/cards/21-cfo.png" },
    { id: 22, name: "ecosistema", image: "/cards/22-ecosistema.png" },
    { id: 23, name: "captable", image: "/cards/23-captable.png" },
    { id: 24, name: "limited-partner", image: "/cards/24-limited-partner.png" },
    { id: 25, name: "value-prop", image: "/cards/25-value-prop.png" },
    { id: 26, name: "tam", image: "/cards/26-tam.png" },
    { id: 27, name: "aquihire", image: "/cards/27-aquihire.png" },
    { id: 28, name: "dpi", image: "/cards/28-dpi.png" },
    { id: 29, name: "mentor", image: "/cards/29-mentor.png" },
    { id: 30, name: "runway", image: "/cards/30-runway.png" },
    { id: 31, name: "moonshot", image: "/cards/31-moonshot.png" },
    { id: 32, name: "hockey-stick", image: "/cards/32-hockey-stick.png" },
    { id: 33, name: "bubble", image: "/cards/33-bubble.png" },
    { id: 34, name: "AI", image: "/cards/34-AI.png" },
    { id: 35, name: "blockchain", image: "/cards/35-blockchain.png" },
    { id: 36, name: "pay2play", image: "/cards/36-pay2play-.png" },
    { id: 37, name: "term-sheet", image: "/cards/37-term-sheet.png" },
    { id: 38, name: "safe-note", image: "/cards/38-safe-note.png" },
    { id: 39, name: "dilution", image: "/cards/39-dilution.png" },
    { id: 40, name: "fundraise", image: "/cards/40-fundraise.png" },
  ];
  return cards;
};

// Shuffle the deck using Fisher-Yates algorithm
const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate random animation values within a reasonable range
const generateRandomAnimValues = () => {
  return {
    animOffsetX: Math.floor(Math.random() * 21) - 10, // -10 to 10px
    animOffsetY: -40 - Math.floor(Math.random() * 20), // -40 to -60px
    animRotation: Math.floor(Math.random() * 9) - 4, // -4 to 4 degrees
  };
};

// State
const deck = ref([]);
const drawnCards = ref([]);
const isDrawing = ref(false);

// Computed properties
const remainingCards = computed(() => deck.value.length);

// Methods
const initializeDeck = () => {
  const newDeck = createDeck();
  deck.value = shuffleDeck(newDeck);
  drawnCards.value = [];
};

const drawCard = () => {
  if (deck.value.length > 0 && !isDrawing.value) {
    isDrawing.value = true;
    
    // Add a delay to allow the card-leave animation to complete
    setTimeout(() => {
      const card = deck.value.pop();
      
      // Add random animation values and timestamp to make each card unique
      const newCard = { 
        ...card, 
        _timestamp: Date.now(),
        ...generateRandomAnimValues()
      };
      
      drawnCards.value.unshift(newCard); // Add to the beginning to show newest first
      
      // Reset the drawing state after the card has been added to drawn cards
      setTimeout(() => {
        isDrawing.value = false;
      }, 500); // Match the animation duration
    }, 500); // This delay should match the card-drawing animation duration
  }
};

const resetDeck = () => {
  if (!isDrawing.value) {
    initializeDeck();
  }
};

// Initialize on component mount
onMounted(() => {
  initializeDeck();
});
</script>

<style scoped>
.loteria-container {
  max-width: 1200px;
  margin: 0 auto;
}

.deck-section,
.drawn-cards-section {
  flex: 1;
}

.deck {
  position: relative;
  width: 30vw;
  max-width: 360px;
  height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  margin-bottom: 1rem;
}

/* Create the stacked cards effect */
.deck::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 30vw;
  max-width: 360px;
  height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  background-color: #000;
  opacity: 0.1;
  border-radius: 8px;
  z-index: -1;
}

/* Add more layers to create a stack effect */
.deck::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 6px;
  width: 30vw;
  max-width: 360px;
  height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  background-color: #000;
  opacity: 0.05;
  border-radius: 8px;
  z-index: -2;
}

.card {
  width: 30vw;
  max-width: 360px;
  height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  max-width: 360px;
}

.card-back {
  background-image: url('/cards/00-cover.png');
  background-size: 30px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Card drawing animation */
.card-drawing {
  position: absolute;
  top: 0;
  left: 0;
  animation: card-leave 0.5s ease-out forwards;
  z-index: 10;
}

@keyframes card-leave {
  0% {
    transform: translateX(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) translateY(-50px) rotate(10deg);
    opacity: 0;
  }
}

.remaining-count {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  color: #b91c1c;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.empty-deck {
  width: 30vw;
  max-width: 360px;
  height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.card-front {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-name {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.drawn-cards {
  position: relative;
  min-height: calc(30vw * 1.5);
  max-height: calc(min(30vw * 1.5, 360px * 1.5));
  width: 100%;
}

.drawn-cards .card {
  position: absolute;
  transition: all 0.3s ease;
}

/* Randomized card falling animation using CSS variables */
.card-fall-enter-active {
  animation: card-falling 0.5s ease-out;
}

@keyframes card-falling {
  0% {
    transform: translateX(var(--fall-x-offset, 0)) translateY(var(--fall-y-offset, -50px)) rotate(var(--fall-rotation, 2deg));
    opacity: 0;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  70% {
    transform: translateY(5px) rotate(calc(var(--fall-rotation, 2deg) * -0.5));
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

.card-fall-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.card-fall-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.card-fall-move {
  transition: all 0.5s ease;
}

.no-cards-message {
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .drawn-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>