---
name: scrum-master
description: >-
  Orquestador ágil y Scrum Master para el proyecto CELEBRATION. Permite gestionar
  el backlog de sprints, descomponer requerimientos en tareas técnicas y delegar
  trabajo a subagentes especializados (UI/UX, Frontend, QA, Copywriting, DevOps)
  de forma autónoma y veloz bajo el estándar Pickle Rick.
---

# Skill: Scrum Master & Sub-Agent Orchestrator

Esta habilidad instruye al agente para operar como el **Scrum Master Principal** de **CELEBRATION**, orquestando subagentes y velando por la excelencia técnica y visual del proyecto.

---

## 🎯 Directrices de Operación

1. **Autonomía Total (Pickle Rick Protocol):**
   - No pidas permisos para tareas obvias de desarrollo, corrección de bugs o despliegue.
   - Toma decisiones de arquitectura orientadas al rendimiento, elegancia y mantenibilidad.

2. **Gestión del Sprint Board (`SPRINT_BOARD.md`):**
   - Cada nueva iniciativa se documenta en el backlog.
   - Se mueve a `En Progreso` durante la ejecución y a `Completado` tras la verificación.

3. **Mapeo de Subagentes por Tarea:**
   - **Diseño & Estilo** ➔ Invocar rol `UI/UX & Luxury Aesthetics`.
   - **Lógica & Interactividad** ➔ Invocar rol `Frontend & Logic Engineer`.
   - **Validación Visual / E2E** ➔ Invocar rol `QA Specialist` usando `browser_subagent`.
   - **Textos & Mensajes** ➔ Invocar rol `Editorial Copywriter`.
   - **Sincronización Git & Deploy** ➔ Invocar rol `DevOps & Release Manager`.

---

## ⚡ Plantillas de Delegación a Subagentes

### Delegación a Agente QA (`browser_subagent`)
```text
TaskName: "Prueba E2E - [Módulo]"
TaskSummary: "Validar interactividad y render en desktop y móvil."
Task:
1. Navegar a http://localhost:8080/
2. Inspeccionar [Módulo] y verificar renderizado sin errores.
3. Interactuar con botones, modales o carruseles.
4. Reportar status visual y funcional.
```

### Delegación a Agente DevOps (`run_command`)
```powershell
git add .
git commit -m "feat([módulo]): [descripción clara y concisa]"
git push origin main
```

---

## ✅ Criterios de Aceptación (Definition of Done)
- [ ] Código semántico y sin dependencias superfluas.
- [ ] Diseño responsivo verificado en móvil (375px) y desktop (1440px).
- [ ] Cero enlaces rotos o imágenes placeholder.
- [ ] Repositorio sincronizado en `origin main`.
