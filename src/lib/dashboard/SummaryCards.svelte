<script>
	import RadialGraph from "./RadialGraph.svelte";

</script>

<div id="summary-cards"  style="--radial-bg: var(--c-macros--k)">
  <div class="summary-card">
    <div class="card__label">
      <span class="md">
        Calorías
      </span>
      <span class="sm">
        Kcal
      </span>
    </div>
    <RadialGraph percent={75}></RadialGraph>
  </div>
  
  <div class="summary-card" style="--radial-bg: var(--c-macros--p)">
    <div class="card__label">
      <span class="md">
        Proteína
      </span>
      <span class="sm">
        P
      </span>
    </div>
    <RadialGraph percent={25}></RadialGraph>
  </div>
  
  <div class="summary-card" style="--radial-bg: var(--c-macros--c)">
    <div class="card__label">
      <span class="md">
        Carbos
      </span>
      <span class="sm">
        C
      </span>
    </div>
    <RadialGraph percent={50}></RadialGraph>
  </div>
  
  <div class="summary-card" style="--radial-bg: var(--c-macros--f)">
    <div class="card__label">
      <span class="md">
        Grasa
      </span>
      <span class="sm">
        G
      </span>
    </div>
    <RadialGraph percent={40}></RadialGraph>
  </div>
</div>
<style>
  #summary-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border-radius: 16px;
    overflow: hidden;
  }
  .summary-card {
    --radial-h: 46px;
    --bg-color: white;
    --parent-bg-color: white;
    background-color: var(--bg-color);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: .25rem;
    padding: 0 1rem;
  }
  .card__label>.sm {
    display: none;
  }
  @media (min-width: 1024px) {
    #summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      column-gap: inherit;
    }
    .summary-card {
      border-radius: 16px;
      justify-content: space-between;
    }
    .card__label {
      font-size: 1.25rem;
    }
  }
  @media (max-width: 780px) {
    #summary-cards {
      grid-template-columns: repeat(4, auto);
    }
    .summary-card {
      padding: 0;
      justify-content: center;
      gap: .25rem;
    }
    .card__label>.md {
      display: none;
    }
    .card__label>.sm {
      display: inline;
    }
  }
  @media (max-width: 540px) {
    .card__label>.sm {
      display: none;
    }
  }
</style>