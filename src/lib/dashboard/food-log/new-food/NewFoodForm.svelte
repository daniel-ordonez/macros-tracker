<script>
  /**
   * TODO: On servingName blur,  try parsing to fill out servingSize in grams
  */
  import InputNumber from "../../../inputs/InputNumber.svelte"
  import InputText from "../../../inputs/InputText.svelte"
	import { decimal } from "../../../utils/format.mjs";
  import {scrap} from "../../../utils/scrap.mjs"

let form
let foodName = $state()
let newFood = $state({
  brand: null,
  servingName: null,
  servingSize: null,
  cals: null,
  protein: null,
  carbs: null,
  fat: null
})
let {onSubmit = () => {}} = $props()

const scrapFood = async url => {
  const result = await scrap(url)
  console.log("result")
  console.log(result)
  if (result) {
    foodName = result?.name
    newFood.brand = result?.brand
    newFood.cals = result?.cals
    newFood.protein = result?.protein
    newFood.carbs = result?.carbs
    newFood.fat = result?.fat
    newFood.servingName = result?.servingName
    newFood.servingSize = result.servingSize ? decimal(result.servingSize) : null 
  }
}

const onFoodNameChange = foodName => {
  if (foodName) {
    console.log("food name changed")
  // detect url
    const urlPattern = /^https:\/\/www\./;
    if (urlPattern.test(foodName)) {
      console.log("is url")
      scrapFood(foodName)
    }
  }
}
export const getFormData = () => {
  return new FormData(form)
}
export const reset = () => {
  form.reset()
}
export const checkValidity = () => {
  const valid = form.checkValidity()
  if (!valid) form.reportValidity()
  return valid
}
const onFormSubmit = e => {
  console.log("on submit form")
  e.preventDefault()
  if (form.checkValidity()) {
    onSubmit()
  }
}
let popoverMenu
const togglePopover = e => {
  e.preventDefault()
  popoverMenu.togglePopover()
}

$effect(() => {
  onFoodNameChange(foodName)
})
</script>

<form bind:this={form} onsubmit={onFormSubmit} class="flex col row-gap--md">

  <div class="flex col-gap--xs ai--bl">
    <div class="flex--100">
      <InputText id="new-food-name" name="name" label="Nombre" required={true} bind:value={foodName} ></InputText>
    </div>
    <button class="btn external-search" popovertarget="outside-sources" onclick={togglePopover}>
      <span class="material-symbols-outlined">
      travel_explore
      </span>
    </button>
    <div id="outside-sources" class="popover" popover bind:this={popoverMenu}>
      <div class="flex col row-gap--sm">
        <a href="https://www.fatsecret.es/calor%C3%ADas-nutrici%C3%B3n/search{foodName ? '?q=' + foodName : ''}" target="_blank" rel="noopener noreferrer" >
          <span>🇪🇸</span><span>fatsecret</span> 
        </a>
        <a href="https://www.calorieking.com/us/en/foods/search{foodName ? '?keywords=' + foodName : ''}" target="_blank" rel="noopener noreferrer" >
          <span>🇺🇸</span><span>Calorie King</span> 
        </a>
        <!--
        <a href="https://www.eatthismuch.com/food/browse{foodName ? '?q=' + foodName : ''}" target="_blank" rel="noopener noreferrer" >
          <span>🇺🇸</span><span>Eat This Much</span>
        </a>
        <a href="https://www.nutritionix.com/search{foodName ? '?q=' + foodName : ''}" target="_blank" rel="noopener noreferrer" >
          <span>🇺🇸</span><span>Nutritionix</span>
        </a>
        -->
        <a href="https://www.myfooddiary.com/foods/search{foodName ? '?q=' + foodName : ''}" target="_blank" rel="noopener noreferrer" >
          <span>🇺🇸</span><span>My Food Diary</span>
        </a>

      </div>
    </div>
  </div>
  <div class="flex col-gap--sm ai--baseline">
    <InputText bind:value={newFood.brand} name="brand" label="Marca" optional={true} ></InputText>
    <InputNumber id="new-food-cals" step="0.01"  bind:value={newFood.cals} name="calories" label="Calorías"  inputmode="decimal"  required={true}>
      {#snippet right()}
        <span >kcal</span>
      {/snippet}
    </InputNumber>
  </div>


  <div class="flex col-gap--sm ai--baseline">
    <div class="flex--100">
      <InputText id="new-food-serving-name" bind:value={newFood.servingName} name="servingName" label="Porción" placeholder="ej. 1 Mediana" optional={true}></InputText>  
    </div>
    <InputNumber id="new-food-serving-size" step="0.01" bind:value={newFood.servingSize} name="servingSize" label="Peso"  inputmode="decimal"  required={true}>
      {#snippet right()}
        <span >g</span>
      {/snippet}
    </InputNumber>
  </div>
  <InputNumber id="new-food-protein" step="0.01"  bind:value={newFood.protein} name="protein" label="Proteínas"  inputmode="decimal"   required={true}>
    {#snippet right()}
      <span >g</span>
    {/snippet}
  </InputNumber>
  <InputNumber id="new-food-carbs" step="0.01"  bind:value={newFood.carbs} name="carbs" label="Carbohidratos" inputmode="decimal"   required={true}>
    {#snippet right()}
      <span >g</span>
    {/snippet}
  </InputNumber>
  <InputNumber id="new-food-fat" step="0.01"  bind:value={newFood.fat} name="fat" label="Grasa" inputmode="decimal"   required={true}>
    {#snippet right()}
      <span >g</span>
    {/snippet}
  </InputNumber>
</form>

<style>
  .external-search {
    anchor-name: --external;
    height: 2.5rem;
    background-color: rgb(var(--rgb-blue));
    color: white;
    margin-top: auto;
    border-radius: .25rem;
    padding: .5rem;
  }
  #outside-sources {
    position-anchor: --external;
    top: anchor(--external bottom);
    inset-inline-start: anchor(--external right);
    transform: translateX(-100%);
    margin: 0;
    border: 0;
    padding: 1rem;
    border-radius: .5rem;
    background-color: white;
  }

  #outside-sources::backdrop {
    background-color: rgba(0, 0, 0, 0.125);
  }
  #outside-sources a {
    padding: .5rem;
    border-radius: .25rem;
    display: inline-flex;
    column-gap: .5rem;
  }
  #outside-sources a:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
</style>