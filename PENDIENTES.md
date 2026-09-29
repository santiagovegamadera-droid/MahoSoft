# Pendientes de MahoSoft

Lista de lo que falta, en el orden recomendado. Marca cada casilla (`[x]`) al terminarla.
Frontend: este repositorio. Backend: repositorio `backend` (.NET 9 + SQL Server).

Última actualización: 25 de septiembre de 2026.

---

## 0. Antes que nada

- [x] **Hacer commit** de todo lo trabajado en la rama `santiago`, en los dos repositorios (frontend `189f56b`, backend `2a4d106`).
- [x] **Push** de `santiago` a GitHub en los dos repositorios. Falta decidir cuándo pasarlo a `develop` / `main`.
- [x] **Formateador**: se cambió `oxfmt` por Prettier (`.prettierrc.json`: 120 columnas, comillas simples). `npm run format` formatea y `npm run format:check` revisa.
  - [ ] `pnpm-lock.yaml` quedó desactualizado (se usó npm, sin pnpm instalado): correr `pnpm install` si se sigue usando pnpm, o borrarlo y quedarse con `package-lock.json`.

---

## 1. Conectar cada módulo a la API

Hoy el **login**, las **categorías**, la **configuración**, los **proveedores**, los **productos**, las **compras**, las **ventas**, los **usuarios**, **Mi perfil**, **Inicio** y **Reportes** usan la base de datos: ya no queda ningún módulo con datos del navegador o fijos.
Para cada módulo: endpoints en el backend (con su permiso) y reemplazar su `store.js` por llamadas a la API, con mensajes de carga y de error.

- [x] **Categorías**: listar, crear, editar, activar/desactivar; no eliminar si tiene productos.
- [x] **Productos**
  - [x] CRUD con tallas, colores y stock por talla (cambiar el stock registra un movimiento de ajuste).
  - [x] Subir fotos a **Cloudinary** (claves guardadas con `user-secrets`).
  - [x] "Proveedores" y "Último proveedor" calculados desde las compras.
  - [ ] **Regenerar el secreto de Cloudinary** antes de producción (se compartió por chat).
- [x] **Configuración**: datos del negocio, tipos de documento, tallas, bancos, descuentos del POS y umbrales de stock bajo.
  - [ ] Completar los **datos del negocio** (NIT o cédula, dirección, teléfono, correo): salen en los recibos y como comprador en las compras.
- [x] **Proveedores**
  - [x] CRUD con IVA que cobra; bloquear la eliminación si tiene compras (ofrecer desactivar).
  - [x] **"Categorías que surte" calculadas desde las compras** (decidido). Ya no se marcan a mano.
- [x] **Compras**
  - [x] Registrar la compra: calcular los totales en el servidor, sumar el stock con movimientos de entrada y actualizar el costo del producto (sin IVA).
  - [x] Guardar el **PDF de la factura en el disco del servidor** (carpeta en `Archivos:Carpeta`; tipo y tamaño validados en el servidor).
  - [x] No permitir registrar dos veces la misma factura del proveedor.
  - [x] Marcar como pagada; indicador "Por pagar".
  - [ ] En producción, poner `Archivos:Carpeta` en un disco con **copia de seguridad** (las facturas no están en la base de datos).
- [x] **Ventas / Punto de venta**
  - [x] Registrar la venta: número de factura consecutivo sin repetirse aunque dos cajas vendan a la vez, descontar el stock y guardar el costo del momento.
  - [x] **Clientes**: buscar por documento o teléfono para no volver a escribir sus datos.
  - [x] Pedidos con datos de entrega.
  - [x] Comprobante de transferencia (archivo, banco y referencia).
  - [x] **Anular** en lugar de borrar: pedir motivo, guardar quién y cuándo, y devolver el stock.
  - [ ] Decidir si **anular** debe quedar solo para la administradora (hoy puede cualquiera con permiso POS).
- [x] **Historial de ventas** desde la API, mostrando las anuladas.
- [x] **Usuarios** (permiso Usuarios)
  - [x] Crear, editar, desactivar y asignar permisos (no se borran; nadie puede desactivarse ni quitarse el permiso Usuarios a sí mismo, y siempre queda al menos uno).
  - [x] Asignar o restablecer la contraseña de un usuario.
- [x] **Mi perfil**: editar los datos propios y **pantalla para cambiar la contraseña**.
- [x] **Inicio (Dashboard)** con datos reales: ventas de hoy y del mes (contra ayer y el mes anterior a la fecha), ingresos de los últimos 6 meses, ventas por categoría, productos más vendidos y alertas de stock bajo.
  - [x] El botón **"Pedir"** abre una compra nueva con ese producto y talla (y su último proveedor). Solo aparece a quien tiene permiso de Compras.
  - [ ] Se quitó la línea de "Meta" del gráfico porque no existe ninguna meta guardada. Si se quiere, agregar **metas de venta mensuales** en Configuración.
- [x] **Reportes** con datos reales (semana, mes y año, comparados con el periodo anterior) y botones **Exportar PDF** y **Exportar Excel** (se generan en el servidor).

---

## 2. Funciones que faltan

- [x] **Ajustes de inventario** (Productos → Movimientos): historial de todos los movimientos con filtros, y registrar conteo físico, prenda dañada o perdida, devolución a proveedor o ingreso sin compra.
- [x] **Enviar la factura por correo** al cliente desde el POS (sale sola si el cliente dejó su correo).
- [x] **Recuperar la contraseña por correo**: "¿Olvidaste tu contraseña?" envía un enlace que vence en 1 hora y sirve una sola vez.
  - [ ] **Configurar el Gmail de la tienda** (decidido): pasar la dirección y una contraseña de aplicación y guardarlas con `user-secrets` (ver el README del backend). Mientras tanto, ambas funciones responden "todavía no está configurado".
- [x] **Imprimir el comprobante de venta**: botón "Imprimir" en el comprobante; se imprime solo el recibo en una hoja.
  - [x] Formato de **impresora térmica de 80 mm** (decidido): la tirilla se imprime en una columna de 72 mm. En el diálogo de impresión elegir la impresora de recibos y su rollo.

---

## 3. Seguridad y puesta en producción

- [ ] **Cambiar la contraseña de ejemplo `Maho2026!`** de todos los usuarios antes de usar el sistema de verdad.
- [ ] Definir **dónde se publica**: la API, la base de datos SQL Server y el frontend.
- [ ] En producción: clave JWT y cadena de conexión como variables de entorno (nunca en el código), HTTPS y el dominio real del frontend en `Cors:Origenes`.
- [ ] **Copias de seguridad** automáticas de la base de datos y de la carpeta de PDF.
- [x] Revisar qué puede hacer cada rol en cada endpoint (Vendedora, Bodega, Administradora): cubierto por las pruebas de permisos.
- [x] **Pruebas automáticas del backend** (`backend/tests/MahoSoft.Pruebas`, `dotnet test`): 29 pruebas de totales, stock, concurrencia, anulaciones, ajustes y permisos, contra una base aparte.

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
