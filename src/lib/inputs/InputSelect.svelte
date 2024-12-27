
<script>
  let {
    id,
    name,
    textAlign = "left",
    options = [],
    value = $bindable(),
    label = ""
  } = $props();
</script>

<label for="{id}" class="input-select flex col row-gap--xs">
  <div class="input__label">{label}</div>
  <div class="flex col-gap--sm">
    <div class="input-wrapper">
    <select class="input-select__input text--{textAlign}" name="{name}" id="{id}" bind:value>
      {#each options as item}
      <option value="{item.value}">{item.name}</option>
      {/each}
    </select>
  </div>
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
  .input-select__input {
    width: 100%;
    border: none;
    height: 2.5em;
    padding: 0 .5em;
    background-color: inherit;
    color: inherit;
    font-size: 1rem;
    outline: none;
    appearance: none;
    -moz-appearance: textfield;
    font-family: inherit;
  }
</style>