// Polyfill file for Node.js global crypto
const { webcrypto } = require('crypto');

// Web Crypto API가 없는 환경에서만 글로벌 crypto 할당
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}

// crypto.randomUUID가 없으면 nodeCrypto.randomUUID 할당
if (typeof globalThis.crypto.randomUUID !== 'function' && typeof webcrypto.randomUUID === 'function') {
  try {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      value: webcrypto.randomUUID,
      configurable: true,
    });
  } catch {
    // 읽기 전용일 경우 무시
  }
} 