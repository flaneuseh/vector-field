import * as math from 'mathjs';

export class VectorField {
  f_funs;  // Vx, Vy
  f2_funs; // dVx/dx, dVx/dy, dVy/dx, dVy/dy
  Vmax; // Max value for Vx or Vy
  constructor(f, Vmax) {
    this.set_f(f);
    this.Vmax = Vmax;
  }
  set_f(f) {
    try {
      this.f_funs = [math.compile(f[0]), math.compile(f[1])];
      this.f2_funs = [
        [math.derivative(f[0], 'x'), math.derivative(f[0], 'y')],
        [math.derivative(f[1], 'x'), math.derivative(f[1], 'y')],
      ];
    } catch(err) {
      // Don't set f or f2.
      console.log(err);
    }
  }
  f(state){
    let scope = {x: state[0], y: state[1]};
    let ft = [
      this.f_funs[0].evaluate(scope),
      this.f_funs[1].evaluate(scope),
    ]
    return [
      constrain(ft[0], -this.Vmax, this.Vmax),
      constrain(ft[1], -this.Vmax, this.Vmax),
    ];
  }
  f2(state){
    let scope = {x: state[0], y: state[1]};
    return [
      [this.f2_funs[0][0].evaluate(scope), this.f2_funs[0][1].evaluate(scope)],
      [this.f2_funs[1][0].evaluate(scope), this.f2_funs[1][1].evaluate(scope)],
    ];
  }
}

// Constrain x to be no smaller than min and no greater than max.
function constrain(x, min, max) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

export class Ball {
  state; // x, y
  integrator; // e.g, explicit_euler
  vector_field;
  constructor(state, integrator, vector_field) {
    this.state = state;
    this.integrator = integrator;
    this.vector_field = vector_field;
  }
  step(dt) {
    try {
      this.integrator(this, dt);
    } catch(err) {
      console.log(err);
    }
  }
  f() {
    return this.vector_field.f(this.state);
  }
  f2() {
    return this.vector_field.f2(this.state);
  }
}

export function explicit_euler(ball, dt) {
  let s0 = ball.state;
  let f = ball.f();
  ball.state = math.add(s0, math.multiply(dt, f));
}

export function midpoint(ball, dt){
  let s0 = ball.state;
  let f = ball.f();
  let smid = math.add(s0 , math.multiply(.5*dt, f));
  ball.state = smid;
  let fmid = ball.f();
  ball.state = math.add(s0, math.multiply(dt, fmid));
}

export function rk4(ball, dt) {
  let s0 = ball.state;
  let k1 = math.multiply(dt, ball.f());
  let s1 = math.add(s0, math.multiply(1/2, k1));
  ball.state = s1;
  let k2 = math.multiply(dt, ball.f());
  let s2 = math.add(s0, math.multiply(1/2, k2));
  ball.state = s2;
  let k3 = math.multiply(dt, ball.f());
  let s3 = math.add(s0, k3);
  ball.state = s3;
  let k4 = math.multiply(dt, ball.f());
  ball.state = math.add(s0,
    math.multiply(1/6, k1),
    math.multiply(1/3, k2),
    math.multiply(1/3, k3),
    math.multiply(1/6, k4));
}

export function implicit_euler(ball, dt){
  let s0 = ball.state;
  let f = ball.f();
  let f2 = ball.f2();
  let mulid = math.multiply(1/dt, math.identity(2));
  let inv_arg = math.subtract(mulid, f2);
  let delta = math.multiply(math.inv(inv_arg), f);
  let mulf = math.multiply(dt, f);
  let muldelta = math.multiply(dt, delta);
  let mulf2 = math.multiply(muldelta, f2);
  ball.state = math.add(s0, mulf, mulf2).toArray();
}
