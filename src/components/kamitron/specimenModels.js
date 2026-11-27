import * as THREE from 'three';

// Procedural concept models migrated from Kamitron. Each call owns its geometry and animation state.
export function buildSpecimen(arch, color) {
function mats(accent){
  const a=new THREE.Color(accent);
  return{
    glass:new THREE.MeshPhysicalMaterial({color:0xe8fff4,transparent:true,opacity:.24,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.05,side:THREE.DoubleSide,depthWrite:false}),
    white:new THREE.MeshStandardMaterial({color:0xf4f6f5,roughness:.35,metalness:.1}),
    black:new THREE.MeshStandardMaterial({color:0x181d1b,roughness:.4,metalness:.5}),
    steel:new THREE.MeshStandardMaterial({color:0x8f979c,roughness:.3,metalness:.85}),
    glow:new THREE.MeshStandardMaterial({color:a,emissive:a,emissiveIntensity:1.4,roughness:.3}),
    glowSoft:new THREE.MeshStandardMaterial({color:a,emissive:a,emissiveIntensity:.6,roughness:.4}),
    wire:new THREE.MeshBasicMaterial({color:a,wireframe:true,transparent:true,opacity:.8}),
    film:new THREE.MeshPhysicalMaterial({color:a,transparent:true,opacity:.35,roughness:.1,side:THREE.DoubleSide,depthWrite:false})
  };
}
const parts=[];      // {obj, base:Vector3, dir:Vector3}
let waves=[];        // animated segments
let flaps=[];        // animated wings
function part(obj,parent,dir){parent.add(obj);parts.push({obj,base:obj.position.clone(),dir:new THREE.Vector3(...dir)});return obj;}
function mesh(g,m){return new THREE.Mesh(g,m);}

/* ---------- shared pieces ---------- */
function hub(M,g,r){
  const h=new THREE.Group();
  h.add(mesh(new THREE.CylinderGeometry(r,r*.9,.32,40),M.black));
  for(let i=0;i<48;i++){const t=mesh(new THREE.BoxGeometry(.05,.12,.06),M.steel);const a=i/48*Math.PI*2;t.position.set(Math.cos(a)*r*1.02,0,Math.sin(a)*r*1.02);t.rotation.y=-a;h.add(t);}
  const ring=mesh(new THREE.TorusGeometry(r*.75,.025,8,48),M.glowSoft);ring.rotation.x=Math.PI/2;ring.position.y=.17;h.add(ring);
  return part(h,g,[0,0,0]);
}
function core(M,g,y,s){
  const c=new THREE.Group();c.position.y=y;
  c.add(mesh(new THREE.IcosahedronGeometry(.32*s,1),M.wire));
  c.add(mesh(new THREE.IcosahedronGeometry(.16*s,0),M.glow));
  for(let i=0;i<3;i++){const gear=mesh(new THREE.TorusGeometry(.2*s+i*.06*s,.018,6,24),M.steel);gear.rotation.set(Math.random()*3,Math.random()*3,0);c.add(gear);}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(Math.cos(a)*.3*s,.25*s,Math.sin(a)*.3*s),new THREE.Vector3(Math.cos(a)*.5*s,-.1*s,Math.sin(a)*.5*s)]);c.add(mesh(new THREE.TubeGeometry(curve,16,.008,5),M.glow));}
  waves.push({spin:c});
  return part(c,g,[0,.9,0]);
}
function eye(M,g,pos,tilt,size){
  const e=new THREE.Group();e.position.copy(pos);e.rotation.x=tilt;
  e.add(mesh(new THREE.TorusGeometry(.3*size,.04*size,12,48),M.glow));
  e.add(mesh(new THREE.TorusGeometry(.24*size,.02*size,8,48),M.black));
  for(let i=0;i<10;i++){const b=mesh(new THREE.BoxGeometry(.2*size,.06*size,.015),M.steel);const a=i/10*Math.PI*2;b.position.set(Math.cos(a)*.12*size,Math.sin(a)*.12*size,0);b.rotation.z=a+.9;e.add(b);}
  const pupil=mesh(new THREE.SphereGeometry(.05*size,16,12),M.glow);e.add(pupil);
  return part(e,g,[0,.3,1.1]);
}
function arm(M,g,angle,y,r,segs,curl,len){
  const root=new THREE.Group();root.position.set(Math.cos(angle)*r,y,Math.sin(angle)*r);root.rotation.y=-angle;
  let parent=root;
  for(let i=0;i<segs;i++){
    const seg=new THREE.Group();
    if(i>0)seg.position.x=len;
    const rad=.11*(1-i/segs*.7);
    const body=mesh(new THREE.CylinderGeometry(rad*.92,rad,len*.9,14),i%2?M.black:M.white);
    body.rotation.z=Math.PI/2;body.position.x=len/2;seg.add(body);
    [-1,1].forEach(s=>{const sw=mesh(new THREE.TorusGeometry(rad*.32,rad*.12,6,12),M.glowSoft);sw.position.set(len/2,-rad*.95,s*rad*.45);sw.rotation.x=Math.PI/2;seg.add(sw);});
    parent.add(seg);waves.push({seg,i,phase:angle,curl});parent=seg;
  }
  const tip=mesh(new THREE.TorusKnotGeometry(.05,.015,40,6,2,3),M.glow);tip.position.x=len;parent.add(tip);
  return part(root,g,[Math.cos(angle)*.9,-.25,Math.sin(angle)*.9]);
}
function hoses(M,g,n,from,to){
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.3;const c=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.cos(a)*from[0],from[1],Math.sin(a)*from[0]),new THREE.Vector3(Math.cos(a)*(from[0]+.35),(from[1]+to[1])/2,Math.sin(a)*(from[0]+.35)),new THREE.Vector3(Math.cos(a)*to[0],to[1],Math.sin(a)*to[0])]);part(mesh(new THREE.TubeGeometry(c,24,.03,8),i%2?M.black:M.steel),g,[Math.cos(a)*.3,-.2,Math.sin(a)*.3]);}
}
function wingPanel(M,g,side,y,z,w,h){
  const piv=new THREE.Group();piv.position.set(side*.3,y,z);
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(w*.3,h*.6,w*.8,h*.5,w,0);shape.bezierCurveTo(w*.7,-h*.4,w*.3,-h*.3,0,0);
  const wm=mesh(new THREE.ShapeGeometry(shape,24),M.film);wm.rotation.x=-Math.PI/2;if(side<0)wm.scale.x=-1;piv.add(wm);
  const spar=mesh(new THREE.CylinderGeometry(.015,.015,w,6),M.black);spar.rotation.z=Math.PI/2;spar.position.x=side*w/2;piv.add(spar);
  flaps.push({piv,side});
  return part(piv,g,[side*.9,.3,0]);
}

/* ---------- archetypes ---------- */
function buildOcto(M,g){
  hub(M,g,.55);
  part(mesh(new THREE.SphereGeometry(.9,48,32,0,Math.PI*2,0,Math.PI*.6),M.glass),g,[0,1.2,0]).position.y=.12;
  core(M,g,.55,1);
  eye(M,g,new THREE.Vector3(0,.5,.82),-.35,1);
  for(let i=0;i<8;i++)arm(M,g,i/8*Math.PI*2+Math.PI/8,-.1,.5,10,.2,.26);
  hoses(M,g,4,[.45,-.15],[.75,.25]);
}
function buildPod(M,g){
  hub(M,g,.75);
  const shell=mesh(new THREE.CylinderGeometry(.7,.7,1.3,48,1,true),M.glass);shell.position.y=.82;part(shell,g,[0,1,0]);
  const lid=mesh(new THREE.SphereGeometry(.7,40,16,0,Math.PI*2,0,Math.PI/2),M.glass);lid.position.y=1.47;part(lid,g,[0,1.6,0]);
  core(M,g,.85,1.3);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const cap=new THREE.Group();cap.position.set(Math.cos(a)*.78,.6+(i%2)*.4,Math.sin(a)*.78);cap.rotation.y=-a;
    const port=mesh(new THREE.CylinderGeometry(.09,.09,.14,16),M.black);port.rotation.z=Math.PI/2;cap.add(port);
    const shroom=mesh(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,0,Math.PI/2),M.white);shroom.scale.set(1,.45,1.2);shroom.position.x=.14;shroom.rotation.z=-Math.PI/2;cap.add(shroom);
    const gills=mesh(new THREE.CircleGeometry(.19,24),M.glowSoft);gills.position.x=.135;gills.rotation.y=-Math.PI/2;cap.add(gills);
    part(cap,g,[Math.cos(a)*.8,.1,Math.sin(a)*.8]);}
  for(let i=0;i<3;i++)arm(M,g,i/3*Math.PI*2,-.1,.65,5,.5,.22);
  hoses(M,g,3,[.6,-.1],[.72,1.3]);
}
function buildWing(M,g){
  const body=new THREE.Group();
  const shell=mesh(new THREE.CapsuleGeometry(.32,1.1,12,24),M.glass);shell.rotation.x=Math.PI/2;body.add(shell);
  for(let i=0;i<7;i++){const ring=mesh(new THREE.TorusGeometry(.3,.035,8,32),i%2?M.black:M.white);ring.position.z=-.6+i*.2;body.add(ring);}
  part(body,g,[0,0,0]);
  core(M,g,0,.8);
  eye(M,g,new THREE.Vector3(0,.05,.9),0,.85);
  wingPanel(M,g,1,.2,.25,1.7,.6);wingPanel(M,g,-1,.2,.25,1.7,.6);
  wingPanel(M,g,1,.15,-.35,1.4,.5);wingPanel(M,g,-1,.15,-.35,1.4,.5);
  const tail=new THREE.Group();tail.position.z=-.7;let p=tail;
  for(let i=0;i<6;i++){const s=new THREE.Group();if(i)s.position.z=-.18;const m=mesh(new THREE.CylinderGeometry(.11-i*.012,.12-i*.012,.16,12),i%2?M.black:M.white);m.rotation.x=Math.PI/2;m.position.z=-.08;s.add(m);p.add(s);waves.push({tail:s,i});p=s;}
  part(tail,g,[0,0,-.9]);
  for(let i=0;i<3;i++){const leg=new THREE.Group();leg.position.set(0,-.3,.3-i*.3);[-1,1].forEach(sd=>{const l=mesh(new THREE.CylinderGeometry(.02,.02,.45,6),M.black);l.position.set(sd*.25,-.15,0);l.rotation.z=sd*.6;leg.add(l);});part(leg,g,[0,-.6,0]);}
}
function buildTower(M,g){
  hub(M,g,.7);
  const col=mesh(new THREE.CylinderGeometry(.4,.5,2,40,1,true),M.glass);col.position.y=1.1;part(col,g,[0,.3,0]);
  for(let i=0;i<5;i++){const r=mesh(new THREE.TorusGeometry(.62-i*.05,.06,12,48),i%2?M.black:M.white);r.rotation.x=Math.PI/2;r.position.y=.35+i*.42;part(r,g,[0,.25*i,0]).userData.ring=i;waves.push({ring:r,i});}
  const c=core(M,g,1.1,1.1);
  const crown=new THREE.Group();crown.position.y=2.2;
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const leaf=mesh(new THREE.ConeGeometry(.12,.55,4),M.glowSoft);leaf.position.set(Math.cos(a)*.3,.15,Math.sin(a)*.3);leaf.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6);crown.add(leaf);}
  crown.add(mesh(new THREE.SphereGeometry(.14,20,16),M.glow));
  part(crown,g,[0,1.3,0]);
  for(let i=0;i<4;i++)arm(M,g,i/4*Math.PI*2+Math.PI/4,-.12,.62,5,.55,.24);
  hoses(M,g,4,[.6,-.1],[.45,1.9]);
}
function buildOrb(M,g){
  const shell=mesh(new THREE.SphereGeometry(.95,48,32),M.glass);part(shell,g,[0,0,0]);
  core(M,g,0,1.4);
  eye(M,g,new THREE.Vector3(0,.1,.97),-.1,1.3);
  for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(1.25+i*.18,.03,8,80),i===1?M.glowSoft:M.steel);ring.rotation.set(Math.PI/2+i*.5,i*.7,0);part(ring,g,[0,0,0]);waves.push({orbit:ring,i});}
  const base=new THREE.Group();base.position.y=-1.15;
  base.add(mesh(new THREE.CylinderGeometry(.3,.6,.3,32),M.black));
  for(let i=0;i<3;i++)arm(M,base,i/3*Math.PI*2,0,.45,4,.7,.2);
  part(base,g,[0,-.9,0]);
}
const BUILDERS={octo:buildOcto,pod:buildPod,wing:buildWing,tower:buildTower,orb:buildOrb};


const group=new THREE.Group();
const materials=mats(color);
BUILDERS[arch](materials,group);
return { group, materials:Object.values(materials), parts, waves, flaps };
}
