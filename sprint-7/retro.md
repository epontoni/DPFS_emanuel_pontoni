# Retrospectiva Sprint 6 – MakerHub

## ⭐ Estrella de mar

### 🟢 Comenzar a hacer
- Implementar validaciones completas del lado del servidor para evitar corrupción en la base de datos SQL.
- Brindar retroalimentación en tiempo real al usuario mediante validaciones en el front-end.
- Usar variables de entorno para las credenciales de base de datos de producción y desarrollo.

### 🔵 Hacer más
- Modularizar los controladores y separar la lógica de negocio de las consultas SQL mediante modelos de Sequelize.
- Utilizar transacciones de base de datos si realizamos múltiples consultas relacionadas.
- Documentar las tablas, tipos de datos y relaciones del esquema SQL.

### 🟡 Continuar haciendo
- Respetar el patrón MVC (Modelo-Vista-Controlador).
- Usar archivos parciales de EJS para no duplicar código en las cabeceras y pie de página.
- Mantener la encriptación de contraseñas con bcrypt en todas las altas y modificaciones.

### 🟠 Hacer menos
- Subir credenciales de base de datos a repositorios públicos de Git (crear archivos de ejemplo para la configuración).
- Dejar errores estructurales de etiquetas HTML sin cerrar en los partials.

### 🔴 Dejar de hacer
- Usar JSON como almacén primario de datos del sistema.
- Desarrollar sin un bosquejo inicial de base de datos o diagrama DER definido.
