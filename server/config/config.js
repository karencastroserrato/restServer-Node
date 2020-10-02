// =================================
// Puerto
// =================================
process.env.PORT = process.env.PORT || 3000;

// =================================
// Entorno
// =================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================================
// Base de Datos
// =================================
let urlDB;

// =================================
// Seed - Semilla de aplicacion 
// =================================

process.env.SEED = process.env.SEED || 'seed-semilla-secreta-desarrollo';

// =================================
// Fecha de expiracion 
// =================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

// =================================
// Google CLIENT_ID 
// =================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '378382033972-b00fl4pc8jas6lla9tdl8n02pnsk2hsj.apps.googleusercontent.com';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;