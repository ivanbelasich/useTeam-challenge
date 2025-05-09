# Frontend - Tablero Kanban

Aplicación frontend para un tablero Kanban construida con Next.js, TypeScript y Tailwind CSS.

## Demo

La aplicación está desplegada en: [https://use-team-challenge.vercel.app/](https://use-team-challenge.vercel.app/)

## Requisitos

- Node.js 18 o superior
- npm o yarn

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

## Configuración

1. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```


Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Características

- Tablero Kanban con tres columnas (Por Hacer, En Progreso, Completado)
- Drag and Drop de tareas entre columnas
- Creación, edición y eliminación de tareas
- Actualización en tiempo real con WebSocket
- Diseño responsive
- Interfaz moderna y minimalista

## Tecnologías

- Next.js
- TypeScript
- Tailwind CSS
- @dnd-kit/core (Drag and Drop)
- Socket.io Client

