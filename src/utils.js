import * as integration from './Integration.js'
export function getColourForIntegrator(integrator) {
  switch (integrator) {
    case integration.explicit_euler:
      return 'hotpink';
    case integration.implicit_euler:
      return 'indigo';
    case integration.midpoint:
      return 'darkgreen';
    case integration.rk4:
      return 'darkgoldenrod';
  }
}
