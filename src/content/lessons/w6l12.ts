import type { Lesson } from '../types';

export const lesson: Lesson = {
  id: 'w6l12',
  number: 12,
  week: 6,
  track: 'ai',
  difficulty: 'master',
  title: 'Autonomy, Planning and Learning',
  subtitle: 'Search, optimise, behave — and know when to trust a learned policy',
  duration: 80,
  xp: 215,
  hook: 'A planner that finds a path is easy. A planner that finds a path the robot can physically follow, quickly enough, while a human walks past, is the actual problem.',
  objectives: [
    'Choose a planner from the structure of the problem, not from fashion.',
    'Formulate a control problem as an MPC and state its computational cost honestly.',
    'Design a behaviour architecture that degrades safely.',
    'Judge when reinforcement learning is the right tool and when it is a liability.',
  ],
  blocks: [
    {
      kind: 'prose',
      heading: 'Planning is a search over a graph you chose',
      body:
        'Every planner is doing search over some graph, and the engineering decision is which graph. Discretise the workspace into cells and you get a grid, where **A\\*** with an admissible heuristic is optimal and fast enough for a warehouse robot. Discretise the configuration space of a 7-DOF arm into a grid and you get a combinatorial explosion, so you sample instead with a probabilistic roadmap.\n\n' +
        'Three families, three failure modes:\n\n' +
        '- **Graph search** (Dijkstra, A\\*, D\\* Lite) is complete and optimal with the right heuristic, but the graph must be built. Cost grows with resolution.\n' +
        '- **Sampling** (RRT, RRT\\*, PRM) handles high dimensions and works with a collision checker as a black box, but produces jerky paths that must be shortcut and smoothed, and has no guarantee of optimality unless you use the asymptotically optimal variants and wait.\n' +
        '- **Trajectory optimisation** (CHOMP, TrajOpt, STOMP) turns planning into a continuous optimisation with a cost that includes smoothness and obstacle penalty, giving natural motion at the price of local minima and sensitivity to initialisation.\n\n' +
        'Real systems chain them: a global search for the route, a sampling planner or optimiser for the local manoeuvre, and a reactive layer that can veto both when a human steps into the path.',
    },
    {
      kind: 'formula',
      title: 'A-star, MPC and the Bellman equation',
      tex: 'f(n) = g(n) + h(n), \\qquad \\min_{u_{0:H-1}} \\sum_{k=0}^{H-1} \\|x_k - x_k^{ref}\\|_Q^2 + \\|u_k\\|_R^2 \\;\\; \\text{s.t.}\\; x_{k+1} = f(x_k,u_k),\\; u_k \\in \\mathcal{U}',
      explain:
        'A* balances cost so far against an estimate of remaining cost. MPC solves a finite-horizon constrained optimisation at every step and applies only the first input, which is what makes it handle constraints directly — and what makes it computationally expensive.',
    },
    {
      kind: 'chart',
      title: 'Planning time and path quality on a 2-D grid: A-star vs RRT-star',
      xLabel: 'grid size (cells per side)',
      yLabel: 'planning time (ms)',
      chartType: 'line',
      x: [32, 64, 128, 256, 512, 1024],
      series: [
        { key: 'astar', label: 'A* (ms, to first solution)', color: '#f5b301', data: [0.4, 2.1, 9.8, 46, 210, 980] },
        { key: 'rrtstar', label: 'RRT* (ms, 2000 samples)', color: '#c026d3', data: [12, 26, 61, 148, 352, 860] },
      ],
      caption:
        'On a 2-D grid A* wins until the grid gets large, because its cost grows with cells explored. RRT* is nearly resolution independent — which is exactly why it is used in 7-DOF configuration space where a grid is impossible.',
    },
    {
      kind: 'table',
      title: 'Planner selection',
      columns: ['Planner', 'Complete?', 'Optimal?', 'Handles 7-DOF?', 'Path quality', 'Use when'],
      rows: [
        ['Dijkstra', 'Yes', 'Yes', 'No', 'Grid-jagged', 'Costs are non-uniform and you need exactness'],
        ['A*', 'Yes', 'Yes with admissible h', 'No', 'Grid-jagged', 'Default for 2-D and 3-D grids'],
        ['D* Lite', 'Yes', 'Yes', 'No', 'Grid-jagged', 'The map changes while driving'],
        ['RRT', 'Probabilistically', 'No', 'Yes', 'Jerky', 'Fast feasibility in high dimensions'],
        ['RRT* / BIT*', 'Probabilistically', 'Asymptotically', 'Yes', 'Good after smoothing', 'High-DOF when quality matters'],
        ['PRM', 'Probabilistically', 'Asymptotically', 'Yes', 'Good', 'Many queries in a static world'],
        ['CHOMP / TrajOpt', 'No', 'Local optimum', 'Yes', 'Smooth and natural', 'Refining an initial guess'],
        ['MPC', 'N/A (control)', 'Per horizon', 'Yes with reduced model', 'Dynamically feasible', 'Constraints and dynamics matter'],
      ],
      insight:
        'Ask what has to be true for the plan to be executable. A grid path that ignores the robot footprint, kinematics and dynamics is not a plan, it is a suggestion.',
      caption: 'Complete means it finds a path if one exists; optimal means it finds the cheapest one.',
    },
    {
      kind: 'prose',
      heading: 'Behaviour architectures: the part that actually ships',
      body:
        'Planners produce paths. Something has to decide when to plan, when to stop, when to recharge, and when to hand control to a human. That is the behaviour layer.\n\n' +
        '**Finite state machines** are transparent and easy to verify while the state count is small; they become unmaintainable spaghetti past roughly a dozen states with cross transitions. **Hierarchical FSMs** fix that by nesting. **Behaviour trees** scale better: leaves are conditions or actions, internal nodes are sequence, selector and decorators, and a tick returns success, failure or running. Because a tree is a data structure, it can be edited, visualised, hot-reloaded and unit tested node by node — which is why game AI and most commercial robot fleets use them.\n\n' +
        'Whatever you choose, the safety layer must not be a node in it. Emergency stop, speed limiting near humans, geofencing and watchdog supervision belong **outside and above** the behaviour tree, with the authority to override it. If your safety logic can be ticked into a state where it does not run, it is not safety logic.',
    },
    {
      kind: 'code',
      title: 'A-star on a grid, then a behaviour-tree sketch that uses it',
      language: 'python',
      code: `import heapq

def astar(grid, start, goal):
    """grid[y][x] is True for blocked. 8-connected, octile heuristic."""
    def h(a, b):
        dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
        return (dx + dy) + (2 ** 0.5 - 2) * min(dx, dy)

    open_set = [(h(start, goal), 0.0, start, None)]
    came, gscore = {}, {start: 0.0}
    while open_set:
        _, g, cur, parent = heapq.heappop(open_set)
        if cur in came:
            continue
        came[cur] = parent
        if cur == goal:
            path, node = [], cur
            while node is not None:
                path.append(node)
                node = came[node]
            return path[::-1]
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
            nxt = (cur[0] + dx, cur[1] + dy)
            if not (0 <= nxt[0] < len(grid[0]) and 0 <= nxt[1] < len(grid)):
                continue
            if grid[nxt[1]][nxt[0]]:
                continue
            step = (dx * dx + dy * dy) ** 0.5
            if g + step < gscore.get(nxt, 1e18):
                gscore[nxt] = g + step
                heapq.heappush(open_set, (g + step + h(nxt, goal), g + step, nxt, cur))
    return []            # no path: the caller must handle this, not crash

# Behaviour tree (pseudocode): safety runs OUTSIDE the tree.
#   Selector(
#       Sequence(IsBatteryLow, GoToDock, Charge),
#       Sequence(IsPathClear, FollowPath, Arrive),
#       Sequence(IsBlocked, ReplanLocal, BackOff),     # 3 attempts
#       RequestHumanAssist                              # always succeeds
#   )
`,
      note:
        'The final selector branch is the important one. A tree that can only succeed is a tree that will drive into a wall while reporting success.',
    },
    {
      kind: 'lab',
      labId: 'swarm',
      title: 'Emergence is not a plan',
      brief:
        'Three local rules produce global order with no planner at all. Watch how a small parameter change flips the whole system between regimes.',
      tasks: [
        'Reach an order parameter above 0.75 and record the weights you used',
        'Zero the separation weight and describe the resulting collision behaviour',
        'Explain why a flock can be order-1 while individual trajectories are unpredictable',
      ],
    },
    {
      kind: 'lab',
      labId: 'pid-drone',
      title: 'Constraints are not suggestions',
      brief:
        'The PID loop saturates its acceleration command. That saturation is a real actuator limit, and it is exactly what MPC models explicitly instead of discovering by accident.',
      tasks: [
        'Command a step large enough to saturate the acceleration limit',
        'Set gains high enough to trigger oscillation from saturation alone',
        'Describe how an MPC formulation would represent this same limit',
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Four ways learned policies fail in the real world',
      body:
        '**Reward hacking**: the policy optimises the number you wrote, not the outcome you wanted — a simulated cheetah that gallops on its back because the reward only counted forward velocity. **Distribution shift**: the sensor on the robot is not the sensor in the simulator. **Brittleness under perturbation**: a policy with no recovery behaviour has no idea what to do after a slip. **Unverifiable failure**: without a monitor, a bad action looks exactly like a good one until the crash. Use shielding, runtime monitors and a classical fallback.',
    },
    {
      kind: 'steps',
      title: 'A defensible autonomy stack, bottom to top',
      steps: [
        { title: 'Reactive reflex layer', detail: 'Collision stop, cliff detection, torque limits. Runs on the microcontroller, hard real-time, never disabled.' },
        { title: 'Safety supervisor', detail: 'Speed and separation limits, geofence, watchdog, fault latching with deliberate reset. Above the behaviour layer, not inside it.' },
        { title: 'Behaviour layer', detail: 'Behaviour tree or hierarchical FSM with explicit failure branches and a human-assist leaf.' },
        { title: 'Local planning', detail: 'Sampling planner or MPC in a rolling window, respecting kinematics and dynamics.' },
        { title: 'Global planning', detail: 'A* or roadmap on a maintained map, replanned on change, with a cost that includes risk not just distance.' },
        { title: 'Perception and estimation', detail: 'Fused state with uncertainty, feeding occupancy and object tracks into planning.' },
        { title: 'Learning layer', detail: 'Optional, bounded, always wrapped: trained policies sit inside a monitored envelope with a classical fallback.' },
      ],
    },
  ],
  keyTerms: [
    { term: 'Admissible heuristic', definition: 'An estimate that never overestimates true remaining cost, which is what makes A* optimal.' },
    { term: 'Configuration space', definition: 'The space of all joint values; obstacles in C-space are the robot shapes that collide, not the obstacles themselves.' },
    { term: 'RRT*', definition: 'An asymptotically optimal sampling planner that rewires the tree to improve path cost as samples accumulate.' },
    { term: 'Model predictive control', definition: 'Repeatedly solving a finite-horizon constrained optimisation and applying only the first control input.' },
    { term: 'Behaviour tree', definition: 'A ticked tree of sequence, selector and decorator nodes returning success, failure or running; hot-reloadable and unit testable.' },
    { term: 'POMDP', definition: 'A decision process over beliefs rather than states, the correct formalism when perception is uncertain.' },
    { term: 'Domain randomisation', definition: 'Training across randomised simulation parameters so the policy transfers to the real world despite the sim2real gap.' },
    { term: 'Control barrier function', definition: 'A certificate used to filter any proposed control input so the system provably stays inside a safe set.' },
  ],
  quiz: [
    {
      id: 'w6l12q1',
      question: 'When is A* guaranteed to return an optimal path?',
      choices: [
        'Always, for any heuristic',
        'When the heuristic never overestimates the true remaining cost',
        'Only on 4-connected grids',
        'Only when all step costs are equal',
      ],
      answer: 1,
      explanation: 'Admissibility guarantees optimality for tree search; consistency (monotonicity) additionally avoids re-expanding nodes in graph search.',
      level: 'recall',
    },
    {
      id: 'w6l12q2',
      question: 'Why is RRT preferred over A* for a 7-DOF manipulator?',
      choices: [
        'It always finds shorter paths',
        'It needs no collision checker',
        'Its cost does not explode with a grid over a 7-dimensional configuration space',
        'It is deterministic',
      ],
      answer: 2,
      explanation: 'A grid over seven dimensions has a prohibitive number of cells. Sampling works directly in the continuous configuration space with a collision checker as a black box.',
      level: 'understand',
    },
    {
      id: 'w6l12q3',
      question: 'MPC applies only the first input of its solution, then re-solves. Why?',
      choices: [
        'To save computation',
        'Because the model is wrong and new measurements improve the next solve — this is the receding-horizon principle',
        'Because actuators cannot accept long sequences',
        'To avoid integral windup',
      ],
      answer: 1,
      explanation: 'Feedback is the point. Re-solving each step turns an open-loop trajectory into a closed-loop policy robust to model error and disturbance.',
      level: 'understand',
    },
    {
      id: 'w6l12q4',
      question: 'A robot with a behaviour tree stops moving but reports no fault. What is the most likely design flaw?',
      choices: [
        'The tree ticks too slowly',
        'A selector returned failure with no fallback branch, so execution silently stopped',
        'The map is stale',
        'The battery is low',
      ],
      answer: 1,
      explanation: 'Behaviour trees need explicit handling of failure at every selector, including a terminal branch such as request-human-assist or fail-safe-hold that always returns running or success.',
      level: 'analyze',
    },
    {
      id: 'w6l12q5',
      question: 'Which is the soundest place for an emergency stop function?',
      choices: [
        'A leaf node in the behaviour tree',
        'A ROS 2 topic published by the planner',
        'A hard-wired or safety-rated circuit outside the general-purpose software stack',
        'A cloud service',
      ],
      answer: 2,
      explanation: 'Safety functions must not depend on the software that could be in any state, including a wedged one. Use a safety-rated chain that removes power or commands a Category 1 stop independently.',
      level: 'design',
    },
    {
      id: 'w6l12q6',
      question: 'A policy trained in simulation performs well there and poorly on the robot. Which intervention is most directly aimed at this?',
      choices: [
        'Increasing the learning rate',
        'Domain randomisation over sensor noise, friction, mass and latency',
        'Adding more layers',
        'Training longer in the same simulator',
      ],
      answer: 1,
      explanation: 'The sim2real gap is largely a distribution mismatch. Randomising the parameters that differ in reality forces the policy to be robust rather than memorising one dynamics model.',
      level: 'apply',
    },
    {
      id: 'w6l12q7',
      question: 'You must deploy a learned grasping policy in a warehouse with human workers. Which combination is defensible?',
      choices: [
        'Policy only, trained until success rate is high',
        'Policy wrapped in a runtime monitor with force limits, a shielded action set, a classical fallback and a logged failure path',
        'Policy plus a faster GPU',
        'Classical only, because learning is never safe',
      ],
      answer: 1,
      explanation: 'Learning is acceptable when it is bounded. Monitors detect out-of-distribution states, shielding filters unsafe actions, and the fallback guarantees a defined behaviour. The alternatives are either unsafe or needlessly conservative.',
      level: 'design',
    },
  ],
  flashcards: [
    { front: 'Admissible heuristic', back: 'Never overestimates true remaining cost. Necessary for A* optimality; consistency also prevents node re-expansion.', tag: 'planning' },
    { front: 'Configuration space', back: 'Space of robot joint values. Obstacles are the configurations where the robot body collides, so C-space obstacles differ from workspace obstacles.', tag: 'planning' },
    { front: 'RRT* versus RRT', back: 'RRT* rewires the tree to reduce path cost as samples grow, giving asymptotic optimality; plain RRT only guarantees feasibility.', tag: 'planning' },
    { front: 'Receding horizon', back: 'MPC solves a finite horizon, applies only the first input, then re-solves with fresh measurements. Feedback replaces perfect prediction.', tag: 'control' },
    { front: 'Behaviour tree tick', back: 'Each node returns success, failure or running. Selectors try children until one succeeds; sequences require all to succeed.', tag: 'architecture' },
    { front: 'Why keep safety outside the behaviour tree?', back: 'Because the tree can be in any state; safety must be able to override it unconditionally from above.', tag: 'safety' },
    { front: 'POMDP', back: 'Planning over beliefs instead of states. The correct formalism when perception is uncertain, and why real robots maintain probabilistic maps.', tag: 'planning' },
    { front: 'Reward hacking', back: 'The policy maximises the literal reward signal rather than the intended outcome. Fix by shaping from measurable outcomes and testing for degenerate strategies.', tag: 'learning' },
    { front: 'Control barrier function', back: 'A safety certificate used as a filter: any proposed input is projected to the nearest input that keeps the system inside the safe set.', tag: 'safety' },
  ],
  forgePrompts: [
    'Write a 7-DOF pick-and-place stack where the mycelium gripper has a soft limit expressed as a control barrier function.',
    'Benchmark A* against RRT* on a mapped greenhouse floor plan and publish the planning-time curves with your own robot footprint.',
    'Design a behaviour tree for a solar-powered field robot whose lowest-priority leaf is always conserve-energy-and-await-human, and prove it cannot deadlock.',
  ],
};
