# SonarNest
Interface AR sonore mobile-first pour piloter des expériences immersives et la pose de bulles audio.

## Connexion Supabase (sécurisée)

1. Copier l'exemple de configuration locale:
   ```bash
   cp supabase-config.local.example.js supabase-config.local.js
   ```
2. Renseigner uniquement la clé publishable/anon dans `supabase-config.local.js`.
3. Ne jamais exposer la `service_role` key côté front.

Le fichier `supabase-config.local.js` est ignoré par Git pour éviter de pousser des secrets, même sur un dépôt privé.
