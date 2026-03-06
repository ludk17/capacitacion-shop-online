import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import process from 'node:process';

// Configuramos la variable de entorno para evitar que el servidor inicie app.listen()
process.env.NODE_ENV = 'test';

import app from '../../src/index.js';

describe('Productos API', () => {
  test('GET /api/productos - debe retornar 200 y una lista de productos', async () => {
    const response = await request(app).get('/api/productos');
    
    assert.strictEqual(response.status, 200, 'El código de estado debe ser 200');
    assert.ok(Array.isArray(response.body), 'La respuesta debe ser una lista/array de productos');
  });
});
