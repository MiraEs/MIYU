// defines pins numbers
const int trigPin = 12;
const int echoPin = 13;
const int RED = 9;
const int GREEN = 8;
const int YELLOW = 10;
// defines variables
long duration;
int distance;
void setup() {
pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
pinMode(echoPin, INPUT); // Sets the echoPin as an Input
pinMode(GREEN,OUTPUT);
pinMode(RED,OUTPUT);
pinMode(YELLOW,OUTPUT);
Serial.begin(9600); // Starts the serial communication

}
void loop() {
// Clears the trigPin
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
// Sets the trigPin on HIGH state for 10 micro seconds
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
// Reads the echoPin, returns the sound wave travel time in microseconds
duration = pulseIn(echoPin, HIGH);
// Calculating the distance
distance= duration*0.034/2;
// Prints the distance on the Serial Monitor
Serial.print("Distance: ");
Serial.println(distance);

if ( distance < 10 ) {
  digitalWrite(RED, HIGH);
  digitalWrite(GREEN,LOW);
  digitalWrite(YELLOW, LOW);
}
else if ((distance > 10) && (distance <  30)) {
  digitalWrite(RED, LOW);
  digitalWrite(GREEN,LOW);
  digitalWrite(YELLOW, HIGH);
}
else {
  digitalWrite(RED,LOW);
  digitalWrite(GREEN,HIGH);
  digitalWrite(YELLOW, LOW);
}
}
