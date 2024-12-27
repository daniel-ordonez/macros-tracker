<script>

	import MacroSliders from "./MacroSliders.svelte";
  import InputSelect from "../inputs/InputSelect.svelte";
  import InputNumber from "../inputs/InputNumber.svelte";
  import { activityOptions } from "../stores/user";
	import { onMount } from "svelte";


  let {
    RMR,
    activity = $bindable(1),
    objective = "keep",
    weight,
    minCalories = 1200,
    baseMacros = {},
    onUpdate = () => {},
    isActive = false
  } = $props();

  let sliders
  let caloriesOffset = $state(0)
  let mingProtein = $state()

  let defaultMacros = {
    protein: 20,
    carbs: 50,
    fat: 30
  }
  let protein = $state(0)
  let carbs = $state(0)
  let fat = $state(0)

  const updateMinProtein = (objective, weight) => {
    if (objective === "gain") {
      mingProtein = Math.round(weight * 1.6)
    } else mingProtein = 0
  }

  const onObjectiveChange = objective => {
    if (objective === "gain") { // Add calorie surplus
      if (activity > 2) caloriesOffset ??= 500 
      else caloriesOffset ??= 250
    } else if (objective === "lose") { // add calorie deficit
      caloriesOffset ??= -500
    } else {
      caloriesOffset ??= 0
    }
  }

  const updateMacros = (calories, protein, carbs, fat) => {
    const macros = { calories, protein, carbs, fat}
    if (isActive) {
      onUpdate(macros)
    }
  }

  onMount(() => {
    protein = baseMacros.protein ?? defaultMacros.protein
    carbs = baseMacros.carbs ?? defaultMacros.carbs
    fat = baseMacros.fat ?? defaultMacros.fat
    if (RMR && baseMacros.calories) {
      caloriesOffset = baseMacros.calories - RMR
    }
    sliders.updateValues()
  })


  let selectOptions = $derived($activityOptions.map((item, index) => ({...item, value: index})))
  let caloriesFromActivity = $derived(($activityOptions[activity]?.value || 0) * RMR)
  let totalCalories = $derived(Math.round(RMR + caloriesFromActivity + caloriesOffset))
  
  $effect(() => {
    updateMinProtein(objective, weight)
    onObjectiveChange(objective)
    updateMacros(totalCalories, protein, carbs, fat)
  });
</script>


<div class="flex col row-gap--lg">
  <div class="flex col row-gap--md">
    <div>
      <InputSelect textAlign="center" name="activity" id="macros-activity" label="Actividad física" bind:value={activity} options={selectOptions}></InputSelect>
    </div>
    <div>

      {#if objective === "lose"}
        <InputNumber name="offset" id="calories-offset" label="Deficit de calorías" max={0} min={-1500} step={250} bind:value={caloriesOffset}>
            {#snippet right()}
              <span >kcal</span>
            {/snippet}
        </InputNumber>
      {:else if objective === "gain"}
        <InputNumber name="offset" id="calories-offset" label="Calorías adicionales" min={0} max={2000} step={250} bind:value={caloriesOffset}>
          {#snippet right()}
            <span >kcal</span>
          {/snippet}
        </InputNumber>
      {:else}
        <InputNumber name="offset" id="calories-offset" label="Calorías adicionales" min={0} max={2000} step={250} bind:value={caloriesOffset}>
          {#snippet right()}
            <span >kcal</span>
          {/snippet}
        </InputNumber>
      {/if}
    </div>
    <div>
      <div>Calorías diarias</div>
      <div class="cals">
        <div>{totalCalories}<small>kcal</small></div>
      </div>
      <div class="flex jc--center">
        {#if totalCalories <= minCalories}
        <span class="badge flex col-gap--xs ai--center bg--orange">
          <span class="material-symbols-outlined" style="font-size: 1em;">warning</span>
          MUY BAJO
        </span>
        {:else if objective === "lose"}
          <span class="badge">{Math.round(caloriesOffset / 500)} lbs por semana</span>
        {:else if objective === "gain" && protein < mingProtein}
          <span class="badge text--sm">Procura al menos {mingProtein}g de proteína</span>
        {/if}
      </div>
    </div>
  </div>
  <div class="flex col row-gap--sm">
    <div>Macros</div>
    <MacroSliders bind:this={sliders}
      calorieBudget={totalCalories} {mingProtein}
      bind:protein
      bind:carbs
      bind:fat
    ></MacroSliders>
  </div>
</div>


<style>

.cals {
    font-size: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .cals small {
    font-size: 1rem;
  }
</style>