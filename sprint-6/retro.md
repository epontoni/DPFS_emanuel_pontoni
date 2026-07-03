# Retrospectiva Sprint 5 – MakerHub

## ⭐ Estrella de mar

### 🟢 Comenzar a hacer
- Implementar validaciones del lado del servidor para todos los formularios.
- Diseñar la base de datos relacional para migrar los archivos JSON.
- Documentar las relaciones entre tablas del sistema.

### 🔵 Hacer más
- Modularizar middlewares para reutilizarlos en múltiples rutas.
- Encriptar contraseñas de forma consistente y segura.
- Cuidar las sesiones y el almacenamiento de datos en cookies.

### 🟡 Continuar haciendo
- Proteger vistas sensibles mediante autenticación (huespedes y usuarios logueados).
- Reutilizar layouts mediante archivos parciales (head, header, footer).
- Usar variables de entorno para datos de configuración sensibles.

### 🟠 Hacer menos
- Almacenar contraseñas o datos de usuario sensibles sin protección o cifrado.
- Dejar rutas expuestas sin middlewares de seguridad correspondientes.

### 🔴 Dejar de hacer
- Usar archivos JSON planos para almacenar información que deba ser estructurada de forma relacional.
- Dejar errores estructurales de maquetación en EJS que afecten la validez del DOM.
