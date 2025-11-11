// Make sure TextEncoder/TextDecoder exist before react-router-dom loads
import { TextEncoder, TextDecoder } from 'node:util';

// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder as any;
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder as any;

/** Optional: if you stub fetch or need it in tests */
// import 'whatwg-fetch';

/** Optional: MUI or libraries sometimes use matchMedia */
if (!global.matchMedia) {
  // @ts-ignore
  global.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
    media: '',
  });
}
