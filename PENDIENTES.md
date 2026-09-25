# Pendientes de MahoSoft

Lista de lo que falta, en el orden recomendado. Marca cada casilla (`[x]`) al terminarla.
Frontend: este repositorio. Backend: repositorio `backend` (.NET 9 + SQL Server).

Última actualización: 25 de septiembre de 2026.

---

## 0. Antes que nada

- [x] **Hacer commit** de todo lo trabajado en la rama `santiago`, en los dos repositorios (frontend `189f56b`, backend `2a4d106`).
- [x] **Push** de `santiago` a GitHub en los dos repositorios. Falta decidir cuándo pasarlo a `develop` / `main`.
- [ ] **No usar `npm run format`** hasta configurar el formateador: `oxfmt` no toma el estilo del proyecto (comillas simples, punto y coma, 120 columnas) y reescribe todos los archivos. Hay que agregarle su archivo de configuración o cambiarlo por Prettier.

---

## 1. Conectar cada módulo a la API

Hoy solo el **login** usa la base de datos. Todo lo demás sigue guardándose en el navegador (`store.js` de cada módulo).
Para cada módulo: endpoints en el backend (con su permiso) y reemplazar su `store.js` por llamadas a la API, con mensajes de carga y de error.

- [ ] **Categorías**: listar, crear, editar, activar/desactivar; no eliminar si tiene productos.
- [ ] **Productos**
  - [ ] CRUD con tallas, colores y stock por talla.
  - [ ] Subir fotos a **Cloudinary** (crear la cuenta y guardar las claves con `user-secrets`).
  - [ ] "Proveedores" y "Último proveedor" calculados desde las compras.
- [ ] **Configuración**: datos del negocio, tipos de documento, tallas, bancos, descuentos del POS y umbrales de stock bajo.
  - [ ] Completar los **datos del negocio** (NIT o cédula, dirección, teléfono, correo): salen en los recibos y como comprador en las compras.
- [ ] **Proveedores**
  - [ ] CRUD con IVA que cobra; bloquear la eliminación si tiene compras (ofrecer desactivar).
  - [ ] **"Categorías que surte" calculadas desde las compras** (decidido). Hoy en el frontend se marcan a mano: quitar ese campo.
- [ ] **Compras**
  - [ ] Registrar la compra: calcular los totales en el servidor, sumar el stock con movimientos de entrada y actualizar el costo del producto (sin IVA).
  - [ ] Guardar el **PDF de la factura en el disco del servidor** (definir la carpeta en la configuración y validar tipo y tamaño en el servidor).
  - [ ] No permitir registrar dos veces la misma factura del proveedor (la base de datos ya lo impide).
  - [ ] Marcar como pagada; indicador "Por pagar".
- [ ] **Ventas / Punto de venta**
  - [ ] Registrar la venta: número de factura consecutivo sin repetirse aunque dos cajas vendan a la vez, descontar el stock y guardar el costo del momento.
  - [ ] **Clientes**: buscar por documento o teléfono para no volver a escribir sus datos.
  - [ ] Pedidos con datos de entrega.
  - [ ] Comprobante de transferencia (archivo, banco y referencia).
  - [ ] **Anular** en lugar de borrar: pedir motivo, guardar quién y cuándo, y devolver el stock.
- [ ] **Historial de ventas** desde la API, mostrando las anuladas.
- [ ] **Usuarios** (solo administradora)
  - [ ] Crear, editar, desactivar y asignar permisos.
  - [ ] Asignar o restablecer la contraseña de un usuario.
- [ ] **Mi perfil**: editar los datos propios y **pantalla para cambiar la contraseña** (el endpoint ya existe: `POST /api/auth/cambiar-password`).
- [ ] **Inicio (Dashboard)** con datos reales. Hoy los números son fijos: ventas de hoy y del mes, gráfico de ingresos, ventas por categoría, productos más vendidos y alertas de stock bajo.
  - [ ] Definir qué hace el botón **"Pedir"** de las alertas (por ejemplo, abrir una compra nueva con ese producto).
- [ ] **Reportes** con datos reales (hoy son fijos) y que funcionen los botones **Exportar PDF** y **Exportar Excel** (hoy no hacen nada).

---

## 2. Funciones que faltan

- [ ] **Pantalla de ajustes de inventario**: hoy el stock solo cambia con compras y ventas. Falta poder registrar conteos, prendas dañadas, devoluciones a proveedor, etc. La tabla `MovimientosInventario` ya existe.
- [ ] **Enviar la factura por correo** al cliente (hoy es simulado en el POS). Requiere un servicio de correo.
- [ ] **Recuperar la contraseña por correo** (hoy dice "pídele a la administradora"). Usa el mismo servicio de correo.
- [ ] **Imprimir el comprobante de venta**: revisar cómo se ve impreso.

---

## 3. Seguridad y puesta en producción

- [ ] **Cambiar la contraseña de ejemplo `Maho2026!`** de todos los usuarios antes de usar el sistema de verdad.
- [ ] Definir **dónde se publica**: la API, la base de datos SQL Server y el frontend.
- [ ] En producción: clave JWT y cadena de conexión como variables de entorno (nunca en el código), HTTPS y el dominio real del frontend en `Cors:Origenes`.
- [ ] **Copias de seguridad** automáticas de la base de datos y de la carpeta de PDF.
- [ ] Revisar qué puede hacer cada rol en cada endpoint (Vendedora, Bodega, Administradora).
- [ ] **Pruebas automáticas del backend** (totales de compras y ventas, stock, anulaciones). Hoy no hay ninguna.

---

## 4. Decisiones pendientes

- [ ] **"Ahorro/Descuento" de las facturas de proveedor**: confirmar que es solo informativo (los precios ya vienen con el descuento). Si se escribe en el campo Descuento, se descontaría dos veces.
- [ ] **¿Se usará en tablet o en pantallas de menos de 1280 px?** Si sí, adaptar el menú lateral y el punto de venta.
- [ ] ¿Letra de 13 px en tablas y formularios, si el sistema todavía se ve grande?

---

## 5. Diseño (menor)

- [ ] Ordenar la paleta de colores (`brand-500`, `-700`, `-750` y `-75`, que se usan casi solo en el login).
- [ ] Las pestañas de Detalle de producto todavía no usan el componente `SegmentedTabs`.

---

## Datos a tener en cuenta

- **Datos de ejemplo:** Vestido Floral talla M y Cardigan talla XL tienen en la base de datos más stock que en el frontend (20 y 12), para que el stock cuadre con las compras registradas.
- **Datos en el navegador:** proveedores, productos, compras, etc. se reemplazarán por los de la base de datos al conectar cada módulo. Lo creado a mano en el navegador no se pasa solo.
- **Usuarios de ejemplo:** `ana@`, `carla@`, `sofia@`, `vale@` y `jorge@ellaboutique.co`, todos con la contraseña `Maho2026!`. Valentina está desactivada.
