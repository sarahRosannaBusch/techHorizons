//Firmware for Sarah Busch and Emily Wolfe's GPS/3G Pet tracking device
//Uses a Particle Electron and a Nano Hornet GPS Click board
//written by Sarah Busch in November 2016

const int gpsOn = D0; //a pulse of 100ms is recommended to turn gps module on
String gps = "";
String batteryVoltage = "";
String fuelLevel = "";

void setup()
{
    //initialize gps stuff
    Serial1.begin(4800); //default is 8 bits, no parity, 1 stop bit (which seems to be what the GPS sends)
    pinMode(gpsOn, OUTPUT); //giving a pulse to the on/off pin of the nano hornet turns it on/off
    digitalWrite(gpsOn, LOW);

    //initialize batterystuff
    //Particle.function("battery", fuelGauge);
    Particle.variable("batteryVolts", &batteryVoltage, STRING);
    Particle.variable("batteryLevel", &fuelLevel, STRING);

    //Time.zone(-8);
}

void loop()
{
    fuelGauge();
    gpsData();
}

void gpsData()
{
    gpsPulse(); //turn GPS on
    delay(37000); //wait so nano can get a fix

    gps = "";
    int bytes = Serial1.available();
    for(int count=0; count < bytes; count++)
    {
        gps += Serial1.readString();
    }

    gpsPulse(); //turn GPS off
    publish();
}

void gpsPulse()
{
    delay(500); //to ensure there is at least 1s between pulses, as recommended by the manufacturer
    digitalWrite(gpsOn, HIGH); //gives the gps module a pulse to turn it on
    delay(100); //100ms as recommended by nano hornet datasheet
    digitalWrite(gpsOn, LOW);
    delay(500);
}

void publish()
{
    bool success;
    success = Particle.publish("trackerData", gps);
    if (!success)
    {
      // if event publish did not work
      //lastTime = 0; //so it will try again
      //publish();
    }
}

int fuelGauge() //Particle functions must take a String and return an int
{
    FuelGauge fuel;
    double batteryV = fuel.getVCell();
    double fuelLvl = fuel.getSoC(); //state of charge

    batteryVoltage = String::format("%.3f", batteryV);
    fuelLevel = String::format("%.1f", fuelLvl);

    return 1;
}
