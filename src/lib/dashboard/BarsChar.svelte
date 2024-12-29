<script>
	import { onDestroy, onMount } from "svelte";
  import { debounce } from "../utils/common.mjs"
	import { decimal } from "../utils/format.mjs";
	import { currentDate } from "../stores/food";

  let {targetMacros, dailyMacros} = $props();
  let canvas = $state()
  let resizeObserver
  let date = $state()
  let calsDiff = $state(0)



  const onDataChanged = (dailyMacros, targetMacros) => {
    if (!dailyMacros || !Object.keys(dailyMacros).length || !targetMacros || !Object.keys(targetMacros).length) return

    calsDiff = Math.round(targetMacros.calories - dailyMacros.calories)
    
    const dataLabels = {"protein": "Proteína", "carbs": "Carbos", "fat": "Grasa"}
    const dataKeys = Object.keys(dataLabels)

    // Note: All values in grams
    const maxValue = Math.max(...dataKeys.map(key => Math.max(dailyMacros[key], targetMacros[key])))
    
    const dataset = new Map()
    dataKeys.map(key => {
      dataset.set(key, {
        label: dataLabels[key],
        normalized: {
          value: dailyMacros[key] / Math.max(1, maxValue),
          target: targetMacros[key] / Math.max(1, maxValue),
        },
        grams: {
          value: dailyMacros[key],
          target: targetMacros[key]
        }
      })
    })
    dataset.set("labels", Object.values(dataLabels))
    dataset.set("keys", dataKeys)
    dataset.set("maxValue", maxValue)

    drawGraph(dataset)
  }

  const drawGraph = (dataset) => {

    // Setup canvax 2d context
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d")
    ctx.scale(dpr, dpr)

    // Setup text
    const textFont = 'Arial'
    const fontSizeNormal = dpr * 12
    const fontSizeBig = dpr * 16
    const textBig = `${fontSizeBig}px ${textFont}`
    const textNormal = `${fontSizeNormal}px ${textFont}`

    // Graph bars style
    const barTopMargin = dpr * 8
    const barInnerPadding = dpr * 8
    const barMinHeight = (2 * barInnerPadding) + fontSizeNormal
    const gapBetweenBars = dpr * 8

    // Setup rectangles
    const columnNames = dataset.get("labels")
    const cols = columnNames.length
    const colGap = 8 * dpr
    const totalColGap = (colGap * (cols + 1))
    const rectMinWidth = 60 * dpr
    const rectPad = 8 * dpr
    const rowGap = 8 * dpr
    const rectMinHeight = (rectPad * 2) + fontSizeNormal

    //ctx.lineWidth = 2;
    const draw = () => {
      // Setup canvas size
      const {width, height} = canvas.getBoundingClientRect()
      const canvasWidth = width * dpr
      const canvasHeight = height * dpr      
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      const rectWidth = Math.max(rectMinWidth, (canvasWidth - totalColGap) / cols)
      const rectMaxHeight = canvasHeight - rowGap - fontSizeBig

      const style = window.getComputedStyle(canvas)
      const colors = [
        style.getPropertyValue("--c-macros--p"), 
        style.getPropertyValue("--c-macros--c"), 
        style.getPropertyValue("--c-macros--f")
      ]
      const padLeft = Math.round((canvasWidth - totalColGap - (cols * rectWidth))/2)
      let yPosition = canvasHeight; // Start from the bottom
      let xPosition = padLeft + colGap
      let textX = 0
      let textY = 0

      const keys = dataset.get("keys")

      // Draw loop
      for (let i = 0; i < cols; i++) {

        const data = dataset.get(keys[i])
        const tHeight = rectMaxHeight * data.normalized.target
        const vHeight = Math.max(rectMaxHeight * data.normalized.value, rectMinHeight)


        // Draw data value
        ctx.fillStyle = "rgba(0,0,0,0.05)"
        ctx.fillRect(xPosition, yPosition - tHeight, rectWidth, tHeight)
        ctx.fillStyle = colors[i];
        ctx.fillRect(xPosition, yPosition - vHeight, rectWidth, vHeight)

        // Draw target line
        /* in case value exceeds target
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(xPosition, canvasHeight - vHeight);
        ctx.lineTo(xPosition + rectWidth, canvasHeight - vHeight);
        ctx.stroke();
        */

        // Draw label for rect
        ctx.fillStyle = "black"
        ctx.font = textBig;
        ctx.textAlign = 'left';

         // Draw label above target line
        textX = xPosition;
        textY = yPosition - Math.max(tHeight, vHeight) - rowGap - (fontSizeBig * .2);

        // draw column name
        ctx.fillText(columnNames[i], textX, textY);

        // Draw data label
        //ctx.fillStyle = "white"
        ctx.font = textNormal;
        textX = xPosition + rectPad
        textY = Math.min(canvasHeight - vHeight + rectPad + fontSizeNormal, canvasHeight - rectPad)
        ctx.fillText(decimal(data.grams.value) + "g" , textX, textY);

        // Draw targetLabelser label
        ctx.textAlign = 'right';
        // Move to end of rect - padding
        textX = Math.round(xPosition + rectWidth - rectPad)
        textY = canvasHeight - rectPad
        ctx.fillText("/" + data.grams.target + "g", textX, textY);

        // move to next column
        xPosition = Math.round(xPosition + rectWidth + colGap)
      }
    }

  const onResize = debounce(entries => {
      draw()
    }, 100)
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)
  }
  const onDateInput = date => {
    currentDate.set(date)
  }

  currentDate.subscribe(cd => {
    date = cd
  })


  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  $effect(() => {
    onDateInput(date)
    onDataChanged(dailyMacros, targetMacros)
  })
</script>


<div id="bars-chart">
  <div class="flex col ai--center mb--md">
    <div>
      <span class="text--xl">{Math.round(dailyMacros?.calories || 0)}</span>
      <small>kcals</small>
    </div>
      <span class="text--sm c--gray">
        {calsDiff} {calsDiff > 0 ? 'debajo' : 'encima'} de la meta
      </span>
  </div>
  <div class="chart__graph">
    <canvas bind:this={canvas}></canvas>
  </div>
  <div class="chart__targetLabels">
    <input bind:value={date} type="date" name="currentDate" id="currentDateLog">
  </div>
</div>

<style>
  #bars-chart {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    row-gap: 1rem;
  }

  .chart__graph {
    display: flex;
    align-items: end;
    overflow: auto;
  }
  .chart__graph>canvas {
    aspect-ratio: 2/1;
    height: auto;
    width: min(100%, 450px);
    max-height: 300px;
    margin: 0 auto;
  }
  .chart__targetLabels {
    display: flex;
    justify-content: center;
  }
</style>