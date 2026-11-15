import * as THREE from 'three';
export function buildSpecimen(arch: string, color: string): {group: THREE.Group; materials: THREE.Material[]; parts: {obj: THREE.Object3D; base: THREE.Vector3; dir: THREE.Vector3}[]; waves: any[]; flaps: any[]};
