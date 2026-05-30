#ifndef USER_DB_H
#define USER_DB_H

#include <Arduino.h>

struct User {
  uint32_t uidHash;
  int idIndex;
  char name[32];
};

extern User database[];
extern const int totalCards;

String formatMSSV(int index);
int findUserIndex(uint32_t uidHash);

#endif