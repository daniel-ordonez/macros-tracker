<script>
  /**
   * @typedef {Object} Props
   * @property {number} [percent]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { percent = 0, children } = $props();
</script>

<div class="radial-graph" style="--fill:{percent}%;">
  <div class="radial__outer">
    <div class="radial__inner">
      <div class="radia__content">
        {#if children}{@render children()}{:else}
          {#if percent}
          {percent}%
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @property --fill {
    syntax: '<percentage>';
    inherits: true;
    initial-value: 0%;
  }
  .radial-graph {
    aspect-ratio: 1;
    border-radius: 50%;
    height: var(--radial-h, 100%);
    width: var(--radial-h, auto);
    background-color: rgba(0, 0, 0, 0.1);
  }
  .radial__outer {
    --fill-color: var(--radial-bg, black);
    height: 100%;
    width: 100%;
    aspect-ratio: inherit;
    border-radius: inherit;
    padding: var(--radial-thick, 4px);
    background: conic-gradient(var(--fill-color) var(--fill), transparent var(--fill), transparent 100%);
  }
  .radial__inner {
    height: 100%;
    width: 100%;
    aspect-ratio: inherit;
    border-radius: inherit;
    background-color: var(--parent-bg-color);
  }
  .radia__content {
    height: 100%;
    width: 100%;
    display: flex;
    place-content: center;
    place-items: center;
  }
</style>