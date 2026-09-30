import type { ComponentType } from 'react';
import type { LabId } from '@/content/types';
import type { LabProps } from './LabFrame';
import RobotArmLab from './RobotArmLab';
import PidDroneLab from './PidDroneLab';
import SwarmLab from './SwarmLab';
import KalmanLab from './KalmanLab';
import MyceliumLab from './MyceliumLab';
import BlochLab from './BlochLab';
import GearTrainLab from './GearTrainLab';
import EnergyFieldLab from './EnergyFieldLab';
import VisionGridLab from './VisionGridLab';
import GaitLab from './GaitLab';

export interface LabMeta {
  id: LabId;
  name: string;
  glyph: string;
  blurb: string;
  tone: 'gold' | 'myco' | 'psy' | 'sirius';
  track: string;
  threeD: boolean;
  tasks: string[];
  Component: ComponentType<LabProps>;
}

export const LABS: LabMeta[] = [
  {
    id: 'robot-arm',
    name: '6-Axis Kinematics Bench',
    glyph: '⚙',
    blurb:
      'Drive a manipulator in joint space or throw Cartesian targets at a damped-least-squares IK solver and watch manipulability.',
    tone: 'gold',
    track: 'kinematics',
    threeD: true,
    tasks: [
      'Reach a target 2.6 m out with the IK residual under 10 mm',
      'Drive the arm to a pose where manipulability drops below 0.15 and explain why',
      'Send the target outside the reachable workspace and describe the failure mode',
    ],
    Component: RobotArmLab,
  },
  {
    id: 'pid-drone',
    name: 'PID Flight Bench',
    glyph: '🛸',
    blurb: 'Tune Kp, Ki and Kd on a quadrotor chasing waypoints, with saturation, drag and gust disturbance.',
    tone: 'psy',
    track: 'control',
    threeD: true,
    tasks: [
      'Find gains that give under 10% overshoot and settle inside 1.5 s',
      'Remove the integral term and measure the steady-state droop',
      'Survive three consecutive gust disturbances while holding station',
    ],
    Component: PidDroneLab,
  },
  {
    id: 'swarm',
    name: 'Swarm Bench (Boids)',
    glyph: '◈',
    blurb: 'Ninety agents, three steering rules. Find the phase transition where a gas becomes a murmuration.',
    tone: 'psy',
    track: 'autonomy',
    threeD: true,
    tasks: [
      'Achieve an order parameter above 0.75',
      'Make the flock clump by zeroing separation — then explain the failure',
      'Hold a ring formation while the predator mode runs',
    ],
    Component: SwarmLab,
  },
  {
    id: 'kalman',
    name: 'Sensor Fusion Bench',
    glyph: '∿',
    blurb: 'Kalman filter vs dead reckoning and raw GNSS under bias, noise and signal outage.',
    tone: 'sirius',
    track: 'perception',
    threeD: true,
    tasks: [
      'Get Kalman mean error below one third of the raw GNSS error',
      'Trigger a GNSS outage and keep the estimate usable for 5 s',
      'Break the filter by setting process noise far too low — describe the symptom',
    ],
    Component: KalmanLab,
  },
  {
    id: 'mycelium',
    name: 'Living Circuit: Mycelial Network',
    glyph: '🍄',
    blurb: 'Grow a hyphal network with space colonisation, then inject nutrient and measure fungal signalling delays.',
    tone: 'myco',
    track: 'bio-hybrid',
    threeD: true,
    tasks: [
      'Grow a network with more than 200 nodes',
      'Inject at three different tips and record the delay to the electrode',
      'Double the propagation speed and state which physical variable you changed',
    ],
    Component: MyceliumLab,
  },
  {
    id: 'bloch',
    name: 'Bloch Sphere & Qubit Gates',
    glyph: '⚛',
    blurb: 'Apply X, Y, Z, H, S and T to a qubit and see rotations, phases and Born-rule histograms.',
    tone: 'psy',
    track: 'quantum',
    threeD: true,
    tasks: [
      'Prepare |+⟩ with H, then measure 1000 shots and check the 50/50 split',
      'Use Z twice after H and show the state returns unchanged',
      'Rotate to the equator with Ry(90°) and confirm the Bloch vector length is still 1',
    ],
    Component: BlochLab,
  },
  {
    id: 'gear-train',
    name: 'Gear Train & Torque Trade',
    glyph: '⛭',
    blurb: 'Three spur gears, live ratios, meshing losses and reflected inertia.',
    tone: 'gold',
    track: 'actuation',
    threeD: true,
    tasks: [
      'Design a train with an overall reduction above 20:1',
      'Prove the idler stage does not change the ratio',
      'Compute the output torque by hand and match the readout within 5%',
    ],
    Component: GearTrainLab,
  },
  {
    id: 'energy-field',
    name: 'Energy Frontier Bench',
    glyph: '⚡',
    blurb: 'Atmospheric, geothermal, nuclear, solar and kinetic sources compared in honest orders of magnitude.',
    tone: 'sirius',
    track: 'energy',
    threeD: true,
    tasks: [
      'Find a configuration where atmospheric harvesting runs a LoRa sensor node',
      'Match a geothermal TEG array to a 5 W servo load',
      'Explain in one sentence why the MMRTG row exists in this table',
    ],
    Component: EnergyFieldLab,
  },
  {
    id: 'vision-grid',
    name: 'Perception Bench',
    glyph: '👁',
    blurb: 'Ground truth vs sensor view vs occupancy grid, with beam width, noise, dropout and odometry drift.',
    tone: 'sirius',
    track: 'perception',
    threeD: false,
    tasks: [
      'Map the room to over 80% known cells with under 10% map error',
      'Show ultrasonic-style wide beams smearing the map, then narrow it',
      'Turn on odometry drift and describe how the map degrades',
    ],
    Component: VisionGridLab,
  },
  {
    id: 'gait',
    name: 'Locomotion Bench',
    glyph: '🦿',
    blurb: 'Walk, trot, pace and bound with real IK legs, ZMP tracking and duty-factor stability analysis.',
    tone: 'myco',
    track: 'dynamics',
    threeD: false,
    tasks: [
      'Keep the ZMP inside the support polygon across a full walk cycle',
      'Find the duty factor where trot becomes unstable at your chosen speed',
      'Increase stride until the Froude number exceeds 0.5 and note the effect',
    ],
    Component: GaitLab,
  },
];

export const LAB_MAP: Record<string, LabMeta> = Object.fromEntries(LABS.map((l) => [l.id, l]));

export function LabRenderer({ labId, tasks }: { labId: LabId; tasks?: string[] }) {
  const meta = LAB_MAP[labId];
  if (!meta) return null;
  const C = meta.Component;
  return <C tasks={tasks && tasks.length ? tasks : meta.tasks} />;
}
