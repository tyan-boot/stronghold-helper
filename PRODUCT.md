# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

卫戍协议玩家，游戏时在旁边设置盟约 Ban 并查看可用干员。桌面为主，兼顾手机。

## Product Purpose

用明确的盟约禁用规则即时计算干员可用状态，支持按 I–VI 阶等级、盟约和可用状态查看名单。

## Capabilities and Constraints

- Ban 以 PRTS「卫戍协议·规程／战场一览」入门教程为准；用户最初的规则只是推测，已撤回。
- PRTS 说明核心盟约置灰时所属干员不进入调度中心；附加盟约全部置灰时相关干员不进入调度中心。
- 用户确认：多个核心盟约一禁一留、核心可用但附加全部禁用这两类情况均可用，不会被 Ban；仅保留「可用」和「已 Ban」两种状态。
- 有核心盟约的干员，仅全部核心被禁时判为已 Ban；没有核心的干员，仅全部附加盟约被禁时判为已 Ban。
- 等级、核心／附加盟约分类遵循 PRTS；已确认现有 25 个盟约均参与 Ban：10 个核心、15 个附加，包括调和、协防干员。不另设特殊盟约。
- 保留 React、TypeScript、Vite 技术栈；以现有本地名单和图片为基础。
- 页面中文，桌面同时显示 Ban 设置与结果，手机纵向排列。

## Evidence on Hand

`src/data/stronghold.json` 保存 143 名干员、25 个盟约、等级、分类、图片路径和 PRTS 来源，由原 `public/data/stronghold.json` 补齐元数据并迁入源码以静态加载。`public/images/` 保留现有头像和盟约图标。

## Product Principles

- 判定可解释：看得见被禁原因，不只依赖颜色。
- Ban 与筛选互不混淆；筛选不会修改 Ban 设置。
- 不编造干员数据，不把普通星级当成卫戍协议等阶。
