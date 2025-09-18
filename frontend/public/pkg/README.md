# WASM Build Optimizations

This directory contains the Rust/WASM code for the proving functionality.

## Build Scripts

- `build:wasm:dev` - Fast development build with debug symbols
- `build:wasm:release` - Optimized release build (used in CI)
- `build:wasm:release:force` - Force rebuild by clearing cache

## CI/CD Optimizations

The GitHub Actions workflows include several optimizations:

1. **Conditional WASM builds** - Only build when source files change
2. **Multi-level caching** - Cache both Rust toolchain and build artifacts
3. **Cache hit detection** - Skip builds when cache is available
4. **Parallel type checking** - Type checking runs in parallel with deployments

## Cache Strategy

- **Rust toolchain**: Cached per OS
- **WASM artifacts**: Cached based on source file hashes
- **Fallback**: Build from scratch if cache misses

## Troubleshooting

If you encounter cache misses:

1. Check if source files actually changed
2. Verify cache keys are correct
3. Clear cache if needed with `build:wasm:release:force`

## File Structure

```
wasm/
├── src/           # Rust source code
├── Cargo.toml     # Rust dependencies
├── Cargo.lock     # Locked dependency versions
└── rust-toolchain.toml  # Rust version specification
```

## Build Output

- `pkg/` - WASM package files
- `public/pkg/` - WASM files served by Next.js
- `target/` - Rust build artifacts (cached in CI)

## Performance Notes

- Development builds are unoptimized for faster iteration
- Production builds are optimized for size and performance
- CI uses caching for fast builds when source hasn't changed
- `build:wasm` uses cache by default, `build:wasm:force` ignores cache
