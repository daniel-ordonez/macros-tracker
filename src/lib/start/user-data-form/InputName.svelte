<script>


  let { value = $bindable(), placeholder, maxlength, onInput = () => {} } = $props();
  let inputElement
  
  export const focus = () => {
    inputElement.focus()
  }
  export const select = () => {
    inputElement.select()
  }
  const onInputChange = (e) => {
    onInput(e)
  }


</script>


<label for="user-name" id="input-name" class="flex col jc--center">
  <input bind:this={inputElement} oninput={onInputChange} autocomplete="off" {placeholder} {maxlength} type="text" id="user-name" bind:value>
  {#if maxlength}
  <small>(Max {maxlength} caracteres)</small>
  {/if}
</label>

<style>
  #input-name {
    height: 12rem;
  }
  #input-name>input[type=text] {
    outline: none;
    border: none;
    text-align: center;
    font-size: 4rem;
    width: 100%;
  }
 </style>