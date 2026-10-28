#!/usr/bin/env node
/*
 * Verificador · Evaluación 1 · Git y GitHub (Ficha 3349882)
 * Uso:   node verificar-evaluacion.js            (local + GitHub)
 *        node verificar-evaluacion.js --sin-api  (solo local)
 * Token opcional para la API: variable GITHUB_TOKEN o `gh auth token`.
 * Total: 50 pts → nota = puntos / 10.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RAIZ = process.cwd();
const SIN_API = process.argv.includes('--sin-api');
const C = { v: '\x1b[32m', r: '\x1b[31m', a: '\x1b[33m', g: '\x1b[90m', n: '\x1b[1m', x: '\x1b[0m' };

let puntos = 0;
let maximo = 0;
const categorias = {};

function sh(cmd) {
  try {
    return execSync(cmd, { cwd: RAIZ, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}
function leer(rel) {
  try { return fs.readFileSync(path.join(RAIZ, rel), 'utf8'); } catch { return null; }
}
function check(cat, desc, valor, ok, pista) {
  maximo += valor;
  categorias[cat] = categorias[cat] || { p: 0, m: 0 };
  categorias[cat].m += valor;
  if (ok) {
    puntos += valor;
    categorias[cat].p += valor;
    console.log(`  ${C.v}✔${C.x} ${desc} ${C.g}(+${valor})${C.x}`);
  } else {
    console.log(`  ${C.r}✘${C.x} ${desc} ${C.g}(0/${valor})${C.x}${pista ? `\n      ${C.a}→ ${pista}${C.x}` : ''}`);
  }
}
function titulo(t) { console.log(`\n${C.n}${t}${C.x}`); }

// ---------------------------------------------------------------- 1. Repo
titulo('1 · Repositorio limpio');
const esRepo = sh('git rev-parse --is-inside-work-tree') === 'true';
if (!esRepo) {
  console.log(`  ${C.r}✘ Esta carpeta no es un repositorio Git. Ejecuta git init primero.${C.x}`);
  console.log(`\n${C.n}Puntaje: 0 / 50 · Nota: 0.0${C.x}\n`);
  process.exit(0);
}
const rama = sh('git branch --show-current');
check('Repositorio', 'Rama principal llamada main', 2, rama === 'main', 'git branch -M main');

const gi = (leer('.gitignore') || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const tiene = (...pats) => pats.some((p) => gi.includes(p));
const giOk = tiene('.env') && tiene('logs/', 'logs', '*.log', 'logs/*') && tiene('borradores/', 'borradores', 'borradores/*') && tiene('node_modules/', 'node_modules');
check('Repositorio', '.gitignore excluye .env, logs, borradores y node_modules', 3, giOk, 'revisa que estén las 4 reglas');

const rastreados = (sh('git ls-files') || '').split('\n');
const colados = rastreados.filter((f) => f === '.env' || f.startsWith('logs/') || f.startsWith('borradores/') || f.startsWith('node_modules/'));
check('Repositorio', 'Ningún archivo sensible está rastreado', 4, colados.length === 0,
  colados.length ? `se colaron: ${colados.join(', ')} → git rm -r --cached <ruta> y commit` : '');

const urlOrigin = sh('git remote get-url origin') || '';
const m = urlOrigin.match(/github\.com[:/]([^/]+)\/([^/.]+?)(\.git)?$/);
sh('git fetch origin --quiet');
const upstream = sh('git rev-parse --abbrev-ref main@{upstream}');
const pendientes = upstream ? sh('git rev-list --count origin/main..main') : null;
check('Repositorio', 'origin apunta a GitHub, main tiene upstream y todo está subido', 3,
  !!m && !!upstream && pendientes === '0', !m ? 'git remote add origin <url>' : 'git push -u origin main');

// ---------------------------------------------------------------- 2. Historial
titulo('2 · Historial de commits');
const log = (sh('git log --format=%s') || '').split('\n').filter(Boolean);
check('Historial', `8 o más commits (tienes ${log.length})`, 3, log.length >= 8);
const genericos = /^(cambios?|update|updates|commit|final|fix|arreglos?|subir|prueba|test|wip|\.|asdf.*|ok)$/i;
const malos = log.filter((s) => s.length < 10 || genericos.test(s.trim()));
check('Historial', 'Mensajes descriptivos (sin "cambios", "update", "final"…)', 3, log.length > 0 && malos.length === 0,
  malos.length ? `mensajes a mejorar: ${malos.slice(0, 3).map((s) => `"${s}"`).join(', ')}` : '');

// ---------------------------------------------------------------- 3. README
titulo('3 · README.md');
const readme = leer('README.md') || '';
check('README', 'Título principal con #', 1, /^#\s+\S/m.test(readme));
check('README', '4 o más secciones ##', 1, (readme.match(/^##\s+\S/gm) || []).length >= 4);
check('README', 'Al menos una lista', 1, /^\s*([-*+]|\d+\.)\s+\S/m.test(readme));
check('README', 'Al menos un enlace', 1, /\[[^\]]+\]\([^)]+\)/.test(readme));
check('README', 'Un bloque de código con ```', 1, /```[\s\S]*?```/.test(readme));

// ---------------------------------------------------------------- 4. Planeación
titulo('4 · Planeación');
const tHu = leer('.github/ISSUE_TEMPLATE/historia-de-usuario.md') || '';
const tBug = leer('.github/ISSUE_TEMPLATE/reporte-de-bug.md') || '';
const huOk = /como/i.test(tHu) && /quiero/i.test(tHu) && /para/i.test(tHu) && /dado/i.test(tHu);
check('Planeación', 'Plantilla historia-de-usuario.md (Como/quiero/para + Dado)', 2, huOk);
check('Planeación', 'Plantilla reporte-de-bug.md', 1, tBug.trim().length > 40, 'incluye pasos para reproducir, esperado y obtenido');
const backlog = leer('planeacion/backlog.md') || '';
const hu03 = backlog.split(/^## HU-03/m)[1] || '';
const criterios03 = (hu03.match(/dado[\s\S]*?cuando[\s\S]*?entonces/gi) || []).length;
check('Planeación', `Criterios de HU-03 completos (encontrados: ${criterios03})`, 3, criterios03 >= 2 && !/TODO/.test(hu03));

// ---------------------------------------------------------------- 5. Código
titulo('5 · Implementación');
const html = leer('index.html') || '';
const seccion = (id) => {
  const re = new RegExp(`<section[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)</section>`, 'i');
  const r = html.match(re);
  return r ? r[1] : null;
};
const agenda = seccion('agenda');
const items = agenda ? (agenda.match(/<li[\s>][\s\S]*?<\/li>/gi) || []).filter((li) => /\d{1,2}[:.]\d{2}|\d{1,2}\s*(a\.?\s?m|p\.?\s?m)/i.test(li)) : [];
check('Implementación', `HU-01 · #agenda con 3+ actividades con hora (tienes ${items.length})`, 2, items.length >= 3);
const insc = seccion('inscripcion');
check('Implementación', 'HU-02 · #inscripcion con enlace mailto: o wa.me', 2, !!insc && /href=["'](mailto:|https:\/\/wa\.me\/)/i.test(insc));
const ubic = seccion('ubicacion');
check('Implementación', 'HU-03 · #ubicacion con dirección y enlace a mapa', 2,
  !!ubic && /href=["']https?:\/\/[^"']*(maps|openstreetmap|goo\.gl|waze)/i.test(ubic) && ubic.replace(/<[^>]+>/g, '').trim().length > 20);
const navHtml = (html.match(/<nav[\s\S]*?<\/nav>/i) || [''])[0];
const anclas = [...navHtml.matchAll(/href=["']#([^"']+)["']/g)].map((x) => x[1]);
const ids = new Set([...html.matchAll(/id=["']([^"']+)["']/g)].map((x) => x[1]));
const rotos = anclas.filter((a) => !ids.has(a));
check('Implementación', 'Bug del menú corregido (todos los enlaces llevan a una sección)', 2, anclas.length >= 4 && rotos.length === 0,
  rotos.length ? `enlaces sin destino: ${rotos.map((r) => '#' + r).join(', ')}` : '');

const closes = new Set();
const fixes = new Set();
log.forEach((s) => {
  [...s.matchAll(/\b(close[sd]?|resolve[sd]?)\s+#(\d+)/gi)].forEach((x) => closes.add(x[2]));
  [...s.matchAll(/\bfix(e[sd])?\s+#(\d+)/gi)].forEach((x) => fixes.add(x[2]));
});
check('Implementación', `Commits con closes #n (${closes.size}) y fixes #n (${fixes.size})`, 2, closes.size >= 3 && fixes.size >= 1,
  'un commit por historia con closes #n y uno para el bug con fixes #n');

// ---------------------------------------------------------------- 6. Entrega
titulo('6 · Entrega');
const entrega = leer('ENTREGA.md') || '';
const campo = (n) => { const r = entrega.match(new RegExp(`${n}[^:\\n]*:[ \\t]*(.+)`, 'i')); return r ? r[1].trim() : ''; };
const entregaOk = campo('Nombre completo').length > 3 && /github\.com\/.+\/.+/.test(campo('URL del repositorio'))
  && /github\.com\/.*projects\/\d+/.test(campo('URL del tablero')) && /\d+/.test(campo('bug'));
const limpio = sh('git status --porcelain') === '';
check('Entrega', 'ENTREGA.md completo y árbol de trabajo limpio', 2, entregaOk && limpio,
  !entregaOk ? 'llena todos los campos de ENTREGA.md (URL del tablero incluida)' : 'haz commit y push de lo pendiente');

// ---------------------------------------------------------------- 7. GitHub
async function api() {
  titulo('7 · GitHub (API)');
  const valores = [['Repositorio', 'Repositorio público en GitHub', 2], ['Planeación', 'Etiquetas historia y bug en uso', 2],
    ['Implementación', '4 o más issues cerrados', 2], ['Implementación', '3 o más issues cerrados desde un commit', 3]];
  const omitir = (motivo) => {
    console.log(`  ${C.a}⚠ ${motivo}. Se omiten 9 pts (el instructor los revisa).${C.x}`);
    valores.forEach(([cat, d, v]) => check(cat, d, v, false));
  };
  if (SIN_API) return omitir('Modo --sin-api');
  if (!m) return omitir('No hay remoto de GitHub');
  if (typeof fetch !== 'function') return omitir('Tu versión de Node no tiene fetch (usa Node 18+)');
  const [, owner, repo] = m;
  const token = process.env.GITHUB_TOKEN || sh('gh auth token');
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'verificar-evaluacion' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const get = async (u) => {
    let r = await fetch(`https://api.github.com/repos/${owner}/${repo}${u}`, { headers });
    if (r.status === 401 && headers.Authorization) { // token vencido: reintenta sin token
      delete headers.Authorization;
      r = await fetch(`https://api.github.com/repos/${owner}/${repo}${u}`, { headers });
    }
    if (r.status === 404) throw new Error('404: el repositorio no existe o es privado');
    if (!r.ok) throw new Error(`${r.status} en ${u || '/'}`);
    return r.json();
  };
  try {
    const info = await get('');
    check(...valores[0], !info.private);
    const issues = (await get('/issues?state=all&per_page=100')).filter((i) => !i.pull_request);
    const etiquetas = new Set(issues.flatMap((i) => i.labels.map((l) => l.name.toLowerCase())));
    check(...valores[1], etiquetas.has('historia') && etiquetas.has('bug'), 'asigna las etiquetas a los issues');
    const cerrados = issues.filter((i) => i.state === 'closed');
    check(...valores[2], cerrados.length >= 4, `cerrados: ${cerrados.length}`);
    let porCommit = 0;
    for (const i of cerrados.slice(0, 8)) {
      const ev = await get(`/issues/${i.number}/events?per_page=100`);
      if (ev.some((e) => e.event === 'closed' && e.commit_id)) porCommit += 1;
    }
    check(...valores[3], porCommit >= 3, `cerrados por commit: ${porCommit} (¿el commit llegó a main con closes #n?)`);
  } catch (e) {
    omitir(`No se pudo consultar GitHub (${e.message}${token ? '' : '; sin token hay límite de 60 consultas/h'})`);
  }
}

api().then(() => {
  console.log(`\n${C.n}Resumen por criterio${C.x}`);
  Object.entries(categorias).forEach(([k, v]) => console.log(`  ${k.padEnd(16)} ${String(v.p).padStart(2)} / ${v.m}`));
  const nota = (puntos / 10).toFixed(1);
  console.log(`\n${C.n}Puntaje: ${puntos} / ${maximo} · Nota: ${nota}${C.x}`);
  console.log(`${C.g}Tablero de GitHub Projects: revisión manual del instructor (-0.5 si falta o no está en Done).${C.x}\n`);
});
