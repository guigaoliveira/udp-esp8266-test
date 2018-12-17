#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>

WiFiUDP udp;

int tam = 25;

unsigned long lastTime;

String timeMili;
void send()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Servidor udp conectado com o cliente esp8266, valor enviado: ");
    String arrSamples = "[";
    String arrDate = "[";
    int i = 0;
    while (i < tam)
    {
      if ((millis() - lastTime) > 1)
      {
        Serial.println(atoi(timeMili.c_str()));
        arrSamples += String(analogRead(A0));
        arrDate += timeMili;
        if (i < tam - 1)
        {
          arrSamples += ",";
          arrDate += ",";
        }
        lastTime = millis();
        i++;
      }
    }
    arrSamples += "]";
    arrDate += "]";

    String msg = "{\"y\":" + arrSamples + ",\"tag\":\"emg\", \"x\":" + arrDate + "}";
    Serial.println(msg);
    udp.beginPacket("10.7.227.121", 41235);
    udp.println(msg);
    udp.endPacket();
    delay(1000);
    //digitalWrite(LED_BUILTIN, 0);
    //delay(1);
    //digitalWrite(LED_BUILTIN, 1);
  }
  else
  {
    Serial.println("Servidor udp não conectado com o cliente esp8266");
    digitalWrite(LED_BUILTIN, 0);
    delay(250);
    digitalWrite(LED_BUILTIN, 1);
  }
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(A0, INPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();
  Serial.println("Starting setup");

  Serial.print("Scan start ... ");
  int n = WiFi.scanNetworks();
  Serial.print(n);
  Serial.println(" network(s) found");
  for (int i = 0; i < n; i++)
  {
    Serial.println(WiFi.SSID(i));
  }
  Serial.println();

  WiFi.disconnect(true);
  WiFi.setAutoConnect(false);
  WiFi.setPhyMode(WIFI_PHY_MODE_11G);
  WiFi.begin("saiot", "u2345678");
  WiFi.printDiag(Serial);
  Serial.println(WiFi.getPhyMode());

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  delay(2000);
  HTTPClient http;

  http.begin("http://dev.api.saiot.ect.ufrn.br/v1/device/history/datetime/millis"); //Specify request destination

  int httpCode = http.GET();   //Send the request
  timeMili = http.getString(); //Get the response payload

  Serial.println(httpCode); //Print HTTP return code
  Serial.println(timeMili); //Print request response payload

  http.end(); //Close connection
}

void loop()
{
  send();
}