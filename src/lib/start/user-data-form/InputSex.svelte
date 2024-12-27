<script>

	import SymbolFemale from "../SymbolFemale.svelte";
	import SymbolMale from "../SymbolMale.svelte";
  import {onMount} from "svelte"

  let { value = $bindable(), children, onInput = () => {}, isVisible = false } = $props();
  let el = $state()

const onChange = ({target}) => {
  if (target.checked) value = target.value
}
const onMouseDown = e => {
  const {target} = e
  const input = target.querySelector("input")
  if (input && input.checked) {
    const uncheck = (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      requestAnimationFrame(() => {
        input.checked = false
        value = null
      })
      target.removeEventListener("mouseup", uncheck)
    }
    target.addEventListener("mouseup",uncheck)
  }
}

const pushUpdate = (pushValue) => {
  const inputs = el.querySelectorAll("input[type=radio]")
  for (const i of inputs) {
    if (i.value === pushValue) {
      i.checked = true
    } else {
      i.checked = false
    }
  }
  value = pushValue
}

const onValueChange = value => {
  if (el) {
    pushUpdate(value)
    onInput(value)
  }
}

export const focusNext = () => {
  const focusedInput = el.querySelector("input:focus")
  if (!focusedInput) {
    el.querySelectorAll("input[type=radio]")[0]?.focus()
  } else if (focusedInput.value === "female") {
    el.querySelectorAll("input[type=radio]")[1]?.focus()
  } else if (focusedInput.value === "male") {
    focusedInput.blur()
    return false
  } else {
    return false
  }
  return true
}
export const focusPrev = () => {
  const focusedInput = el.querySelector("input:focus")
  if (!focusedInput) {
    el.querySelectorAll("input[type=radio]")[1]?.focus()
  } else if (focusedInput.value === "male") {
    el.querySelectorAll("input[type=radio]")[0]?.focus()
  } else if (focusedInput.value === "female") {
    focusedInput.blur()
    return false
  } else {
    return false
  }
  return true
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

onMount(() => {
  if (value) pushUpdate(value)
})


  $effect(() => {
    onValueChange(value)
    onVisibilityChange(isVisible)
  })
</script>

<div class="flex col" id="input-sex" bind:this={el}>
  <fieldset name="sex" class="split-select">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="split__option" onmousedown={onMouseDown}>
      <label for="female" class="symbol-wrapper">
        <div class="symbol">
          <SymbolFemale></SymbolFemale>
        </div>
        <input type="radio" name="sex" id="female" value="female" onchange={onChange}>
      </label>
    </div>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="split__option" onmousedown={onMouseDown}>
        <label for="male" class="symbol-wrapper" >
          <div class="symbol">
            <SymbolMale></SymbolMale>
          </div>
          <input type="radio" name="sex" id="male" value="male" onchange={onChange} >
        </label>
    </div>
  </fieldset>
  <div>
    {@render children?.()}
  </div>
</div>

<style>
  .split-select {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    transform-style: preserve-3d;
    transform: perspective(500px);
    border: none;
    outline: none;
    appearance: none;
  }
  .split__option {
    appearance: none;
    color: rgb(var(--rgb-gray)); 
    will-change: transform, opacity;
    transition-property: transform;
    transition-duration: 300ms;
    transition-timing-function: ease-in-out;
    border-radius: 1rem;
    border: 2px solid transparent;
    padding: .5rem;
  }

  @media(hover:hover) {
    .split__option:hover {
      color: rgb(var(--rgb-gray--2)); 
    }
  }
  .split__option input[type=radio] {
    width: 1rem;
    margin: 0 auto;
  }
  input[type=radio] {
    outline: none;
  }

  .split__option:focus-within{
    border-color: rgba(var(--rgb-blue), 0.5);
  }

  .split__option:has(input:checked) {
    color: rgb(var(--rgb-blue));
    transform: translateX(50%);
  }
  .split__option:has(input:checked)+.split__option {
    transform: rotateY(40deg) translateX(30%) translateZ(-30px) scale(0.85);
    opacity: 0.5;
    filter: blur(3px);
  }
  .split__option:nth-child(2):has(input:checked) {
    transform: translateX(-50%);
  }
  .split__option:has(+.split__option>label>input:checked) {
    transform: rotateY(-40deg) translateX(-30%) translateZ(-30px) scale(0.85);
    opacity: 0.5;
    z-index: 10;
    filter: blur(3px);
  }
  .symbol {
    pointer-events: none;
  }
  .symbol-wrapper {
    height: 14rem;
    padding: 1rem;
    margin: 1rem;
    border: 2px solid transparent;
    border-radius: .5rem;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

</style>