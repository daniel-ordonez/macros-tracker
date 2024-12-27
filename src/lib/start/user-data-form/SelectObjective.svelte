
<script>
  let { onInput = () => {}, activity = $bindable(0), value = $bindable(), isVisible = false } = $props();
  let el

  export const focusNext = () => {
    const focusedInput = el.querySelector("input:focus")
    const inputs = Array.from(el.querySelectorAll("input[type=radio]"))
    // If not focus, focus first input
    if (!focusedInput) {
      document.activeElement?.blur()
      inputs[0].focus()
      return true
    }
    // release focus from inputs
    focusedInput.blur()
    if (focusedInput === inputs[inputs.length - 1]) {
      return false
    }
    // focus next
    for (let i = 0; i < inputs.length - 1; i++) {
        if (inputs[i] === focusedInput) {
          inputs[i + 1].focus()
          return true
        }
      }
  }

  export const focusPrev = () => {
    const focusedInput = el.querySelector("input:focus")
    const inputs = el.querySelectorAll("input[type=radio]")

    // If not focus, focus the last input
    if (!focusedInput) {
      document.activeElement?.blur()
      inputs[inputs.length - 1].focus()
      return true
    }
    // release focus from inputs
    focusedInput.blur()
    if (focusedInput === inputs[0]) {
      return false
    }
    // focus previous
    for (let i = inputs.length - 1; i > 0; i--) {
      if (inputs[i] === focusedInput) {
        inputs[i - 1].focus()
        return true
      }
    }
  }

  const onChange = ({target}) => {
    value = target.value
  }

  const pushUpdate = ({inputs, value}) => {
    for (const i of inputs) {
      if (i.value === value) {
        i.checked = true
      } else {
        i.checked = false
      }
    }
  }

  const onValueChange = value => {
    if (el) {
      const inputs = el.querySelectorAll("input[type=radio]")
      pushUpdate({inputs, value})
      onInput(value)
    }
  }

  const onKeyDown = e => {
  if (e.key == "Enter") {
    const focusedOption = el.querySelector("label:focus-within")
    if (focusedOption) {
      const input = focusedOption.querySelector("input")
      if (input) {
        if (value === input.value) {
          value = null
          input.checked = false
        } else {
          value = input.value
          input.checked = true
        }
      }
    }
  }
}

const onVisibilityChange = isVisible => {
  if (isVisible) {
    el.addEventListener("keydown", onKeyDown)
  } else {
    el.removeEventListener("keydown", onKeyDown)
  }
}


  $effect(() => {
    onValueChange(value)
    onVisibilityChange(isVisible)
  })
</script>

<div id="objective-select" bind:this={el}>
  <label for="keep" class="option-card">
    <input value="keep" onchange={onChange} type="radio" name="objective" id="keep">
    <div class="card__contents"> 
      <div class="card__title">
        <span class="material-symbols-outlined">
          vertical_align_center
        </span>
          Mantener peso
      </div>
      <div class="card__body">
        <div>
          Mantén tu consumo de calorías dentro de lo necesario según tu nivel de actividad.
        </div>
      </div>
    </div>
  </label>
  <label for="lose"  class="option-card">
    <input value="lose" onchange={onChange}  type="radio" name="objective" id="lose">
    <div class="card__contents">
      <div class="card__title">
        <span class="material-symbols-outlined">
          trending_down
        </span>
        Perder peso
      </div>
      <div class="card__body">
        <div>
          Establece un deficit diario de calorías con el objetivo de perder peso cada semana.
        </div>
      </div>
    </div>
  </label>
  <label for="gain" class="option-card">
    <input value="gain" onchange={onChange}  type="radio" name="objective" id="gain">
    <div class="card__contents">
      <div class="card__title">
        <span class="material-symbols-outlined">
          fitness_center
        </span>
        Ganar músculo
      </div>
      <div class="card__body">
        <div>
          {activity > 2 ? 'Mantén' : 'Ajusta'} tu nivel de actividad física e incluye un alto porcentaje de proteína en tu
          dieta.
        </div>
      </div>
    </div>
  </label>
</div>

<style>
  #objective-select {
    margin: auto;
    display: grid;
    grid-template-columns: auto 1fr auto auto 1fr 3rem;
    grid-auto-flow: row;
    column-gap: .5rem;
    row-gap: .5rem;
    text-align: left;
  }
  input[type=radio] {
    width: 1rem;
    outline: none;
  }
  .option-card {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    padding: 1rem .5rem;
    border-radius: .5rem;
    transition: all 300ms ease-in-out;
    border: 2px solid transparent;
    will-change: transform, opacity;
    transition: all 300ms ease-in-out;
  }
  .card__contents {
    grid-column: 2 / -1;
    display: grid;
    grid-template-columns: subgrid;
  }
  .option-card:focus-within {
    border-color: rgba(var(--rgb-blue), 0.5);
  }
  .option-card:nth-child(1) {
    transform-origin: bottom center;
  }
  .option-card:nth-child(3) {
    transform-origin: top center;
  }
  @media (hover:hover) {
    .option-card:hover {
      background-color: rgba(0, 0, 0, 0.05);
      cursor: pointer;
    }
  }

  .option-card:has(input:checked) {
    border-color: rgb(var(--rgb-blue));
    background-color: var(--bg-color);
    box-shadow: 0 6px 24px -8px rgba(var(--rgb-blue), 0.2);
  }
  .option-card:has(input:checked) .card__title{
    color: rgb(var(--rgb-blue));
  }
  #objective-select:has(input:checked) .option-card:not(:has(input:checked)){
    transform: scale(0.9);
    opacity: 0.5;
  }
  .card__title {
    grid-column: 2 / span 2;
    grid-row: 1;
    font-size: 1.25rem;
    display: grid;
    grid-template-columns: subgrid;
  }
  .card__body {
    grid-column: 1 / -1;
    grid-row: 2;
    text-align: left;
    padding: .5rem;
  }
</style>