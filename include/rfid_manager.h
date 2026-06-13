#ifndef RFID_MANAGER_H
#define RFID_MANAGER_H

#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <time.h>
#include "shared_data.h"
#include "config.h"
#include "display_manager.h"
#include "user_db.h"
#include "servo_manager.h"
#include "network_manager.h"

void rfidTask(void *pvParameters);

#endif