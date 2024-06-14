radio.setFrequencyBand(66);
radio.setTransmitPower(5);
radio.setGroup(585);
radio.setTransmitSerialNumber(true);

let run: boolean = false;
let turnLeft: boolean = false;
let turnRight: boolean = false;

enum Pins {
    wr = DigitalPin.P8,
    wl = DigitalPin.P12,
    r = DigitalPin.P13,
    l = DigitalPin.P14,
    c = DigitalPin.P15,
    trig = DigitalPin.P2,
    echo = DigitalPin.P1,
}

type IRpins = {
    wr: boolean,
    wl: boolean,
    r: boolean,
    l: boolean,
    c: boolean,
    cm: number
}

enum ServoDirection {
    Left = 2,
    Center = 1,
    Right = 0
}

const allIRPins: Array<DigitalPin> = [DigitalPin.P8, DigitalPin.P12, DigitalPin.P13, DigitalPin.P14, DigitalPin.P15, DigitalPin.P2, DigitalPin.P1];
for (let pin of allIRPins) {
    pins.setPull(pin, PinPullMode.PullNone);
}

const carMotor = (sl: number = 0, sr: number = 0): void => {
    if (sl === 0 && sr === 0) { PCAmotor.MotorStopAll(); return; }
    let ul = Math.map(sl, -100, 100, -230, 230);
    let ur = Math.map(sr, -100, 100, -255, 255);

    PCAmotor.MotorRun(PCAmotor.Motors.M1, -1 * ul);
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -1 * ur);
}

const getIRStatus = () => {
    return {
        r: pins.digitalReadPin(DigitalPin.P13) === 1,
        l: pins.digitalReadPin(DigitalPin.P14) === 1,
        c: pins.digitalReadPin(DigitalPin.P15) === 1,
        blackLine: pins.digitalReadPin(DigitalPin.P12) === 1 // Kontrola černé čáry na P12
    };
};

function moveForward() {
    carMotor(200, 80);
}

function stopCar() {
    carMotor(0, 0);
}

function turnLeftFunc() { //A not best
    carMotor(150, 20);
}

function turnRightFunc() {
    carMotor(50, 100);
}

basic.forever(() => {
    let ir = getIRStatus();

    if (ir.blackLine) {
        if (turnLeft) {
            turnLeftFunc();
        } else if (turnRight) {
            turnRightFunc();
        } else {
            moveForward();
        }
    } else if (ir.r && !ir.l) {
        carMotor(50, 100);  // Otočení doprava
    } else if (!ir.r && ir.l) {
        carMotor(100, 50);  // Otočení doleva
    } else if (ir.c) {
        moveForward();
    } else {
        stopCar();
    }
});

radio.onReceivedString(function (receivedString) {
    if (receivedString == "A_pressed") {
        turnLeft = false;
        turnRight = true;
    } else if (receivedString == "B_pressed") {
        turnLeft = true;
        turnRight = false;
    } else {
        turnLeft = false;
        turnRight = false;
    }
});

//let retezec: string = "1,5,3,128,8,9"
//forever není uvnitř ifu
//type Protokol = { //ne víc než 19 znaků
//    x: number;
//    y: number;
//    A: boolean;
//    B: boolean;
//    Logo: boolean;
//    p2: boolean
//}

//    radio.onReceivedString(function (receivedString) {
//        if (receivedString == "A_pressed") {
//            if (!input.buttonIsPressed(Button.A)) {
//                    PCAmotor.MotorRun(PCAmotor.Motors.M1, 200)
//                } else {
//                    PCAmotor.MotorRun(PCAmotor.Motors.M1, 200)
//                }
//            }
//        }
//        if ("B_pressed") {
//           if(holdTime>=1000){
//                PCAmotor.MotorRun(PCAmotor.Motors.M1, 0)
//            }
//        }
//    })

//příště const allPins: array<number> = [pins.wr, pins.w1,]
//příště na čáry pins.setPull(pin, pinPullMode.PullMode)

//enum pins = {
//    w1 = DigitalPin.P6;
//}

//ir.r
//funkce která bude hýbyt kolama
//funkce kde budeme zvyšovat rychlost


//const carMotor = (s1: number = 0, sr: number = 0) => {
//    if(s1===0&&sr===0){ PCAmotor.MotorStopAll(); return;}
//
//}


//basic.forever(function () { //VŽDY PAUZA WOW!!!
//    strip.rotate()
//    strip.show();
//    basic.pause(10);
//})


//PCAmotor.GeekServo(PCAmotor.Servos.S1, 1500);
//PCAmotor.MotorRun(PCAmotor.Motors.M1, 200); zapnutí motoru
//PCAmotor.MotorRun(PCAmotor.Motors.M4, 200);


//basic.forever(function () {
//    PCAmotor.GeekServo(PCAmotor.Servos.S1, 1500)
//    basic.pause(500)
//    PCAmotor.GeekServo(PCAmotor.Servos.S1, 1100)
//    basic.pause(1000)
//    PCAmotor.MotorRun(PCAmotor.Motors.M1, 150);
//    basic.pause(2000)
//        PCAmotor.StopServo(PCAmotor.Servos.S1)
//})
//standardní rozsah 1000-2000 (střed:1500)
//rozšířený rozsah je 500-2500 , nikdy mimo toto jít, 800 2300 nejlepší průměrově
//nepoužívat přes minuty
//když se nepoužívá vypnout
//255 max LOL


//let encode = (toEncode: Protokol): string => {
//    let result: string = ""
//    result=
//    $(toEncode.x).$(toEncode.y).$(toEncode.A).$(toEncode.B).$(toEncode.Logo).$(toEncode.p2);
//    result = toEncode.x + "," + toEncode.y + "," + toEncode.A + "," + toEncode.B + "," + toEncode.Logo + "," + toEncode.p2;
//    //Math.map
//
//    return result;
//}

//let x = 888;//-1024 - 1023
//Math.map(x) //0..512(-256)
//x= Math.map(x, -1024, 1023, 0, 512) //0..512(-256)
//trigger reproduktor
//echo mikrofon

//basic.forever(()=>{
//    ir.cm = sensors;
//})

//pins.setPull(trig, 0);
//pins.digitalWritePin(DigitalPin.P0, 0)
//pins.digitalWritePin(trig, 0);
//control.waitMicros(2);
//pins.digitalWritePin(trig, 1);
//control.waitMicros(10);
//pins.digitalWritePin(trig, 0);


//let decode = (incognita, string): Protokol => { //odečíst
//    return {
//        x: 683,
//        y: 325,
//        A: true,
//        B: false,
//        Logo: true,
//        p2: false
//    }
//};

//radio.setTransmitSerialNumber(true)

//let strip = neopixel.create(DigitalPin.P16, 64, NeoPixelMode.RGB)//?/kolik ledek v sérii
//+1 šroubováky křižáky + plochý šroubovák 4-5
//strip.setBrightness(15);
//za 2 týdny(ovládání s ovladačem) a 3 týdny