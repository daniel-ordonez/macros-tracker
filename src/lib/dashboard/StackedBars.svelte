<script>
	import { onDestroy } from "svelte";
	import { currentDate, dailyMacros, dateToISO, foodDb } from "../stores/food";
	import { debounce, getDayNames, getMonthNames } from "../utils/common.mjs";
	import { targetMacros } from "../stores/user";

  let canvas = $state()
  let resizeObserver
  let dateRange = $state("")
  const monthNames = getMonthNames()

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

    const keys = dataset.get("keys")
    // Setup rectangles
    const cols = keys.length
    const colGap = 8 * dpr
    const totalColGap = (colGap * (cols + 1))
    const rectMinWidth = 0 * dpr
    const rectPad = 0 * dpr
    const rowGap = 8 * dpr
    const rectMinHeight = (rectPad * 2) //+ fontSizeNormal
    const labels = dataset.get("labels")
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
      const rectOrigin = yPosition - fontSizeNormal - rowGap
      const targetY = dataset.get("target")
      // Draw loop
      for (let i = 0; i < cols; i++) {
        const data = dataset.get(keys[i])

        const tHeight = rectMaxHeight * targetY
        const barHeight = rectMaxHeight * data.normalized.calories
        const pHeight = Math.max(barHeight * data.normalized.protein, rectMinHeight)
        const cHeight = pHeight + Math.max(barHeight * data.normalized.carbs, rectMinHeight)
        const fHeight = cHeight + Math.max(barHeight * data.normalized.fat, rectMinHeight)

        // Draw data value
        ctx.fillStyle = "rgba(0,0,0,0.05)"
        ctx.fillRect(xPosition, rectOrigin - tHeight, rectWidth, tHeight)

        // fat
        ctx.fillStyle = colors[2];
        ctx.fillRect(xPosition, rectOrigin - fHeight, rectWidth, fHeight)
        // carbs
        ctx.fillStyle = colors[1];
        ctx.fillRect(xPosition, rectOrigin - cHeight, rectWidth, cHeight)
        // protein
        ctx.fillStyle = colors[0];
        ctx.fillRect(xPosition, rectOrigin - pHeight, rectWidth, pHeight)


        // columne name
        ctx.fillStyle = "black"
        ctx.font = textNormal;
        ctx.textAlign = 'center';
        textX = xPosition + rectPad + (rectWidth / 2)
        textY = canvasHeight - (fontSizeNormal * .3)
        ctx.fillText(labels[i], textX, textY);


        // move to next column
        xPosition = Math.round(xPosition + rectWidth + colGap)
      }

      if (targetY < 1) {
        ctx.setLineDash([10,5])
        ctx.beginPath()
        ctx.moveTo(0, rectMaxHeight * (1 - targetY))
        ctx.lineTo(canvasWidth, rectMaxHeight * (1 - targetY))
        ctx.stroke()
      }

    }


    const onResize = debounce(entries => {
      draw()
    }, 100)
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas)
  }

  onDestroy(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  currentDate.subscribe(async dateISO => {
    if (!dateISO) return
    const date = parseInt(dateISO.slice(-2))
    const month = parseInt(dateISO.slice(5, 7)) - 1
    const year = parseInt(dateISO.slice(0, 4))
    const dateObj = new Date(year, month, date)
    // find week range
    const startDate = new Date(dateObj)
    startDate.setDate(dateObj.getDate() - ((dateObj.getDate() + 6) % 7))
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)

    const db = $foodDb

    dateRange = `${monthNames[startDate.getMonth()].slice(0, 3)}. ${startDate.getDate() } - ${monthNames[endDate.getMonth()].slice(0, 3)}. ${endDate.getDate()}`


    const logs = await db.getLogsInRange(dateToISO(startDate), dateToISO(endDate))
    
    const dataset = new Map()
    // populate map keys with week days
    const daysRange = 7
    const values = {}
    for (let i = 0; i < daysRange; i++) {
      const key = dateToISO(startDate)
      values[key] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
      // move on to next day
      startDate.setDate(startDate.getDate() + 1)
    }
    const targetCalories = $targetMacros?.calories || 0
    let maxValue = targetCalories
    // read logs and aggregate data
    logs.forEach(logEntry => {
      const key = logEntry.date
      const {calories} = logEntry
      // update max value
      if (calories > maxValue) {
        maxValue = calories
      }
      values[key].calories += calories
      values[key].protein += logEntry.protein
      values[key].carbs += logEntry.carbs
      values[key].fat += logEntry.fat
    })
    const keys = Object.keys(values)
    // get normalized values of calories and macros
    keys.forEach(k => {
      const v = values[k]
      const protein = v.protein * 4
      const carbs = v.carbs * 4
      const fat = v.fat * 9
      const macros = protein + carbs + fat
      dataset.set(k, {
        values: v,
        normalized: {
          calories: 1 / maxValue * v.calories,
          protein: 1 / macros * protein,
          carbs: 1 / macros * carbs,
          fat: 1 / macros * fat
        }
      })
    })
    dataset.set("keys", keys)
    dataset.set("target", 1 / maxValue * targetCalories)
    dataset.set("labels", getDayNames().map(dn => dn.slice(0,3) + '.'))
    //console.log(dataset)
    drawGraph(dataset)
  })
</script>

<div id="stacked-bars">
  <div class="chart__range">
    <div>
      {dateRange}
    </div>
  </div>
  <div class="chart__graph">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style>
  #stacked-bars {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    row-gap: 1rem;
  }
  .chart__range {
    display: flex;
    padding: 1rem;
    justify-content: center;
  }
  .chart__graph {
    display: flex;
    align-items: end;
    overflow: auto;
  }
  .chart__graph>canvas {
    aspect-ratio: 1/1;
    height: auto;
    width: 100%;
    max-height: 300px;
    margin: 0 auto;
  }
</style>