---
title: "[Weekly Contest 490] Q4"
date: 2026-02-28
layout: post
cover: /img/Sakura_Nene_Algorithms.png
tags:
  - Competitive Programming
---

This is one of the most fun LeetCode problems I've seen in a long time. It doesn't require any particularly hard prerequisite concepts, data structures, or algorithms — just basic {% spoiler knapsack dp %} knowledge is enough to solve it.

The trickiest (and most fun) part is figuring out how to recognize and convert it into a {% spoiler knapsack dp %} problem.

1. Introduction
    1. [Question](https://leetcode.com/problems/count-sequences-to-k/submissions/1933866045/) (Hard)

    2. What does it ask?
        Given an array $v$, for each element we can either assign it to the numerator, the denominator, or skip it entirely. The elements assigned to the numerator multiply together to form $c$, and those assigned to the denominator multiply together to form $d$. The goal is to count the number of ways to assign elements of $v$ such that $c/d = k$.

    3. Example
        Say the input is $v = [2, 3, 2, 5],\ k = 3$.

        One way is to assign the first and second elements to the numerator and the third to the denominator, leaving $5$ unassigned, giving $2 \cdot 3 / 2 = 3$.

        There are 3 ways in total to make it equal to $3$.

2. Core idea
    1. Observation
        The constraints state that each element of $v$ is between $1$ and $6$. This is crucial, because:
        $$
        \begin{align*}
        1=2^0 \cdot 3^0 \cdot 5^0 \\
        2=2^1 \cdot 3^0 \cdot 5^0 \\
        3=2^0 \cdot 3^1 \cdot 5^0 \\
        4=2^2 \cdot 3^0 \cdot 5^0 \\
        5=2^0 \cdot 3^0 \cdot 5^1 \\
        6=2^1 \cdot 3^1 \cdot 5^0
        \end{align*}
        $$

        <table><tr>
        <td>

        <span style="color:var(--red)"><strong>Notice that</strong></span> every element has only $2$, $3$, and $5$ as prime factors. This means if $k$ has any other prime factor, it is impossible to form $k$, and we can immediately return $0$.

        Otherwise, we factorize $k$ as $k = 2^{c2} \cdot 3^{c3} \cdot 5^{c5}$. The problem then reduces to counting the number of ways to assign elements to the numerator or denominator such that $c/d = 2^{c2} \cdot 3^{c3} \cdot 5^{c5}$.

        </td>
        <td width="220">

        ![doge](/myblog/img/doge_math.png)

        </td>
        </tr></table>

    2. Solution (Naive)
        To solve this, we iterate on each element, for each element of $v$ we track the count each prime factors ($2$, $3$, $5$) based on different action. For example, placing $4$ in the numerator increases the count of prime $2$ by $2$, while placing it in the denominator decreases it by $2$. At the end, we count how many ways lead to the target balance $2^{c2} \cdot 3^{c3} \cdot 5^{c5}$. There is 3^N combination of actions we can choose from so the solution is O(3^N).

    3. Real Solution
        This is a very common knapsack DP pattern. We define a 3D array `dp[i][j][k]` where the value represents the number of ways to reach a running product ratio of $2^{i} \cdot 3^{j} \cdot 5^{k}$. Initially, `dp[0][0][0] = 1`, representing the count of initial value.

        For each element in $v$ with prime factorization $2^{l2} \cdot 3^{l3} \cdot 5^{l5}$, we create a new array `ndp` and consider three choices:

        - **Add to numerator** — the exponents increase by $(l2, l3, l5)$, so:
          `ndp[i][j][k] += dp[i - l2][j - l3][k - l5]`
        - **Add to denominator** — the exponents decrease by $(l2, l3, l5)$, so:
          `ndp[i][j][k] += dp[i + l2][j + l3][k + l5]`
        - **Skip** — the exponents stay the same, so:
          `ndp[i][j][k] += dp[i][j][k]`

        After processing all elements, the answer is `dp[c2][c3][c5]`.

        > [!warning] Negative count
        > on the fly, the exponent counts can go negative (when the denominator contributes more than the numerator for a given prime). To handle this, we shift all indices by an offset of 19 in the implementation.

3. Implementation
    ```cpp
    class Solution {
    public:
        int countSequences(vector<int>& v, long long k) {
            int n = v.size();

            // factorize k into 2^c2 * 3^c3 * 5^c5
            int c2 = 0;
            int c3 = 0;
            int c5 = 0;

            while(k%2==0){
                c2++;
                k/=2;
            }

            while(k%3==0){
                c3++;
                k/=3;
            }

            while(k%5==0){
                c5++;
                k/=5;
            }

            // k has a prime factor other than 2, 3, 5, impossible case
            if(k!=1) return 0;

            // dp[i][j][k] = number of ways to reach ratio 2^(i-19) * 3^(j-19) * 5^(k-19)
            // offset by 19 to handle negative exponents
            int dp[39][39][39] = {0};
            dp[19][19][19] = 1; // base case: empty product (ratio = 1)

            rep(l,0,n){
                int ndp[39][39][39] = {0};
                int x = v[l];

                // factorize current element into 2^l2 * 3^l3 * 5^l5
                int l2 = 0;
                int l3 = 0;
                int l5 = 0;

                while(x%2==0){
                    l2++;
                    x/=2;
                }

                while(x%3==0){
                    l3++;
                    x/=3;
                }

                while(x%5==0){
                    l5++;
                    x/=5;
                }

                rep(i,0,39){
                    rep(j,0,39){
                        rep(k,0,39){
                            // skip: don't assign current element
                            ndp[i][j][k] = dp[i][j][k];

                            // add current to numerator: exponents increase
                            if(i-l2>=0 and j-l3>=0 and k-l5>=0){
                                ndp[i][j][k] += dp[i-l2][j-l3][k-l5];
                            }

                            // add current to denominator: exponents decrease
                            if(i+l2<39 and j+l3<39 and k+l5<39){
                                ndp[i][j][k] += dp[i+l2][j+l3][k+l5];
                            }
                        }
                    }
                }

                rep(i,0,39){
                    rep(j,0,39){
                        rep(k,0,39){
                            dp[i][j][k] = ndp[i][j][k];
                        }
                    }
                }
            }

            // read answer at target exponents (with offset)
            return dp[c2+19][c3+19][c5+19];
        }
    };
    ```

4. Complexity

    $O(N^4)$, where $N$ is the size of $v$.

    Each element can contribute at most $O(N)$ to each prime exponent, so the DP table has $O(N)$ entries per dimension, giving $O(N^3)$ states total. Processing each of the $N$ elements takes $O(N^3)$ to update all states, resulting in $O(N^4)$ overall.