# ONIModTutorial

这是一个 **《缺氧（Oxygen Not Included）》Mod 开发教程仓库** 📘  
用于系统性整理和分享 ONI Mod 制作相关的知识、经验和实战示例，适合 **从入门到进阶** 的学习者。

本仓库以 **Markdown 文档** 为核心，可直接在 GitHub 阅读，也可配合 **VitePress** 构建成静态教程网站。

---

## 🎯 仓库目标

- 帮助新人快速入门 ONI Mod 开发
- 系统整理缺氧 Mod 常用技术与思路
- 记录 Harmony 补丁、反编译、组件分析等实战经验
- 作为长期维护的知识库，而不是零散笔记

---

## 📚 教程内容概览

教程内容主要包括（并持续补充中）：

- 缺氧 Mod 开发基础认知
- 开发环境搭建
- Mod 基本结构与加载流程
- C# 基础（面向 ONI Mod）
- Harmony 补丁详解与实战
- dnSpy / 反编译分析游戏源码
- 常见系统解析（建筑、复制人、植物、逻辑、UI 等）
- 实用代码示例与踩坑记录

---

## 📁 仓库结构说明

- content/  
  教程正文内容，所有章节均以 `.md` 文件形式存在  
  - intro.md —— 教程简介  
  - csharp-basics.md —— C# 基础（ONI Mod 向）  
  - harmony-replenish.md —— Harmony 补丁整理与示例  
  - 其他章节持续增加中…

- .github/workflows/  
  GitHub Actions 配置（如自动构建文档）

- vitepress/  
  VitePress 文档站点配置

- public/  
  文档站点用到的静态资源

---

## 🚀 使用方式

### 直接阅读（推荐）
- 直接在 GitHub 中按顺序阅读 `content` 目录下的 Markdown 文件即可

### 本地运行文档站点（可选）

1. 克隆仓库  
   git clone https://github.com/ChiYuKe/ONIModTutorial.git

2. 安装依赖  
   npm install

3. 启动本地文档  
   npm run dev

4. 浏览器访问终端提示的本地地址

---

## 🧠 适合人群

✔ 想制作《缺氧》Mod 的玩家  
✔ 有一定 C# 基础，想深入理解 ONI 内部逻辑  
✔ 希望系统学习 Harmony Patch 的开发者  
✔ 已在做 Mod，但想补齐底层理解的人  

---

## 🤝 贡献说明

欢迎任何形式的贡献，包括但不限于：

- 修正教程错误
- 补充新的章节
- 提供实战案例
- 优化结构和表述

你可以通过 **Issue** 或 **Pull Request** 提交改动。

---


