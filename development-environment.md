# 🛠️ 开发环境搭建

在编写代码之前，我们需要准备好开发工具，并配置针对《缺氧》的自动编译环境。

---
## 软件准备清单

你需要安装以下工具。请确保它们已正确安装：

| 工具 | 作用 | 下载链接 | 推荐版本 |
| :--- | :--- | :--- | :--- |
| **Visual Studio 2026** | 核心开发 IDE | [官方下载地址](https://visualstudio.microsoft.com/zh-hans/vs/community/) | 社区版 (Community) | 
| **dnSpy** | 逆向源码 / 找代码 | [GitHub 下载页](https://github.com/dnSpy/dnSpy/releases) | 最新版 (win64) |

---

### ⚠️ 核心注意事项

> **💡 关键点：关于 .NET 版本**
> 《缺氧》官方现在把 [**.NET Standard 2.1**](https://learn.microsoft.com/zh-cn/dotnet/standard/net-standard) 视为模组开发的更佳起点；与此同时，游戏本体仍保留 Unity 的 **.NET Framework API Compatibility Target** 作为兼容层。
>
> * **如果不选这个版本**：你的 Mod 在加载时也许会报错，或者更容易遇到引用和兼容性问题。
> * **VS 安装提示**：在安装 Visual Studio Installer 时，请务必勾选 **“.NET 桌面开发”** 工作负荷，并确保已安装用于 **.NET Standard 2.1** 的相关开发组件。
> * [图文安装教程](./visual-studio-installation.md) <span id="back-point"></span>|
