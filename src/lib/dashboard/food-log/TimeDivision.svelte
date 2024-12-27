
<script>
  /**
   * @typedef {Object} Props
   * @property {string} [timeFrom]
   * @property {string} [timeTo]
   */

  /** @type {Props} */
  let { timeFrom = "", timeTo = "" } = $props();
</script>

<div class="time-division">
  <span>{timeFrom}</span>
  <hr>
  <span>{timeTo}</span>
</div>

<style>
.time-division {
  grid-column: 1 / -1;
  font-size: .75rem;
  display: flex;
  align-items: center;
  gap: 1em;
  opacity: 0.5;
  padding: 1rem 0;
}
.time-division>span {
  white-space: nowrap;
}
.time-division>hr {
  flex-basis: 100%;
}
</style>