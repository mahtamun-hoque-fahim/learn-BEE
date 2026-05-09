# BEE Cheat Sheet — Formula Reference

## PART 1: DC CIRCUITS

### Chapter 1 — Basic Concepts
| Quantity | Formula | Unit |
|---|---|---|
| Current | i = dq/dt | A |
| Voltage | v = dw/dq | V |
| Power | p = v·i = i²R = v²/R | W |
| Energy | w = ∫p dt = Pt (DC) | J |
| Energy (practical) | W = P × t | kWh |
| Charge of electron | e = 1.6 × 10⁻¹⁹ C | C |

### Chapter 2 — Basic Laws
| Law / Formula | Expression |
|---|---|
| Ohm's Law | v = iR |
| Resistivity | R = ρL/A |
| KCL | Σi_entering = Σi_leaving |
| KVL | Σv_loop = 0 |
| Series R | R_eq = R1 + R2 + ... + Rn |
| Parallel R | 1/R_eq = 1/R1 + 1/R2 + ... |
| Two parallel R | R_eq = R1R2/(R1+R2) |
| Voltage Divider | Vk = (Rk/R_total)·V |
| Current Divider (2R) | I1 = R2/(R1+R2)·I |
| Y→Δ | Rᵢⱼ = (RᵢRⱼ + RⱼRₖ + RₖRᵢ)/Rₖ |
| Δ→Y | Rₖ = R_adj1·R_adj2 / (Ra+Rb+Rc) |

### Chapter 3 — Methods of Analysis
| Method | Basis | Unknowns |
|---|---|---|
| Nodal | KCL | Node voltages |
| Mesh | KVL | Mesh currents |
| Supernode | KCL + constraint | When V-source between nodes |
| Supermesh | KVL + constraint | When I-source shared by meshes |

### Chapter 4 — Circuit Theorems
| Theorem | Equivalent | Key Formula |
|---|---|---|
| Thévenin | V_Th + R_Th series | V_Th = V_oc; R_Th = V_oc/I_sc |
| Norton | I_N ‖ R_N | I_N = I_sc; R_N = R_Th |
| Superposition | Sum each source alone | Deactivate V→short; I→open |
| Max Power | R_L = R_Th | P_max = V_Th²/(4R_Th) |

### Chapter 5 — Op Amps
| Configuration | Gain | Notes |
|---|---|---|
| Inverting Amp | A = -Rf/R1 | Phase inverted |
| Noninverting Amp | A = 1 + Rf/R1 | Always ≥ 1 |
| Voltage Follower | A = 1 | Buffer, impedance matching |
| Summing Amp | vo = -Rf(v1/R1 + v2/R2 + ...) | |
| Difference Amp | vo = (R2/R1)(v2-v1) | |
| Ideal op amp rules | v+ = v−; i+ = i− = 0 | Virtual short |

### Chapter 6 — Capacitors & Inductors
| Element | v-i Relation | Energy | DC Steady-State |
|---|---|---|---|
| Capacitor C | i = C·dv/dt | w = ½Cv² | Open circuit |
| Inductor L | v = L·di/dt | w = ½Li² | Short circuit |
| Series C | 1/C_eq = Σ1/Cₙ | | |
| Parallel C | C_eq = ΣCₙ | | |
| Series L | L_eq = ΣLₙ | | |
| Parallel L | 1/L_eq = Σ1/Lₙ | | |

### Chapter 7 — First-Order Circuits
| Circuit | Time Constant τ | Natural Response | Step Response |
|---|---|---|---|
| RC | τ = RC | v(t) = V₀e^(-t/τ) | v(t) = Vs(1-e^(-t/τ)) + V₀e^(-t/τ) |
| RL | τ = L/R | i(t) = I₀e^(-t/τ) | i(t) = Is(1-e^(-t/τ)) + I₀e^(-t/τ) |

**General formula:** x(t) = x(∞) + [x(0) – x(∞)]e^(–t/τ)

Key values:
- At t = τ: 63.2% toward final value
- At t = 5τ: 99.3% → practical steady state

### Chapter 8 — Second-Order Circuits
**Series RLC characteristic equation:** s² + (R/L)s + 1/(LC) = 0

| Parameter | Formula |
|---|---|
| Damping coeff α (series) | α = R/(2L) |
| Damping coeff α (parallel) | α = 1/(2RC) |
| Natural frequency | ω₀ = 1/√(LC) |
| Damped freq | ωd = √(ω₀² – α²) |

| Condition | Response Type | Form |
|---|---|---|
| α > ω₀ | Overdamped | A₁e^(s₁t) + A₂e^(s₂t) |
| α = ω₀ | Critically damped | (A₁ + A₂t)e^(–αt) |
| α < ω₀ | Underdamped | e^(–αt)[A₁cos(ωdt) + A₂sin(ωdt)] |

---

## PART 2: AC CIRCUITS

### Chapter 9 — Sinusoids & Phasors
| Concept | Formula |
|---|---|
| Sinusoid | v(t) = Vm·cos(ωt + φ) |
| Angular freq | ω = 2πf = 2π/T |
| Phasor | V = Vm∠φ |
| Z_R | R |
| Z_L | jωL = ωL∠90° |
| Z_C | 1/(jωC) = (1/ωC)∠–90° |
| Admittance | Y = 1/Z = G + jB |
| Series Z | Z_eq = Z1 + Z2 + ... |
| Parallel Z | 1/Z_eq = 1/Z1 + 1/Z2 + ... |

### Phase relationships (mnemonic: ELI the ICE man)
- **E**LI: In inductor **L**, voltage **E** leads current **I** by 90°
- I**CE**: In capacitor **C**, current **I** leads voltage **E** by 90°
- Resistor: V and I in phase (0°)

### Chapter 11 — AC Power
| Quantity | Formula | Unit |
|---|---|---|
| Instantaneous power | p(t) = v(t)·i(t) | W |
| Average (real) power | P = ½VmIm·cos(θv–θi) = Vrms·Irms·cosθ | W |
| RMS | Vrms = Vm/√2; Irms = Im/√2 | V, A |
| Apparent power | S = Vrms·Irms | VA |
| Reactive power | Q = Vrms·Irms·sinθ | VAR |
| Complex power | S = P + jQ = V·I* | VA |
| Power factor | pf = cosθ = P/S | — |
| Power triangle | S² = P² + Q² | |
| Max power transfer (AC) | Z_L = Z_Th* (conjugate) | |

### Chapter 12 — Three-Phase Circuits
| Parameter | Y Connection | Δ Connection |
|---|---|---|
| Line vs phase voltage | V_L = √3·V_ph∠30° | V_L = V_ph |
| Line vs phase current | I_L = I_ph | I_L = √3·I_ph∠–30° |

**Balanced 3-phase power:**
- P = 3·V_ph·I_ph·cosθ = √3·V_L·I_L·cosθ
- Q = √3·V_L·I_L·sinθ
- S = √3·V_L·I_L

### Chapter 13 — Magnetically Coupled Circuits
| Concept | Formula |
|---|---|
| Mutual inductance voltage | v = M·di/dt |
| Coupling coeff | k = M/√(L1·L2) |
| Ideal transformer | V2/V1 = N2/N1 = n |
| Current ratio | I1/I2 = N2/N1 = 1/n |
| Reflected impedance | Z_in = Z_L/n² (if n = N1/N2) |
| Conservation | V1·I1 = V2·I2 (ideal) |

### Chapter 14 — Frequency Response
| Concept | Formula |
|---|---|
| Transfer function | H(ω) = Output/Input phasor ratio |
| Decibel (voltage) | H_dB = 20·log₁₀(|H|) |
| Resonant frequency | ω₀ = 1/√(LC) |
| Series Q | Q = ω₀L/R = 1/(ω₀RC) |
| Parallel Q | Q = ω₀RC = R/(ω₀L) |
| Bandwidth | B = ω₀/Q = R/L (series) |
| Half-power freqs | ω₁,₂ = ±B/2 + ω₀ (approx) |
| Filter types | LPF, HPF, BPF, BSF |

---

## PART 3: ADVANCED ANALYSIS

### Chapter 15 — Laplace Transform
**Common Pairs:**
| f(t) | F(s) |
|---|---|
| δ(t) (impulse) | 1 |
| u(t) (step) | 1/s |
| t·u(t) (ramp) | 1/s² |
| e^(–at) | 1/(s+a) |
| sin(ωt) | ω/(s²+ω²) |
| cos(ωt) | s/(s²+ω²) |
| e^(–at)sin(ωt) | ω/((s+a)²+ω²) |
| e^(–at)cos(ωt) | (s+a)/((s+a)²+ω²) |

**Properties:**
| Property | Formula |
|---|---|
| Linearity | L{af+bg} = aF+bG |
| Time shift | L{f(t–a)u(t–a)} = e^(–as)F(s) |
| Differentiation | L{f'} = sF(s)–f(0⁻) |
| Integration | L{∫f dt} = F(s)/s |
| Convolution | L{f1*f2} = F1·F2 |
| Initial value | f(0⁺) = lim(s→∞) sF(s) |
| Final value | f(∞) = lim(s→0) sF(s) |

### Chapter 16 — Circuit Elements in s-Domain
| Element | s-Domain Model |
|---|---|
| Resistor | V(s) = R·I(s) |
| Inductor | V(s) = sL·I(s) – L·i(0⁻) |
| Capacitor | V(s) = I(s)/(sC) + v(0⁻)/s |

### Chapter 17 — Fourier Series
**Trigonometric form:** f(t) = a₀ + Σ[aₙcos(nω₀t) + bₙsin(nω₀t)]

| Coefficient | Formula |
|---|---|
| a₀ (DC) | (1/T)∫₀ᵀ f(t)dt |
| aₙ | (2/T)∫₀ᵀ f(t)cos(nω₀t)dt |
| bₙ | (2/T)∫₀ᵀ f(t)sin(nω₀t)dt |
| Fundamental ω₀ | 2π/T |

**Symmetry shortcuts:**
- Even function (f(–t)=f(t)): bₙ = 0 (cosines only)
- Odd function (f(–t)=–f(t)): a₀=0, aₙ=0 (sines only)
- Half-wave symmetry: only odd harmonics exist

---

## QUICK REFERENCE — CIRCUIT ELEMENT SUMMARY

| Element | Symbol | DC Behavior | AC Impedance | Energy |
|---|---|---|---|---|
| Resistor R | R | V=IR | Z=R | Dissipates: P=I²R |
| Capacitor C | C | Open circuit | Z=1/(jωC) | Stores: w=½CV² |
| Inductor L | L | Short circuit | Z=jωL | Stores: w=½LI² |
| Op Amp | A | Amplifier | Ideal: Z_in=∞, Z_out=0 | Active |

## SI PREFIXES (Common in EE)
| Prefix | Symbol | Multiplier |
|---|---|---|
| Giga | G | 10⁹ |
| Mega | M | 10⁶ |
| Kilo | k | 10³ |
| milli | m | 10⁻³ |
| micro | μ | 10⁻⁶ |
| nano | n | 10⁻⁹ |
| pico | p | 10⁻¹² |
