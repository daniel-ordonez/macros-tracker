<script>
  let {
    id,
    name,
    value = $bindable(),
    placeholder,
    required,
    label = "",
    controls = false,
    max,
    min,
    step = 1,
    right,
    children,
    textAlign = "right",
    inputmode="numeric"
  } = $props();
</script>

<label for="{id}" class="flex col row-gap--xs input-number" >
  <div class="input__label">{label}</div>
  <div class="flex col-gap--sm">
    <div class="input-wrapper ">
      <input  class="input-number__input text--{textAlign}" {required} {placeholder} type="number" 
      {inputmode}
      {min} {max} {step} 
      name="{name}" id="{id}" bind:value>
      <div class="input-number__right">
        {@render right?.()}
      </div>
    </div>
    {#if controls}
    <div class="flex col-gap--sm">
      {#if children}{@render children()}{:else}
        <button class="btn btn--input-number">
          <span class="material-symbols-outlined">add</span>
        </button>
        <button class="btn btn--input-number">
          <span class="material-symbols-outlined">remove</span>
        </button>
      {/if}
    </div>
    {/if}
  </div>
</label>

<style>
  .input-wrapper {
    width: 100%;
    border: 1px solid rgb(var(--rgb-gray));
    border-radius: .25em;
    display: flex;
    align-items: center;
  }
  .input-number__right:not(:empty) {
    height: 100%;
    padding: 0 1em;
    background-color: rgba(var(--rgb-gray), 0.2);
    display: flex;
    align-items: center;
    border-left: 1px solid rgb(var(--rgb-gray));
  }
  .input-number__input {
    border: none;
    height: 2.5em;
    padding: 0 .5em;
    background-color: inherit;
    color: inherit;
    font-size: 1rem;
    line-height: 1;
    outline: none;
    appearance: none;
    -moz-appearance: textfield;
    font-family: inherit;
  }
  .btn.btn--input-number {
    padding: 0 2em;
    height: 100%;
    background-color: rgba(var(--rgb-gray), 0.2);
  }
</style>

