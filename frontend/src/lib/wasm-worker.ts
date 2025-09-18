/**
 * WASM Worker for Image Provenance Proof Generation
 * 
 * This worker handles the actual WASM proof generation to avoid
 * blocking the main thread.
 */

const jobName = "image-provenance-prover";

addEventListener(
  "message",
  async (
    event: MessageEvent<{
      publicInputs: Uint8Array;
      programId?: string;
    }>
  ) => {
    try {
      console.log(`[${jobName}]: Starting proof generation...`);
      
      // Load WASM module
      const response = await fetch(`${self.location.origin}/pkg/wasm_bg.wasm`);
      const bytes = await response.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {});

      const memory = instance.exports.memory as WebAssembly.Memory;
      if (!memory) {
        throw new Error(`[${jobName}]: Could not import WASM memory`);
      }

      // Get WASM function exports
      const get_proof_for_program = instance.exports.get_proof_for_program as (
        input_ptr: number,
        input_len: number,
        program_id: number,
      ) => number;
      const free_proof = instance.exports.free_proof as (ptr: number) => void;
      const alloc = instance.exports.alloc as (size: number) => number;
      const dealloc = instance.exports.dealloc as (
        ptr: number,
        size: number,
      ) => void;

      const { publicInputs, programId } = event.data;
      
      if (!publicInputs || publicInputs.length === 0) {
        throw new Error(`[${jobName}]: Input data is undefined or empty`);
      }

      // Map program ID to number
      let program_id: number;
      switch (programId) {
        case "fib_input_initial":
          program_id = 1;
          break;
        default:
          program_id = 1; // Default to fib_input_initial
          break;
      }

      console.log(`[${jobName}]: Generating proof with program_id=${program_id}, input_length=${publicInputs.length}`);

      // Allocate memory in WASM for the input data
      const inputArrayPtr = alloc(publicInputs.length);
      const u8Array = new Uint8Array(memory.buffer);

      // Copy input data to WASM memory
      u8Array.set(publicInputs, inputArrayPtr);

      // Generate proof
      const ptr = get_proof_for_program(
        inputArrayPtr,
        publicInputs.length,
        program_id,
      );

      // Free the allocated input memory
      dealloc(inputArrayPtr, publicInputs.length);

      // Read proof result from WASM memory
      const proofResultSize = 20;
      const view = new DataView(memory.buffer, ptr, proofResultSize);

      const block_count = view.getInt32(0, true); // little-endian
      const proof_bytes_ptr = view.getUint32(4, true);
      const proof_bytes_len = view.getUint32(8, true);
      const proof_hash_ptr = view.getUint32(12, true);
      const proof_hash_len = view.getUint32(16, true);

      const u8 = new Uint8Array(memory.buffer);

      const proof_bytes = u8.slice(
        proof_bytes_ptr,
        proof_bytes_ptr + proof_bytes_len,
      );
      const proof_hash = u8.slice(
        proof_hash_ptr,
        proof_hash_ptr + proof_hash_len,
      );

      if (proof_bytes.length === 0 || proof_hash.length === 0) {
        throw new Error(`[${jobName}]: Generated proof or proof hash is empty`);
      }

      // Free the proof result memory
      free_proof(ptr);

      console.log(`[${jobName}]: Proof generated successfully - blocks: ${block_count}, bytes: ${proof_bytes.length}, hash: ${proof_hash.length}`);

      // Send result back to main thread
      self.postMessage({
        type: "success",
        block_count,
        proof_bytes: [...proof_bytes],
        proof_hash: [...proof_hash],
      });
    } catch (error) {
      console.error(`[${jobName}]: Error generating proof:`, error);
      
      // Send error back to main thread
      self.postMessage({
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
);
