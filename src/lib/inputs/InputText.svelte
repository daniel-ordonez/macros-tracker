<script>

  let {
    id,
    name,
    optional,
    required,
    value = $bindable(),
    placeholder = $bindable(),
    label = "",
    autocomplete = "off",
    textAlign = "left"
  } = $props();
</script>

<label for="{id}" class="flex col row-gap--xs">
  <div class="text--small text--left text-weight--500">{label}
    {#if optional}
    <span class="c--gray text--sm">(opcional)</span>
    {/if}
  </div>
  <input class="text--{textAlign}" type="text" {autocomplete} {required} {placeholder} name="{name}" id="{id}" bind:value>
</label>