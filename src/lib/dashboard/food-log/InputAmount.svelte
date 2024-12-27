<script>
let {name, id, value=$bindable(1)} = $props()
</script>

<input class="input-amount__input" bind:value {name} {id} min="0.5" max="100000" step="0.5" type="number" 
pattern="\d*" inputmode="numeric">

<style>
.input-amount__input {
  background-color: inherit;
  color: inherit;
  text-align: center;
  font-size: 5rem;
  height: 5rem;
  padding: 0 .5em;
  border: none;
  outline: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  font-family: inherit;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>