---
sidebar: false
---

<a href="./csharp-basics#back-point1" style="
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
">
⬅ 返回
</a>

# 🧩 Harmony 补丁整理

> **本篇是 Harmony 在《缺氧（ONI）》Mod 开发中的实战速查表**  
> 👉 目标：**快速了解以及什么时候该用哪一种 Patch**

---

## 📖 阅读指引

- **新手**：只看 `Harmony 初始化 + Prefix / Postfix`
- **中级**：重点 `__instance / __state / AccessTools`
- **进阶**：`Transpiler / Finalizer`

---

## 🧠 一、Harmony 是什么？

Harmony 是一个 **运行时方法注入库**，用于在**不修改源代码**的情况下：

- 插入逻辑
- 拦截原方法
- 修改返回值
- 重写部分执行流程

在 ONI 中：

- ❌ 不能改游戏源码
- ❌ 不能重新编译 Assembly
- ✅ **主要靠 Harmony**
---

## 🧩 二、Patch 类型总览

| Patch 类型 | 执行时机 | 常见用途 |
|----------|----------|----------|
| Prefix | 原方法执行前 | 拦截 / 改参数 / 阻止执行 |
| Postfix | 原方法执行后 | 补充逻辑 / 改返回值 |
| Transpiler | IL 层 | 改硬编码 / if / 常量 |
| Finalizer | 所有逻辑后 | 捕获异常 / 兜底 |

> ⚠️ 所有 Patch 方法 **必须是 static**

---

## ⚙️ 三、Harmony 初始化

> ONI 已帮你处理 `PatchAll`，**不要自己再调**

```csharp
using HarmonyLib;

public class Patch : UserMod2
{
    public override void OnLoad(Harmony harmony)
    {
        base.OnLoad(harmony);
        // Harmony 已由 ONI 自动 PatchAll
    }
}
```

---

## 🟦 四、Prefix（最常用、侵入性最高）

### 4.1 最基础 Prefix

```csharp
[HarmonyPatch(typeof(Operational), nameof(Operational.SetActive))]
public static class Operational_SetActive_Patch
{
    public static void Prefix()
    {
        // 在原方法执行前运行
    }
}
```

📌 **适合**：  
- 监控调用  
- 记录参数  

---

### 4.2 阻止原方法执行（return false）

1.这种写法会直接“斩断”游戏的执行路径。原方法体内的所有代码（包括状态改变、动画切换、音效触发）都不会被执行。

```csharp
[HarmonyPatch(typeof(Operational), nameof(Operational.SetActive))]
public static class Operational_SetActive_Patch
{
    public static bool Prefix(bool value, bool force_ignore)
    {
        // 彻底切断原方法。
        // 效果：无论外界如何调用 SetActive，建筑的状态都会卡在当前这一刻。
        return false; 
    }
}



```
- 现象：建筑状态被“冻结”。即便你手动开关建筑，它也可能毫无反应。
- 风险：由于跳过了原版所有逻辑，可能会导致建筑动画卡死，或者依赖该状态的其他 Mod 出现逻辑错误。


2.下面这个就是：你没有阻止工人干活，但你修改了他的“工作指令”。

```csharp
[HarmonyPatch(typeof(Operational), nameof(Operational.SetActive))]
public static class Operational_SetActive_Patch
{
    public static void Prefix(ref bool value)
    {
        // 强制篡改指令：无论原逻辑想关掉(false)还是开启(true)建筑
        // 经过这一行后，传给原方法的永远是 true
        value = true;
    }
}

```
- 现象：强制常开。即使你没有下达制作任务，或者建筑处于“禁用”状态，它依然会因为接收到了 value = true 的指令而开始消耗电力、播放运行动画。

---

## 🟩 五、Postfix（最安全、最推荐）

### 5.1 基础 Postfix
这段代码的作用是： **当任何发电机（Generator）在地图上生成（或存档加载完成）时，立即强行将其设置为“激活（Active）”状态。**
```csharp
[HarmonyPatch(typeof(Generator), "OnSpawn")]
public static class Generator_OnSpawn_Patch
{
    public static void Postfix(Generator __instance)
    {
        var op = __instance.GetComponent<Operational>();

        if (op != null)
        {
            op.SetActive(true);
        }
    }
}
```

📌 **适合**：  
- 初始化后补逻辑  
- 不破坏原流程  

---

### 5.2 修改返回值（必须 `ref __result`）

```csharp
[HarmonyPatch(typeof(Overheatable), nameof(Overheatable.OverheatTemperature), MethodType.Getter)]
public static class Overheatable_OverheatTemperature_Patch
{
    public static void Postfix(ref float __result)
    {
        __result = 9999f;
    }
}

```
- 实际效果：无论建筑是用什么材料做的，无论它原本的过热温度是多少，现在全图所有建筑都要到 9999 K（约 9725°C）才会过热报废。这在游戏中几乎等同于“永不过热”。

| 枚举项 | 详细描述 | 开发者大白话 |
| :--- | :--- | :--- |
| **Normal** | 拦截**普通方法**。这是默认值。 | 只要目标带括号（如 `SetActive()`），就选它。 |
| **Getter** | 拦截**属性的读取器**（get 块）。 | 当你想改“看到的数值”或“判定结果”时用它。 |
| **Setter** | 拦截**属性的写入器**（set 块）。 | 当你想在“数值被修改”的那一刻搞破坏时用它。 |
| **Constructor** | 拦截类的**构造函数**（对象创建时）。 | 对应 `public ClassName()`。用于对象刚出生时的初始化。 |
| **StaticConstructor** | 拦截**静态构造函数**。 | 对应 `static ClassName()`。用于修改全局静态常量的初始值。 |
| **Enumerator** | 拦截**迭代器方法**。 | 对应使用了 `yield return` 的方法。常用于修改异步或序列逻辑。 |



---

## 🔁 六、Prefix / Postfix 间传值（`__state`）

```csharp
[HarmonyPatch(typeof(Storage), "Store")]
public static class Storage_Store_Patch
{
    public static void Prefix(ref int __state)
    {
        __state = Time.frameCount;
    }

    public static void Postfix(int __state)
    {
        Debug.Log("Store cost frame: " + (Time.frameCount - __state));
    }
}
```

📌 **用途**：  
- 性能统计  
- 前后状态对比  

---

## 🔓 七、访问 private 字段（AccessTools）

```csharp
using System.Reflection;

static readonly FieldInfo CAPACITY =
    AccessTools.Field(typeof(Storage), "capacityKg");

[HarmonyPatch(typeof(Storage), "OnSpawn")]
public static class Storage_OnSpawn_Patch
{
    public static void Postfix(Storage __instance)
    {
        CAPACITY.SetValue(__instance, 9999f);
    }
}
```

📌 **ONI 中极其常用**

---

## 🧬 八、Transpiler（慎用）

```csharp
[HarmonyPatch(typeof(SomeClass), "SomeMethod")]
public static class SomeMethod_Transpiler
{
    public static IEnumerable<CodeInstruction> Transpiler(
        IEnumerable<CodeInstruction> instructions)
    {
        foreach (var ins in instructions)
            yield return ins;
    }
}
```

⚠️ **建议**：  
- 能不用就不用  
- 改错一次可能直接坏档  

---

## 🧯 九、Finalizer（异常兜底）

```csharp
[HarmonyPatch(typeof(SomeClass), "SomeMethod")]
public static class SomeMethod_Finalizer
{
    public static void Finalizer(Exception __exception)
    {
        if (__exception != null)
        {
            Debug.LogError(__exception);
        }
    }
}
```

---

## ⚠️ 十、ONI Mod 常见翻车点

- Patch 方法忘记 `static`
- 参数签名与原方法不一致
- Prefix `return false` 但没处理返回值
- Transpiler 修改逻辑过多

---

## ✅ 总结一句话

> **ONI Mod 的核心不是写逻辑，而是“选对 Patch 类型”**

---

