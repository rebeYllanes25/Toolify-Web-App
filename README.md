# 🚀 Toolify Web - Ecommerce

## 📸 Demo

<div align="center">
    <img src="./angular/public/inicio1.png" alt="Toolify Web pt.1">
    <img src="./angular/public/inicio2.png" alt="Toolify Web pt.2">
</div>

## 📖 Descripción

Plataforma tipo e-commerce/multi-rol para las diversas empresas MYPE de ferretería, orientada a la gestión, venta y pedidos de productos de construcción, ferretería y hogar, con compras en línea y presenciales, interfaces separadas por tipo de usuario y servicio de delivery

## ✨ Características
<ul>
  <li>🔐 Autenticación y registro de usuarios con JWT (/auth/register, /auth/login, /auth/me)</li>
  <li>📦 Gestión de catálogo: productos (listar, crear, actualizar, desactivar y filtrar por categoría)</li>
  <li>🏷️ Administración de categorías y proveedores</li>
  <li>🛒 Flujo completo de compra para clientes (navegación, compra e historial)</li>
  <li>💼 Panel de ventas para vendedores con historial y métricas</li>
  <li>🚚 Gestión de pedidos para repartidores (pendiente, aceptado, en camino, cerca, entregado)</li>
  <li>📊 Panel administrativo con dashboard y operaciones CRUD</li>
  <li>📈 Reportes y gráficos en tiempo real (ventas, stock, métricas mensuales)</li>
  <li>🔔 Notificaciones push con Firebase (gestión de token FCM y envío por usuario)</li>
  <li>📄 Generación de reportes en PDF con iText</li>
  <li>🖼️ Subida y gestión de imágenes de productos con Cloudinary</li>
</ul>

## 🛠️ Tecnologías

Back-End
| Tecnología | Uso |
|----------|:---------------:|
| **Java 17 + Spring Boot 3.5.x.** |  Lenguaje prinicipal + Framework |
| **Spring Web** | API REST |
| **Spring Data JPA + Hibernate** | Persistencia de data |
| **PostgreSQL** | Base de Datos |
| **Spring Security + JWT (jwt)** | Seguridad Staless|
| **Firebase Admin SDK** | Notificaciones push |
| **iText + ZXing** | Generación de PDF/códigos (según dependencias y endpoints) |
</br>

Front-End
| Tecnología | Uso |
|----------|:---------------:|
| **Angular** | Framework principal para la interfaz de usuario |
| **TypeScript** | Principal lenguaje del framework |
</br>

Infrastructure 

| Technology| Use |
|----------|:---------------:|
| **Render** | Backend y bd despliegue |
| **Vercel** | Frontend despliegue |
| **Docker** | Contenedor para el monolito |
| **Kubernetes** | Organizador para contenedores |
| **Cloudinary** | Almacenamiento de imágenes |
</br>

## 🏗️ Arquitectura
La arquitectura general es de tipo cliente-servidor desacoplada, donde el frontend y el backend se comunican mediante servicios REST. El backend sigue una arquitectura en capas (Layered / N-Tier), separando responsabilidades en controladores, servicios y repositorios para garantizar mantenibilidad y escalabilidad. El frontend está organizado bajo un enfoque modular por dominios y roles, incorporando lazy loading para optimizar el rendimiento.

<ul>
  <li>🎨 UI y navegación</li>
  <li>🧩 Módulos por rol con lazy loading</li>
  <li>🌐 Servicios HTTP hacia la API (environment.api_URL)</li>
  <li>🔐 Manejo de token JWT y control de roles en el cliente</li>
</ul>

⚙️ Backend Spring Boot (src/main/java/...)

<ul>
  <li>📌 Controller: exposición de endpoints REST</li>
  <li>🧠 Service: implementación de la lógica de negocio</li>
  <li>🗄️ Repository: acceso a datos mediante JPA</li>
  <li>📦 Model/DTO: entidades y objetos de transferencia</li>
  <li>🔧 Config/Util: configuración de seguridad JWT, CORS, Firebase, Cloudinary y utilidades</li>
</ul>

🗄️ Base de datos PostgreSQL

<ul>
  <li>⚙️ Configurada en application.properties</li>
  <li>📄 Script SQL disponible en base de datos/Bd_Toolify.sql</li>
</ul>



## 👥 Contributors 
<a href="https://github.com/rebeYllanes25/Toolify-Web-App/graphs/contributors"> 
  <img src="https://contrib.rocks/image?repo=rebeYllanes25/Toolify-Web-App" />
</a>

## 📄 License
This project is licensed under the [MIT License](./LICENSE).

