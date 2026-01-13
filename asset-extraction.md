# 🎨 游戏资产提取 (Asset Extraction)

在进行《缺氧》（Oxygen Not Included）的 Mod 开发时，获取原版资产（贴图、动画、文本）是进行二次创作和保持视觉一致性的基础。本章将详细介绍开发者常用的资产解包与处理工具。

## 1. 资源解包核心：AssetRipper

**AssetRipper** 是目前处理 Unity 引擎资源最强大的开源工具之一。它不仅能提取静态贴图，还能在一定程度上还原 Unity 项目的资源目录结构。

* **[📥 官方仓库 (GitHub Releases)](https://github.com/AssetRipper/AssetRipper/releases)**
* **适用范围**：UI 图标（Sprite）、建筑贴图（Texture2D）、音频文件（AudioClip）... 。

### 🛠️ 提取指南
1.  **准备环境**：定位至游戏的资源目录，通常为 `.../OxygenNotIncluded/OxygenNotIncluded_Data`。
2.  **载入资源**：运行 AssetRipper，将上述 `_Data` 文件夹整体拖入程序界面。
3.  **资源导出**：在视图中，通过 `Export`导出全部资源。
<Badge type="danger" text="注意" /> 不要导出成了Unity项目

---

## 2. 动画系统处理：KAnim 协议

《缺氧》的动态表现基于 Klei 自定义的 **KAnim** 系统，而非 Unity 原生动画。每个动画对象由三个核心文件组成：`图集(*_0.png)`、`结构(*_build.bytes)` 和 `序列(*_anim.bytes)`。

### 🛠️ 推荐转换工具

::: tip 🚀 推荐：KAnim_GUI (可视化操作)
对于大多数开发者，**KAnim_GUI** 提供了极简的图形化界面，支持一键解压和重组 KAnim，极大地降低了命令行操作的门槛。需要将 kanimal-SE(kanimal-cli.exe) 放入KAnim_GUI(KAnimGui.exe)同目录下才能正常工作
* **[📥 官方仓库 (KAnim_GUI)](https://github.com/ChiYuKe/KAnim_GUI)**

:::

#### 进阶工具：kanimal-SE (底层转换)
**kanimal-SE** 是处理 KAnim 的标准工具，支持将字节流转换为可编辑的 SCML 格式。
* **[📥 官方仓库 (kanimal-SE)](https://github.com/skairunner/kanimal-SE)**

::: code-group
```powershell [Windows (PowerShell)]
# 解包：将 KAnim 转换为可编辑的 SCML (用于 Spriter 编辑)
.\kanimal-cli.exe scml [file_name].png [file_name]_anim.bytes [file_name]_build.bytes

# 打包：将修改后的 SCML 重新编译为游戏可读的 KAnim
.\kanimal-cli.exe kanim [file_name].scml

:::
---

## 3. 国际化与文本处理 (Localization)

无论是寻找建筑的 `PrefabID`，还是为 Mod 增加多语言支持，都需要处理 `.po` 格式的翻译文件。

### 🔍 文本利器：Poedit
* **[📥 官方下载 (Poedit 官网)](https://poedit.net/)**

::: info 实战技巧
* **快速溯源**：使用 `Ctrl + F` 搜索游戏内的中文词条（如“电解器”），即可快速定位其对应的 `StringKey`（例如：`STRINGS.BUILDINGS.PREFABS.ELECTROLYZER.NAME`）。
* **规范化翻译**：使用 Poedit 维护你的 `zh.po` 文件，可以确保翻译格式完全符合 Klei 的底层加载规范，避免乱码。
:::

---

## ⚠️ 开发准则与约束

::: danger 法律声明：严禁商业用途
所有提取自《缺氧》的游戏资产（包括但不限于原画、音效、动画脚本、底层代码）所有权均归 **Klei Entertainment** 所有，严禁用于任何形式的商业盈利行为。
:::

::: warning 尊重版权
* **禁止二次分发**：请勿在公开平台分发未经大幅修改的官方原始资源包。
* **致谢声明**：若你的作品基于官方素材修改，请在说明文档中按照惯例标注 `"Credit to Klei Entertainment"`。
:::

---

<div align="center" style="margin-top: 3rem; padding: 2rem; border-top: 1px solid var(--vp-c-divider);">
  <p style="font-size: 1.1rem; font-style: italic; color: var(--vp-c-text-2); margin-bottom: 1.5rem;">
    “逻辑是生存的第一步，而代码是改写规则的起点。”
  </p>
    <a href="dnspy-guide">
    <button style="background: var(--vp-c-brand-1); color: white; padding: 10px 24px; border-radius: 20px; font-weight: bold; cursor: pointer; border: none;">
     游戏源码工具 →
    </button>
  </a>

</div>