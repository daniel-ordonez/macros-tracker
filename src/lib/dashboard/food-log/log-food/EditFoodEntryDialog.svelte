
<script>
	import LogFoodForm from "./LogFoodForm.svelte";
  import {foodDb} from "../../../stores/food"
  let foodLog = $state()
  let food = $state({})
  let dialog 
  let form
  let resolveFunction
  let confirmDialog

  export const showModal = async (entryData) => {
    foodLog = entryData
    const {foodId} = entryData
    food = await $foodDb.getFood(foodId) || {}
    form.loadData(food, entryData)
    document.body.classList.add("no-scroll")
    dialog.showModal()
  }


  const submit = async () => {
    const newData = form.submit()

    newData.id = foodLog.id
    //console.log($state.snapshot(foodLog))
    //console.log(newData)

    const db = $foodDb
    await db.updateLog(newData)
    await db.updateCurrentDateLogs()
    closeDialog()
    // compare newData with entryData
    // if same date ? update : remove old and add new
  }
  const deleteEntry = async () => {
    console.group("deleteEntry")

    const db = $foodDb
    await db.deleteLog(foodLog.id)
    await db.updateCurrentDateLogs()
    console.groupEnd()
    closeDialog()
  }

  const closeDialog = () => {
    document.body.classList.remove("no-scroll")
    dialog.close()
  }
</script>




<dialog bind:this={dialog}>
  <div class="dialog-wrapper">
    <div class="dialog-card">
      <div class="flex col row-gap--md h--100">
        <!-- card title -->
        <div class="flex col-gap--sm jc--sb">
          <h2>Editar</h2>
          <button class="btn btn--icon btn--text" onclick={closeDialog}>
            <span class="material-symbols-outlined">
              close
              </span>
          </button>
        </div>
      <LogFoodForm bind:this={form} {food}></LogFoodForm>
      <div class="flex col row-gap--md mt--auto sticky--bottom">
        <button class="btn btn--primary-blue flex--100" onclick={submit}>Guardar cambios</button>
        <button class="btn flex--100 " onclick={deleteEntry}>Eliminar registro</button>
      </div>
    </div>
    </div>
  </div>
</dialog>
<dialog bind:this={confirmDialog}>

</dialog >

<style>
  dialog {
    background: none;
    border: none;
    width: 0;
    height: 0;
    overflow: visible;
    --card-width: min(calc(100vw - 2rem), 400px);
  }
  h2 {
    padding-left: 4rem;
    flex-grow: 100;
    text-align: center;
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