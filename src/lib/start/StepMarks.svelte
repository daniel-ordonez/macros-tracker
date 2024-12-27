<script>
  let {
    step = $bindable(), 
    stepsCount = $bindable(),
    movingTo = $bindable()
  } =  $props()

  let stepList = $derived(Array.from(Array(stepsCount), (_, i) => i + 1))
</script>


<div class="flex col-gap--sm jc--center">
  {#each stepList as mark, i ("mark-"+i) }
    <span data-step="{mark}" class="step-mark {mark == step || mark == movingTo ? 'mark--active': ''}"></span>
  {/each}
</div>

<style>

.step-mark {
    border-radius: 50%;
    height: 8px;
    width: 8px;
    background-color: rgb(var(--rgb-gray));
    will-change: transform, opacity;
    transition: all ease-in-out 300ms;
    transform: scale(1);
    opacity: 0.3;
  }
  .mark--active {
    transform: scale(1.2);
    opacity: 1;
  }
</style>