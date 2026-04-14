(function () {
  'use strict'

  function getRuntimeConfig() {
    const cfg = window.SONARNEST_SUPABASE || {}
    return {
      url: String(cfg.url || '').trim(),
      anonKey: String(cfg.anonKey || '').trim()
    }
  }

  function createGateway() {
    const config = getRuntimeConfig()
    const hasSdk = Boolean(window.supabase && typeof window.supabase.createClient === 'function')
    const hasCredentials = Boolean(config.url && config.anonKey)

    if (!hasSdk) {
      return {
        isReady: false,
        reason: 'SDK Supabase introuvable',
        client: null
      }
    }

    if (!hasCredentials) {
      return {
        isReady: false,
        reason: 'Ajoute url + anonKey dans supabase-config.local.js',
        client: null
      }
    }

    return {
      isReady: true,
      reason: 'ok',
      client: window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    }
  }

  const gateway = createGateway()

  async function getSession() {
    if (!gateway.isReady || !gateway.client) return null
    const { data } = await gateway.client.auth.getSession()
    return data && data.session ? data.session : null
  }

  async function getUser() {
    if (!gateway.isReady || !gateway.client) return null
    const { data } = await gateway.client.auth.getUser()
    return data && data.user ? data.user : null
  }

  async function signInWithPassword(email, password) {
    if (!gateway.isReady || !gateway.client) {
      throw new Error(gateway.reason)
    }
    return gateway.client.auth.signInWithPassword({ email, password })
  }

  async function signUp(email, password) {
    if (!gateway.isReady || !gateway.client) {
      throw new Error(gateway.reason)
    }
    return gateway.client.auth.signUp({ email, password })
  }

  async function signOut() {
    if (!gateway.isReady || !gateway.client) {
      throw new Error(gateway.reason)
    }
    return gateway.client.auth.signOut()
  }

  function onAuthStateChange(callback) {
    if (!gateway.isReady || !gateway.client) return { unsubscribe: function () {} }
    const { data } = gateway.client.auth.onAuthStateChange(callback)
    return data && data.subscription ? data.subscription : { unsubscribe: function () {} }
  }

  async function requireSession(options) {
    const opts = options || {}
    const redirectTo = opts.redirectTo || './profil.html'
    const session = await getSession()
    if (session) return session
    window.location.href = redirectTo
    return null
  }

  window.SonarNestAuth = {
    isReady: gateway.isReady,
    reason: gateway.reason,
    client: gateway.client,
    getSession,
    getUser,
    signInWithPassword,
    signUp,
    signOut,
    onAuthStateChange,
    requireSession
  }
})()
