//Firmware for Sarah Busch and Emily Wolfe's IoT Smart Lamp
//using a Particle Photon dev board and LED breakout board designed by Emily Wolfe
//Written by Sarah Rosanna Busch in October 2016

const int red1 = D0; //five pins control the red leds
const int red2 = D1;
const int red3 = D2;
const int red4 = D3;
const int red5 = D4;
const int warmWhite1 = A0; //two pins have warm white leds
const int warmWhite2 = A1;
const int white = A2; //one warm one cool
const int coolWhite1 = A3; //two pins have cool white leds
const int coolWhite2 = A4;

const int lightSensor = A5; //photoresistor
const int sensorPower = A6; //power to photoresistor

int analogLight; //to store the value read on A6
int hour; //for debugging
String setting = "off"; //on bootup lamp is off

bool automated = false;
Timer checkLight(60000, readLight); //when in auto mode the sensor will periodically check the light level

void setup()
{
    pinMode(red1, OUTPUT);
    pinMode(red2, OUTPUT);
    pinMode(red3, OUTPUT);
    pinMode(red4, OUTPUT);
    pinMode(red5, OUTPUT);
    pinMode(warmWhite1, OUTPUT);
    pinMode(warmWhite2, OUTPUT);
    pinMode(white, OUTPUT);
    pinMode(coolWhite1, OUTPUT);
    pinMode(coolWhite2, OUTPUT);

    //ensure all LEDs are off to start
    digitalWrite(red1, LOW);
    digitalWrite(red2, LOW);
    digitalWrite(red3, LOW);
    digitalWrite(red4, LOW);
    digitalWrite(red5, LOW);
    digitalWrite(warmWhite1, LOW);
    digitalWrite(warmWhite2, LOW);
    digitalWrite(white, LOW);
    digitalWrite(coolWhite1, LOW);
    digitalWrite(coolWhite2, LOW);

    //declaration of Particle.function()s to be accessed from the cloud
    //requesting "day" runs dayLight() from this app
    Particle.function("day", dayLight);
    Particle.function("warm", warmLight);
    Particle.function("evening", eveningLight);
    Particle.function("night", nightLight);
    Particle.function("off", lampOff);
    Particle.function("auto", automate);

    Particle.variable("setting", &setting, STRING);

    //light sensor
    pinMode(lightSensor, INPUT); //reads analog value on pin A5
    pinMode(sensorPower, OUTPUT); //provides constant voltage to A6

    //digitalWrite(sensorPower, LOW); //make sure photoresistor is not powered on startup

    //declaration of Particle.variable()s that can be accessed from the cloud
    //requesting "lightLevel" references 'analogLight' in this app
    Particle.variable("lightLevel", &analogLight, INT);
    Particle.variable("hour", &hour, INT);

    readLight(); //to get an initial light level value

    Time.zone(-7); //Pacific time is UTC-8, but daylight savings (future version will allow user to enter their timezone)
    hour = Time.hour(); //Photon sets its time automatically the first time it connects to the cloud
}

int automate(String nil)
{
    automated = true;
    setting = "auto";
    checkLight.start(); //check light level periodically
    return 1;
}

void loop()
{
    if(automated)
    {
        hour = Time.hour(); //declared as Particle.variable for debugging
        //int hour = Time.hour();
        //int minute = Time.minute();

        if((hour >= 6 && hour < 7) || (hour >= 18 && hour < 21))
        {
            //warm light
            digitalWrite(red1, HIGH);
            digitalWrite(red2, HIGH);
            digitalWrite(red3, HIGH);
            digitalWrite(red4, HIGH);
            digitalWrite(red5, HIGH);
            digitalWrite(warmWhite1, HIGH);
            digitalWrite(warmWhite2, HIGH);
            digitalWrite(white, LOW);
            digitalWrite(coolWhite1, LOW);
            digitalWrite(coolWhite2, LOW);
        }
        else if((hour >= 7) && (hour < 18) && (analogLight < 100))
        {
            //daylight
            digitalWrite(red1, HIGH);
            digitalWrite(red2, HIGH);
            digitalWrite(red3, HIGH);
            digitalWrite(red4, HIGH);
            digitalWrite(red5, HIGH);
            digitalWrite(warmWhite1, HIGH);
            digitalWrite(warmWhite2, HIGH);
            digitalWrite(white, HIGH);
            digitalWrite(coolWhite1, HIGH);
            digitalWrite(coolWhite2, HIGH);
        }
        else if((hour >= 21) && (hour < 22))
        {
            //evening light
            digitalWrite(red1, HIGH);
            digitalWrite(red2, HIGH);
            digitalWrite(red3, HIGH);
            digitalWrite(red4, HIGH);
            digitalWrite(red5, HIGH);
            digitalWrite(warmWhite1, LOW);
            digitalWrite(warmWhite2, LOW);
            digitalWrite(white, LOW);
            digitalWrite(coolWhite1, LOW);
            digitalWrite(coolWhite2, LOW);
        }
        else if((hour >= 22) && (hour < 23))
        {
            //night light
            digitalWrite(red1, HIGH);
            digitalWrite(red2, HIGH);
            digitalWrite(red3, HIGH);
            digitalWrite(red4, LOW);
            digitalWrite(red5, LOW);
            digitalWrite(warmWhite1, LOW);
            digitalWrite(warmWhite2, LOW);
            digitalWrite(white, LOW);
            digitalWrite(coolWhite1, LOW);
            digitalWrite(coolWhite2, LOW);
        }
        else
        {
            //lamp off
            digitalWrite(red1, LOW);
            digitalWrite(red2, LOW);
            digitalWrite(red3, LOW);
            digitalWrite(red4, LOW);
            digitalWrite(red5, LOW);
            digitalWrite(warmWhite1, LOW);
            digitalWrite(warmWhite2, LOW);
            digitalWrite(white, LOW);
            digitalWrite(coolWhite1, LOW);
            digitalWrite(coolWhite2, LOW);
        }
    }
}

void killAuto()
{
    automated = false;
    checkLight.stop();
}

void readLight() //has to be a void for the Timer class to call it
{
    //turn on power to the photoresistor
    digitalWrite(sensorPower, HIGH);
    delay(100);

    //get the analog value of the photoresistor
    analogLight = analogRead(lightSensor);
    delay(100);

    //turn power to photoresistor off
    digitalWrite(sensorPower, LOW);
    delay(100);
}

//Particle.functions must take a string as an argument and return an integer
int dayLight(String command)
{
    killAuto();
    if(automated == false)
        setting = "day";

    digitalWrite(red1, HIGH);
    digitalWrite(red2, HIGH);
    digitalWrite(red3, HIGH);
    digitalWrite(red4, HIGH);
    digitalWrite(red5, HIGH);
    digitalWrite(warmWhite1, HIGH);
    digitalWrite(warmWhite2, HIGH);
    digitalWrite(white, HIGH);
    digitalWrite(coolWhite1, HIGH);
    digitalWrite(coolWhite2, HIGH);

    return 1;
}

int warmLight(String command) //cool whites turn off
{
    killAuto();
    if(automated == false)
        setting = "warm";

    digitalWrite(red1, HIGH);
    digitalWrite(red2, HIGH);
    digitalWrite(red3, HIGH);
    digitalWrite(red4, HIGH);
    digitalWrite(red5, HIGH);
    digitalWrite(warmWhite1, HIGH);
    digitalWrite(warmWhite2, HIGH);
    digitalWrite(white, LOW);
    digitalWrite(coolWhite1, LOW);
    digitalWrite(coolWhite2, LOW);

    return 1;
}

int eveningLight(String command) //all whites are off
{
    killAuto();
    if(automated == false)
        setting = "evening";

    digitalWrite(red1, HIGH);
    digitalWrite(red2, HIGH);
    digitalWrite(red3, HIGH);
    digitalWrite(red4, HIGH);
    digitalWrite(red5, HIGH);
    digitalWrite(warmWhite1, LOW);
    digitalWrite(warmWhite2, LOW);
    digitalWrite(white, LOW);
    digitalWrite(coolWhite1, LOW);
    digitalWrite(coolWhite2, LOW);

    return 1;
}

int nightLight(String command) //just a couple reds are on
{
    killAuto();
    if(automated == false)
        setting = "night";

    digitalWrite(red1, HIGH);
    digitalWrite(red2, HIGH);
    digitalWrite(red3, HIGH);
    digitalWrite(red4, LOW);
    digitalWrite(red5, LOW);
    digitalWrite(warmWhite1, LOW);
    digitalWrite(warmWhite2, LOW);
    digitalWrite(white, LOW);
    digitalWrite(coolWhite1, LOW);
    digitalWrite(coolWhite2, LOW);

    return 1;
}

int lampOff(String command)
{
    killAuto();
    if(automated == false)
        setting = "off";

    digitalWrite(red1, LOW);
    digitalWrite(red2, LOW);
    digitalWrite(red3, LOW);
    digitalWrite(red4, LOW);
    digitalWrite(red5, LOW);
    digitalWrite(warmWhite1, LOW);
    digitalWrite(warmWhite2, LOW);
    digitalWrite(white, LOW);
    digitalWrite(coolWhite1, LOW);
    digitalWrite(coolWhite2, LOW);

    return 1;
}
