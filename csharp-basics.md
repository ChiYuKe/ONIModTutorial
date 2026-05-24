# 🛠️ C# 开发基础（ONI Mod 专用）

在编写《缺氧（Oxygen Not Included, ONI）》Mod 代码之前，你需要掌握一些 **C# 的核心概念**。本篇内容将**专门围绕 ONI Mod 开发中最常见、最实用的语法与结构**展开，避免泛泛而谈。

---

## 📦 一、命名空间与类（Namespace & Class）

《缺氧》的源码规模非常庞大，因此大量使用 **命名空间（namespace）** 来对功能进行划分。你的 Mod 代码也应当遵循这一习惯，以避免冲突、提升可维护性。

### ✅ 开始

::: danger 💡 建议
如果不知道什么是 `空间命名（namespace）` `类名（Class）` `方法名（Method）` 是什么的，在这里你就可以止步了，可以花点时间快速了解一下 `C#` ，这会让你后续的开发事半功倍。
:::

* [C# 杂七杂八](./csharp-basics-reference.md) 
* [Harmony的小整理](./harmony-reference.md)  
* [Harmony官方文档](https://harmony.pardeike.net/articles/patching.html)。

---

---

## 🔧 二、HarmonyPatch：精准定位游戏源码

在《缺氧》Mod 开发中，`[HarmonyPatch]` 属性（Attribute）就像一个**手术定位仪**。它告诉补丁框架：你需要拦截哪个“类”里的哪个“方法”。

### 1. 核心语法：三种定位方式

根据目标方法的复杂程度，你通常会用到以下三种写法：

| 定位类型 | 代码示例 (Attribute) | 适用场景 |
| :--- | :--- | :--- |
| **基础定位** | `[HarmonyPatch(typeof(Db), "Initialize")]` | **最常用**。目标类中只有一个同名方法时使用。 |
| **重载定位** | `[HarmonyPatch(typeof(Assets), "GetSprite", new Type[] { typeof(HashedString) })]` | 当方法有**多个重载**（名字相同但参数不同）时，必须指定参数类型。 |
| **属性定位** | `[HarmonyPatch(typeof(BuildingDef), "IsSolid", MethodType.Getter)]` | 专门用于拦截 C# 的 **属性 (Property)**。需指定是修改 `Getter` 还是 `Setter`。 |

---
### 2. 🔍 实战：如何从 dnSpy 提取 Patch 信息？

当你使用 **dnSpy** 查看游戏源码 `Assembly-CSharp.dll` 时，请按照以下逻辑进行拆解：



* **类名 (Class)**：看代码最顶层的 `public class` 后面跟着的单词。
    * 源码：`public class GeneratedBuildings` 
    * 对应参数：**`typeof(GeneratedBuildings)`**
* **方法名 (Method)**：看括号左边的那个单词。
    * 源码：`public static void LoadGeneratedBuildings(...)`
    * 对应参数：**`"LoadGeneratedBuildings"`**
* **参数类型 (Parameters)**：看括号里面的内容，如果是[重载](./harmony-reference.md#postfix-Overloading)方法则需要提取。
    * 源码：`(ICollection<Type> types)`
    * 对应参数：**`new Type[] { typeof(ICollection<Type>) }`**

---

### 3. 📝 标准代码结构模板

```csharp
using HarmonyLib; // 必须引用 Harmony 库
using UnityEngine; // 如果用到 Debug.Log 或 GameObject

namespace MyOniMod
{
    // 1. 定位：我们要改哪个类的哪个方法？
    [HarmonyPatch(typeof(EntityConfigManager), "LoadGeneratedEntities")]
    public class MyEntityPatch
    {
        // 2. 注入：在原方法执行后（Postfix）做点什么？
        public static void Postfix()
        {
            // 你的逻辑代码
            Debug.Log("ONI Mod: 游戏实体加载完成！");
        }
    }
}
