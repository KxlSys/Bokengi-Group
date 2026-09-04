/**
 * Shim for sharp in Cloudflare Worker runtime.
 * Sharp contains native C++ libvips binaries unsupported in workerd.
 * Payload CMS natively supports sharp: undefined in Cloudflare Workers environment.
 */
export default undefined
