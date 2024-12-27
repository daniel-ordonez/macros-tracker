<script>
  let {name, id, options = $bindable([]), value = $bindable()} = $props()

</script>

<label for="{id}" class="select-wrapper">
  <div class="input-select--btn">{value?.text || ""} 
    <span class="material-symbols-outlined text--em">
      arrow_drop_down
    </span>
  </div>
  <select {name} {id} bind:value>
    {#each options as opt, i (i) }
    <option value="{opt}">{opt.text}</option>
    {/each}
  </select>
</label>

<style>

.select-wrapper {
  margin: 0 auto;
  position: relative;
  border: none;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}
.input-select--btn {
  display: inline-flex;
  align-items: center;
  gap: .5ch;
  background-color: rgba(0, 0, 0, 0.05);
  padding: .5em 1ch;
  padding-right: .5ch;
  border-radius: .5ch;
  line-height: 1;
}
.select-wrapper>select {
  position: absolute;
  inset: 0 0 0 0;
  border: none;
  outline: none;
  background: none;
  opacity: 0;
  color: transparent;
  user-select: none;
}
.select-wrapper:has(select:focus) .input-select--btn>span {
  transform: scaleY(-1);
}
select>option {
  width: auto;
  margin: 0 auto;
  text-align: center;
}
</style>