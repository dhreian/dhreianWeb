# dhreian-web

Sitio oficial de dhreian.

## Desarrollo

```bash
npm install
npm run dev
```

Las variables necesarias están documentadas en `.env.example`. Los valores reales deben configurarse como variables de entorno del servidor y nunca guardarse en Git.

El instalador de dhreVerb se obtiene desde `DHREVERB_DOWNLOAD_URL`, permanece oculto en el servidor y se entrega mediante enlaces firmados temporales. El archivo debe alojarse fuera del repositorio. `PLUGIN_DOWNLOAD_SECRET` firma esos enlaces; si no se define, se usa `RATE_LIMIT_SECRET`.

## Licencias

El código y los recursos originales están protegidos según `LICENSE`. Las fuentes de terceros y sus licencias se detallan en `THIRD_PARTY_NOTICES.md`.
