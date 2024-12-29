<script>
	import FoodEntryCard from "./food-log/FoodEntryCard.svelte";
  import TimeDivision from "./food-log/TimeDivision.svelte";
  import {currentDate, currentDateLogs} from "../stores/food"
	import RegisterDialog from "./food-log/RegisterDialog.svelte";
	import { onMount } from "svelte";

  let dialog
  let dateLogs = $state([])
  let date = $state()

  const showDialog = () => {
    dialog.showModal()
  }

  const onDateInput = date => {
    currentDate.set(date)
  }

  currentDate.subscribe(cd => {
    date = cd
  })

  currentDateLogs.subscribe(logs => {
    if (Array.isArray(logs)) {
      const listOfHours = {}
      for (const item of logs) {
        const hour = parseInt(item.time.split(":")[0], 10)
        if (listOfHours[hour]) {
          listOfHours[hour].push(item)
        } else {
          listOfHours[hour] = [item]
        }
      }
      dateLogs = Object.entries(listOfHours)
    }
  })

  $effect(() => {
    onDateInput(date)
  })
</script>


<div id="food-log">
  <div class="card__header">
    <div class="flex ai--baseline jc--sb">
      <div class="title flex--100">
        Diario de comida
      </div>
        <input bind:value={date} type="date" name="currentDate" id="currentDateLog">
    </div>
    <div class="flex">
      <button onclick={showDialog} class="btn btn--primary-blue">Registrar comida <span class="material-symbols-outlined">
        add
        </span></button>
    </div>
  </div>
  <div class="overflow-container">
    <div id="logs-list">
      {#each dateLogs as [hour, items] (hour) }
        <TimeDivision timeFrom="{hour}:00" timeTo="{hour < 24 ? parseInt(hour) + 1: '00'}:00"></TimeDivision>
        {#each items as item, i (hour + i + item.id) }
        <FoodEntryCard data={item}></FoodEntryCard>
        {/each}
      {/each}
    </div>

  </div>
</div>

<RegisterDialog bind:this={dialog}></RegisterDialog>

<style>
#logs-list {
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: [macros-start brand-start name-start]auto[brand-end] 1fr[name-end macros-end numbers-start serving-start] auto[serving-end measures-start] auto[measures-end numbers-end];
  row-gap: .5rem;
}
#food-log {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}
.overflow-container {
  height: 100%;
  overflow: auto;
  padding-right: 1rem;
  margin-right: -1rem;
  padding-bottom: 1rem;
}
#food-log .card__header {
  padding: 1rem 0;
  background-color: var(--bg-color);
  z-index: 1;
  border-radius: inherit;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
@media (max-width: 760px) {
  .card__header {
    position: sticky;
    top: 0;
  }
  input {
    outline: none;
    border: none;
  }
  /*
  .card__header::after {
    position: absolute;
    content: "";
    height: 2rem;
    width: 100%;
    background: linear-gradient(to bottom, var(--bg-color), transparent);
    top: 100%;
  }
    */
}
</style>

