# MakerHub - Sprint 8 (API & Dashboard)

Este sprint final implementa una API REST completa expuesta por el servidor Express y un Dashboard interactivo construido en React para visualizar las principales métricas del negocio.

## 📋 Tablero de Trabajo

Puedes ver el seguimiento del proyecto aquí:
- **Trello:** [Ver Tablero de Trello](https://trello.com/invite/b/691f8aa662bc6fcf32ba6133/ATTI458407410214c67899fd3d395e10cd6aCD799401/sprint-2)

---

## 🛠️ Cómo ejecutar el Servidor Express (API)

1. Abre una terminal en el directorio `sprint-8`.
2. Asegúrate de tener una base de datos MySQL llamada `makerhub_db` e importa las tablas usando el script `structure.sql`. Opcionalmente, puedes poblarla con `data.sql`.
3. Configura el archivo `src/database/config/config.js` con las credenciales de tu base de datos local.
4. Instala las dependencias y ejecuta el servidor:
   ```bash
   npm install
   npm start
   ```
5. El servidor se iniciará en `http://localhost:3000`.

### Endpoints de la API

* **Listado de Usuarios:** `GET http://localhost:3000/api/users`
* **Detalle de Usuario:** `GET http://localhost:3000/api/users/:id`
* **Listado de Productos:** `GET http://localhost:3000/api/products`
* **Detalle de Producto:** `GET http://localhost:3000/api/products/:id`

---

## ⚛️ Cómo ejecutar el Dashboard en React

1. Abre una terminal en el directorio `sprint-8/dashboard`.
2. Instala las dependencias del proyecto React:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en la URL indicada por la consola (usualmente `http://localhost:5173`).
