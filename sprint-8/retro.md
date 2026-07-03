# Retrospectiva Sprint 7 – MakerHub

## ⭐ Estrella de mar

### 🟢 Comenzar a hacer
- Exponer APIs REST de consulta de datos para integrar la aplicación con otros servicios externos (ej: Dashboards).
- Aprender a modularizar componentes en React para construir interfaces dinámicas y eficientes.
- Controlar cabeceras CORS en el servidor Express para habilitar el consumo seguro de las APIs.

### 🔵 Hacer más
- Validar minuciosamente tanto del lado del servidor (Express Validator) como del cliente (JavaScript Vanilla) para lograr robustez extrema.
- Tratar y eliminar archivos basura subidos por Multer cuando las validaciones fallan.
- Mantener la persistencia del estado del formulario (`oldData`) ante re-renderizados por error.

### 🟡 Continuar haciendo
- Proteger rutas de huéspedes y usuarios de forma jerárquica con middlewares específicos.
- Usar Sequelize para interactuar con la base de datos MySQL de forma organizada y tipada.
- Utilizar una estructura limpia de carpetas y commits atómicos.

### 🟠 Hacer menos
- Confiar únicamente en la validación del front-end (ya que puede ser eludida fácilmente por el navegador).
- Mezclar lógica de validación de campos complejos directamente en los controladores (es mejor encapsularlos en middlewares dedicados).

### 🔴 Dejar de hacer
- Dejar campos requeridos nativos del navegador sin el atributo `novalidate` si se quiere renderizar mensajes de error de front-end personalizados.
- Almacenar datos inconsistentes o mal formados en la base de datos SQL.
