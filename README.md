# SonarNest
Interface AR sonore mobile-first pour piloter des expériences immersives et la pose de bulles audio.

## Connexion Supabase (sécurisée)

Ne jamais exposer la `service_role` key côté front.

## Configuration Supabase incluse

Le projet inclut déjà une configuration Supabase publishable par défaut dans `supabase-config.js` (URL + clé publishable) pour démarrer immédiatement.

Si tu veux surcharger en local (autre projet Supabase, bucket, table), crée `supabase-config.local.js`:

```bash
cp supabase-config.local.example.js supabase-config.local.js
```

Cette surcharge locale reste ignorée par Git.

## Authentification utilisateur (Supabase Auth)

- Ouvre `profil.html` pour créer un compte, te connecter et vérifier l'état de session.
- Les sessions sont persistées via Supabase (`persistSession: true`).
- La page `config.html` peut lire les packs distants uniquement si une session utilisateur active existe.

Workflow recommandé:
1. Crée/ouvre une session sur `profil.html`.
2. Va sur `config.html` pour synchroniser les packs liés à ton compte.
