# ASCONT - Sistema de Gestión Integral de Activos Fijos y TI

**Sistema de Gestión Integral de Activos Fijos y Tecnología de Información para la Oficina de Contadores ASCONT**

## 📋 Descripción General

ASCONT es una aplicación web moderna diseñada para la gestión completa del ciclo de vida de activos fijos (equipos informáticos, muebles, etc.) y activos de tecnología de información. El sistema permite rastrear activos desde su adquisición hasta su baja, asegurando un control integral, responsabilidad compartida y auditoría completa de todos los movimientos.

## 🎯 Objetivos Principales

- **Gestionar el ciclo de vida completo** de activos fijos y TI
- **Registrar y rastrear** movimientos de activos en tiempo real
- **Asignar responsabilidades** claras entre diferentes roles
- **Mantener historial detallado** (Hoja de Vida) de cada activo
- **Generar reportes** de custodia y estado del inventario
- **Controlar configuración** de equipos TI y software corporativo
- **Automatizar procesos** de adquisición, recepción y asignación

## ✨ Características Principales

### Sistema de Roles y Permisos
La aplicación implementa un modelo RBAC (Role-Based Access Control) con 4 roles principales:

| Rol | Descripción | Responsabilidades |
|-----|-------------|-------------------|
| **ENCARGADO_ADQUISICIONES** | Gestiona las compras | Crear solicitudes de activos, registrar adquisiciones |
| **LOGISTICA** | Gestiona bodega y recepción | Recibir activos, registrar en bodega, preparar para configuración |
| **TECNICO_TI** | Configura equipos TI | Configurar equipos, instalar software, gestionar tickets de soporte |
| **CUSTODIO** | Asigna y resguarda activos | Asignar equipos a usuarios, firmar actas de custodia, dar de baja |

### Módulos de la Aplicación

#### 1. **Dashboard** 📊
- Vista general del estado del inventario
- Estadísticas de activos por estado
- Resumen de actividades recientes
- Acceso rápido a acciones principales

#### 2. **Adquisición** 🛒
- Registro de nuevos activos a adquirir
- Creación de solicitudes de compra
- Seguimiento de proveedores
- Estados: PENDIENTE → ADQUIRIDO

#### 3. **Recepción** 📦
- Recepción de activos en almacén
- Inspección y validación de equipos
- Registro de entrada a bodega
- Estados: ADQUIRIDO → EN_BODEGA

#### 4. **Configuración TI** ⚙️
- Configuración técnica de equipos
- Instalación de software corporativo
- Asignación de licencias
- Testing y validación
- Estados: EN_BODEGA → EN_CONFIGURACION → LISTO_PARA_ASIGNACION

#### 5. **Custodia y Firmas** 📄
- Generación de actas de custodia
- Asignación final de equipos a usuarios
- Registro de firmas de responsabilidad
- Control de equipos en uso
- Estados: LISTO_PARA_ASIGNACION → ASIGNADO

#### 6. **Soporte Técnico** 🔧
- Apertura de tickets de soporte
- Seguimiento de incidencias
- Solicitud de mantenimiento
- Estadísticas de soporte

#### 7. **Configuración del Sistema** ⚙️
- Gestión de usuarios
- Configuración de software corporativo
- Administración de permisos
- Visualización de logs de auditoría

## 📊 Flujo de Estados de los Activos

```
PENDIENTE 
    ↓ (Activo adquirido)
ADQUIRIDO 
    ↓ (Activo recibido en bodega)
EN_BODEGA 
    ↓ (Envío a configuración TI)
EN_CONFIGURACION 
    ↓ (Configuración completa)
LISTO_PARA_ASIGNACION 
    ↓ (Acta de custodia firmada)
ASIGNADO 
    ↓ (Requiere mantenimiento)
EN_MANTENCION 
    ↓ (Fin de vida útil)
DADO_DE_BAJA
```

## 🏗️ Estructura del Proyecto

```
app/
  ├── layout.tsx           # Layout principal
  ├── page.tsx            # Página inicial con lógica de pantallas
  └── globals.css         # Estilos globales

components/
  ├── screens/            # Componentes principales de cada módulo
  │   ├── login.tsx
  │   ├── dashboard.tsx
  │   ├── adquisicion.tsx
  │   ├── recepcion.tsx
  │   ├── configuracion-ti.tsx
  │   ├── custodia-firmas.tsx
  │   └── soporte-tecnico.tsx
  ├── ui/                 # Componentes reutilizables (shadcn/ui)
  │   ├── button.tsx
  │   ├── card.tsx
  │   ├── dialog.tsx
  │   ├── form.tsx
  │   ├── table.tsx
  │   └── ... (más componentes UI)
  └── theme-provider.tsx  # Proveedor de tema

lib/
  ├── store.ts           # Estado global con Zustand
  ├── types.ts           # Definiciones de tipos TypeScript
  └── utils.ts           # Funciones utilitarias

public/
  └── assets/            # Imágenes y assets estáticos

styles/
  └── globals.css        # Estilos CSS globales
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React con SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **shadcn/ui** - Componentes UI accesibles y personalizables
- **Zustand** - Gestión de estado global
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Date-fns** - Manipulación de fechas
- **Lucide Icons** - Iconografía
- **Sonner** - Notificaciones toast

### Desarrollo
- **ESLint** - Linting de código
- **Autoprefixer** - Prefijos CSS automáticos
- **PostCSS** - Procesamiento CSS

## 🚀 Primeros Pasos

### Requisitos
- Node.js 18+
- npm o pnpm

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repositorio>
cd activos-fijos-y-TI-qq
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
# o
pnpm dev
```

4. **Acceder a la aplicación**
Abre [http://localhost:3000](http://localhost:3000) en tu navegador

### Usuarios de Prueba

La aplicación viene con usuarios predefinidos para pruebas:

| Nombre | Email | Rol |
|--------|-------|-----|
| Maria Gonzalez | maria.gonzalez@ascont.cl | Encargado de Adquisiciones |
| Carlos Perez | carlos.perez@ascont.cl | Logística |
| Ana Rodriguez | ana.rodriguez@ascont.cl | Técnico TI |
| Rodrigo Carmona | rodrigo.carmona@ascont.cl | Custodio |

## 📦 Software Corporativo Predefinido

La aplicación gestiona la instalación de software estándar:
- Sistema Contable ASCONT
- VPN Corporativa
- Microsoft Office 365
- Antivirus Corporativo
- Cliente de Correo Outlook

## 🔐 Seguridad y Auditoría

- **Control de Acceso**: Cada rol tiene permisos específicos
- **Hoja de Vida**: Registro detallado de todos los cambios de estado
- **Trazabilidad**: Identificación del usuario y fecha en cada operación
- **Actas de Custodia**: Documentación formal de responsabilidades

## 📋 Información de Activos

Cada activo registra:
- Código único
- Nombre y descripción
- Marca y modelo
- Proveedor
- Solicitante original
- Custodio actual
- Valor monetario
- Estado actual
- Fecha de compra
- Años en uso
- Historial completo de cambios

## 💾 Persistencia de Datos

- Datos almacenados en **localStorage** del navegador
- Compatible con **Zustand persist middleware**
- Datos persisten entre sesiones

## 📚 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run start    # Inicia servidor de producción
npm run lint     # Ejecuta ESLint
```

## 🎨 Personalización de Tema

La aplicación soporta:
- Tema claro y oscuro
- Iconos responsivos según preferencia del sistema
- Componentes customizables con CSS variables

## 📝 Notas de Desarrollo

- La aplicación es un SPA (Single Page Application)
- Todo el estado se gestiona localmente en el cliente
- Los formularios utilizan React Hook Form para validación
- Los componentes UI están basados en Radix UI (accesibles)

## 🤝 Contribución

Este repositorio está vinculado a un proyecto v0. Para hacer cambios:

1. Visita [v0.app](https://v0.app/chat/projects/prj_IcVA9pTtV6aPYm0DDOaLYmoTbVJc)
2. Realiza cambios en v0
3. Los commits se sincronizarán automáticamente

## 📖 Referencias

- [Documentación de Next.js](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)

## 📄 Licencia

Uso interno ASCONT - Todos los derechos reservados