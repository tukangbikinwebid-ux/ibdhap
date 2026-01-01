declare global {
  interface WindowEventMap {
    deviceorientationabsolute: DeviceOrientationEvent;
  }

  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
  }
}

export {};