/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function get_cycles(): number;
export function get_flops(): number;
export function get_cycles_for_program(a: number): number;
export function get_proof(a: number): number;
export function alloc(a: number): number;
export function dealloc(a: number, b: number): void;
export function get_proof_for_program(a: number, b: number, c: number): number;
export function free_proof(a: number): void;
