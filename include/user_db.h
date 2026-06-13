#ifndef USER_DB_H
#define USER_DB_H

#include <Arduino.h>

#define MAX_USERS 100

struct User {
  uint32_t uidHash;
  int idIndex;
  char name[32];
  char className[64]; 
  int startH, startM; 
  int endH, endM;
  int lateH, lateM;
};

extern User database[MAX_USERS];
extern int totalCards;

String formatMSSV(int index);
int findUserIndex(uint32_t uidHash);

#endif