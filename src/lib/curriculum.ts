// Static knowledge base — loaded from knowledge-base/ directory
// These are embedded at build time to avoid runtime file reads

export interface Formula {
  name: string
  formula: string
  unit: string
}

export interface Chapter {
  id: string
  part: string
  number: number
  title: string
  sadiku_pages: string
  boylestad_chapters: string | null
  topics: string[]
  key_formulas: Formula[]
  simulator_demos: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Part {
  id: string
  title: string
  chapters: string[]
}

export interface Curriculum {
  course: string
  level: string
  description: string
  parts: Part[]
  chapters: Chapter[]
}

// Inline curriculum data (extracted from curriculum.json)
export const curriculum: Curriculum = {
  course: 'Basic Electrical Engineering (BEE)',
  level: 'University — First Year',
  description: 'A comprehensive university-level BEE course covering DC circuits, AC circuits, and advanced analysis. Based on Sadiku 5th Ed. & Boylestad Introductory Circuit Analysis.',
  parts: [
    { id: 'part1', title: 'DC Circuits', chapters: ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8'] },
    { id: 'part2', title: 'AC Circuits', chapters: ['ch9','ch10','ch11','ch12','ch13','ch14'] },
    { id: 'part3', title: 'Advanced Circuit Analysis', chapters: ['ch15','ch16','ch17','ch18','ch19'] },
  ],
  chapters: [
    {
      id: 'ch1', part: 'part1', number: 1, title: 'Basic Concepts',
      sadiku_pages: '3–27', boylestad_chapters: '1,2', difficulty: 'beginner',
      topics: ['Introduction to Electric Circuits','Systems of Units (SI)','Charge and Current','Voltage','Power and Energy','Circuit Elements (Active vs Passive)','Applications: TV Picture Tube, Electricity Bills','Problem Solving Methodology'],
      key_formulas: [
        { name: 'Current', formula: 'i = dq/dt', unit: 'Amperes (A)' },
        { name: 'Voltage', formula: 'v = dw/dq', unit: 'Volts (V)' },
        { name: 'Power', formula: 'p = dw/dt = v·i', unit: 'Watts (W)' },
        { name: 'Energy', formula: 'w = ∫p dt', unit: 'Joules (J)' },
        { name: 'Energy (kWh)', formula: 'W = P × t', unit: 'kWh' },
      ],
      simulator_demos: ['Simple DC circuit: battery + lamp','Current direction convention','Active vs passive element identification'],
    },
    {
      id: 'ch2', part: 'part1', number: 2, title: 'Basic Laws',
      sadiku_pages: '29–80', boylestad_chapters: '3,4,5,6', difficulty: 'beginner',
      topics: ["Ohm's Law","Nodes, Branches, and Loops","Kirchhoff's Current Law (KCL)","Kirchhoff's Voltage Law (KVL)","Series Resistors and Voltage Division","Parallel Resistors and Current Division","Wye-Delta (Y-Δ) Transformations","Applications: Lighting Systems, DC Meters"],
      key_formulas: [
        { name: "Ohm's Law", formula: 'v = iR', unit: 'V' },
        { name: 'Resistance', formula: 'R = ρL/A', unit: 'Ω' },
        { name: 'KCL', formula: 'Σi_in = Σi_out', unit: 'A' },
        { name: 'KVL', formula: 'Σv = 0 (around any closed loop)', unit: 'V' },
        { name: 'Series R', formula: 'R_eq = R1 + R2 + ... + Rn', unit: 'Ω' },
        { name: 'Parallel R', formula: '1/R_eq = 1/R1 + 1/R2 + ...', unit: 'Ω' },
        { name: 'Voltage Divider', formula: 'v1 = (R1/(R1+R2)) × v', unit: 'V' },
        { name: 'Current Divider', formula: 'i1 = (R2/(R1+R2)) × i', unit: 'A' },
      ],
      simulator_demos: ["Ohm's Law: vary V and R, observe I","KCL node verification","KVL loop verification","Series-parallel resistor combinations","Voltage and current divider circuits"],
    },
    {
      id: 'ch3', part: 'part1', number: 3, title: 'Methods of Analysis',
      sadiku_pages: '81–126', boylestad_chapters: '8', difficulty: 'intermediate',
      topics: ['Nodal Analysis (Node Voltage Method)','Nodal Analysis with Voltage Sources (Supernodes)','Mesh Analysis (Mesh Current Method)','Mesh Analysis with Current Sources (Supermesh)','Nodal vs Mesh Analysis Comparison','Applications: DC Transistor Circuits'],
      key_formulas: [
        { name: 'Nodal Analysis (KCL at node)', formula: 'Σ(v_n - v_k)/R_nk = I_n', unit: 'A' },
        { name: 'Mesh equation (KVL)', formula: 'Σ(R_ij × i_j) = Σv_sources', unit: 'V' },
        { name: 'Conductance matrix', formula: 'GV = I', unit: 'A' },
      ],
      simulator_demos: ['2-node nodal analysis walkthrough','3-mesh circuit analysis','Supernode demonstration','Supermesh demonstration'],
    },
    {
      id: 'ch4', part: 'part1', number: 4, title: 'Circuit Theorems',
      sadiku_pages: '127–173', boylestad_chapters: '9', difficulty: 'intermediate',
      topics: ['Linearity Property and Superposition','Source Transformation','Thévenin\'s Theorem','Norton\'s Theorem','Maximum Power Transfer','Applications: Source Modeling, Resistance Measurement'],
      key_formulas: [
        { name: 'Thévenin Voltage', formula: 'V_Th = V_oc', unit: 'V' },
        { name: 'Thévenin Resistance', formula: 'R_Th = V_oc / I_sc', unit: 'Ω' },
        { name: 'Norton Current', formula: 'I_N = I_sc', unit: 'A' },
        { name: 'Max Power Transfer', formula: 'P_max = V_Th²/(4R_Th) when R_L = R_Th', unit: 'W' },
      ],
      simulator_demos: ['Superposition: enable/disable sources','Source transformation','Thevenin equivalent finder','Maximum power transfer curve (RL sweep)'],
    },
    {
      id: 'ch5', part: 'part1', number: 5, title: 'Operational Amplifiers',
      sadiku_pages: '175–213', boylestad_chapters: null, difficulty: 'intermediate',
      topics: ['Introduction to Op Amps','Ideal Op Amp Model','Inverting Amplifier','Noninverting Amplifier','Summing Amplifier','Difference Amplifier','Cascaded Op Amp Circuits','Applications: DAC, Instrumentation Amplifiers'],
      key_formulas: [
        { name: 'Inverting Amp Gain', formula: 'v_o = -(R_f/R_1) × v_i', unit: 'V' },
        { name: 'Noninverting Amp Gain', formula: 'v_o = (1 + R_f/R_1) × v_i', unit: 'V' },
        { name: 'Summing Amp', formula: 'v_o = -(R_f/R_1)v_1 - (R_f/R_2)v_2 ...', unit: 'V' },
        { name: 'Unity Gain (Buffer)', formula: 'v_o = v_i', unit: 'V' },
      ],
      simulator_demos: ['Inverting amp gain sweep','Summing amp demo','Op amp comparator'],
    },
    {
      id: 'ch6', part: 'part1', number: 6, title: 'Capacitors and Inductors',
      sadiku_pages: '215–264', boylestad_chapters: '10,11', difficulty: 'intermediate',
      topics: ['Capacitors','Series and Parallel Capacitors','Inductors','Series and Parallel Inductors','Applications: Integrator, Differentiator, DC Steady State'],
      key_formulas: [
        { name: 'Capacitor v-i', formula: 'i = C·dv/dt', unit: 'A' },
        { name: 'Capacitor energy', formula: 'w = ½Cv²', unit: 'J' },
        { name: 'Inductor v-i', formula: 'v = L·di/dt', unit: 'V' },
        { name: 'Inductor energy', formula: 'w = ½Li²', unit: 'J' },
        { name: 'Series C', formula: '1/C_eq = 1/C1 + 1/C2 + ...', unit: 'F' },
        { name: 'Parallel C', formula: 'C_eq = C1 + C2 + ...', unit: 'F' },
      ],
      simulator_demos: ['Capacitor charging visualization','Inductor energy storage','Integrator op-amp circuit'],
    },
    {
      id: 'ch7', part: 'part1', number: 7, title: 'First-Order Circuits',
      sadiku_pages: '265–305', boylestad_chapters: null, difficulty: 'intermediate',
      topics: ['Source-Free RC Circuit','Source-Free RL Circuit','Unit Step Function','Step Response of RC Circuit','Step Response of RL Circuit','Applications: Delay Circuits, Relay Circuits'],
      key_formulas: [
        { name: 'RC time constant', formula: 'τ = RC', unit: 's' },
        { name: 'RC natural response', formula: 'v(t) = V_0·e^(-t/τ)', unit: 'V' },
        { name: 'RL time constant', formula: 'τ = L/R', unit: 's' },
        { name: 'RL natural response', formula: 'i(t) = I_0·e^(-t/τ)', unit: 'A' },
        { name: 'General step response', formula: 'x(t) = x(∞) + [x(0) - x(∞)]e^(-t/τ)', unit: '' },
      ],
      simulator_demos: ['RC charging/discharging with τ markers','RL step response','Delay circuit timing'],
    },
    {
      id: 'ch8', part: 'part1', number: 8, title: 'Second-Order Circuits',
      sadiku_pages: '307–353', boylestad_chapters: null, difficulty: 'advanced',
      topics: ['Introduction to Second-Order Circuits','Source-Free Series RLC Circuit','Source-Free Parallel RLC Circuit','Step Response of Series RLC','Step Response of Parallel RLC','Overdamped, Critically Damped, Underdamped Responses'],
      key_formulas: [
        { name: 'Neper frequency (series)', formula: 'α = R/(2L)', unit: 'rad/s' },
        { name: 'Resonant frequency', formula: 'ω_0 = 1/√(LC)', unit: 'rad/s' },
        { name: 'Damped frequency', formula: 'ω_d = √(ω_0² - α²)', unit: 'rad/s' },
        { name: 'Overdamped (α > ω_0)', formula: 'x(t) = A1·e^(s1t) + A2·e^(s2t)', unit: '' },
        { name: 'Underdamped (α < ω_0)', formula: 'x(t) = e^(-αt)(A1·cos(ω_d·t) + A2·sin(ω_d·t))', unit: '' },
      ],
      simulator_demos: ['RLC damping explorer (overdamped/critical/underdamped)','Natural frequency sweep','Step response comparison'],
    },
    {
      id: 'ch9', part: 'part2', number: 9, title: 'Sinusoidal Steady-State Analysis',
      sadiku_pages: '355–404', boylestad_chapters: '13,14', difficulty: 'intermediate',
      topics: ['Sinusoids','Phasors','Phasor Relationships for Circuit Elements','Impedance and Admittance','Kirchhoff\'s Laws in Frequency Domain','Impedance Combinations'],
      key_formulas: [
        { name: 'Sinusoid', formula: 'v(t) = V_m·cos(ωt + φ)', unit: 'V' },
        { name: 'Phasor', formula: 'V = V_m∠φ', unit: 'V' },
        { name: 'Impedance R', formula: 'Z_R = R', unit: 'Ω' },
        { name: 'Impedance L', formula: 'Z_L = jωL', unit: 'Ω' },
        { name: 'Impedance C', formula: 'Z_C = 1/(jωC)', unit: 'Ω' },
        { name: 'Admittance', formula: 'Y = 1/Z = G + jB', unit: 'S' },
      ],
      simulator_demos: ['Phasor diagram (rotating vector)','RLC impedance vs frequency','Phase angle visualization'],
    },
    {
      id: 'ch10', part: 'part2', number: 10, title: 'AC Power Analysis',
      sadiku_pages: '405–445', boylestad_chapters: '19', difficulty: 'intermediate',
      topics: ['Instantaneous and Average Power','Maximum Average Power Transfer','Effective (RMS) Value','Apparent Power and Power Factor','Complex Power','Conservation of AC Power','Power Factor Correction'],
      key_formulas: [
        { name: 'Average Power', formula: 'P = ½·V_m·I_m·cos(θ_v - θ_i)', unit: 'W' },
        { name: 'RMS Value', formula: 'V_rms = V_m/√2', unit: 'V' },
        { name: 'Complex Power', formula: 'S = P + jQ = V_rms·I*_rms', unit: 'VA' },
        { name: 'Apparent Power', formula: '|S| = V_rms·I_rms', unit: 'VA' },
        { name: 'Power Factor', formula: 'pf = P/|S| = cos(θ)', unit: '' },
        { name: 'Reactive Power', formula: 'Q = ½·V_m·I_m·sin(θ_v - θ_i)', unit: 'VAR' },
      ],
      simulator_demos: ['Power triangle visualization','PF correction demo','RMS vs peak value display'],
    },
    {
      id: 'ch11', part: 'part2', number: 11, title: 'Three-Phase Circuits',
      sadiku_pages: '447–490', boylestad_chapters: '23', difficulty: 'advanced',
      topics: ['Three-Phase Voltages','Balanced Wye-Wye Connection','Balanced Wye-Delta Connection','Balanced Delta-Delta Connection','Balanced Delta-Wye Connection','Power in Balanced Three-Phase Systems'],
      key_formulas: [
        { name: 'Phase voltage', formula: 'V_φ = V_L/√3 (Wye)', unit: 'V' },
        { name: 'Phase current', formula: 'I_φ = I_L (Wye)', unit: 'A' },
        { name: '3-phase power', formula: 'P = √3·V_L·I_L·cos(θ)', unit: 'W' },
      ],
      simulator_demos: ['3-phase phasor diagram','Y-Y circuit simulation','Power measurement (2-wattmeter method)'],
    },
    {
      id: 'ch12', part: 'part2', number: 12, title: 'Magnetically Coupled Circuits',
      sadiku_pages: '491–531', boylestad_chapters: '22', difficulty: 'advanced',
      topics: ['Mutual Inductance','Energy in a Coupled Circuit','Linear Transformers','Ideal Transformers','Applications: Transformer Design'],
      key_formulas: [
        { name: 'Mutual inductance', formula: 'v_1 = L_1·di_1/dt + M·di_2/dt', unit: 'V' },
        { name: 'Coupling coefficient', formula: 'k = M/√(L_1·L_2)', unit: '' },
        { name: 'Ideal transformer', formula: 'V_2/V_1 = N_2/N_1 = n', unit: '' },
        { name: 'Current ratio', formula: 'I_1/I_2 = N_2/N_1', unit: '' },
      ],
      simulator_demos: ['Mutual inductance demo','Transformer turns ratio','Reflected impedance'],
    },
    {
      id: 'ch13', part: 'part2', number: 13, title: 'Frequency Response',
      sadiku_pages: '533–577', boylestad_chapters: '21', difficulty: 'advanced',
      topics: ['Transfer Function','Bode Plots','Series Resonance','Parallel Resonance','Passive Filters (LP, HP, BP, BS)','Active Filters','Applications: Radio Tuner, Touch-Tone Telephone'],
      key_formulas: [
        { name: 'Transfer function', formula: 'H(ω) = V_o/V_i', unit: '' },
        { name: 'Resonant frequency', formula: 'ω_0 = 1/√(LC)', unit: 'rad/s' },
        { name: 'Quality factor', formula: 'Q = ω_0·L/R', unit: '' },
        { name: 'Bandwidth', formula: 'B = ω_0/Q', unit: 'rad/s' },
        { name: 'Half-power freq', formula: 'ω_{1,2} = ω_0 ± B/2', unit: 'rad/s' },
      ],
      simulator_demos: ['Bode plot generator','Resonance frequency sweep','Low-pass/high-pass filter response'],
    },
    {
      id: 'ch14', part: 'part2', number: 14, title: 'Laplace Transform',
      sadiku_pages: '579–634', boylestad_chapters: null, difficulty: 'advanced',
      topics: ['Laplace Transform Definition','Properties of Laplace Transform','Inverse Laplace Transform','Circuit Analysis with Laplace','Transfer Functions','State Variables'],
      key_formulas: [
        { name: 'Laplace transform', formula: 'F(s) = ∫₀^∞ f(t)e^(-st)dt', unit: '' },
        { name: 'Impedance (s-domain)', formula: 'Z_L = sL, Z_C = 1/(sC)', unit: 'Ω' },
        { name: 'Partial fractions', formula: 'F(s) = A/(s+a) + B/(s+b) + ...', unit: '' },
      ],
      simulator_demos: ['s-domain circuit analysis','Partial fraction expansion','Step/impulse response via Laplace'],
    },
    {
      id: 'ch15', part: 'part3', number: 15, title: 'Two-Port Networks',
      sadiku_pages: '635–682', boylestad_chapters: null, difficulty: 'advanced',
      topics: ['Two-Port Parameters (z, y, h, g, ABCD)','Relationships Between Parameters','Interconnection of Two-Port Networks','Applications: Ladder Networks, Op Amp Circuits'],
      key_formulas: [
        { name: 'z-parameters', formula: 'V_1 = z_11·I_1 + z_12·I_2', unit: '' },
        { name: 'y-parameters', formula: 'I_1 = y_11·V_1 + y_12·V_2', unit: '' },
        { name: 'h-parameters', formula: 'V_1 = h_11·I_1 + h_12·V_2', unit: '' },
        { name: 'ABCD matrix', formula: '[V1;I1] = [A B;C D][V2;-I2]', unit: '' },
      ],
      simulator_demos: ['Two-port parameter measurement','Cascade two-port demo'],
    },
    {
      id: 'ch16', part: 'part3', number: 16, title: 'Fourier Series',
      sadiku_pages: '683–732', boylestad_chapters: null, difficulty: 'advanced',
      topics: ['Trigonometric Fourier Series','Symmetry Considerations','Circuit Applications of Fourier Series','Average Power and RMS Value','Exponential Fourier Series','Spectrum of Periodic Signals'],
      key_formulas: [
        { name: 'Fourier series', formula: 'f(t) = a_0 + Σ(a_n·cos(nω_0t) + b_n·sin(nω_0t))', unit: '' },
        { name: 'DC component', formula: 'a_0 = (1/T)·∫_T f(t)dt', unit: '' },
        { name: 'a_n coefficient', formula: 'a_n = (2/T)·∫_T f(t)·cos(nω_0t)dt', unit: '' },
      ],
      simulator_demos: ['Square wave Fourier reconstruction','Harmonic spectrum visualizer'],
    },
    {
      id: 'ch17', part: 'part3', number: 17, title: 'Fourier Transform',
      sadiku_pages: '733–779', boylestad_chapters: null, difficulty: 'advanced',
      topics: ['Fourier Transform Definition','Properties of Fourier Transform','Circuit Applications','Parseval\'s Theorem','Comparing Fourier Transform Methods'],
      key_formulas: [
        { name: 'Fourier transform', formula: 'F(ω) = ∫_{-∞}^{∞} f(t)e^(-jωt)dt', unit: '' },
        { name: 'Inverse FT', formula: 'f(t) = (1/2π)·∫_{-∞}^{∞} F(ω)e^(jωt)dω', unit: '' },
        { name: "Parseval's theorem", formula: '∫|f(t)|²dt = (1/2π)·∫|F(ω)|²dω', unit: '' },
      ],
      simulator_demos: ['FT of common signals (rect, sinc, gaussian)','Frequency domain filtering'],
    },
    {
      id: 'ch18', part: 'part3', number: 18, title: 'PSpice and Circuit Simulation',
      sadiku_pages: 'Appendix', boylestad_chapters: null, difficulty: 'intermediate',
      topics: ['Introduction to PSpice/SPICE','DC Analysis','AC Analysis','Transient Analysis','Monte Carlo Analysis','Reading SPICE Output'],
      key_formulas: [
        { name: 'SPICE resistor', formula: 'R1 N1 N2 1k', unit: '' },
        { name: 'SPICE voltage', formula: 'V1 N1 0 DC 12', unit: '' },
        { name: 'AC source', formula: 'V1 N1 0 AC 1 0', unit: '' },
      ],
      simulator_demos: ['DC operating point analysis','AC sweep simulation','Transient pulse response'],
    },
    {
      id: 'ch19', part: 'part3', number: 19, title: 'Mathematical Foundations',
      sadiku_pages: 'Appendix B-D', boylestad_chapters: null, difficulty: 'intermediate',
      topics: ['Complex Numbers Review','Matrix Algebra for Circuit Analysis','Cramer\'s Rule','Euler\'s Formula','Partial Fraction Expansion','Differentiation and Integration Review'],
      key_formulas: [
        { name: "Euler's formula", formula: 'e^(jθ) = cos(θ) + j·sin(θ)', unit: '' },
        { name: 'Complex number', formula: 'z = x + jy = r∠θ', unit: '' },
        { name: "Cramer's rule", formula: 'x_k = det(A_k)/det(A)', unit: '' },
      ],
      simulator_demos: ['Complex number phasor rotation','Matrix solver for circuit equations'],
    },
  ],
}

export const chapterMap = new Map(curriculum.chapters.map(ch => [ch.id, ch]))

export function getChapter(id: string): Chapter | undefined {
  return chapterMap.get(id)
}

export function getPartChapters(partId: string): Chapter[] {
  const part = curriculum.parts.find(p => p.id === partId)
  if (!part) return []
  return part.chapters.map(id => chapterMap.get(id)!).filter(Boolean)
}

export const TOTAL_CHAPTERS = curriculum.chapters.length // 19
