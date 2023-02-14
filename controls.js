class Controls {
  constructor(type, offset) {
    this.forward = false;
    this.right = false;
    this.reverse = false;
    this.left = false;

    switch (type) {
      case "KEYS":
        this.forward = true;
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  offsetFuzzySet = {
    close: {
      membership: function (frontOffset) {
        if (frontOffset >= 0 && frontOffset <= 20) {
          return 1;
        } else if (frontOffset >= 20 && frontOffset <= 40) {
          return (40 - frontOffset) / (40 - 20);
        } else {
          return 0;
        }
      },
    },
    moderate: {
      membership: function (frontOffset) {
        if (frontOffset >= 35 && frontOffset <= 50) {
          return (frontOffset - 35) / (50 - 35);
        } else if (frontOffset >= 50 && frontOffset <= 75) {
          return (75 - frontOffset) / (75 - 50);
        } else {
          return 0;
        }
      },
    },
    far: {
      membership: function (frontOffset) {
        if (frontOffset >= 70 && frontOffset <= 100) {
          return (frontOffset - 70) / (100 - 70);
        } else {
          return 0;
        }
      },
    },
  };

  speedFuzzySet = {
    slow: {
      membership: function (x) {
        if (x >= 0 && x <= 10) {
          return 1;
        } else if (x >= 10 && x <= 15) {
          return (x - 10) / (15 - 10);
        } else {
          return 0;
        }
      },
    },
    normal: {
      membership: function (x) {
        if (x >= 15 && x <= 20) {
          return (x - 15) / (20 - 15);
        } else if (x >= 20 && x <= 25) {
          return (25 - x) / (25 - 20);
        } else {
          return 0;
        }
      },
    },
    fast: {
      membership: function (x) {
        if (x >= 20 && x <= 25) {
          return (x - 20) / (25 - 20);
        } else if (x >= 25 && x <= 30) {
          return 1;
        } else {
          return 0;
        }
      },
    },
  };

  angleFuzzySet = {
    small: {
      membership: function (a) {
        if (a >= 0 && a <= 20) {
          return 1;
        } else if (a >= 20 && a <= 35) {
          return (35 - a) / (35 - 20);
        } else {
          return 0;
        }
      },
    },
    normal: {
      membership: function (a) {
        if (a >= 30 && a <= 40) {
          return (a - 30) / (40 - 30);
        } else if (a >= 40 && a <= 50) {
          return 1;
        } else if (a >= 50 && a <= 60) {
          return (60 - a) / (60 - 50);
        } else {
          return 0;
        }
      },
    },
    big: {
      membership: function (a) {
        if (a >= 55 && a <= 70) {
          return (a - 55) / (70 - 55);
        } else if (a >= 70 && a <= 90) {
          return 1;
        } else {
          return 0;
        }
      },
    },
  };

  fuzzifySpeed(offset) {
    let close = this.offsetFuzzySet.close.membership(offset);
    let moderate = this.offsetFuzzySet.moderate.membership(offset);
    let far = this.offsetFuzzySet.far.membership(offset);
    let y1 = 0;
    let y2 = 0;
    let A0 = [[],[],[],[]];
    for(let i = 0; i<=30; i++){
        // R1: if offset=close then speed=slow
        A0[0][i]=Math.min(close, this.speedFuzzySet.slow.membership(i));
        // R2: if offset=moderate then speed=normal
        A0[1][i]=Math.min(moderate, this.speedFuzzySet.normal.membership(i));
        // R3: if offset=far then speed=fast
        A0[2][i]=Math.min(far, this.speedFuzzySet.fast.membership(i));

        // agregacja
        A0[3][i]=Math.max(A0[0][i], A0[1][i], A0[2][i]);

        y1 += A0[3][i]*i;
        y2 += A0[3][i];
    }
    //wyostrzanie
    return y1/y2;
  }

  fuzzifyAngle(offset) {
    let close = this.offsetFuzzySet.close.membership(offset);
    let moderate = this.offsetFuzzySet.moderate.membership(offset);
    let far = this.offsetFuzzySet.far.membership(offset);
    let y1 = 0;
    let y2 = 0;
    let A0 = [[],[],[],[]];
    for(let i = 0; i<=70; i++){
        // R1: if offset=close then angle=big
        A0[0][i]=Math.min(close, this.angleFuzzySet.big.membership(i));
        // R2: if offset=moderate then angle=normal
        A0[1][i]=Math.min(moderate, this.angleFuzzySet.normal.membership(i));
        // R3: if offset=far then angle=small
        A0[2][i]=Math.min(far, this.angleFuzzySet.small.membership(i));

        // agregacja
        A0[3][i]=Math.max(A0[0][i], A0[1][i], A0[2][i]);

        y1 += A0[3][i]*i;
        y2 += A0[3][i];
    }
    //wyostrzanie
    return y1/y2;
  }
}
