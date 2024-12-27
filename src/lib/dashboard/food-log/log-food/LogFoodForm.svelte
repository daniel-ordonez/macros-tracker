<script>
	import { onMount } from "svelte";
	import InputAmount from "../InputAmount.svelte";
	import InputSelectUnit from "../InputSelectUnit.svelte";
	import MacroBar from "./MacroBar.svelte";
  import {decimal} from "../../../utils/format.mjs"
  const defaultScale = {text: "Gramos (1g)", value: 1, servingName: "g"}


  let form
let {food} = $props()
let amount = $state(1)
let scaleOptions = $state([defaultScale])
let selectedScale = $state(defaultScale)
let scale = $derived(selectedScale?.value || 1)
let scaledAmount = $derived(amount * scale)
let name = $state("")
let brand = $state("")
let calories = $derived(food?.calories ? food.calories * scaledAmount : 0)
let protein =  $derived(food?.protein ? food.protein * scaledAmount : 0)
let carbs =  $derived(food?.carbs ? food.carbs * scaledAmount : 0)
let fat =  $derived(food?.fat ? food.fat * scaledAmount : 0)
let p = $state({
  protein: 0,
  carbs: 0,
  fat: 0
})

let logDate = $state(new Date().toISOString().split("T")[0])
let logTime = $state(new Date().toTimeString().slice(0, 5))

const onFoodUpdate = (food) => {
  if (food) {
    name = food.name
    brand = food.brand
    const servingSize = parseFloat(food.servingSize)
    if (servingSize != 1) {
      scaleOptions = [{text: `${food.servingName} (${servingSize}g)`, value: 1, servingName: food.servingName}, {...defaultScale, value: 1 / servingSize}]
      selectedScale = scaleOptions[0]
    } else {
      scaleOptions = [defaultScale]
    }
    p.protein = decimal((100 / food.calories) * (food.protein * 4))
    p.carbs = decimal((100 / food.calories) * (food.carbs * 4))
    p.fat = decimal((100 / food.calories) * (food.fat * 9))
  }
}

export const loadData = (food, data) => {
  onFoodUpdate(food)
  logDate = data.date
  logTime = data.time
  amount = data.amount
  const {servingName} = data
  selectedScale = scaleOptions.find(opt => opt.servingName === servingName) || defaultScale
}

export const submit = () => {
  if (!form.checkValidity()) {
    // give feedback to user
    form.reportValidity()
    return false
  }
  const servingSize = food.servingSize * selectedScale.value
  const data = {
    foodId: food.id,
    food: name,
    brand: food.brand,
    servingName: selectedScale.servingName,
    servingSize,
    amount,
    grams: amount  * servingSize,
    calories,
    protein,
    carbs,
    fat,
    date: logDate,
    time: logTime
  }
  return data
}

onMount(() => {
  onFoodUpdate(food)
})
</script>

<form class="flex col" bind:this={form} id="log-food-form">
  <div class="flex col row-gap--xs text--center mb--md">
    <div class="h3">{name}</div>
    <div>{brand}</div>
  </div>
  <div class="flex col mb--lg">
    <InputAmount bind:value={amount} required></InputAmount>
    <InputSelectUnit bind:value={selectedScale} options={scaleOptions}></InputSelectUnit>
  </div>
  <div class="text--lg text--center">
    <div>
      {decimal(calories)}
    </div>
    <div class="text--sm">kcal</div>
  </div>
  <div class="flex col row-gap--md mb--lg">
    <MacroBar label="Proteína" value={decimal(protein)} p={p.protein} ></MacroBar>
    <MacroBar label="Carbohidratos" value={decimal(carbs)} p={p.carbs} ></MacroBar>
    <MacroBar label="Grasa" value={decimal(fat)} p={p.fat} ></MacroBar>
  </div>
  <div class="flex jc--center col-gap--md">
    <input type="date" bind:value={logDate} name="logDate" id="logFoodDate" required>
    <input type="time" bind:value={logTime} name="logTime" id="logFoodTime" required>
  </div>
</form>

<style>
  .h3 {
    font-size: 1.5rem;
    font-weight: 500;
  }
  .text--lg {
    font-size: 2rem;
  }

</style>