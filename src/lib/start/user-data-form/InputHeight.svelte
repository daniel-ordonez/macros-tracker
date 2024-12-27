<script>
	import { onMount } from "svelte";
	import RangeScroller from "../../inputs/RangeScroller.svelte";
  let {
    id,
    value = $bindable(),
    step = 10,
    maxMeters = 2,
    onInput = () => {}
  } = $props();
  const maxCm = 99
  let scrollerM
  let scrollerC
  let meters = $state(0)
  let centimeters = $state(0)
  
  const plusN = (n = 1) => {
    value = Math.min(maxValue, value + n)
    scrollerC.updateScrollPosition(value % 100)
    scrollerM.updateScrollPosition(Math.round(value / 100))
  }
  const minusN = (n = 1) => {
    value = Math.max(0, value - n)
    scrollerC.updateScrollPosition(value % 100)
    scrollerM.updateScrollPosition(Math.round(value / 100))
  }
  
  const combineValues = (meters, centimeters) => {
    const newValue = (meters * 100) + centimeters
    if (newValue !== value) {
      value = newValue
      onInput(value)
    }
  }
  const splitValue = value => {
    if (value && value >= 0 && value < maxValue) {
      meters = parseInt(value / 100)
      centimeters = value % 100
    } else {
      value = Math.min(Math.max(value, 0), max)
    }
  }

  export const focusM = () => {
    scrollerM.focus()
  }
  export const focusC = () => {
    scrollerC.focus()
  }

  let maxValue = $derived((maxMeters * 100) + maxCm)

  onMount(() => {
    splitValue(value)
  })

  $effect(() => {
    combineValues(meters, centimeters)
  })
</script>


<div id="input-height" class="flex col">
  <div class="flex col">
    <button class="btn btn--text-blue jc--center " onclick={()=>{plusN(step)}}>+ {step}<small>cm</small></button>
    
    <div class="hr"></div>
  </div>
  <div class="flex">
    <div class="flex--50">
      <RangeScroller bind:this={scrollerM} 
      sideText="m" align="right" bind:value={meters} id={id+"-m"} min={0} max={maxMeters}></RangeScroller>
    </div>
    <div class="flex--50">
      <RangeScroller bind:this={scrollerC} padStart="0"
      sideText="cm" align="left" bind:value={centimeters} id={id+"-cm"} min={0} max={maxCm}></RangeScroller>
    </div>
  </div>
  <div class="flex col">
    <div class="hr"></div>
    <button class="btn btn--text-blue jc--center" onclick={()=>{minusN(step)}}>- {step}<small>cm</small></button>
  </div>
</div>

<style>
  #input-height .btn {
    font-size: 1.5rem;
    padding: 1rem;
  }
 </style>