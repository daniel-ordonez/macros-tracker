<script>

  import { userData } from "../../lib/stores/user"
	import { onMount } from "svelte";
	import StepMarks from '../../lib/start/StepMarks.svelte';
	import UserDataForm from "../../lib/start/UserDataForm.svelte";
  import {gsap} from "gsap"

  let { children } = $props();
  let data = $state({})
  let main
  let form

  // Navigation
  const STEPS = {name: 1, age: 2, weight: 3, height: 4, sex: 5, activity: 6, objective: 7, macros: 8}
  let stepsCount = Object.keys(STEPS).length
  let step = $state(0)
  let movingFrom = $state(0)
  let movingTo = $state(0)
  let nextBtn
  let prevBtn
  let lockNext = $state(false)
  

  const updateUserData = data => {
    const currentData = $userData || {}
    userData.set({...currentData, ...data})
  }
  const submitData = () => {
    updateUserData(data)
    requestAnimationFrame(() => {
      window.location.replace("/dashboard/")
    })
  }
  // NAVIGATE FORM STEPS
  const onBtnNextClick = e => {
    if (onLastStep) {
      // TODO: validate data
      submitData()
    } else {
      form.nextStep()
    }
  }
  const onBtnPrevClick = () => {
    form.prevStep()
  }

  const onDataUpdate = (newData) => {
    data = newData
  }
  const onKeyDown = e => {
    const captured = form.navInputs(e)
    if (captured) {
      e.preventDefault()
      e.stopImmediatePropagation()
    } else if (e.keyCode === 9 || e.key === "Tab" || e.code === "Tab") {
      e.preventDefault()
      e.stopImmediatePropagation()
      if (e.shiftKey && !lockNav) {
        prevBtn.focus()
      } else if (nextBtn && !lockNav && !lockNext) {
        nextBtn.focus()
      }
    }
  }

  onMount(() => {
    // capture keyboard 
    main.addEventListener("keydown", onKeyDown)
    // reveal animation
    step = 1
    main.classList.remove("hidden")
    const tl = gsap.timeline({
      onComplete: () => {
        document.getElementById("main__form")?.classList.remove("hidden")
      }
    })
    tl.fromTo("#main__title", {
      opacity: 0,
      translateY: "50px"
    }, {
      opacity: 1,
      translateY: 0,
      delay: .4
    })
    tl.fromTo("#main__nav", {
      opacity: 0,
      translateY: "50px"
    }, {
      opacity: 1,
      translateY: 0,
    }, "-=.2")
  })



  /**
   * DERIVEDS
  */
  let onLastStep = $derived(step === stepsCount)
  let lockNav = $derived(step === movingFrom)

</script>


<main id="main" bind:this={main} class="hidden" >  
  <div id="main__title">
    <!-- STEP 1 -->
    <h1 class="will-hide {step === STEPS.name || movingTo === STEPS.name  ? '' : 'hidden'}">
      Hola, <br>vamos a comenzar
    </h1>
  
    <!-- STEPS 2 TO 6  -->
    <h1 class="will-hide {step < STEPS.age || movingTo < STEPS.age || step > STEPS.activity  || movingTo > STEPS.activity ? 'hidden' : ''}">
      Vamos a calcular <br>tu Demanda Calórica
    </h1>
  
    <!-- STEP 7 -->
    <h1 class="will-hide {step !== STEPS.objective || movingFrom === STEPS.objective ? 'hidden' : ''}" >
      Establece un objetivo <br> para tus macros
    </h1>
  
    <!-- STEP 8 -->
    <h1 class="will-hide {step < stepsCount || movingTo < stepsCount ? 'hidden' : ''}" >
      {#if data.objective === 'keep' }
      Mantener peso
      {:else if data.objective === 'lose' }
      Perder peso
      {:else if data.objective === 'gain' }
      Ganar músculo
      {/if}
    </h1>
  </div>

  <!--UserDataForm-->
  <div id="main__form" class="will-hide hidden">
    <UserDataForm bind:this={form} onUpdate={onDataUpdate} bind:step bind:movingFrom bind:movingTo bind:lockNext  {STEPS} {stepsCount}></UserDataForm>
  </div>

  <!--Form Navigation-->
  <div id="main__nav" class="sticky--bottom">
    <div class="flex col row-gap--md">
      <StepMarks bind:step {stepsCount} bind:movingTo></StepMarks>
      <div class="flex gap--sm">

        <button tabindex="0" bind:this={prevBtn} disabled={lockNav} class="btn btn--secondary flex--50 will-hide {step===1 ? 'hidden' : ''}" onclick={onBtnPrevClick}>
          <span class="material-symbols-outlined">arrow_back</span>
          Anterior
        </button>


        <button tabindex="0" bind:this={nextBtn} 
          class="btn btn--primary-blue will-hide flex--50 {lockNext ? 'hidden' : ''}" 
          disabled={lockNav}
          onclick={onBtnNextClick}>
          {#if onLastStep && movingFrom !== stepsCount}
            <div style="display: contents;" >
              Finalizar
              <span class="material-symbols-outlined">check</span>
            </div>
          {:else if step < stepsCount || movingTo < stepsCount}
          <div style="display: contents;" >
            Siguiente
            <span class="material-symbols-outlined">arrow_forward</span>
          </div>
          {/if}
        </button>

      </div>
    </div>
  </div>
</main>








<style>
  #main {
    --pad-x: 20px;
    --pad-y: 20px;
    width: 100%;
    max-width: min(400px, calc(100svw - (var(--pad-x) * 2)));
    min-height: min(710px, calc(100svh - (2 * var(--pad-y))));
    display: grid;
    align-self: center;
    grid-template-columns: 1fr;
    grid-template-rows: [title-start]6rem[title-end form-start] 1fr[form-end nav-start] auto[nav-end];
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: var(--pad-y) 0;
    text-align: center;
  }
  #main__title {
    grid-row: title;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
  }
  #main__title>h1 {
    grid-row: 1;
    grid-column: 1;
  }

  #main__nav {
    grid-row: nav;
    grid-column: 1;
  }
  h1 {
    margin: auto;
  }
</style>