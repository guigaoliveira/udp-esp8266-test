#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;
String msg;
const unsigned int tMax = 50; //50ms
unsigned int lastTime;

/* Assign a unique ID to this sensor at the same time */
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

void send(float x, float eleMio);

void setup(void)
{
#ifndef ESP8266
  while (!Serial)
    ; // for Leonardo/Micro/Zero
#endif
  Serial.begin(115200);
  Serial.println("Accelerometer Test");
  Serial.println("");
  /* Initialise the sensor */
  if (!accel.begin())
  {
    /* There was a problem detecting the ADXL345 ... check your connections */
    Serial.println("Ooops, no ADXL345 detected ... Check your wiring!");
    while (1)
      ;
  }
  accel.setRange(ADXL345_RANGE_16_G);

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(A0, INPUT);
  digitalWrite(LED_BUILTIN, 0);
  WiFi.begin("saiot", "u2345678");
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
  lastTime = millis();
}

void loop(void)
{
  if (millis() - lastTime > 500)
  {
    /* Get a new sensor event */
    sensors_event_t event;
    accel.getEvent(&event);
    send(event.acceleration.x, analogRead(A0));
    lastTime = millis();
  }
}

void send(float x, float eleMio)
{
  /* Display the results (acceleration is measured in m/s^2) */
  /*Serial.print("X: ");
  Serial.print(x);
  Serial.println("m/s^2 ");
  Serial.print("EletroMio: ");
  Serial.println(eleMio);*/
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Servidor udp conectado com o cliente esp8266, valor enviado: ");
    msg = "{\"tag\":\"mov\",\"y\":" + String(x) + "}";
    Serial.println(msg);
    udp.beginPacket("10.7.227.121", 41234);
    udp.println(msg);
    udp.endPacket();

    digitalWrite(LED_BUILTIN, 0);
    delay(5);
    digitalWrite(LED_BUILTIN, 1);

    msg = "{\"tag\":\"emg\",\"y\":" + String(eleMio) + "}";
    Serial.println(msg);
    udp.beginPacket("10.7.227.121", 41234);
    udp.println(msg);
    udp.endPacket();

    digitalWrite(LED_BUILTIN, 0);
    delay(5);
    digitalWrite(LED_BUILTIN, 1);
  }
  else
  {
    Serial.println("Servidor udp não conectado com o cliente esp8266");
    digitalWrite(LED_BUILTIN, 0);
    delay(250);
    digitalWrite(LED_BUILTIN, 1);
  }
}