---
title: Binary Trie
date: 2026-02-23
layout: page
---

1. Introduction
    1. Setting
        Given an array $v$, find the maximum Xor of two number from array $v$
    
    2. Bruteforce Solution
        A trivial brute-force approach is $O(N^2)$, iterating each pair of numbers and take the maximum Xor from these pair.
    
    3. Idea
        The idea of binary trie help us store all the number in a trie data structure, it help us to find the maximum xor of a number to all other number in $A$ at once, reducing the iteration to $O(N)$.

2. Core idea
    1. Property of bit and Xor
        For two number $a$ and $b$, if $a$ first bit position that is 1 is greater than $b$, then $a > b$, e,g, $4(100_2) > 2(010_2)$. So to find maximum Xor of two number in array $A$, we can start from looking numbers pair which have bit 0 and 1 from greatest bit or lowest bit. For example, if $a=7(111_2)$ and $b=3(011_2)$, $c=5(101_2)$, $a \oplus b = 4(100_2) > a \oplus c = 2(010_2)$, because the leftmost pair of 0 and 1 for $a$ and $b$ is greater than $a$ and $c$. 
    2. Binary Trie
        Binary Trie stores numbers from greatest bit to lowest bit, to find a greatest xor of a number $a$ to any number in $c$, we start from greatest bit, find if there exist a opposite bit in same bit position with respective level in trie, if we can find a bit that is opposite to current bit, that mean we found a number $b$ in $v$ which can form 1 for current bit from two number, and it is always better than the case if we don't use number $b$ because it will make the xor result smaller, then we traverse the node of binary trie and check for next bit interatively.


3. Implementation
    ```cpp
    // Binary Trie 
    // O(n) insert, remove, maxXor
    // O(n) in memory

    struct TrieNode {
        TrieNode* c[2] = {};
        int count = 0; // count of numbers passing through this node

        TrieNode() : count(0) {}
    };

    struct Trie {
        TrieNode* root;

        Trie() {
            root = new TrieNode();
        }

        ~Trie() {
            deleteTrie(root);
        }

        // Recursive function to delete all nodes
        void deleteTrie(TrieNode* node) {
            if (!node) return;
            for (int i = 0; i < 2; i++) {
                if (node->c[i]) {
                    deleteTrie(node->c[i]);
                }
            }
            delete node;
        }

        // Insert a word into the Trie
        void insert(int x) {
            TrieNode* current = root;

            for(int i=31; i>=0; i--) {
                int bit = (x >> i) & 1;
                if (!current->c[bit]) {
                    current->c[bit] = new TrieNode();
                }
                current = current->c[bit];
                current->count++;
            }
        }

        void remove(int x) {
            TrieNode* current = root;

            for(int i=31; i>=0; i--) {
                int bit = (x >> i) & 1;
                current = current->c[bit];
                current->count--;
            }
        }

        int maxXor(int x) {
            TrieNode* current = root;
            int maxXor = 0;

            for(int i=31; i>=0; i--) {
                int bit = (x >> i) & 1;
                int desiredBit = 1 - bit; // we want the opposite bit for max XOR

                if (current->c[desiredBit] && current->c[desiredBit]->count > 0) {
                    maxXor |= (1 << i); // set the ith bit in maxXor
                    current = current->c[desiredBit];
                } else {
                    current = current->c[bit]; // go to the same bit if desired bit is not available
                }
            }

            return maxXor;
        }
    };
    ```
4. Complexity

    1. insert number is $O(b \cdot N)$, where b is the number of bit we want to use, in above example, $b=31$.
    2. searching is also is $O(b \cdot N)$.
