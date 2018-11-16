#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;

void send()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Servidor udp conectado com o cliente esp8266, valor enviado: ");
    String msg = "{\"send\":true}";
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

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);

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
}

void loop()
{
  send();
  delay(5);
}
