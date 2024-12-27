<script>
	import MacrosSetup from "../../lib/start/MacrosSetup.svelte";
  import StepsSlider from "./user-data-form/StepsSlider.svelte"
	import InputName from "./user-data-form/InputName.svelte";
  import InputAge from "./user-data-form/InputAge.svelte";
	import InputWeight from "./user-data-form/InputWeight.svelte";
	import InputHeight from "./user-data-form/InputHeight.svelte";
	import InputSex from "./user-data-form/InputSex.svelte";
  import SelectActivityLevel from "./user-data-form/SelectActivityLevel.svelte";
	import SelectObjective from "./user-data-form/SelectObjective.svelte";

  import {gsap} from "gsap"
	import { targetMacros, userData } from "../stores/user";


  let {
    movingFrom = $bindable(0), 
    movingTo = $bindable(0), 
    step = $bindable(),
    STEPS = {},
    stepsCount,
    lockNext = $bindable(false),
    onUpdate = () => {}
  } = $props()

  let stepSlider
  let defaultData = {
    name: "",
    age: 20,
    weight: 70,
    height: 180,
    sex: null,
    activity: 1,
    RMR: 0,
    objective: 0,
    targetMacros: {}
  }
  let data = $state(defaultData)
  const MIN_CALORIES = {"male": 1500, "female": 1200}
  let formInputs = $state({
    name: null,
    age: null,
    weight: null,
    height: null,
    sex: null,
    activity: null,
    objective: null
  })



  export const navInputs = (e) => {
    let captured = false
    if (e.keyCode === 9 || e.key === "Tab" || e.code === "Tab") {
      const {shiftKey} = e
      if (step === STEPS.sex) {
        captured = shiftKey ? formInputs.sex.focusPrev() : formInputs.sex.focusNext()
      }
      if (step === STEPS.activity) {
        captured = formInputs.activity.focus()
      }
      if (step === STEPS.objective) {
        captured = shiftKey ? formInputs.objective.focusPrev() : formInputs.objective.focusNext()
      }
    }
    return captured
  }
  export const nextStep = () => {
    stepSlider.nextStep()
  }
  export const prevStep = () => {
    stepSlider.prevStep()
  }

  const onDataChange = data => {
    onUpdate(data)
  }
  const onMacrosUpdate = (targetMacros) => {
    data.targetMacros = targetMacros
  }

  const updateRMR = () => {
    if (data.sex && data.height && data.weight && data.age) {
      data.RMR = data.sex === "male" 
      ? Math.round((10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5)
      : data.sex === "female"
      ? Math.round((10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161)
      : Math.round((10 * data.weight) + (6.25 * data.height) - (5 * data.age))
    }
  }

  const showHideUserBasicData = () => {
    if ((step === STEPS.name && movingTo === STEPS.name + 1) || 
    (step === STEPS.sex + 1 && movingTo === STEPS.sex)) {
      const el = document.getElementById("user-data-preview")
      el.classList.remove("hidden")
      gsap.fromTo(el, {
        opacity: 0,
      }, {
        opacity: 1,
        duration: .6,
        delay: .6
      })
    } else if ((step === STEPS.name + 1 && movingTo === STEPS.name) || 
    (step === STEPS.sex && movingTo > STEPS.sex)) {
      const el = document.getElementById("user-data-preview")
      gsap.fromTo(el, {
        opacity: 1,
      }, {
        opacity: 0,
        duration: .6,
        onComplete: () => {
          el.classList.add("hidden")
        }
      })
    }
  }

  const onMovingStep = (movingTo) => {
    showHideUserBasicData()
    if (lockNext && movingTo < step) { // going back from required input
      if (step === STEPS.sex || step === STEPS.objective) {
        lockNext = false
      }
    }
    if ((movingTo === STEPS.sex && !data.sex) || 
        (movingTo === STEPS.objective && !data.objective)) {
      lockNext = true
    }
  }

  const onStepChange = step => {
    if (step === STEPS.name) {
      if (!data.name) lockNext = true
      formInputs.name.focus()
    } else if (step === STEPS.age) {
      formInputs.age.focus()
    } else if (step === STEPS.weight) {
      formInputs.weight.focus()
    } else if (step === STEPS.height) {
      formInputs.height.focusC()
    }else if (step === STEPS.activity) {
      formInputs.activity.focus()
    }
  }

  const onObjectiveInput = (objective) => {
    if (step === STEPS.objective) {
      lockNext = !objective
    }
  }
  const onNameInput = ({target}) => {
    if (step === STEPS.name) {
      lockNext = !target.value
    }
  }
  const onAgeInput = () => {
    updateRMR()
  }
  const onWeightInput = () => {
    updateRMR()

  }
  const onHeightInput = () => {
    updateRMR()
    
  }
  const onSexInput = (sex) => {
    if (step === STEPS.sex) {
      lockNext = !sex
    }
    updateRMR()
  }

  userData.subscribe(savedData => {
    if (savedData) {
      data = savedData
    }
  })

  let minCalories = $derived((data.sex ? MIN_CALORIES[data.sex] : MIN_CALORIES["female"]) || MIN_CALORIES["female"])

  $effect(() => {
    onDataChange(data)
    onStepChange(step)
    onMovingStep(movingTo)
  })
  
</script>


<div id="user-data-form">
  <div id="user-data-preview" class="hidden">
  <!-- user data preview -->
      <div class="flex col row-gap--sm">
        <div>Usaremos estos datos</div>
        <div class="flex col-gap--xs jc--center ai--baseline">
          <span class="badge">{data.age ? `${data.age} años` : 'edad'}</span>
          <span class="badge">{data.weight ? `${data.weight}kg` : 'peso'}</span>
          <span class="badge">{data.height ? `${data.height}cm` : 'estatura'}</span>
          {#if data.sex === "male"}
          <span class="badge badge--icon">
            <span class="material-symbols-outlined badge-size">man</span>
          </span>
          {:else if data.sex === "female"}
          <span class="badge badge--icon">
            <span class="material-symbols-outlined badge-size">woman</span>
          </span>
          {:else}
          <span class="badge">sexo</span>
          {/if}
        </div>
      </div>
  </div>
  <div id="user-data-inputs">
    <StepsSlider bind:this={stepSlider} {stepsCount} bind:movingFrom bind:movingTo bind:step >
            
      <div class="step flex col col-gap--sm pt--xl">
        <h3>Cómo te llamas</h3>
        <InputName bind:this={formInputs.name} bind:value={data.name} onInput={onNameInput} placeholder="Tu nombre" maxlength={10}></InputName>
      </div>
      
      <div class="step flex col col-gap--sm pt--xl">
        <h3>Ingresa tu edad</h3>
        <InputAge bind:this={formInputs.age} bind:value={data.age} onInput={onAgeInput} id="age" min={10} max={99}></InputAge>
      </div>
      
      
      <div class="step flex col col-gap--sm pt--xl">
        <h3>Ingresa tu peso</h3>
        <InputWeight bind:this={formInputs.weight} bind:value={data.weight} onInput={onWeightInput} id="weight" min={20} max={200} step={1} ></InputWeight>
      </div>
      
      
      <div class="step flex col col-gap--sm pt--xl">
        <h3>Ingresa tu estatura</h3>
        <InputHeight bind:this={formInputs.height} bind:value={data.height} onInput={onHeightInput} id="height" ></InputHeight>
      </div>

      <div class="step flex col col-gap--sm pt--xl">
        <h3>Selecciona</h3>
        <InputSex bind:this={formInputs.sex} bind:value={data.sex} onInput={onSexInput} 
        isVisible={step === STEPS.sex && movingFrom !== STEPS.sex}>
          {#if data.sex}
            {data.RMR} <small>kcal</small> <br><small>(en reposo)</small>
          {/if}
        </InputSex>
      </div>
      
      <div class="step flex col col-gap--sm">
          <h3>Actividad física</h3>
          <SelectActivityLevel bind:this={formInputs.activity} bind:cals={data.RMR} bind:value={data.activity}></SelectActivityLevel>

      </div>
      
      <div class="step flex col ai--center">
        <SelectObjective 
          isVisible={step === STEPS.objective && movingFrom !== STEPS.objective}
          bind:this={formInputs.objective} 
          onInput={onObjectiveInput} 
          bind:activity={data.activity} 
          bind:value={data.objective}
        ></SelectObjective>
      </div>
      
      <div class="step">
        <MacrosSetup 
          isActive={step === STEPS.macros}
          {minCalories}
          RMR={data.RMR} 
          weight={data.weight} 
          objective={data.objective}  
          baseMacros={data.targetMacros}
          bind:activity={data.activity}
          onUpdate={onMacrosUpdate}
        ></MacrosSetup>
      </div>
    </StepsSlider>
  </div>
</div>

<style>
  #user-data-form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: [full-start upper-start]4rem[upper-end lower-start] 1fr [lower-end full-end];
    align-self: center;
    gap: 1rem;
  }
  #user-data-preview {
    grid-row: upper;
    grid-column: 1;
  }
  #user-data-inputs {
    grid-row: full;
    grid-column: 1;
    overflow: hidden;
  }
  .step {
    min-height: 30.5rem;
  }
  .pt--xl {
    padding-top: 4rem;
  }
  h3 {
    margin-top: 1.5em;
    margin-bottom: 0;
  }
</style>