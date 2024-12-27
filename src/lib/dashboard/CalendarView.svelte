<script>
	import { onMount } from "svelte";
	import { decimal, getCalendarInfo } from "../utils/format.mjs";
	import { currentDate, foodDb } from "../stores/food";
	import { targetMacros } from "../stores/user";


let listOfDays = $state([])
let today = new Date()
let currentMonth = $state({year: today.getFullYear(), month: today.getMonth()})
let activeMonth = $state({year: today.getFullYear(), month: today.getMonth()})
let activeCalendar = {year: 0, month: 0}
let activeDay = $state()
const monthNames = [
  "Enero", "Febrero", "Marzo", 
  "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", 
  "Octubre", "Noviembre", "Diciembre"
]

const fillDays = async ({year, month} = activeMonth) => {

  if (year === activeCalendar.year && month === activeCalendar.month) return
  else {
    listOfDays = Array(42)
    activeCalendar.year = year
    activeCalendar.month = month
  }




  // Update active month
  activeMonth.year = year
  activeMonth.month = month

  // load records of month
  const logs = await $foodDb.getLogsInRange(`${year}-${month + 1}-01`, `${year}-${month + 1}-31`)
  const monthRecords = new Map()
  logs.forEach(record => {
    const {date} = record
    if (monthRecords.has(date)) {
      monthRecords.set(date, monthRecords.get(date) + record.calories)
    } else {
      monthRecords.set(date, record.calories)
    }
  })
  const {daysInMonth, startPlace} = getCalendarInfo(year, month)



  let j = 1
  let k = daysInMonth + startPlace - 1
  const target = $targetMacros?.calories ? $targetMacros.calories * 2 : 4000
  const day = today.getDate() - 1
  for (let i = startPlace - 1; i < k; i++) {
    const item = {day: i - startPlace + 2, value: 0}
    const key = `${year}-${month + 1}-${(i + 1).toString().padStart(2, '0')}`
    if (monthRecords.has(key)) {
      item.value = Math.max(0.1, Math.min(0.5, decimal(monthRecords.get(key) / target)))
    }
    if (isCurrentMonth && i === day) {
      item.today = true
    }
    listOfDays[i] = item
    j++
  }

}

const jumpToDate = i => {
  return () => {
    let newDate = `${currentMonth.year}-${currentMonth.month + 1}-${(i + 1).toString().padStart(2, '0')}`
    currentDate.set(newDate)
  }
}
const nextMonth = () => {
  if (activeMonth.month === 11) {
    activeMonth.month = 0
    activeMonth.year++
  } else {
    activeMonth.month++
  }
  fillDays()
}
const prevMonth = () => {
  if (activeMonth.month === 0) {
    activeMonth.month = 11
    activeMonth.year--
  } else {
    activeMonth.month--
  }
  fillDays()
}
currentDate.subscribe(date => {
  if (!date) return
  activeDay = parseInt(date.slice(-2)) - 1
  const month = parseInt(date.slice(5, 7)) - 1

  fillDays({year: parseInt(date.slice(0, 4)), month})
})

onMount(() => {
  fillDays({year: today.getFullYear(), month: today.getMonth()})
})



let isCurrentMonth = $derived(activeMonth.year === currentMonth.year && activeMonth.month === currentMonth.month)
</script>

<div id="calendar-view" class="flex col row-gap--lg">
  <div class="calendar__tools flex jc--sb">
    <button class="btn" onclick={prevMonth}>
      <span class="material-symbols-outlined">
        chevron_left
        </span>
    </button>
    <div class="flex--100 flex ai--center jc--center text--center">
      <span class="text--md">
        {monthNames[activeMonth.month || 0]?.slice(0, 3)}. {activeMonth.year}
      </span>
    </div>
    <button class="btn" onclick={nextMonth}>
      <span class="material-symbols-outlined">
        chevron_right
        </span>
    </button>
  </div>
  <div class="calendar__grid">
    <div class="calendar--slot">D</div>
    <div class="calendar--slot">L</div>
    <div class="calendar--slot">M</div>
    <div class="calendar--slot">M</div>
    <div class="calendar--slot">J</div>
    <div class="calendar--slot">V</div>
    <div class="calendar--slot">S</div>
    {#each listOfDays as item, i }
      <button class="btn calendar--slot 
        {item?.today ? 'calendar--today' : ''}
        {isCurrentMonth && i === activeDay ? 'calendar--active' : ''}" 
        style="--value:{item?.value || 0};"
        onclick={item?.day ? jumpToDate(i) : null}
      >
        <span>{item?.day}</span>
      </button>
    {/each}
  </div>
</div>

<style>

  .calendar__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, auto);
    margin: 0 auto;
    gap: .25rem;
  }

  .calendar--slot {
    aspect-ratio: 1;
    min-height: 2rem;
    width: auto;
    border-radius: .25rem;
    border: 1px solid rgba(var(--rgb-gray), 0.25);
    font-size: .75rem;
    display: flex;
    place-content: center;
    place-items: center;
    background-color: rgba(var(--rgb-blue), var(--value));
    position: relative;
}
.calendar--today::after {
  content: "";
  position: absolute;
  height: .25rem;
  width: .25rem;
  border-radius: 50%;
  left: 50%;
  bottom: .4rem;
  background-color: rgba(var(--rgb-blue), 1);
  transform: translate(-50%, -50%);
}
.calendar--active {
  border-color: rgba(var(--rgb-blue), 1);
}
</style>