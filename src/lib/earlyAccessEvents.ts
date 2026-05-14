export const openEarlyAccessModal = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('coodra:open-early-access'))
}
