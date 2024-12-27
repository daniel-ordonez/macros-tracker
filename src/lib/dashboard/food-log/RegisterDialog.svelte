<script>
	import StackCards from "../../common/StackCards.svelte";
  import {foodDb, foodItems} from "../../stores/food"
  import InputText from "../../inputs/InputText.svelte"
  import {Trie} from "../../utils/autocomplete.mjs"
	import NewFoodForm from "./new-food/NewFoodForm.svelte";
	import { onMount } from "svelte";
	import LogFoodForm from "./log-food/LogFoodForm.svelte";
  
  let pos = 0
  let dialog
  let formNewFood
  let formLogFood = $state()
  let stackedCards
  const trie = new Trie()
  let filteredList = $state([])
  let searchName = $state()
  let selectedFood = $state()

  export const showModal = () => {
    document.body.classList.add("no-scroll")
    dialog.showModal()
  }
  const closeDialog = () => {
    document.body.classList.remove("no-scroll")
    dialog.close()
    formNewFood.reset()
    goBack()
  }
  const goBack = () => {
    stackedCards.toPos(0)
    selectedFood = null
  }
  const slideToNewFood = () => {
    stackedCards.next()
  }
  const onFormSubmit = e => {
    e.preventDefault()
  }

  const submitDialog = async () => {
    // Check form is valid
    const valid = formNewFood.checkValidity()
    if (!valid) return
    // Grab data
    const food = {}
    const formData = formNewFood.getFormData()
    formData.forEach((value, key) => {
      food[key] = value;
    });
    // Store in database
    const db = $foodDb
    const ok = db.addFood(food)
    if (ok) {
      formNewFood.reset()
      goBack()
    }
  }
 

  const loadFoodItems = (items) => {
    // full ingest into trie
    for (let i = 0; i < items.length; i++) {
      const {name, id, calories, brand} = items[i]
      trie.insert(name.toLowerCase(), {id, name, calories, brand});
    }
  }

  const updateSuggestions = filter => {
    if (filter?.length) {
      const suggestions = trie.autocompleteMeta(filter.toLowerCase())
      const limit = 10
      filteredList = suggestions.slice(0, Math.min(limit, suggestions.length)).map(item => item.meta)
    } else {
      filteredList = $foodItems
    }
  }

  const onFoodSelect = async (id) => {
    const db = $foodDb
    selectedFood = await db.getFood(id)
    if (selectedFood) stackedCards.toPos(2)
  }

  foodItems.subscribe(items => {
    if (!$foodItems?.length && items?.length) {
      loadFoodItems(items)
    }
  })


  /**
   * LOG FOOD
   */
  const submitLogFood = () => {
    const data = formLogFood.submit()
    if (data) {
      const db = $foodDb
      const ok = db.logFood(data)
      if (ok) {
        dialog.close()
        goBack()
      }
    }
  }



  onMount(() => {
    const items = $foodItems
    if (!items.length) loadFoodItems(items)
  })

  $effect(() => {
    updateSuggestions(searchName)
  })
</script>

<dialog bind:this={dialog}>
  <div class="dialog-wrapper">
    <StackCards items={3} {pos} bind:this={stackedCards} >

    <div class="dialog-card">
      <div class="flex col row-gap--md h--100">
        <div class="flex col-gap--sm jc--sb">
          <h2>Registrar comida</h2>
          <button class="btn btn--icon btn--text" onclick={closeDialog}>
            <span class="material-symbols-outlined">
              close
              </span>
          </button>
        </div>
        <div>
          <InputText name="name" label="Buscar" placeholder="Ej. Pizza" required={true} bind:value={searchName} ></InputText>
        </div>
        <div>
          <div class="food-suggestions will-hide {!filteredList.length ? 'hidden' : ''} ">
            {#each filteredList as item, i (item.id)}
              <button class="food-item" onclick={() => onFoodSelect(item.id)}>
                <div>
                  {item.name}
                  <span class="c--gray">{item.brand}</span>
                </div>
                <div>
                  {item.calories}
                  <span class="text--sm c--gray">kcal</span>
                </div>
              </button>
            {/each}
          </div>
        </div>
        <div class="mt--auto sticky--bottom flex col-gap--md">
          <button class="btn btn--primary-blue flex--100" onclick={slideToNewFood}>
            Nuevo alimento
          </button>
        </div>
      </div>
    </div>

    <div id="food-entry" class="dialog-card">
      <div class="flex col row-gap--md">
        <!-- card title -->
        <div class="flex col-gap--sm">
          <button class="btn btn--icon btn--text" onclick={goBack}>
            <span class="material-symbols-outlined">
              arrow_back
              </span>
          </button>
          <h2 class="flex--100">Nuevo alimento</h2>
          <button class="btn btn--icon btn--text" onclick={closeDialog}>
            <span class="material-symbols-outlined">
              close
              </span>
          </button>
        </div>
        <!-- card body -->
        <NewFoodForm bind:this={formNewFood} on:submit={onFormSubmit}></NewFoodForm>
        <!-- card options -->
        <div class="flex col-gap--md mt--md sticky--bottom">
          <button class="btn btn--primary-blue flex--100" onclick={submitDialog}>Registrar</button>
        </div>
      </div>
    </div>
    
    <div class="dialog-card">
      <div class="flex col row-gap--md h--100">
        <!-- card title -->
        <div class="flex col-gap--sm">
          <button class="btn btn--icon btn--text" onclick={goBack}>
            <span class="material-symbols-outlined">
              arrow_back
              </span>
          </button>
          <div class="flex--100"> </div>
          <button class="btn btn--icon btn--text" onclick={closeDialog}>
            <span class="material-symbols-outlined">
              close
              </span>
          </button>
        </div>
        <!-- card body -->
        {#if selectedFood}
          <LogFoodForm bind:this={formLogFood} food={selectedFood}></LogFoodForm>
        {/if}
        <!-- card options -->
        <div class="flex col-gap--md mt--auto sticky--bottom">
          <button class="btn btn--primary-blue flex--100" onclick={submitLogFood}>Registrar</button>
        </div>
      </div>
    </div>
  </StackCards>

  </div>
</dialog>


<style>
  dialog {
    background: none;
    border: none;
    width: 0;
    height: 0;
    overflow: visible;
    --card-width: min(calc(100vw - 2rem), 400px);
  }
  .food-suggestions {
    display: flex;
    flex-direction: column;
    row-gap: .25rem;
    max-height: 20rem;
  }
  .food-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem .5rem;
    line-height: 1;
    border-radius: .5rem;
    border: 1px solid rgba(var(--rgb-gray), .5);
    cursor: pointer;
    background-color: inherit;
  }
  @media(hover:hover) {
    .food-item {
      will-change: background-color;
      transition: background-color 300ms ease-in-out;
    }
    .food-item:hover {
      background-color: rgba(var(--rgb-gray), .2);
    }
  }
  .dialog-wrapper {
    position: fixed;
    inset: 0 0 0 0;
    display: flex;
    align-items: center;
  }
  .dialog-card {
    margin: 0 auto;
    width: var(--card-width);
    min-height: 400px;
    background: white;
    border-radius: 1rem;
    padding: 1rem;
  }
</style>