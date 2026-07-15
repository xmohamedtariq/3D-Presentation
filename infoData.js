/**
 * Static content for the component info-card overlay. Kept separate from
 * the DOM logic (InfoCard.js) and the 3D geometry (boatParts.js) so the
 * copy can be edited without touching either.
 */
export const componentInfo = {
  hull: {
    eyebrow: 'Structure',
    title: 'Hull & Pontoons',
    desc: 'A twin-pontoon catamaran hull chosen for roll stability rather than top speed — the platform has to stay upright while a frightened victim grabs and pulls on it from one side.',
    specs: [
      ['Configuration', 'Twin-pontoon catamaran'],
      ['Material', 'Sealed marine-grade foam core'],
      ['Length', '70 cm'],
      ['Beam width', '42 cm'],
      ['Draft', '< 6 cm loaded']
    ]
  },
  deck: {
    eyebrow: 'Structure',
    title: 'Electronics Deck',
    desc: 'A raised, sealed deck plate that keeps every electronic subsystem above the waterline and isolated from the pump and motor wiring routed below.',
    specs: [
      ['Sealing', 'Gasketed, IP-rated enclosure'],
      ['Mounting', 'Quick-release deck plate'],
      ['Clearance', '35 mm above waterline']
    ]
  },
  controller: {
    eyebrow: 'Electronics',
    title: 'Flight Controller',
    desc: 'A microcontroller-based flight controller reads the RF receiver and mixes stick input into differential thrust, letting the boat spin tightly on the spot to keep the camera on target.',
    specs: [
      ['Core', '32-bit microcontroller'],
      ['Control loop', 'Differential thrust mixing'],
      ['Interfaces', 'PWM in / PWM out, telemetry UART'],
      ['Failsafe', 'Signal-loss neutral throttle']
    ]
  },
  esc: {
    eyebrow: 'Electronics',
    title: 'ESC & Wiring',
    desc: 'Paired electronic speed controllers regulate power from the shared battery bus to each thruster independently, with a buck converter stepping voltage down for the camera and receiver.',
    specs: [
      ['Configuration', 'Dual independent ESCs'],
      ['Continuous rating', '30 A per channel'],
      ['Protection', 'Over-current & thermal cutoff']
    ]
  },
  fpv: {
    eyebrow: 'Vision System',
    title: 'FPV Camera',
    desc: 'A forward-facing, wide-angle camera on a shock-mounted bracket feeds a low-latency video transmitter, giving the pilot a first-person view that keeps the victim centred in frame.',
    specs: [
      ['Field of view', '150° wide-angle'],
      ['Latency', '< 40 ms glass-to-glass'],
      ['Low-light', 'Enhanced night sensitivity'],
      ['Mount', 'Shock-isolated gimbal bracket']
    ]
  },
  antenna: {
    eyebrow: 'Communications',
    title: 'RF Receiver',
    desc: 'Receives control input from the handheld transmitter over a dedicated control-frequency link, kept independent from the video downlink so a weak video signal never costs the pilot control.',
    specs: [
      ['Link type', 'Dedicated RF control channel'],
      ['Range', 'Line-of-sight, several hundred metres'],
      ['Antenna', 'Omnidirectional whip']
    ]
  },
  pump: {
    eyebrow: 'Rescue Payload',
    title: 'Rescue Pump',
    desc: 'A submersible pump that keeps the sealed hull compartments dry and, through a diverter valve, drives a gentle jet outlet used to nudge a conscious victim toward the flotation collar.',
    specs: [
      ['Type', 'Submersible bilge-style pump'],
      ['Flow rate', '6 L/min'],
      ['Modes', 'Bilge clearance / jet-assist']
    ]
  },
  battery: {
    eyebrow: 'Power',
    title: 'LiPo Battery',
    desc: 'A single high-discharge LiPo pack powers propulsion, electronics, the video link, and the pump from one balanced bus, with low-voltage cutoff protecting cell health.',
    specs: [
      ['Chemistry', 'LiPo, high-discharge'],
      ['Capacity', '5200 mAh'],
      ['Runtime', '~18 minutes active duty'],
      ['Protection', 'Low-voltage cutoff & balance monitoring']
    ]
  },
  thrusters: {
    eyebrow: 'Propulsion',
    title: 'Propulsion Thrusters',
    desc: 'Independent brushless thrusters in shrouded, finger-safe housings give the boat tank-style steering — full reverse on one side and forward on the other rotates it in place.',
    specs: [
      ['Configuration', 'Twin independent thrusters'],
      ['Guard', 'Shrouded, finger-safe ring'],
      ['Top speed', '~2.3 m/s open water'],
      ['Steering', 'Differential (tank-style) turning']
    ]
  }
};
