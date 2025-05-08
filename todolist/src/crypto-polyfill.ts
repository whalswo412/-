import * as nodeCrypto from 'crypto';
// Web Crypto API가 없는 환경에 polyfill 처리
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = nodeCrypto;
} 