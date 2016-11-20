//Firmware for ELEX290 seed hopper using a Particle Photon, positional servo, and photoresistors
//written by Sarah Rosanna Busch in October 2016

//A servo will open and close a gate to let seeds fall out
//Servo is connected to the 3.3V Vin (red), GND (brown), and a PWM pin (yellow)
Servo myServo; //servo library is built in to the Particle P0 module being used
const int servoPin = D1; //PWM
int servoPos = 140; //the gate starts closed (can be any integer between 0 and 180)

//An led and four photoresistors will monitor seed levels in the hopper
const int led = D0;

const int fullPower = A1; //power the photoresistors
const int twoPower = A3;
const int onePower = A5;
const int emptyPower = A7;

const int readFull = A0; //read the photoresistors
const int readTwo = A2;
const int readOne = A4;
const int readEmpty = A6;

int analogFull; //to store the values read off the photoresistors
int analogTwo;
int analogOne;
int analogEmpty;

int seedLevel; //to tell the cloud the result of the analog readings

void setup()
{
    //initialize Servo
    myServo.attach(servoPin); //attach the PWM pin to the data line on the servo
    Particle.function("servo", servoControl); //when 'servo' is called from the cloud servoControl() runs
    Particle.variable("servoPos", &servoPos , INT); //Make the variable 'servoPos' available through the cloud

    //initialize optoelectronics
    pinMode(led, OUTPUT); //all digi pins being used are outputs
    pinMode(fullPower, OUTPUT);
    pinMode(twoPower, OUTPUT);
    pinMode(onePower, OUTPUT);
    pinMode(emptyPower, OUTPUT);

    pinMode(readFull, INPUT); //reads analog values of photoresistors
    pinMode(readTwo, INPUT);
    pinMode(readOne, INPUT);
    pinMode(readEmpty, INPUT);

    digitalWrite(led, LOW); //ensure all OUTPUTs are off to start
    digitalWrite(fullPower, LOW);
    digitalWrite(twoPower, LOW);
    digitalWrite(onePower, LOW);
    digitalWrite(emptyPower, LOW);

    Particle.variable("A0", &analogFull, INT); //these are just for testing to see what level is on each resistor
    Particle.variable("A1", &analogTwo, INT);
    Particle.variable("A2", &analogOne, INT);
    Particle.variable("A3", &analogEmpty, INT);
    Particle.variable("seedLvl", &seedLevel, INT);

    Particle.function("readSeeds", readSeeds); //calling 'readSeeds' from the cloud runs readSeeds()
}

void loop()
{
    //functions for automated controls will go here
}

int readSeeds(String command) //detects seed level
{
    //test one photoresistor at a time (because when I did them all at once my Photon died)
    digitalWrite(led, HIGH); //turn on LED

    digitalWrite(fullPower, HIGH); //power top photoresistor
    delay(100); //to make sure everything's on before taking readings
    analogFull = analogRead(readFull); //read analog value at top PR
    delay(100); //to make sure readings are complete
    digitalWrite(fullPower, LOW); //turn power to top resistor off
    delay(100);

    digitalWrite(twoPower, HIGH);
    delay(100);
    analogTwo = analogRead(readTwo);
    delay(100);
    digitalWrite(twoPower, LOW);
    delay(100);

    digitalWrite(onePower, HIGH);
    delay(100);
    analogOne = analogRead(readOne);
    delay(100);
    digitalWrite(onePower, LOW);
    delay(100);

    digitalWrite(emptyPower, HIGH);
    delay(100);
    analogEmpty = analogRead(readEmpty);
    delay(100);
    digitalWrite(emptyPower, LOW);
    delay(100);

    digitalWrite(led, LOW); //turns led off when it's not needed


    if(analogFull < 50) //seeds are covering the top photoresistor (these values need calibration)
        seedLevel = 0; //full
    else
    {
        if(analogFull > 50) //nothing is covering the top PR
            seedLevel = 1; //two-thirds full
        if(analogTwo > 50) //nothing is covering second one down
            seedLevel = 2; //one-third full
        if(analogOne > 50) //three PRs are uncovered
            seedLevel = 3; //seeds low
        if(analogEmpty > 50)
            seedLevel = 4; //empty
    }

    return 1;
}

int servoControl(String command) //gate is closed when servo is at 140 and open when at 40 (these numbers will need calibration)
{
    myServo.write(40);
    delay(2000); //delay for amount of time it takes to dispense 1 tsp
    myServo.write(140);
    delay(100);
    return 1;
}
