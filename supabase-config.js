// Configuration Supabase par défaut (publishable, safe côté front)
// Peut être surchargée localement via `supabase-config.local.js` (ignoré par Git).
window.SONARNEST_SUPABASE = Object.assign(
  {
    url: 'https://bfeavhthuljelgqhwdjh.supabase.co',
    anonKey: 'sb_publishable_qWW0DK0l7vJoqv1QhpVCyQ_cGvqJWtD',
    bucket: 'sonarnest-packs',
    packsTable: 'owned_packs'
  },
  window.SONARNEST_SUPABASE || {}
)
