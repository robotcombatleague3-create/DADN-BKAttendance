#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>
#include <DHT.h>
#include "shared_data.h"
#include "config.h"


void sensorTask(void *pvParameters);

#endif