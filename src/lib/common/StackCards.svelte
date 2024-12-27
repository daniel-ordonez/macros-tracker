<script>
	import { onMount } from "svelte";
  import {gsap} from "gsap"
let wrapper
let {items, pos = $bindable(0), children} = $props()
let active = $state()
let back = $state()
let hiddenCards = new Set()
const cardsOut = new Map()

const clearActiveCard = () => {
  active?.classList.remove("active")
  active = null
}
const setActiveCard = el => {
  active = el
  active.classList.remove("hidden")
  active.classList.add("active")
}

const updateActiveCard = () => {
  // store current active to animate out
  updateCardsOut()
  const activeOut = cardsOut.get("active")
  // defauilt case
  const cards = Array.from(wrapper.children).filter(el => !el.classList.contains("back-card"))
  if (cards.length === 1) {
    setActiveCard(cards[0])
    hiddenCards.clear()
    return
  }
  // reset hidden cards
  hiddenCards.forEach(el => {
    el.classList.remove("hidden")
  })
  hiddenCards.clear()
  // reset active and back cards
  clearActiveCard()
  // update active and back card
  for (let i = 0; i < cards.length; i++) {
    if (i === pos) {
      setActiveCard(cards[i])
    } else if (activeOut!== cards[i]){
      // dont hide active out before animation
      hiddenCards.add(cards[i])
    }
  }
  // hide other cards
  hiddenCards.forEach(el => {
    el.classList.add("hidden")
  })
}

const updateCardsOut = () => {
  cardsOut.set("active", active)
}
const animateCardsOut = () => {
  const activeOut = cardsOut.get("active")
  activeOut.style.zIndex = 10

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(activeOut, { clearProps: "all" });
      gsap.set(active, { clearProps: "all" });
      gsap.set(back, { clearProps: "all" });
    }
  })
  if (activeOut && activeOut !== active) {
    tl.fromTo(activeOut, {
      translateY: 0,
      opacity: 1,
      scale: 1
    }, {
      translateY: "20%",
      opacity: 0,
      scale: 0.9,
      duration: .3,
      ease: "power1.out",
      onComplete: () => {
        activeOut.style.zIndex = null
      },
    })
    tl.fromTo(active, {
      translateY: "-7%",
      scale: .9
    }, {
      translateY: 0,
      scale: 1,
      opacity: 1,
      duration: .5
    }, "<")
    tl.fromTo(back, {
      translateY: "0",
      opacity: 0,
    }, {
      translateY: "-7%",
      opacity: 1,
      scale: .9,
      duration: .5,
    }, "-=.3")
  }
}

export const prev = () => {
  toPos((items + pos - 1) % items)
}

export const next = () => {
  toPos(pos+1)
}

export const toPos = i => {
  pos = i % items
  updateActiveCard()
  animateCardsOut()
}

onMount(() => {
  updateActiveCard()
})
</script>

<div class="stack-cards" style="--stepsCount:{items}; --step:{pos}">
  <div bind:this={wrapper} class="stack-cards__wrapper"  >
    {#if items>1}
    <div class="back-card" bind:this={back}></div>
    {/if}
    {@render children?.()}
  </div>
</div>

<style>
.stack-cards {
  width: 100%;
}
.stack-cards__wrapper {
  align-self: center;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr;
  grid-auto-flow: column;
}
:global(.stack-cards__wrapper>*) {
  grid-column: 1;
  grid-row: 1;
  z-index: 0;
}
.back-card {
  width: var(--card-width, auto);
  margin: 0 auto;
  transform: translateY(-7%) scale(0.9);
  filter: brightness(0.95);
  background: white;
  border-radius: 1rem;
}
:global(.stack-cards__wrapper>*.active){
  box-shadow: 0 -4px 16px -8px rgba(0,0,0,0.125);
  z-index: 1;
}
</style>