
<script>
  import {debounce} from "../utils/common.mjs"
	import { onMount } from "svelte";
  let {
    id,
    name = "input_" + id,
    min = 1,
    max,
    step = 1,
    value = $bindable(1),
    sideText = "",
    align = "center",
    padStart = "",
    onUpdate = () => {}
  } = $props();
  let el = $state()
  let inputElement
  let displayedValue = $state(value)
  let stepOffset = $state(0)
  let updateOnScroll = false
  let lastScrollPos = 0

  const resetOffset = debounce(() => {
    stepOffset = 0
  }, 500)

  const onScroll = e => {
    if (updateOnScroll) {
      const {target} = e
      const {height} = target.getBoundingClientRect()
      const {scrollHeight, scrollTop} = target
      const scrollDir = Math.sign(lastScrollPos - scrollTop)
      const scrollSize = scrollHeight - height
      const stepLength = scrollSize/steps
      // percentage 0 = no scroll, 100 = all scrolled
      //const p = (1 / scrollSize) * scrollTop
      //const pStep = p * steps
      //let scrolledValue = max - parseInt(pStep)
      const scrollStep = scrollTop / stepLength
      value = max - parseInt(scrollStep)
      stepOffset = scrollStep - (max - value)
      if (scrollDir < 0) {
        stepOffset *= -1
      } else {
        stepOffset = 1 - stepOffset
      }
      stepOffset = parseInt(stepOffset * 100) / 100
      resetOffset()
      lastScrollPos = scrollTop
    } else updateOnScroll = true
  }
  export const focus = () => {
    if (inputElement) {
      inputElement.focus()
      //inputElement.select()
    }
  }
  export const updateScrollPosition = (value) => {
    updateOnScroll = false
    const p = (1/steps) * (value - min)
    const fixedP = 1 - p
    const {height} = el.getBoundingClientRect()
    const {scrollHeight} = el
    const top = fixedP* (scrollHeight - height)
    el.scrollTo({top, behavior: "instant"})
  }
  const onBlur = ({target}) => {
    if (!target.value) {
      target.value = min
    }
    else if (target.value > max || target.value < min) {
      if (value > max || value < min) {
        value = Math.max(Math.min(displayedValue, max), min)
      }
      target.value = value
    }
    updateScrollPosition(value)
  }
  const onFocus = () => {
    updateOnScroll = false
  }
  const onInput = (e) => {
    const {target} = e
    const str = String(target.value)
    if (str.length > valueMaxLength) {
      e.preventDefault()
      target.value = str.substring(0, valueMaxLength)
    }
  }

  onMount(() => {
    if (!isNaN(value) && !isNaN(min) && !isNaN(max)) {
      value = Math.max(Math.min(displayedValue, max), min)
      requestAnimationFrame(() => {
        updateScrollPosition(Math.max(Math.min(value, max), min))
        el.addEventListener("scroll", onScroll)
      })
    }
  })

  const onValueUpdate = value => {
    const valueDisplayed = displayedValue
    if (value <= max && value >= min) {
      displayedValue = value
    }
    if (valueDisplayed != value) {
      onUpdate(value)
    }
    updateScrollPosition(value)
  }

  const displayStep = (delta) => {
    return padStart 
    ? String(displayedValue + delta).padStart(valueMaxLength, padStart) 
    : displayedValue + delta
  }

  const stepValue = (increment) => {
    return e => {
      e.preventDefault()
      e.stopImmediatePropagation()
      value += increment
    }
  }
  
  let valueMaxLength = $derived(String(max).length)
  let paddedValue = $derived(padStart ? String(displayedValue || 0).padStart(valueMaxLength, padStart) : displayedValue || 0)
  let steps = $derived(max - min)
  let sideChars = $derived(sideText?.length)


  $effect(() => {
    onValueUpdate(value)
  });
</script>

<label for="{id}" class="range-slider align--{align}" bind:this={el}>
  <div class="range__options align--{align}">
    <div class="steps-wrapper {sideChars? 'side-text' : ''}" style="--max-length: {valueMaxLength}; --side-chars: {sideChars}; --step-offset: {stepOffset};">
      <div class="input__step">{displayedValue <= max - (step * 2) ? displayStep((step * 2)) : ''}</div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="input__step" onclick={stepValue(step)}>{displayedValue <= max - step ? displayStep(step) : ''}</div>
      <div class="value-wrapper" data-side={sideText} data-pad-value={paddedValue}>
        <input bind:this={inputElement} type="number" oninput={onInput}
        onfocus={onFocus} onblur={onBlur} bind:value name="{name}" 
        id="{id}" {min} {max} {step} inputmode="numeric" pattern="\d*">
      </div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="input__step" onclick={stepValue(-step)}>{displayedValue >= min + step ? displayStep(-step) : ''}</div>
      <div class="input__step">{displayedValue >= min + (step * 2) ? displayStep(-(step * 2)) : ''}</div>
    </div>
  </div>
  <div class="range__track" style="--steps: {steps}">
  </div>
</label>


<style>
  .range-slider {
    --slider-height: 12rem;
    height: var(--slider-height);
    display: block;
    position: relative;
    overflow-y: auto;
    overflow-x: visible;
  }  
  .range-slider.align--right {
    direction: rtl;
  }
  .range-slider::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  .range-slider::-webkit-scrollbar-track {
    background: transparent;
  }
  .range-slider::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  .range__options {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: var(--slider-height);
    display: flex;
    justify-content: center;
    font-family: 'Menlo Regular';
  }
  .range__options.align--center {
    justify-content: center;
  }
  .range__options.align--left {
    justify-content: start;
  }
  .range__options.align--right {
    justify-content: start;
  }

  input[type="number"] {
    font-family: inherit;
    appearance: none;
    -moz-appearance: textfield;
    height: 4rem;
    padding:  .5em 0;
    border: none;
    border-radius: 0;
    outline: none;
    font-weight: 400;
    line-height: 1;
    font-size: 2rem;
    text-align: center;
    background-color: transparent;
  }
  .steps-wrapper.side-text > .value-wrapper > input[type=number],
  .steps-wrapper.side-text > .value-wrapper::before,
  .steps-wrapper.side-text > .input__step {
    text-align: right;
  }
  .value-wrapper {
    position: relative;
    display: inline-block;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: 0;
  }
  .value-wrapper::before {
    content: attr(data-pad-value);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4rem;
    padding:  .5em 0;
    border: none;
    font-weight: 400;
    line-height: 1;
    font-size: 2rem;
    text-align: center;
  }
  .value-wrapper:focus-within::before{
    opacity: 0.3;
  }
  .value-wrapper::after {
    content: attr(data-side);
    position: absolute;
    height: 100%;
    top: calc(50% - .5em);
    left: calc(100% + .5ch);
    pointer-events: none;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button
  {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .steps-wrapper {
    --depth: var(--slider-height);
    --pad: calc((var(--side-chars) * 1ch) + 1.5ch);
    --offset: calc(-3deg * var(--step-offset, 0));
    min-width: calc(2ch * var(--max-length));
    position: relative;
    will-change: transform;
    transform-style: preserve-3d;
    transform: perspective(var(--depth));
    padding-right: var(--pad);
  }
  
  /*
  * Ignore when theres sideText?
  */
  .range__options.align--center>.steps-wrapper:not(.side-text) {
    padding-left: var(--pad);
  }
  
  .input__step {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1em;
    font-size: 2rem;
    text-align: center;
    display: block;
    user-select: none;
    will-change: opacity;
    transition: opacity 200ms;
  }
  
  .input__step:nth-child(1),
  .input__step:nth-child(5) {
    opacity: 0.2;
    filter: blur(2px);
  }
  .input__step:nth-child(2),
  .input__step:nth-child(4) {
    filter: blur(1px);
    background-color: var(--bg-color);
    cursor: pointer;
  }
  
  .input__step:nth-child(1) {
    transform: rotateX(30deg) translateY(-50%);
  }
  .input__step:nth-child(2) {
    opacity: calc(0.4 + (0.2 * var(--step-offset, 0)));
    transform: rotateX(15deg) translateY(-50%);
  }
  .input__step:nth-child(4) {
    opacity: calc(0.4 - (0.2 * var(--step-offset, 0)));
    transform: rotateX(-15deg) translateY(-50%);
  }
  .input__step:nth-child(5) {
    transform: rotateX(-30deg) translateY(-50%);
  }

  /** 3D STUFF */
  .value-wrapper {
    transform: translateY(-50%) translateZ(calc(1 * var(--depth)));
  }
  .steps-wrapper {
    transform: perspective(var(--depth)) translateZ(calc(-1 * var(--depth))) rotateX(var(--offset));
    transition: transform 200ms ease-in-out;
  }
  .input__step:nth-child(1) {
    transform: rotateX(30deg) translateY(-50%) translateZ(calc(1 * var(--depth)));
  }
  .input__step:nth-child(2) {
    transform: rotateX(15deg) translateY(-50%) translateZ(calc(1 * var(--depth)));
  }
  .input__step:nth-child(4) {
    transform: rotateX(-15deg) translateY(-50%) translateZ(calc(1 * var(--depth)));
  }
  .input__step:nth-child(5) {
    transform: rotateX(-30deg) translateY(-50%) translateZ(calc(1 * var(--depth)));
  }
  /** 3D STUFF */
  .range__track {
    --scroll-step: 30px;
    height: calc((var(--steps, 0) * var(--scroll-step)));
  }
</style>