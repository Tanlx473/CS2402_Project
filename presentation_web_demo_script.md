# Webpage Demonstration 演示网页部分

## Opening 开场

Good afternoon everyone. In this part, I will briefly demonstrate the webpages we built for our Buffon-Laplace Needle Problem project. Our goal was not only to present the mathematics, but also to turn it into something visual, interactive, and easy to explore during the presentation.

大家下午好。接下来这部分，我会简要演示我们为 Buffon-Laplace 投针问题项目制作的网页。我们的目标不只是展示数学公式，而是把它做成一个可视化、可互动、并且在展示过程中容易理解的学习工具。

## index.html 首页

First, this is the home page. It gives the audience a quick project overview, including the topic, the purpose of the project, and the main navigation links to the Demo, Theory, and Team-based Learning pages. It also includes the group member section and a references section, so the homepage works as a simple entry point for the whole project.

首先，这是首页。它让观众可以快速了解整个项目，包括项目主题、项目目的，以及通往 Demo、Theory 和 Team-based Learning 页面的主要导航链接。它也包含小组成员信息和参考资料部分，所以这个首页相当于整个项目的统一入口。

When presenting live, I would use this page to show the structure of the project first, so the audience knows that our website is divided into three parts: interactive experiment, mathematical explanation, and team reflection.

在现场展示时，我会先用这个页面说明项目结构，让观众知道我们的网站主要分成三部分：交互式实验、数学理论解释，以及团队反思总结。

## demo.html 演示页面

The main part of our webpage demonstration is this Demo page. We help users directly experiment with the Buffon-Laplace model.

我们网页演示的重点是这个 Demo 页面。这是整个项目的核心，我们让读者可以直接动手实验 Buffon-Laplace 模型。

At the top, there is a short “How to Use This Demo” guide. It explains the workflow clearly: first set the needle length and the grid spacings, then choose the number of trials, then either drop one needle or run many trials at once. This makes the page easy to follow even for a first-time user.

页面上方有一个简短的 “How to Use This Demo” 使用说明。它把操作流程写得很清楚：先设置针长和网格间距，再输入试验次数，然后可以选择单次投针，或者一次运行多次试验。这样即使是第一次使用的观众，也能很快明白怎么操作。

The left side is the control panel. Here we can adjust four parameters: the needle length `l`, the grid width `a`, the grid height `b`, and the number of trials `N`. One good design detail is that when we change any parameter, the simulation resets automatically. This avoids mixing old results with a new experimental setup.

左侧是控制面板。这里可以调整四个参数：针的长度 `l`、网格宽度 `a`、网格高度 `b`，以及试验次数 `N`。一个比较好的设计细节是，只要参数发生变化，模拟就会自动重置。这样可以避免把旧实验结果和新的参数设置混在一起。

Then we have three buttons. “Drop One Needle” is useful for live explanation, because we can see one individual trial at a time. “Run N times” is more useful for showing the statistical trend, because it runs a batch simulation. “Reset” clears the canvas and all counters so we can restart immediately.

接下来有三个按钮。“Drop One Needle” 很适合现场讲解，因为我们可以一次只看一根针的结果。“Run N times” 更适合展示统计趋势，因为它会批量运行模拟。“Reset” 则会清空画布和所有计数器，让我们可以马上重新开始。

On the right side is the display area, which uses a canvas to draw the rectangular grid and the dropped needles. This is important because the audience can visually see what “crossing a line” means. Needles that hit at least one grid line are drawn in one color, and needles that do not cross are drawn in another color. So the probability model becomes something visible, not just abstract.

右侧是显示区域，它使用 canvas 来绘制矩形网格和投下的针。这一点很重要，因为观众可以直观地看到“穿过网格线”到底是什么意思。与网格线相交的针会用一种颜色显示，没有相交的针则用另一种颜色显示。这样，概率模型就不再只是抽象概念，而是可以直接观察到的现象。

If I click “Drop One Needle”, the page immediately updates the last result as either hit or miss, and the total trials and total hits also increase. This is useful for explaining one random event step by step.

如果我点击 “Drop One Needle”，页面会立刻把最近一次结果更新为 hit 或 miss，同时总试验次数和命中次数也会增加。这非常适合一步一步解释单次随机试验发生了什么。

If I click “Run N times”, the simulation does not appear all at once. It is animated progressively, so the needles appear on the canvas over multiple frames. At the same time, the statistics below update dynamically. This includes total trials, total hits, empirical probability, theoretical probability, probability error, estimated pi, and pi error.

如果我点击 “Run N times”，模拟结果不会一下子全部出现，而是以渐进动画的方式显示，也就是针会在多个画面更新过程中逐步出现在画布上。与此同时，下方的统计数据也会动态更新，包括总试验次数、命中次数、经验概率、理论概率、概率误差、估计出来的 pi，以及 pi 的误差。

This part is especially useful in presentation, because we can point out that as `N` becomes larger, the empirical probability gradually becomes more stable and gets closer to the theoretical probability. At the same time, the estimated value of pi also tends to improve. So the audience can directly observe the Law of Large Numbers in action.

这一部分特别适合在汇报时演示，因为我们可以指出，随着 `N` 变大，经验概率会逐渐稳定，并且更接近理论概率。与此同时，估计得到的 pi 也会慢慢变得更准确。所以观众可以直接看到大数定律是如何在实验中体现出来的。

Another detail worth mentioning is that the page also gives guidance when the classical formula is not applicable. If the needle length is greater than the smaller grid spacing, the simulation still runs, but the theoretical probability and pi estimation become unavailable. This is educationally meaningful because it reminds users that formulas depend on assumptions, not just computation.

另一个值得一提的细节是，当经典公式不适用时，页面也会给出提示。如果针长大于较小的网格间距，模拟仍然可以继续运行，但是理论概率和 pi 估计就不会显示。这在教学上很有意义，因为它提醒用户，公式的使用是建立在模型假设之上的，而不只是单纯做计算。

So overall, this page is designed as a live experiment platform. It lets us move from a single random drop, to repeated simulation, to probability comparison, and finally to estimating pi. That is why this page is the center of our website demonstration.

所以总体来说，这个页面被设计成一个可以现场操作的实验平台。它让我们能够从单次随机投针，过渡到重复模拟，再到概率比较，最后到 pi 的估计。这也是为什么它是我们整个网页演示的核心。

## theory.html 理论页面

After the demo, we can move to the Theory page. This page explains the background of Buffon’s Needle, the extension to the Buffon-Laplace case, the modelling assumptions, the crossing conditions, and the final probability formula. It also shows how the formula can be rearranged to estimate pi from simulation data.

在演示之后，我们可以切换到 Theory 页面。这个页面解释了 Buffon 投针问题的背景、Buffon-Laplace 情形的推广、建模假设、相交条件，以及最终的概率公式。它也展示了如何把公式变形，用模拟数据来估计 pi。

An important technical point is that the mathematical expressions are rendered locally with KaTeX, so the formulas display clearly even without internet access. This keeps the theory page readable and reliable during an offline presentation.

一个重要的技术点是，这个页面的数学公式通过本地 KaTeX 渲染，因此即使没有网络，公式也能清晰显示。这让理论页面在离线汇报时依然保持良好的可读性和稳定性。

## tbl.html 团队学习页面

Finally, the Team-based Learning page shows how the project work was divided. It explains the different responsibilities across webpage development, theory research, and presentation preparation. It also includes collaboration process, contribution descriptions, learning outcomes, creative elements, and critical reflection.

最后，Team-based Learning 页面展示了我们是如何分工完成这个项目的。它说明了网页开发、理论研究和汇报准备这几部分分别由谁负责。同时，它也包含了团队协作过程、个人贡献、学习收获、创意元素以及项目反思。

This page is useful because it shows that the project is not only technically implemented, but also organised as a complete team-based learning process.

这个页面的价值在于，它表明这个项目不只是技术实现，同时也是一个完整的团队合作与学习过程。

## Technical Highlights + Closing 技术亮点与结尾

From a technical perspective, the website is organised clearly: the four pages share one stylesheet, the simulation logic is separated into its own JavaScript file, and the theory page uses local KaTeX assets for offline math rendering. The layout is also responsive, so the demo section can adapt from a two-column layout to a single-column layout on smaller screens.

从技术实现上看，这个网站的结构比较清晰：四个页面共用同一份样式表，模拟逻辑单独放在 JavaScript 文件中，而理论页面则使用本地 KaTeX 资源来支持离线公式渲染。页面布局也具有响应式设计，所以 Demo 页面在较小屏幕上可以从双栏自动切换为单栏。

To conclude, these webpages help us connect theory with experimentation. The homepage gives structure, the demo page gives direct interaction, the theory page explains the mathematics, and the team page shows the collaboration behind the work. That completes the webpage demonstration section, and I will now pass to the next part of the presentation.

总结来说，这几页网页把理论和实验连接在一起。首页负责整体结构，Demo 页面负责交互体验，Theory 页面负责数学解释，而 Team 页面展示了背后的协作过程。以上就是我们网页演示部分的内容，接下来我将把汇报交给下一位同学。
