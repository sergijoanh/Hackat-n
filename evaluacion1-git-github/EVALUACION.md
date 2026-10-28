# Evaluación 1 · Git y GitHub (parte práctica)

**Ficha 3349882 · individual · 2 h 30 min · sin ayuda de compañeros**

Vas a llevar a GitHub el sitio de la **Hackatón ADSO 2026**: crearás el repositorio
desde cero, planearás el trabajo con issues y un tablero, y cerrarás cada issue con
un commit. Es lo mismo que hiciste con `mi-portafolio` en Git y GitHub I y II, pero
sin guía paso a paso.

> No hay `.git` en esta carpeta: el repositorio lo creas tú.

---

## Parte 1 · Repositorio limpio (1.4)

1. Inicializa el repositorio en la rama `main`.
2. En esta carpeta hay archivos que **no** deben llegar a GitHub: un archivo de
   variables de entorno, una carpeta de logs y una carpeta de borradores.
   Crea un `.gitignore` que los excluya y que además excluya `node_modules/`.
3. Haz tu primer commit **sin** que esos archivos queden rastreados
   (compruébalo con `git status` antes de hacer el commit).
4. Crea un repositorio **público** vacío en GitHub llamado `evaluacion1-git-github`,
   conéctalo como `origin` y haz `push -u`.

## Parte 2 · README (0.5)

Crea `README.md` con: un título `#`, al menos **4** secciones `##`, una lista,
un enlace y un bloque de código (por ejemplo, cómo clonar el repo).

## Parte 3 · Planeación en GitHub (0.8)

1. Crea `.github/ISSUE_TEMPLATE/historia-de-usuario.md` (Como / quiero / para +
   criterios Dado / cuando / entonces) y `.github/ISSUE_TEMPLATE/reporte-de-bug.md`.
2. Completa en `planeacion/backlog.md` los criterios de **HU-03** (mínimo 2, formato
   Dado / cuando / entonces).
3. Crea las etiquetas `historia` y `bug`.
4. Crea un issue por cada historia (HU-01, HU-02, HU-03) con la etiqueta `historia`.
5. Crea un tablero **Board** en GitHub Projects, vincúlalo al repo y agrega los issues.

## Parte 4 · Implementar y cerrar con commits (1.5)

1. Implementa cada historia en `index.html` (reemplaza el comentario `<!-- HU-0X -->`).
   Requisitos mínimos para que el verificador las reconozca:
   - HU-01: `<section id="agenda">` con una lista de **3 o más** actividades con hora.
   - HU-02: `<section id="inscripcion">` con un enlace `mailto:` o `https://wa.me/`.
   - HU-03: `<section id="ubicacion">` con la dirección y un enlace a un mapa.
2. Haz **un commit por historia** con `closes #n` en el mensaje y súbelo.
3. **Hay un bug en el menú** que ya venía en el sitio. Encuéntralo, repórtalo como
   issue usando tu plantilla de bug (etiqueta `bug`) y corrígelo con un commit que
   diga `fixes #n`.
4. Al final, todos los issues deben estar cerrados y en la columna **Done** del tablero.

## Parte 5 · Historial (0.6) y entrega (0.2)

- Mínimo **8 commits** en total, con mensajes descriptivos (nada de "cambios", "update", "final").
- Llena `ENTREGA.md`, haz commit y push. Tu árbol de trabajo debe quedar limpio.

---

## Autoevaluación

```bash
node verificar-evaluacion.js
```

El verificador revisa tu repositorio local (41 pts) y consulta GitHub (9 pts).
**Nota = puntos ÷ 10.** El tablero lo revisa el instructor a mano: si no es público
o los issues no están en Done, se descuentan 0.5.

## Rúbrica (5.0)

| Criterio | Qué se revisa | Valor |
|---|---|---|
| Repositorio limpio y publicado | `main`, `.gitignore` correcto, archivos sensibles sin rastrear, `origin` + push, repo público | 1.4 |
| Historial de commits | 8+ commits, mensajes descriptivos | 0.6 |
| README | título, 4+ secciones, lista, enlace, bloque de código | 0.5 |
| Planeación | 2 plantillas de issue, criterios HU-03, etiquetas en uso | 0.8 |
| Implementación y trazabilidad | 3 historias + bug resueltos en el código, `closes`/`fixes`, issues cerrados por commit | 1.5 |
| Entrega | `ENTREGA.md` completo y árbol limpio | 0.2 |
| **Total** | | **5.0** |
