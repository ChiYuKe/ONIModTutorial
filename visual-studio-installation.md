---
sidebar: false
---
<a href="./development-environment#back-point" style="
  position: fixed;
  left: 20px;
  top: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--vp-c-brand);
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  z-index: 100;
" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
  <span style="font-size: 1.2em;">返回</span> 
</a>

# 🛠️ Visual Studio 安装细节

在安装过程中，正确的勾选决定了你是否能顺利编译 Mod。请参考以下图解进行配置：

### 1. 选择工作负荷 (Workloads)
首先，你需要告诉 VS 你要进行桌面程序开发。

<div align="center">
  <img src="/images/VSInstallation-details/VSInstall.png" alt="安装" width="600" />
</div>

> **操作：** 勾选 **“.NET 桌面开发”**。这是开发 C# 插件最基础的环境，包含了编译器和必要的库。

---

### 2. 精确勾选组件 (Individual Components)
这是最关键的一步，很多新手会因为少勾选组件而无法创建合适的项目模板。

<div align="center">
  <img src="/images/VSInstallation-details/VSInstall_.png" alt="选择组件" width="600" />
</div>

**必须确保以下项已勾选：**
* **.NET 桌面开发相关组件**：用于编写针对《缺氧》的代码。
* **.NET Standard 2.1 相关开发支持**：提供项目模板和程序集引用支持。

---

### 3. 完成安装
确认右下角的安装位置有足够的空间（通常需要几 GB），点击 **“修改”** 或 **“安装”**。安装完成后，建议重启电脑以确保环境变量生效。

::: tip 下一步
安装完成后，你可以回到 [开发环境搭建](./development-environment#back-point) 继续学习如何创建你的第一个 Mod 项目。
:::
