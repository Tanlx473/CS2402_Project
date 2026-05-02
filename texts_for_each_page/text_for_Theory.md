# Theory: Buffon-Laplace Needle Problem

## 1. The Classic Starting Point: Buffon's Needle

In 1733, the French naturalist **Georges-Louis Leclerc, Comte de Buffon** posed a deceptively simple question:

> If a needle of length $\ell$ is dropped randomly onto a floor ruled with parallel lines spaced $d$ apart (where $\ell \leq d$), what is the probability that the needle crosses a line?

The answer turns out to be:

$$P = \frac{2\ell}{\pi d}$$

This result is remarkable — a physical experiment involving a needle and a floor gives us a way to estimate $\pi$. The more times we drop the needle, the better our estimate becomes.

But what if the floor has lines in **both** directions?

------

## 2. Extending to Two Dimensions: The Buffon-Laplace Problem

The **Buffon-Laplace Needle Problem** generalises the original version by replacing the parallel lines with a **rectangular grid**: horizontal lines spaced $b$ apart and vertical lines spaced $a$ apart.

A needle of length $\ell$ (with $\ell < a$ and $\ell < b$) is dropped randomly. We now ask: **what is the probability that the needle crosses at least one grid line?**

This version was first attempted by Buffon in 1777, but his derivation contained an error. A correct solution was later published by **Pierre-Simon Laplace** in 1812 — hence the problem carries both names.

------

## 3. Setting Up the Model

By symmetry, we only need to consider a single rectangular cell of the grid. The needle's state is fully described by three random variables, all assumed to be **uniformly distributed**:

- $(x, y)$: the coordinates of the needle's **centre**, where $0 < x < a$ and $0 < y < b$
- $\phi$: the needle's **angle of orientation**, where $-\pi/2 < \phi < \pi/2$

The needle crosses a **vertical** line when its horizontal projection reaches a line:

$$x < \frac{\ell}{2}|\cos\phi| \quad \text{or} \quad x > a - \frac{\ell}{2}|\cos\phi|$$

The needle crosses a **horizontal** line when its vertical projection reaches a line:

$$y < \frac{\ell}{2}|\sin\phi| \quad \text{or} \quad y > b - \frac{\ell}{2}|\sin\phi|$$

------

## 4. Deriving the Probability

It is easier to first compute the probability that the needle crosses **no** lines — i.e., the centre $(x, y)$ is far enough from all four sides of the cell. At a fixed angle $\phi$, this "safe" area is:

$$F(\phi) = ab - b\ell|\cos\phi| - \ell a|\sin\phi| + \frac{1}{2}\ell^2|\sin(2\phi)|$$

The last term accounts for the fact that being close to both a horizontal and a vertical line is counted twice and must be corrected.

Integrating over all angles and dividing by the total sample space $\pi ab$ gives:

$$P(\text{no crossing}) = \frac{\displaystyle\int_{-\frac{\pi}{2}}^{\frac{\pi}{2}} F(\phi), d\phi}{\pi ab}$$

Evaluating this integral and subtracting from 1 yields the **closed-form result**:

$$\boxed{P(\ell;, a,, b) = \frac{2\ell(a + b) - \ell^2}{\pi ab}}$$

------

## 5. Estimating $\pi$

Rearranging the formula above, we can solve for $\pi$:

$$\pi = \frac{2\ell(a + b) - \ell^2}{P \cdot ab}$$

In a simulation with $n$ needle drops, if $H$ of them result in a crossing, we estimate $P \approx H/n$, giving:

$$\hat{\pi} = \frac{\left[2\ell(a + b) - \ell^2\right] \cdot n}{H \cdot ab}$$

By the **Law of Large Numbers**, as $n \to \infty$, $\hat{\pi}$ converges to the true value of $\pi$.

------

## 6. Special Case: Square Grid ($a = b$) *(Further Reading)*

When $a = b$ and we let $x = \ell/a \in (0,1)$, it becomes possible to distinguish three outcomes and assign each a probability:

| Outcome                          | Probability                     |
| -------------------------------- | ------------------------------- |
| Crosses no lines                 | $P_0 = 1 - \dfrac{x(4-x)}{\pi}$ |
| Crosses exactly one line         | $P_1 = \dfrac{2x(2-x)}{\pi}$    |
| Crosses two lines simultaneously | $P_2 = \dfrac{x^2}{\pi}$        |

Note that $P_0 + P_1 + P_2 = 1$. In the demo, these three outcomes are shown in **different colours**, so you can observe how their relative frequencies shift as needle length changes.

------

## 7. What to Observe in the Demo

- **More throws → better estimate**: watch $\hat{\pi}$ stabilise as $n$ increases — this is the Law of Large Numbers in action
- **Effect of $\ell$**: a longer needle crosses lines more often, but also changes the formula's sensitivity
- **Effect of grid spacing $a, b$**: wider spacing means fewer crossings and a lower $P(\text{hit})$
- **Colour distribution** *(square grid)*: as $x = \frac{\ell}{a}$ increases, the proportion of red needles (crossing two lines) grows as $\frac{x^2}{\pi}$

