import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w7l13',
  number: 13,
  week: 7,
  track: 'systems',
  title: 'Robot Software, ROS 2 and the Industrial IoT',
  subtitle: 'Middleware, message contracts and the latency budget',
  duration: 75,
  difficulty: 'journeyman',
  xp: 195,
  hook: 'A robot is a distributed system with a deadline: miss the budget and the middleware is the failure.',
  objectives: [
    'Draw a ROS 2 graph of nodes, topics, services, actions and parameters, and choose a QoS profile for each link.',
    'Compute an end-to-end latency budget and a camera bandwidth estimate, then say what must stay on the edge.',
    'Pick a comms protocol for a robot link from range, data rate, power and topology.',
    'Design an OTA rollout with A/B partitions, health gates and automatic rollback.',
    'Name the trust boundary in a robot stack and the control that holds it: SROS2, TLS, signed firmware, SBOM.',
  ],
  blocks: [
    { kind: 'prose', heading: 'DDS is the contract, ROS 2 is the API',
      body: 'ROS 2 has no master. Nodes discover each other over **DDS** (default Fast DDS or Cyclone DDS) and exchange typed messages peer to peer. A **node** publishes and subscribes on named **topics**, calls **services** for short request/response work, and runs long goals through **actions** that stream feedback and accept cancellation. **Parameters** are typed node settings; a **lifecycle node** moves through configure, activate, deactivate, cleanup and shutdown so a controller claims hardware only after configuration succeeds. **Executors** schedule callbacks: single-threaded serialises them, multi-threaded parallelises them and demands thread-safe callbacks. **Composition** loads several nodes into one process to cut serialisation and copy cost.\n\n' +
        'QoS is where middleware meets physics. **Reliability** (reliable or best-effort), **durability** (volatile or transient-local), **history** (keep last N or keep all), **depth**, **deadline**, **liveliness** and **lease duration** decide what happens when a link stutters. A 30 Hz camera wants best-effort, depth 1, deadline 33 ms; a wheel-odometry topic that must not lose ticks wants reliable, depth 10. Mismatched QoS connects the topics and silently delivers nothing. Inspect it with the **ros2 CLI**: `ros2 topic hz`, `ros2 topic delay`, `ros2 node info`, `ros2 param get`, `ros2 bag record`.' },
    { kind: 'formula', title: 'End-to-end latency budget',
      tex: 'T_{e2e} = t_{sense} + t_{link} + t_{perceive} + t_{dds} + t_{plan} + t_{ctrl} + t_{act} \\le \\frac{1}{f_{loop}}',
      explain: 'Latency is a sum and the slowest stage sets the loop rate. At 30 Hz the period is 33.3 ms; 6 + 3 + 14 + 2 + 4 + 1 + 2 = 32 ms, leaving 1.3 ms, about 4% margin, so one extra 20 ms detector breaks the loop.' },
    { kind: 'chart', title: 'Latency budget for a 30 Hz vision loop',
      caption: 'Measured stage costs on a Jetson Orin with a GigE camera; sum 32 ms against a 33.3 ms period budget.',
      chartType: 'bar', xLabel: 'Pipeline stage', yLabel: 'Latency (ms)',
      x: ['Exposure', 'Link', 'Inference', 'DDS', 'Planning', 'Control', 'Actuation'],
      series: [{ key: 'lat', label: 'Stage latency', color: '#f59e0b', data: [6, 3, 14, 2, 4, 1, 2] }] },
    { kind: 'prose', heading: 'The stack you actually install',
      body: '**ros2_control** splits hardware interfaces (position, velocity, effort) from controllers and runs a real-time update loop; **nav2** supplies behaviour trees, costmaps, planners and controllers for mobile bases; **moveit2** does planning, collision checking and inverse kinematics for arms. **micro-ROS** runs an rclc client on a Cortex-M MCU and bridges to DDS through an agent over serial or UDP, so an STM32F4 or ESP32 publishes a topic without Linux. **ament** is the build system and **colcon** walks a workspace of packages. Robot description lives in **URDF** (ROS-native, one fixed tree) or **SDF** (simulation-native, worlds and many models), with **xacro** macros generating both from parameters. **TF2** owns the timestamped transform tree `map` to `odom` to `base_link` to sensors; a duplicate parent, a cycle or a stale transform is the most common cause of a robot that looks right in rviz and drives wrong.' },
    { kind: 'table', title: 'Comms protocols for a robot fleet',
      caption: 'MQTT: QoS 0 at most once, 1 at least once, 2 exactly once; a retained message holds the last value for late subscribers; the Last Will fires when the broker misses the keepalive.',
      columns: ['Protocol', 'Range', 'Data rate', 'Power', 'Topology'],
      rows: [
        ['MQTT over TCP', 'any IP link: 50 m Wi-Fi, global LTE', '10 kbit/s-100 Mbit/s, link-limited', 'radio-limited; 80 mW Wi-Fi TX', 'broker star, many-to-many'],
        ['CoAP over UDP', 'IP link or 6LoWPAN mesh', '10-100 kbit/s typical', 'mW-class, sleepy nodes', 'client/server plus observe'],
        ['AMQP', 'IP link, plant or cloud', '1-100 Mbit/s', 'mains', 'routed queues, broker'],
        ['HTTP/REST', 'any IP link', 'link-limited, request/response', 'mains or radio-limited', 'star, client polls'],
        ['WebSocket', 'any IP link', 'link-limited, full duplex', 'radio-limited', 'star, server push'],
        ['gRPC over HTTP/2', 'any IP link, strong on LAN', '100 Mbit/s or more', 'mains', 'star, streaming RPC'],
        ['OPC-UA', 'plant LAN', 'Mbit/s; PubSub over TSN to 1 Gbit/s', 'mains', 'client/server plus PubSub'],
        ['LoRaWAN', '2-15 km rural, 1-5 km urban', '0.25-50 kbit/s', '25 mW TX, years on a cell', 'star of stars'],
        ['NB-IoT', '1 km urban, 10 km rural', '20-250 kbit/s', '23 dBm TX, years on a cell', 'cellular star'],
        ['Zigbee/Thread/Matter', '10-100 m per hop', '250 kbit/s at 2.4 GHz', '1-100 mW, sleepy routers', 'mesh'],
        ['BLE', '10-100 m', '1-2 Mbit/s PHY in BLE 5', 'about 10 mW', 'piconet star, optional mesh'],
        ['5G NR', '100 m-10 km', '100 Mbit/s-1 Gbit/s downlink', 'about 1 W TX', 'cellular star, URLLC slices'],
        ['TSN 802.1Qbv', '100 m copper segment', '100 Mbit/s-1 Gbit/s', 'mains, wired', 'switched star or ring'],
      ] },
    { kind: 'formula', title: 'Camera stream bandwidth',
      tex: 'B = \\frac{W \\cdot H \\cdot C \\cdot D \\cdot f}{R_c}',
      explain: 'For 1920 x 1080 at 30 fps and 24 bit colour, W H C D f = 1,492,992,000 bit/s, near 1.49 Gbit/s raw. H.264 at 100:1 gives 15 Mbit/s; MJPEG at 10:1 gives 149 Mbit/s. A 5 GHz Wi-Fi link sustaining 300 Mbit/s carries the compressed stream and little else.' },
    { kind: 'code', title: 'Minimal ROS 2 publisher/subscriber node', language: 'python',
      note: 'rclpy node that subscribes best-effort to a 30 Hz LaserScan and republishes cleaned ranges; install with ament_python and run with ros2 run.',
      code: `import rclpy
from rclpy.node import Node
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import LaserScan
class CleanScan(Node):
    def __init__(self):
        super().__init__('clean_scan')
        self.pub = self.create_publisher(LaserScan, '/scan_clean', 1)
        self.create_subscription(LaserScan, '/scan', self.on_scan, qos_profile_sensor_data)
    def on_scan(self, msg):
        msg.ranges = [r if r == r else float('inf') for r in msg.ranges]
        self.pub.publish(msg)
rclpy.init(); rclpy.spin(CleanScan()); rclpy.shutdown()` },
    { kind: 'code', title: 'ESP32 MQTT telemetry with Last Will', language: 'cpp',
      note: 'QoS 1 publish, QoS 1 retained Last Will on fleet/amr-07/status: if the 5 s keepalive lapses, the broker marks the robot offline for every subscriber.',
      code: `#include <WiFi.h>
#include <PubSubClient.h>
WiFiClient net; PubSubClient mqtt(net);
void setup() {
  WiFi.begin("ssid", "pass");
  mqtt.setServer("broker.local", 8883);      // TLS port
  mqtt.setKeepAlive(5);
}
void loop() {
  if (!mqtt.connected())
    mqtt.connect("amr-07", nullptr, nullptr, "fleet/amr-07/status", 1, true, "offline");
  mqtt.publish("fleet/amr-07/telemetry", 1, false, "{\\"soc\\":78,\\"odo\\":1043}");
  delay(1000);
}` },
    { kind: 'prose', heading: 'Twins, tiers and trust',
      body: 'Simulators trade fidelity for speed. **Gazebo** runs full physics with ROS 2 plugins and sensor noise; **Isaac Sim** gives GPU-parallel photoreal scenes and synthetic labels; **MuJoCo** is the contact-dynamics reference for legged and manipulation RL; **Webots** ships curated models and cross-platform binaries; **PyBullet** trades accuracy for a fast Python loop. A **digital twin** is not a simulator: it is a live model fed by telemetry. Synchronisation is the hard part, because the twin trails the robot by the telemetry period plus network time, so it is safe for state, trends and what-if and unsafe as a 1 kHz control input. Shared time makes this work: NTP holds 1-10 ms, **PTP** (IEEE 1588) holds sub-microsecond on TSN switches, and simulators publish `/clock` so `use_sim_time` replays a bag deterministically.\n\n' +
        'Offloading follows latency and bandwidth. Keep safety, control and anything inside a 20 ms deadline on the edge (a Jetson Orin gives about 40 INT8 TOPS at 15-25 W); offload map building, fleet planning, model training and archival logs. The arithmetic is brutal: a 15 Mbit/s video stream is 6.75 GB/h per robot, so 200 robots generate 1.35 TB/h. Compress, downsample or store-and-forward on events.\n\n' +
        'Reliability is designed in, not patched in. A hardware watchdog must be kicked by the control loop itself; a 1 Hz heartbeat with DDS liveliness and a 3 s lease detects a frozen peer; graceful degradation drops 30 Hz vision-nav to 5 Hz lidar-nav to a safe stop; failover hands control to a warm standby within one control period.' },
    { kind: 'callout', tone: 'warning', title: 'A spoofed topic is a physical fault',
      body: 'Threat-model the DDS graph before you field it: an unauthenticated node can publish `/cmd_vel`, replay a recorded command or join the fleet broker. **SROS2** enforces DDS Security with authentication, access control and per-topic encryption; MQTT, gRPC and OPC-UA links need TLS with certificate pinning and replay protection; firmware must be signed and accepted only under secure boot; zero trust means every robot-to-cloud call is authenticated and least-privileged. An **SBOM** in SPDX or CycloneDX is what lets you answer which robots run a vulnerable library in minutes, not weeks.' },
    { kind: 'steps', title: 'From commit to fleet: staged rollout',
      steps: [
        { title: 'Build and unit test', detail: 'colcon build and colcon test on every push; lint the message and QoS definitions, since an interface change is a breaking API change.' },
        { title: 'Hardware-in-the-loop', detail: 'Run the same binary against a recorded bag and a real controller on the bench; assert control-cycle jitter under 1 ms and that the watchdog trips on a starved loop.' },
        { title: 'Simulated fleet soak', detail: 'Eight hours in Gazebo with injected faults: 5% packet loss, a broker restart and one node killed mid-mission.' },
        { title: 'Canary on two robots', detail: 'Ship a signed image to A/B slot B; the bootloader enters it only after health checks pass, and a watchdog reverts to slot A when the heartbeat fails within 60 s.' },
        { title: 'Staged rollout with gates', detail: '5% then 25% then 100% over 72 h. Halt and roll back on crash rate or p99 latency regression; keep per-node logs with a trace ID, metrics (jitter, queue depth, state of charge) and traces across the DDS boundary.' },
      ] },
    { kind: 'lab', labId: 'swarm', title: 'Fleet coordination under a latency budget',
      brief: 'Run a swarm of agents over a simulated robot network and find the latency at which coordination stops working.',
      tasks: ['Run 8 agents with 50 ms of link latency, then 150 ms, and record when formation error exceeds 0.5 m.', 'Drop 20% of messages and compare best-effort with a reliable depth-4 policy on convergence time.', 'Add a spoofed agent reporting a false position and design a check that excludes it within 2 s.'] },
  ],
  keyTerms: [
    { term: 'DDS', definition: 'Data Distribution Service: the peer-to-peer pub/sub middleware under ROS 2; automatic discovery, no master.' },
    { term: 'QoS profile', definition: 'Per-topic contract of reliability, durability, history, depth, deadline, liveliness and lease duration.' },
    { term: 'Lifecycle node', definition: 'Managed node with configure, activate, deactivate, cleanup and shutdown transitions and error handling.' },
    { term: 'TF2', definition: 'Timestamped transform tree (map, odom, base_link, sensors) that expresses any frame in any other at a given time.' },
    { term: 'micro-ROS', definition: 'rclc client on a microcontroller, bridged to DDS by a micro-ROS agent over serial or UDP.' },
    { term: 'Digital twin', definition: 'Live model synchronised to a physical robot by telemetry; good for state and what-if, not for hard real-time control.' },
    { term: 'OPC-UA', definition: 'Industrial client/server and PubSub protocol with typed information models; PubSub can ride TSN.' },
    { term: 'TSN', definition: 'IEEE 802.1 time-sensitive networking: scheduled traffic and PTP time for bounded latency on Ethernet.' },
  ],
  quiz: [
    { id: 'w7l13q1', question: 'In ROS 2, which layer actually moves bytes between nodes?',
      choices: ['rclcpp only', 'The ROS 1 master', 'The TF2 buffer', 'DDS middleware'], answer: 3, level: 'recall',
      explanation: 'ROS 2 dropped the master; nodes discover peers and exchange messages through DDS.' },
    { id: 'w7l13q2', question: 'A 30 Hz camera topic drops frames on a congested Wi-Fi link. Which QoS change fits the physics?',
      choices: ['RELIABLE with KEEP_ALL history', 'Transient-local durability for every frame', 'Liveliness with a 10 s lease', 'KEEP_LAST depth 1 with BEST_EFFORT'], answer: 3, level: 'understand',
      explanation: 'For a periodic sensor stream only the newest sample matters; reliable keep-all would queue stale frames and add latency.' },
    { id: 'w7l13q3', question: 'Stage costs are exposure 6, link 3, inference 14, DDS 2, planning 4, control 1, actuation 2 ms. What margin remains on a 30 Hz loop?',
      choices: ['4.0 ms', '-6.7 ms', '1.3 ms', '12.0 ms'], answer: 2, level: 'apply',
      explanation: 'The stage sum is 32 ms against a 33.3 ms period, so 1.3 ms or about 4% is left.' },
    { id: 'w7l13q4', question: 'Why is streaming raw camera data from a 200-robot fleet to the cloud impractical?',
      choices: ['Raw 1080p30 is 1.49 Gbit/s per camera, so 200 robots need about 300 Gbit/s of uplink', 'H.264 cannot compress below 100 Mbit/s', 'Cameras cannot publish over TCP', 'Cloud GPUs cannot run inference'], answer: 0, level: 'analyze',
      explanation: 'Raw video is 1.49 Gbit/s per camera; even at 100:1 compression the fleet still needs 1.35 TB/h of uplink, so edge inference is the cheaper design.' },
    { id: 'w7l13q5', question: 'You must ship firmware OTA to 200 robots with guaranteed rollback. Which design does that?',
      choices: ['A/B partitions where the bootloader enters slot B only after health checks pass and a watchdog reverts to slot A', 'Overwrite the single partition after a checksum', 'Push to 100% in one maintenance window', 'Enable SSH and pull the image on boot'], answer: 0, level: 'design',
      explanation: 'Only A/B slots plus a watchdog-gated boot confirmation give an automatic path back to the known-good image.' },
    { id: 'w7l13q6', question: 'An AMR dies mid-mission, yet the dashboard still shows it active 10 minutes later. Which MQTT pair fixes this?',
      choices: ['QoS 2 and retained commands', 'A keepalive with a Last Will on status plus a retained status message', 'AMQP queues and CoAP observe', 'WebSocket ping and gRPC streaming'], answer: 1, level: 'analyze',
      explanation: 'The Last Will fires when the broker misses the keepalive, and retaining the status means every later subscriber sees offline immediately.' },
    { id: 'w7l13q7', question: 'You need a 1 kHz wheel loop on an STM32F4 with ROS 2 visibility. What runs on the MCU?',
      choices: ['The full DDS discovery stack under Linux', 'Nothing; a serial bridge polls registers', 'An rclc client talking to a micro-ROS agent over serial or UDP', 'A Gazebo plugin'], answer: 2, level: 'apply',
      explanation: 'micro-ROS puts a thin rclc client on the MCU and lets the agent translate to DDS on the companion computer.' },
  ],
  flashcards: [
    { front: 'DDS', back: 'Peer-to-peer pub/sub middleware under ROS 2; automatic discovery, no master process.', tag: 'middleware' },
    { front: 'QoS profile', back: 'Reliability, durability, history, depth, deadline, liveliness and lease: the contract of one topic.', tag: 'middleware' },
    { front: 'Lifecycle node', back: 'Managed states configure, activate, deactivate, cleanup, shutdown; hardware is claimed only after configure succeeds.', tag: 'ros2' },
    { front: 'TF2', back: 'Timestamped transform tree that converts any measurement into any frame at a given time.', tag: 'ros2' },
    { front: 'micro-ROS', back: 'rclc on a Cortex-M MCU with a micro-ROS agent bridging serial or UDP to DDS.', tag: 'embedded' },
    { front: 'Digital twin', back: 'Live telemetry-driven model; trails the robot by one telemetry period plus network time.', tag: 'twins' },
    { front: 'MQTT Last Will and retained', back: 'Broker publishes the will when the keepalive lapses; retaining a status message shows it to late subscribers.', tag: 'iot' },
    { front: 'PTP and TSN', back: 'IEEE 1588 holds sub-microsecond clock sync; 802.1Qbv schedules Ethernet traffic for bounded latency.', tag: 'comms' },
    { front: 'A/B OTA', back: 'Two firmware slots, health-gated boot confirmation and watchdog rollback to the known-good slot.', tag: 'fleet' },
  ],
  forgePrompts: [
    'Build a two-node ROS 2 graph split across a Raspberry Pi and an ESP32, then measure end-to-end latency with a GPIO pulse and ros2 topic delay.',
    'Give every device in your home an MQTT Last Will and a retained status topic, log a week, and draw the availability timeline.',
    'Wrap one gearmotor in a digital twin and show where the twin drifts from hardware once the link loses 5% of messages.',
  ],
};
