<script>
	import { onMount } from "svelte";
  import {gsap} from "gsap";
  let {
    stepsCount = $bindable(1),
    step = $bindable(1),
    movingTo = $bindable(0),
    movingFrom = $bindable(0),
    children
  } = $props();

  let wrapper = $state()

  const movingToPrev = () => {
    movingFrom = step
    movingTo = step - 1
  }
  const decreaseStep = () => {
    step--;
  }


  const animateSlider = (current, next, onStart, onComplete) => {
    if (current === next) return
    const tl = gsap.timeline({onStart, onComplete})
    tl.to(wrapper.children[current],
      {
        opacity: 0,
        duration: .5,
        onComplete: () => {
          wrapper.children[current].classList.add("visibility--hidden")
        }
      }
    )
    tl.to(wrapper,
      {
        translateX: `${(100 / stepsCount) * (next) * -1}%`,
        duration: .8,
        ease: "power2.in"
      },
      "-=0.6"
    )
    tl.to(wrapper.children[next],
      {
        opacity: 1
      },
      "<"
    )
  }

  const animateBackward = () => {
    const current = Math.max(0, step - 1)
    const next = Math.max(0, current - 1)
    wrapper.children[next].classList.remove("visibility--hidden")
    requestAnimationFrame(() => {
      animateSlider(current, next, movingToPrev, decreaseStep)
    })
  }


  const movingToNext = () => {
    movingFrom = step
    movingTo = step + 1
  }
  const increaseStep = () => {
    step++
  }
  const animateForward = () => {
    const current = Math.max(0, step - 1)
    const next = Math.min(stepsCount, current + 1)
    wrapper.children[next].classList.remove("visibility--hidden")
    requestAnimationFrame(() => {
      animateSlider(current, next, movingToNext, increaseStep)
    })
  }

  export const prevStep = () => {
    if (step > 1) {
      animateBackward()
    }
  }
  export const nextStep = () => {
    if (step < stepsCount) {
      animateForward()
    }
  }
  onMount(() => {
    stepsCount = wrapper.childElementCount
    // when no children
    if (!stepsCount) return
    const current = Math.max(0, step - 1)
    // hide other steps
    Array.from(wrapper.children).forEach((el, index) => {
      if (index !== current) el.classList.add("visibility--hidden")
    })
    // move to current step
    gsap.to(wrapper.children[current], {
      opacity: 1,
      duration: 0
    })
    gsap.to(wrapper, 
    {
      translateX: `${(100 / stepsCount) * step * -1}%`,
      duration: 0
    })
  })
</script>




<div class="stepsCount-slider" style="--stepsCount:{stepsCount}; --step:{step}">
  <div bind:this={wrapper} class="stepsCount-wrapper"  >
    {@render children?.()}
  </div>
</div>

<style>

.stepsCount-slider {
    width: 100%;
    overflow: hidden;
  }
  .stepsCount-wrapper {
    width: calc(100% * var(--stepsCount));
    display: grid;
    grid-template-columns: repeat(var(--stepsCount), 1fr);
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    will-change: transform;
  }
</style>