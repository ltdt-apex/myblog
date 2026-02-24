---
title: Binary Trie
date: 2026-02-23
layout: post
cover: /img/Sakura_Nene_Algorithms_crop.png
tags:
  - competitive programming
---

1. Introduction
    1. Setting
        Given an array $v$, find the maximum XOR of two numbers from array $v$.

    2. Brute-force Solution
        A trivial brute-force approach is $O(N^2)$: iterate over each pair of numbers and take the maximum XOR among all pairs.

    3. Idea
        A binary trie stores all the numbers in a trie data structure. For each number, we can find the maximum XOR against all other numbers in $v$ in $O(b)$ time, where $b$ is the number of bits. This reduces the overall complexity to $O(N \cdot b)$.

2. Core Idea
    1. Property of Bits and XOR
        For two numbers $a$ and $b$, if the highest set bit of $a$ is greater than that of $b$, then $a > b$, e.g., $4(100_2) > 2(010_2)$. So to maximize the XOR of two numbers, we should prioritize making the highest bits equal to 1. For example, if $a=7(111_2)$, $b=3(011_2)$, and $c=5(101_2)$, then $a \oplus b = 4(100_2) > a \oplus c = 2(010_2)$, because $a$ and $b$ differ at a higher bit position than $a$ and $c$ do.

    2. Binary Trie
        A binary trie stores each number bit by bit from the most significant bit (MSB) to the least significant bit (LSB). To find the maximum XOR of a number $a$ against any number in $v$, we traverse the trie from the MSB. At each level, we try to follow the opposite bit of $a$'s current bit. If an opposite bit exists, which mean we find at least a number in $v$ that have bit opposite to $a's$ current bit, we take that path, this sets a 1 in the XOR result at this position, which is always better than setting a 0. If the opposite bit does not exist, we have no choice but to use the same bit. We repeat this for each bit until we reach the LSB.


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

    1. Inserting a single number takes $O(b)$, where $b$ is the number of bits (32 in the implementation above). Inserting all $N$ numbers takes $O(b \cdot N)$.
    2. Finding the maximum XOR for a single number takes $O(b)$. Finding the overall maximum XOR across all $N$ numbers takes $O(b \cdot N)$.

5. Example

    1. [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) (Easy)
        
        solution:

        ```cpp
        class Solution {
        public:
            int findMaximumXOR(vector<int>& v) {
                int n = v.size();

                Trie trie;
                int a = 0;

                rep(i,0,n) trie.insert(v[i]);
                rep(i,0,n) a = max(a,trie.maxXor(v[i]));

                return a;
            }
        };
        ```

    2. [Maximum Subarray XOR with Bounded Range](https://leetcode.com/problems/maximum-subarray-xor-with-bounded-range/description/) (Hard)

        solution:

        ```cpp
        class Solution {
        public:
            int maxXor(vector<int>& v, int k) {
                int n =  v.size();
                deque<int> maxq, minq;

                Trie trie;
                trie.insert(0);

                vi p(n+1);
                rep(i,1,n+1){
                    p[i] = p[i-1] ^ v[i-1];
                }

                int l = 0;
                int a = 0;

                rep(r,0,n){
                    while(not maxq.empty() and maxq.back()<v[r]) maxq.pop_back();
                    while(not minq.empty() and minq.back()>v[r]) minq.pop_back();

                    maxq.pb(v[r]);
                    minq.pb(v[r]);

                    while(l<r and maxq.front()-minq.front()>k){
                        if(maxq.front() == v[l]) maxq.pop_front();
                        if(minq.front() == v[l]) minq.pop_front();

                        trie.remove(p[l]);
                        l++;
                    }

                    cout << l << " " << r << endl;

                    a = max(a,trie.maxXor(p[r+1]));
                    trie.insert(p[r+1]);
                }

                return a;
            }
        };
        ```