"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getQuality, onQualityChange, type Quality } from "@/components/hud/quality";

/** Points scattered over the 3D head per tier. */
const MESH_POINTS: Record<Quality, number> = { high: 140000, med: 80000, saver: 35000 };
/** Photo-fallback sampling grid per tier. */
const GRID: Record<Quality, number> = { high: 380, med: 280, saver: 180 };
const DUST: Record<Quality, number> = { high: 400, med: 200, saver: 60 };

const BASE = "#eef2ea";
const ACCENT = "#c8ff2e";

/**
 * Where the mesh sits inside the portrait it was built from (portrait UV of the mesh's bounding box).
 * Tune if the traced features drift off the geometry.
 */
const FIT = { top: 0.07, bottom: 1.0, left: 0.0, right: 1.0 };
const RINGS = 18; // horizontal scan contours across the head height

const vertex = /* glsl */ `
  attribute float aLum;
  attribute vec3 aScatter;
  uniform float uTime;
  uniform float uIntro;
  uniform float uSize;
  uniform float uRim;
  uniform float uSweep;
  uniform vec2 uMouse;
  uniform float uMouseOn;
  uniform float uAspect;
  uniform float uTalk;
  uniform float uListen;
  varying float vLum;
  varying float vSweep;
  varying float vAtt;
  varying float vTalk;
  void main() {
    // Assemble: points start as noise around their target and converge.
    vec3 p = mix(aScatter, position, uIntro);

    // Speaking: the mouth/jaw area ripples outward with the voice level and glows.
    // (The mouth sits at about y = -0.07 on the normalised head, face toward +z.)
    float mouth = smoothstep(0.27, 0.0, length((position.xy - vec2(0.0, -0.06)) * vec2(0.85, 1.2))) * smoothstep(0.1, 0.5, normal.z);
    float ripple = 0.55 + 0.45 * sin(uTime * 22.0 + position.y * 26.0 + position.x * 9.0);
    p += normal * mouth * uTalk * 0.075 * ripple;
    p.y -= mouth * uTalk * 0.02;
    vTalk = mouth * uTalk;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * normal);

    // Attention: points near the cursor lift off the surface and glow.
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    float att = smoothstep(0.28, 0.0, length((ndc - uMouse) * vec2(uAspect, 1.0))) * uMouseOn;
    mv.xyz += n * att * 0.05;

    float rim = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), 2.2);
    vSweep = smoothstep(0.045, 0.0, abs(position.y - uSweep)) * uIntro;
    vAtt = att;
    vLum = max(aLum, rim * uRim) + att * 0.5 + vTalk * 0.8 + uListen * rim * 0.35;
    gl_PointSize = uSize * (0.55 + vLum * 0.6 + vSweep * 0.8 + vTalk * 1.2) * (3.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vLum;
  varying float vSweep;
  varying float vAtt;
  varying float vTalk;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = max(max(vSweep, vAtt * 0.6), vTalk * 1.4);
    vec3 c = mix(uColor, uAccent, glow);
    float a = smoothstep(0.5, 0.05, d) * (0.06 + vLum * 1.0 + vSweep * 0.8);
    gl_FragColor = vec4(c, a);
  }
`;

/** Grayscale (contrast-stretched) + Sobel edge strength of an image at n×n. */
function edgeMap(img: CanvasImageSource, n: number, withEdges = true) {
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.filter = "blur(0.6px) contrast(1.3)";
  ctx.drawImage(img, 0, 0, n, n);
  const { data } = ctx.getImageData(0, 0, n, n);
  const lum = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) {
    lum[i] = (data[i * 4] * 0.299 + data[i * 4 + 1] * 0.587 + data[i * 4 + 2] * 0.114) / 255;
  }
  // Stretch to the 3rd-97th percentile so dark skin tones keep their detail.
  const probe = Array.from({ length: 4096 }, () => lum[(Math.random() * lum.length) | 0]).sort((a, b) => a - b);
  const lo = probe[122];
  const hi = Math.max(lo + 0.05, probe[3973]);
  for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)));
  const edge = new Float32Array(n * n);
  const at = (x: number, y: number) => lum[y * n + x];
  for (let y = 1; withEdges && y < n - 1; y++) {
    for (let x = 1; x < n - 1; x++) {
      const gx = at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1);
      const gy = at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1);
      edge[y * n + x] = Math.min(1, Math.hypot(gx, gy) * 1.6);
    }
  }
  const sample = (arr: Float32Array, u: number, v: number) => {
    const x = Math.min(n - 1, Math.max(0, Math.round(u * (n - 1))));
    const y = Math.min(n - 1, Math.max(0, Math.round(v * (n - 1))));
    return arr[y * n + x];
  };
  return { n, lum, edge, edgeAt: (u: number, v: number) => sample(edge, u, v), lumAt: (u: number, v: number) => sample(lum, u, v) };
}

const jitter = (p: number, s: number) => p + (Math.random() - 0.5) * s;

/** Hand the main thread back to the browser (so scrolling and taps stay responsive during setup). */
const yieldToMain = (): Promise<void> =>
  typeof (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler?.yield === "function"
    ? (globalThis as unknown as { scheduler: { yield: () => Promise<void> } }).scheduler.yield()
    : new Promise((r) => setTimeout(r, 0));

/**
 * Stipples the 3D head: even coverage everywhere (no holes), with the portrait projected onto the front so
 * each point's brightness and density follow your real light and shadow (forehead, nose, cheekbones, lips).
 * Photo edges sharpen features; horizontal scan rings add the contour look. Points sit just above the
 * surface so the occluder keeps them.
 */
async function sampleHead(
  mesh: THREE.Mesh,
  photo: ReturnType<typeof edgeMap> | null,
  texture: ReturnType<typeof edgeMap> | null,
  count: number,
  cancelled: () => boolean,
) {
  const sampler = new MeshSurfaceSampler(mesh).build();
  const uv = new THREE.Vector2();
  const box = mesh.geometry.boundingBox!;
  const W = box.max.x - box.min.x;
  const H = box.max.y - box.min.y;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const lum = new Float32Array(count);
  const scatter = new Float32Array(count * 3);
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  let i = 0;
  let sliceStart = performance.now();
  for (let tries = 0; i < count && tries < count * 4; tries++) {
    // Work in ~8 ms slices, then let the browser breathe.
    if (performance.now() - sliceStart > 8) {
      await yieldToMain();
      if (cancelled()) return null;
      sliceStart = performance.now();
    }
    sampler.sample(p, n, undefined, uv);
    // How much the tone map applies: everywhere with the model's texture; with the projected photo, full on
    // the front and fading smoothly toward the sides (no seam).
    const front = texture ? 1 : photo ? smooth(-0.1, 0.55, n.z) : 0;
    let tone = 0;
    let edge = 0;
    if (texture) {
      // glTF UVs map straight onto image pixels (origin top-left).
      tone = Math.pow(texture.lumAt(uv.x, uv.y), 1.5); // >1 deepens eyes/brows, keeps highlights
      // No edges here: the texture is a patchwork atlas, so its seams would read as fake lines.
    } else if (front > 0) {
      const u = FIT.left + ((p.x - box.min.x) / W) * (FIT.right - FIT.left);
      const v = FIT.top + ((box.max.y - p.y) / H) * (FIT.bottom - FIT.top);
      tone = Math.pow(Math.min(1, Math.max(0, (photo!.lumAt(u, v) - 0.06) * 1.7)), 0.85);
      edge = photo!.edgeAt(u, v);
    }
    const ring = ((p.y - box.min.y) / H) * RINGS;
    const onRing = Math.abs(ring - Math.round(ring)) < 0.035 ? 1 : 0;
    // Stipple: brighter areas get more points, but every area keeps some; ring points always stay.
    if (!onRing && Math.random() > 0.16 + 0.84 * Math.max(tone * front, 1 - front)) continue;

    p.addScaledVector(n, 0.004);
    pos.set([p.x, p.y, p.z], i * 3);
    nor.set([n.x, n.y, n.z], i * 3);
    lum[i] = Math.min(1, front * (tone * 0.9 + edge * 0.45) + (1 - front) * 0.04 + onRing * 0.5);
    scatter.set([jitter(p.x, 1.2), jitter(p.y, 1.2), jitter(p.z, 1.2)], i * 3);
    i++;
  }
  return { pos: pos.subarray(0, i * 3), nor: nor.subarray(0, i * 3), lum: lum.subarray(0, i), scatter: scatter.subarray(0, i * 3) };
}

/** Fallback when the GLB can't load: trace the photo's edges on a bulged plane. */
function samplePhoto(edges: ReturnType<typeof edgeMap>) {
  const { n, lum: L, edge } = edges;
  const pos: number[] = [];
  const nor: number[] = [];
  const lum: number[] = [];
  const scatter: number[] = [];
  for (let y = 1; y < n - 1; y++) {
    for (let x = 1; x < n - 1; x++) {
      const e = edge[y * n + x];
      const l = L[y * n + x];
      let w: number;
      if (e > 0.16 && Math.random() < e * 1.3) w = e;
      else if (l > 0.2 && Math.random() < 0.02) w = l * 0.3;
      else continue;
      const px = (x / n - 0.5) * 2;
      const py = -(y / n - 0.5) * 2;
      const hx = px / 0.5;
      const hy = (py - 0.12) / 0.66;
      const z = Math.sqrt(Math.max(0, 1 - hx * hx - hy * hy)) * 0.55;
      pos.push(px, py, z);
      nor.push(0, 0, 1);
      lum.push(w);
      scatter.push(jitter(px, 1.2), jitter(py, 1.2), jitter(z, 1.2));
    }
  }
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), lum: new Float32Array(lum), scatter: new Float32Array(scatter) };
}

/** Quantized GLB attributes (int16/int8) -> float, so rescaling can't clip them. */
function toFloat(a: THREE.BufferAttribute | THREE.InterleavedBufferAttribute) {
  const out = new Float32Array(a.count * a.itemSize);
  for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = a.getComponent(i, k);
  return new THREE.BufferAttribute(out, a.itemSize);
}

/** Loads the GLB as one position+normal geometry, centred and scaled to 2.3 units tall. */
async function loadHead(url: string) {
  const gltf = await new GLTFLoader().loadAsync(url);
  gltf.scene.updateMatrixWorld(true);
  const parts: THREE.BufferGeometry[] = [];
  let texture: CanvasImageSource | null = null;
  gltf.scene.traverse((o) => {
    if (!(o as THREE.Mesh).isMesh) return;
    const g = (o as THREE.Mesh).geometry;
    // Keep only what we use, as floats; smooth normals give a soft rim instead of faceted triangles.
    const clean = new THREE.BufferGeometry();
    clean.setAttribute("position", toFloat(g.getAttribute("position")));
    if (g.getAttribute("normal")) clean.setAttribute("normal", toFloat(g.getAttribute("normal")));
    if (g.getAttribute("uv")) clean.setAttribute("uv", toFloat(g.getAttribute("uv")));
    const map = ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).map;
    if (map?.image && !texture) texture = map.image as CanvasImageSource;
    if (g.index) clean.setIndex(g.index);
    clean.applyMatrix4(o.matrixWorld);
    if (!clean.getAttribute("normal")) clean.computeVertexNormals();
    parts.push(clean);
  });
  const geom = parts.length === 1 ? parts[0] : mergeGeometries(parts)!;
  geom.computeBoundingBox();
  const size = geom.boundingBox!.getSize(new THREE.Vector3());
  const center = geom.boundingBox!.getCenter(new THREE.Vector3());
  geom.translate(-center.x, -center.y, -center.z);
  geom.scale(2.3 / size.y, 2.3 / size.y, 2.3 / size.y);
  geom.computeBoundingBox();
  return { geom, texture };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function FaceCloud({
  src = "/ai/portrait.jpg",
  model = "/ai/head.glb",
  className,
}: {
  /** Portrait the head was built from; its edges become the facial lines. */
  src?: string;
  /** 3D head; falls back to tracing the photo if it fails to load. */
  model?: string;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 5.0;
    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uSize: { value: 2.0 },
      uRim: { value: 0 },
      uSweep: { value: 9 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uMouseOn: { value: 0 },
      uTalk: { value: 0 },
      uListen: { value: 0 },
      uAspect: { value: 1 },
      uColor: { value: new THREE.Color(BASE) },
      uAccent: { value: new THREE.Color(ACCENT) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    let face: THREE.Points | null = null;
    let dust: THREE.Points | null = null;
    let head: THREE.Mesh | null = null; // invisible depth occluder (mesh mode only)
    let edges: ReturnType<typeof edgeMap> | null = null;
    let skin: ReturnType<typeof edgeMap> | null = null; // the model's own texture, if it has one
    let disposed = false;
    let ready = false;

    function points(d: { pos: Float32Array; nor: Float32Array; lum: Float32Array; scatter: Float32Array }) {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(d.pos, 3));
      g.setAttribute("normal", new THREE.BufferAttribute(d.nor, 3));
      g.setAttribute("aLum", new THREE.BufferAttribute(d.lum, 1));
      g.setAttribute("aScatter", new THREE.BufferAttribute(d.scatter, 3));
      return new THREE.Points(g, material);
    }

    let buildId = 0;
    async function build(q: Quality) {
      if (!ready) return;
      const id = ++buildId; // a newer build (quality change) supersedes this one
      const stale = () => disposed || id !== buildId;
      let data: ReturnType<typeof samplePhoto> | null = null;
      if (head) data = await sampleHead(head, edges, skin, MESH_POINTS[q], stale);
      else if (edges) data = samplePhoto(edges);
      if (!data || stale()) return;
      for (const p of [face, dust]) {
        if (!p) continue;
        group.remove(p);
        p.geometry.dispose();
      }
      uniforms.uRim.value = head ? 1 : 0;
      face = points(data);
      group.add(face);

      // Loose particles drifting around the head.
      const n = DUST[q];
      const dp = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) dp.set([(Math.random() - 0.5) * 3.4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 1.5], i * 3);
      dust = points({
        pos: dp,
        nor: new Float32Array(n * 3).map((_, i) => (i % 3 === 2 ? 1 : 0)),
        lum: new Float32Array(n).map(() => Math.random() * 0.25),
        scatter: dp,
      });
      group.add(dust);
      renderer.setPixelRatio(Math.min(devicePixelRatio, q === "high" ? 2 : 1));
      if (reduced) renderer.render(scene, camera);
    }

    Promise.all([loadImage(src), loadHead(model).catch(() => null)]).then(([img, loaded]) => {
      if (disposed) return;
      if (img) edges = edgeMap(img, 512);
      if (loaded?.texture) skin = edgeMap(loaded.texture, 1024, false);
      if (loaded) {
        head = new THREE.Mesh(loaded.geom, new THREE.MeshBasicMaterial({ colorWrite: false }));
        head.renderOrder = -1;
        group.add(head);
      }
      ready = true;
      build(getQuality());
    });
    const offQuality = onQualityChange(build);

    function resize() {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / Math.max(height, 1);
      uniforms.uAspect.value = camera.aspect;
      camera.updateProjectionMatrix();
      if (reduced) renderer.render(scene, camera);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    // Don't spend GPU time while the head is off-screen or the tab is hidden.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    // Head follows the pointer a little; cursor position drives the attention glow.
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const clamp = (v: number) => Math.min(1, Math.max(0, v));
      target.x = (clamp(e.clientX / innerWidth) - 0.5) * 0.5;
      target.y = (clamp(e.clientY / innerHeight) - 0.5) * 0.3;
      const r = el.getBoundingClientRect();
      uniforms.uMouse.value.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      uniforms.uMouseOn.value = e.pointerType === "mouse" ? 1 : 0;
    };
    const onLeave = () => (uniforms.uMouseOn.value = 0);
    addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Voice agent drives the head: level (0..1) while David speaks, "listening" while the visitor talks.
    const voice = { level: 0, listening: 0 };
    const onVoice = (e: Event) => {
      const d = (e as CustomEvent<{ level?: number; state?: string }>).detail;
      if (typeof d.level === "number") voice.level = d.level;
      if (d.state) voice.listening = d.state === "listening" ? 1 : 0;
    };
    addEventListener("agent:voice", onVoice);

    const t0 = performance.now();
    let raf = 0;
    let trainFrom = -1; // when the head was built; it assembles from noise from there

    const tick = () => {
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = (performance.now() - t0) / 1000;
      uniforms.uTime.value = t;
      if (face && trainFrom < 0) trainFrom = t;
      const p = trainFrom < 0 ? 0 : Math.min(1, (t - trainFrom) / 2.4);
      uniforms.uIntro.value = 1 - Math.pow(1 - p, 4);
      // Scan beam: sweeps top to bottom over 2.6s, rests, repeats every 7s.
      const s = ((t - Math.max(trainFrom, 0)) % 7) / 2.6;
      uniforms.uSweep.value = s <= 1 ? 1.25 - s * 2.5 : 9;
      group.rotation.y += (target.x + Math.sin(t * 0.3) * 0.3 - group.rotation.y) * 0.04;
      group.rotation.x += (target.y + Math.sin(t * 0.21) * 0.05 - group.rotation.x) * 0.04;
      if (dust) dust.rotation.y = t * 0.03;
      // Smooth the voice signal: fast attack so the mouth pops with each syllable, slower release.
      const tk = uniforms.uTalk.value;
      uniforms.uTalk.value += (voice.level - tk) * (voice.level > tk ? 0.5 : 0.15);
      uniforms.uListen.value += (voice.listening - uniforms.uListen.value) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      offQuality();
      removeEventListener("pointermove", onMove);
      removeEventListener("agent:voice", onVoice);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      face?.geometry.dispose();
      dust?.geometry.dispose();
      head?.geometry.dispose();
      (head?.material as THREE.Material | undefined)?.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, model]);

  return <div ref={host} aria-hidden className={className} />;
}
