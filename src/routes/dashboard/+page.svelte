<script>
  /*
	import AvatarPicture from "../../lib/dashboard/AvatarPicture.svelte";
  */
	import { onMount } from "svelte";
	import { decimal } from '../../lib/utils/format.mjs';
  import {userData, targetMacros} from "../../lib/stores/user"
	import FoodLog from "../../lib/dashboard/FoodLog.svelte";
	import { dailyMacros } from "../../lib/stores/food";
	import BarsChar from "../../lib/dashboard/BarsChar.svelte";
	import CalendarView from "../../lib/dashboard/CalendarView.svelte";
	import StackedBars from "../../lib/dashboard/StackedBars.svelte";


  userData.subscribe(data => {
    if (!data) return
    const {calories, protein, carbs, fat} = data.targetMacros
    const targetMacrosGrams = {
      calories,
      protein: decimal(calories * protein / 400),
      carbs: decimal(calories * carbs / 400),
      fat: decimal(calories * fat / 900)
    }
    targetMacros.set(targetMacrosGrams)
  })

</script>
<main id="main" >
  <section id="top">
    <!--
    <SummaryCards></SummaryCards>
    -->
    <!-- calendar pick -->
    <!--
    <AvatarPicture userName={$userData?.name}></AvatarPicture>
    -->
  </section>
  <section id="graphs">
    <div class="graph-wrapper">
      <BarsChar targetMacros={$targetMacros} dailyMacros={$dailyMacros}></BarsChar>
    </div>
    <div class="graph-wrapper">
      <CalendarView></CalendarView>
    </div>
    <div class="graph-wrapper">
      <StackedBars></StackedBars>
    </div>
  </section>
  <section id="diary">
    <FoodLog></FoodLog>
  </section>
</main>




<style>
  #main {
    --pad-x: 20px;
    --pad-y: 20px;
    --column-gap: 1rem;
    --row-gap: 1rem;
    --bg-color: white;
    --parent-bg-color: white;
    padding: var(--pad-y) 0;
    min-height: calc(100svh);
    display: grid;
    margin: 0 auto;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: auto repeat(2, auto) 1fr;
    column-gap: var(--column-gap);
    row-gap: var(--row-gap, var(--column-gap));
    width: 100%;
    max-width: min(1920px, calc(100svw - (var(--pad-x) * 2)));
  }
  #top {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: inherit;
  }
  #graphs {
    grid-column: 3 / -1;
    grid-row: 2 / span 3;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: subgrid;
    border-radius: 16px;
    column-gap: inherit;
  }
  .graph-wrapper {
    height: 100%;
    background-color: var(--bg-color);
    border-radius: inherit;
    padding: 1rem;
  }
  .graph-wrapper:nth-child(3) {
    grid-column-end: span 2;
    grid-row-end: span 2;
  }
  #diary {
    grid-column: 1 / span 2;
    grid-row: 2 / span 3;
    border-radius: 16px;
    height: 100%;
    background-color: var(--bg-color);
    padding: 0 1rem;
  }
  @media (max-width: 1024px) {
    #main {
      grid-template-columns: repeat(4, 1fr);
    }
    .graph-wrapper {
      grid-column-end: span 2;
    }

  }
  @media (max-width: 760px) {
    #main {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto 1fr;
    }
    #top {
      position: sticky;
      top: 0;
      z-index: 1;
    }
    #graphs {
      grid-column: 1 / span 2;
      grid-row: 2;
      --col-width: calc(50svw - (1.5 * var(--pad-x)));
      grid-template-columns: repeat(6, var(--col-width));
      overflow-x: auto;
    }
    #diary {
      grid-row-start: 3;
    }
  }
  @media (min-width: 760px) {
    #main {
      max-height: 100vh;
    }
    #diary {
      overflow: hidden;
    }
  }
</style>