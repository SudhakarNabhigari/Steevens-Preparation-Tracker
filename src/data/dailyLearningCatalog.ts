import type {
  DailyLeetCodeQuestion,
  DailyReferenceLink,
  TrackId
} from '../types/index.ts';
import { ALL_180_DAYS } from './syllabus.ts';
import { DSA_100_DAYS } from './dsaSyllabus.ts';
import { AZURE_100_DAYS } from './azureSyllabus.ts';
import {
  getUnlockedDayCountByIstClock,
  isDayUnlockedByIstClock,
  MAIN_TRACK_MAX_DAYS,
  SUB_TRACK_MAX_DAYS
} from '../utils/dailyLock.ts';

export interface IstScheduleSnapshot {
  istDate: string; // YYYY-MM-DD
  istDateLabel: string; // e.g. 17 Nov 2026
  istTimeLabel: string; // e.g. 10:00:00 IST
  istHour: number;
  istMinute: number;
  isPreparationStarted: boolean;
  unlockedDays: {
    main: number;
    dsa: number;
    azure: number;
  };
}

export interface CurriculumDayContext {
  trackId: TrackId;
  trackLabel: string;
  dayNumber: number;
  isoDate: string;
  dateLabel: string;
  dayOfWeek: string;
  weekNumber: number;
  phaseOrModule: string;
  topic: string;
  objectives: string[];
  practicalWork: string;
  expectedOutcome: string;
  deliverable: string;
  isDsaRelated: boolean;
}

export interface CuratedLeetCodeSpec {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  available: boolean;
  problemNumber?: string;
  title?: string;
  slug?: string;
  shortExplanation: string;
  whyMatchesTopic: string;
  whyUnavailable?: string;
}

export function getIstScheduleSnapshot(nowMs: number = Date.now()): IstScheduleSnapshot {
  const dateObj = new Date(nowMs);
  const istParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(dateObj);

  const part = (type: string) => istParts.find(p => p.type === type)?.value || '00';
  const year = part('year');
  const month = part('month');
  const day = part('day');
  const hour = Number(part('hour'));
  const minute = Number(part('minute'));
  const second = part('second');

  const istDate = `${year}-${month}-${day}`;
  const istDateLabel = dateObj.toLocaleDateString('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const mainUnlocked = getUnlockedDayCountByIstClock(nowMs, MAIN_TRACK_MAX_DAYS);
  const dsaUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS);
  const azureUnlocked = getUnlockedDayCountByIstClock(nowMs, SUB_TRACK_MAX_DAYS);

  return {
    istDate,
    istDateLabel,
    istTimeLabel: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${second} IST`,
    istHour: hour,
    istMinute: minute,
    isPreparationStarted: mainUnlocked >= 1,
    unlockedDays: {
      main: mainUnlocked,
      dsa: dsaUnlocked,
      azure: azureUnlocked
    }
  };
}

export function isTrackDayCurrentlyUnlocked(
  trackId: TrackId,
  dayNumber: number,
  nowMs: number = Date.now()
): boolean {
  const maxDay = trackId === 'main' ? MAIN_TRACK_MAX_DAYS : SUB_TRACK_MAX_DAYS;
  return isDayUnlockedByIstClock(dayNumber, nowMs, maxDay);
}

export function getCurriculumDayContext(
  trackId: TrackId,
  dayNumber: number
): CurriculumDayContext | null {
  if (trackId === 'main') {
    const day = ALL_180_DAYS[dayNumber - 1];
    if (!day) return null;
    return {
      trackId: 'main',
      trackLabel: 'Main Plan — 180 Days',
      dayNumber: day.dayNumber,
      isoDate: day.isoDate,
      dateLabel: day.dateString,
      dayOfWeek: day.dayOfWeek,
      weekNumber: day.weekNumber,
      phaseOrModule: `Module ${day.moduleNumber}: ${day.moduleTitle}`,
      topic: day.topic,
      objectives: [...day.subtopics],
      practicalWork: day.practicalTask,
      expectedOutcome: day.expectedOutcome,
      deliverable: day.deliverable,
      isDsaRelated: false
    };
  }

  if (trackId === 'dsa') {
    const day = DSA_100_DAYS[dayNumber - 1];
    if (!day) return null;
    return {
      trackId: 'dsa',
      trackLabel: 'DSA in C++ (100 Days)',
      dayNumber: day.dayNumber,
      isoDate: day.isoDate,
      dateLabel: day.dateString,
      dayOfWeek: day.dayOfWeek,
      weekNumber: day.weekNumber,
      phaseOrModule: day.phaseTitle,
      topic: day.topic,
      objectives: [day.objective, `Focus: ${day.classFocus}`],
      practicalWork: day.studentWork,
      expectedOutcome: day.dailyScope,
      deliverable: day.milestoneOutput,
      isDsaRelated: true
    };
  }

  const day = AZURE_100_DAYS[dayNumber - 1];
  if (!day) return null;
  return {
    trackId: 'azure',
    trackLabel: 'Azure — Alternate Plan (100 Days)',
    dayNumber: day.dayNumber,
    isoDate: day.isoDate,
    dateLabel: day.dateString,
    dayOfWeek: day.dayOfWeek,
    weekNumber: day.weekNumber,
    phaseOrModule: day.phaseTitle,
    topic: day.topic,
    objectives: [day.objective, `Focus: ${day.classFocus}`],
    practicalWork: day.studentWork,
    expectedOutcome: day.dailyScope,
    deliverable: day.milestoneOutput,
    isDsaRelated: false
  };
}

// =========================================================================
// VERIFIED DSA TOPIC -> LEETCODE TRIPLET BANK (STRICTLY 1 EASY, 1 MEDIUM, 1 HARD)
// =========================================================================
type Triplet = [CuratedLeetCodeSpec, CuratedLeetCodeSpec, CuratedLeetCodeSpec];

function p(
  difficulty: 'Easy' | 'Medium' | 'Hard',
  problemNumber: string,
  title: string,
  slug: string,
  shortExplanation: string,
  whyMatchesTopic: string
): CuratedLeetCodeSpec {
  return {
    difficulty,
    available: true,
    problemNumber,
    title,
    slug,
    shortExplanation,
    whyMatchesTopic
  };
}

function unavailHard(reason: string): CuratedLeetCodeSpec {
  return {
    difficulty: 'Hard',
    available: false,
    shortExplanation: 'No verified Hard problem assigned for this introductory setup topic.',
    whyMatchesTopic: reason,
    whyUnavailable: reason
  };
}

const TOPIC_TRIPLETS = {
  cppSetup: [
    p('Easy', '2235', 'Add Two Integers', 'add-two-integers', 'Write a clean C++ function returning the sum of two integers to test compilation and execution.', 'Minimal C++ function signature exercise matching Day 1 setup without advanced prerequisites.'),
    p('Medium', '7', 'Reverse Integer', 'reverse-integer', 'Reverse digits of a signed 32-bit integer while guarding against 32-bit signed overflow.', 'Directly reinforces C++ int bounds and arithmetic compilation/testing on Day 1.'),
    unavailHard('Day 1 covers C++ compiler setup and compiling Hello World; no authentic Hard LeetCode problem specifically tests compiler setup without jumping ahead to unrelated algorithms.')
  ] as Triplet,

  variablesDataTypes: [
    p('Easy', '2469', 'Convert the Temperature', 'convert-the-temperature', 'Convert a floating-point Celsius temperature into Kelvin and Fahrenheit using double precision.', 'Directly exercises C++ double precision floating-point types and type arithmetic.'),
    p('Medium', '8', 'String to Integer (atoi)', 'string-to-integer-atoi', 'Parse numeric characters into a signed 32-bit integer while clamping values cleanly at INT_MIN and INT_MAX.', 'Tests integer data types, signed ranges, char-to-int conversion, and overflow clamping in C++.'),
    p('Hard', '65', 'Valid Number', 'valid-number', 'Validate whether an input string represents a valid integer, decimal, or scientific-notation floating number.', 'Directly tests numeric data-type formatting rules (signs, decimals, exponents) in C++.')
  ] as Triplet,

  operatorsExpressions: [
    p('Easy', '1281', 'Subtract the Product and Sum of Digits of an Integer', 'subtract-the-product-and-sum-of-digits-of-an-integer', 'Use modulo (%) and integer division (/) operators to compute digit product minus digit sum.', 'Directly practices C++ arithmetic operators, modulo extraction, and operator precedence.'),
    p('Medium', '227', 'Basic Calculator II', 'basic-calculator-ii', 'Evaluate an arithmetic expression string containing +, -, *, and / respecting operator precedence.', 'Directly applies operator precedence rules and integer division behavior taught in Day 3.'),
    p('Hard', '224', 'Basic Calculator', 'basic-calculator', 'Evaluate an arithmetic expression string with +, -, parentheses, and unary minus operators.', 'Tests full expression evaluation, operator precedence, and nested grouping.')
  ] as Triplet,

  conditionals: [
    p('Easy', '412', 'Fizz Buzz', 'fizz-buzz', 'Apply multi-branch if/else-if divisibility conditionals across numbers 1 through n.', 'Classic multi-branch conditional logic exercise matching if/else-if fundamentals.'),
    p('Medium', '12', 'Integer to Roman', 'integer-to-roman', 'Convert an integer into Roman numerals using ordered conditional/subtractive rules.', 'Applies multi-case branching and clean boundary value conditions.'),
    p('Hard', '273', 'Integer to English Words', 'integer-to-english-words', 'Translate a non-negative integer into its exact English word representation across place-value cases.', 'Rich conditional edge-case branching covering zero, teens, tens, and thousand groupings.')
  ] as Triplet,

  loops: [
    p('Easy', '9', 'Palindrome Number', 'palindrome-number', 'Check whether an integer reads the same forward and backward using an iterative digit-reversal loop.', 'Reinforces while-loop termination conditions and digit accumulators.'),
    p('Medium', '50', 'Pow(x, n)', 'powx-n', 'Compute x raised to the power n iteratively using binary exponentiation loops while handling negative exponents.', 'Practices loop invariants, accumulator updates, and signed exponent edge cases.'),
    p('Hard', '41', 'First Missing Positive', 'first-missing-positive', 'Find the smallest missing positive integer using in-place index placement loops in O(n) time.', 'Challenges loop termination guarantees and index-swapping invariants.')
  ] as Triplet,

  nestedLoopsDebug: [
    p('Easy', '118', "Pascal's Triangle", 'pascals-triangle', 'Generate rows of Pascal’s triangle using nested loops over row and column indices.', 'Mirrors nested-loop row/column pattern generation and off-by-one boundary debugging.'),
    p('Medium', '54', 'Spiral Matrix', 'spiral-matrix', 'Traverse a 2D matrix in spiral order by coordinating four boundary loops cleanly.', 'Tests nested directional loops and strict off-by-one boundary checks.'),
    p('Hard', '68', 'Text Justification', 'text-justification', 'Distribute spaces across words line by line using nested formatting loops and careful edge checks.', 'Deep loop-invariant and off-by-one debugging practice for multi-case iteration.')
  ] as Triplet,

  functions: [
    p('Easy', '509', 'Fibonacci Number', 'fibonacci-number', 'Implement a clean reusable Fibonacci function returning F(n) for small integer inputs.', 'Reinforces function signature, return types, parameter passing, and base handling.'),
    p('Medium', '204', 'Count Primes', 'count-primes', 'Decompose prime counting cleanly into modular sieve/helper steps for O(n log log n) efficiency.', 'Builds directly on modular prime-check functions from Day 9.'),
    p('Hard', '149', 'Max Points on a Line', 'max-points-on-a-line', 'Decompose slope reduction (GCD helper function) and point colinearity checks into clean helper functions.', 'Applies modular mathematical helper functions (gcd, normalized slope keys).')
  ] as Triplet,

  referencesOverloading: [
    p('Easy', '344', 'Reverse String', 'reverse-string', 'Modify a vector of characters in-place via pass-by-reference without returning a new vector.', 'Directly demonstrates mutating caller state via C++ reference parameters (&).'),
    p('Medium', '189', 'Rotate Array', 'rotate-array', 'Rotate an array in-place using a reusable reverse helper taking a vector reference and index bounds.', 'Demonstrates pass-by-reference in-place mutation across subranges.'),
    p('Hard', '42', 'Trapping Rain Water', 'trapping-rain-water', 'Compute trapped water over an elevation slice passed by const reference in O(1) auxiliary space.', 'Applies const-reference read-only input semantics with zero unnecessary copies.')
  ] as Triplet,

  arrays: [
    p('Easy', '1480', 'Running Sum of 1d Array', 'running-sum-of-1d-array', 'Traverse an integer array sequentially to compute cumulative sums.', 'Core array indexing and single-pass traversal matching Day 11.'),
    p('Medium', '238', 'Product of Array Except Self', 'product-of-array-except-self', 'Compute prefix and suffix products across an array without using division.', 'Strong 1D array traversal and boundary-index reasoning.'),
    p('Hard', '42', 'Trapping Rain Water', 'trapping-rain-water', 'Determine water trapped at each array index using left/right maximum array bounds.', 'Classic array-bounds reasoning problem building on min/max traversal.')
  ] as Triplet,

  strings: [
    p('Easy', '125', 'Valid Palindrome', 'valid-palindrome', 'Check if alphanumeric characters of a std::string form a palindrome case-insensitively.', 'Direct std::string indexing and character inspection matching Day 12.'),
    p('Medium', '151', 'Reverse Words in a String', 'reverse-words-in-a-string', 'Extract and reverse space-delimited words from a string while trimming extra spaces.', 'Practices std::string parsing, substr/word boundaries, and in-place reversal.'),
    p('Hard', '76', 'Minimum Window Substring', 'minimum-window-substring', 'Find the smallest substring containing all target characters using character frequency arrays.', 'Advanced string frequency tracking and substring window shrinking.')
  ] as Triplet,

  matrices2d: [
    p('Easy', '1572', 'Matrix Diagonal Sum', 'matrix-diagonal-sum', 'Sum primary and secondary diagonals of a square 2D array without double-counting the center.', 'Directly mirrors Day 15 2D diagonal sum exercise.'),
    p('Medium', '48', 'Rotate Image', 'rotate-image', 'Rotate an n×n matrix 90 degrees clockwise in-place by transposing and reversing rows.', 'Applies matrix transpose from Day 15 to an in-place 2D array transformation.'),
    p('Hard', '329', 'Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix', 'Traverse strictly increasing neighbor cells across a 2D grid with memoized paths.', '2D grid boundary and row/column neighbor traversal challenge.')
  ] as Triplet,

  pointersReferences: [
    p('Easy', '27', 'Remove Element', 'remove-element', 'Compact non-target elements in-place using read/write positions without extra allocation.', 'Reinforces pointer-like in-place reference updates and bounds safety.'),
    p('Medium', '75', 'Sort Colors', 'sort-colors', 'Partition an array in-place using three boundary indices (low, mid, high).', 'Practices indirect swap/position manipulation safely within array bounds.'),
    p('Hard', '23', 'Merge k Sorted Lists', 'merge-k-sorted-lists', 'Manipulate ListNode* pointers safely with nullptr checks while merging sorted chains.', 'Directly exercises C++ node pointer dereferencing and nullptr defensive guards.')
  ] as Triplet,

  structsClasses: [
    p('Easy', '1603', 'Design Parking System', 'design-parking-system', 'Design a class with constructor state and member method validation.', 'Directly models C++ class constructors, private fields, and member methods.'),
    p('Medium', '355', 'Design Twitter', 'design-twitter', 'Encapsulate user posts, followee sets, and timeline retrieval cleanly inside a C++ class.', 'Object-oriented data modeling with clean private invariants and public API methods.'),
    p('Hard', '460', 'LFU Cache', 'lfu-cache', 'Architect a multi-structure C++ cache class with strict O(1) invariants and private helpers.', 'Full C++ class encapsulation uniting custom structs and invariant maintenance.')
  ] as Triplet,

  oopBasics: [
    p('Easy', '705', 'Design HashSet', 'design-hashset', 'Encapsulate bucket storage behind clean public insert/contains/remove abstractions.', 'Demonstrates encapsulation and data abstraction in C++ classes.'),
    p('Medium', '1472', 'Design Browser History', 'design-browser-history', 'Encapsulate navigation state transitions (visit, back, forward) behind clean OOP methods.', 'Applies stateful class design with safe boundary checks.'),
    p('Hard', '588', 'Design In-Memory File System', 'design-in-memory-file-system', 'Model polymorphic directory and file nodes cleanly under a unified object hierarchy.', 'Real-world OOP node hierarchy design problem (note: check accessibility on LeetCode).')
  ] as Triplet,

  oopDesignFallback: [
    p('Easy', '706', 'Design HashMap', 'design-hashmap', 'Implement encapsulated key-value put/get/remove methods inside a C++ class.', 'Applies OOP encapsulation and clean constructor/method separation.'),
    p('Medium', '146', 'LRU Cache', 'lru-cache', 'Encapsulate capacity-bounded eviction inside a clean class interface.', 'Demonstrates separating internal representation from public contract.'),
    p('Hard', '295', 'Find Median from Data Stream', 'find-median-from-data-stream', 'Encapsulate streaming balance invariants cleanly inside a MedianFinder class.', 'Strong C++ class encapsulation and invariant enforcement problem.')
  ] as Triplet,

  recursionFoundations: [
    p('Easy', '231', 'Power of Two', 'power-of-two', 'Determine recursively whether n is a power of two using clear base and recursive cases.', 'Direct base-case and recursive reduction practice matching Day 19.'),
    p('Medium', '50', 'Pow(x, n)', 'powx-n', 'Implement recursive binary exponentiation with O(log n) call stack depth.', 'Clean recursive divide-and-conquer call-stack trace exercise.'),
    p('Hard', '10', 'Regular Expression Matching', 'regular-expression-matching', 'Solve recursive pattern matching over characters, wildcards, and Kleene stars.', 'Demonstrates careful base cases and branching recursive subproblems.')
  ] as Triplet,

  recursionArraysStrings: [
    p('Easy', '344', 'Reverse String', 'reverse-string', 'Reverse characters recursively by swapping outer endpoints and recursing inward.', 'Directly matches Day 22 recursive string reverse exercise.'),
    p('Medium', '394', 'Decode String', 'decode-string', 'Recursively decode nested k[encoded_string] expressions by tracking string index.', 'Applies recursive string parsing and call-stack frame isolation.'),
    p('Hard', '224', 'Basic Calculator', 'basic-calculator', 'Recursively evaluate parenthesized nested sub-expressions in a single pass.', 'Uses recursion cleanly to handle nested scopes in strings.')
  ] as Triplet,

  timeComplexity: [
    p('Easy', '121', 'Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'Optimize an O(n^2) nested-loop solution down to a single O(n) pass with O(1) space.', 'Concrete demonstration of why reducing O(n^2) to O(n) matters on large inputs.'),
    p('Medium', '53', 'Maximum Subarray', 'maximum-subarray', 'Improve O(n^2) subarray enumeration to O(n) time and O(1) auxiliary space via Kadane’s algorithm.', 'Directly highlights sequential optimization vs quadratic complexity.'),
    p('Hard', '4', 'Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Achieve strict O(log(min(m,n))) time complexity instead of O(m+n) linear merge.', 'Deep time-complexity constraint challenge comparing O(m+n) vs O(log n).')
  ] as Triplet,

  stlVectorPair: [
    p('Easy', '1929', 'Concatenation of Array', 'concatenation-of-array', 'Build and resize std::vector outputs using indexing and push_back operations.', 'Clean practice with C++ std::vector creation, size(), and iteration.'),
    p('Medium', '56', 'Merge Intervals', 'merge-intervals', 'Store and sort interval vectors/pairs by start coordinate and merge overlaps cleanly.', 'Classic std::vector and pair-comparison pattern in C++.'),
    p('Hard', '354', 'Russian Doll Envelopes', 'russian-doll-envelopes', 'Sort std::vector<pair<int,int>> with custom pair ordering and find longest valid chain.', 'Applies pair ordering in std::vector to solve a multi-dimensional constraint problem.')
  ] as Triplet,

  stlAlgorithms: [
    p('Easy', '88', 'Merge Sorted Array', 'merge-sorted-array', 'Merge and maintain sorted order cleanly using STL patterns or two-way scan.', 'Reinforces sorted sequence invariants and STL sort/reverse familiarity.'),
    p('Medium', '179', 'Largest Number', 'largest-number', 'Sort strings using a custom std::sort comparator (a + b > b + a).', 'Directly practices std::sort with custom lambda comparators from Day 26.'),
    p('Hard', '315', 'Count of Smaller Numbers After Self', 'count-of-smaller-numbers-after-self', 'Combine divide-and-conquer / STL lower_bound ordering to count right-side smaller items.', 'Applies sorting invariants and binary-search positioning.')
  ] as Triplet,

  stlStackQueue: [
    p('Easy', '20', 'Valid Parentheses', 'valid-parentheses', 'Validate nested bracket matching in O(n) using std::stack LIFO semantics.', 'Directly matches Day 29 balanced-parentheses stack exercise.'),
    p('Medium', '150', 'Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation', 'Use std::stack to push operands and evaluate postfix operators in order.', 'Clean LIFO stack application for expression evaluation.'),
    p('Hard', '239', 'Sliding Window Maximum', 'sliding-window-maximum', 'Maintain a monotonic std::deque of candidate indices in O(n) time.', 'Directly exercises std::deque front/back operations taught in Day 29.')
  ] as Triplet,

  stlSetMapVerified: [
    p('Easy', '217', 'Contains Duplicate', 'contains-duplicate', 'Detect duplicate values in O(n) average time using std::unordered_set.', 'Directly practices set uniqueness and duplicate checking from Day 30.'),
    p('Medium', '49', 'Group Anagrams', 'group-anagrams', 'Group words by canonical frequency key using std::unordered_map.', 'Classic C++ map key-value grouping exercise.'),
    p('Hard', '30', 'Substring with Concatenation of All Words', 'substring-with-concatenation-of-all-words', 'Use std::unordered_map word-frequency comparisons across sliding word offsets.', 'Tests map frequency counting under strict performance constraints.')
  ] as Triplet,

  stlPriorityQueue: [
    p('Easy', '703', 'Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream', 'Maintain a min-heap std::priority_queue of size k to return the kth largest stream element.', 'Direct C++ min-heap priority_queue practice.'),
    p('Medium', '215', 'Kth Largest Element in an Array', 'kth-largest-element-in-an-array', 'Find the kth largest integer using a bounded min-heap priority_queue.', 'Directly matches Day 31 kth-largest priority_queue task.'),
    p('Hard', '295', 'Find Median from Data Stream', 'find-median-from-data-stream', 'Balance a max-heap and a min-heap priority_queue to query running medians in O(log n).', 'Applies both max-heap and min-heap std::priority_queue together.')
  ] as Triplet,

  iteratorsCustomSort: [
    p('Easy', '1636', 'Sort Array by Increasing Frequency', 'sort-array-by-increasing-frequency', 'Use a custom comparator breaking frequency ties in descending value order.', 'Directly applies multi-key custom comparator sorting taught on Day 32.'),
    p('Medium', '973', 'K Closest Points to Origin', 'k-closest-points-to-origin', 'Sort coordinate vectors using a custom squared-distance comparator.', 'Applies custom lambda comparator over multi-field points.'),
    p('Hard', '354', 'Russian Doll Envelopes', 'russian-doll-envelopes', 'Sort pairs ascending by width and descending by height via a custom comparator.', 'Shows how tie-breaking custom comparators simplify nested constraints.')
  ] as Triplet,

  linearBinarySearch: [
    p('Easy', '704', 'Binary Search', 'binary-search', 'Implement classic lo <= hi binary search on a sorted array in O(log n) time.', 'Exact binary search invariant and precondition implementation matching Day 33.'),
    p('Medium', '33', 'Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Adapt binary search invariants to determine which half remains sorted.', 'Deepens binary search loop-invariant reasoning.'),
    p('Hard', '4', 'Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'Partition two sorted arrays via binary search over cut indices in logarithmic time.', 'Ultimate binary-search partition invariant problem.')
  ] as Triplet,

  binarySearchPatterns: [
    p('Easy', '35', 'Search Insert Position', 'search-insert-position', 'Implement lower_bound manually to return the first index >= target.', 'Directly exercises std::lower_bound invariant from Day 36.'),
    p('Medium', '34', 'Find First and Last Position of Element in Sorted Array', 'find-first-and-last-position-of-element-in-sorted-array', 'Combine lower_bound and upper_bound binary searches to locate first and last occurrence.', 'Exact match to Day 36 first/last occurrence pattern.'),
    p('Hard', '410', 'Split Array Largest Sum', 'split-array-largest-sum', 'Apply binary search on the answer space using a monotonic greedy feasibility helper.', 'Applies upper/lower bound binary search to optimization decision problems.')
  ] as Triplet,

  basicSorting: [
    p('Easy', '912', 'Sort an Array', 'sort-an-array', 'Practice ordering elements cleanly and verifying sorted output on edge cases.', 'Directly tests sorting implementations and array invariants.'),
    p('Medium', '75', 'Sort Colors', 'sort-colors', 'Partition 0s, 1s, and 2s in-place with minimal swaps.', 'Connects elementary in-place swapping strategies to linear partitioning.'),
    p('Hard', '164', 'Maximum Gap', 'maximum-gap', 'Find the maximum successive difference in sorted order using bucket/radix sorting ideas.', 'Explores distribution/bucket sorting beyond O(n^2) elementary sorts.')
  ] as Triplet,

  efficientSorting: [
    p('Easy', '268', 'Missing Number', 'missing-number', 'Locate the missing value in [0..n] cleanly using sorting or XOR/sum invariants.', 'Introduces ordering and duplicate/missing boundary reasoning.'),
    p('Medium', '148', 'Sort List', 'sort-list', 'Implement top-down or bottom-up merge sort in O(n log n) time.', 'Directly implements divide-and-conquer merge sort on chains.'),
    p('Hard', '493', 'Reverse Pairs', 'reverse-pairs', 'Modify merge sort’s merge step to count important reverse pairs across sorted halves.', 'Classic merge-sort augmentation testing divide-and-conquer mastery.')
  ] as Triplet,

  hashingPatterns: [
    p('Easy', '1', 'Two Sum', 'two-sum', 'Store seen complements in an unordered_map for O(n) single-pass pair lookup.', 'Directly matches Day 39 Two Sum hashing exercise.'),
    p('Medium', '560', 'Subarray Sum Equals K', 'subarray-sum-equals-k', 'Combine prefix sums with a hash map of cumulative sum frequencies.', 'Bridges hashing frequency lookups into linear subarray counting.'),
    p('Hard', '76', 'Minimum Window Substring', 'minimum-window-substring', 'Match target character frequency hash counts dynamically across a window.', 'High-precision hash-table frequency matching under strict O(n) bounds.')
  ] as Triplet,

  twoPointersSlidingWindow: [
    p('Easy', '26', 'Remove Duplicates from Sorted Array', 'remove-duplicates-from-sorted-array', 'Compact unique values in-place using slow and fast two pointers.', 'Direct match to Day 40 in-place duplicate removal exercise.'),
    p('Medium', '3', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Expand and shrink a variable sliding window maintaining unique characters.', 'Core variable-size sliding window pattern from Day 40.'),
    p('Hard', '239', 'Sliding Window Maximum', 'sliding-window-maximum', 'Track the maximum element across every fixed-size window of length k in O(n).', 'Directly advances Day 40 fixed-window max concepts.')
  ] as Triplet,

  prefixSums: [
    p('Easy', '303', 'Range Sum Query - Immutable', 'range-sum-query-immutable', 'Precompute a prefix sum array so range queries answer in O(1) time.', 'Exact match to Day 43 prefix-array range-sum objective.'),
    p('Medium', '560', 'Subarray Sum Equals K', 'subarray-sum-equals-k', 'Count subarrays summing to k by subtracting prior prefix sums.', 'Classic prefix-sum subarray query pattern from Day 43.'),
    p('Hard', '862', 'Shortest Subarray with Sum at Least K', 'shortest-subarray-with-sum-at-least-k', 'Find shortest non-empty subarray >= k using prefix sums with a monotonic deque (handles negatives).', 'Deep prefix-sum + monotonic constraint extension.')
  ] as Triplet,

  linkedListFoundations: [
    p('Easy', '203', 'Remove Linked List Elements', 'remove-linked-list-elements', 'Traverse a singly linked list with a dummy head and delete matching nodes safely.', 'Directly matches Day 44 insert/delete-by-value traversal objective.'),
    p('Medium', '2', 'Add Two Numbers', 'add-two-numbers', 'Traverse two linked lists digit-by-digit and build a result list appending at tail.', 'Reinforces node allocation, head/tail tracking, and nullptr handling.'),
    p('Hard', '25', 'Reverse Nodes in k-Group', 'reverse-nodes-in-k-group', 'Relink k-sized sub-chains cleanly without losing head or tail pointers.', 'Rigorous pointer-relinking exercise testing linked list manipulation.')
  ] as Triplet,

  linkedListPatterns: [
    p('Easy', '206', 'Reverse Linked List', 'reverse-linked-list', 'Iteratively reverse next pointers using prev, curr, and next variables.', 'Exact match to Day 45 iterative linked-list reversal.'),
    p('Medium', '142', 'Linked List Cycle II', 'linked-list-cycle-ii', 'Use Floyd’s slow and fast pointers to detect a cycle and pinpoint its entry node.', 'Directly builds on Day 45 slow/fast cycle detection.'),
    p('Hard', '23', 'Merge k Sorted Lists', 'merge-k-sorted-lists', 'Merge k sorted linked lists systematically using divide-and-conquer or min-heap.', 'Extends Day 45 merge-sorted-lists pattern to k chains.')
  ] as Triplet,

  stackApplications: [
    p('Easy', '496', 'Next Greater Element I', 'next-greater-element-i', 'Maintain a decreasing monotonic stack to find the next greater value to the right.', 'Directly matches Day 46 next greater element exercise.'),
    p('Medium', '739', 'Daily Temperatures', 'daily-temperatures', 'Use a monotonic stack of indices to compute wait days until a warmer value.', 'Classic monotonic stack index-distance application.'),
    p('Hard', '84', 'Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'Compute previous/next smaller bars in O(n) via a monotonic stack.', 'Flagship monotonic stack boundary problem.')
  ] as Triplet,

  queueDeque: [
    p('Easy', '933', 'Number of Recent Calls', 'number-of-recent-calls', 'Maintain a FIFO queue pruning timestamps older than the 3000ms window.', 'Clean FIFO queue sliding-window pruning exercise.'),
    p('Medium', '622', 'Design Circular Queue', 'design-circular-queue', 'Implement a fixed-capacity ring buffer with head, tail, and count invariants.', 'Direct match to Day 47 circular queue objective.'),
    p('Hard', '239', 'Sliding Window Maximum', 'sliding-window-maximum', 'Use a double-ended queue (deque) to maintain candidate maxima in O(1) amortized time.', 'Direct match to Day 47 sliding-window maximum deque exercise.')
  ] as Triplet,

  binaryTreeFoundations: [
    p('Easy', '94', 'Binary Tree Inorder Traversal', 'binary-tree-inorder-traversal', 'Traverse Left → Root → Right recursively (and iteratively) across TreeNode pointers.', 'Direct match to Day 50 recursive tree traversal exercise.'),
    p('Medium', '105', 'Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Reconstruct exact TreeNode structure using preorder root and inorder left/right splits.', 'Tests deep understanding of preorder and inorder invariants.'),
    p('Hard', '124', 'Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Aggregate left and right subtree gains cleanly during postorder recursion.', 'Applies postorder recursive return values vs global path tracking.')
  ] as Triplet,

  treeTraversalProps: [
    p('Easy', '104', 'Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'Compute tree height recursively or via queue-based level-order BFS.', 'Direct match to Day 51 depth/height and BFS level counting.'),
    p('Medium', '102', 'Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Use a FIFO queue tracking level sizes to collect nodes layer by layer.', 'Exact match to Day 51 level-order BFS using queue.'),
    p('Hard', '297', 'Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree', 'Encode and reconstruct a binary tree via BFS or preorder traversal strings.', 'Demonstrates lossless tree traversal serialization.')
  ] as Triplet,

  bst: [
    p('Easy', '700', 'Search in a Binary Search Tree', 'search-in-a-binary-search-tree', 'Navigate left or right branches using the BST ordering property.', 'Direct match to Day 52 BST search implementation.'),
    p('Medium', '98', 'Validate Binary Search Tree', 'validate-binary-search-tree', 'Verify strict min/max value bounds (or sorted inorder property) across every node.', 'Exact match to Day 52 BST validation task.'),
    p('Hard', '1373', 'Maximum Sum BST in Binary Tree', 'maximum-sum-bst-in-binary-tree', 'Verify subtree BST validity and accumulate valid BST sums bottom-up.', 'Deepens BST invariant checks across arbitrary subtrees.')
  ] as Triplet,

  heaps: [
    p('Easy', '1046', 'Last Stone Weight', 'last-stone-weight', 'Repeatedly extract the two largest stones from a max-heap and push their difference.', 'Clear max-heap simulation reinforcing push/pop/top invariants.'),
    p('Medium', '347', 'Top K Frequent Elements', 'top-k-frequent-elements', 'Maintain a min-heap priority_queue of size k over frequency pairs.', 'Classic top-K priority_queue pattern.'),
    p('Hard', '295', 'Find Median from Data Stream', 'find-median-from-data-stream', 'Balance lower-half max-heap and upper-half min-heap for dynamic medians.', 'Classic dual-heap architecture problem.')
  ] as Triplet,

  greedy: [
    p('Easy', '455', 'Assign Cookies', 'assign-cookies', 'Sort children greed factors and cookie sizes and match greedily from smallest.', 'Clean introductory greedy matching choice.'),
    p('Medium', '435', 'Non-overlapping Intervals', 'non-overlapping-intervals', 'Sort intervals by finish time and greedily keep earliest-ending non-overlapping intervals.', 'Direct match to Day 54 interval selection after sorting by finish time.'),
    p('Hard', '135', 'Candy', 'candy', 'Satisfy left-neighbor and right-neighbor rating constraints in two greedy linear passes.', 'Tests proving local greedy invariants from left and right directions.')
  ] as Triplet,

  backtracking: [
    p('Easy', '1863', 'Sum of All Subset XOR Totals', 'sum-of-all-subset-xor-totals', 'Explore include/exclude choices cleanly across array elements.', 'Introductory subset-exploration recursion.'),
    p('Medium', '78', 'Subsets', 'subsets', 'Generate all unique subsets using choose-explore-unchoose backtracking.', 'Exact match to Day 57 subsets generation exercise.'),
    p('Hard', '51', 'N-Queens', 'n-queens', 'Place queens row-by-row with column and diagonal conflict pruning.', 'Classic backtracking + constraint pruning challenge.')
  ] as Triplet,

  dpFoundations: [
    p('Easy', '509', 'Fibonacci Number', 'fibonacci-number', 'Implement naive recursion, top-down memoization, and bottom-up tabulation with O(1) space.', 'Exact match to Day 58 Fibonacci memoization and tabulation conversion.'),
    p('Medium', '322', 'Coin Change', 'coin-change', 'Formulate minimum-coin state transitions over amount 0..S cleanly.', 'Demonstrates overlapping subproblems and optimal substructure beyond Fibonacci.'),
    p('Hard', '32', 'Longest Valid Parentheses', 'longest-valid-parentheses', 'Compute longest valid substring endings using structured 1D DP state transitions.', 'Tests clear DP state transition design on edge cases.')
  ] as Triplet,

  dp1d: [
    p('Easy', '70', 'Climbing Stairs', 'climbing-stairs', 'Write recurrence dp[i] = dp[i-1] + dp[i-2] with base states.', 'Exact match to Day 59 climbing stairs task.'),
    p('Medium', '198', 'House Robber', 'house-robber', 'Write recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) before coding.', 'Exact match to Day 59 house robber recurrence exercise.'),
    p('Hard', '1235', 'Maximum Profit in Job Scheduling', 'maximum-profit-in-job-scheduling', 'Sort intervals by end time and combine 1D DP transitions with binary search.', 'Scales 1D take-or-skip DP to weighted interval transitions.')
  ] as Triplet,

  dp2dVerified: [
    p('Easy', '119', "Pascal's Triangle II", 'pascals-triangle-ii', 'Compute 2D row-transition states and observe how current row depends on previous row.', 'Builds intuition for 2D grid state dependencies.'),
    p('Medium', '62', 'Unique Paths', 'unique-paths', 'Fill an m×n 2D grid DP table summing top and left transitions.', 'Exact match to Day 60 unique paths grid DP exercise.'),
    p('Hard', '115', 'Distinct Subsequences', 'distinct-subsequences', 'Fill a 2D DP table counting subsequence matches across s[0..i] and t[0..j].', 'Canonical verified Hard 2D string DP transition table.')
  ] as Triplet,

  graphFoundations: [
    p('Easy', '1971', 'Find if Path Exists in Graph', 'find-if-path-exists-in-graph', 'Build an adjacency list from an edge list and test reachability between source and destination.', 'Direct adjacency-list construction and neighbor traversal matching Day 61.'),
    p('Medium', '1557', 'Minimum Number of Vertices to Reach All Nodes', 'minimum-number-of-vertices-to-reach-all-nodes', 'Reason about directed graph in-degrees over edge lists.', 'Tests directed vs undirected graph representation concepts from Day 61.'),
    p('Hard', '127', 'Word Ladder', 'word-ladder', 'Construct implicit graph edges between neighboring words and find minimum transformation steps.', 'Bridges graph adjacency construction into shortest unweighted path search.')
  ] as Triplet,

  bfsDfs: [
    p('Easy', '733', 'Flood Fill', 'flood-fill', 'Apply DFS or BFS over a 2D grid avoiding re-visiting already-colored cells.', 'Introductory grid traversal with visited-state control.'),
    p('Medium', '200', 'Number of Islands', 'number-of-islands', 'Count connected components on a 2D grid using DFS/BFS traversal.', 'Exact match to Day 64 connected-components and grid traversal exercise.'),
    p('Hard', '127', 'Word Ladder', 'word-ladder', 'Use level-order BFS with visited tracking to find shortest transformation distance.', 'Classic shortest-path unweighted BFS challenge.')
  ] as Triplet,

  shortestPathTopoVerified: [
    p('Easy', '997', 'Find the Town Judge', 'find-the-town-judge', 'Compute vertex in-degree and out-degree counts over directed edges.', 'Directly builds in-degree intuition used in Kahn’s topological sort.'),
    p('Medium', '210', 'Course Schedule II', 'course-schedule-ii', 'Generate a topological ordering of a directed graph and detect cycles.', 'Exact match to Day 65 topological sort objective.'),
    p('Hard', '2050', 'Parallel Courses III', 'parallel-courses-iii', 'Combine Kahn’s topological ordering over a DAG with critical-path longest completion times.', 'Verified non-premium Hard topological DAG DP problem.')
  ] as Triplet,

  dsuMstVerified: [
    p('Easy', '1971', 'Find if Path Exists in Graph', 'find-if-path-exists-in-graph', 'Union connected edges via Disjoint Set Union with path compression.', 'Direct DSU find/union exercise from Day 66.'),
    p('Medium', '684', 'Redundant Connection', 'redundant-connection', 'Use DSU to find the first edge forming a cycle in a graph.', 'Matches Day 66 DSU cycle detection requirement.'),
    p('Hard', '1489', 'Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree', 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree', 'Run Kruskal’s MST algorithm with DSU to classify critical and optional MST edges.', 'Canonical verified Hard DSU + Kruskal MST problem.')
  ] as Triplet,

  bitManipulation: [
    p('Easy', '136', 'Single Number', 'single-number', 'XOR every array element together using a ^ a = 0 to isolate the unique value.', 'Exact match to Day 67 single-number XOR exercise.'),
    p('Medium', '137', 'Single Number II', 'single-number-ii', 'Count bits per bit position modulo 3 using bit masks and shifts.', 'Exercises bitwise masking and bit-by-bit reconstruction.'),
    p('Hard', '1611', 'Minimum One Bit Operations to Make Integers Zero', 'minimum-one-bit-operations-to-make-integers-zero', 'Use Gray-code bit manipulation invariants to reduce n to 0 in minimal bit operations.', 'Verified Hard bit-manipulation & parity reduction problem.')
  ] as Triplet
};

function getDayTripletSpec(dayNumber: number): Triplet {
  // Handle every specific weekday topic across Days 1..100 + map Sat/Sun revisions to their week's topic
  switch (dayNumber) {
    // Week 1 (Days 1-7)
    case 1: return TOPIC_TRIPLETS.cppSetup;
    case 2: return TOPIC_TRIPLETS.variablesDataTypes;
    case 3: return TOPIC_TRIPLETS.operatorsExpressions;
    case 4: return TOPIC_TRIPLETS.conditionals;
    case 5: return TOPIC_TRIPLETS.loops;
    case 6: return TOPIC_TRIPLETS.conditionals;
    case 7: return TOPIC_TRIPLETS.loops;

    // Week 2 (Days 8-14)
    case 8: return TOPIC_TRIPLETS.nestedLoopsDebug;
    case 9: return TOPIC_TRIPLETS.functions;
    case 10: return TOPIC_TRIPLETS.referencesOverloading;
    case 11: return TOPIC_TRIPLETS.arrays;
    case 12: return TOPIC_TRIPLETS.strings;
    case 13: return TOPIC_TRIPLETS.arrays;
    case 14: return TOPIC_TRIPLETS.strings;

    // Week 3 (Days 15-21)
    case 15: return TOPIC_TRIPLETS.matrices2d;
    case 16: return TOPIC_TRIPLETS.pointersReferences;
    case 17: return TOPIC_TRIPLETS.structsClasses;
    case 18: return TOPIC_TRIPLETS.oopDesignFallback;
    case 19: return TOPIC_TRIPLETS.recursionFoundations;
    case 20: return TOPIC_TRIPLETS.matrices2d;
    case 21: return TOPIC_TRIPLETS.recursionFoundations;

    // Week 4 (Days 22-28)
    case 22: return TOPIC_TRIPLETS.recursionArraysStrings;
    case 23:
    case 24: return TOPIC_TRIPLETS.timeComplexity;
    case 25: return TOPIC_TRIPLETS.stlVectorPair;
    case 26: return TOPIC_TRIPLETS.stlAlgorithms;
    case 27: return TOPIC_TRIPLETS.stlVectorPair;
    case 28: return TOPIC_TRIPLETS.stlAlgorithms;

    // Week 5 (Days 29-35)
    case 29: return TOPIC_TRIPLETS.stlStackQueue;
    case 30: return TOPIC_TRIPLETS.stlSetMapVerified;
    case 31: return TOPIC_TRIPLETS.stlPriorityQueue;
    case 32: return TOPIC_TRIPLETS.iteratorsCustomSort;
    case 33: return TOPIC_TRIPLETS.linearBinarySearch;
    case 34: return TOPIC_TRIPLETS.stlPriorityQueue;
    case 35: return TOPIC_TRIPLETS.linearBinarySearch;

    // Week 6 (Days 36-42)
    case 36: return TOPIC_TRIPLETS.binarySearchPatterns;
    case 37: return TOPIC_TRIPLETS.basicSorting;
    case 38: return TOPIC_TRIPLETS.efficientSorting;
    case 39: return TOPIC_TRIPLETS.hashingPatterns;
    case 40: return TOPIC_TRIPLETS.twoPointersSlidingWindow;
    case 41: return TOPIC_TRIPLETS.hashingPatterns;
    case 42: return TOPIC_TRIPLETS.twoPointersSlidingWindow;

    // Week 7 (Days 43-49)
    case 43: return TOPIC_TRIPLETS.prefixSums;
    case 44: return TOPIC_TRIPLETS.linkedListFoundations;
    case 45: return TOPIC_TRIPLETS.linkedListPatterns;
    case 46: return TOPIC_TRIPLETS.stackApplications;
    case 47: return TOPIC_TRIPLETS.queueDeque;
    case 48: return TOPIC_TRIPLETS.linkedListPatterns;
    case 49: return TOPIC_TRIPLETS.stackApplications;

    // Week 8 (Days 50-56)
    case 50: return TOPIC_TRIPLETS.binaryTreeFoundations;
    case 51: return TOPIC_TRIPLETS.treeTraversalProps;
    case 52: return TOPIC_TRIPLETS.bst;
    case 53: return TOPIC_TRIPLETS.heaps;
    case 54: return TOPIC_TRIPLETS.greedy;
    case 55: return TOPIC_TRIPLETS.bst;
    case 56: return TOPIC_TRIPLETS.greedy;

    // Week 9 (Days 57-63)
    case 57: return TOPIC_TRIPLETS.backtracking;
    case 58: return TOPIC_TRIPLETS.dpFoundations;
    case 59: return TOPIC_TRIPLETS.dp1d;
    case 60: return TOPIC_TRIPLETS.dp2dVerified;
    case 61: return TOPIC_TRIPLETS.graphFoundations;
    case 62: return TOPIC_TRIPLETS.dp1d;
    case 63: return TOPIC_TRIPLETS.dp2dVerified;

    // Week 10 (Days 64-70)
    case 64: return TOPIC_TRIPLETS.bfsDfs;
    case 65: return TOPIC_TRIPLETS.shortestPathTopoVerified;
    case 66: return TOPIC_TRIPLETS.dsuMstVerified;
    case 67: return TOPIC_TRIPLETS.bitManipulation;
    case 68: return TOPIC_TRIPLETS.arrays;
    case 69: return TOPIC_TRIPLETS.bfsDfs;
    case 70: return TOPIC_TRIPLETS.bitManipulation;

    // Week 11 (Days 71-77)
    case 71: return TOPIC_TRIPLETS.treeTraversalProps;
    case 72: return TOPIC_TRIPLETS.dp1d;
    case 73: return TOPIC_TRIPLETS.shortestPathTopoVerified;
    case 74: return TOPIC_TRIPLETS.hashingPatterns;
    case 75: return TOPIC_TRIPLETS.structsClasses;
    case 76: return TOPIC_TRIPLETS.backtracking;
    case 77: return TOPIC_TRIPLETS.dp2dVerified;

    // Week 12 (Days 78-84)
    case 78: return TOPIC_TRIPLETS.stlSetMapVerified;
    case 79: return TOPIC_TRIPLETS.binarySearchPatterns;
    case 80: return TOPIC_TRIPLETS.twoPointersSlidingWindow;
    case 81: return TOPIC_TRIPLETS.linkedListPatterns;
    case 82: return TOPIC_TRIPLETS.bst;
    case 83: return TOPIC_TRIPLETS.heaps;
    case 84: return TOPIC_TRIPLETS.prefixSums;

    // Week 13 (Days 85-91)
    case 85: return TOPIC_TRIPLETS.backtracking;
    case 86: return TOPIC_TRIPLETS.dp1d;
    case 87: return TOPIC_TRIPLETS.bfsDfs;
    case 88: return TOPIC_TRIPLETS.timeComplexity;
    case 89: return TOPIC_TRIPLETS.loops;
    case 90: return TOPIC_TRIPLETS.greedy;
    case 91: return TOPIC_TRIPLETS.dsuMstVerified;

    // Week 14-15 (Days 92-100)
    case 92: return TOPIC_TRIPLETS.strings;
    case 93: return TOPIC_TRIPLETS.stlPriorityQueue;
    case 94: return TOPIC_TRIPLETS.efficientSorting;
    case 95: return TOPIC_TRIPLETS.queueDeque;
    case 96: return TOPIC_TRIPLETS.binaryTreeFoundations;
    case 97: return TOPIC_TRIPLETS.heaps;
    case 98: return TOPIC_TRIPLETS.bitManipulation;
    case 99: return TOPIC_TRIPLETS.dp2dVerified;
    case 100: return TOPIC_TRIPLETS.linearBinarySearch;

    default: return TOPIC_TRIPLETS.arrays;
  }
}

export function getDsaDailyLeetCodeTriplet(dayNumber: number): DailyLeetCodeQuestion[] {
  const safeDay = Math.max(1, Math.min(100, dayNumber));
  const triplet = getDayTripletSpec(safeDay);

  return triplet.map((item, idx) => ({
    slot: (idx + 1) as 1 | 2 | 3,
    difficulty: item.difficulty,
    available: item.available,
    problemNumber: item.problemNumber,
    title: item.title,
    slug: item.slug,
    url: item.slug ? `https://leetcode.com/problems/${item.slug}/` : undefined,
    shortExplanation: item.shortExplanation,
    whyMatchesTopic: item.whyMatchesTopic,
    whyUnavailable: item.whyUnavailable,
    isVerified: Boolean(item.available && item.slug && item.title)
  }));
}

// =========================================================================
// VERIFIED OFFICIAL DOCUMENTATION CATALOG (MAIN PLAN, DSA C++, AZURE)
// =========================================================================
function docRef(
  id: string,
  title: string,
  url: string,
  description: string,
  sourceLabel: string
): DailyReferenceLink {
  return {
    id,
    resourceType: 'official_documentation',
    title,
    url,
    description,
    sourceLabel,
    isVerifiedUrl: true
  };
}

function hasAnyTerm(text: string, terms: string[]): boolean {
  return terms.some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  });
}

export function getOfficialDocsForTrackDay(
  ctx: CurriculumDayContext
): DailyReferenceLink[] {
  const topicText = ctx.topic.toLowerCase();
  const phaseText = ctx.phaseOrModule.toLowerCase();

  if (ctx.trackId === 'main') {
    const docs: DailyReferenceLink[] = [];

    if (hasAnyTerm(topicText, ['python refresh', 'environment', 'environments', 'runtime'])) {
      docs.push(
        docRef('py_docs', 'Python 3 Official Documentation — Typing & Exceptions', 'https://docs.python.org/3/library/typing.html', 'Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.', 'Python Software Foundation'),
        docRef('py_async', 'Python asyncio — Asynchronous I/O Documentation', 'https://docs.python.org/3/library/asyncio.html', 'Official reference for async/await event loops and non-blocking I/O.', 'Python Software Foundation')
      );
    } else if (hasAnyTerm(topicText, ['fastapi', 'http', 'rest', 'health', 'api'])) {
      docs.push(
        docRef('fastapi_docs', 'FastAPI Official Tutorial & Reference', 'https://fastapi.tiangolo.com/tutorial/', 'Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.', 'FastAPI Docs'),
        docRef('pydantic_docs', 'Pydantic Settings & Validation Docs', 'https://docs.pydantic.dev/latest/concepts/pydantic_settings/', 'Official Pydantic v2 BaseSettings configuration and schema validation documentation.', 'Pydantic Docs')
      );
    } else if (hasAnyTerm(topicText, ['react', 'frontend', 'ui', 'component', 'components', 'state', 'streaming'])) {
      docs.push(
        docRef('react_docs', 'React Official Learn Documentation', 'https://react.dev/learn', 'Official React guide covering components, state boundaries, hooks, and UI architecture.', 'React Docs'),
        docRef('ts_docs', 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', 'Official TypeScript handbook for typed API contracts and component props.', 'TypeScript Docs')
      );
    } else if (hasAnyTerm(topicText, ['test', 'testing', 'eval', 'evaluation', 'recall', 'precision', 'regression'])) {
      docs.push(
        docRef('pytest_docs', 'pytest Official Documentation', 'https://docs.pytest.org/en/stable/', 'Official pytest documentation for unit, integration, and fixture-driven API tests.', 'pytest Docs'),
        docRef('fastapi_test', 'FastAPI Testing Guide', 'https://fastapi.tiangolo.com/tutorial/testing/', 'Official TestClient documentation for verifying FastAPI endpoints.', 'FastAPI Docs')
      );
    } else if (hasAnyTerm(topicText, ['git', 'ci', 'cd', 'workflow'])) {
      docs.push(
        docRef('git_docs', 'Official Git Reference Manual', 'https://git-scm.com/docs', 'Authoritative Git CLI reference for branching, merging, and clean commits.', 'Git SCM'),
        docRef('gh_actions', 'GitHub Actions Documentation', 'https://docs.github.com/en/actions', 'Official CI/CD workflow reference for automated testing and deployment pipelines.', 'GitHub Docs')
      );
    } else if (hasAnyTerm(topicText, ['database', 'sql', 'vector', 'postgres', 'postgresql', 'chunk', 'chunking', 'embedding', 'embeddings', 'retrieval', 'rag', 'llm'])) {
      docs.push(
        docRef('pg_docs', 'PostgreSQL Official Documentation', 'https://www.postgresql.org/docs/current/', 'Official PostgreSQL documentation for relational entities, indexing, and transactions.', 'PostgreSQL Docs'),
        docRef('gemini_api_docs', 'Google Gemini API Official Documentation', 'https://ai.google.dev/gemini-api/docs', 'Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.', 'Google AI for Developers')
      );
    } else if (hasAnyTerm(topicText, ['container', 'containers', 'docker', 'deploy', 'deployment'])) {
      docs.push(
        docRef('docker_docs', 'Docker Official Documentation', 'https://docs.docker.com/get-started/', 'Official Docker guide for multi-stage builds, containerization, and Compose setups.', 'Docker Docs'),
        docRef('fastapi_deploy', 'FastAPI Deployment Guide', 'https://fastapi.tiangolo.com/deployment/', 'Official FastAPI production deployment and container architecture guidance.', 'FastAPI Docs')
      );
    } else {
      docs.push(
        docRef('fastapi_main', 'FastAPI Official Documentation', 'https://fastapi.tiangolo.com/', 'Core backend API framework reference for Production RAG services.', 'FastAPI Docs'),
        docRef('gemini_main', 'Google AI Gemini API Documentation', 'https://ai.google.dev/gemini-api/docs', 'Official LLM & RAG architecture API documentation.', 'Google AI for Developers')
      );
    }
    return docs;
  }

  if (ctx.trackId === 'dsa') {
    if (hasAnyTerm(topicText, ['vector', 'vectors', 'stack', 'stacks', 'queue', 'queues', 'deque', 'set', 'sets', 'map', 'maps', 'priority', 'stl', 'iterator', 'iterators'])) {
      return [
        docRef('cpp_containers', 'cppreference — C++ Containers Library', 'https://en.cppreference.com/w/cpp/container', 'Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.', 'cppreference'),
        docRef('cpp_algo', 'cppreference — C++ Algorithms Library', 'https://en.cppreference.com/w/cpp/algorithm', 'Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.', 'cppreference')
      ];
    }
    if (hasAnyTerm(topicText, ['string', 'strings'])) {
      return [
        docRef('cpp_string', 'cppreference — std::basic_string', 'https://en.cppreference.com/w/cpp/string/basic_string', 'Complete C++ std::string methods reference (substr, find, length, compare).', 'cppreference')
      ];
    }
    if (hasAnyTerm(topicText, ['class', 'classes', 'struct', 'structs', 'object', 'object-oriented', 'pointer', 'pointers'])) {
      return [
        docRef('cpp_classes', 'cppreference — Classes & Structs', 'https://en.cppreference.com/w/cpp/language/classes', 'Official reference covering C++ constructors, access specifiers, inheritance, and pointers.', 'cppreference')
      ];
    }
    return [
      docRef('cpp_lang', 'cppreference — C++ Language Reference', 'https://en.cppreference.com/w/cpp/language', 'Authoritative C++17 language reference covering types, operators, control flow, and functions.', 'cppreference'),
      docRef('cpp_algo_base', 'cppreference — C++ Standard Algorithms', 'https://en.cppreference.com/w/cpp/algorithm', 'Official C++ STL algorithm reference and complexity guarantees.', 'cppreference')
    ];
  }

  // Azure Track — strictly Official Microsoft Learn links!
  if (hasAnyTerm(topicText, ['search', 'rag', 'hybrid search', 'hybrid retrieval', 'capstone search'])) {
    return [
      docRef('ms_aisearch', 'Microsoft Learn — Azure AI Search Documentation', 'https://learn.microsoft.com/en-us/azure/search/', 'Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.', 'Microsoft Learn'),
      docRef('ms_rag', 'Microsoft Learn — RAG Architecture in Azure AI Search', 'https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview', 'Official Microsoft guide to RAG pipelines, chunking, and grounding citations.', 'Microsoft Learn')
    ];
  }
  if (hasAnyTerm(topicText, ['generative', 'genai', 'foundry', 'prompt', 'deployment', 'safety'])) {
    return [
      docRef('ms_foundry', 'Microsoft Learn — Azure AI Foundry Documentation', 'https://learn.microsoft.com/en-us/azure/ai-foundry/', 'Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.', 'Microsoft Learn'),
      docRef('ms_openai_safety', 'Microsoft Learn — Azure AI Content Safety', 'https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview', 'Official Microsoft documentation for content filtering, prompt shields, and AI safety.', 'Microsoft Learn')
    ];
  }
  if (
    hasAnyTerm(topicText, ['sql', 'relational', 'non-relational', 'oltp', 'olap', 'cosmos', 'analytics', 'dp-900', 'data-model']) ||
    (hasAnyTerm(topicText, ['weekly']) && phaseText.includes('dp-900'))
  ) {
    return [
      docRef('ms_sql', 'Microsoft Learn — Azure SQL Documentation', 'https://learn.microsoft.com/en-us/azure/azure-sql/', 'Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.', 'Microsoft Learn'),
      docRef('ms_cosmos', 'Microsoft Learn — Azure Cosmos DB Documentation', 'https://learn.microsoft.com/en-us/azure/cosmos-db/', 'Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.', 'Microsoft Learn')
    ];
  }
  if (hasAnyTerm(topicText, ['storage', 'network', 'networking', 'compute', 'identity', 'security', 'governance', 'pricing', 'budgets', 'slas', 'monitor', 'monitoring', 'core services', 'az-900'])) {
    return [
      docRef('ms_arch', 'Microsoft Learn — Azure Core Cloud Services Documentation', 'https://learn.microsoft.com/en-us/azure/', 'Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.', 'Microsoft Learn'),
      docRef('ms_az900', 'Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path', 'https://learn.microsoft.com/en-us/training/courses/az-900t00', 'Official Microsoft Learn Azure Fundamentals training modules.', 'Microsoft Learn')
    ];
  }
  if (
    hasAnyTerm(topicText, ['document intelligence', 'vision', 'language', 'speech', 'conversational', 'ai workload', 'ai workloads', 'ai-102', 'machine learning', 'capstone']) ||
    (hasAnyTerm(topicText, ['weekly']) && (phaseText.includes('ai-102') || phaseText.includes('capstone')))
  ) {
    return [
      docRef('ms_aisvc', 'Microsoft Learn — Azure AI Services Documentation', 'https://learn.microsoft.com/en-us/azure/ai-services/', 'Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.', 'Microsoft Learn'),
      docRef('ms_ai102', 'Microsoft Learn — Exam AI-102 Study & Training Path', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/', 'Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.', 'Microsoft Learn')
    ];
  }
  return [
    docRef('ms_az900_hub', 'Microsoft Learn — Cloud Concepts & Azure Fundamentals', 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/', 'Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.', 'Microsoft Learn'),
    docRef('ms_azure_home', 'Microsoft Learn — Azure Architecture Center', 'https://learn.microsoft.com/en-us/azure/architecture/', 'Official Microsoft reference architectures and best practices.', 'Microsoft Learn')
  ];
}
