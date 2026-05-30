#include "user_db.h"

User database[] = {
  {0xEA68F834, 0, "Vo Thi Xuan Thuy"}, 
  {0x3297ABC2, 1, "Thi Minh Thuc"},
  {0x82AB379F, 2, "Huy Thinh"},
  {0xB52A1012, 3, "Tran Quang Vinh"}
};

const int totalCards = sizeof(database) / sizeof(database[0]);

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