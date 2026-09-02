import { describe, expect, it } from 'vitest';
import { AxiosError } from 'axios';
import { getApiErrorMessage } from './api';

describe('getApiErrorMessage', () => {
  it('reads the API error payload', () => {
    const error = new AxiosError('fail');
    error.response = {
      data: { message: 'Correo o contraseña incorrectos.' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: {} } as never,
    };
    expect(getApiErrorMessage(error)).toBe('Correo o contraseña incorrectos.');
  });

  it('falls back when the payload has no message', () => {
    expect(getApiErrorMessage(new Error('boom'), 'No se pudo iniciar sesión.')).toBe('boom');
    expect(getApiErrorMessage({}, 'No se pudo iniciar sesión.')).toBe('No se pudo iniciar sesión.');
  });
});
