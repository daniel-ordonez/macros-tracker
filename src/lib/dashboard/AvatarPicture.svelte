<script>
  /**
   * @typedef {Object} Props
   * @property {string} [userName]
   */

  /** @type {Props} */
  let { userName = "user" } = $props();


  let initials = $derived(userName.substring(0, 1))
</script>


<div id="avatar-picture">
  <div class="avatar">
    {initials}
  </div>
</div>

<style>
  #avatar-picture {
    --avantar-size: 60px;
    padding: 6px;
    border-radius: 12px;
    background-color: white;
    grid-column: 2;
  }
  .avatar {
    height: var(--avantar-size);
    width: var(--avantar-size);
    aspect-ratio: 1;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: calc(var(--avantar-size) * .8);
    text-transform: uppercase;
    font-weight: 700;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
</style>