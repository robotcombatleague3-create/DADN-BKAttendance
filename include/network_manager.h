#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>
#include "shared_data.h"
#include "config.h"

extern const char* ssid;
extern const char* password;
extern const char* mqtt_topic_pub;
extern const char* mqtt_topic_sub;

void setup_wifi_and_time();
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void mqtt_reconnect();
void networkTask(void *pvParameters);

#endif