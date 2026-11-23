import type { TrackChecklistItem, TrackDaySchedule } from '../types';

export const DSA_PDF_URL = '/assets/aistudio/DSA_CPP_100_Day_180_Style_Daily_Curriculum_7bad3ece.pdf';
export const DSA_PDF_FILENAME = 'DSA_CPP_100_Day_180_Style_Daily_Curriculum.pdf';
export const DSA_START_DATE = '23 Nov 2026';
export const DSA_END_DATE = '02 Mar 2027';

export const DSA_PLAN_OVERVIEW = {
  title: 'DSA IN C++ — 100-DAY COMPLETE DAILY PREPARATION PLAN',
  subtitle: '180-day RAG plan-style daily curriculum · Day 1 to Day 100',
  calendarSummary:
    'Calendar: 23 November 2026 – 02 March 2027 | Monday–Friday: 90 minutes | Saturday: 2 hours revision | Sunday: 2 hours revision | Total: 100 consecutive calendar days.',
  dailyStructure:
    'Every day contains a defined topic or revision theme, Class focus, Objective, Student work and Milestone / output. Weekday topics are sequenced in order. Saturday is a weekly practical revision/checkpoint; Sunday consolidates the week and prepares for the next one.',
  scopeNote:
    'Expanded beginner-to-interview DSA learning design based on the agreed scope: start with C++ because the learner is a beginner, then progress through core data structures and algorithms. Each weekday topic is allocated to a specific calendar day; weekend entries are revision and assessment, not new topics.',
  completionRule:
    'Mark a day complete only after completing its student work and saving the stated milestone/output.',
  phases: [
    'C++ programming foundations (Days 1–20): Environment, syntax, data types, control flow, functions, arrays, strings, pointers, OOP and recursion.',
    'Complexity and STL (Days 21–30): Complexity analysis, STL containers, algorithms, searching and sorting.',
    'Core problem-solving patterns (Days 31–50): Searching, sorting, hashing, two pointers, sliding window, prefix sums and linked lists.',
    'Data structures and algorithms (Days 51–80): Stacks, queues, trees, BSTs, heaps, greedy, backtracking and dynamic programming.',
    'Graphs and interview readiness (Days 81–100): Graph algorithms, DSU, bit manipulation, mixed problem-solving, assessments and consolidation.'
  ]
};

interface RawDsaDay {
  day: number;
  topic: string;
  classFocus: string;
  objective: string;
  studentWork: string;
  milestoneOutput: string;
  dailyScope: string;
}

const SATURDAY_ENTRY = (day: number): RawDsaDay => ({
  day,
  topic: 'Weekly practical revision and assessment',
  classFocus: 'Weekly preparation review and practical assessment',
  objective:
    "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
  studentWork:
    'Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.',
  milestoneOutput: 'Weekly coding assessment, corrected solutions, score and updated DSA error log.',
  dailyScope:
    'Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.'
});

const SUNDAY_ENTRY = (day: number): RawDsaDay => ({
  day,
  topic: 'Weekly revision and consolidation',
  classFocus: 'Weekly revision, consolidation and next-week preparation',
  objective:
    "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
  studentWork:
    "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
  milestoneOutput: 'Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.',
  dailyScope:
    "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic."
});

const RAW_DSA_DAYS: RawDsaDay[] = [
  {
    day: 1,
    topic: 'C++ setup and first program',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand compiler, source file, compile/run cycle and basic program structure.',
    studentWork:
      'Set up or verify a C++17 compiler. Write Hello World, add comments, compile, run, deliberately introduce one syntax error and fix it.',
    milestoneOutput: 'A working hello.cpp and a short note on compile errors.',
    dailyScope:
      'C++ setup and first program. Understand compiler, source file, compile/run cycle and basic program structure.'
  },
  {
    day: 2,
    topic: 'Variables and data types',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Learn int, long long, float, double, char, bool, constants and type conversion.',
    studentWork:
      'Write a program that stores name/age/marks, prints values and converts between integer and floating-point values. Test boundary values.',
    milestoneOutput: 'One program using at least five data types.',
    dailyScope:
      'Variables and data types. Learn int, long long, float, double, char, bool, constants and type conversion.'
  },
  {
    day: 3,
    topic: 'Operators and expressions',
    classFocus: 'Guided coding / practical implementation',
    objective:
      'Understand arithmetic, relational, logical, assignment operators, precedence and integer division.',
    studentWork:
      'Build a two-number calculator. Test division, remainder, comparison and logical conditions. Predict outputs before running.',
    milestoneOutput: 'Calculator program plus five expression dry-runs.',
    dailyScope:
      'Operators and expressions. Understand arithmetic, relational, logical, assignment operators, precedence and integer division.'
  },
  {
    day: 4,
    topic: 'Conditionals',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Learn if, else-if, nested if and switch-case.',
    studentWork:
      'Write programs for even/odd, largest of three numbers, grade calculator and simple menu-driven calculator.',
    milestoneOutput: 'Four small conditional programs.',
    dailyScope: 'Conditionals. Learn if, else-if, nested if and switch-case.'
  },
  {
    day: 5,
    topic: 'Loops',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand for, while, do-while, counters and accumulators.',
    studentWork: 'Print 1–100, multiplication table, sum of first N numbers and factorial using loops.',
    milestoneOutput: 'Four loop exercises with dry-run notes.',
    dailyScope: 'Loops. Understand for, while, do-while, counters and accumulators.'
  },
  SATURDAY_ENTRY(6),
  SUNDAY_ENTRY(7),
  {
    day: 8,
    topic: 'Nested loops and debugging',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Learn nested loops, break, continue and off-by-one errors.',
    studentWork:
      'Print a rectangle, right triangle and number pattern. Trace loop variables on paper and fix one intentional bug.',
    milestoneOutput: 'Three pattern programs and a debugging note.',
    dailyScope: 'Nested loops and debugging. Learn nested loops, break, continue and off-by-one errors.'
  },
  {
    day: 9,
    topic: 'Functions',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand function declaration, definition, parameters, return values and scope.',
    studentWork:
      'Create functions for add, maximum, prime check and factorial. Call them from main and test multiple inputs.',
    milestoneOutput: 'Four reusable functions in one program.',
    dailyScope:
      'Functions. Understand function declaration, definition, parameters, return values and scope.'
  },
  {
    day: 10,
    topic: 'References and function overloading',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand pass-by-value, pass-by-reference, const reference and overload resolution.',
    studentWork:
      'Write swap-by-value and swap-by-reference programs. Create overloaded area functions for circle and rectangle.',
    milestoneOutput: 'Reference demo and overloaded functions.',
    dailyScope:
      'References and function overloading. Understand pass-by-value, pass-by-reference, const reference and overload resolution.'
  },
  {
    day: 11,
    topic: 'Arrays',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Learn declaration, indexing, traversal and update operations.',
    studentWork:
      'Read N numbers into an array/vector. Calculate sum, average, minimum, maximum and reverse order.',
    milestoneOutput: 'Array program with five operations.',
    dailyScope: 'Arrays. Learn declaration, indexing, traversal and update operations.'
  },
  {
    day: 12,
    topic: 'Strings',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Learn std::string, length, indexing, compare, substr and find.',
    studentWork:
      'Write programs for palindrome check, vowel count, word count, reverse string and character frequency.',
    milestoneOutput: 'Five string exercises.',
    dailyScope: 'Strings. Learn std::string, length, indexing, compare, substr and find.'
  },
  SATURDAY_ENTRY(13),
  SUNDAY_ENTRY(14),
  {
    day: 15,
    topic: 'Two-dimensional arrays',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand rows, columns and matrix traversal.',
    studentWork:
      'Implement matrix addition, transpose, diagonal sum and row/column sum for small matrices.',
    milestoneOutput: 'Matrix program with sample test cases.',
    dailyScope: 'Two-dimensional arrays. Understand rows, columns and matrix traversal.'
  },
  {
    day: 16,
    topic: 'Pointers and references',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand addresses, dereferencing, nullptr and pointer/reference distinction.',
    studentWork:
      'Print variable addresses, access values through pointers, modify a value through a pointer and explain why nullptr checks matter.',
    milestoneOutput: 'Pointer demonstration with annotated output.',
    dailyScope:
      'Pointers and references. Understand addresses, dereferencing, nullptr and pointer/reference distinction.'
  },
  {
    day: 17,
    topic: 'Structs and classes',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Learn struct, class, public/private, constructors and member functions.',
    studentWork:
      'Create a Student class with name, roll number, marks, constructor and display method. Add validation for marks.',
    milestoneOutput: 'Student class program.',
    dailyScope: 'Structs and classes. Learn struct, class, public/private, constructors and member functions.'
  },
  {
    day: 18,
    topic: 'Object-oriented programming basics',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand encapsulation, inheritance, polymorphism and abstraction at introductory level.',
    studentWork:
      'Create a base Shape class and derived Circle/Rectangle classes. Demonstrate overridden area methods.',
    milestoneOutput: 'Small OOP example and four concept definitions.',
    dailyScope:
      'Object-oriented programming basics. Understand encapsulation, inheritance, polymorphism and abstraction at introductory level.'
  },
  {
    day: 19,
    topic: 'Recursion foundations',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand base case, recursive case and call stack.',
    studentWork: 'Implement factorial, sum 1..N and power recursively. Draw call traces for small inputs.',
    milestoneOutput: 'Three recursive functions and call-stack diagrams.',
    dailyScope: 'Recursion foundations. Understand base case, recursive case and call stack.'
  },
  SATURDAY_ENTRY(20),
  SUNDAY_ENTRY(21),
  {
    day: 22,
    topic: 'Recursion on arrays and strings',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Apply recursion to traversal, reverse and search.',
    studentWork:
      'Implement recursive array sum, recursive maximum, string reverse and palindrome check. Compare one iterative solution.',
    milestoneOutput: 'Four recursive exercises.',
    dailyScope: 'Recursion on arrays and strings. Apply recursion to traversal, reverse and search.'
  },
  {
    day: 23,
    topic: 'Time complexity I',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand input size and O(1), O(log n), O(n), O(n log n), O(n²).',
    studentWork:
      'Classify simple code snippets. Count loop iterations for single and nested loops. Explain why input size matters.',
    milestoneOutput: 'Complexity worksheet with 10 examples.',
    dailyScope:
      'Time complexity I. Understand input size and O(1), O(log n), O(n), O(n log n), O(n²).'
  },
  {
    day: 24,
    topic: 'Time complexity II',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand sequential loops, nested loops, best/average/worst cases and space complexity.',
    studentWork:
      'Analyze five short programs. Estimate time and auxiliary space; compare two approaches to the same task.',
    milestoneOutput: 'Five annotated complexity analyses.',
    dailyScope:
      'Time complexity II. Understand sequential loops, nested loops, best/average/worst cases and space complexity.'
  },
  {
    day: 25,
    topic: 'STL vector and pair',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Learn vector creation, push_back, pop_back, size, indexing, iteration and pair.',
    studentWork:
      'Rewrite two array exercises using vector. Store coordinate pairs and iterate through them.',
    milestoneOutput: 'Vector/pair practice file.',
    dailyScope:
      'STL vector and pair. Learn vector creation, push_back, pop_back, size, indexing, iteration and pair.'
  },
  {
    day: 26,
    topic: 'STL algorithms',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Learn sort, reverse, min/max, binary_search and comparator basics.',
    studentWork:
      'Sort integers ascending/descending, sort pairs by second value and use binary_search on sorted data.',
    milestoneOutput: 'Three STL algorithm exercises.',
    dailyScope: 'STL algorithms. Learn sort, reverse, min/max, binary_search and comparator basics.'
  },
  SATURDAY_ENTRY(27),
  SUNDAY_ENTRY(28),
  {
    day: 29,
    topic: 'STL stack and queue',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand LIFO/FIFO and stack, queue, deque operations.',
    studentWork:
      'Use stack to reverse input and queue to simulate a simple service line. Implement balanced parentheses check.',
    milestoneOutput: 'Stack and queue programs.',
    dailyScope: 'STL stack and queue. Understand LIFO/FIFO and stack, queue, deque operations.'
  },
  {
    day: 30,
    topic: 'STL set and map',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand uniqueness, ordered lookup and key-value mapping.',
    studentWork:
      'Count word/number frequencies with map or unordered_map. Remove duplicates using set. Compare outputs.',
    milestoneOutput: 'Frequency counter and duplicate-removal program.',
    dailyScope: 'STL set and map. Understand uniqueness, ordered lookup and key-value mapping.'
  },
  {
    day: 31,
    topic: 'STL priority_queue',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand max heap, min heap and push/pop/top.',
    studentWork:
      'Create max-heap and min-heap; solve kth-largest in a small list and explain heap ordering.',
    milestoneOutput: 'Two heap demos and kth-largest solution.',
    dailyScope: 'STL priority_queue. Understand max heap, min heap and push/pop/top.'
  },
  {
    day: 32,
    topic: 'Iterators and custom sorting',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Learn begin/end, range loops and custom comparator.',
    studentWork:
      'Sort student records by marks and then name. Use iterators to traverse and erase selected elements safely.',
    milestoneOutput: 'Custom sorting program.',
    dailyScope: 'Iterators and custom sorting. Learn begin/end, range loops and custom comparator.'
  },
  {
    day: 33,
    topic: 'Linear and binary search',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand linear search and binary search preconditions/invariants.',
    studentWork:
      'Implement both searches. Find a target in sorted data and record comparisons for different input sizes.',
    milestoneOutput: 'Two search implementations and comparison table.',
    dailyScope: 'Linear and binary search. Understand linear search and binary search preconditions/invariants.'
  },
  SATURDAY_ENTRY(34),
  SUNDAY_ENTRY(35),
  {
    day: 36,
    topic: 'Binary search patterns',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Learn lower_bound, upper_bound and first/last occurrence.',
    studentWork:
      'Use STL bounds to count occurrences in a sorted array. Implement first and last occurrence manually.',
    milestoneOutput: 'Occurrence-count solution and dry run.',
    dailyScope: 'Binary search patterns. Learn lower_bound, upper_bound and first/last occurrence.'
  },
  {
    day: 37,
    topic: 'Basic sorting algorithms',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand selection, bubble and insertion sort; stability and in-place idea.',
    studentWork:
      'Implement all three sorts. Trace one sample array and compare operation counts informally.',
    milestoneOutput: 'Three sorting implementations.',
    dailyScope:
      'Basic sorting algorithms. Understand selection, bubble and insertion sort; stability and in-place idea.'
  },
  {
    day: 38,
    topic: 'Efficient sorting',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand merge sort, quicksort, partitioning and complexity caveats.',
    studentWork:
      'Implement merge sort; implement or trace quicksort partition. Test sorted, reverse and duplicate-heavy inputs.',
    milestoneOutput: 'Sorting implementations and test results.',
    dailyScope: 'Efficient sorting. Understand merge sort, quicksort, partitioning and complexity caveats.'
  },
  {
    day: 39,
    topic: 'Hashing patterns',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand hash sets/maps and average lookup intuition.',
    studentWork:
      'Solve duplicate detection, two-sum and first non-repeating element using hashing.',
    milestoneOutput: 'Three hashing problems with complexity notes.',
    dailyScope: 'Hashing patterns. Understand hash sets/maps and average lookup intuition.'
  },
  {
    day: 40,
    topic: 'Two pointers and sliding window',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand opposite-direction pointers and fixed/variable windows.',
    studentWork:
      'Solve pair sum in sorted array, remove duplicates in-place and maximum sum of fixed-size window.',
    milestoneOutput: 'Three pattern problems.',
    dailyScope:
      'Two pointers and sliding window. Understand opposite-direction pointers and fixed/variable windows.'
  },
  SATURDAY_ENTRY(41),
  SUNDAY_ENTRY(42),
  {
    day: 43,
    topic: 'Prefix sums',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand prefix arrays and range-sum queries.',
    studentWork: 'Build prefix sums, answer multiple range-sum queries and solve a simple subarray-sum task.',
    milestoneOutput: 'Prefix-sum program and explanation.',
    dailyScope: 'Prefix sums. Understand prefix arrays and range-sum queries.'
  },
  {
    day: 44,
    topic: 'Linked list foundations',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand node, head, tail, traversal and insertion/deletion.',
    studentWork:
      'Define a singly linked-list node. Implement create, display, insert-at-front/end and delete-by-value.',
    milestoneOutput: 'Singly linked-list implementation.',
    dailyScope: 'Linked list foundations. Understand node, head, tail, traversal and insertion/deletion.'
  },
  {
    day: 45,
    topic: 'Linked list patterns',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Learn reverse, middle node, cycle detection and merge sorted lists.',
    studentWork:
      'Implement reverse iterative, find middle with slow/fast pointers and detect a cycle conceptually or in code.',
    milestoneOutput: 'Three linked-list pattern solutions.',
    dailyScope: 'Linked list patterns. Learn reverse, middle node, cycle detection and merge sorted lists.'
  },
  {
    day: 46,
    topic: 'Stack applications',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Apply stack to parsing and monotonic patterns.',
    studentWork: 'Solve valid parentheses and next greater element. Explain why a stack is suitable.',
    milestoneOutput: 'Two stack problems with dry runs.',
    dailyScope: 'Stack applications. Apply stack to parsing and monotonic patterns.'
  },
  {
    day: 47,
    topic: 'Queue and deque applications',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand circular queue concept, deque and BFS queue use.',
    studentWork:
      'Implement queue operations and solve a basic sliding-window maximum or first-negative-in-window exercise.',
    milestoneOutput: 'Queue/deque implementation and one problem.',
    dailyScope: 'Queue and deque applications. Understand circular queue concept, deque and BFS queue use.'
  },
  SATURDAY_ENTRY(48),
  SUNDAY_ENTRY(49),
  {
    day: 50,
    topic: 'Binary tree foundations',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand root, child, leaf, height and recursive traversals.',
    studentWork:
      'Define a binary tree node. Build a small tree and implement preorder, inorder and postorder traversals.',
    milestoneOutput: 'Tree traversal program.',
    dailyScope: 'Binary tree foundations. Understand root, child, leaf, height and recursive traversals.'
  },
  {
    day: 51,
    topic: 'Tree traversal and properties',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Learn level-order BFS, depth, height and node count.',
    studentWork: 'Implement level-order traversal using queue; calculate height and count leaf nodes.',
    milestoneOutput: 'Tree properties program.',
    dailyScope: 'Tree traversal and properties. Learn level-order BFS, depth, height and node count.'
  },
  {
    day: 52,
    topic: 'Binary search trees',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand BST ordering and search/insert/delete concepts.',
    studentWork:
      'Implement BST insertion, search and inorder traversal. Validate whether a sample tree is a BST.',
    milestoneOutput: 'BST implementation and test cases.',
    dailyScope: 'Binary search trees. Understand BST ordering and search/insert/delete concepts.'
  },
  {
    day: 53,
    topic: 'Heaps',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand heap properties, heapify idea and priority queues.',
    studentWork:
      'Use priority_queue for kth largest and merge two sorted sequences. Explain min-heap vs max-heap.',
    milestoneOutput: 'Two heap exercises.',
    dailyScope: 'Heaps. Understand heap properties, heapify idea and priority queues.'
  },
  {
    day: 54,
    topic: 'Greedy algorithms',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand local choice and need for correctness reasoning.',
    studentWork:
      'Solve activity/interval selection after sorting by finish time. Explain the greedy choice in your own words.',
    milestoneOutput: 'Greedy solution with reasoning.',
    dailyScope: 'Greedy algorithms. Understand local choice and need for correctness reasoning.'
  },
  SATURDAY_ENTRY(55),
  SUNDAY_ENTRY(56),
  {
    day: 57,
    topic: 'Backtracking',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand choose-explore-unchoose and pruning.',
    studentWork:
      'Generate subsets and permutations for small inputs. Trace recursion and avoid duplicate outputs where appropriate.',
    milestoneOutput: 'Subset and permutation programs.',
    dailyScope: 'Backtracking. Understand choose-explore-unchoose and pruning.'
  },
  {
    day: 58,
    topic: 'Dynamic programming foundations',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand overlapping subproblems and optimal substructure.',
    studentWork:
      'Convert Fibonacci from naive recursion to memoization and tabulation. Write state and transition explicitly.',
    milestoneOutput: 'Three Fibonacci versions and DP notes.',
    dailyScope:
      'Dynamic programming foundations. Understand overlapping subproblems and optimal substructure.'
  },
  {
    day: 59,
    topic: '1D dynamic programming',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Learn state definition and transitions for simple sequences.',
    studentWork: 'Solve climbing stairs and house robber. For each, write recurrence before coding.',
    milestoneOutput: 'Two DP solutions with state definitions.',
    dailyScope: '1D dynamic programming. Learn state definition and transitions for simple sequences.'
  },
  {
    day: 60,
    topic: '2D dynamic programming',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand grid states and 2D DP table.',
    studentWork:
      'Solve unique paths in a grid; trace a small table. Study 0/1 knapsack and LCS recurrence conceptually.',
    milestoneOutput: 'Grid-path solution and two recurrence notes.',
    dailyScope: '2D dynamic programming. Understand grid states and 2D DP table.'
  },
  {
    day: 61,
    topic: 'Graph foundations',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand vertices, edges, directed/undirected and weighted graphs.',
    studentWork: 'Represent one graph using adjacency list and matrix. Add edges and print neighbours.',
    milestoneOutput: 'Graph representation program.',
    dailyScope: 'Graph foundations. Understand vertices, edges, directed/undirected and weighted graphs.'
  },
  SATURDAY_ENTRY(62),
  SUNDAY_ENTRY(63),
  {
    day: 64,
    topic: 'BFS and DFS',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand visited arrays, traversal order and connected components.',
    studentWork: 'Implement BFS and DFS on a sample graph. Apply traversal to a small grid.',
    milestoneOutput: 'BFS/DFS implementations and trace.',
    dailyScope: 'BFS and DFS. Understand visited arrays, traversal order and connected components.'
  },
  {
    day: 65,
    topic: 'Shortest paths and topological ordering',
    classFocus: 'Instructor-led learning and implementation',
    objective: "Understand Dijkstra's non-negative-weight condition and DAG ordering.",
    studentWork: 'Trace Dijkstra on a small weighted graph. Implement topological sort using indegree or DFS.',
    milestoneOutput: 'Algorithm notes and one topological-sort implementation.',
    dailyScope:
      "Shortest paths and topological ordering. Understand Dijkstra's non-negative-weight condition and DAG ordering."
  },
  {
    day: 66,
    topic: 'DSU and spanning trees',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand find/union, path compression and minimum spanning tree idea.',
    studentWork: 'Implement Disjoint Set Union and use it to explain cycle detection/Kruskal steps.',
    milestoneOutput: 'DSU implementation and worked MST example.',
    dailyScope:
      'DSU and spanning trees. Understand find/union, path compression and minimum spanning tree idea.'
  },
  {
    day: 67,
    topic: 'Bit manipulation',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand AND, OR, XOR, shifts and bit masks.',
    studentWork:
      'Write helpers to check/set/clear/toggle a bit. Solve parity and single-number exercises.',
    milestoneOutput: 'Bit utility program and three exercises.',
    dailyScope: 'Bit manipulation. Understand AND, OR, XOR, shifts and bit masks.'
  },
  {
    day: 68,
    topic: 'Mixed arrays and strings interview practice',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Combine arrays, strings, hashing and complexity reasoning.',
    studentWork:
      'Attempt three unseen easy problems under time limits. Explain brute force first, then optimize.',
    milestoneOutput: 'Three solutions and self-review notes.',
    dailyScope:
      'Mixed arrays and strings interview practice. Combine arrays, strings, hashing and complexity reasoning.'
  },
  SATURDAY_ENTRY(69),
  SUNDAY_ENTRY(70),
  {
    day: 71,
    topic: 'Mixed data-structure interview practice',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Combine linked lists, stacks, queues, trees and heaps.',
    studentWork: 'Attempt two unseen problems and one tree traversal problem. Test edge cases.',
    milestoneOutput: 'Three solutions with complexity analysis.',
    dailyScope:
      'Mixed data-structure interview practice. Combine linked lists, stacks, queues, trees and heaps.'
  },
  {
    day: 72,
    topic: 'Mixed algorithms interview practice',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Combine recursion, greedy, backtracking and DP foundations.',
    studentWork:
      'Attempt one recursion, one greedy and one DP problem. Write state/choice reasoning before coding.',
    milestoneOutput: 'Three attempted problems and error log.',
    dailyScope:
      'Mixed algorithms interview practice. Combine recursion, greedy, backtracking and DP foundations.'
  },
  {
    day: 73,
    topic: 'Graph and traversal revision',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Revisit graph representation, BFS, DFS, DSU and shortest-path assumptions.',
    studentWork:
      'Solve one BFS/DFS problem and trace one shortest-path example. Explain visited-state handling.',
    milestoneOutput: 'Graph revision sheet and two practice tasks.',
    dailyScope:
      'Graph and traversal revision. Revisit graph representation, BFS, DFS, DSU and shortest-path assumptions.'
  },
  {
    day: 74,
    topic: 'Timed assessment and error analysis',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Assess problem-solving speed, correctness and explanation.',
    studentWork:
      'Complete a timed mixed set. Categorize errors: concept, implementation, edge case or complexity. Re-solve missed problems.',
    milestoneOutput: 'Assessment score and prioritized weak-topic list.',
    dailyScope: 'Timed assessment and error analysis. Assess problem-solving speed, correctness and explanation.'
  },
  {
    day: 75,
    topic: 'C++ consolidation',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate syntax, functions, arrays, strings, pointers and OOP.',
    studentWork:
      'Build a small console-based student/expense record program using functions, classes and STL containers.',
    milestoneOutput: 'Working mini-program and README.',
    dailyScope: 'C++ consolidation. Consolidate syntax, functions, arrays, strings, pointers and OOP.'
  },
  SATURDAY_ENTRY(76),
  SUNDAY_ENTRY(77),
  {
    day: 78,
    topic: 'STL consolidation',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate vector, map, set, stack, queue, priority_queue and algorithms.',
    studentWork: 'Solve four small tasks using the correct STL container; justify each choice.',
    milestoneOutput: 'Four STL solutions and container-choice notes.',
    dailyScope:
      'STL consolidation. Consolidate vector, map, set, stack, queue, priority_queue and algorithms.'
  },
  {
    day: 79,
    topic: 'Search and sort consolidation',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Consolidate linear/binary search, bounds, elementary and efficient sorting.',
    studentWork:
      'Implement binary search and one efficient sort from memory; test duplicates and edge cases.',
    milestoneOutput: 'Two implementations and test log.',
    dailyScope:
      'Search and sort consolidation. Consolidate linear/binary search, bounds, elementary and efficient sorting.'
  },
  {
    day: 80,
    topic: 'Array pattern consolidation',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Consolidate hashing, two pointers, sliding window and prefix sums.',
    studentWork: 'Solve four mixed array problems; record brute force and optimized complexity.',
    milestoneOutput: 'Four solutions and comparison notes.',
    dailyScope: 'Array pattern consolidation. Consolidate hashing, two pointers, sliding window and prefix sums.'
  },
  {
    day: 81,
    topic: 'Linked list and stack consolidation',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Consolidate list operations, reversal, cycle detection and stack patterns.',
    studentWork: 'Re-implement reverse list and valid parentheses without notes; solve one queue/stack variant.',
    milestoneOutput: 'Three solutions from memory.',
    dailyScope:
      'Linked list and stack consolidation. Consolidate list operations, reversal, cycle detection and stack patterns.'
  },
  {
    day: 82,
    topic: 'Tree and heap consolidation',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate traversals, BST, height, heap and top-K.',
    studentWork: 'Implement one traversal and solve one BST or heap problem. Explain invariants.',
    milestoneOutput: 'Two solutions and oral explanation.',
    dailyScope: 'Tree and heap consolidation. Consolidate traversals, BST, height, heap and top-K.'
  },
  SATURDAY_ENTRY(83),
  SUNDAY_ENTRY(84),
  {
    day: 85,
    topic: 'Greedy and backtracking consolidation',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate interval scheduling, subsets, permutations and pruning.',
    studentWork: 'Solve one interval problem and one backtracking problem. Explain why choices are explored/pruned.',
    milestoneOutput: 'Two solutions and reasoning notes.',
    dailyScope:
      'Greedy and backtracking consolidation. Consolidate interval scheduling, subsets, permutations and pruning.'
  },
  {
    day: 86,
    topic: 'Dynamic programming consolidation',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Consolidate memoization, tabulation, 1D and 2D DP.',
    studentWork: 'Re-solve climbing stairs and grid paths without notes; write recurrence before implementation.',
    milestoneOutput: 'Two DP solutions and recurrence sheet.',
    dailyScope: 'Dynamic programming consolidation. Consolidate memoization, tabulation, 1D and 2D DP.'
  },
  {
    day: 87,
    topic: 'Graph consolidation',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Consolidate adjacency list, BFS, DFS, DSU and shortest-path concepts.',
    studentWork: 'Implement BFS/DFS from memory and solve one connected-components task.',
    milestoneOutput: 'Two graph solutions.',
    dailyScope: 'Graph consolidation. Consolidate adjacency list, BFS, DFS, DSU and shortest-path concepts.'
  },
  {
    day: 88,
    topic: 'Final interview simulation',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Practice explaining code, complexity, trade-offs and edge cases.',
    studentWork: 'Complete a timed mock: two coding problems plus verbal explanation. Review all prior mistakes.',
    milestoneOutput: 'Mock score, revised resume-ready DSA summary and next 30-day practice plan.',
    dailyScope: 'Final interview simulation. Practice explaining code, complexity, trade-offs and edge cases.'
  },
  {
    day: 89,
    topic: 'C++ syntax from-memory challenge',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate data types, operators, branches, loops and functions.',
    studentWork:
      'Write five short programs from a blank file without notes. Compile, test boundary cases and correct errors.',
    milestoneOutput: 'Five standalone programs and error log.',
    dailyScope:
      'C++ syntax from-memory challenge. Consolidate data types, operators, branches, loops and functions.'
  },
  SATURDAY_ENTRY(90),
  SUNDAY_ENTRY(91),
  {
    day: 92,
    topic: 'Array and string challenge set',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate traversal, frequency, two-dimensional arrays and string processing.',
    studentWork:
      'Solve three unseen easy array/string exercises. For each, write a brute-force idea and test edge cases.',
    milestoneOutput: 'Three solutions with complexity notes.',
    dailyScope:
      'Array and string challenge set. Consolidate traversal, frequency, two-dimensional arrays and string processing.'
  },
  {
    day: 93,
    topic: 'STL container selection',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Consolidate vector, map, set, stack, queue and priority_queue.',
    studentWork:
      'Given six small tasks, choose the appropriate STL container, implement three, and explain why the chosen container fits.',
    milestoneOutput: 'Container-selection table and three programs.',
    dailyScope:
      'STL container selection. Consolidate vector, map, set, stack, queue and priority_queue.'
  },
  {
    day: 94,
    topic: 'Search/sort challenge set',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Consolidate binary search, bounds, sorting and comparator usage.',
    studentWork:
      'Solve two search and two sorting exercises. Test empty, single-element, duplicate and already-sorted inputs.',
    milestoneOutput: 'Four tested solutions.',
    dailyScope:
      'Search/sort challenge set. Consolidate binary search, bounds, sorting and comparator usage.'
  },
  {
    day: 95,
    topic: 'Linear data structure challenge',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Consolidate linked list, stack, queue and deque patterns.',
    studentWork: 'Re-implement list reversal, balanced parentheses and queue simulation without notes.',
    milestoneOutput: 'Three implementations and self-review.',
    dailyScope:
      'Linear data structure challenge. Consolidate linked list, stack, queue and deque patterns.'
  },
  {
    day: 96,
    topic: 'Tree and heap challenge',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate traversals, BST operations and heap patterns.',
    studentWork: 'Build a sample tree, write traversals, validate a BST and solve one top-K exercise.',
    milestoneOutput: 'Tree/heap practice file.',
    dailyScope: 'Tree and heap challenge. Consolidate traversals, BST operations and heap patterns.'
  },
  SATURDAY_ENTRY(97),
  SUNDAY_ENTRY(98),
  {
    day: 99,
    topic: 'Algorithm reasoning challenge',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate greedy, backtracking and dynamic programming.',
    studentWork:
      'Solve one interval scheduling, one subset-generation and one 1D DP problem. Explain each decision/state.',
    milestoneOutput: 'Three solutions with reasoning.',
    dailyScope: 'Algorithm reasoning challenge. Consolidate greedy, backtracking and dynamic programming.'
  },
  {
    day: 100,
    topic: 'Final DSA readiness assessment',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Review all major topics and identify the next practice priorities.',
    studentWork:
      'Complete a timed assessment with two coding problems and one complexity explanation. Re-solve every missed question.',
    milestoneOutput: 'Final score, error log and 30-day follow-up plan.',
    dailyScope: 'Final DSA readiness assessment. Review all major topics and identify the next practice priorities.'
  }
];

function getDsaPhaseTitle(day: number): string {
  if (day <= 20) return 'C++ programming foundations (Days 1–20)';
  if (day <= 30) return 'Complexity and STL (Days 21–30)';
  if (day <= 50) return 'Core problem-solving patterns (Days 31–50)';
  if (day <= 80) return 'Data structures and algorithms (Days 51–80)';
  return 'Graphs and interview readiness (Days 81–100)';
}

const WEEKDAYS: TrackDaySchedule['dayOfWeek'][] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DSA_100_DAYS: TrackDaySchedule[] = RAW_DSA_DAYS.map((raw) => {
  const d = new Date(Date.UTC(2026, 10, 23 + (raw.day - 1)));
  const dayOfWeek = WEEKDAYS[d.getUTCDay()];
  const isWeekendRevision = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  const targetMinutes = isWeekendRevision ? 120 : 90;
  const scheduleLabel = isWeekendRevision ? '2 hours revision' : '90 minutes preparation';

  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = MONTHS[d.getUTCMonth()];
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');

  const checklist: TrackChecklistItem[] = [
    {
      id: `${raw.day}_objective`,
      title: `Objective: ${raw.objective}`,
      description: `Class focus: ${raw.classFocus}`,
      category: 'objective'
    },
    {
      id: `${raw.day}_work`,
      title: 'Complete Student Work',
      description: raw.studentWork,
      category: 'work'
    },
    {
      id: `${raw.day}_milestone`,
      title: 'Save Milestone / Output',
      description: raw.milestoneOutput,
      category: 'milestone'
    },
    {
      id: `${raw.day}_scope`,
      title: 'Verify Daily Scope & Completion Rule',
      description: raw.dailyScope,
      category: 'scope'
    }
  ];

  // Pages 2..21 contain 5 days per page (Day 1..5 -> Page 2, Day 6..10 -> Page 3, etc.)
  const pdfPage = Math.floor((raw.day - 1) / 5) + 2;

  return {
    trackId: 'dsa',
    dayNumber: raw.day,
    dateString: `${dd} ${mon} ${yyyy}`,
    isoDate: `${yyyy}-${mm}-${dd}`,
    dayOfWeek,
    weekNumber: Math.ceil(raw.day / 7),
    targetMinutes,
    scheduleLabel,
    phaseTitle: getDsaPhaseTitle(raw.day),
    topic: raw.topic,
    classFocus: raw.classFocus,
    objective: raw.objective,
    studentWork: raw.studentWork,
    milestoneOutput: raw.milestoneOutput,
    dailyScope: raw.dailyScope,
    isWeekendRevision,
    pdfPage,
    checklist
  };
});

export const DSA_TOTAL_PLANNED_HOURS = Number(
  (DSA_100_DAYS.reduce((sum, d) => sum + d.targetMinutes, 0) / 60).toFixed(1)
);
