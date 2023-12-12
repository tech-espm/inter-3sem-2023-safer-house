#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>

#include "Senha.h"

#define SS_PIN D8
#define RST_PIN D0

MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

MFRC522::MIFARE_Key key;

void setup() {

  Serial.begin(115200);

 	SPI.begin(); // Init SPI bus
 	rfid.PCD_Init(); // Init MFRC522
 	Serial.println();
 	Serial.print(F("Leitor RFID: "));
 	rfid.PCD_DumpVersionToSerial();
 	Serial.println();

  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado! IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
 	// Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
 	if (!rfid.PICC_IsNewCardPresent())
 		return;

 	// Verify if the NUID has been readed
 	if (!rfid.PICC_ReadCardSerial())
 		return;

 	Serial.print(F("PICC: "));
 	MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
 	Serial.println(rfid.PICC_GetTypeName(piccType));

 	// Halt PICC
 	rfid.PICC_HaltA();

 	// Stop encryption on PCD
 	rfid.PCD_StopCrypto1();

 	// Check is the PICC of Classic MIFARE type
 	if (piccType != MFRC522::PICC_TYPE_MIFARE_MINI &&
 			piccType != MFRC522::PICC_TYPE_MIFARE_1K &&
 			piccType != MFRC522::PICC_TYPE_MIFARE_4K)
 			return;

  String id_pessoa, entrada;
 	switch (rfid.uid.uidByte[0]) {
    case 101:
      id_pessoa = "1";
      entrada = "1";
      break;
    case 133:
      id_pessoa = "1";
      entrada = "0";
      break;
    case 22:
      id_pessoa = "2";
      entrada = "1";
      break;
    case 70:
      id_pessoa = "2";
      entrada = "0";
      break;
    default:
      Serial.println("Pessoa nao cadastrada");
      return;
 	}
  Serial.print(id_pessoa);
  Serial.print(" / ");
  Serial.println(entrada);

  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
    WiFiClient client;
    HTTPClient http;

    Serial.print("Enviando: ");
    Serial.print(id_pessoa);
    Serial.print(" / ");
    Serial.println(entrada);

    Serial.print("[HTTP] Conectando...\n");
    // configure traged server and url
    http.begin(client, "http://" SERVER_IP "/logar/");  // HTTP
    http.addHeader("Content-Type", "application/json");

    Serial.print("[HTTP] POST...\n");
    String json = "{\"id_pessoa\":\"";
    json += id_pessoa;
    json += "\",\"entrada\":";
    json += entrada;
    json += "}";
    // start connection and send HTTP header and body
    int httpCode = http.POST(json);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("Dados recebidos:\n<<");
        Serial.println(payload);
        Serial.println(">>");
      }
    } else {
      Serial.printf("[HTTP] POST... Erro: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();

    delay(5000);
  }
}