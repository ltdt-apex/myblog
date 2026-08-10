---
title: "[Weekly Contest 491] Q2 Proof"
date: 2026-03-02
layout: post
cover: /img/algorithm.png
tags:
  - Competitive Programming
---

This is not a hard question, but I find a surprising number of LeetCoders think it is a greedy question (which is not what I had in mind), and have written explanations to "prove" it.

Let's take a look at their solutions and talk about what's right and wrong with their reasoning.

<!-- more -->

1. Introduction
    1. [Question](https://leetcode.com/problems/minimum-cost-to-split-into-ones/description/) (Medium)

    2. My original solution
        My first instinct was that this is a DP question. We can easily derive the recurrence $f(x) = \min(ab + f(a) + f(b))$.

        ```cpp
        class Solution {
        public:
            int minCost(int n) {
                vi dp(n+1,INT_MAX);
                dp[1] = 0;

                rep(i,2,n+1){
                    rep(j,1,i){
                        int a = j;
                        int b = i-j;

                        dp[i] = min(dp[i], a*b+dp[a]+dp[b]);
                    }
                }

                return dp[n];
            }
        };
        ```

2. What others think
    When I checked the solutions from other LeetCoders, many claim that the optimal strategy is greedy, we can always split `x` into `1` and `x-1`, so the answer is simply `n(n-1)/2`. Let me share some of their explanations and point out exactly what each one is missing.

    1. Proof by example
        Some people just list out a few sample observations and claim that splitting with `1` and `x-1` is always better, for example, [this](https://leetcode.com/problems/minimum-cost-to-split-into-ones/solutions/7616453/b-ks-solution-1-line-code-100-beats-by-s-rfc5/) and [this](https://leetcode.com/problems/minimum-cost-to-split-into-ones/solutions/7616595/minimum-cost-to-split-into-ones-math-obs-n69a/).

        **Problem:** Listing a few examples and calling it a proof is... not a proof. Nobody knows if the pattern holds in all cases. And even if it did, it only talks about the very first split, what about everything that comes after?

    2. Proof by first split
        Someone actually provides a solid and rigorous proof of why splitting with `1` and `x-1` minimises the immediate split cost, for example, [this](https://leetcode.com/problems/minimum-cost-to-split-into-ones/solutions/7618346/take-one-by-one-with-proof-recursive-on-bckny/).

        **Problem:** This one correctly proves that the immediate cost of the first split is minimised by `1` and `x-1`, solid work. But it falls into the same trap as before: it says nothing about the total cost from further splits under a different initial choice. That one missing piece is enough to make the whole argument fall apart.

3. Correct idea and proof
    The true answer is indeed `n(n-1)/2`, but that does not make the above proofs correct. The proper proof can be derived either by mathematical induction like [this](https://leetcode.com/problems/minimum-cost-to-split-into-ones/solutions/7616271/beats-100-1-line-solution-with-explanati-p6tt/), or by combinatorics like [this](https://leetcode.com/problems/minimum-cost-to-split-into-ones/solutions/7620936/1-line-code-math-solution-by-raj_gour-ofha/).

    Both proofs show that **no matter how you split, the total cost is always the same**, it just so happens that the answer is `n(n-1)/2`. This creates the illusion that the greedy cut of `1` and `x-1` is most optimal, when in reality every strategy is equally optimal.

It is funny how people can arrive at a correct answer with an incorrect argument. It is a good reminder that **getting the right answer does not mean having the right approach**.
