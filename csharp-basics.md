# 🛠️ C# 开发基础（ONI Mod 专用）

在编写《缺氧（Oxygen Not Included, ONI）》Mod 代码之前，你需要掌握一些 **C# 的核心概念**。本篇内容将**专门围绕 ONI Mod 开发中最常见、最实用的语法与结构**展开，避免泛泛而谈。

---

## 📦 一、命名空间与类（Namespace & Class）

《缺氧》的源码规模非常庞大，因此大量使用 **命名空间（namespace）** 来对功能进行划分。你的 Mod 代码也应当遵循这一习惯，以避免冲突、提升可维护性。

### ✅ 开始

* [C# 开发补充](./csharp-basics-replenish.md)  <span id="back-point"></span>
* [Harmony整理](./harmony-replenish.md)  <span id="back-point1"></span>
* [Harmony文档](https://harmony.pardeike.net/articles/patching.html)。


---

## 🏗️ 二、建筑配置类结构总览

在 ONI 中，每一个建筑通常都对应一个 `XXXConfig` 类，其结构高度固定，通常包含 **三个核心方法**：

```text
CreateBuildingDef()          ← 定义建筑的“物理属性”
ConfigureBuildingTemplate() ← 定义建筑的“功能逻辑”
DoPostConfigureComplete()   ← 后处理（自动化 / 电力 / 状态控制）
```

下面我们以 **电解器（Electrolyzer）** 为例，完整拆解一个标准建筑配置类。

---

## 🧪 三、ElectrolyzerConfig 示例（完整结构）

::: details 🛠️ 点击展开查看 ElectrolyzerConfig.cs 完整源码

```csharp
using System;
using System.Collections.Generic;
using STRINGS;
using TUNING;
using UnityEngine;

// 所有建筑配置类都必须继承 IBuildingConfig 接口
public class ElectrolyzerConfig : IBuildingConfig
{
    // 【第一部分】定义建筑的基础物理属性
    public override BuildingDef CreateBuildingDef()
    {
        string text = "Electrolyzer"; // 内部 ID
        int num = 2; // 宽度（格）
        int num2 = 2; // 高度（格）
        string text2 = "electrolyzer_kanim"; // 使用的动画资源
        int num3 = 30; // 生命值
        float num4 = 30f; // 建造时间（秒）
        float[] tier = TUNING.BUILDINGS.CONSTRUCTION_MASS_KG.TIER3; // 建造消耗量等级
        string[] all_METALS = MATERIALS.ALL_METALS; // 可用材料类型
        float num5 = 800f; // 熔点
        BuildLocationRule buildLocationRule = BuildLocationRule.OnFloor; // 建造位置规则
        EffectorValues tier2 = NOISE_POLLUTION.NOISY.TIER3; // 噪音等级
        
        // 创建基础定义
        BuildingDef buildingDef = BuildingTemplates.CreateBuildingDef(text, num, num2, text2, num3, num4, tier, all_METALS, num5, buildLocationRule, TUNING.BUILDINGS.DECOR.PENALTY.TIER1, tier2, 0.2f);
        
        buildingDef.RequiresPowerInput = true; // 是否需要接电
        buildingDef.EnergyConsumptionWhenActive = 120f; // 运行功耗：120W
        buildingDef.SelfHeatKilowattsWhenActive = 1f; // 运行自发热：1kDTU
        buildingDef.InputConduitType = ConduitType.Liquid; // 管道输入：液体管
        buildingDef.ViewMode = OverlayModes.Oxygen.ID; // 默认显示的概览图
        buildingDef.AudioCategory = "HollowMetal"; // 音效类型
        
        return buildingDef;
    }

    // 【第二部分】配置建筑的具体功能（输入输出逻辑）
    public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag)
    {
        CellOffset cellOffset = new CellOffset(0, 1); // 气体排放点偏移
        go.GetComponent<KPrefabID>().AddTag(RoomConstraints.ConstraintTags.IndustrialMachinery, false); // 添加工业机械标签
        
        // 核心组件：电解器属性
        Electrolyzer electrolyzer = go.AddOrGet<Electrolyzer>();
        electrolyzer.maxMass = 1.8f; // 最大排气压力（超过则停机）
        electrolyzer.hasMeter = true; // 是否显示进度条
        electrolyzer.emissionOffset = cellOffset;

        // 核心组件：液体输入（消耗水）
        ConduitConsumer conduitConsumer = go.AddOrGet<ConduitConsumer>();
        conduitConsumer.conduitType = ConduitType.Liquid;
        conduitConsumer.consumptionRate = 1f; // 每秒消耗 1kg
        conduitConsumer.capacityTag = ElementLoader.FindElementByHash(SimHashes.Water).tag;
        
        // 核心组件：元素转换逻辑 (1kg 水 -> 888g 氧气 + 112g 氢气)
        ElementConverter elementConverter = go.AddOrGet<ElementConverter>();
        elementConverter.consumedElements = new ElementConverter.ConsumedElement[]
        {
            new ElementConverter.ConsumedElement(new Tag("Water"), 1f, true)
        };
        elementConverter.outputElements = new ElementConverter.OutputElement[]
        {
            // 氧气输出设置
            new ElementConverter.OutputElement(0.888f, SimHashes.Oxygen, 343.15f, false, false, (float)cellOffset.x, (float)cellOffset.y, 1f, byte.MaxValue, 0, true),
            // 氢气输出设置
            new ElementConverter.OutputElement(0.11199999f, SimHashes.Hydrogen, 343.15f, false, false, (float)cellOffset.x, (float)cellOffset.y, 1f, byte.MaxValue, 0, true)
        };
    }

    // 【第三部分】后处理配置（自动化控制等）
    public override void DoPostConfigureComplete(GameObject go)
    {
        go.AddOrGet<LogicOperationalController>(); // 添加自动化控制端口
        go.AddOrGetDef<PoweredActiveController.Def>(); // 激活时的电力控制器
    }

    // 常量定义
    public const string ID = "Electrolyzer";
    public const float WATER2OXYGEN_RATIO = 0.888f;
    public const float OXYGEN_TEMPERATURE = 343.15f; // 70摄氏度
}
```

:::

---

## 🧩 四、Harmony 补丁基础结构

ONI Mod **无法直接修改源码**，必须通过 **Harmony** 对原方法进行“拦截（Patch）”。

### 🎯 示例：修改电解器功耗

```csharp
using HarmonyLib;
using UnityEngine;

namespace MyMod
{
    [HarmonyPatch(typeof(ElectrolyzerConfig), "CreateBuildingDef")]
    public class ElectrolyzerConfig_Patch
    {
        // 在原方法执行完后调用
        public static void Postfix(ref BuildingDef __result)
        {
            __result.EnergyConsumptionWhenActive = 1f;
            __result.SelfHeatKilowattsWhenActive = 0f;

            Debug.Log("[MyMod] 电解器已切换为节能模式");
        }
    }
}
```

---

## 📘 五、补丁代码关键点解析

### 1️⃣ 目标定位（Attribute）

```csharp
[HarmonyPatch(typeof(ElectrolyzerConfig), "CreateBuildingDef")]
```

* `typeof(ElectrolyzerConfig)`：目标类
* `CreateBuildingDef`：目标方法名（字符串）

---

### 2️⃣ 特殊参数注入（__result）

```csharp
public static void Postfix(ref BuildingDef __result)
```

* `__result` 代表 **原方法的返回值**
* `ref` 表示你可以 **直接修改游戏中的对象本体**

---

## 🧠 六、进阶：修改产氧量（ConfigureBuildingTemplate）

由于 **产物比例定义在 `ConfigureBuildingTemplate` 中**，补丁方式略有不同：

```csharp
[HarmonyPatch(typeof(ElectrolyzerConfig), "ConfigureBuildingTemplate")]
public class Electrolyzer_OutputPatch
{
    public static void Postfix(GameObject go)
    {
        ElementConverter converter = go.AddOrGet<ElementConverter>();

        converter.outputElements = new[]
        {
            new ElementConverter.OutputElement(
                0.888f, SimHashes.Oxygen, 343.15f,
                false, false, 0f, 1f,
                1f, byte.MaxValue, 0, true
            ),
            new ElementConverter.OutputElement(
                1f, SimHashes.Hydrogen, 343.15f,
                false, false, 0f, 1f,
                1f, byte.MaxValue, 0, true
            )
        };
    }
}
```

---