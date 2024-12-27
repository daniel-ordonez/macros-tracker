<script>
	import RangeScroller from "../../inputs/RangeScroller.svelte";

  let {
    id,
    name,
    min = 1,
    max,
    step = 10,
    value = $bindable(1),
    onInput = () => {}
  } = $props();

  let scroller
  const updateScrollPosition = () => {
    scroller.updateScrollPosition()
  }
  
  const plusN = (n = 1) => {
    value = Math.min(max, value + n)
    updateScrollPosition(value)
  }
  const minusN = (n = 1) => {
    value = Math.max(min, value - n)
    updateScrollPosition(value)
  }

  export const focus = () => {
    scroller.focus()
  }

</script>


<div id="input-age" class="flex col">
  <div class="flex col">
    <button disabled={value > max - step} class="btn btn--text-blue jc--center" onclick={()=>{plusN(step)}}>+ {step}</button>
    <div class="hr"></div>
  </div>
  <RangeScroller bind:this={scroller} bind:value onUpdate={onInput} {id} {name} {min} {max}></RangeScroller>
  <div class="flex col">
    <div class="hr"></div>
    <button  disabled={min > value - step} class="btn btn--text-blue jc--center" onclick={()=>{minusN(step)}}>- {step}</button>
  </div>
</div>

<style>
  #input-age .btn {
    font-size: 1.5rem;
    padding: 1rem;
  }
 </style>