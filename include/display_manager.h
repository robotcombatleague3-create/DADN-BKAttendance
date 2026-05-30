#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <LiquidCrystal_I2C.h>
#include "shared_data.h"
#include "config.h"

extern LiquidCrystal_I2C lcd;

enum UIState { UI_IDLE, UI_GRANTED_BEEP_ON, UI_GRANTED_BEEP_OFF, UI_DENIED_BEEP_ON, UI_DENIED_BEEP_OFF, UI_COOLDOWN };

void setup_display_hardware();
void showWelcome();
void updateTimeDisplay();
void showServerMessageLocal(String msg);
void triggerVisualFeedback(bool granted, String mssv, String name, int status, int session);
void handle_ui_state_machine();
bool isUIReady();
void displayTask(void *pvParameters);

#endif