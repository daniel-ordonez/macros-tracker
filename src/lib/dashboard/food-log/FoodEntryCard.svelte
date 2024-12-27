<script>
	import { onMount, onDestroy } from "svelte"
  import {decimal} from "../../utils/format.mjs"
	import EditFoodEntryDialog from "./log-food/EditFoodEntryDialog.svelte";


  let {data} = $props()
  let macros = $state({
    protein: 0,
    carbs: 0,
    fat: 0
  })
  let el
  let dialog

  const getMacrosPercentages = data => {
    const protein = data.protein * 4
    const carbs = data.carbs * 4
    const fat = data.fat * 9
    const sum = protein + carbs + fat
    return {protein: 100/sum * protein, carbs: 100/sum * carbs, fat: 100/sum * fat}
  }
  const onCardClick = async (e) => {
    dialog.showModal(data)
  }

  onMount(() => {
    macros = getMacrosPercentages(data)
    el.addEventListener("click", onCardClick)
  })
  onDestroy(() => {
    el.removeEventListener("click", onCardClick)
  })
  
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="food-log-entry" bind:this={el}>
  <div class="row">
    <div class="food__name">{data.food}</div>
    <div class="food__brand">{data.brand}</div>
    <div class="numbers">
      <div class="food__serving">
        {decimal(data.grams)}
      </div>
      <small class="measure">g</small>
    </div>
  </div>
  <div class="row">
    <div class="food__macros">
      <div class="bg--macros-p bg-macros--p" style="width: {macros.protein}%"></div>
      <div class="bg--macros-c bg-macros--c"  style="width: {macros.carbs}%"></div>
      <div class="bg--macros-f bg-macros--f"  style="width: {macros.fat}%"></div>
    </div>
    <div class="numbers">
      <div class="food__cals">
        {decimal(data.calories)} 
      </div>
      <small class="measure">cals</small>
    </div>
  </div>
</div>

<EditFoodEntryDialog bind:this={dialog}></EditFoodEntryDialog>

<style>
  .food-log-entry {
    --bg-color: #f5f5f5;
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: .25rem;
    column-gap: .5rem;
    padding: .75rem;
    border-radius: .5rem;
    background-color: var(--bg-color);
    cursor: pointer;
  }
  .row {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  }
  .food-log-entry>.row:first-child {
    grid-template-rows: auto 1rem;
  }
  .numbers {
    grid-column: numbers;
    display: grid;
    grid-template-columns: subgrid;
  }
  .numbers:first-child {
    grid-row: 1 / span 2;
    display: grid;
    grid-template-columns: subgrid;
    align-self: center;
  }
  .numbers:nth-child(2) {
    opacity: 0.5;
  }
  .food__name {
    grid-row: 1;
    grid-column: name;
  }
  .food__brand {
    grid-row: 2;
    grid-column: brand;
    font-size: .5em;
    opacity: .5;
  }
  .food__serving, .food__cals {
    grid-column: serving;
    justify-self: end;
  }
  .food__macros {
    grid-column: macros;
    height: .5rem;
    width: 100%;
    align-self: center;
    display: flex;
    background-color: var(--parent-bg-color);
  }
  .measure {
    grid-column: measures;
  }
</style>