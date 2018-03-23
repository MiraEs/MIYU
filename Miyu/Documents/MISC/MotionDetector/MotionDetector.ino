int motion = 5;
int motionLed = 13;
int val = 0;

void setup() {
  pinMode(motion, INPUT); // We are reading values from the sensor, so it's an input
  pinMode(motionLed, OUTPUT); // We are asking the LED to turn on and off so it's and output
  Serial.begin(9600);
}

void loop() {
   val = digitalRead(motion);
  if (val == HIGH){
    Serial.println("Motion detected!");
     digitalWrite (motionLed, HIGH);
   }
   else
   {
     Serial.println("No motion is being detected at the moment!");
      digitalWrite (motionLed, LOW);
   }
}

