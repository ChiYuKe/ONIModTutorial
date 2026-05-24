# 🚀 编写第一个 物品

本章将带你亲手编写一个物品或者说掉落物。

---

## 一 . 准备工作

在开始之前，你需要手动创建一个文件夹，用于存放你开发的 Mod 文件：
* **路径**：`%USERPROFILE%\Documents\Klei\OxygenNotIncluded\mods\`
* **操作**：在此目录下创建一个名为 **`Dev`** 的文件夹。

---

## 二 . 创建项目

1.  打开 **Visual Studio 2022**。
2.  选择 **创建新项目** -> 搜索 **类库**（建议选择支持 **.NET Standard 2.1** 的类库模板）-> 点击下一步。
3.  **项目名称**：输入 `MyFirstItem`。
4.  **目标框架**：务必选择 **.NET Standard 2.1**。

---

## 三 . 导入游戏核心库 (References)

你需要把游戏的 `.dll` 文件“介绍”给 Visual Studio，它才能理解游戏代码。

1.  在右侧 **解决方案资源管理器** 中，当然你的可能在左侧，右键点击 **引用 (References)** -> **添加引用**。
2.  点击 **浏览**，进入游戏目录：  
    `...\steamapps\common\OxygenNotIncluded\OxygenNotIncluded_Data\Managed\`
3.  **选中并添加以下文件：**
    * `Assembly-CSharp.dll` 
    * `Assembly-CSharp-firstpass.dll` 
    * `0Harmony.dll` 
    * `UnityEngine.dll`
    * `UnityEngine.CoreModule.dll`

---


## 四 . 编写代码

在我们的工程中，创建如下 `.cs` 文件结构：

``` 文件结构

MyFirstItem/
├── Patch.cs              # Harmony补丁入口文件，用来在游戏加载时注册你的Mod逻辑
├── MyFirstItemConfig.cs  # 物品的定义文件（ID、动画、属性等核心配置）
├── STRINGS.cs            # 本地化文本（名称、描述、效果说明）
└── MyFirstItem.cs        # 自定义组件逻辑（功能代码实现）

```

---

### MyFirstItemConfig.cs 的处理

我们需要先继承 `IEntityConfig`。

在 Oxygen Not Included 中：

> `IEntityConfig` 是用来“定义一个实体”的接口。

简单说：

> 它告诉游戏：我要注册一个新的实体，请按这些规则创建它。

---

### 基础结构

```csharp
using System.Collections.Generic;
using UnityEngine;

namespace ONIModTutorialCode
{
    public class MyFirstItemConfig : IEntityConfig
    {
        public GameObject CreatePrefab()
        {

        }

        public void OnPrefabInit(GameObject inst)
        {
            // 预制体初始化时调用
        }

        public void OnSpawn(GameObject inst)
        {
            // 实例生成时调用（生成到地图上才会触发）
        }

        public string[] GetDlcIds()
        {
            return null; // 所有 DLC 可用
        }
    }
}
```

---

### 实现 CreatePrefab()

在 `CreatePrefab()` 中，我们使用 `EntityTemplates.CreateLooseEntity()` 来注册它。

这里的动画资源我们使用仙水掌的 `cactus_kanim` 中的 `idle_empty` 状态。

常规掉落物通常使用 `"object"`。

（这里为什么是 `idle_empty` 而不是 `object`，我们会在后面说明。）

---

### 完整代码（可直接复制）

```csharp
using System.Collections.Generic;
using UnityEngine;

namespace ONIModTutorialCode
{
    public class MyFirstItemConfig : IEntityConfig
    {
        // 物品ID
        public const string ID = "MYFIRSTITEM";

        public GameObject CreatePrefab()
        {
            GameObject gameObject = EntityTemplates.CreateLooseEntity(
                ID,
                STRINGS.ITEMS.MYFIRSTITEM.NAME,
                STRINGS.ITEMS.MYFIRSTITEM.DESC,
                5f,
                true,
                Assets.GetAnim("cactus_kanim"),
                "idle_empty",
                Grid.SceneLayer.SolidConduits,
                EntityTemplates.CollisionShape.RECTANGLE,
                0.6f,
                0.6f,
                true,
                0,
                SimHashes.Creature,
                new List<Tag> { GameTags.IndustrialIngredient }
            );

            return gameObject;
        }

        public void OnPrefabInit(GameObject inst)
        {
            // 预制体初始化时调用
        }

        public void OnSpawn(GameObject inst)
        {
            // 实例生成时调用
        }

        public string[] GetDlcIds()
        {
            return null;
        }
    }
}
```
---

> 🚧 **To Be Continued...**
>
> 先写一点，有点累了，睡一觉
