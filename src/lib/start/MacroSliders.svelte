
<script>
	import { onMount } from 'svelte';

  let {
    calorieBudget = 2000,
    mingProtein,
    protein = $bindable(),
    carbs = $bindable(),
    fat = $bindable()
  } = $props();

  const kProtein = 4
  const kCarbs = 4
  const kFat = 9

  let gProtein = $state()
  let gCarbs = $state()
  let gFat = $state()
  let locked = $state(null)
  let lockedValue = $state(0)
  let el
  const previous = new Map()
  const current = new Map()

  const updatePreviousValues = () => {
    previous.set("protein", protein)
    previous.set("carbs", carbs)
    previous.set("fat", fat)
  }
  const logCurrentValues = () => {
    current.set("protein", protein)
    current.set("carbs", carbs)
    current.set("fat", fat)
  }
  const updateCurrentValues = () => {
    protein = current.get("protein") || 0
    carbs = current.get("carbs") || 0
    fat = current.get("fat") || 0
    updatePreviousValues()
  }

  const scaleCurrentValues = (target, locked) => {
    console.group("scale current values")

    const currentLocked = locked ? current.get(locked) : 0
    const pool = 100 - current.get(target) - currentLocked
    const previousPool = 100 - previous.get(target) - currentLocked
    const scale = !pool || !previousPool ? 0 : 1 / previousPool * pool

    const newMap = new Map(current)
    newMap.delete(target)
    newMap.delete(locked)
    // when a value is decreased
    if (pool > previousPool) {
      const zeros = new Set()
      newMap.keys().forEach(key => {
        if (!newMap.get(key)) zeros.add(key)
      })
      // if there was a 0 value
      if (zeros.size) {
        // split percentage pool so that 0 scale
        const split = (pool - previousPool) / zeros.size
        zeros.forEach(key => {
          current.set(key, split)
          newMap.delete(key)
        })
      }
    }

    newMap.forEach((value, key) => {
      current.set(key, value * scale)
    });

    console.groupEnd()
  }

  const onPValueChange = (e, key, locked) => {
    logCurrentValues()
    if (locked === key) {
      current.set(key, lockedValue)
      e.preventDefault()
      e.stopImmediatePropagation()
      return updateCurrentValues()
    } else {
      if (current.get(key) > maxAllowed) {
        current.set(key, maxAllowed)
      }
      scaleCurrentValues(key, locked)
      updateCurrentValues()
    }
  }

  const onPChangeProtein = (e) => {
    onPValueChange(e, "protein", locked)
  }

  const onPChangeCarbs = (e) => {
    onPValueChange(e, "carbs", locked)
  }

  const onPChangeFat = (e) => {
    onPValueChange(e, "fat", locked)
  }

  const onPChange = (calorieBudget, protein, carbs, fat) => {
    gProtein = Math.round((calorieBudget / kProtein) * protein / 100)
    gCarbs = Math.round((calorieBudget / kCarbs) * carbs  / 100)
    gFat = Math.round((calorieBudget / kFat) * fat  / 100)
  }

  const toggleLock = (key) => {
    locked = locked === key ? null : key
    lockedValue = current.get(key)
  }

  export const updateValues = () => {
    updatePreviousValues()
    logCurrentValues()
  }


  let lockedProtein = $derived(locked === "protein")
  let lockedCarbs = $derived(locked === "carbs")
  let lockedFat = $derived(locked === "fat")
  let maxAllowed = $derived(lockedValue ? 100 - lockedValue : 100)

  $effect(() => {
    onPChange(calorieBudget, protein, carbs, fat)
  });
</script>


<label class="flex col row-gap--sm" bind:this={el}>
  <div class="flex col-gap--sm ai--center">
    <span>Proteina</span>
    <span>{Math.round(protein)}%</span>
    {#if gProtein < mingProtein}
    <small>
      <div class="badge flex col-gap--xs ai--center bg--yellow">
        <span class="material-symbols-outlined" style="font-size: 1em;">warning</span>
        BAJO
      </div>
    </small>
    {/if}
    <button class="btn label-icon-btn {lockedProtein ? 'active' : ''}" onclick={() => toggleLock("protein")}>
      <span class="material-symbols-outlined">
        {#if lockedProtein}
        lock
        {:else}
        lock_open
        {/if}
        </span>
    </button>
    <span class="flex--100 text--right">{gProtein}g</span>
  </div>
  <div class="input-wrapper">
    <input type="range" name="protein" id="macros__protein" min="0" max="100" step="1" 
      oninput={onPChangeProtein} bind:value={protein}>
  </div>
</label>

<label>
  <div class="flex col-gap--sm">
    <span>Carbohidratos</span>
    <span>{Math.round(carbs)}%</span>
    <button class="btn label-icon-btn {lockedCarbs ? 'active' : ''}" onclick={() => toggleLock("carbs")}>
      <span class="material-symbols-outlined">
        {#if lockedCarbs}
        lock
        {:else}
        lock_open
        {/if}
        </span>
    </button>
    <span class="flex--100 text--right">{gCarbs}g</span>
  </div>
  <div class="input-wrapper">
    <input type="range" name="carbs" id="macros__carbs" min="0" max="100" step="1" 
    oninput={onPChangeCarbs} bind:value={carbs}>
  </div>
</label>

<label>
  <div class="flex col-gap--sm">
    <span>Grasa</span>
    <span>{Math.round(fat)}%</span>
    <button class="btn label-icon-btn {lockedFat ? 'active' : ''}" onclick={() => toggleLock("fat")}>
      <span class="material-symbols-outlined">
        {#if lockedFat}
        lock
        {:else}
        lock_open
        {/if}
        </span>
    </button>
    <span class="flex--100 text--right">{gFat}g</span>
  </div>
  <div class="input-wrapper">
    <input type="range" name="fat" id="macros__fat" min="0" max="100" step="1" 
    oninput={onPChangeFat} bind:value={fat}>
  </div>
</label>

<style>
  .label-icon-btn {
    font-size: 1em;
    padding: .125em 1ch;
    display: inline-flex;
    align-items: center;
    user-select: none;
    opacity: 0.2;
  }
  .label-icon-btn.active {
    opacity: 1;
    color: rgb(var(--rgb-blue));
  }
  .label-icon-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    opacity: 1;
  }
  .label-icon-btn>.material-symbols-outlined {
    font-size: 1em;
  }
  .input-wrapper {
    width: 100%;
    padding: 0 .25rem;
  }
</style>