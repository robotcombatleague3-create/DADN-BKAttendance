#ifndef SERVO_MANAGER_H
#define SERVO_MANAGER_H

#include <Arduino.h>
#include <ESP32Servo.h>
#include "shared_data.h"
#include "config.h"

void setup_servo();
void unlock_gate();
void servoTask(void *pvParameters);

#endif