<script>
	import { activityOptions } from "../../stores/user";
  let { cals = $bindable(0), value = $bindable(2) } = $props();
  let currentOption = $derived($activityOptions[parseInt(value)])
  let inputRange

  export const focus = () => {
    const isFocus = document.activeElement === inputRange
    inputRange.focus()
    return !isFocus
  }
</script>

<div id="input-activity">
  <div class="cals">
    <div class="flex--grow flex jc--center ai--center">
    +{Math.round(cals * currentOption.value)}<small>kcal</small>
    </div>
  </div>
  <div class="flex col col-gap--md">
    <div class="selection-name">{currentOption.name}</div>
    <div style="min-height: 3rem;">{currentOption.description}</div>
  </div>
  <div class="slider flex--100">
    <input bind:this={inputRange} type="range" step="1" min="0" max="{$activityOptions?.length - 1}" bind:value />
  </div>
</div>



<style>
  #input-activity {
    display: grid;
    grid-template-rows: 1fr auto auto;
  }
  .selection-name {
    font-size: 1.5rem;
    margin-bottom: .5rem;
    font-weight: 500;
  }
  .slider {
    padding: 1rem;
  }
  .slider>input {
    width: 100%;
  }
  .cals {
    font-size: 4rem;
    min-height: 12rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .cals small {
    font-size: 1rem;
  }
</style>