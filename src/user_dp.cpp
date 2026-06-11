#include "user_db.h"

User database[MAX_USERS];
int totalCards = 0;

String formatMSSV(int index) {
    char buf[10]; 
    sprintf(buf, "231%04d", index); 
    return String(buf);
}

int findUserIndex(uint32_t uidHash) {
    for (int i = 0; i < totalCards; i++) {
        if (database[i].uidHash == uidHash) return i;
    }
    return -1;
}