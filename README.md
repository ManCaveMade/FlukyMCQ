# Fluky MCQ
**Copyright (C) Mitchell A. Cox (ManCave Made)** [mitch at enox dot co dot za], MIT License

An AngularJS SPA to aid in the marking of scanned multiple choice cards.

### MCQ Card Format

It appears from inspection that the MCQ card format after being scanned in is simple ASCII. A sample line is shown below, where it is clear that X's mark where the circles have been filled in and .'s are blank. On an A - E card, every 5 characters implies the next question. Each line is a new card.

**Example MCQ Scan output:**

289000025001040816101   5312 #0001    N 1234567 X.......X..X...X...X........X....X...X....X...X....X.....X...XX...X.X....X....X............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................

**Data Positions:**

Data - 49 to EOL

Student Number - 41 to 48
