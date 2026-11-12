---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/App.css","src/index.css"]
---

# 干员图录首页

Mode: Operate. Target: `src/App.tsx`.

桌面为主，兼顾手机。Ban 设置置顶，名单以高密度头像网格呈现。用户后续要求规则只依据 PRTS；教程未明确的交叉情况显示「待核实」，不归入可用或已 Ban。用户选择了 catalog 草图，` .impeccable/mocks/decision/catalog.html` 是构图参考；图录世界参考位于 `.impeccable/references/`。不引入海报大标题、纹理、地图或虚构数据。

## Direction contract

THESIS: 一眼查看盟约禁用对整份干员图录的影响，不做侧栏仪表盘或大幅营销头图。

OWN-WORLD: 浅灰绿纸白底、近黑文字、橄榄绿选择状态、暗红禁用状态。中文系统无衬线，细实线、微圆角、紧凑头像格，使用真实本地头像。

STORY: 玩家先点击顶部主／副盟约设置 Ban，然后按等级、盟约和可用状态缩小名单，直接读取禁用原因。

FIRST VIEWPORT: 顶部紧凑站名和来源链接；其下横向 Ban 工作区，主副盟约各占一行；干员标题、状态数量和筛选工具条在网格上方。1440px 桌面八列左右，390px 手机三列。签名交互是 Ban 时干员原位变为灰度图像加明确文字状态，位置稳定便于比较；减少动态偏好关闭过渡。

FORM: 同人展高密度图录，只借类型、密度、配色与原位标记，不借物理展厅导航。用户从七个本土方向及候选中选择 catalog challenger；source pop-culture-shelf-doujin-event-catalog；seed:4f40541206b10564。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
