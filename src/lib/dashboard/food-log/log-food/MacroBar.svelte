<script>
  let {
    label="", 
    p = 0, 
    value = $bindable()
  } = $props()
</script>



<div class="macro-bar">
  <div class="flex col-gap--sm">
    <span>{label}</span>
    <span class="flex--100 text--right">{value}g</span>
  </div>
  <div class="bar">
    <div class="bar__value" style="width:{p}%"></div>
  </div>
</div>

<style>
  .macro-bar {
    display: flex;
    flex-direction: column;
    gap: .25rem;
  }
  .macro-bar>.bar {
    height: 1rem;
    background-color: rgba(var(--rgb-gray), 0.2);
    border-radius: .25rem;
    overflow: hidden;
  }
  .bar__value {
    height: 100%;
    background-color: rgb(var(--rgb-blue));
  }
</style>