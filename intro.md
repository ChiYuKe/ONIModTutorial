# 🚀 开发引言 (Preface)

这份文档旨在为 **《缺氧》**（*Oxygen Not Included*）的 Mod 开发者提供一份系统化的技术指南。 

::: info 编写初衷
在尝试通过 Mod 扩展游戏玩法的过程中，会遇到许多问题，也会解决一些问题。本项目建立的初衷是：**整理并记录开发过程中的新发现**，让后来的开发者~~少走弯路~~。
:::

### 🛠️ 文档核心价值
| 特性 | 描述 |
| :--- | :--- |
| **源码参考** |内容主要参考当前版本的 `Assembly-CSharp.dll` 逆向结果，尽量确保时效性。 |
| **侧重实践** |分享我寻找 **Hook 点** 或修改 **Prefab** 时的思路，希望能提供一些实操参考。 |
| **尝试同步** | 由于游戏仍在更新，我会尽力在业余时间同步那些影响较大的逻辑变动。 |

### 🗺️ 学习路线图

1.  <Badge type="tip" text="STEP 1" /> **环境准备**
    * 介绍我常用的反编译与开发工具配置。。
2.  <Badge type="warning" text="STEP 2" /> **基础机制**
    * 探讨 Harmony 补丁的使用以及对游戏对象结构的理解。
3.  <Badge type="danger" text="STEP 3" /> **进阶尝试**
    * 记录从属性修改到实体注入的一些实验性过程。
---

::: danger 💡 学习建议
**Mod 开发需要一定的 C# 基础。** 如果你是完全的编程新手，建议先花点时间了解 C# 的基本语法（变量、类、继承、Lambda 表达式），这会让你后续的开发事半功倍。
:::

---

<div align="center">
  <p>从零开始，在代码中构建属于你的宇宙。</p>
  <a href="setup">
    <button style="background: var(--vp-c-brand-1); color: white; padding: 10px 24px; border-radius: 20px; font-weight: bold; cursor: pointer; border: none;">
      配置开发环境 →
    </button>
  </a>
</div>